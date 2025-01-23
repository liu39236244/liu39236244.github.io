// player.js

// 静态目录中的歌曲列表
const songs = [
    // { name: "歌曲1", file: "https://example.com/static/audio/song1.mp3" }, // 绝对路径
    { name: "犬夜叉.mp3", file: "./audio/bgAudio/犬夜叉.mp3" }, // 相对路径（注释）
    // { name: "歌曲2", file: "https://example.com/static/audio/song2.mp3" },
    { name: "盗将行.mp3", file: "./audio/bgAudio/盗将行.mp3" },
  ];
  
  const audioPlayer = document.getElementById('audio-player');
  const playPauseBtn = document.getElementById('play-pause-btn');
  const currentSong = document.getElementById('current-song');
  const songList = document.getElementById('song-list');
  const toggleList = document.getElementById('toggle-list');
  

//   自动播放变量
  const autoplayToggle = document.getElementById('autoplay-toggle');
const autoplaySongSelect = document.getElementById('autoplay-song');
  let isPlaying = false;
  
  // 初始化歌曲列表
  function loadSongs() {
    songs.forEach((song, index) => {
      const li = document.createElement('li');
      li.textContent = song.name;
      li.dataset.file = song.file;
      li.addEventListener('click', () => {
        playSong(song.file, song.name);
      });
      songList.appendChild(li);
    });
  }
  
  // 播放歌曲
  function playSong(file, name) {
    audioPlayer.src = file;
    audioPlayer.play();
    isPlaying = true;
    playPauseBtn.src = "./images/暂停.jpg"; // 绝对路径
    // playPauseBtn.src = "./images/pause.png"; // 相对路径（注释）
    currentSong.textContent = name;
  }
  
  // 播放/暂停按钮点击事件
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      //playPauseBtn.src = "https://example.com/static/images/play.png"; // 绝对路径
      playPauseBtn.src = "./images/播放.jpg"; // 相对路径（注释）
    } else {
      audioPlayer.play();
      isPlaying = true;
    //   playPauseBtn.src = "https://example.com/static/images/pause.png"; // 绝对路径
      playPauseBtn.src = "./images/暂停.jpg"; // 相对路径（注释）
    }
  });
  
  // 显示/隐藏歌曲列表
  toggleList.addEventListener('click', () => {
    if (songList.style.display === 'none') {
      songList.style.display = 'block';
      toggleList.textContent = '隐藏歌曲列表';
    } else {
      songList.style.display = 'none';
      toggleList.textContent = '显示歌曲列表';
    }
  });

  // 自动播放功能
autoplayToggle.addEventListener('change', () => {
    if (autoplayToggle.checked) {
      const selectedSong = autoplaySongSelect.value;
      if (selectedSong) {
        playSong(selectedSong, autoplaySongSelect.options[autoplaySongSelect.selectedIndex].text);
      }
    }
  });
  
  // 页面加载时初始化
  loadSongs();
  




  