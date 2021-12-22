# centos安装docker

https://www.javajike.com/article/1176.html


## 安装说明

CentOS Docker 安装

Docker 可以运行在 CentOS 上，但对 CentOS 系统版本和内核版本有一定的要求

1、 CentOS 的版本必须在 6.5+ ，且必须是 64 位，然后必须是发行版本
2、 如果是 Docker CE ，则要求系统版本是 7.0+
3、 如果是 CentOS 7 ，则要求系统内核版本为 3.10 以上
4、 如果是 CentOS 6.5 或更高的版本的 CentOS 上，则要求系统内核版本为 2.6.32-431 或者更高版本


查看 CentOS 系统内核版本

如果你不确定自己的 CentOS 的内核版本是多少，可以使用 uname -r 命令查看一下


[root@localhost ~]# uname -r
3.10.0-1160.36.2.el7.x86_64


目前最快速的安装 Docker 的方式是使用官方给出的脚本 https://get.docker.com/

只需要在终端里输入以下命令即可开始安装

curl -fsSL get.docker.com -o get-docker.sh

sudo sh get-docker.sh


```sh
[root@localhost current]# curl -fsSL get.docker.com -o get-docker.sh
[root@localhost current]# ll
total 20
-rw-r--r--. 1 root root 18617 Dec 16 21:34 get-docker.sh

```

执行脚本

![](assets/000/01/02/13/02/02-1639708530820.png)


如果你使用的是 root 用户，可以先轻松下再回来，如果你使用的是普通用户，那么需要 sudo sh get-docker.sh，然后输入登录密码

稍等片刻，Docker 就会安装完毕，是不是很省事，因为我们连一张图都没发

可以安装完成后最后那几段提示

```
If you would like to use Docker as a non-root user, you should now consider
    adding your user to the "docker" group with something like:
    sudo usermod -aG docker your-user
   Remember that you will have to log out and back in for this to take effect!
Java
```

意思是说，如果以非 root 用户可以运行 docker 时，需要执行 `sudo usermod -aG docker ycbbs` 命令然后重新登陆，否则会有如下报错

[penglei@localhost ~]docker fun hello-world
docker: Cannot connect to the Docker daemon. Is the docker daemon running on this host ?



...




## 启动docker 服务

启动 Docker 服务
如果是 Centos 7 以上版本，则使用下面的命令启动 Docker 服务

systemctl start docker

如果是较低的版本，则使用下面的命令启动 Docker 服务

service docker start

## 检测安装


Docker Hello World
我们可以使用 docker run hello-world 命令来检查下是否安装成功


![](assets/000/01/02/13/02/02-1639708751965.png)