# Mysql 问题总结

# mysql 博主参考

## 配置文件件 


* [mysql 配置笔记](https://www.cnblogs.com/luwenjie110/p/3655363.html)

# Mysql Linux(centos7) 我的service上、


# mysql查看安装目录：

https://blog.csdn.net/u011136197/article/details/78951432/

三种安装方式目录：https://blog.csdn.net/qq_32497361/article/details/78447576


# mysql.sock 问题 

## 参考一


```sh
Can't connect to local MySQL server through socket '/tmp/mysql.sock'

上述提示可能在启动mysql时遇到，即在/tmp/mysql.sock位置找不到所需要的mysql.sock文件，主要是由于my.cnf文件里对mysql.sock的位置设定导致。

mysql.sock默认的是在/var/lib/mysql, 如果发现确实是在该目录下，可以在[mysqld]下面加入mysql.sock的path
vi /etc/my.cnf（my.cnf也可能在其他路径下）

[mysqld]
port=3306
socket=/var/lib/mysql/mysql.sock

但是要保证使用mysql的用户具有对该目录的写权限，否则这样的改动由于权限限制仍然会报错。

所以为了避免权限问题也可以使用软链接为/var/lib/mysql/mysql.sock创建一个到/tmp/mysql.sock的联接

ln -s /var/lib/mysql/mysql.sock /tmp/mysql.sock

由于/tmp/文件夹默认对other有w权限，这样就可以避免权限问题。

此外，如果发现mysql.sock不在默认的/var/lib/mysql位置，一种解决方法是使用find命令搜索mysql.sock的位置，然后按前面两种解决方案挑一种做即可。

 

注意：首先要看my.cnf中是否指定了sock连接文件，如果指定了，连接方式如下：

[root@iZ11ofs]# mysql -uroot -p'111'  -S  /DATA/mysql/mysql.sock

```
查看状态，关掉mysql再star ：

```sh

[root@boyashen mysql]# systemctl status mysqld
?.mysqld.service - MySQL Server
   Loaded: loaded (/usr/lib/systemd/system/mysqld.service; enabled; vendor preset: disabled)
   Active: failed (Result: exit-code) since Wed 2019-07-24 02:18:49 UTC; 1h 5min ago
     Docs: man:mysqld(8)
           http://dev.mysql.com/doc/refman/en/using-systemd.html
  Process: 3422 ExecStart=/usr/sbin/mysqld $MYSQLD_OPTS (code=exited, status=1/FAILURE)
  Process: 3405 ExecStartPre=/usr/bin/mysqld_pre_systemd (code=exited, status=0/SUCCESS)
 Main PID: 3422 (code=exited, status=1/FAILURE)
   Status: "SERVER_BOOTING"
    Error: 2 (No such file or directory)

Jul 24 02:18:48 boyashen systemd[1]: Starting MySQL Server...
Jul 24 02:18:49 boyashen systemd[1]: mysqld.service: main process exited, code=exited, status=1/FAILURE
Jul 24 02:18:49 boyashen systemd[1]: Failed to start MySQL Server.
Jul 24 02:18:49 boyashen systemd[1]: Unit mysqld.service entered failed state.
Jul 24 02:18:49 boyashen systemd[1]: mysqld.service failed.
[root@boyashen mysql]# systemctl stop mysqld
[root@boyashen mysql]# systemctl start mysqld
Job for mysqld.service failed because the control process exited with error code. See "systemctl status mysqld.service" and "journalctl -xe" for details.
[root@boyashen mysql]# 
```
后续又出现了

```sh
root@boyashen mysql]# systemctl start mysqld
Job for mysqld.service failed because the control process exited with error code. See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

查看日志：我的配置文件再 

vi /etc/my.cnf  
总日志默认在：/var/log
中 ：日志错误 配置在：

datadir=/var/lib/mysql
socket=/var/lib/mysql/mysql.sock
log-error=/var/log/mysqld.log
pid-file=/var/run/mysqld/mysqld.pid

log-error中：

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


## 启动报错 

* 安装mysql 在以后的 运行中一直报错 ，一直解决不了奔着 越是 无厘头的错误 越是看起来解决不了的错误 越简单。查看了日志，按照提示 查看 

```shell
[root@boyashen ~]# systemctl start mysqld
Job for mysqld.service failed because the control process exited with error code. See "systemctl status mysqld.service" and "journalctl -xe" for details.
```

* 没头绪 ：所以 查看mysql 配置的 错误日志：

vi /var/log/mysqld.log


有一条这个 ：


```
2019-07-06T01:38:35.315303Z 1 [Warning] [MY-012638] [InnoDB] Retry attempts for writing partial data failed.
```

刚开始没注意想着不可能 空间不够 ，后来 找了好多问题都解决不了 ，于是 看了一下服务器空间 ,额好吧 ，全占满了

```

[root@boyashen ~]# df -hl
Filesystem      Size  Used Avail Use% Mounted on
/dev/vda1        25G   25G     0 100% /
devtmpfs        486M     0  486M   0% /dev
tmpfs           496M     0  496M   0% /dev/shm
tmpfs           496M   50M  446M  11% /run
tmpfs           496M     0  496M   0% /sys/fs/cgroup
tmpfs           100M     0  100M   0% /run/user/0
```

> 然后去看看到底是哪这么大的空间

```shell
[root@boyashen ~]# du -sh /*
16G	/MyInstall


好吧，我累得乖乖，这里面16G 我去看看
```

随后启动myslq  ，困扰我 好长时间的问题 终于解决了 。就是磁盘没空间了。以后有钱了 买他个 几个t的服务器！哎

##  但是又有问题了，密码忘了怎么办

重新设置密码：

[地址](https://blog.csdn.net/fmwind/article/details/81941790)

### 设置跳过密码之后 还是有错误 错误是啥呢 贴出来

```
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/var/myusql/mysql.sock'
```

* 于是 又开始新的问题解决 mysql  , 后来是因为 

```

/etc/my.cnf 中 client 下面配置的 socket 没有 ，屏蔽之后 ，mysql  跳过密码就直接登录了

```

*  修改密码  mysql8.0 


```
use mysql;  
update user set authentication_string='' where user='root';  
```

* 修改tomcat 端口 


vi /MyInstall/Tomcat8/tomcat8/conf/server.xml
