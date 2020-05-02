# 安装hadoop 中出现过的问题
---

## 下载问题
### 1 下jdk 8.0 使用wget 安装

* 错误操作： wget 安装JDK ：wget  https://github.com/mitsuhiko/flask/archive/master.zip
>位置：https://edelivery.oracle.com/otn-pub/java/jdk/8u161-b12/2f38c3b165be4555a1fa6e98c45e0808/jdk-8u161-linux-x64.tar.gz [跟随至新的 URL]
--2018-03-17 17:43:27--  https://edelivery.oracle.com/otn-pub/java/jdk/8u161-b12/2f38c3b165be4555a1fa6e98c45e0808/jdk-8u161-linux-x64.tar.gz
正在解析主机 edelivery.oracle.com (edelivery.oracle.com)... 184.50.91.58, 2600:1417:e:28e::2d3e, 2600:1417:e:28b::2d3e
正在连接 edelivery.oracle.com (edelivery.oracle.com)|184.50.91.58|:443... 已连接。
错误: 无法验证 edelivery.oracle.com 的由 “/C=US/O=DigiCert Inc/OU=www.digicert.com/CN=GeoTrust RSA CA 2018” 颁发的证书:
  颁发的证书还未生效。
要以不安全的方式连接至 edelivery.oracle.com，使用“--no-check-certificate”。

* 解决：
安装 中wget 需要安装、且需要加参数；
    yum -y install wget // 安装wget
    wget -c -O master.zip --no-check-certificate https://github.com/mitsuhiko/flask/archive/master.zip
        -c :断点续传
        -O :指定下载好的名字
        --no-check-certificate :不验证证书

---

### 2 环境变量
* 使用tar.gz 解压安装jdk 的时候 加压到一个目录
* 解决
原文博客：https://www.cnblogs.com/aaronLinux/p/5837702.html
    * ]# export //打印所有配置
    * ]# echo $PATH
    * ]# export PATH=/opt/STM/STLinux-2.3/devkit/sh4/bin:$PATH // 添加临时的配置
    * 永久（仅仅当前用户）
```
#vim ~/.bashrc
export PATH="/opt/STM/STLinux-2.3/devkit/sh4/bin:$PATH"
```      
    * 永久（所有用户）
```
# vim /etc/profile
在文档最后，添加:
export PATH="/opt/STM/STLinux-2.3/devkit/sh4/bin:$PATH"

或者可以分开写：
  export SH4_HOME ="/opt/STM/STLinux-2.3/devkit/sh4"
  export PATH="%SH4_HOME%/bin:$PATH"

保存，退出，然后运行：
#source /etc/profile
```

### 3 安装mysql (mysql 5.7.21 ,centos7 )

* mysql 的安装

    > 1 [博客地址(RPM安装)](https://www.cnblogs.com/pythonal/p/6141516.html)

    > 2 [博客地址(YUM配置本地yum安装离线mysql rpm包)](https://www.linuxidc.com/Linux/2016-09/135288.htm)

    > 3 [博客地址(YUM安装在线，包括密码修改)](https://www.linuxidc.com/Linux/2016-09/135288.htm)

    > 4 [博客地址(干脆安装)](http://www.mamicode.com/info-detail-2101857.html)

* 1- 自行安装记录(yum 在线安装) 方式3 -> [原文链接](https://www.linuxidc.com/Linux/2016-09/135288.htm)
    1. wget https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
    2. yum localinstall mysql57-community-release-el7-11.noarch.rpm
    3. 检验是否安装成功： yum repolist enabled | grep "mysql.*-community.*"
    ![检查mysql是否安装成功结果打印值](assets/001/20180328-3ff6ba43.png)  
    4. vi /etc/yum.repos.d/mysql-community.repo （这就是配置下载版本的，第一部你下载哪个这就下载哪个）
    ![修改配置文件，默认不用改，看看就行了](assets/001/20180328-d9dc2932.png)  
    5.  yum install mysql-community-server
    ![安装成功提示](assets/001/20180328-8954970d.png)  
    6. systemctl start mysqld
    7. systemctl status mysqld
    8. 开机启动：
```
shell> systemctl enable mysqld
shell> systemctl daemon-reload
```
    9. 获取临时密码登录mysql进行更改密码(没密码登不上，会报错)

        1.获取密码【grep 'temporary password' /var/log/mysqld.log】这个命令要完全打出来，里面temporary password 没错就原样写
        ![临时密码结果](assets/001/20180329-3d9cff6d.png)  

        2.获取到密码登录【mysql -u root -p 】，然后输入上一步的密码

        3.修改密码

        3.1 mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '你的密码!';
        3.2 mysql> set password for 'root'@'localhost'=password('你的密码!');
        【执行者一句话报错】
        You must reset your password using ALTER USER statement before executing this statement. 等于说还得用ALTER 语句先修改密码，再能执行这种set语句

        4.修改密码的密码安全监测插件

        mysql> show variables like '%password%';

        打印结果如下：

        ![打印结果](assets/001/20180329-90a844a7.png)

        注释说明：
        validate_password_policy：密码策略，默认为MEDIUM策略
        validate_password_dictionary_file：密码策略文件，策略为STRONG才需要
        validate_password_length：密码最少长度
        validate_password_mixed_case_count：大小写字符长度，至少1个
        validate_password_number_count ：数字至少1个
        validate_password_special_char_count：特殊字符至少1个

        共有以下几种密码策略：
        策略	检查规则

        0 or LOW 	Length
        1 or MEDIUM 	Length; numeric, lowercase/uppercase, and special characters
        2 or STRONG 	Length; numeric, lowercase/uppercase, and special characters; dictionary file

        MySQL官网密码策略详细说明：http://dev.mysql.com/doc/refman/5.7/en/validate-password-options-variables.html#sysvar_validate_password_policy
        修改密码策略

        在/etc/my.cnf文件添加validate_password_policy配置，指定密码策略

        5 选择0（LOW），1（MEDIUM），2（STRONG）其中一种，选择2需要提供密码字典文件
        validate_password_policy=0

        如果不需要密码策略，添加my.cnf文件中添加如下配置禁用即可：

        validate_password = off

        重新启动mysql服务使配置生效：

        systemctl restart mysqld

    10. 添加远程登录用户

        默认只允许root帐户在本地登录，如果要在其它机器上连接mysql，必须修改root允许远程连接，或者添加一个允许远程连接的帐户，为了安全起见，我添加一个新的帐户：

        mysql> GRANT ALL PRIVILEGES ON *.* TO '你的账户名'@'%' IDENTIFIED BY '你的密码' WITH GRANT OPTION;

    11. 配置默认编码为utf8
        修改之前：
        mysql> show variables like '%character%';
        ![默认编码配置](assets/001/20180329-610ff688.png)  

        修改/etc/my.cnf配置文件，在[mysqld]下添加编码配置，如下所示：
```
[mysqld]
character_set_server=utf8
init_connect='SET NAMES utf8'
```
        修改之后重启mysql服务【systemctl restart mysqld】
        mysql> show variables like '%character%';
        ![修改编码之后的配置](assets/001/20180329-a5ae3a5b.png)  

    12. 设置免密登录
    修改/etc/my.cnf配置文件，在[client]下添加编码配置，如下所示：
```
[client]
host=免密登陆的IP
user='你的账户'
password='你的账户对应的密码'
```
    然后直接 #] mysql 就可以直接登录了

      解释一下默认的配置路径：
```
默认配置文件路径：
配置文件：/etc/my.cnf
日志文件：/var/log//var/log/mysqld.log
服务启动脚本：/usr/lib/systemd/system/mysqld.service
socket文件：/var/run/mysqld/mysqld.pid
```
* 2-安装的简洁版方式4

1. wget http://dev.mysql.com/get/mysql-community-release-el7-5.noarch.rpm
2. rpm -ivh mysql-community-release-el7-5.noarch.rpm
3. yum install mysql-community-server
4. service mysqld restart
5. 由于初次装没有密码：直接登录【mysql -u root 】
6. 设置密码【set password for 'root'@'localhost' =password('password');】不需要重启就可以。
7. 安装过程的内容：
```
Installed:
  mysql-community-client.x86_64 0:5.6.26-2.el7                mysql-community-devel.x86_64 0:5.6.26-2.el7                
  mysql-community-libs.x86_64 0:5.6.26-2.el7                  mysql-community-server.x86_64 0:5.6.26-2.el7               
Dependency Installed:
  mysql-community-common.x86_64 0:5.6.26-2.el7                                                                            
Replaced:
  mariadb.x86_64 1:5.5.41-2.el7_0          mariadb-devel.x86_64 1:5.5.41-2.el7_0   mariadb-libs.x86_64 1:5.5.41-2.el7_0  
  mariadb-server.x86_64 1:5.5.41-2.el7_0  
```
8. 配置编码
    1.编码

        mysql配置文件为/etc/my.cnf
        最后加上编码配置
        [mysql]
        default-character-set =utf8
        注意：这里的字符编码必须和/usr/share/mysql/charsets/Index.xml中一致。

        ![配置编码时候注意事项](assets/001/20180329-2eccb050.png)  

    2.设置远程IP访问权限

        把在所有数据库的所有表的所有权限赋值给位于所有IP地址的root用户。

        mysql> grant all privileges on *.* to root@'%'identified by 'password';
        如果新用户不是root的话，需要先创建用户

        create user 'username'@'%' identified by 'password';  

* 3 离线安装 附上博客链接吧[原文地址](https://blog.csdn.net/nemo____/article/details/72897455)

1 安装MySQL
1、下载安装包 mysql-5.7.21-linux-glibc2.5-x86_64.tar.gz
[下载地址](https://dev.mysql.com/downloads/mysql/)
选择如下选项:linux generic linux通用版，选64位的

![mysql tar.gz linux用的安装包](assets/001/20180329-3c3ede58.png)  

2、卸载系统自带的Mariadb
rpm -qa|grep mariadb         //查询出已安装的mariadb
rpm -e --nodeps 文件名      //卸载 ， 文件名为使用rpm -qa|grep mariadb 命令查出的所有文件
3、删除etc目录下的my.cnf文件
       rm /etc/my.cnf
4、 执行以下命令来创建mysql用户组

    groupadd mysql

5、执行以下命令来创建一个用户名为mysql的用户并加入mysql用户组

    useradd -g mysql mysql

6、将下载的二进制压缩包放到/usr/local/目录下。
7、解压安装包

    tar -zxvf mysql-5.6.36-linux-glibc2.5-x86_64.tar.gz -C /usr/local/目标文件夹

8、将解压好的文件夹重命名为mysql
9、在etc下新建配置文件my.cnf，并在该文件内添加以下代码：

    [mysql]
    # 设置mysql客户端默认字符集
    default-character-set=utf8
    socket=/var/lib/mysql/mysql.sock
    [mysqld]
    skip-name-resolve
    #设置3306端口
    port=3306
    socket=/var/lib/mysql/mysql.sock
    # 设置mysql的安装目录
    basedir=/usr/local/mysql
    # 设置mysql数据库的数据的存放目录
    datadir=/usr/local/mysql/data
    # 允许最大连接数
    max_connections=200
    # 服务端使用的字符集默认为8比特编码的latin1字符集
    character-set-server=utf8
    # 创建新表时将使用的默认存储引擎
    default-storage-engine=INNODB
    lower_case_table_names=1
    max_allowed_packet=16M
10、创建步骤9中用到的目录并将其用户设置为mysql

    mkdir /var/lib/mysql
    mkdir /var/lib/mysql/mysql
    chown -R mysql:mysql /var/lib/mysql
    chown -R mysql:mysql /var/lib/mysql/mysql

启动mysql : mysql-5.7.21/bin/mysqld --initialize --user=mysql
urvL9qzy4&%z
二、配置MySQL
1、授予my.cnf的最大权限。

配置my.cnf 权限777(注意这里需要你的事mysql 用户)root用户安装的mysql不需要这一步
chmod -R 777 /etc/my.cnf （5.7 别给777，664就行）
这样修改完之后会抱错，你的mysql关不了，
所以 chmod 644 /etc/my.cnf

设置开机自启动服务控制脚本：
2、复制启动脚本到资源目录

    cp ./support-files/mysql.server /etc/rc.d/init.d/mysqld

3、增加mysqld服务控制脚本执行权限

    chmod +x /etc/rc.d/init.d/mysqld

4、将mysqld服务加入到系统服务

    chkconfig --add mysqld

5、检查mysqld服务是否已经生效

    chkconfig --list mysqld


命令输出类似下面的结果：

mysqld 0:off 1:off 2:on 3:on 4:on 5:on 6:off

表明mysqld服务已经生效，在2、3、4、5运行级别随系统启动而自动启动，以后可以使用service命令控制mysql的启动和停止。
6、启动msql（停止mysqld服务：service mysqld stop）

    service mysqld start
    或者
    systemctl restart mysql

7、将mysql的bin目录加入PATH环境变量，编辑/etc/profile文件

    vi /etc/profile

在文件最后添加如下信息：

    export PATH=$PATH:/usr/local/mysql/bin

    # 注意把系统原有的 PATH先注销了，然后添加
    export JAVA_HOME=/usr/lcoal/mysql路径/bin
    export PATH="$JAVA_HOME:$MYSQL_HOME:$PATH"
执行下面的命令使所做的更改生效：

    source  /etc/profile

8、以root账户登陆mysql

    mysql -u root -p

    设置密码 5.7.21 有密码检测，需要设置难点不过你可以区配置不尽兴检测
    ALTER USER 'root'@'localhost' IDENTIFIED BY '密码';

9、设置root账户密码 注意下面的you password改成你的要修改的密码

     use mysql

    update user set password=password('you password') where user='root'and host='localhost';

10、设置远程主机登录，注意下面的your username 和 your password改成你需要设置的用户和密码

    GRANT ALL PRIVILEGES ON *.* TO'your username'@'%' IDENTIFIED BY 'your password' WITH GRANT OPTION;

    FLUSH PRIVILEGES ;


---
