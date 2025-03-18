# Windows 下 Docker 安装教程



![{"type":"load\_by\_key","key":"banner\_image\_0","image\_type":"search"}](https://p9-flow-imagex-sign.byteimg.com/ocean-cloud-tos/image_skill/574c7e65-750f-4a15-af91-93e734fd5dae_1742280405852362104_origin\~tplv-a9rns2rl98-image-qvalue.jpeg?rk3s=6823e3d0\&x-expires=1773823582\&x-signature=YGAcGhSBYDPuo3%2Fbh5WfqATONU0%3D)

## 一、Docker 安装前准备

### （一）系统要求

Docker Desktop for Windows 需要 64 位版本的 Windows 10 专业版、企业版或教育版，版本号 1903 及以上，且启用了 Hyper-V 和 Containers 功能。

查看 Windows 版本方法：按下 Win+R 键，输入 “winver”，回车即可查看版本号。

### （二）开启相关功能

**开启 Hyper-V**

按下 Win+X 键，选择 “应用和功能”。

在右侧找到 “程序和功能”，点击 “启用或关闭 Windows 功能”。

在弹出的窗口中，找到 “Hyper-V”，勾选其下的 “Hyper-V 管理工具” 和 “Hyper-V 平台”，点击 “确定”。系统会自动安装相关组件，安装完成后重启电脑。

\[此处插入开启 Hyper-V 功能的勾选界面图片]

**开启 Containers**

同样在 “启用或关闭 Windows 功能” 窗口中，找到 “Containers” 并勾选，点击 “确定” 后重启电脑。

\[此处插入开启 Containers 功能的勾选界面图片]

## 二、Docker 安装步骤

**下载 Docker Desktop 安装程序**

打开浏览器，访问 Docker 官方网站（[https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/) ）。

在页面中找到 “Download Docker Desktop for Windows” 按钮，点击下载安装程序。

\[此处插入 Docker 官网下载页面图片]

**运行安装程序**

找到下载好的安装程序 “Docker Desktop Installer.exe”，双击运行。

在安装向导中，点击 “OK” 接受许可协议。

选择安装位置，默认安装在 C 盘，也可点击 “Browse” 选择其他位置，然后点击 “Install” 开始安装。

\[此处插入安装向导的许可协议界面图片和选择安装位置界面图片]

**安装完成并启动**

安装完成后，点击 “Finish”。Docker 会自动启动，在系统托盘区会出现 Docker 图标。

\[此处插入系统托盘区 Docker 图标的图片]

## 三、Docker 安装后常见问题及解决方法

### （一）Docker 无法启动

**问题描述**：点击 Docker 图标后，Docker 没有正常启动，或者启动过程中报错。

**可能原因及解决方法**：

**Hyper-V 未正确启用**：重新检查 Hyper-V 是否按照上述步骤正确启用，若未启用，重新启用后再次尝试启动 Docker。

**与其他虚拟机软件冲突**：如果电脑上安装了 VMware 等虚拟机软件，可能会与 Docker 的 Hyper-V 冲突。可尝试关闭 VMware 等软件，或者在 VMware 的设置中禁用 Hyper-V（不同版本 VMware 设置位置可能不同），然后重启电脑再启动 Docker。

**系统资源不足**：Docker 运行需要一定的系统资源，如果电脑内存、CPU 等资源不足，可能导致无法启动。关闭一些不必要的后台程序，释放系统资源后再尝试启动。

### （二）镜像拉取失败

**问题描述**：使用 “docker pull” 命令拉取镜像时，提示拉取失败，报错信息通常包含网络相关错误或仓库认证错误等。

**可能原因及解决方法**：

**网络问题**：

**网络不稳定**：检查网络连接是否正常，可尝试使用 “ping” 命令测试网络连通性。如果网络不稳定，重启路由器或联系网络管理员解决网络问题。

**代理设置问题**：若电脑通过代理上网，需要在 Docker 中配置代理。在 Docker Desktop 的设置中，找到 “Resources” -> “Proxies”，填写代理服务器地址和端口等信息，然后点击 “Apply & Restart” 使设置生效。

\[此处插入 Docker 代理设置界面图片]

**镜像仓库问题**：

**仓库地址错误**：确认拉取镜像时使用的仓库地址是否正确，可在 Docker 官方仓库（[https://hub.docker.com/](https://hub.docker.com/) ）查找正确的镜像名称和地址。

**仓库认证问题**：如果从私有仓库拉取镜像，需要先进行认证。使用 “docker login” 命令，按照提示输入私有仓库的用户名和密码进行认证，认证成功后再拉取镜像。

### （三）容器无法正常运行

**问题描述**：创建并启动容器后，容器无法按照预期运行，可能出现自动停止、运行结果异常等情况。

**可能原因及解决方法**：

**镜像问题**：

**镜像不完整或损坏**：重新拉取镜像，确保镜像完整且未损坏。可先删除本地有问题的镜像（使用 “docker rmi < 镜像 ID 或名称>” 命令），然后重新拉取。

**镜像版本不兼容**：检查容器所依赖的镜像版本是否与当前系统环境或其他组件兼容。查看镜像文档或相关社区，了解是否有版本兼容性问题及解决方法。

**容器配置问题**：

**端口冲突**：如果容器需要映射到主机端口，可能存在端口冲突。使用 “netstat -ano” 命令查看当前主机已占用的端口，修改容器的端口映射设置，确保映射的端口未被占用。例如，将容器原本映射到主机 80 端口的设置改为映射到其他未使用的端口，如 8080 端口。

**环境变量配置错误**：检查容器启动时设置的环境变量是否正确。有些容器需要特定的环境变量才能正常运行，可参考容器的文档，正确设置环境变量。在启动容器时，使用 “-e” 参数设置环境变量，如 “docker run -e VAR1=value1 -e VAR2=value2 < 镜像 ID 或名称 >”。

你可以将上述内容中的图片占位部分替换为实际的截图。要是在制作 PPT 时对内容详略、结构调整等方面有新想法，或者还想补充更多特定场景下的问题及解决办法，都能跟我说，我来进一步优化。


