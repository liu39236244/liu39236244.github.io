# Docker 容器运行 Web 应用

前面我们运行的容器并没什么大作用，这次，我们尝试使用 docker 构建一个 web 应用程序

我们将在 Docker 容器中运行一个 Python Flask 应用来运行一个 web 应用

我特意去 [Docker Hub](https://hub.docker.com/) 找了一圈，发现这个 jcdemo/flaskapp 是最好的，小，而且刚好满足我们的需求

拉取 jcdemo/flaskapp 镜像
使用下面的命令将 jcdemo/flaskapp 镜像拉取到本地

```sh
[root@localhost ~]# docker pull jcdemo/flaskapp
latest: Pulling from jcdemo/flaskapp
e7c1d6a: Pull complete 
b61101706a6: Pull complete 
b21c1a8b97: Pull complete 
f5aeeec4: Pull complete 
ce9545e7847c: Pull complete 
c0a17c8bb7b9: Pull complete 
c8d70066c010: Pull complete 
Digest: sha256:c0c7fb38dfa6dc371e8c04827eb83ff265401ddc25b624ed58d05b1cce0026f8
Status: Downloaded newer image for jcdemo/flaskapp:latest
f6a0e149983a29294abd76c141f44e8da59bcbaf1d283be63fca803a486f9582
```


Docker 容器运行 Web 应用
我们使用下面的命令运行我们的 Web 应用容器 jcdemo/flaskapp

```sh
[root@localhost ~]# docker run -d -P jcdemo/flaskapp
d07b599f11e473c3112002f9b697efd4f01b0f7563490db65cfc11ba8d816bbb
```

```
参数	说明
-d	让容器在后台运行
-P	将容器内部使用的网络端口映射到我们使用的主机上
查看 WEB 应用容器
使用 docker ps 来查看我们正在运行的容器 (字段有删除)
```

```
[root@localhost ~]# docker ps
CONTAINER ID  STATUS         PORTS
d07b599f11e4  Up 3 minutes   0.0.0.0:32768->5000/tcp
```

可以看到，想比较于之间的容器，这个容器的 PORTS 字段是有值的

PORTS
0.0.0.0:32768->5000/tcp

Docker 开放了 5000 端口（默认 Python Flask 端口）映射到主机端口 32768 上

这样我们就可以通过 http://localhost:32768/ 来访问 Web 应用