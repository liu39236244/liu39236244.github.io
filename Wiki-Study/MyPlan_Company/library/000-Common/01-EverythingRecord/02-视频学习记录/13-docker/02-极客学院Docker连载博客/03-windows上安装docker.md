# windows上安装docker

极客教程地址: https://www.javajike.com/article/1177.html


虽然早期的 Docker 不支持 Windows，但是最新的版本都可以使用 Docker ToolBox

Docker 引擎使用的是 Linux 内核特性，所以需要在 Windows 上使用一个轻量级的虚拟机 (VM) 来运行 Docker

Windows 上安装 Docker 有两种方式

1、 如果你的电脑是 Window 10 且是专业版，那么可以使用官方的 Docker for Windows

官网地址为: https://www.docker.com/docker-windows

安装包下载地址为: https://store.docker.com/editions/community/docker-ce-desktop-windows
2、 如果是 Window 10 家庭版及以下版本，则可以使用 Docker ToolBox

官网地址为: https://docs.docker.com/toolbox/toolbox_install_windows/

下载地址为: https://download.docker.com/win/stable/DockerToolbox.exe

阿里云提供了镜像地址: http://mirrors.aliyun.com/docker-toolbox/windows/docker-toolbox/

Window 10 专业版安装 Docker
Window 10 上安装 Docker ，我们推荐使用 Docker for Windows

1、 点击下载 CE 版本的 Docker for Windows

可以访问 https://store.docker.com/editions/community/docker-ce-desktop-windows 页面，然后在页面的右侧有一个按钮 Please Login To Download

![](assets/000/01/02/13/02/03-1639709268223.png)


如果你不想注册，可以直接点击 https://download.docker.com/win/stable/Docker%20for%20Windows%20Installer.exe 来下载


![](assets/000/01/02/13/02/03-1639709295571.png)


3、 安装成功后，Docker 并不会立即启动，所以需要我们手动启动一下

在搜索栏输入 Docker 然后选择 Docker for Windows 并回车，会打开如下界面

![](assets/000/01/02/13/02/03-1639709329331.png)


4、 经过一段时间后，会在右下角的通知看到 docker 的小图标

![](assets/000/01/02/13/02/03-1639709365567.png)

5、 点击小图标，就会弹出一序列想到，告诉我们怎么设置 docker



# Window 10 家庭版、 Win 8 、Win7 安装 ToolBox
一般情况下，我们的电脑安装的都是 Window 10 的家庭版，所以只能使用 Docker ToolBox

如果你的电脑是 WIN8
那么需要按下 CTRL+ALT+DELETE 键，打开任务管理器，然后切换到 性能 栏，看看是否已经启用 虚拟化

![](assets/000/01/02/13/02/03-1639710129048.png)

我们从阿里云的镜像地址下载 http://mirrors.aliyun.com/docker-toolbox/windows/docker-toolbox/


![](assets/000/01/02/13/02/03-1639710152693.png)

2、 双击下载成功的 DockerToolbox-xxxx-ce.exe


![](assets/000/01/02/13/02/03-1639710191333.png)


3、 然后一路 next 安装，到了选择组件这一步

![](assets/000/01/02/13/02/03-1639710218434.png)


这里一定要小心，因为它依托于 Git For Window 里的 bash.exe

所以你在取消勾选的时候要先确认下 bash.exe 有没有存在

如果你已经安装了 Git ，那么可以在这一步取消勾选 Git For Windows

4、 继续一路 next 直到安装成功

## 初始化 Docker ToolBox

安装完成后，桌面会出现三个小图标

![](assets/000/01/02/13/02/03-1639710276088.png)

1、 可以双击 Docker QuickStart 图标来启动 Docker Toolbox 终端

![](assets/000/01/02/13/02/03-1639710297860.png)

中间时间等着吧，偶尔要回来看看，因为中间需要你确认一下

如果系统显示 User Account Control 窗口来运行 VirtualBox 修改你的电脑，选择 Yes


2、 等它下载初始化好了之后，就会是下面这样了

![](assets/000/01/02/13/02/03-1639710351857.png)

任何以 美元符号开头的行都表示我们可以输入命令美元符号开头的行都表示我们可以输入命令


### Docker ToolBox Hello World

 1 我们可以在 符号后面输入 docker run hello-world 来输出一个 Hello World

 我们可以使用 docker images hello-world 看看刚刚运行的 hello-world

![](assets/000/01/02/13/02/03-1639710427264.png)

$ docker images hello-world
REPOSITORY   TAG     IMAGE ID      SIZE
hello-world  latest  e38bc07ac18e  1.85kB


## 镜像加速

鉴于我们国内访问 https://hub.docker.com/ 上的镜像可能速度有些慢，所以我们推荐你更改下镜像地址

目前比较推荐的是使用网易的镜像地址 http://hub-mirror.c.163.com

1、 找到配置文件

目前最新的版本，在各个操作系统上使用下面的配置文件

Linux: /etc/docker/daemon.json
Window: %programdata%\docker\config\daemon.json
如果没有这些配置文件，那么新创建一个
2、 在该配置文件中加入