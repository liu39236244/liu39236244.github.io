# yum 下载包

由于我们公司生产环境与公网不同，经常会遇到离线安装rpm工具包的问题。我们经常是在在线的情况下，通过以下两种方式下载相关RPM包：

1.修改yum的配置文件。

vi /etc/yum.conf 修改 keepcache=1
2.使用工具yum-utils。

yum -y install yum-utils
yum install gcc --downloadonly --downloaddir=/install/install-package

这里相关docker的安装文件会下载到downloaddir。

* 下载gcc

yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel --downloadonly --downloaddir=/install/install-package/yum-gcc

yum localinstall *.rpm -y


yum install  lrzsz --downloadonly --downloaddir=/install/install-package/yum-rzsz

yumdownloader --resolve --destdir=/install/install-package/yum-rzsz lrzsz

##  yumdownloade 

 安装yum-utils
$ yum -y install yum-utils

举例：下载 ansible 依赖包
$ yumdownloader --resolve --destdir=/tmp ansible

通过yum自带的一个工具：yumdownloader

[root@web1 ~]#  rpm -qa |grep yum-utils

[root@web1 ~]# yum -y install yum-utils*

[root@web1 ~]# rpm -ql yum-utils

可以看到yumdownloade这个工具是由yum-utils这个软件安装生成的！

安装好后就可以直接使用了，使用非常简单，如下：

[root@web1 ~]# yumdownloader vlock     --------------------------下载到当前目录

[root@web1 ~]# ls

 vlock-1.3-23.i386.rpm


与yum -y install --downloadonly --downloaddir=/tmp/ vlock 相比，即使当前系统已经安装过该软件，仍旧可以下载。

## 安装mysql 下载相应安装包


https://blog.csdn.net/qq_34354257/article/details/90475791


### 正常联网命令

[root@BrianZhu /]# wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
[root@BrianZhu /]# yum -y install mysql57-community-release-el7-10.noarch.rpm
[root@BrianZhu /]# yum -y install mysql-community-server


### 下载依赖包

> 1. wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
http://dev.mysql.com/get/mysql57-community-release-el7-8.noarch.rpm

> 2. yumdownloader --resolve --destdir=/install/install-package/yum-mysql5.7-release-rpm          mysql57-community-release-el7-10.noarch.rpm

yumdownloader --resolve   mysql57-community-release-el7-10.noarch.rpm

yumdownloader --resolve --destdir=/install/install-package/mysql/libaio libaio

yumdownloader --resolve --destdir=/install/install-package/mysql/lsof lsof

yumdownloader --resolve --destdir=/install/install-package/mysql/vim vim

yumdownloader --resolve --destdir=/install/install-package/mysql/lrzsz lrzsz

java -jar  xz_edu-1.0-SNAPSHOT.jar --spring.config.location=/install/project/frontAndBack/back/yml/xz_edu-application.yml

