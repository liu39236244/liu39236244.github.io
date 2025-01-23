const links = document.querySelectorAll('.dynamic-link');
const historyButton = document.getElementById('history-button');
const historyDropdown = document.getElementById('history-dropdown');
const allowMultipleCheckbox = document.getElementById('allow-multiple-iframes');
const centerIframeCheckbox = document.getElementById('center-iframes');
let historyLinks = [];

// 切换历史链接下拉菜单的显示
historyButton.addEventListener('click', (event) => {
  event.stopPropagation();
  historyDropdown.style.display = historyDropdown.style.display === 'block' ? 'none' : 'block';
});

// 在文档上单击后隐藏下拉菜单
document.addEventListener('click', (event) => {
  if (!historyDropdown.contains(event.target)) {
    historyDropdown.style.display = 'none';
  }
});

// 点击链接的处理逻辑
links.forEach(link => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const url = link.href;
    const name = link.textContent.trim();

    // 打开新标签页
    window.open(url, '_blank');

    // 记录到历史链接
    addToHistory(name, url);

    // 展示新的 iframe
    createIframe(url, name);
  });
});

// 添加链接进入历史记录
function addToHistory(name, url) {
  const existingHistoryItem = Array.from(historyDropdown.querySelectorAll('a')).find(link => link.dataset.url === url);

  if (existingHistoryItem) return;

  let count = historyLinks.filter(link => link.url === url).length + 1;
  let displayName = `${name} ${count}`;

  historyLinks.push({ name: displayName, url });

  const a = document.createElement('a');
  a.href = '#';
  a.textContent = displayName;
  a.dataset.url = url;

  const deleteButton = document.createElement('span');
  deleteButton.textContent = '删除';
  deleteButton.classList.add('delete-history');
  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    deleteHistory(url);
  });

  // 添加控制单独展示的复选框
  const singleShowCheckbox = document.createElement('input');
  singleShowCheckbox.type = 'checkbox';
  singleShowCheckbox.classList.add('single-show-checkbox');

  singleShowCheckbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      showIframe(url);
    } else {
      hideIframe(url);
    }
  });

  const checkboxLabel = document.createElement('label');
  checkboxLabel.appendChild(singleShowCheckbox);
  checkboxLabel.appendChild(document.createTextNode('展示'));

  a.appendChild(checkboxLabel);
  a.appendChild(deleteButton);
  historyDropdown.appendChild(a);
}

// 删除历史记录及其对应的iframe
function deleteHistory(url) {
  historyLinks = historyLinks.filter(link => link.url !== url);
  const historyItems = historyDropdown.querySelectorAll('a');
  historyItems.forEach(item => {
    if (item.dataset.url === url) {
      item.remove();
    }
  });

  const iframes = document.querySelectorAll('.iframe-wrapper');
  iframes.forEach(iframe => {
    if (iframe.querySelector('iframe').src === url) {
      iframe.remove();
    }
  });
}

// 创建并显示新的 iframe
function createIframe(url, name) {
  if (!allowMultipleCheckbox.checked) {
    const existingIframes = document.querySelectorAll('.iframe-wrapper');
    existingIframes.forEach(iframe => iframe.remove());
  }

  const iframeWrapper = document.createElement('div');
  iframeWrapper.classList.add('iframe-wrapper');

  const dragBar = document.createElement('div');
  dragBar.classList.add('iframe-drag-bar');
  dragBar.textContent = name;

  const closeButton = document.createElement('span');
  closeButton.textContent = 'X';
  closeButton.classList.add('iframe-close');
  closeButton.addEventListener('click', () => {
    deleteIframe(iframeWrapper);
  });

  const iframe = document.createElement('iframe');
  iframe.src = url;

  const resizeHandle = document.createElement('div');
  resizeHandle.classList.add('iframe-resize-handle');

  dragBar.appendChild(closeButton);
  iframeWrapper.appendChild(dragBar);
  iframeWrapper.appendChild(iframe);
  iframeWrapper.appendChild(resizeHandle);

  document.body.appendChild(iframeWrapper);

  if (centerIframeCheckbox.checked || !allowMultipleCheckbox.checked) {
    centerElement(iframeWrapper);
  }

  makeDraggable(iframeWrapper, dragBar);
  makeResizable(iframeWrapper, resizeHandle);
}

// 删除特定iframe
function deleteIframe(iframeWrapper) {
  const url = iframeWrapper.querySelector('iframe').src;
  deleteHistory(url);
}

// 按 url 显示特定链接的 iframe
function showIframe(url) {
  document.querySelectorAll('.iframe-wrapper').forEach(wrapper => {
    const iframe = wrapper.querySelector('iframe');
    wrapper.style.display = (iframe.src === url || allowMultipleCheckbox.checked) ? 'flex' : 'none';
  });
}

function hideIframe(url) {
  document.querySelectorAll('.iframe-wrapper').forEach(wrapper => {
    const iframe = wrapper.querySelector('iframe');
    if (iframe.src === url) {
      wrapper.style.display = 'none';
    }
  });
}

// 居中元素
function centerElement(element) {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const rect = element.getBoundingClientRect();
  element.style.left = `${(viewportWidth - rect.width) / 2}px`;
  element.style.top = `${(viewportHeight - rect.height) / 2}px`;
}

// 拖动效果优化
function makeDraggable(element, handle) {
  let startX, startY, startLeft, startTop, isDragging = false;

  handle.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
    startLeft = element.offsetLeft;
    startTop = element.offsetTop;
    document.body.style.cursor = 'grabbing';
    element.style.opacity = '0.7'; // 设置为略透明以提升视觉效果

    const onMouseMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        element.style.left = `${startLeft + deltaX}px`;
        element.style.top = `${startTop + deltaY}px`;

        // 更新位置的同时，尝试限制到边界
        const maxLeft = window.innerWidth - element.offsetWidth;
        const maxTop = window.innerHeight - element.offsetHeight;

        if (parseInt(element.style.left) < 0) {
          element.style.left = '0px';
        } else if (parseInt(element.style.left) > maxLeft) {
          element.style.left = `${maxLeft}px`;
        }

        if (parseInt(element.style.top) < 0) {
          element.style.top = '0px';
        } else if (parseInt(element.style.top) > maxTop) {
          element.style.top = `${maxTop}px`;
        }
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      document.body.style.cursor = 'default';
      element.style.opacity = '1'; // 恢复正常透明度
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

// 添加调整大小功能
function makeResizable(element, handle) {
  let startX, startY, startWidth, startHeight;

  handle.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

    const resize = (e) => {
      element.style.width = `${startWidth + e.clientX - startX}px`;
      element.style.height = `${startHeight + e.clientY - startY}px`;

      // 更新大小限制，防止小于一定值
      if (parseInt(element.style.width) < 200) {
        element.style.width = '200px';
      }

      if (parseInt(element.style.height) < 150) {
        element.style.height = '150px';
      }
    };

    const stopResize = () => {
      document.documentElement.removeEventListener('mousemove', resize);
      document.documentElement.removeEventListener('mouseup', stopResize);
    };

    document.documentElement.addEventListener('mousemove', resize);
    document.documentElement.addEventListener('mouseup', stopResize);
    e.preventDefault();
  });
}