# win redis 基础

## win redis 下安装启动

(原文)[https://www.cnblogs.com/yunqing/p/10605934.html]

一、下载windows版本的Redis

去官网找了很久，发现原来在官网上可以下载的windows版本的，现在官网以及没有下载地址，只能在github上下载，官网只提供linux版本的下载

官网下载地址：http://redis.io/download

github下载地址：https://github.com/MSOpenTech/redis/tags

二、安装Redis

1.这里下载的是Redis-x64-3.2.100版本，我的电脑是win7 64位，所以下载64位版本的，在运行中输入cmd，然后把目录指向解压的Redis目录。

2、启动命令

redis-server redis.windows.conf，出现下图显示表示启动成功了。

![](assets/001/01/01/02-1614937285984.png)


　启动客户端：

./redis-cli.exe -h 127.0.0.1 -p 6379

* redis_server_start.bat

redis-server.exe redis.windows.conf

* redis_client_start.bat

redis-cli.exe -h 127.0.0.1 -p 6379


三、设置Redis服务
1、由于上面虽然启动了redis，但是只要一关闭cmd窗口，redis就会消失。所以要把redis设置成windows下的服务。

也就是设置到这里，首先发现是没用这个Redis服务的。



![](assets/001/01/01/02-1614937668473.png)

2、设置服务命令

redis-server --service-install redis.windows-service.conf --loglevel verbose


![](assets/001/01/01/02-1614937329217.png)


输入命令之后没有报错，表示成功了，刷新服务，会看到多了一个redis服务。

![](assets/001/01/01/02-1614937349060.png)


<font color="red">**启动报错1067的话，在刚才redis的目录下新建文件夹Logs然后再次启动即可。**</font>


3、常用的redis服务命令。

卸载服务：redis-server --service-uninstall

开启服务：redis-server --service-start

停止服务：redis-server --service-stop

4、启动服务


![](assets/001/01/01/02-1614937421232.png)


5、测试Redis

![](assets/001/01/01/02-1614937436049.png)



这里只是做简单的安装，部署服务使用，更深入的使用可以去redis中文网看看 http://www.redis.net.cn/
redis 解压文档中也有一份

![](assets/001/01/01/02-1614937468664.png)



## linux 下 redis 安装配置


(原文)[https://www.cnblogs.com/zxf100/p/14120430.html]

