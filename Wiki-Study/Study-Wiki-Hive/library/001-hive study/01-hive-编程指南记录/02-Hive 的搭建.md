# Hive


## Hive 介绍
Hive是怎么出现的？？ 问hive元数据 存储到哪（单用户：存储到自带的derby中，跑任务的话就存储到关系型数据库当中）， derby



接受人群多，接收容易

开发效率比较高 ，没有高可用集群之说，但是本身就是个分布式概念，因为是基于hadoop的


2.  Hive到底是什么？

是一个数据仓库工具，分布式存储

3  hive构架图？
4  Hive的安装？？
hive的安装？？

1 Hive 三种元数据存储：
Hive 将元数据存储在 RDBMS 中，有三种模式可以连接到数据库：

Single User Mode： 此模式连接到一个 In-memory 的数据库 Derby，一般用于 Unit Test。

优点：安装简单

缺点：使用hive自带的内存数据库derby来存储元数据，该数据库只支持单session

Multi User Mode：通过网络连接到一个数据库中，是最经常使用到的模式。

优点：可以支持多个用户同时连接(元数据存储到关系型数据库中)

缺点：需要安装存存储元数据的关系型数据库，hive需要进行配置


1、hive怎么出现？？
facebook对海量数据进行分析和机器学习。
提供类sql工具对数据操作。学习方便使用方便。

2、hive是什么？？
hive是一个基于hadoop的数据仓库。该仓库提供类sql语句进行读、写、管理海量数据。
hive可以使用类sql语句进行分析。

hive本身没有存储功能，也没有分析功能。它只是一个套在hadoop只上的壳子。
依赖hdfs和hbase来做数据存储。
依赖mr、spark、tez，flink,麒麟，等来做数据分析。

到底什么是Hive，我们先看看Hive官网Wiki是如何介绍Hive的(https://cwiki.apache.org/confluence/display/Hive/Home)：
The Apache Hive data warehouse software facilitates querying and managing large datasets residing in distributed storage. Built on top of Apache HadoopTM, it provides:
　　(1)、Tools to enable easy data extract/transform/load (ETL)
　　(2)、A mechanism to impose structure on a variety of data formats
　　(3)、Access to files stored either directly in Apache HDFSTM or in other data storage systems such as Apache HBaseTM
　　(4)、Query execution via MapReduce
1、是一种易于对数据实现提取、转换、加载的工具(ETL)的工具。可以理解为数据清洗分析展现。
2、它有一种将大量格式化数据强加上结构的机制。
3、它可以分析处理直接存储在hdfs中的数据或者是别的数据存储系统中的数据，如hbase。
4、查询的执行经由mapreduce完成。
5、hive可以使用存储过程

hive和hadoop的关系？？
依赖关系

hive的架构图？？
cli：command line interface
jdbc/odbc: java连接驱动
web GUI：web操作
sql： structure query language
hql： hive query language
select
*
from u
where
chinese < 60
or math < 60
or english < 60
;

Driver：解释器，将hql语句生成一个表达式树。
Compiler：编译器，将hql语句的表达式树进行语法、语义、词法等的检测。(在它之后生成逻辑策略图)
Optmizer：优化器，选择最优的执行路径，在执行语句上做优化(减少不必要的列、join合并、减少不必要的分桶、减少不必要的分区)
Executer：执行器，将执行计划给mapreduce依次执行。

metaStore：hive的元数据(库名、表名、字段、创建人、创建时间、分区、分桶、索引等信息)
hive元数据存储：
derby：默认存储在hive自带derby数据库里面。
mysql：hive可以将元数据存储关系型数据库中。如：mysql、orcal。

derby：
优点：不用配置，简单快速
缺点：只支持单session；存储量稍微小。

mysql：
优点：支持多session；存储量大。
缺点：需要配置。


hive 和 mysql 区别？？
1、hive使用mr执行引擎，mysql使用自己带的引擎。
2、hive是高延迟的，而mysql是低延迟
3、hive使用hdfs存储，而mysql使用磁盘。
4、hive数据类型偏向java，而mysql没有复杂数据类型。
5、hive不可以对局部数据进行增删改，而mysql是可以的。
6、hive的数据模型和mysql有区别。
7、hive可以大规模扩展，而mysql扩展性有约束。
8、hive的分区字段是表外，而mysql的分区字段是表内字段。

3、hive的安装？？
1、使用derby来做元数据存储安装：
解压、配置环境变量、启动(安装hadoop就需要先启动hadoop)
2、使用mysql做元数据存储：
解压配置环境变量
安装并配置mysql，启动mysql
配置hive配置文件：
将mysql的驱动包拷贝hive安装目录下的lib目录下
在mysql中手动创建hive的元数据库(hive)，并将其编码设置为latin-1。(hive对utf-8支持不是很友好)
在启动hive之前先把hadoop启动起来。
启动hive。



## Hive 的安装配置

### Hive 下载版本自己选择[下载地址](http://mirrors.shu.edu.cn/apache/hive/)

### 配置

#### 解压配置环境变量

#### 配置文件
* 1-修改conf/hive-default.xml.template ./conf/hive-site.xml

```xml
<configuration>

	<!--指定元数据库的连接信息-->

	<property>

		<name>javax.jdo.option.ConnectionURL</name>

    <!-- 注意这里的mysql 存储的是hive的元数据，数据库需要去手动创建且编码为拉丁，不能为utf-8-->
		<!--jdbc:mysql://centos1:3306/hive?characterEncoding=utf8&amp;useSSL=false ， &amp 是转义的意思 作用 & 符号-->

		<value>jdbc:mysql://lzkj01:3306/hive?useSSL=false</value>

	</property>

	<!--指定元数据库的连接的驱动-->

	<property>

		<name>javax.jdo.option.ConnectionDriverName</name>

		<value>com.mysql.jdbc.Driver</value>

	</property>

	<!--指定元数据库的用户名-->

	<property>

		<name>javax.jdo.option.ConnectionUserName</name>

		<value>hive1</value>

	</property>

	<!--指定元数据库的密码-->

	<property>

		<name>javax.jdo.option.ConnectionPassword</name>

		<value>hive1</value>

	</property>

	<!--指定hive的数据仓库目录-->

	<property>

		<name>hive.metastore.warehouse.dir</name>

		<value>/user/hive/warehouse</value>

	</property>

	<property>

		<name>hive.cli.print.current.db</name>

		<value>true<value>

			</property>

			<property>

				<name>hive.aux.jars.path</name>

				<value>$HIVE_HOME/auxlib/<value>

			</property>

</configuration>


```

* 配置 hive-env.sh 中的环境变量要告知hive hadoop安装在哪里
			export HADOOP_HOME=/usr/local/MyInstall/hadoop-2.7.5

* 2.1-创建hive元数据存储目录
      在mysql的服务器上去创建自定的hive的元数据库，并指定编码为latin（这里不创建的话，hive起不起来，还有需要注意的是mysql里面要有存储元数据的hive数据库）

![创建元数据](assets/001/20180413-f1268252.png)  


  2.2-拉取 驱动jar包     [下载地址](https://dev.mysql.com/downloads/file/?id=476197)

      将hive对应的mysql元数据库的驱动拷贝到hive根目录下的./lib目录下(cp /home/mysql-connector-java-5.1.6-bin.jar /usr/local/hive-1.2.1/lib/)
![下载jar包](assets/001/20180413-849cb44b.png)  



  2.3-配置hive-env.sh  中指定hadoop的安装目录
      这里还需要制定hadoop的安装目录Hive-env.sh.template   ->  hive-env.sh   (这里面配置制定hadoop的安装路径，一定要进行配置这里面的路径否则hive启动不起来)

	2.4-创建目录
		hadoop fs -mkdir    -p   /user/hive/warehouse
		hadoop fs -chmod g+w   /user/hive/warehouse
* 注意事项：
		如果不尽兴usessl=false ,就会报错
		Establishing SSL connection without server's identity verification is not recommended. According to MySQL 5.5.45+, 5.6.26+ and 5.7.6+ requirements SSL connection must be established by default if explicit option isn't set. For compliance with existing applications not using SSL the verifyServerCertificate property is set to 'false'. You need either to explicitly disable SSL by setting useSSL=false, or set useSSL=true and provide truststore for server certificate verification.（不建议在没有服务器身份验证的情况下建立SSL连接。根据MySQL 5.5.45+、5.6.26+和5.7.6+的要求，如果不设置显式选项，则必须建立默认的SSL连接。您需要通过设置useSSL=false来显式禁用SSL，或者设置useSSL=true并为服务器证书验证提供信任存储。）

* 先允许任意ip连接有权限，否则没有权限连接
		所以执行命令：（创建一个hive用户）
		create user 'hive1'@'%' identified by 'hive1';
		grant all on *.* to 'hive1'@192.168.153.128 identified by 'hive1';
		flush privileges;
		博客[博客链接（mysql 赋值权限问题）](https://blog.csdn.net/iw1210/article/details/54646093)

* 初始化元数据，之前初始化元数据失败，很纳闷查了百度，发现原来了官网的一句话。
		Running HiveServer2 and Beeline
		Starting from Hive 2.1, we need to run the schematool command below as an initialization step. For example, we can use "derby" as db type.
		初始化命令：schematool -dbType mysql -initSchema
		成功初始化hive元数据，如下：
					[root@lzkj01 ~]# schematool -dbType mysql -initSchema
					SLF4J: Class path contains multiple SLF4J bindings.
					SLF4J: Found binding in [jar:file:/usr/local/MyInstall/hive2.3.3/lib/log4j-slf4j-impl-2.6.2.jar!/org/slf4j/impl/StaticLoggerBinder.class]
					SLF4J: Found binding in [jar:file:/usr/local/MyInstall/hadoop-2.7.5/share/hadoop/common/lib/slf4j-log4j12-1.7.10.jar!/org/slf4j/impl/StaticLoggerBinder.class]
					SLF4J: See http://www.slf4j.org/codes.html#multiple_bindings for an explanation.
					SLF4J: Actual binding is of type [org.apache.logging.slf4j.Log4jLoggerFactory]
					Metastore connection URL:	 jdbc:mysql://lzkj01:3306/hive?useSSL=false
					Metastore Connection Driver :	 com.mysql.jdbc.Driver
					Metastore connection User:	 root
					Starting metastore schema initialization to 2.3.0
					Initialization script hive-schema-2.3.0.mysql.sql
					Initialization script completed
					schemaTool completed
* ok! 成功！ 查看mysql 中的hive元数据
		![hive元数据表](assets/001/20180416-de50f75e.png)  
* hive 进入hive客户端：show databases; 查看默认的数据库

* 其他 hive 相关问题
[cdh hive 配置](https://www.cnblogs.com/linbingdong/p/5829369.html)
[mysql权限问题](https://blog.csdn.net/iw1210/article/details/54646093)
```
mysql> grant 权限1,权限2, ... 权限n on 数据库名称.表名称 to 用户名@用户地址 identified by '连接口令';

权限1，权限2，... 权限n 代表 select、insert、update、delete、create、drop、index、alter、grant、references、reload、shutdown、process、file 等14个权限。
当权限1，权限2，... 权限n 被 all privileges 或者 all 代替时，表示赋予用户全部权限。
当 数据库名称.表名称 被 *.* 代替时，表示赋予用户操作服务器上所有数据库所有表的权限。
用户地址可以是localhost，也可以是IP地址、机器名和域名。也可以用 '%' 表示从任何地址连接。
'连接口令' 不能为空，否则创建失败。

举几个例子：
mysql> grant select,insert,update,delete,create,drop on vtdc.employee to joe@10.163.225.87 identified by ‘123′;
给来自10.163.225.87的用户joe分配可对数据库vtdc的employee表进行select,insert,update,delete,create,drop等操作的权限，并设定口令为123。

mysql> grant all privileges on vtdc.* to joe@10.163.225.87 identified by ‘123′;
给来自10.163.225.87的用户joe分配可对数据库vtdc所有表进行所有操作的权限，并设定口令为123。

mysql> grant all privileges on *.* to joe@10.163.225.87 identified by ‘123′;
给来自10.163.225.87的用户joe分配可对所有数据库的所有表进行所有操作的权限，并设定口令为123。

mysql> grant all privileges on *.* to joe@localhost identified by ‘123′;
给本机用户joe分配可对所有数据库的所有表进行所有操作的权限，并设定口令为123。

```


* hive 搭建相关问题
		要注意不同hive版本元数据需要执行的指令
		在hdfs上面创建所需要的目录并且赋予权限
		在mysql中手动创建hive元数据库（注意编码拉丁编码）

2.5- 启动命令测试


	2.5- 出现的问题
[博主1](https://blog.csdn.net/lovebyz/article/details/71698267)

## hive 常用命令
---
基本命令跟mysql差不多，但是许多语句hive还是不支持的！
###  博客[hive 命令](https://blog.csdn.net/xiaoping8411/article/details/7605039)

### Myuse

```
hive
show databases;
create database databaseName;
use databaseName;
show tables;

```
