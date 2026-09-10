


## win安装docker


## 0 

如果命令行  wsl install 一直下载不了或者很慢 就用下面手动



### 1 下载对应的安装包：


https://release-assets.githubusercontent.com/github-production-release-asset/55626935/a73491cd-c3f8-4c6a-8a59-4c88d902d223?sp=r&sv=2018-11-09&sr=b&spr=https&se=2026-09-08T10%3A35%3A20Z&rscd=attachment%3B+filename%3DMicrosoft.WSL_2.9.10.0_x64_ARM64.msixbundle&rsct=application%2Foctet-stream&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2026-09-08T09%3A35%3A01Z&ske=2026-09-08T10%3A35%3A20Z&sks=b&skv=2018-11-09&sig=5i%2FOo0kuHyU1LgjtDfGqDJeyJiBt6svdqZ4rpeXdb6c%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc4ODg2NDk4OSwibmJmIjoxNzg4ODYxMzg5LCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.wcwj7rO4hXGoQnvhIwkpDJ3JewXGAkyVTz0qbVv_J84&response-content-disposition=attachment%3B%20filename%3DMicrosoft.WSL_2.9.10.0_x64_ARM64.msixbundle&response-content-type=application%2Foctet-stream


### 2 安装以后设置版本
wsl --set-default-version 2

### 3  wsl --install -d Ubuntu

wsl --install -d Ubuntu

可能需要重启电脑,那就重启电脑以后再安装 ubuntu


### 4 安装ubunto

wsl --install -d Ubuntu

### 5 下载docker 桌面进行安装

### 6 安装以后设置代理 然后 测试docker pull

![](assets/000/01/02/13/00/02/01/02-1788962547879.png)


### 7 测试

docker pull hello-world
docker pull nginx:alpine