# mysql 备份与还原



一. 备份数据库(如: test): 
①可直接进入后台即可.(MySQL的默认目录:/var/lib/mysql ) 
②输入命令: 
[root@obj mysql]# mysqldump -u root -p test>/home/bak/2015-09-10/test.sql 
Enter password: 123456

此时,已成功将数据库test备份到/home/bak/2015-9-10目录下的test.sql中. 
二. 还原数据库(如: test):

1.第一种方法. 
[root@obj root]# mysql -u root -p test < /home/bak/2015-09-10/test.sql 
Enter password:123456

2.第二种方法. 
①先登录mysql数据库,输入命令 mysql -u root -p,输入密码即可. 
②再使用数据库test, use test; 
③导入备份文件. source /home/bak/2015-09-10/test.sql;

这样数据库test的数据就还原成原先备份的数据了.



## 正常命令

mysqldump --opt -h localhost -uroot -p+.0QMzpTBal.0+123  zrlog_demo > /home/zrlog2.txt
source D:\工作文档\我的博客\zrlog\zrlog2.sql



1、解决bash: mysql: command not found 的方法

[root@DB-02 ~]# mysql -u root

-bash: mysql: command not found


原因:这是由于系统默认会查找/usr/bin下的命令，如果这个命令不在这个目录下，当然会找不到命令，我们需要做的就是映射一个链接到/usr/bin目录下，相当于建立一个链接文件。
首先得知道mysql命令或mysqladmin命令的完整路径，比如mysql的路径是：/usr/local/mysql/bin/mysql，我们则可以这样执行命令：

# ln -s /usr/local/mysql/bin/mysql /usr/bin

补充：

linux下，在mysql正常运行的情况下，输入mysql提示：
mysql command not found

遇上-bash: mysql: command not found的情况别着急，这个是因为/usr/local/bin目录下缺失mysql导致，只需要一下方法建立软链接，即可以解决：
把mysql安装目录，比如MYSQLPATH/bin/mysql，映射到/usr/local/bin目录下：
# cd /usr/local/bin
# ln -fs /MYSQLPATH/bin/mysql mysql

还有其它常用命令mysqladmin、mysqldump等不可用时候都可按用此方法解决。
注：其中MYSQLPATH是mysql的实际安装路径

 

2、mysqldump命令找不到

[root@host-10-1-1-103 data]# whereis mysql
mysql: /usr/bin/mysql /usr/lib64/mysql /usr/local/mysql /usr/share/mysql

[root@host-10-1-1-103 data]# ln -fs /usr/local/mysql/bin/mysqldump /usr/bin