# mysql 公用


# mysql 安装

## centos7 安装配置mysql8.0 

[博主记录](https://www.cnblogs.com/smiler/p/9802056.html)

# mysql 备份

## 简单备份

### mysql 备份几种方式

* 博主
[博主](http://dbaplus.cn/news-11-1267-1.html)

```
mysqldump --opt -h localhost -uroot -p+.0QMzpTBal.0+123  zrlog_demo > /home/zrlog2.txt
source D:\工作文档\我的博客\zrlog\zrlog2.sql

file --mime-encoding zrlog2.sql
iconv -l zrlog2.sql |grep bin


iconv -f binary -t utf-8 zrlog2.sql

________________________________________________________
_________________________________________________________


mysqldump --opt -h localhost -uroot -proot  test > D:\\test.sql

zrlog ：转移到本地初始化之后然后在导入数据

```


## mysql 安装

## mysql win 8.0 安装


### zip 压缩文件方式安装：https://blog.csdn.net/ycxzuoxin/article/details/80908447


### msi win 方式安装：https://blog.csdn.net/qq_42773146/article/details/82414057


## mysql win 连接问题



### mysql navicat 了解 8.0  报错

错误：
（解决方法）MySQL 8 + macOS 错误：Authentication plugin ‘caching_sha2_password’ cannot be loaded
方法：
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'yourpassword';



方法2：
问题：
当使用类似HidiSQL邓客户端连接MySQL的时候出现"Authentication plugin 'caching_sha2_password' cannot be loaded:找不到指定的模块"错误。


解决办法：
        执行如下语句：
ALTER USER 'root'@'localhost' IDENTIFIED BY 'abc@123' PASSWORD EXPIRE NEVER;
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'abc@123';
FLUSH PRIVILEGES;

ALTER USER 'root'@'localhost' IDENTIFIED BY 'abc@123';
FLUSH PRIVILEGES;
