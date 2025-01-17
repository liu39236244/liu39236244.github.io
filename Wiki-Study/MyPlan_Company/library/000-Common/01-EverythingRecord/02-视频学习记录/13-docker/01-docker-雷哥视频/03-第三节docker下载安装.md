# 第三节docker下载安装


## docker 安装

![](assets/000/01/02/13/01/03-1618323103116.png)


![](assets/000/01/02/13/01/03-1618323084366.png)



![](assets/000/01/02/13/01/03-1618323286578.png)


## docker 基本组成


![](assets/000/01/02/13/01/03-1618323324115.png)


## 安装 docker


> 1 安装 gccc ，确保有网

![](assets/000/01/02/13/01/03-1618323690572.png)


> 2  如果有旧版本，卸载旧版本


![](assets/000/01/02/13/01/03-1618323727778.png)


> 3 安装

![](assets/000/01/02/13/01/03-1618323747521.png)


> 4 启动docker

systemctl start docker
systemctl stop docker
systemctl restart docker

![](assets/000/01/02/13/01/03-1618323767067.png)

> 5 查看版本

![](assets/000/01/02/13/01/03-1618323882585.png)



## 下载之后测试案例  helloworld


> 1 下载 ： docker pull hello-world

![](assets/000/01/02/13/01/03-1618324178443.png)

> 2 查看镜像：docker images 

![](assets/000/01/02/13/01/03-1618324250457.png)

> 3 执行 hello-world


![](assets/000/01/02/13/01/03-1618324292723.png)

## 下载nginx 测试


> 1 下载: docker pull nginx 

![](assets/000/01/02/13/01/03-1618324364720.png)

> 2 查看

![](assets/000/01/02/13/01/03-1618324421920.png)

> 3 启动 nginx ，对外开放端口，因为是沙箱机制


![](assets/000/01/02/13/01/03-1618324589120.png)


04-docker 安装刚完



## 卸载docker


![](assets/000/01/02/13/01/03-1736671554695.png)
