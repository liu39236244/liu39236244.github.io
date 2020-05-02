# linux开机启动命令总结三种


## 我的目前采用：

```
我目前使用的是第一种 
cd /etc/rc.d/rc.local 
中添加自己的语句：

# start Tomcat V2ray
sh /shenyabo/MyShell/startTomcat_V2ray/startTocatV2ray.sh
echo "Started tomcat /v2ray success"


```

启动脚本内容：

```sh
#!bin/bash
/MyInstall/Tomcat8/tomcat8/bin/startup.sh
sleep 1
nohup /shenyabo/v2ray-All/v2ray-unzip/v2ray config.json > /dev/null 2>&1 &
```

## mysql 问题：

## 查看mysql安装目录

### 启动报错
启动报错：


```sh
[root@boyashen startTomcat_V2ray]# mysql -u root -p
Enter password: 
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/lib/mysql/mysql.sock' (111)

```

## 尝试解决：




* 查看状态
systemctl status mysqld 
或者：/etc/rc.d/init.d/mysqld status
没有/etc/rc.d/ini.d/mysqld 启动文件解决：
https://blog.csdn.net/imliuqun123/article/details/83347081 

* 验证错误文件是否存在
查找 验证mysql.sock 

[root@boyashen startTomcat_V2ray]# find /-name mysql.sock
find: ?.-name?. No such file or directory
find: ?.ysql.sock?. No such file or directory




[原文博主链接](https://blog.csdn.net/qq_35440678/article/details/80489102)

## 第一种 在 /etc/rc.d/rc.local 文件中 执行脚本，或者语句

```shell
在文件/etc/rc.d/rc.local(和/etc/rc.local是同一个文件)中加入自己的执行语句
然后，

使文件有执行权限：
chmod +x /etc/rc.d/rc.local
```

## 第二种 crontab 方式启动，定时任务脚本中添加

```shell

    crontab -e
    @reboot /**/**/**.sh

```


## 第三种 etc/profile.d 目录中添加自己的脚本文件

```shell
也可以设置每次登录自动执行脚本，在/etc/profile.d/目录下新建sh脚本，
/etc/profile会遍历/etc/profile.d/*.sh
```

### 集中etc/下脚本区别

```
（1） /etc/profile： 此文件为系统的每个用户设置环境信息,当用户第一次登录时,该文件被执行. 并从/etc/profile.d目录的配置文件中搜集shell的设置。

（2） /etc/bashrc: 为每一个运行bash shell的用户执行此文件.当bash shell被打开时,该文件被读取（即每次新开一个终端，都会执行bashrc）。

（3） ~/.bash_profile: 每个用户都可使用该文件输入专用于自己使用的shell信息,当用户登录时,该文件仅仅执行一次。默认情况下,设置一些环境变量,执行用户的.bashrc文件。

（4） ~/.bashrc: 该文件包含专用于你的bash shell的bash信息,当登录时以及每次打开新的shell时,该该文件被读取。

（5） ~/.bash_logout: 当每次退出系统(退出bash shell)时,执行该文件. 另外,/etc/profile中设定的变量(全局)的可以作用于任何用户,而~/.bashrc等中设定的变量(局部)只能继承 /etc/profile中的变量,他们是”父子”关系。

（6） ~/.bash_profile: 是交互式、login 方式进入 bash 运行的~/.bashrc 是交互式 non-login 方式进入 bash 运行的通常二者设置大致相同，所以通常前者会调用后者。

```
