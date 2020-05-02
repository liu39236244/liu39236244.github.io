# 这里记录了hadoop 使用过的命令

## 博客记录

* 记录的博主
[博主1](https://blog.csdn.net/zhaojw_420/article/details/53161624)


## hadoop haadmin 使用

```
hdfs haadmin -getServiceState nn1

hdfs haadmin -getServiceState nn2

```

## 使用过的

```sh
//查看前10 行数据
hadoop dfs -cat /lzkj/olap-warehouse/dim_time/dim_time.csv | head

计算对应的文件数量

hadoop dfs -ls  -h /yujing/* |grep .dat | wc -l


```

## 查看hdfs 文件
```
随机返回指定行数的样本数据
hadoop fs -cat /test/gonganbu/scene_analysis_suggestion/* | shuf -n 5

返回前几行的样本数据
hdfs dfs -ls /rastext/min |head -10
hadoop fs -cat /test/gonganbu/scene_analysis_suggestion/* | head -100

返回最后几行的样本数据
hadoop fs -cat /test/gonganbu/scene_analysis_suggestion/* | tail -5

查看文本行数
hadoop fs -cat hdfs://172.16.0.226:8020/test/sys_dict/sysdict_case_type.csv |wc -l

查看文件大小(单位byte)
hadoop fs -du hdfs://172.16.0.226:8020/test/sys_dict/*

hadoop fs -count hdfs://172.16.0.226:8020/test/sys_dict/*
```

# 2-hadoop 命令大全

## 2-1 hadoop命令博客总结

```
一、前述

分享一篇hadoop的常用命令的总结，将常用的Hadoop命令总结如下。

二、具体

1、启动hadoop所有进程
start-all.sh等价于start-dfs.sh + start-yarn.sh

但是一般不推荐使用start-all.sh(因为开源框架中内部命令启动有很多问题)。


2、单进程启动。

sbin/start-dfs.sh

---------------

    sbin/hadoop-daemons.sh --config .. --hostname .. start namenode ...
    sbin/hadoop-daemons.sh --config .. --hostname .. start datanode ...
    sbin/hadoop-daemons.sh --config .. --hostname .. start sescondarynamenode ...
    sbin/hadoop-daemons.sh --config .. --hostname .. start zkfc ...         //



sbin/start-yarn.sh
--------------  
    libexec/yarn-config.sh
    sbin/yarn-daemon.sh --config $YARN_CONF_DIR  start resourcemanager
    sbin/yarn-daemons.sh  --config $YARN_CONF_DIR  start nodemanager

3、常用命令

    1、查看指定目录下内容

   hdfs dfs –ls [文件目录]

    hdfs dfs -ls -R   /                   //显式目录结构

    eg: hdfs dfs –ls /user/wangkai.pt

   2、打开某个已存在文件

    hdfs dfs –cat [file_path]

   eg:hdfs dfs -cat /user/wangkai.pt/data.txt

  3、将本地文件存储至hadoop

     hdfs dfs –put [本地地址] [hadoop目录]

     hdfs dfs –put /home/t/file.txt  /user/t  

  4、将本地文件夹存储至hadoop

    hdfs dfs –put [本地目录] [hadoop目录]
    hdfs dfs –put /home/t/dir_name /user/t

   (dir_name是文件夹名)

  5、将hadoop上某个文件down至本地已有目录下

     hadoop dfs -get [文件目录] [本地目录]

     hadoop dfs –get /user/t/ok.txt /home/t

  6、删除hadoop上指定文件

     hdfs  dfs –rm [文件地址]

     hdfs dfs –rm /user/t/ok.txt

  7、删除hadoop上指定文件夹（包含子目录等）

     hdfs dfs –rm [目录地址]

     hdfs dfs –rmr /user/t

  8、在hadoop指定目录内创建新目录

      hdfs dfs –mkdir /user/t

      hdfs  dfs -mkdir - p /user/centos/hadoop

  9、在hadoop指定目录下新建一个空文件

    使用touchz命令：

    hdfs dfs  -touchz  /user/new.txt

  10、将hadoop上某个文件重命名

   使用mv命令：

   hdfs dfs –mv  /user/test.txt  /user/ok.txt   （将test.txt重命名为ok.txt）

  11、将hadoop指定目录下所有内容保存为一个文件，同时down至本地

   hdfs dfs –getmerge /user /home/t

  12、将正在运行的hadoop作业kill掉

   hadoop job –kill  [job-id]

  13.查看帮助

  hdfs dfs -help        

4、安全模式

  (1)退出安全模式

      NameNode在启动时会自动进入安全模式。安全模式是NameNode的一种状态，在这个阶段，文件系统不允许有任何修改。

      系统显示Name node in safe mode，说明系统正处于安全模式，这时只需要等待十几秒即可，也可通过下面的命令退出安全模式：/usr/local/hadoop$bin/hadoop dfsadmin -safemode leave

  (2) 进入安全模式
    在必要情况下，可以通过以下命令把HDFS置于安全模式：/usr/local/hadoop$bin/hadoop dfsadmin -safemode enter



5、节点添加

添加一个新的DataNode节点，先在新加节点上安装好Hadoop，要和NameNode使用相同的配置（可以直接从NameNode复制），修改HADOOPHOME/conf/master文件，加入NameNode主机名。然后在NameNode节点上修改HADOOP_HOME/conf/slaves文件，加入新节点名，再建立新加节点无密码的SSH连接，运行启动命令为：/usr/local/hadoop$bin/start-all.sh



6、负载均衡

HDFS的数据在各个DataNode中的分布可能很不均匀，尤其是在DataNode节点出现故障或新增DataNode节点时。新增数据块时NameNode对DataNode节点的选择策略也有可能导致数据块分布不均匀。用户可以使用命令重新平衡DataNode上的数据块的分布：/usr/local/hadoop$bin/start-balancer.sh


7、补充

1.对hdfs操作的命令格式是hdfs dfs  
1.1 -ls 表示对hdfs下一级目录的查看
1.2 -lsr 表示对hdfs目录的递归查看
1.3 -mkdir 创建目录
1.4 -put 从Linux上传文件到hdfs
1.5 -get 从hdfs下载文件到linux
1.6 -text 查看文件内容
1.7 -rm 表示删除文件
1.7 -rmr 表示递归删除文件
2.hdfs在对数据存储进行block划分时，如果文件大小超过block，那么按照block大小进行划分；不如block size的，划分为一个块，是实际数据大小。
*****PermissionDenyException  权限不足**********  
hadoop常用命令：  
hdfs dfs  查看Hadoop HDFS支持的所有命令   
hdfs dfs –ls  列出目录及文件信息   
hdfs dfs –lsr  循环列出目录、子目录及文件信息   
hdfs dfs –put test.txt /user/sunlightcs  将本地文件系统的test.txt复制到HDFS文件系统的/user/sunlightcs目录下   
hdfs dfs –get /user/sunlightcs/test.txt .  将HDFS中的test.txt复制到本地文件系统中，与-put命令相反   
hdfs dfs –cat /user/sunlightcs/test.txt  查看HDFS文件系统里test.txt的内容   
hdfs dfs –tail /user/sunlightcs/test.txt  查看最后1KB的内容   
hdfs dfs –rm /user/sunlightcs/test.txt  从HDFS文件系统删除test.txt文件，rm命令也可以删除空目录   
hdfs dfs –rmr /user/sunlightcs  删除/user/sunlightcs目录以及所有子目录   
hdfs dfs –copyFromLocal test.txt /user/sunlightcs/test.txt  从本地文件系统复制文件到HDFS文件系统，等同于put命令   
hdfs dfs –copyToLocal /user/sunlightcs/test.txt test.txt  从HDFS文件系统复制文件到本地文件系统，等同于get命令   
hdfs dfs –chgrp [-R] /user/sunlightcs  修改HDFS系统中/user/sunlightcs目录所属群组，选项-R递归执行，跟linux命令一样   
hdfs dfs –chown [-R] /user/sunlightcs  修改HDFS系统中/user/sunlightcs目录拥有者，选项-R递归执行   
hdfs dfs –chmod [-R] MODE /user/sunlightcs  修改HDFS系统中/user/sunlightcs目录权限，MODE可以为相应权限的3位数或+/-{rwx}，选项-R递归执行
hdfs dfs –count [-q] PATH  查看PATH目录下，子目录数、文件数、文件大小、文件名/目录名   
hdfs dfs –cp SRC [SRC …] DST       将文件从SRC复制到DST，如果指定了多个SRC，则DST必须为一个目录   
hdfs dfs –du PATH  显示该目录中每个文件或目录的大小   
hdfs dfs –dus PATH  类似于du，PATH为目录时，会显示该目录的总大小   
hdfs dfs –expunge  清空回收站，文件被删除时，它首先会移到临时目录.Trash/中，当超过延迟时间之后，文件才会被永久删除   
hdfs dfs –getmerge SRC [SRC …] LOCALDST [addnl]      获取由SRC指定的所有文件，将它们合并为单个文件，并写入本地文件系统中的LOCALDST，选项addnl将在每个文件的末尾处加上一个换行符   
hdfs dfs –touchz PATH   创建长度为0的空文件   
hdfs dfs –test –[ezd] PATH     对PATH进行如下类型的检查：  -e PATH是否存在，如果PATH存在，返回0，否则返回1  -z 文件是否为空，如果长度为0，返回0，否则返回1  -d 是否为目录，如果PATH为目录，返回0，否则返回1   
hdfs dfs –text PATH  显示文件的内容，当文件为文本文件时，等同于cat，文件为压缩格式（gzip以及hadoop的二进制序列文件格式）时，会先解压缩    hdfs dfs –help ls  查看某个[ls]命令的帮助文档

           

```
