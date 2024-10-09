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



## mysql 集中引擎


```
MySQL 主要有以下几种存储引擎，每种存储引擎都有其独特的特点和用途：
一、InnoDB
特点：
支持事务：InnoDB 是事务安全的存储引擎，它支持 ACID（原子性、一致性、隔离性、持久性）事务特性，确保数据的完整性和一致性。
行级锁定：InnoDB 采用行级锁定机制，相比其他存储引擎的表级锁定，可以提高并发性能，特别是在高并发的读写环境中。
外键约束：支持外键约束，确保数据之间的引用完整性。
崩溃恢复：具有良好的崩溃恢复能力，在数据库发生故障时，能够快速恢复数据到一致状态。
缓冲池：使用缓冲池来缓存数据和索引，提高数据的读写性能。
适用场景：
适用于对数据完整性和事务要求较高的应用，如企业级应用、电子商务系统、金融系统等。
二、MyISAM
特点：
不支持事务：MyISAM 不支持事务处理，不满足 ACID 特性。
表级锁定：使用表级锁定机制，在高并发读写环境下，可能会导致性能下降。
高速读取：对于只读或以读为主的应用，MyISAM 可以提供较高的性能，因为它在读取操作上相对较快。
压缩存储：支持数据压缩，可以节省存储空间。
适用场景：
适用于以读为主的应用，或者对事务要求不高的场景，如数据仓库、日志系统等。
三、Memory
特点：
存储在内存中：数据存储在内存中，因此读写速度非常快。
不支持持久化：如果数据库重启或崩溃，存储在 Memory 引擎中的数据将会丢失。
表结构简单：表结构相对简单，不支持外键约束等复杂功能。
适用场景：
适用于临时数据存储、缓存数据或对性能要求极高的场景，如缓存查询结果、临时表等。
四、Archive
特点：
压缩存储：Archive 引擎主要用于存储大量的历史数据，它采用压缩存储方式，可以节省大量的存储空间。
只支持插入和查询：只支持插入和查询操作，不支持更新和删除操作，因此适用于存储历史数据的场景，如日志归档。
高压缩比：可以实现很高的压缩比，适合存储大量数据。
适用场景：
适用于数据仓库、日志归档等需要存储大量历史数据且对数据修改操作较少的场景。
五、CSV
特点：
以 CSV 格式存储数据：数据以逗号分隔值（CSV）文件的形式存储，便于与其他工具进行数据交换。
不支持索引：默认情况下不支持索引，因此查询性能相对较低。
简单易用：适用于需要与其他工具进行数据交换或存储简单数据的场景。
适用场景：
适用于数据导入导出、与电子表格等工具进行数据交换的场景。
综上所述，不同的存储引擎在事务支持、锁定机制、性能特点和适用场景等方面存在差异。在选择存储引擎时，需要根据应用的具体需求来进行选择，以确保数据库的性能和数据的完整性。
```