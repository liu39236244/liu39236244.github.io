# Hbase 在集群的搭建[官网](https://hbase.apache.org/)

在搭建好Hadoop-集群之后，搭建hive 基础需要搭建hive

## Hbase 的介绍

1、hbase的背景？？

大量非结构化数据的存储。

近实时的查询。

随机，近实时查询，用hbase

数十亿行，百万列的表

2、hbase是什么？

3、Hbase的架构及组件？？

Client、zookeeper、master

region: 相当于一整张表

hlog:

memtore:

hstore:相当于列簇

Hfile:

storefile:


4、Hbase的关键概念？？

row_key  :相当于主键

column family:列簇

column:列

timestamp:版本

cell:最小单元格

5、Hbase的安装？？

6、这面这个要不要都行


---


## Hbase 的搭建

### 下载Hbase [点击下载链接](https://hbase.apache.org/)

### hbase 的配置

#### 废话

下载好hbase 的安装包，然后解压到所需安装目录中，然后配置以下环境变量
* tar -zxvf ./hbase-1.4.3-bin.tar.gz -C $install
* 配置环境变量，并且分发给小弟别忘了，同步配置文件

#### 配置hbase-env.sh
hbase-1.4.3/conf/hbase-env.sh
修改如下：
```sh
export HBASE_MANAGES_ZK=false
export JAVA_HOME=/usr/local/MyInstall/jdk1.8.0_161
# 此外还需要配置hadoop的 hdfs-site.xml 与 core-site.xml 如果不拉取这两个文件，配置一下hadoop的安装目录也是可以的
export HADOOP_HOME=/usr/local/MyInstall/hadoop-2.7.5
```

#### 配置hbase-site.xml
hbase-1.4.3/conf/hbase-site.xml

```xml
<configuration>

	<!-- 指定hbase在HDFS上存储的路径 -->

	<property>

		<name>hbase.rootdir</name>

		<!-- 高可用需要注意不能指定明明空间 -->
		 <value>hdfs://hadoop01:9000/hbase</value>
		<!-- <value>hdfs://lzkj</vaule> -->

	</property>

	<!-- 指定hbase是分布式的 -->

	<property>

		<name>hbase.cluster.distributed</name>

		<value>true</value>

	</property>

	<!-- 指定zk的地址，多个用“,”分割 -->

	<property>

		<name>hbase.zookeeper.quorum</name>

		<value>lzkj01:2181,lzkj02:2181,lzkj03:2181</value>

	</property>
	<!-- 指定hbase的监控页面端口 -->

	<property>
		<name>hbase.master.info.port</name>
		<value>60010</value>
	</property>

</configuration>
```

#### regionserver
在文件中一行写一个，每个节点的名字
```
lzkj01
lzkj01
lzkj01
```

#### 分发给小弟
scp -r /usr/local/MyInstall/hbase-1.4.3/ lzkj02:/usr/local/MyInstall/
...其它省略

#### nptd 同步时间（注意hbase 需要进行时间同步，如果不同步就会有问题）

* 博客参考
    [博客1](https://www.linuxidc.com/Linux/2015-11/124911.htm)
* 安装ntpd [中国时间服务器](http://www.pool.ntp.org/zone/cn)

```
1.安装

[root@localhost kevin]# yum -y install ntp
[root@localhost kevin]# systemctl enable ntpd
[root@localhost kevin]# systemctl start ntpd
2.启动
查看：netstat -ln|grep 123

3.配置
vim /etc/ntp.conf

#注释下面4行

server 0.centos.pool.ntp.org iburst

server 1.centos.pool.ntp.org iburst

server 2.centos.pool.ntp.org iburst

server 3.centos.pool.ntp.org iburst

替换成中国时间服务器：

#http://www.pool.ntp.org/zone/cn
server 0.cn.pool.ntp.org
server 1.cn.pool.ntp.org
server 2.cn.pool.ntp.org
server 3.cn.pool.ntp.org
4.重启
systemctl restart ntpd
就ok了
```

* 开机启动
ntpd states
systemctl enable ntpd.service 开机启动ntpd
* 第二种就是同步本机时间
vi /etc/ntp.conf
```sh
restrict 网关(ipFor.0) mask 255.255.255.0 nomodify notrap
# Please consider joining the pool (http://www.pool.ntp.org/join.html).
#server 0.centos.pool.ntp.org iburst
#server 1.centos.pool.ntp.org iburst
#server 2.centos.pool.ntp.org iburst
#server 3.centos.pool.ntp.org iburst
server 127.127.1.0  # 本地lock
```
然后，让其他机器同步第一台机器的时间
Crontab  -e    /1  *   *  *  *  /usr/sbin/ntpdate lzkj01


### hbase 命令

在启动了 zookeeper ，与hdfs 基础之上，开启 hbase ：start-hbase.sh

hmaster 可以开启多个，可以保证集群的可靠性: hbase-daemon.sh start master

关闭的时候需要逐个关闭 regionserver/ master 服务进程！

* 测试是否成功安装hbase

访问lzkj01:60010
能够看到页面说明成功！

随后可以看到hdfs 目录中会自动生成 /hbase 目录

![自动成成的hbase目录](assets/001/20180413-ee6264a8.png)  

#### 进入hbase [部分内容copy字网络博主，连接]()
* hbase shell
![hbase基本命令](assets/001/20180413-25d19518.png)  

```java

[root@lzkj01 hbase-shell]# hbase shell

SLF4J: Class path contains multiple SLF4J bindings.
SLF4J: Found binding in [jar:file:/usr/local/MyInstall/hbase-1.4.3/lib/slf4j-log4j12-1.7.10.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: Found binding in [jar:file:/usr/local/MyInstall/hadoop-2.7.5/share/hadoop/common/lib/slf4j-log4j12-1.7.10.jar!/org/slf4j/impl/StaticLoggerBinder.class]
SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
SLF4J: Actual binding is of type [org.slf4j.impl.Log4jLoggerFactory]
HBase Shell
Use "help" to get list of supported commands.
Use "exit" to quit this interactive shell.
Version 1.4.3, r172373d1f02bbe0e3da37ec25efc97d0ec69fc96, Wed Mar 21 17:21:52 PDT 2018

hbase(main):001:0> status
1 active master, 0 backup masters, 3 servers, 0 dead, 0.6667 average load

hbase(main):002:0> version
1.4.3, r172373d1f02bbe0e3da37ec25efc97d0ec69fc96, Wed Mar 21 17:21:52 PDT 2018

hbase(main):003:0> create 'member','base_info','export_4info'   
0 row(s) in 2.4610 seconds

hbase(main):005:0> list
TABLE                                                                                                                                    
member                                                                                                                                   
1 row(s) in 0.0250 seconds

hbase(main):006:0> describe 'member'
Table member is ENABLED                                                                                                                  
member                                                                                                                                   
COLUMN FAMILIES DESCRIPTION                                                                                                              
{NAME => 'base_info', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING =>
'NONE', TTL => 'FOREVER', COMPRESSION => 'NONE', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE => '0
'}                                                                                                                                       
{NAME => 'export_4info', BLOOMFILTER => 'ROW', VERSIONS => '1', IN_MEMORY => 'false', KEEP_DELETED_CELLS => 'FALSE', DATA_BLOCK_ENCODING
=> 'NONE', TTL => 'FOREVER', COMPRESSION => 'NONE', MIN_VERSIONS => '0', BLOCKCACHE => 'true', BLOCKSIZE => '65536', REPLICATION_SCOPE =>
 '0'}                                                                                                                                    
2 row(s) in 0.1680 seconds


3.删除一个列族，alter，disable，enable

我们之前建了3个列族，但是发现member_id这个列族是多余的，因为他就是主键，所以我们要将其删除。

hbase(main):003:0>alter 'member',{NAME=>'member_id',METHOD=>'delete'}



ERROR: Table memberis enabled. Disable it first before altering.



报错，删除列族的时候必须先将表给disable掉。

hbase(main):004:0>disable 'member'                                  

0 row(s) in 2.0390seconds

hbase(main):005:0>alter'member',{NAME=>'member_id',METHOD=>'delete'}

0 row(s) in 0.0560seconds

hbase(main):006:0>describe 'member'

DESCRIPTION                                                                                          ENABLED                                               

 {NAME => 'member', FAMILIES => [{NAME=> 'address', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0',false                                                 

  VERSIONS => '3', COMPRESSION => 'NONE',TTL => '2147483647', BLOCKSIZE => '65536', IN_MEMORY => 'fa                                                       

 lse', BLOCKCACHE => 'true'}, {NAME =>'info', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0', VERSI                                                       

 ONS => '3', COMPRESSION => 'NONE', TTL=> '2147483647', BLOCKSIZE => '65536', IN_MEMORY => 'false',                                                        

 BLOCKCACHE => 'true'}]}                                                                                                                                    

1 row(s) in 0.0230seconds

该列族已经删除，我们继续将表enable

hbase(main):008:0> enable 'member'  

0 row(s) in 2.0420seconds

4.列出所有的表

hbase(main):028:0>list

TABLE                                                                                                                                                       

member                                                                                                                                            

temp_table                                                                                                                                                  
2 row(s) in 0.0150seconds

5.drop一个表

hbase(main):029:0>disable 'temp_table'

0 row(s) in 2.0590seconds



hbase(main):030:0>drop 'temp_table'

0 row(s) in 1.1070seconds





6.查询表是否存在

hbase(main):021:0>exists 'member'

Table member doesexist                                                                                                                                     

0 row(s) in 0.1610seconds



7.判断表是否enable

hbase(main):034:0>is_enabled 'member'

true                                                                                                                                                        

0 row(s) in 0.0110seconds



8.判断表是否disable

hbase(main):032:0>is_disabled 'member'

false                                                                                                                                                      
0 row(s) in 0.0110seconds

三、DML操作
1.插入几条记录

put'member','scutshuxue','info:age','24'

put'member','scutshuxue','info:birthday','1987-06-17'

put'member','scutshuxue','info:company','alibaba'

put'member','scutshuxue','address:contry','china'

put'member','scutshuxue','address:province','zhejiang'

put'member','scutshuxue','address:city','hangzhou'

put'member','xiaofeng','info:birthday','1987-4-17'

put'member','xiaofeng','info:favorite','movie'

put'member','xiaofeng','info:company','alibaba'

put'member','xiaofeng','address:contry','china'

put'member','xiaofeng','address:province','guangdong'

put'member','xiaofeng','address:city','jieyang'

put'member','xiaofeng','address:town','xianqiao'


2.获取一条数据

获取一个id的所有数据

hbase(main):001:0>get 'member','scutshuxue'

COLUMN                                   CELL                                                                                                               

 address:city                           timestamp=1321586240244, value=hangzhou                                                                            

 address:contry                         timestamp=1321586239126, value=china                                                                               

 address:province                       timestamp=1321586239197, value=zhejiang                                                                            

 info:age                               timestamp=1321586238965, value=24                                                                                  

 info:birthday                          timestamp=1321586239015, value=1987-06-17                                                                          

 info:company                           timestamp=1321586239071, value=alibaba                                                                             

6 row(s) in 0.4720seconds



获取一个id，一个列族的所有数据

hbase(main):002:0>get 'member','scutshuxue','info'

COLUMN                                   CELL                                                                                                               

 info:age                               timestamp=1321586238965, value=24                                                                                  

 info:birthday                          timestamp=1321586239015, value=1987-06-17                                                                          

 info:company                           timestamp=1321586239071, value=alibaba                                                                             

3 row(s) in 0.0210seconds



获取一个id，一个列族中一个列的所有数据

hbase(main):002:0>get 'member','scutshuxue','info:age'

COLUMN                                   CELL                                                                                                               

 info:age                               timestamp=1321586238965, value=24                                                                                  

1 row(s) in 0.0320seconds





6.更新一条记录

将scutshuxue的年龄改成99

hbase(main):004:0>put 'member','scutshuxue','info:age' ,'99'

0 row(s) in 0.0210seconds



hbase(main):005:0>get 'member','scutshuxue','info:age'

COLUMN                                   CELL                                                                                                               

 info:age                               timestamp=1321586571843, value=99                                                                                  

1 row(s) in 0.0180seconds





3.通过timestamp来获取两个版本的数据

hbase(main):010:0>get 'member','scutshuxue',{COLUMN=>'info:age',TIMESTAMP=>1321586238965}

COLUMN                                   CELL                                                                                                               

 info:age                               timestamp=1321586238965, value=24                                                                                  

1 row(s) in 0.0140seconds



hbase(main):011:0>get 'member','scutshuxue',{COLUMN=>'info:age',TIMESTAMP=>1321586571843}

COLUMN                                   CELL                                                                                                               

 info:age                               timestamp=1321586571843, value=99                                                                                  

1 row(s) in 0.0180seconds


4.全表扫描：

hbase(main):013:0>scan 'member'

ROW                                     COLUMN+CELL                                                                                                        

 scutshuxue                             column=address:city, timestamp=1321586240244, value=hangzhou                                                       

 scutshuxue                             column=address:contry, timestamp=1321586239126, value=china                                                        

 scutshuxue                             column=address:province, timestamp=1321586239197, value=zhejiang                                                   

 scutshuxue                              column=info:age,timestamp=1321586571843, value=99                                                                 

 scutshuxue                             column=info:birthday, timestamp=1321586239015, value=1987-06-17                                                    

 scutshuxue                             column=info:company, timestamp=1321586239071, value=alibaba                                                        

 temp                                   column=info:age, timestamp=1321589609775, value=59                                                                 

 xiaofeng                               column=address:city, timestamp=1321586248400, value=jieyang                                                        

 xiaofeng                               column=address:contry, timestamp=1321586248316, value=china                                                        

 xiaofeng                               column=address:province, timestamp=1321586248355, value=guangdong                                                  

 xiaofeng                               column=address:town, timestamp=1321586249564, value=xianqiao                                                       

 xiaofeng                               column=info:birthday, timestamp=1321586248202, value=1987-4-17                                                     

 xiaofeng                               column=info:company, timestamp=1321586248277, value=alibaba                                                        

 xiaofeng                               column=info:favorite, timestamp=1321586248241, value=movie                                                         

3 row(s) in 0.0570seconds



5.删除id为temp的值的‘info:age’字段

hbase(main):016:0>delete 'member','temp','info:age'

0 row(s) in 0.0150seconds

hbase(main):018:0>get 'member','temp'

COLUMN                                   CELL                                                                                                               

0 row(s) in 0.0150seconds

6.删除整行



hbase(main):001:0>deleteall 'member','xiaofeng'

0 row(s) in 0.3990seconds



7.查询表中有多少行：

hbase(main):019:0>count 'member'                                        

2 row(s) in 0.0160seconds



8.给‘xiaofeng’这个id增加'info:age'字段，并使用counter实现递增

hbase(main):057:0*incr 'member','xiaofeng','info:age'                    

COUNTER VALUE = 1



hbase(main):058:0>get 'member','xiaofeng','info:age'

COLUMN                                   CELL                                                                                                               

 info:age                               timestamp=1321590997648, value=\x00\x00\x00\x00\x00\x00\x00\x01                                                    

1 row(s) in 0.0140seconds



hbase(main):059:0>incr 'member','xiaofeng','info:age'

COUNTER VALUE = 2



hbase(main):060:0>get 'member','xiaofeng','info:age'

COLUMN                                   CELL                                                                                                               

 info:age                               timestamp=1321591025110, value=\x00\x00\x00\x00\x00\x00\x00\x02                                                    

1 row(s) in 0.0160seconds



获取当前count的值

hbase(main):069:0>get_counter 'member','xiaofeng','info:age'

COUNTER VALUE = 2

9.将整张表清空：

hbase(main):035:0>truncate 'member'

Truncating 'member'table (it may take a while):

 - Disabling table...

 - Dropping table...

 - Creating table...

0 row(s) in 4.3430seconds



可以看出，hbase是先将掉disable掉，然后drop掉后重建表来实现truncate的功能的。
```

#### 启动与关闭命令

```
下面是单独启动：真正的hbase只需要启动一下: ./bin/hbase  
hbase-daemons.sh stop regionserver
hbase-daemons.sh stop master
./hbase shell
```
#### 命名空间的操作

* 博主总结
[hbase namespace 创建，与授权](https://blog.csdn.net/opensure/article/details/46470969)

```Java
create_namespace 'ai_ns'  
drop_namespace 'ai_ns'
describe_namespace 'ai_ns'
list_namespace  

create 'ai_ns:testtable', 'fm1'    // 在namespace 下面创建表
list_namespace_tables 'ai_ns'  // 查看所属命名空间下面的所有表
```




#### hbase与hadoop 的兼容性
