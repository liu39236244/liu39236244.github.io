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


创建库：
create database [if not exists] lzkj1603 'comment this is mydatabase';

创建表：默认创建到当前数据库(default是hive默认库)
create table if not exists u(
uname string,
chinese int,
math int,
english int
)
;

create table if not exists lzkj1603.u(
uname string,
chinese int,
math int,
english int
)
;

创建库的本质：创建一个目录
创建表的本质：在对应的库下面创建一个目录
加载数据的本质：将数据文件copy到对应的表目录下面(如果是hdfs上的目录，将是剪切)。
hive：使用的读时模式，写操作不检测数据，读数据有问题时，使用NULL代替。
mysql：使用写时模式，写操作检测数据。


切换库：
use lzkj1603;

create table if not exists u1(
uname string,
chinese int,
math int,
english int
)
;

create table if not exists u2(
uname string comment 'this is uname',
chinese int comment 'this is chinese',
math int,
english int
)
comment 'this table of u2'
row format delimited fields terminated by '\t'
lines terminated by '\n'
stored as textfile
;

为hive表加载数据：
load data [local] inpath '/home/socre' [overwrite] into table u2;
load data inpath '/home/socre' into table u2;
load local data inpath '/home/u' into table u;


CREATE TABLE log2(
id string COMMENT 'this is id column',
phonenumber bigint,
mac string,
ip string,
url string,
status1 string,
status2 string,
up int,
down int,
code int,
dt String
)
COMMENT 'this is log table'
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
LINES TERMINATED BY '\n'
stored as textfile
;

#inser into 加载数据：
insert into table log1
select * from log where phonenumber = 15649428888
;

加载数据还可以直接将数据copy到对应表目录下面。

数据模型：


查看表：
show tables;

删除表：
drop table if exists log2;
删除表本质：删除表目录

查看表：
desc [extended] log1;
describe [extended] log1;
show create table log1;

CREATE TABLE `log3`(
`id` string COMMENT 'this is id column',
`phonenumber` bigint,
`mac` string,
`ip` string,
`url` string,
`status1` string,
`status2` string,
`up` int,
`down` int,
`code` int,
`dt` string)
COMMENT 'this is log table'
ROW FORMAT DELIMITED
FIELDS TERMINATED BY ' '
LINES TERMINATED BY '\n'
STORED AS INPUTFORMAT
'org.apache.hadoop.mapred.TextInputFormat'
OUTPUTFORMAT
'org.apache.hadoop.hive.ql.io.HiveIgnoreKeyTextOutputFormat'
LOCATION
'hdfs://hadoop01:9000/user/hive/warehouse/lzkj1603.db/log1'
;

加载数据可以使用location：但是localtion后面的路径一定是hdfs中的目录。

hive有内部表和外部表：
内部表：hive默认创建内部表，也叫manager_table
外部表：需要使用external关键字创建
区别：
删除内部表将会删除元数据和真正的数据内容。
删除外部表将只会删除元数据，不删除真正的数据内容。

CREATE external TABLE log2(
id string COMMENT 'this is id column',
phonenumber bigint,
mac string,
ip string,
url string,
status1 string,
status2 string,
up int,
down int,
code int,
dt String
)
COMMENT 'this is log table'
ROW FORMAT DELIMITED FIELDS TERMINATED BY ' '
LINES TERMINATED BY '\n'
stored as textfile
;
load local data inpath '/home/data.log.txt' into table log2;

修改表属性：
修改表名：rename to
alter table log rename to log2;
修改列名：change column
alter table log4 change column ip myip String;
alter table log4 change column myip ip String comment 'this is myip' ;
alter table log4 change column myip ip String comment 'this is myip' after code;
alter table log4 change column ip myip int comment 'this is myip' first;

添加列：add columns
alter table log4 add columns(
x int comment 'this x',
y int
)
;

删除列：
alter table log4 replace columns(
x int,
y int
)
;
alter table log4 replace columns(
myip int,
id string,
phonenumber bigint,
mac string,
url string,
status1 string,
status2 string,
up int,
down int,
code int,
dt string
)
;
将内部表转换为外部表：
alter table log4 set tblproperties(
'EXTERNAL' = 'TRUE'
);
alter table log4 set tblproperties(
'EXTERNAL' = 'false'
);
alter table log4 set tblproperties(
'EXTERNAL' = 'FALSE'
);



-----------------------------hive 查询
select
*
from
join ---map阶段||reduce阶段
where ---map阶段
group by ---reduce阶段
having ----reduce阶段
sort by ---reduce阶段
distributed by --reduce阶段
order by ----reduce阶段
limit ---reduce阶段

union
union all

1、永远是小结果集驱动大结果集(小表驱动大表，小表放在左表)。
2、尽量不要使用join，但是join是难以避免的。

create table if not exists user1(
uid int,
uname String
)
row format delimited fields terminated by '\t'
;

create table if not exists sex(
sid int,
sname String
)
row format delimited fields terminated by '\t'
;

create table if not exists login(
uid int,
sid String,
logintime String
)
row format delimited fields terminated by '\t'
;


load data local inpath '/home/user' into table user1;
load data local inpath '/home/sex' into table sex;
load data local inpath '/home/login' into table login;


join 查询：
左连接(常用)
left join 、 left outer join 、 left semi join(左半开连接，只显示左表信息)
hive在0.8版本以后开始支持left join
left join 和 left outer join 效果差不多
left semi join是left join 的一种优化，并且通常用于解决exists in
hive的join中的on只能跟等值连接 "=",不能跟 > < >= <= !=

select
u.uid,
u.uname,
s.sname,
l.logintime
from user1 u
left join login l
on u.uid = l.uid
left join sex s
on l.sid = s.sid
;

select
u.uid,
u.uname,
s.sname,
l.logintime
from login l
left outer join user1 u
on u.uid = l.uid
left outer join sex s
on l.sid = s.sid
;

select
l.logintime
from login l
left semi join user1 u
on u.uid = l.uid
;

将user1表中的uid不在login表中的uid数据查询出来：
select
u1.uid,
u1.uname
from user1 u1
left join login l
on u1.uid = l.uid
where l.uid is NULL
;

left semi join来解决不存在的问题？？？


右连接(不常用)：right join 、 right outer join
hive不支持：right semi join
select
u1.*
from login l
right join user1 u1
on l.uid = u1.uid
;

select
u1.uid,
u1.uname,
s.sname,
l.logintime
from sex s
right join login l
on l.sid = s.sid
right join user1 u1
on u1.uid = l.uid
;

#####right outer join???


select
l.uid,
s.sname,
l.logintime
from sex s
right semi join login l
on l.sid = s.sid
;


from 后面跟多个表名使用","分割 、 inner join 、join ：三种效果一样
select
u1.uid,
u1.uname,
s.sname,
l.logintime
from user1 u1,sex s,login l
where
u1.uid = l.uid
and l.sid = s.sid
;

select
u1.uid,
u1.uname,
s.sname,
l.logintime
from user1 u1
inner join login l
on u1.uid = l.uid
join sex s
on l.sid = s.sid
;


join:不加where过滤，叫笛卡尔积
inner join ： 内连接
outer join ：外链接
full outer join ： 全外连接，寻找表中所有满足连接(包括where过滤)。

select
l.uid,
s.sname,
l.logintime
from login l
full outer join sex s
on l.sid = s.sid
;

hive提供一个小表标识，是hive提供的一种优化机制：/*+STREAMTABLE(l)*/
select
/*+STREAMTABLE(l)*/
u1.uid,
u1.uname,
s.sname,
l.logintime
from user1 u1
inner join login l
on u1.uid = l.uid
join sex s
on l.sid = s.sid
;


map-side join：
当有一大一小表的时候，适合用map-join。
会将小表文件缓存，放到内存中，在map端和内存中的数据一一进行匹配，连接查找关系。
hive-1.2.1 默认已经开启map-side join：hive.auto.convert.join=true
select
l.uid,
s.sname,
l.logintime
from login l
left join sex s
on l.sid = s.sid
;

hive 0.7版本以前，需要hive提供的mapjoin()标识。来标识该join为map-side join。标识已经过时，但是写上任然识别
select
/*+MAPJOIN(s)*/
l.uid,
s.sname,
l.logintime
from login l
left join sex s
on l.sid = s.sid
;

hive怎么知道将多大文件缓存？？ 23.8M
<property>
<name>hive.mapjoin.smalltable.filesize</name>
<value>25000000</value>
</property>


group by：分组，通常和聚合函数搭配使用
规则：
使用group by后，查询的字段要么出现在聚合函数中，要么出现在group by 后面。
select
l.sid,
count(*)
from login l
where l.sid <> 0
group by l.sid
;

select
l.uid,
count(*)
from login l
where l.sid <> 0
group by l.sid,l.uid
;

DEPTNO DNAME LOC
create table if not exists dept(
deptno int,
dname string,
loc string
)
row format delimited fields terminated by ','
;

load data local inpath '/home/dept' into table dept;

select
d.dname,
d.loc
from dept d
group by d.deptno,d.dname,d.loc
;

##where后面不能跟聚合函数或者聚合函数的结果，能跟普通的查询值或者是方法

select
l.uid userid,
count(*) gendercount
from login l
where l.sid <> 0 and count(*) > 5
group by l.sid,l.uid
;

having:对查询出来的结果进行过滤，通常和group by搭配使用。
select
l.sid,
count(*) gendercount
from login l
where l.sid <> 0
group by l.sid
having gendercount > 5
;

sort by ：排序，局部排序，只能保证单个reducer的结果排序。
order by: 排序，全局排序。保证整个job的结果排序。
当reducer只有1个的时候，sort by 和 order by 效果一样。建议使用sort by
通常和： desc asc .(默认升序)

select
u1.uid,
u1.uname
from user1 u1
order by u1.uid
;

设置reducer个数(等于1 或者 2)：
mapreduce.job.reduces=2

select
u1.uid,
u1.uname
from user1 u1
sort by u1.uid desc
;

distribute by：就是控制map中如何输出到reduce。
整个hive语句转换成job默认都有该过程，如果不写，
默认使用第一列的hash值来分。当只有一个reducer的时候不能体现出来。

如果distribute by和sort by 一起出现的时候注意顺序问题？？distribute by在前面


clusterd by ： 它等价于distribute by和sort by(升序)。后面跟的字段名需要一样
clusterd by它既兼有distribute by，还兼有sort by (只能是升序)

select
u1.uid,
u1.uname
from user1 u1
distribute by u1.uid
sort by u1.uid asc
;

=====上和下等价
select
u1.uid,
u1.uname
from user1 u1
cluster by u1.uid
;


limit : 限制结果集的。


union all：将两个或者多个查询的结果集合并到一起，不去重每一个结果集排序
union：将两个或者多个查询结果集合并到一起，去重,合并后的数据排序
注意：

select
u1.uid userid,
u1.uname username
from user1 u1
union all
select
s1.sid userid,
s1.sname username
from sex s1
;

select
u1.uid userid,
u1.uname username
from user1 u1
union
select
s1.sid userid,
s1.sname username
from sex s1
;


select
u1.uid userid,
u1.uname username
from user1 u1
where u1.uid > 10
union
select
s1.sid userid,
s1.sname username
from sex s1
sort by userid desc
limit 1
;
###不是很建议使用子查询
select
tmp.*
from
(
select
u1.uid userid,
u1.uname username
from user1 u1
where u1.uid > 10
union
select
s1.sid userid,
s1.sname username
from sex s1
) tmp
sort by tmp.userid desc
;

hive的hql语句中的where 后对子查询支持不是很好。通常使用in，不好。
select
l.uid
from login l
;

select
u1.uid,
u1.uname
from user1 u1
where u1.uid in (
select
l.uid
from login l
)
;

select
u1.uid,
u1.uname
from user1 u1
where u1.uid in (
select
l.uid
from login l
where l.uid = 1
)
;


--------------------------hive 分区
为什么要分区？？
当单个表数据量越来越大的时候，hive查询通常会全表扫描，这将会浪费我们不关心数据的扫描，浪费大量时间。从而hive引出分区概念
partition
怎么分区？？
看具体业务，能把一堆数据拆分成多个堆的数据就可以。
通常使用id 、 年 、 月 、天 、区域 、省份、
hive分区和mysql分区的区别？？
mysql的分区字段采用的表内字段。
hive的分区字段使用的是表外字段。
hive分区细节？？
1、分区本质是在该表下创建对应的目录。
2、分区名大小写不区分，建议不要使用中文。
3、可以查询分区信息。但是我们的分区字段相当于是一个伪字段，在元数据中存在，但是不真实存在数据内容中。

创建一级分区表：

create table if not exists day_part(
uid int,
uname string
)
partitioned by(year int)
row format delimited fields terminated by '\t'
;

load data local inpath '/home/user' into table day_part partition(year=2017);
load data local inpath '/home/sex' into table day_part partition(year=2016);

show partitions day_part;


create table if not exists day_part1(
uid int,
uname string
)
partitioned by(year int,month int)
row format delimited fields terminated by '\t'
;

load data local inpath '/home/user' into table day_part partition(year=2017,month=04);
load data local inpath '/home/sex' into table day_part partition(year=2017,month=03);

三级分区：
create table if not exists day_part2(
uid int,
uname string
)
partitioned by(year int,month int,day int)
row format delimited fields terminated by '\t'
;


对分区进行操作：
显示分区：show partitions day_part;
新增分区：空的
alter table day_part1 add partition(year=2017,month=2);
alter table day_part1 add partition(year=2017,month=1) partition(year=2016,month=12);
新增分区并加载数据：
alter table day_part1 add partition(year=2016,month=11) location "/user/hive/warehouse/lzkj1603.db/day_part1/year=2017/month=2";
修改分区的名字？？尝试
修改分区所对应的存储路径：
alter table day_part1 partition(year=2016,month=11) set location "hdfs://hadoop01:9000/user/hive/warehouse/lzkj1603.db/day_part1/year=2017/month=3";
删除分区：删除分区将会删除对应的分区目录
alter table day_part1 drop partition(year=2017,month=2);
alter table day_part1 drop partition(year=2017,month=3),partition(year=2017,month=4);

静态分区、动态分区、混合分区
静态分区：新增分区或者是加载分区数据时，已经指定分区名。
动态分区：新增分区或者是加载分区数据时，分区名未知。
混合分区：静态分区和动态分区同时存在。

动态分区的相关属性：
hive.exec.dynamic.partition=true :是否允许动态分区
hive.exec.dynamic.partition.mode=strict ：分区模式设置nostrict
strict：最少需要有一个是静态分区
nostrict：可以全部是动态分区
hive.exec.max.dynamic.partitions=1000 ：允许动态分区的最大数量
hive.exec.max.dynamic.partitions.pernode =100 ：单个节点上的mapper/reducer允许创建的最大分区

创建临时表：
create table if not exists tmp(
uid int,
commentid bigint,
recommentid bigint,
year int,
month int,
day int
)
row format delimited fields terminated by '\t'
;

load data local inpath '/home/comm' into table tmp;

创建动态分区：
create table if not exists dyp1(
uid int,
commentid bigint,
recommentid bigint
)
partitioned by(year int,month int,day int)
row format delimited fields terminated by '\t'
;

未动态分区加载数据：
insert into table dyp1 partition(year=2016,month,day)
select uid,commentid,recommentid,month,day from tmp
;

create table if not exists dyp2(
uid int,
commentid bigint,
recommentid bigint
)
partitioned by(year int,month int,day int)
row format delimited fields terminated by '\t'
;


insert into table dyp2 partition(year,month,day)
select uid,commentid,recommentid,year,month,day from tmp
;

hive提供我们一个严格模式：为咯阻止用户不小心提交恶意hql
hive.mapred.mode=nostrict : strict
如果该模式值为strict，将会阻止一下三种查询：
1、对分区表查询，where中过滤字段不是分区字段。
2、笛卡尔积join查询，join查询语句，不带on条件 或者 where条件。
select
u1.uid,
u1.uname,
l.logintime
from user1 u1
join login l
;

可以：
select
u1.uid,
u1.uname,
l.logintime
from user1 u1
join login l
where u1.uid = l.uid
;
3、对order by查询，有order by的查询不带limit语句。
select
u1.*
from user1 u1
order by u1.uid desc
;

注意：
1、尽量不要是用动态分区，因为动态分区的时候，将会为每一个分区分配reducer数量，当分区数量多的时候，reducer数量将会增加，对服务器是一种灾难。
2、动态分区和静态分区的区别，静态分区不管有没有数据都将会创建该分区，动态分区是有结果集将创建，否则不创建。
3、hive动态分区的严格模式和hive提供的hive.mapred.mode的严格模式。



----------------分桶-----------------
为什么要分桶？？分区数据依然很大，对分区数据或者表数据更加细粒度的管理。
分桶关键字：
clustered by(uid) into n buckets 、bucket 、 分桶使用表内字段
怎么分桶？？
对分桶字段进行hash值，然后将hash值模于总的桶数，然后得到桶数
分桶的意义：
1、快速抽样查询。tablesample
2、减少查询扫描数据量，提高查询效率。

create table if not exists bucket1(
uid int,
uname String
)
clustered by(uid) into 4 buckets
row format delimited fields terminated by '\t'
;

为分桶表加载数据：
分桶不能使用load方式来加载数据，而需要iinsert into方式来加载
并且需要设置属性：
hive> set hive.enforce.bucketing=true;

load data local inpath '/home/user' into table bucket1;

create table if not exists bucket7(
uid int,
uname String
)
clustered by(uid) into 4 buckets
row format delimited fields terminated by '\t'
;

insert into table bucket7
select * from user1
;

分桶查询：tablesample(bucket x out of y on uid)
注意：x不能大于y
x：所取桶的起始位置，
y：所取桶的总数，y是总桶数的因子。y大于源总桶数相当于拉伸，y小于源总桶数相当于压缩
1 out of 2
1 1+4/2
2 out of 2
2 2+4/2

1 out of 4
1 1+4

select * from bucket7;
select * from bucket7 tablesample(bucket 1 out of 4 on uid);
select * from bucket7 tablesample(bucket 2 out of 4 on uid);
select * from bucket7 tablesample(bucket 1 out of 2 on uid);
select * from bucket7 tablesample(bucket 2 out of 2 on uid);
select * from bucket7 tablesample(bucket 3 out of 2 on uid);
select * from bucket7 tablesample(bucket 1 out of 8 on uid);
select * from bucket7 tablesample(bucket 5 out of 8 on uid);



分区+分桶：(lzkjstu) uid,uname,class,master gender分区 分桶uid 基偶分桶
查询女生中的学号为基数？？
create table if not exists lzkjtmp(
uid int,
uname string,
class int,
gender int
)
row format delimited fields terminated by '\t'
;

load data local inpath '/home/lzkj' into table lzkjtmp;

create table if not exists lzkj(
uid int,
uname string,
class int
)
partitioned by(gender int)
clustered by(uid) into 2 buckets
row format delimited fields terminated by '\t'
;

insert into table lzkj partition(gender)
select uid,uname,class,gender from lzkjtmp;

####查询女生中的学号为基数？？
select * from lzkj where gender = 2 and uid%2 != 0;
select * from lzkj tablesample(bucket 2 out of 2 on uid) where gender = 2;

##
分桶使用内部关键字，分区使用的是外部字段。
两者都是对hive的一个优化。
分区和分桶的数量都要合理设置，不是越多越好。

抽样：
select * from user1 order by rand() limit 3;
select * from user1 limit 3;
select * from user1 tablesample(3 rows);
select * from user1 tablesample(20B); ##最小单位是B
select * from user1 tablesample(20 percent);

--------------------------serde
serde:
serialize:序列化
deserialize:反序列化

常见的serde：CSV(comma split value) 、 TSV(Tab ) 、 Json

属性默认值：
with serdeproperties(
'separatorChar'="," , #指定分割符
'qutoChar'='"' #指定字段的引号
'escapeChar'='\' #指定转移符
)

创建表csv：
create table if not exists csv1(
uid int,
uname string
)
row format serde 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
;

load data local inpath '/home/1603.csv' into table csv1;

create table if not exists csv2(
uid int,
uname string
)
row format serde 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
with serdeproperties(
'separatorChar'=',',
'qutoChar'='"',
'escapeChar'="\\"
)
store as textfile
;
load data local inpath '/home/1603.csv' into table csv2;


josn serde:

在cli端添加所需jar:add jar /home/json-serde-1.3-jar-with-dependencies.jar;

create table if not exists json1(
id int,
content string
)
row format serde 'org.openx.data.jsonserde.JsonSerDe'
;

create table if not exists json2(
id int,
content string
)
row format delimited fields terminated by ','
;

load data local inpath '/home/js1' into table json2;

{"id":1,"content":"this is first content"}
{"id":2,"content":"this is second content"}

create table if not exists json3(
provice string,
city Array<String>,
person map<String,Array<Int>>
)
row format serde 'org.openx.data.jsonserde.JsonSerDe'
;
load data local inpath '/home/js2' into table json3;
{"provice":"山西","city":["大同","临汾","太原"],"person":{"man":[100,200,50],"woman":[80,120,30]}}
{"provice":"河北","city":["石家庄","保定","唐山"],"person":{"man":[200,300,80],"woman":[100,160,89]}}

select * from json3 where size(city) >=3 and person["woman"][0] > 80;

serde hive提供一些默认serde，第三方也有提供，自己也可以自定义。

###RegexSerDe????



-------------------hive的数据类型
基础数据类型
复杂数据类型
：
tinyint 1字节(-128~127)
smallint 2
int 4
bigint 8
double 8
float 4
String
boolean 1 (true/false)
binary hive 0.8以后才有
timestamp hive 0.8以后才有(2017-04-20 09:28:00)

java中有的hive没有的：
char
short
byte
long


create table if not exists base(
id tinyint,
id1 smallint,
id2 int,
id3 bigint,
salary double,
salary1 float,
isok boolean,
content binary,
dt timestamp
)
row format delimited fields terminated by ' '
;


复杂数据类型：
Array ：数组。 arr Array<dataType>
map ：key-value集合。 map1 Map<String,int>
struct ： 结构体。 str1 Struct<String,String,string,...>



create table if not exists arr1(
uname string,
ie Array<String>
)
row format delimited fields terminated by ' '
;

create table if not exists arr2(
uname string,
ie Array<String>
)
row format delimited fields terminated by ' '
collection items terminated by ','
;

zs 120.3,168.6
ww 121.3,158.2
ls 122.2,160.3
load data local inpath '/home/ie' into table arr2;

数组长度大等于2 查询姓名和第一个元素
select
a.uname,
a.ie[0]
from arr2 a
where size(a.ie) >=2
;


集合： 两个分隔符指定顺序不能颠倒
create table if not exists map1(
uname string,
mp1 Map<String,Double>
)
row format delimited fields terminated by ' '
collection items terminated by ','
map keys terminated by ':'
;

zs high:180,weight:130
li high:177,weight:120
load data local inpath '/home/m1' into table map1;

查询map长度大于等于2 身高大于178的用户的名字 、 升高 、体重
select
m.uname,
m.mp1["high"],
m.mp1["weight"]
from map1 m
where size(m.mp1) >= 2
and m.mp1["high"] > 178
;

Struct：结构体
create table if not exists struct1(
uname string,
str1 Struct<chinese:String,cscore:double,math:String,mscore:String>
)
row format delimited fields terminated by ' '
collection items terminated by ','
;

create table if not exists struct2(
uname string,
str1 Struct<chinese:double,math:double>
)
row format delimited fields terminated by ' '
collection items terminated by ','
;


zs 80,88
ls 90,68
load data local inpath '/home/str' into table struct2;

查询结构体长度大于等于2 语文大于85 的用户名 、语文 、数学
select
s.uname,
s.str1.chinese,
s.str1.math
from struct2 s
where
s.str1.chinese > 85
;

####map array的组合 ???????
create table if not exists map1(
uname string,
m1 Map<string,Array<int>>
)
row format delimited fields terminated by ' '
collection items terminated by ','
map keys terminated by ':'
;

创建表：
create table if not exists comtax(
id int,
belone Array<int>,
tax Map<String,int>,
add Struct<province:String,city:String,street:String>
)
row format delimited fields terminated by '\t'
collection items terminated by " "
map keys terminated by ":"
stored as textfile
;

1 20,21,22,23 wuxian:300 gongjijin:600 北京 海淀 天丰利
2 30,31,32,33 wuxian:322 gongjijin:800 北京 大兴 天宫院
load data local inpath '/home/comtax' into table comtax;


----------------hive 内部函数
1、rand()
select rand();
2、split(str,splitor) #注意特殊分割符的转义
select split(5.0,"\\.")[0];
select split(rand()*100,"\\.")[0];
3、substr(str,x,y) substring()
select substr(rand()*100,0,2);
select substring(rand()*100,0,2);
4、if(expr,truestament,falsestament)
select if(100>10,"this is true","this is false");
select if(2=1,"男","女");
select if(1=1,"男",(if(1=2,"女","不知道")));
select if(3=1,"男",(if(3=2,"女","不知道")));
5、case i when v ...else end; case when i<expr when ..else end;
select
case 6
when 1 then "100"
when 2 then "200"
when 3 then "300"
when 4 then "400"
else "others"
end
;

create table if not exists cw(
flag int
)
;
load data local inpath '/home/flag' into table cw;
select
case c.flag
when 1 then "100"
when 2 then "200"
when 3 then "300"
when 4 then "400"
else "others"
end
from cw c
;


select
case
when 1=c.flag then "100"
when 2=c.flag then "200"
when 3=c.flag then "300"
when 4=c.flag then "400"
else "others"
end
from cw c
;

6、regexp_replace(str,regex,"替换成什么样")
select regexp_replace("1.jsp",".jsp",".html");

7、cast ： 类型转换 cast(str as double)
select 1;
select cast(1 as double);
select cast("12" as int);

8、concat(str1,str2,...) concat_ws()

select "千峰" + 1603 + "班级";
select concat("千峰",1603,"班级");
select concat_ws("|","千峰","1603","班级");

9、排名函数：
row_number(): 名次不并列
rank():名次并列，但空位
dense_rank():名次并列，但不空位

id class score
1 1 90
2 1 85
3 1 87
4 1 60
5 2 82
6 2 70
7 2 67
8 2 88
9 2 93

1 1 90 1
3 1 87 2
2 1 85 3
9 2 93 1
8 2 88 2
5 2 82 3

create table if not exists uscore(
uid int,
classid int,
score double
)
row format delimited fields terminated by '\t'
;
load data local inpath '/home/uscore' into table uscore;

select
u.uid,
u.classid,
u.score
from uscore u
group by u.classid,u.uid,u.score
limit 3
;


select
u.uid,
u.classid,
u.score,
row_number() over(distribute by u.classid sort by u.score desc) rn
from uscore u
;

##取前三名
select
t.uid,
t.classid,
t.score
from
(
select
u.uid,
u.classid,
u.score,
row_number() over(distribute by u.classid sort by u.score desc) rn
from uscore u
) t
where t.rn < 4
;

####查看三个排名区别
select
u.uid,
u.classid,
u.score,
row_number() over(distribute by u.classid sort by u.score desc) rn,
rank() over(distribute by u.classid sort by u.score desc) rank,
dense_rank() over(distribute by u.classid sort by u.score desc) dr
from uscore u
;

聚合函数：min() max() count() count(distinct ) sum() avg()
count(1):不管正行有没有值，只要出现就累计1
count(*):正行值只要有一个不为空就给类计1
count(col)：col列有值就累计1
count(distinct col)：col列有值并且不相同才累计1


######
几乎任何数和 NULL操作都返回NULL


& ： 同真为真，其余全假
| ： 同假为假，其余全真

&& 和 || 不行？？？

size()
round()
select length("");
locat()
trim()
parse_url()
hash()



select from_unixtime(timestamp,"yyyy-MM-dd")
select unix_timestamp();
select unix_timestamp("2017-04-19 00:00:00");
select year("2017-04-19 00:00:00");
select month("2017-04-19 00:00:00");
select day("2017-04-19 00:00:00");
select hour("2017-04-19 00:00:00");
select weekofyear("2017-04-19 00:00:00");

------------------------udf 函数
为什么需要udf？
1、因为内部函数没法满足需求。
2、hive它本身就是一个灵活框架，允许用自定义模块功能，如可以自定义udf、serde、输入输出等。
udf是什么？
udf：user difine function，用户自定义函数，一对一。常用
udaf:user define aggregate function,用户自定义聚合函数，多对一。
udtf：user define table_generate function，用户自定义表生成函数，一对多。
怎么变写udf函数？？
1、该类需要继承UDF,重写evaluate(),允许该方法重载。
2、也可以继承 generic UDF,需要重写 initliaze() 、 getDisplay() 、 evaluate()

udf的使用？？
第一种方法：(当前session有效)
1、添加自定udf的jar包
hive>add jar /home/h2h.jar;
2、创建临时函数
hive>create temporary function myfunc as "edu.qianfeng.udf.FirstUdf";
3、测试是否添加好：
show functions;
select myfunc("1603");
4、确定无用时可以删除：
drop temporary function myfunc;

第二种：(当前session有效)
1、添加自定udf的jar包(hive.aux.jars.path在该目录下的jar会在hive启动时自动加载)
<property>
<name>hive.aux.jars.path</name>
<value>$HIVE_HOME/auxlib</value>
</property>
2、创建临时函数
hive>create temporary function ktv as "edu.qianfeng.udf.KeyToValue";
3、测试是否添加好：
show functions;
select myfunc("1603");
4、确定无用时可以删除：
drop temporary function myfunc;

第三种：(当前session有效)
1、创建一个初始化文件：
vi ./init-hive
add jar /home/h2h.jar;
create temporary function ktv1 as "edu.qianfeng.udf.KeyToValue";
2、启动使用命令：hive -i ./init-hive

3、测试是否添加好：
show functions;
select myfunc("1603");
4、确定无用时可以删除：
drop temporary function myfunc;


第四种：(做成永久性)
需要对源码编译。
1)将写好的Jave文件拷贝到~/install/hive-0.8.1/src/ql/src/java/org/apache/hadoop/hive/ql/udf/
cd ~/install/hive-0.8.1/src/ql/src/java/org/apache/hadoop/hive/ql/udf/
ls -lhgt |head
2)修改~/install/hive-0.8.1/src/ql/src/java/org/apache/hadoop/hive/ql/exec/FunctionRegistry.java，增加import和RegisterUDF

import com.meilishuo.hive.udf.UDFIp2Long; //添加import

registerUDF("ip2long", UDFIp2Long.class, false); //添加register
3)在~/install/hive-0.8.1/src下运行ant -Dhadoop.version=1.0.1 package
cd ~/install/hive-0.8.1/src
ant -Dhadoop.version=1.0.1 package
4)替换exec的jar包，新生成的包在/hive-0.8.1/src/build/ql目录下,替换链接
cp hive-exec-0.8.1.jar /hadoop/hive/lib/hive-exec-0.8.1.jar.0628
rm hive-exec-0.8.1.jar
ln -s hive-exec-0.8.1.jar.0628 hive-exec-0.8.1.jar
5)重启进行测试



4、数据：根据key找value：
{"code":0,"success":true,"message":"请求成功","data":{"supplier":{"isSupportMultipleJourney":0,"rows":[{"resId":1683581010,"departureDates":null,"agencyId":28600,"companyName":"春之旅（呼和浩特）/尾货","aggregationAgencyId":9002459,"aggregationCompanyName":"内蒙春之旅","fullName":"内蒙古春之旅旅行社有限公司","groundOperatorsId":0,"groundOperatorsName":null,"satisfactionInfo":[{"satisfactionNum":0.8689,"satisfactionDifference":-0.0454,"targetAreaCode":8,"targetSecondGroupCode":209}]}],"displayDestGroupName":"本州"}}}


5、根据key找到value。
如：sex=1&hight=180&weight=130&sal=28000
select fun1("sex=1&hight=180&weight=130&sal=28000","weight") 130


6、字符串反转：如：www.baidu.com
select fun1("www.baidu.com"); moc.udibd.www

7、域名反转：如：www.baidu.com
select fun1("www.baidu.com"); com.baidu.www

8、根据生日获取星座：
select fun1("2016-12-16"); 摩羯座

"摩羯座","水瓶座","双鱼座" ,"白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座"



9、获取字符串拆分后指定位置的字符：
select fun1("北京市 海淀区 中关村"," ",1); 海淀区

10、正则表达式解析日志：
解析前：
220.181.108.151 - - [31/Jan/2012:00:02:32 +0800] \"GET /home.php?mod=space&uid=158&do=album&view=me&from=space HTTP/1.1\" 200 8784 \"-\" \"Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)\"
解析后：
220.181.108.151 20120131 120232 GET /home.php?mod=space&uid=158&do=album&view=me&from=space HTTP 200 Mozilla

5、根据key找到value。
如：sex=1&hight=180&weight=130&sal=28000
select fun1("sex=1&hight=180&weight=130&sal=28000","weight") 130


6、字符串反转：如：www.baidu.com
select fun1("www.baidu.com"); moc.udibd.www

7、域名反转：如：www.baidu.com
select fun1("www.baidu.com"); com.baidu.www

8、根据生日获取星座：
select fun1("2016-12-16"); 摩羯座

"摩羯座","水瓶座","双鱼座" ,"白羊座","金牛座","双子座","巨蟹座","狮子座","处女座","天秤座","天蝎座","射手座"

22,20,19,21,21,21,22,23,23,23,23,22

0.22<1.20
1.20-2.19
2.19-3.21
d s m-1
1.11 11 22 0
2.18 18 20 1
3.22 22 19 3
5.12 12 21 4


9、获取字符串拆分后指定位置的字符：
select fun1("北京市 海淀区 中关村"," ",1); 海淀区

10、正则表达式解析日志：
解析前：
220.181.108.151 - - [31/Jan/2012:00:02:32 +0800] \"GET /home.php?mod=space&uid=158&do=album&view=me&from=space HTTP/1.1\" 200 8784 \"-\" \"Mozilla/5.0 (compatible; Baiduspider/2.0; +http://www.baidu.com/search/spider.html)\"
解析后：
220.181.108.151 20120131 120232 GET /home.php?mod=space&uid=158&do=album&view=me&from=space HTTP 200 Mozilla

##
```
^()()()$
^([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}) - - \[(.*)\] (.*) (.*) .*$


String regex = "^([0-9.]+\\d+) - - \\[(.* \\+\\d+)\\] .+(GET|POST) (.+) (HTTP)\\S+ (\\d+) .+ \"([A-Za-z]+).+$";
String regex = "^([0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}) - - \\[(.* \\+\\d+)\\] .+(GET|POST) (.+) (HTTP)\\S+ (\\d+) .+ \"([A-Za-z]+).+ \\+(.*)\\).+$";
```


-----------UDAF------------
1、求一列的最大值
public class myMax extends UDAF{
public static class MaximumIntUDAFEvaluator implements UDAFEvaluator{
private IntWritable result;
@Override
public void init() {
result = null;
}
public boolean iterate(IntWritable value){
if(value==null){
return true;
}
if(result==null){
result = new IntWritable(value.get());
} else {
result.set(Math.max(result.get(), value.get()));
}
return true;
}
public IntWritable teminatePartial(){
return result;
}
public boolean merge(IntWritable other){
return iterate(other);
}
public IntWritable terminate(){
return result;
}
}
}


* hive 数据导入导出

hive没有严格数据格式。
hive不能像mysql一样进行局部数据的插入、修改、删除。
数据导入：
1、从linux中导入到hive表中
2、从hdfs中导入的hive表中
3、从hive一张表中导入到另外一张表中
4、手动copy到hive表目录下
5、location hdfs的目录导入
6、like location (克隆表)
7、CTAS 导入hive表
8、from 多表导入


load data local inpath '/home/hd' overwirte into table hd;
load data inpath '/home/hd' overwirte into table hd;
insert into table hd
select * from hdtmp [where];
create table if not exists user2(
uid bigint,
uname string
)
row format delimited fields terminated by '\t'
location 'hdfs://hadoop01:9000/user/hive/warehouse/lzkj1603.db/user1'
;

create table log5 like log4; ###克隆表结构
###克隆表结构并加载数据
create table log6 like log4 location "hdfs://hadoop01:9000/user/hive/warehouse/lzkj1603.db/log4";

##ctas
create table if not exists log7
as
select myip,id,phonenumber,dt
from log4
where id = 15
;
####CTAS 没有结果集任然会创建表
create table if not exists log8
as
select myip,id,phonenumber,dt
from log4
where id = 15
;


create table if not exists log9(
myip string,
id bigint
)
row format delimited fields terminated by '\t'
;

create table if not exists log10(
myip string,
id bigint,
phonenumber string
)
row format delimited fields terminated by '\t'
;
##from 一次扫描多次导入
from log4
insert into log9
select myip,id
where id=15649428888
insert into log10
select myip,id,phonenumber
where id = 15652106622
;


数据导出：
1、将hive中的数据导出到linux目录中
2、将hive表中的数据导出到hdfs目录中
3、将hive表中的数据到处去hive的一张表中#######
4、将hive表中的数据导出到linux的文件中
insert overwrite [local] directory #####不是insert into
insert overwrite local directory '/home/out/00'
select * from log9
;

insert overwrite directory '/home/out/00'
select * from log9
;
###解决导出后数据字段分隔符问题：
insert overwrite local directory '/home/out/01'
row format delimited fields terminated by '\t'
select * from log9
;

hive -e "use lzkj1603;select * from log9" >> /home/out/02;
### -S 静音模式，不会输出和结果集无关信息
hive -S -e "use lzkj1603;select * from user1" > /home/out/03;

---------------------hive 的视图(view)
视图是什么？？
视图相当于一个表。
hive目前只支持逻辑视图，而不支持物理视图。
视图的优点：
1、降低复杂查询。
2、可以将数据很好过滤(局部暴露)。

1、创建视图 CVAS
create view if not exists v1 as select * from user1;
create view if not exists v2 as select * from u;
????视图是否可以克隆 like???
create view if not exists v2 like v1;

查询视图：
select * from v1 where id = 10000;

2、显示视图：
show tables;
###
DDL：数据结构定义语言(操作表结构的命令)。create 、 drop 、create database 、alter 、
DML：数据操作语言(操作数据的命令)。insert 、 select 、drop 、
3、查看视图
desc v1;
desc extended v1;
show create table v1;

4、删除视图
drop view if exists v2;

###
1、视图不能用insert into 或者load方式来加载数据。
2、切忌将表删除后查询视图。


-----------------hive 的索引
索引是数据库的标准技术，它可以提高数据查询效率。

hive是0.7版本后开始支持索引，但是hive对索引效果并不是很理想。

索引的优点：先扫描索引文件，将阻止全表扫描；提高查询效率。
索引的缺点：冗余存储；对数据写入将变慢。
索引文件本身排序，再加上索引文件较小，索引扫描索引文件比较快速。

先创建表：
create table if not exists idx(
id bigint,
url string,
kv string,
dt bigint
)
row format delimited fields terminated by '001'
;
load data local inpath '/home/bhv_14139.txt' overwrite into table idx;

创建索引前查询：
select count(id) from idx; 32.558 seconds
创建索引后查询：
select count(id) from idx; 21.381 seconds


创建索引：
create index idx_idx_id
on table idx(id)
as 'compact'
with deferred rebuild
;

创建联合索引：
create index idx_idx_id_dt
on table idx(id,dt)
as 'compact'
with deferred rebuild
;

###bitmap类型：也可以创建联合索引：
create index idx_idx_idbm
on table idx(id)
as 'bitmap'
with deferred rebuild
;

修改索引：(相当于重建索引，不可以修改索引的名字？？尝试是否可以修改)
alter index idx_idx_idbm
on idx rebuild
;


显示索引：
show index on 表名;

删除索引：
drop index idx_idx_idbm on idx;

关于索引属性：

<property>
<name>hive.optimize.index.filter</name>
<value>false</value>
<description>Whether to enable automatic use of indexes</description>
</property>
<property>
<name>hive.optimize.index.autoupdate</name>
<value>false</value>
<description>Whether to update stale indexes automatically</description>
</property>
<property>
<name>hive.index.compact.binary.search</name>
<value>true</value>
<description>Whether or not to use a binary search to find the entries in an index table that match the filter, where possible</description>
</property>
<property>
<name>hive.optimize.index.groupby</name>
<value>false</value>
<description>Whether to enable optimization of group-by queries using Aggregate indexes.</description>
</property>
<property>


-------------------------hive 的log----------------
hive的分为系统log、query log
系统log：启动停止hive服务、hive运行产生的log日志
query log：hive语句执行产生的log日志

系统log的配置：
hive.log.dir=${java.io.tmpdir}/${user.name}
hive.log.file=hive.log
log4j.appender.DRFA=org.apache.log4j.DailyRollingFileAppender

log4j.appender.DRFA.File=${hive.log.dir}/${hive.log.file}

log4j.appender.DRFA.DatePattern=.yyyy-MM-dd

querylog配置：？？
<property>
<name>hive.querylog.location</name>
<value>${system:java.io.tmpdir}/${system:user.name}</value>
<description>Location of Hive run time structured log file</description>
</property>


----------------hive的列的分割符------------------
##hive>! cmd; 可以执行
hive>! pwd;
##操作hdfs文件系统：
hive>dfs -ls /user/hive/warehouse;

hive的默认字段分割符： ^A (ctrl+v,ctrl+A) 。而不是tab
tab
,
|

^A 001 \001 \u0001 (001不能写成00001、01、1、0001)
^B 002
^C 003

create table if not exists ua1(
id int,
uname string
)
row format delimited fields terminated by '\001'
;

create table if not exists ua2(
id int,
uname string
)
row format delimited fields terminated by '\0001'
;

load data local inpath '/home/ua2' into table ua2;



#####---------hive 压缩 -----------------
map端的压缩：
mapreduce.map.output.compress=true; #是否对map输出进行压缩
mapreduce.map.output.compress.codec=org.apache.hadoop.io.compress.DefaultCodec;
hive.exec.compress.intermediate=false #是否开启中间压缩
hive.intermediate.compression.codec=;
hive.intermediate.compression.type=NONE|RECORD|BLOCK;

insert overwrite local directory '/home/out/01'
row format delimited fields terminated by '\t'
select * from log9
;


reduce端的压缩：
hive.exec.compress.output=false; #默认最终输出不压缩true
mapred.output.compression.codec=org.apache.hadoop.io.compress.DefaultCodec;
设置压缩类型？？


1.hql
hive.exec.compress.output=true;
insert overwrite local directory '/home/out/03'
row format delimited fields terminated by '\t'
select * from user1
;
hive.exec.compress.output=false;


#通过squenceFile压缩：
创建表的时候保存文件类型为sequencefile:

局部压缩：(通过在hql文件中或者是cli端设置属性)


全局压缩：(直接通过配置文件hive-site.xml)



------------------hive 存储格式
hive的存储格式通常是三种：textfile 、 sequencefile 、 rcfile 、 orc 、自定义
set hive.default.fileformat=TextFile;
默认存储格式为：textfile
textFile:普通文本存储，不进行压缩。查询效率较低。

sequencefile:hive提供的二进制序列文件存储，天生压缩。

##sequeceFile 和 rcfile都不允许使用load方式加载数据。需要使用insert 方式插入


##默认支付压缩、分割，使用便捷、写和查询较快。sequencefile和压缩属性可以搭配使用。
create table if not exists seq1(
id int,
name string
)
row format delimited fields terminated by '\t'
lines terminated by '\n'
stored as sequencefile
;

###加载数据 不ok
load data local inpath '/home/user' into table seq1;
###加载数据 ok
insert into table seq1
select * from user1
;


rcfile：rcfile可以进行行列混合压缩，将附近的列和行的数据尽量保存到相同的块里面，该存储格式会提高查询效率，但是写数据较慢。该方式和gzcodeC压缩属性结合不是很好()
set mapred.output.compression=true;
set mapred.output.compression.codec=org.apache.hadoop.io.compress.GzipCodec;

##创建rcfile表：
create table if not exists rc1(
id int,
name string
)
row format delimited fields terminated by '\t'
stored as rcfile
;

create table if not exists rc2(
id int,
name string
)
row format delimited fields terminated by '\t'
stored as rcfile
;

###加载数据 不ok
load data local inpath '/home/user' into table rc1;
###加载数据 ok
insert into table rc2
select * from user1
;


存储自定义：
数据：
seq_yd元数据文件：
aGVsbG8saGl2ZQ==
aGVsbG8sd29ybGQ=
aGVsbG8saGFkb29w
seq_yd文件为base64编码后的内容，decode后数据为：

hello,hive
hello,world
hello,hadoop


create table cus(str STRING)
stored as
inputformat 'org.apache.hadoop.hive.contrib.fileformat.base64.Base64TextInputFormat'
outputformat 'org.apache.hadoop.hive.contrib.fileformat.base64.Base64TextOutputFormat';

LOAD DATA LOCAL INPATH '/home/cus' INTO TABLE cus;

###通常是使用 defaultCodec + rcfile搭配效率最好

---------------------hive的运行方式--------------
hive的属性设置：
1、在cli端设置 (只针对当前的session)
3、在java代码中设置 (当前连接)
2、在配置文件中设置 (所有session有效)

设置属性的优先级依次降低。
cli端只能设置非hive启动需要的属性。(log属性,元数据连接属性)


查找所有属性：
hive>set;
查看当前属性的值：通常是hadoop
hive> set -v;
模糊查找属性：
hive -S -e "set" | grep current;
hive -S -e "set" | grep index;


###hive变量：system 、 env 、hivevar 、hiveconf
system ：系统级别环境变量(jvm、hadoop等)，可读可写
hive> set system:min.limit = 3;
hive> set system:min.limit;
system:min.limit=3

env：环境变量 (HADOOP_HOME)，只读不能写。
hive> set env:PWD;
env:PWD=/usr/local/hive-1.2.1

hivevar：自定义临时变量(可读可写)
hive> set hivevar:min.limit=3;
hive> set hivevar:min.limit;
hivevar:min.limit=3
hive> set hivevar:min.limit=2;
hive> set hivevar:min.limit;
hivevar:min.limit=2

hiveconf:自定义临时属性变量(可读可写)
hive> set hiveconf:max.limit=10;
hive> set hiveconf:max.limit;
hiveconf:max.limit=10
hive> set hiveconf:max.limit=6;
hive> set hiveconf:max.limit;
hiveconf:max.limit=6

hive的运行方式：
1、cli端运行 (临时统计、开发)
2、hive -S -e "hql 语句"; (适合单个hql的query语句)
3、hive -S -f /hql文件; (hql文件的脚本)

#不带参数
hive -S -e "use lzkj1603;select * from user1;"
hive -S -f /home/su.hql;

hive在0.9版本以前是不支持的-f 带参数的执行：
hive --hivevar min_limit=3 -hivevar -hivevar t_n=user1 -e 'use lzkj1603;select * from ${hive:t_n} limit ${hivevar:min_limit};'
hive --hiveconf min_lit=3 -e "use lzkj1603;select * from user1 limit ${hiveconf:min_lit};"
hive -S --hiveconf t_n=user1 --hivevar min_limit=3 -f ./su.hql


hive中注释：
--注释内容

insert overwrite local directory '/home/out/05'
select * from user1 limit 3;



###----------------------hive 优化--------------
1、环境优化(linux 句柄数、应用内存分配、是否负载等)
2、应用配置属性方面的优化。
3、代码优化(hql，尝试换一种hql的写法)。


1、学会看explain
explain :显示hql查询的计划。
explain extended :显示hql查询的计划。还会显示hql的抽象表达式树。(就是解释器干得事)

explain select * from user1;
explain extended select * from user1;

一个hql语句将会有一个或者多个stage构成。每一个stage相当于一个mr的job，
stage可以是一个Fetch 、 map join 、 limit 等操作。
每一个stage都会按照依赖关系依次执行，没有依赖关系的可以并行执行。



2、对limit的优化：
hive.limit.row.max.size=100000
hive.limit.optimize.limit.file=10
hive.limit.optimize.enable=false

3、对join的优化：
永远是小表驱动大表(小结果集驱动大结果集)
必要时候使用小表标识 /*+STREAMTABLE(小表别名)*/
将业务调整为能尽量使用map-side join:
hive.auto.convert.join:
smalltable:
尽量避免笛卡尔积的join查询，即便有咯也需要使用on 或者where 来过滤。
hive目前的join 只支持等值连接(= and)。其它的不行

4、使用hive本地模式(在一个jvm里面运行)
hive.exec.mode.local.auto=false
hive.exec.mode.local.auto.inputbytes.max=134217728
hive.exec.mode.local.auto.input.files.max=4

5、hive并行执行(stage之间没有相互依赖关系的可以并行执行)
hive.exec.parallel=false
hive.exec.parallel.thread.number=8

6、严格模式：
hive提供的严格模式阻挡三种查询：
1、
2、
3、join查询语句，不带on条件 或者 where条件。

7、设置mapper 和 reduce个数
mapper个数太多，启动耗时，个数太少，资源利用不充分
reducer个数太多，启动耗时，个数太少，资源利用不充分


mapper个数：
手动设置：
set mapred.map.tasks=2;

适当调整块大小，从而改变分片数，来改变mapper个数：

通过合并文件小文件来减少mapper个数：
set mapred.max.split.size=25600000; 256M
set mapred.min.split.per.node=1
set mapred.min.split.per.rack=1
set hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat;



reducer个数(通常手动设置)：
set mapreduce.job.reduces=-1;


8、hive使用jvm重用
mapreduce.job.jvm.numtasks=1
set mapred.job.reuse.jvm.num=8; ##jvm里运行task的任务数


9、数据倾斜(查看：Hive优化.docx文档)
数据倾斜：数据某列的值分布不均匀。
造成数据倾斜的原因：
1、原本数据就倾斜
2、hql语句可能造成
3、join 极容易造成
4、count(distinct col)
5、group by语句也容易

解决方法：
1、如果数据本身倾斜，看数据能否直接分离(找到倾斜的数据)
2、将倾斜的数据单独出来计算，然后和正常的数据进行union all
3、将倾斜的数据赋予随机数来进行join查询，均衡每个task的任务量。
4、试图不变需求改写hql语句。

倾斜解决的几个属性设置：
hive.map.aggr=true
hive.groupby.skewindata=false
hive.optimize.skewjoin=false


10、job数量的控制
连接查询的on中的连接字段类型尽可能相同。
通常是一个简单hql语句生成一个job，有join 、limit 、group by 都将有可能会生成一个独立job。

select
u.uid,
u.uname
from user1 u
where u.uid in (select l.uid from login l where l.uid=1 limit 1)
;

select
u.uid,
u.uname
from user1 u
join login l
on u.uid = l.uid
where l.uid = 1
;


分区 、分桶 、索引 这些本身就是hive的一种优化。
