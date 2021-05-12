# 创建oracle 的数据库(命名空间)


## 案例


oracle里面不叫数据库了，叫创建一个命名空间
创建表空间的语法是：
CREATE TABLESPACE tablespacename
DATAFILE ‘filename’ [SIZE integer [K|M]]
[AUTOEXTEND [OFF|ON]];
--创建用户
create user scce identified by 123;
--授权
grant connect to scce;
grant resource to scce;
grant create synonym to scce;
--连接
SQL> conn scce/123;


### 创建表命名空间


```
Oracle安装完后，其中有一个缺省的数据库，除了这个缺省的数据库外，我们还可以创建自己的数据库。

为了避免麻烦，可以用’Database Configuration Assistant’向导来创建数据库(这步一定要创建好，因为这里没有做好，会在创建表空间时出错—我就在这里花了几个小时，晕)。

创建完数据库后，并不能立即在数据库中建表，必须先创建该数据库的用户，并且为该用户指定表空间。

下面是创建数据库用户的具体过程：

1.假如现在已经建好名为’test’的数据库，此时在d:\oracle\oradata\目录下已经存在test目录（注意：我的Oracle11g安装在d:\oracle下，若你的Oracle安装在别的目录，那么你新建的数据库目录就在*\oradata\目录下）。

2.在创建用户之前，先要创建表空间：

其格式为：格式: create tablespace 表间名 datafile ‘数据文件名’ size 表空间大小;

如： 　　SQL> create tablespace test_tablespace datafile ‘d:\oracle\oradata\test\test.dbf’ size 100M;

其中’test_tablespace’是你自定义的表空间名称，可以任意取名；

‘d:\oracle\oradata\test\test.dbf’是数据文件的存放位置，’test.dbf’文件名也是任意取；

‘size 100M’是指定该数据文件的大小，也就是表空间的大小。

删除命名空间

DROP TABLESPACE test INCLUDING CONTENTS AND DATAFILES CASCADE CONSTRAINTS;

3.现在建好了名为’test_tablespace’的表空间，下面就可以创建用户了：

其格式为：格式: create user 用户 名 identified by 密码 default tablespace 表空间表;

如： 　　SQL> create user testone identified by testone default tablespace test_tablespace;

默认表空间’default tablespace’使用上面创建的表空间。

4.接着授权给新建的用户：

SQL> grant connect，resource to testone; –表示把 connect，resource权限授予testone用户

SQL> grant dba to testone; –表示把 dba权限授予给testone用户 　　授权成功。

ok! 数据库用户创建完成，现在你就可以使用该用户创建数据表了！
```



### 创建表命名空间


https://www.cnblogs.com/chanshuyi/p/3821023.html