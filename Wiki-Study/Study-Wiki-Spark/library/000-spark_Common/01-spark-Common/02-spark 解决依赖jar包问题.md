# idea打jar包依赖的集中解决方案

## 记录1

### 博客总结
* [博客一](https://www.cnblogs.com/dinghong-jo/p/7873646.html)

```
第一种方式

操作：将第三方jar文件打包到最终形成的spark应用程序jar文件中

应用场景：第三方jar文件比较小，应用的地方比较少
第二种方式

操作：使用spark-submit提交命令的参数: --jars

要求：

1、使用spark-submit命令的机器上存在对应的jar文件

2、至于集群中其他机器上的服务需要该jar文件的时候，通过driver提供的一个http接口来获取该jar文件的
(例如：http://192.168.187.146:50206/jars/mysql-connector-java-5.1.27-bin.jar Added By User)


## 配置参数：--jars JARS
如下示例：
$ bin/spark-shell --jars /opt/cdh-5.3.6/hive/lib/mysql-connector-java-5.1.27-bin.jar

应用场景：要求本地必须要有对应的jar文件
第三种方式

操作：使用spark-submit提交命令的参数: --packages
复制代码


## 配置参数：--packages  jar包的maven地址
如下示例：
$ bin/spark-shell --packages  mysql:mysql-connector-java:5.1.27 --repositories http://maven.aliyun.com/nexus/content/groups/public/

## --repositories 为mysql-connector-java包的maven地址，若不给定，则会使用该机器安装的maven默认源中下载
## 若依赖多个包，则重复上述jar包写法，中间以逗号分隔
## 默认下载的包位于当前用户根目录下的.ivy/jars文件夹中

复制代码

应用场景：本地可以没有，集群中服务需要该包的的时候，都是从给定的maven地址，直接下载

第四种方式

操作：更改Spark的配置信息:SPARK_CLASSPATH, 将第三方的jar文件添加到SPARK_CLASSPATH环境变量中

注意事项：要求Spark应用运行的所有机器上必须存在被添加的第三方jar文件
复制代码

A.创建一个保存第三方jar文件的文件夹:
 命令：$ mkdir external_jars

B.修改Spark配置信息
 命令：$ vim conf/spark-env.sh
修改内容：SPARK_CLASSPATH=$SPARK_CLASSPATH:/opt/cdh-5.3.6/spark/external_jars/*

C.将依赖的jar文件copy到新建的文件夹中
命令：$ cp /opt/cdh-5.3.6/hive/lib/mysql-connector-java-5.1.27-bin.jar ./external_jars/

复制代码

应用场景：依赖的jar包特别多，写命令方式比较繁琐，被依赖包应用的场景也多的情况下
备注：（只针对spark on yarn(cluster)模式）
spark on yarn(cluster)，如果应用依赖第三方jar文件
最终解决方案：将第三方的jar文件copy到${HADOOP_HOME}/share/hadoop/common/lib文件夹中(Hadoop集群中所有机器均要求copy)
```

## 执行程序脚本

```shell
#!/bin/sh

jarf=/data/bigwork/wangya/simple-analysis/simple-analysis-1.0.jar

#zip -d ./$jarf 'META-INF/.SF' 'META-INF/.RSA' 'META-INF/*SF'

spark2-submit --master yarn \
--deploy-mode cluster \
--driver-memory 2G \
--executor-memory 4G \
--jars hdfs://lzkjnameservice/lzkj/lib/ojdbc14.jar \
--repositories http://maven.aliyun.com/nexus/content/groups/public,http://repository.cloudera.com/artifactory/cloudera-repos \
--verbose \
--packages com.databricks:spark-csv_2.11:1.5.0,com.databricks:spark-xml_2.11:0.4.1,com.databricks:spark-avro_2.11:4.0.0,org.scalaj:scalaj-http_2.11:2.3.0,com.fasterxml.jackson.core:jackson-databind:2.9.2,com.fasterxml.jackson.module:jackson-module-scala_2.11:2.9.2,org.apache.hbase:hbase-common:1.2.0-cdh5.12.2,org.apache.hbase:hbase-client:1.2.0-cdh5.12.2,org.apache.hbase:hbase-spark:1.2.0-cdh5.12.2,org.scalaj:scalaj-http_2.11:2.3.0,org.apache.solr:solr-solrj:4.10.3-cdh5.12.2,org.mongodb.spark:mongo-spark-connector_2.11:2.2.1,commons-cli:commons-cli:1.2 \
--name "程序的名字" \
--class com.lzkj.bi.App \
$jarf $@

```
