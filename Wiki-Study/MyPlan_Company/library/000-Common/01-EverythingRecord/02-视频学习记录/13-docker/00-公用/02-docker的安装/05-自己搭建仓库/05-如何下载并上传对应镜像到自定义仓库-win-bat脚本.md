

# 下面是脚本

Docker 不会重复下载已存在的镜像。当你执行 `docker pull` 时，Docker 会：

1. **检查本地是否已有该镜像**
2. **如果已存在且是最新版本**，会显示 "Image is up to date" 并跳过下载
3. **如果本地版本较旧**，只会下载更新的层（Docker 使用分层存储）

不过，为了让脚本更高效，我来优化一下，添加本地检查功能：

```batch
@echo off
chcp 65001
echo ================================
echo Docker 镜像批量下载和推送脚本 (优化版)
echo ================================

:: 设置你的私有仓库地址
set REGISTRY_URL=localhost:5000

:menu
echo.
echo 请选择操作：
echo 1. 智能下载并推送所有镜像 (跳过已存在的)
echo 2. 强制下载并推送所有镜像
echo 3. 仅推送现有镜像
echo 4. 推送指定镜像
echo 5. 查看本地镜像状态
echo 6. 退出
echo.
set /p choice=请输入选择 (1-6): 

if "%choice%"=="1" goto smart_download_and_push
if "%choice%"=="2" goto force_download_and_push
if "%choice%"=="3" goto push_existing
if "%choice%"=="4" goto push_specific
if "%choice%"=="5" goto check_local_images
if "%choice%"=="6" goto end
goto menu

:smart_download_and_push
echo.
echo [INFO] 智能下载并推送镜像 (跳过已存在的)...
call :smart_download_images
call :push_all_images
goto menu

:force_download_and_push
echo.
echo [INFO] 强制下载并推送所有镜像...
call :force_download_images
call :push_all_images
goto menu

:push_existing
echo.
echo [INFO] 开始推送现有镜像...
call :push_all_images
goto menu

:push_specific
echo.
echo [INFO] 推送指定镜像...
set /p image_name=请输入要推送的镜像名称: 
call :push_single_image %image_name%
goto menu

:check_local_images
echo.
echo ================================
echo 本地镜像状态检查
echo ================================
call :check_images_status
goto menu

:: 检查镜像是否存在的函数
:check_image_exists
set check_image=%1
docker image inspect %check_image% >nul 2>&1
if errorlevel 1 (
    exit /b 1
) else (
    exit /b 0
)

:: 智能下载镜像函数 (跳过已存在的)
:smart_download_images
echo.
echo ================================
echo 智能下载镜像 (跳过已存在的)...
echo ================================

:: Web服务器
echo [INFO] 检查 Web 服务器镜像...
call :smart_pull nginx:latest
call :smart_pull nginx:alpine

:: 数据库
echo [INFO] 检查数据库镜像...
call :smart_pull redis:latest
call :smart_pull redis:alpine
call :smart_pull mongo:latest
call :smart_pull mongo:4.4
call :smart_pull mysql:8.0
call :smart_pull mysql:5.7
call :smart_pull clickhouse/clickhouse-server:latest
call :smart_pull starrocks/allin1-ubuntu:latest
call :smart_pull oscarfonts/h2:latest

:: 容器管理
echo [INFO] 检查容器管理镜像...
call :smart_pull portainer/portainer-ce:latest
call :smart_pull registry:2
call :smart_pull joxit/docker-registry-ui:latest

:: 远程桌面和网络工具
echo [INFO] 检查远程桌面和网络工具镜像...
call :smart_pull rustdesk/rustdesk-server:latest
call :smart_pull mzz2017/v2raya:latest
call :smart_pull v2fly/v2ray-core:latest

:: ELK 日志分析
echo [INFO] 检查 ELK 镜像...
call :smart_pull elasticsearch:8.11.0
call :smart_pull elasticsearch:7.17.15
call :smart_pull kibana:8.11.0
call :smart_pull kibana:7.17.15
call :smart_pull logstash:8.11.0
call :smart_pull logstash:7.17.15
call :smart_pull elastic/filebeat:8.11.0

:: 开发环境
echo [INFO] 检查开发环境镜像...
call :smart_pull openjdk:8-jdk
call :smart_pull openjdk:8-jre
call :smart_pull openjdk:17-jdk
call :smart_pull openjdk:17-jre
call :smart_pull golang:1.21
call :smart_pull golang:1.20
call :smart_pull golang:alpine

:: 其他常用工具
echo [INFO] 检查其他常用工具镜像...
call :smart_pull alpine:latest
call :smart_pull ubuntu:20.04
call :smart_pull ubuntu:22.04
call :smart_pull centos:7
call :smart_pull node:18
call :smart_pull node:16
call :smart_pull python:3.9
call :smart_pull python:3.11

echo [SUCCESS] 智能下载完成！
goto :eof

:: 强制下载镜像函数
:force_download_images
echo.
echo ================================
echo 强制下载所有镜像...
echo ================================

:: 这里使用原来的下载逻辑
call :download_all_images
goto :eof

:: 智能拉取单个镜像
:smart_pull
set image_name=%1
echo.
echo [CHECK] 检查镜像: %image_name%

docker image inspect %image_name% >nul 2>&1
if errorlevel 1 (
    echo [DOWNLOAD] 镜像不存在，开始下载: %image_name%
    docker pull %image_name%
    if errorlevel 1 (
        echo [ERROR] 下载失败: %image_name%
    ) else (
        echo [SUCCESS] 下载成功: %image_name%
    )
) else (
    echo [SKIP] 镜像已存在，跳过下载: %image_name%
    echo [INFO] 检查更新: %image_name%
    docker pull %image_name%
)
goto :eof

:: 检查本地镜像状态
:check_images_status
echo.
echo 正在检查本地镜像状态...
echo.

:: 定义要检查的镜像列表
set images=nginx:latest nginx:alpine redis:latest redis:alpine mongo:latest mongo:4.4 mysql:8.0 mysql:5.7 clickhouse/clickhouse-server:latest starrocks/allin1-ubuntu:latest oscarfonts/h2:latest portainer/portainer-ce:latest registry:2 joxit/docker-registry-ui:latest rustdesk/rustdesk-server:latest mzz2017/v2raya:latest v2fly/v2ray-core:latest elasticsearch:8.11.0 kibana:8.11.0 logstash:8.11.0 elastic/filebeat:8.11.0 openjdk:8-jdk openjdk:17-jdk golang:1.21 alpine:latest ubuntu:20.04 node:18 python:3.9

set exist_count=0
set missing_count=0

for %%i in (%images%) do (
    docker image inspect %%i >nul 2>&1
    if errorlevel 1 (
        echo [MISSING] %%i
        set /a missing_count+=1
    ) else (
        echo [EXISTS]  %%i
        set /a exist_count+=1
    )
)

echo.
echo ================================
echo 统计结果:
echo 已存在镜像: %exist_count% 个
echo 缺失镜像: %missing_count% 个
echo ================================

goto :eof

:: 下载所有镜像 (原始版本)
:download_all_images
:: Web服务器
docker pull nginx:latest
docker pull nginx:alpine

:: 数据库
docker pull redis:latest
docker pull redis:alpine
docker pull mongo:latest
docker pull mongo:4.4
docker pull mysql:8.0
docker pull mysql:5.7
docker pull clickhouse/clickhouse-server:latest
docker pull starrocks/allin1-ubuntu:latest
docker pull oscarfonts/h2:latest

:: 容器管理
docker pull portainer/portainer-ce:latest
docker pull registry:2
docker pull joxit/docker-registry-ui:latest

:: 远程桌面和网络工具
docker pull rustdesk/rustdesk-server:latest
docker pull mzz2017/v2raya:latest
docker pull v2fly/v2ray-core:latest

:: ELK 日志分析
docker pull elasticsearch:8.11.0
docker pull elasticsearch:7.17.15
docker pull kibana:8.11.0
docker pull kibana:7.17.15
docker pull logstash:8.11.0
docker pull logstash:7.17.15
docker pull elastic/filebeat:8.11.0

:: 开发环境
docker pull openjdk:8-jdk
docker pull openjdk:8-jre
docker pull openjdk:17-jdk
docker pull openjdk:17-jre
docker pull golang:1.21
docker pull golang:1.20
docker pull golang:alpine

:: 其他常用工具
docker pull alpine:latest
docker pull ubuntu:20.04
docker pull ubuntu:22.04
docker pull centos:7
docker pull node:18
docker pull node:16
docker pull python:3.9
docker pull python:3.11

goto :eof

:: 推送所有镜像函数
:push_all_images
echo.
echo ================================
echo 开始推送镜像到私有仓库...
echo ================================

:: Web服务器
call :push_single_image nginx:latest
call :push_single_image nginx:alpine

:: 数据库
call :push_single_image redis:latest
call :push_single_image redis:alpine
call :push_single_image mongo:latest
call :push_single_image mongo:4.4
call :push_single_image mysql:8.0
call :push_single_image mysql:5.7
call :push_single_image clickhouse/clickhouse-server:latest
call :push_single_image starrocks/allin1-ubuntu:latest
call :push_single_image oscarfonts/h2:latest

:: 容器管理
call :push_single_image portainer/portainer-ce:latest
call :push_single_image registry:2
call :push_single_image joxit/docker-registry-ui:latest

:: 远程桌面和网络工具
call :push_single_image rustdesk/rustdesk-server:latest
call :push_single_image mzz2017/v2raya:latest
call :push_single_image v2fly/v2ray-core:latest

:: ELK
call :push_single_image elasticsearch:8.11.0
call :push_single_image elasticsearch:7.17.15
call :push_single_image kibana:8.11.0
call :push_single_image kibana:7.17.15
call :push_single_image logstash:8.11.0
call :push_single_image logstash:7.17.15
call :push_single_image elastic/filebeat:8.11.0

:: 开发环境
call :push_single_image openjdk:8-jdk
call :push_single_image openjdk:8-jre
call :push_single_image openjdk:17-jdk
call :push_single_image openjdk:17-jre
call :push_single_image golang:1.21
call :push_single_image golang:1.20
call :push_single_image golang:alpine

:: 其他工具
call :push_single_image alpine:latest
call :push_single_image ubuntu:20.04
call :push_single_image ubuntu:22.04
call :push_single_image centos:7
call :push_single_image node:18
call :push_single_image node:16
call :push_single_image python:3.9
call :push_single_image python:3.11

echo [SUCCESS] 所有镜像推送完成！
goto :eof

:: 推送单个镜像函数
:push_single_image
set original_image=%1
echo.
echo [INFO] 处理镜像: %original_image%

:: 检查镜像是否存在
docker image inspect %original_image% >nul 2>&1
if errorlevel 1 (
    echo [WARNING] 镜像 %original_image% 不存在，跳过...
    goto :eof
)

:: 处理镜像名称，替换特殊字符
set new_image=%original_image%
set new_image=%new_image:/=-%
set new_image=%REGISTRY_URL%/%new_image%

echo [INFO] 标记镜像: %original_image% -> %new_image%
docker tag %original_image% %new_image%

if errorlevel 1 (
    echo [ERROR] 标记镜像失败: %original_image%
    goto :eof
)

echo [INFO] 推送镜像: %new_image%
docker push %new_image%

if errorlevel 1 (
    echo [ERROR] 推送镜像失败: %new_image%
) else (
    echo [SUCCESS] 推送成功: %new_image%
)

goto :eof

:end
echo.
echo 脚本执行完成！
pause
exit /b 0
```

**主要优化点：**

1. **智能下载模式**：
   - 检查本地是否已有镜像
   - 如果存在，只检查更新
   - 如果不存在，才进行下载

2. **状态检查功能**：
   - 可以查看哪些镜像已存在
   - 统计存在和缺失的镜像数量

3. **两种下载模式**：
   - 智能模式：跳过已存在的镜像
   - 强制模式：重新下载所有镜像

这样既避免了不必要的下载，又保持了灵活性！


## 简约版本



```bat
@echo off
chcp 65001
echo ================================
echo Docker 镜像批量下载和推送脚本 (优化版)
echo ================================

:: 设置你的私有仓库地址
set REGISTRY_URL=localhost:5000

:: 设置并发下载数量
set MAX_CONCURRENT=3

:menu
echo.
echo 请选择操作：
echo 1. 智能下载并推送所有镜像 (跳过已存在的)
echo 2. 强制下载并推送所有镜像
echo 3. 仅推送现有镜像
echo 4. 推送指定镜像
echo 5. 查看本地镜像状态
echo 6. 配置 Docker 镜像源
echo 7. 退出
echo.
set /p choice=请输入选择 (1-7): 

if "%choice%"=="1" goto smart_download_and_push
if "%choice%"=="2" goto force_download_and_push
if "%choice%"=="3" goto push_existing
if "%choice%"=="4" goto push_specific
if "%choice%"=="5" goto check_local_images
if "%choice%"=="6" goto config_mirrors
if "%choice%"=="7" goto end
goto menu

:smart_download_and_push
echo.
echo [INFO] 智能下载并推送镜像 (跳过已存在的)...
call :smart_download_images
call :push_all_images
goto menu

:force_download_and_push
echo.
echo [INFO] 强制下载并推送所有镜像...
call :force_download_images
call :push_all_images
goto menu

:push_existing
echo.
echo [INFO] 开始推送现有镜像...
call :push_all_images
goto menu

:push_specific
echo.
echo [INFO] 推送指定镜像...
set /p image_name=请输入要推送的镜像名称: 
call :push_single_image %image_name%
goto menu

:check_local_images
echo.
echo ================================
echo 本地镜像状态检查
echo ================================
call :check_images_status
goto menu

:config_mirrors
echo.
echo ================================
echo 配置 Docker 镜像源
echo ================================
echo 正在配置国内镜像源...
call :setup_docker_mirrors
goto menu

:: 配置 Docker 镜像源
:setup_docker_mirrors
set docker_config_dir=%USERPROFILE%\.docker
if not exist "%docker_config_dir%" mkdir "%docker_config_dir%"

echo 创建 Docker 配置文件...
(
echo {
echo   "registry-mirrors": [
echo     "https://docker.mirrors.ustc.edu.cn",
echo     "https://hub-mirror.c.163.com",
echo     "https://mirror.baidubce.com",
echo     "https://ccr.ccs.tencentyun.com"
echo   ],
echo   "insecure-registries": [
echo     "localhost:5000"
echo   ]
echo }
) > "%docker_config_dir%\daemon.json"

echo [SUCCESS] Docker 镜像源配置完成！
echo [INFO] 请重启 Docker Desktop 使配置生效
pause
goto :eof

:: 智能下载镜像函数 (跳过已存在的)
:smart_download_images
echo.
echo ================================
echo 智能下载镜像 (跳过已存在的)...
echo ================================

:: Web服务器
echo [INFO] 检查 Web 服务器镜像...
call :smart_pull nginx:latest
call :smart_pull nginx:alpine

:: 数据库
echo [INFO] 检查数据库镜像...
call :smart_pull redis:latest
call :smart_pull redis:alpine
call :smart_pull mongo:latest
call :smart_pull mongo:4.4
call :smart_pull mysql:8.0
call :smart_pull mysql:5.7
call :smart_pull clickhouse/clickhouse-server:latest
call :smart_pull starrocks/allin1-ubuntu:latest
call :smart_pull oscarfonts/h2:latest

:: 容器管理
echo [INFO] 检查容器管理镜像...
call :smart_pull portainer/portainer-ce:latest
call :smart_pull registry:2
call :smart_pull joxit/docker-registry-ui:latest

:: 远程桌面和网络工具
echo [INFO] 检查远程桌面和网络工具镜像...
call :smart_pull rustdesk/rustdesk-server:latest
call :smart_pull mzz2017/v2raya:latest
call :smart_pull v2fly/v2ray-core:latest

:: ELK 日志分析
echo [INFO] 检查 ELK 镜像...
call :smart_pull elasticsearch:8.11.0
call :smart_pull kibana:8.11.0
call :smart_pull logstash:8.11.0
call :smart_pull elastic/filebeat:8.11.0

:: 开发环境
echo [INFO] 检查开发环境镜像...
call :smart_pull openjdk:8-jdk
call :smart_pull openjdk:17-jdk
call :smart_pull golang:1.21
call :smart_pull golang:alpine

:: Python 环境
echo [INFO] 检查 Python 环境镜像...
call :smart_pull continuumio/miniconda3:latest

:: Node.js 管理工具
echo [INFO] 检查 Node.js 管理工具镜像...
call :smart_pull verdaccio/verdaccio:latest
call :smart_pull node:18-alpine
call :smart_pull node:lts-alpine

:: 版本控制系统
echo [INFO] 检查版本控制系统镜像...
call :smart_pull gitlab/gitlab-ce:latest
call :smart_pull gitea/gitea:latest
call :smart_pull elleflorio/svn-server:latest

:: CI/CD 工具 (仅保留指定的三个)
echo [INFO] 检查 CI/CD 工具镜像...
call :smart_pull jenkins/jenkins:lts
call :smart_pull drone/drone:latest
call :smart_pull argoproj/argocd:latest

:: 其他常用工具
echo [INFO] 检查其他常用工具镜像...
call :smart_pull alpine:latest
call :smart_pull ubuntu:20.04

echo [SUCCESS] 智能下载完成！
goto :eof

:: 强制下载镜像函数
:force_download_images
echo.
echo ================================
echo 强制下载所有镜像...
echo ================================
call :download_all_images
goto :eof

:: 智能拉取单个镜像
:smart_pull
set image_name=%1
echo.
echo [CHECK] 检查镜像: %image_name%

docker image inspect %image_name% >nul 2>&1
if errorlevel 1 (
    echo [DOWNLOAD] 镜像不存在，开始下载: %image_name%
    start /b cmd /c "docker pull %image_name% && echo [SUCCESS] 下载成功: %image_name% || echo [ERROR] 下载失败: %image_name%"
) else (
    echo [SKIP] 镜像已存在: %image_name%
    echo [INFO] 检查更新: %image_name%
    start /b cmd /c "docker pull %image_name% >nul 2>&1"
)
goto :eof

:: 检查本地镜像状态
:check_images_status
echo.
echo 正在检查本地镜像状态...
echo.

:: 更新后的镜像列表
set images=nginx:latest nginx:alpine redis:latest redis:alpine mongo:latest mongo:4.4 mysql:8.0 mysql:5.7 clickhouse/clickhouse-server:latest starrocks/allin1-ubuntu:latest oscarfonts/h2:latest portainer/portainer-ce:latest registry:2 joxit/docker-registry-ui:latest rustdesk/rustdesk-server:latest mzz2017/v2raya:latest v2fly/v2ray-core:latest elasticsearch:8.11.0 kibana:8.11.0 logstash:8.11.0 elastic/filebeat:8.11.0 openjdk:8-jdk openjdk:17-jdk golang:1.21 golang:alpine continuumio/miniconda3:latest verdaccio/verdaccio:latest node:18-alpine node:lts-alpine gitlab/gitlab-ce:latest gitea/gitea:latest elleflorio/svn-server:latest jenkins/jenkins:lts drone/drone:latest argoproj/argocd:latest alpine:latest ubuntu:20.04

set exist_count=0
set missing_count=0

for %%i in (%images%) do (
    docker image inspect %%i >nul 2>&1
    if errorlevel 1 (
        echo [MISSING] %%i
        set /a missing_count+=1
    ) else (
        echo [EXISTS]  %%i
        set /a exist_count+=1
    )
)

echo.
echo ================================
echo 统计结果:
echo 已存在镜像: %exist_count% 个
echo 缺失镜像: %missing_count% 个
echo ================================

goto :eof

:: 下载所有镜像 (原始版本)
:download_all_images
:: Web服务器
docker pull nginx:latest
docker pull nginx:alpine

:: 数据库
docker pull redis:latest
docker pull redis:alpine
docker pull mongo:latest
docker pull mongo:4.4
docker pull mysql:8.0
docker pull mysql:5.7
docker pull clickhouse/clickhouse-server:latest
docker pull starrocks/allin1-ubuntu:latest
docker pull oscarfonts/h2:latest

:: 容器管理
docker pull portainer/portainer-ce:latest
docker pull registry:2
docker pull joxit/docker-registry-ui:latest

:: 远程桌面和网络工具
docker pull rustdesk/rustdesk-server:latest
docker pull mzz2017/v2raya:latest
docker pull v2fly/v2ray-core:latest

:: ELK 日志分析
docker pull elasticsearch:8.11.0
docker pull kibana:8.11.0
docker pull logstash:8.11.0
docker pull elastic/filebeat:8.11.0

:: 开发环境
docker pull openjdk:8-jdk
docker pull openjdk:17-jdk
docker pull golang:1.21
docker pull golang:alpine

:: Python 环境
docker pull continuumio/miniconda3:latest

:: Node.js 管理工具
docker pull verdaccio/verdaccio:latest
docker pull node:18-alpine
docker pull node:lts-alpine

:: 版本控制系统
docker pull gitlab/gitlab-ce:latest
docker pull gitea/gitea:latest
docker pull elleflorio/svn-server:latest

:: CI/CD 工具
docker pull jenkins/jenkins:lts
docker pull drone/drone:latest
docker pull argoproj/argocd:latest

:: 其他常用工具
docker pull alpine:latest
docker pull ubuntu:20.04

goto :eof

:: 推送所有镜像函数
:push_all_images
echo.
echo ================================
echo 开始推送镜像到私有仓库...
echo ================================

:: Web服务器
call :push_single_image nginx:latest
call :push_single_image nginx:alpine

:: 数据库
call :push_single_image redis:latest
call :push_single_image redis:alpine
call :push_single_image mongo:latest
call :push_single_image mysql:8.0
call :push_single_image clickhouse/clickhouse-server:latest
call :push_single_image starrocks/allin1-ubuntu:latest
call :push_single_image oscarfonts/h2:latest

:: 容器管理
call :push_single_image portainer/portainer-ce:latest
call :push_single_image registry:2
call :push_single_image joxit/docker-registry-ui:latest

:: 远程桌面和网络工具
call :push_single_image rustdesk/rustdesk-server:latest
call :push_single_image mzz2017/v2raya:latest
call :push_single_image v2fly/v2ray-core:latest

:: ELK
call :push_single_image elasticsearch:8.11.0
call :push_single_image kibana:8.11.0
call :push_single_image logstash:8.11.0
call :push_single_image elastic/filebeat:8.11.0

:: 开发环境
call :push_single_image openjdk:8-jdk
call :push_single_image openjdk:17-jdk
call :push_single_image golang:1.21
call :push_single_image golang:alpine

:: Python 环境
call :push_single_image continuumio/miniconda3:latest

:: Node.js 管理工具
call :push_single_image verdaccio/verdaccio:latest
call :push_single_image node:18-alpine
call :push_single_image node:lts-alpine

:: 版本控制系统
call :push_single_image gitlab/gitlab-ce:latest
call :push_single_image gitea/gitea:latest
call :push_single_image elleflorio/svn-server:latest

:: CI/CD 工具
call :push_single_image jenkins/jenkins:lts
call :push_single_image drone/drone:latest
call :push_single_image argoproj/argocd:latest

:: 其他工具
call :push_single_image alpine:latest
call :push_single_image ubuntu:20.04

echo [SUCCESS] 所有镜像推送完成！
goto :eof

:: 推送单个镜像函数
:push_single_image
set original_image=%1
echo.
echo [INFO] 处理镜像: %original_image%

:: 检查镜像是否存在
docker image inspect %original_image% >nul 2>&1
if errorlevel 1 (
    echo [WARNING] 镜像 %original_image% 不存在，跳过...
    goto :eof
)

:: 处理镜像名称，替换特殊字符
set new_image=%original_image%
set new_image=%new_image:/=-%
set new_image=%REGISTRY_URL%/%new_image%

echo [INFO] 标记镜像: %original_image% -> %new_image%
docker tag %original_image% %new_image%

if errorlevel 1 (
    echo [ERROR] 标记镜像失败: %original_image%
    goto :eof
)

echo [INFO] 推送镜像: %new_image%
docker push %new_image%

if errorlevel 1 (
    echo [ERROR] 推送镜像失败: %new_image%
) else (
    echo [SUCCESS] 推送成功: %new_image%
)

goto :eof

:end
echo.
echo 脚本执行完成！
pause
exit /b 0
```


```

robocopy "C:\Users\Administrator\AppData\Local\Docker\wsl\disk" "E:\shenyabo\disk-image\DockerDesktopWSL\disk" docker_data.vhdx /R:3 /W:30 /MT:1
robocopy "C:\Users\Administrator\AppData\Local\Docker\wsl\main" "E:\shenyabo\disk-image\DockerDesktopWSL\main" ext4.vhdx /R:3 /W:30 /MT:1
```