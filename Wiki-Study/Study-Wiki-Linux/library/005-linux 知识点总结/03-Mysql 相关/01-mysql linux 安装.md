# linux 安装 centos7


## linux 安装mysql

## 可行

* 1-安装mysql
```

从官网下载mysql的repo源，然后进行滚动安装

    wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm # 下载 repo文件

    rpm -ivh mysql-community-release-el7-5.noarch.rpm  # 安装repo文件到系统

    yum install mysql-server  #安装mysql服务

    service mysqld start

    mysql
    use mysql ;

    # 注意修改 root 用户名,注意如果改了root的密码，那么， mysql 就进不去了 需要制定root root
    mysql> UPDATE user SET Password=PASSWORD('密码') where USER='root';
    mysql> FLUSH PRIVILEGES
    show database;



```
* 2-配置免密登录

vi /etc/my.cnf
```
[client]  
host = "localhost"                                                                                                                
password = "密码"  
user = "root"   
port = 3306  
socket =/var/lib/mysql/mysql.sock
```

* 3 修改编码

```

二、Linux系统下面
1、中止MySQL服务（bin/mysqladmin -u root shutdown）
2、在/etc/下找到my.cnf，如果没有就把MySQL的安装目录下的support-files目录下的my-medium.cnf复制到/etc/下并改名为my.cnf即可
3、打开my.cnf以后，在[client]和[mysqld]下面均加上default-character-set=utf8，保存并关闭
4、启动MySQL服务（bin/mysqld_safe &）

非常简单，这样的修改一劳永逸，今后MySQL一切相关的默认编码均为UTF-8了，创建新表格的时候无需再次设置

需要注意的是，当前数据库中已经存在的数据仍保留现有的编码方式，因此需要自行转码，方法在网上有很多，不再赘述



注意：如果是高版本的MYSQL中，增加时，

将MySQL默认编码修改为UTF-8呢？只需在my.ini中的[mysqld]组名的末尾添加：

character-set-server=utf8

即可。那mysqld:unknown variable 'default-character-set=utf8'的错误原因是什么呢？因为参数：default-character-set=utf8 在较新版本的MySQL 中已移除。所以，建议高版本的MySQL使用”character-set-server“，而不要使用“default-character-set”。


查看字符编码：设置好后，如何查看我们设置的字符编码是否OK呢？可以在命令提示符下输入：
* mysql> SHOW VARIABLES LIKE 'char%'
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | utf8                       |
| character_set_connection | utf8                       |
| character_set_database   | latin1                     |
| character_set_filesystem | binary                     |
| character_set_results    | utf8                       |
| character_set_server     | latin1                     |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+

```




## mariadb
```
yum install mariadb-server mariadb
```

## 第二种

从官网下载mysql的repo源，然后进行滚动安装

    wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm # 下载 repo文件

    rpm -ivh mysql-community-release-el7-5.noarch.rpm  # 安装repo文件到系统

    yum install mysql-server  #安装mysql服务

    service mysqld start

    mysql
    use mysql ;

    # 注意修改 root 用户名
    mysql> UPDATE user SET Password=PASSWORD('root') where USER='密码';
    mysql> FLUSH PRIVILEGES
    show database;


## 俊杰几种方式


博主原文：https://blog.link-lin.cn/?p=25

```


mariadb数据库的相关命令是：

    systemctl start mariadb  #启动MariaDB

    systemctl stop mariadb  #停止MariaDB

    systemctl restart mariadb  #重启MariaDB

    systemctl enable mariadb  #设置开机启动

第二种：

从官网下载mysql的repo源，然后进行滚动安装

    wget http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm # 下载 repo文件

    rpm -ivh mysql-community-release-el7-5.noarch.rpm  # 安装repo文件到系统

    yum install mysql-server  #安装mysql服务

什么是repo文件？

repo文件是Fedora中yum源（软件仓库）的配置文件，通常一个repo文件定义了一个或者多个软件仓库的细节内容，例如我们将从哪里下载需要安装或者升级的软件包，repo文件中的设置内容将被yum读取和应用！
YUM的工作原理并不复杂，每一个 RPM软件的头（header）里面都会纪录该软件的依赖关系，那么如果可以将该头的内容纪录下来并且进行分析，可以知道每个软件在安装之前需要额外安装 哪些基础软件。也就是说，在服务器上面先以分析工具将所有的RPM档案进行分析，然后将该分析纪录下来，只要在进行安装或升级时先查询该纪录的文件，就可 以知道所有相关联的软件。所以YUM的基本工作流程如下：
服务器端：在服务器上面存放了所有的RPM软件包，然后以相关的功能去分析每个RPM文件的依赖性关系，将这些数据记录成文件存放在服务器的某特定目录内。
客户端：如果需要安装某个软件时，先下载服务器上面记录的依赖性关系文件(可通过WWW或FTP方式)，通过对服务器端下载的纪录数据进行分析，然后取得所有相关的软件，一次全部下载下来进行安装。



第三种，下载源代码，自己编译。



=================邪恶分割线=================

我采用的是第二种安装方式，毕竟机房的速度快

这时候，我们mysql安装完成了，但是我们还没有开始用呢，

启动mysql

    systemctl start mysqld

启动完成后，先不要登陆，先去cat一下我们mysql数据库的log日志，

    cat /var/log/mysqld.log

里面有个passwd或者password，复制里面的初始化密码

然后登陆我们的mysql数据库。

    mysql -u root -p

输入密码，回车
%
```
