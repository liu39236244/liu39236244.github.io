# Spark 的安装与配置

---



## Spark官方 [官网2.2](http://spark.apache.org/docs/2.2.0/index.html)


## 博主搜集
[博主1](https://www.linuxidc.com/Linux/2017-08/146215.htm)

## 搭建

###  准备环境

* spark 的下载 [下载地址](http://spark.apache.org/downloads.html)
* scala 的下载[下载地址]()
* hadoop 集群的安装[具体参考hadoop的安装]()

### 准备安装[参照博客](https://www.linuxidc.com/Linux/2017-08/146215.htm)

#### 1- 解压下载的安装包，复制出来一份slaves、spark-env.sh
* spark-env.sh  配置

```shell
# MySetting
# JAVA_HOME：Java安装目录
# SCALA_HOME：Scala安装目录
# HADOOP_HOME：hadoop安装目录
# HADOOP_CONF_DIR：hadoop集群的配置文件的目录
# SPARK_MASTER_IP：spark集群的Master节点的ip地址
# SPARK_WORKER_MEMORY：每个worker节点能够最大分配给exectors的内存大小
# SPARK_WORKER_CORES：每个worker节点所占有的CPU核数目
# SPARK_WORKER_INSTANCES：每台机器上开启的worker节点的数目
export JAVA_HOME=/usr/local/MyInstall/jdk1.8.0_161/

export SCALA_HOME=/usr/local/MyInstall/scala-2.11.0

export HADOOP_HOME=/usr/local/MyInstall/hadoop-2.7.5

export HADOOP_CONF_DIR=/usr/local/MyInstall/hadoop-2.7.5/etc/hadoop/

export SPARK_MASTER_IP=lzkj01

export SPARK_MASTER_PORT=7077

export SPARK_WORKER_MEMORY=500M

export SPARK_WORKER_CORES=1

export SPARK_WORKER_INSTANCES=1
```

* 2- 在slaves 中填写 集群节点

```
node01
node02
node03
```


* 3- 启动
进入sbin/start-all.sh
    注意的是，这里有了hadoop的配置，所以一定要走到spark/sbin 中执行 start-all.sh
这里留几个启动spark的三种方式：

> [spark 的开启三种方式](https://www.jianshu.com/p/65a3476757a5)



* 4- 打开浏览器访问  lzkj01:8080
    * 本地：spark-shell
    * 集群：spark-shell --master spark://lzkj01:7077

* 5-端口
    master:7077 ，服务监听端口
    master:8088 , all Applications yarn 的
    master :8080 , spark  works
    master:4044 , spark jobs ,这个只有任务提交的时候才能打开ui页面
    master:18080 ,事件任务日志查看
## spark 配置补充

### 1-spark historyjob 配置(参照博客的回答)

```shell

4040 页面只有提交job后 （spakr-shell） 才有并且才能被访问，任务运行完了，立马端口就释放

建议你配置一下spark-history 页面，运行完了可以查看已经finished的job，下面是简单的配置步骤,
spark-default.conf中配置如下参数
park.eventLog.enabled           true
spark.eventLog.dir               hdfs://lzkj01:9000/user/spark_log/spark_eventLog
spark.history.fs.logDirectory    hdfs://lzkj01:9000/user/spark_log/spark_historyLog

# start-history-server.sh 使用前注意开启这个服务
默认的端口是18080 ，web ui  http://sparkmaster:18080/
不过下面的配置吧端口转移成 7777
spark-env.sh
export SPARK_HISTORY_OPTS="-Dspark.history.ui.port=7777 -Dspark.history.retainedApplications=3  -Dspark.history.fs.logDirectory=hdfs://lzkj01:9000/spark_directory"

参数描述：
spark.history.ui.port=7777 调整WEBUI访问的端口号为7777
# 历史目录如果是高可用的集群：-Dspark.history.fs.logDirectory=hdfs://mycluster/directory
spark.history.fs.logDirectory=hdfs://lzkj01:9000/spark_directory 配置了该属性后，在start-history-server.sh时就无需再显示的指定路径

spark.history.retainedApplications=3  指定保存Application历史记录的个数，如果超过这个值，旧的应用程序信息将被删除

启动
cd $SPARK_HOME/sbin
start-history-server.sh

需要在启动时指定目录：
start-history-server.sh hdfs://hadoop000:9000/spark_directory

注意的是spark 程序中需要将sparkcontext stop 掉，否则即便是运行完毕，web页面也只能显示incompleted applications，而不是completed applications

```

端口
RPC：7077 ，这里改成
webUI：端口8080端口
