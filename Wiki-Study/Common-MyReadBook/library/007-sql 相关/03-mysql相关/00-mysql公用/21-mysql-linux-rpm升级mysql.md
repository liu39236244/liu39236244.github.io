# mysql-linux-rpm升级mysql


## 相关链接

[mysql rpm 包方式安装](https://blog.csdn.net/qq_40878452/article/details/109489992#:~:text=1%E3%80%81%20mysql%20%E5%AE%98%E7%BD%91%E4%B8%8B%E8%BD%BD%20%E7%A6%BB%E7%BA%BF%E5%AE%89%E8%A3%85%20%E5%8C%85%20mysql%20-5.%207.29-1.el,-5.%207.29-1.el%207.x86_64.%20rpm%20-bundle.tar%203%E3%80%81%E5%8D%B8%E8%BD%BD%20CentOS7%20%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%B8%A6%E7%9A%84mar)

## mysql linux上升级8.0- 最新 

因为服务器扫描漏洞需要去修复，大多都是cve 数据库相关的，所以干脆直接升级服务，在运维朋友帮助下升级完成，做下记录


### 简单流程

查找命令：find / -name  mysql

cd /opt/module/mysql/

发现配置了启动方式：

systemctl status mysqld
systemctl stop mysqld

#### 找到对应最新的包rpm

> 1. 找到官网

![](assets/007/03/00/21-1655343296493.png)

> 2. 下载按钮

![](assets/007/03/00/21-1655343351802.png)

> 3. 下载服务

![](assets/007/03/00/21-1655343383277.png)

> 4. 根据服务器下载版本我的是centos 就找 red hat 


![](assets/007/03/00/21-1655343481642.png)



> 5. 下载对应包

![](assets/007/03/00/21-1655343522617.png)

![](assets/007/03/00/21-1655343550712.png)


#### 将下载好的包传到服务器上，

tar -xvf mysql-8.0.29-1.el7.x86_64.rpm-bundle.tar -C ./mysql

如果之前装过mysql mysql目录下就是安装目录，我这里也直接给覆盖解压了。

rpm -Uvh ./mysql-community-server-8.0.29-1.el7.x86_64.rpm

会提示需要同时安装的依赖，然后再次执行安装即可；

先停掉服务
systemctl status mysqld
systemctl stop mysqld

```
rpm -Uvh ./mysql-community-server-8.0.29-1.el7.x86_64.rpm ./mysql-community-common-8.0.29-1.el7.x86_64.rpm ./mysql-community-icu-data-files-8.0.29-1.el7.x86_64.rpm
```
