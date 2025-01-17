# docker 安装


## 博客

### win 安装

https://blog.csdn.net/QQ1817117243/article/details/139879440





### win 安装docker 安装redis mysql nacos


https://blog.csdn.net/mst_sun/article/details/135087651?utm_medium=distribute.pc_relevant.none-task-blog-2~default~baidujs_baidulandingword~default-5-135087651-blog-139879440.235^v43^pc_blog_bottom_relevance_base6&spm=1001.2101.3001.4242.4&utm_relevant_index=8





## 安装


参考博客：

https://blog.csdn.net/QQ1817117243/article/details/139879440



### 安装wsl

wsl --install

### 

下载 win 安装文件

![](assets/000/01/02/13/03/01-1736679265738.png)

需要记得 win启动 关闭程序中打开 hyper-v 因为wsl 也需要依赖hyper-v




```
报错信息 "没有找到容器" 通常意味着 Windows Subsystem for Linux (WSL) 未能找到指定的发行版（在这个例子中是 Ubuntu）。这可能是因为以下原因：

WSL 未在 Windows 上启用。

Ubuntu 尚未安装。

你可能在命令中使用了错误的发行版名称。

解决方法：

确保 Windows 功能中已启用 WSL。可以通过控制面板或使用 PowerShell 命令 Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux 来启用。

如果 WSL 已启用但仍出现错误，请确保已安装 Ubuntu。可以通过 Microsoft Store 安装。

如果你确认 Ubuntu 已安装，请确保你使用的是正确的发行版名称。可以通过运行 wsl --list --verbose 来查看所有已安装的发行版和它们的状态。

如果以上步骤都无法解决问题，可能需要重置 WSL 或重新安装 Ubuntu。可以使用 wsl --unregister Ubuntu 来注销 Ubuntu 发行版，然后从 Microsoft Store 重新安装。

如果你在执行上述步骤后仍然遇到问题，可能需要检查系统的详细错误日志或联系 Microsoft 支持以获取更多帮助。
```


