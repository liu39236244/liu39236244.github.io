# lzkj-Study-Spark

<br>

![Spark学习记录](amWiki/images/logo.png "欢迎使用amWiki！")  

# spark 学习 与wiki 记录

---
## 官网案例git地址
[java-API官网案例地址](https://github.com/apache/spark/tree/master/examples/src/main/java/org/apache/spark/examples)

## spark 学习网址
[spark-gitbook 学习](https://legacy.gitbook.com/book/aiyanbo/spark-programming-guide-zh-cn/details)

[官方git案例-All](https://github.com/apache/spark/tree/master/examples/src/main)

[官方git案例-scala](https://github.com/apache/spark/tree/master/examples/src/main/scala/org/apache/spark/examples)

[官方git案例-SparkStreaming](https://github.com/apache/spark/tree/master/examples/src/main/scala/org/apache/spark/examples/streaming)

[部署到集群-Submitting Applications](http://spark.apache.org/docs/2.2.0/submitting-applications.html)
## spark2.2.0
>总的

[官方文档2.2.0](http://spark.apache.org/docs/2.2.0/#spark-overview)

-[Quick Start](http://spark.apache.org/docs/2.2.0/quick-start.html)

-[Spark programing guide](Launching Spark Applications)

-》[Tuple2](http://www.scala-lang.org/api/2.11.8/index.html#scala.Tuple2)

-》[PairRDDFunctions](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.PairRDDFunctions)

-》[Object hashcode document](http://docs.oracle.com/javase/7/docs/api/java/lang/Object.html#hashCode())

-》[StorageLevel-scala](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.storage.StorageLevel)

---》 [storagelevel 官网链接]([官方链接](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#rdd-persistence))

-》[python 序列化](https://docs.python.org/2/library/pickle.html)

-》 [serializer-turning spark](http://spark.apache.org/docs/2.2.0/tuning.html)

-》[AccumulatorV2-用于自定义实现累加类](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.util.AccumulatorV2)

--》[官方api-AccumulatorV2](http://spark.apache.org/docs/latest/api/java/org/apache/spark/util/AccumulatorV2.html)

-》[部署到集群-Submitting Applications](http://spark.apache.org/docs/2.2.0/submitting-applications.html)

--》[org.apache.spark.launcher设置spark运行的库](http://spark.apache.org/docs/2.2.0/api/java/index.html?org/apache/spark/launcher/package-summary.html)
*  算子地址 直接连接到锚点访问到页面之后回车即可
[action](https://liu39236255.github.io/Study-Wiki-Spark/index.html?file=001-spark 的基础/03-spark API 官网案例（暂告）/04-Spark-programing#transformation)

-》 [example Spark programs](http://spark.apache.org/examples.html)

-》RDD API doc  

[Scala](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.RDD),  
 [Java](http://spark.apache.org/docs/2.2.0/api/java/index.html?org/apache/spark/api/java/JavaRDD.html),  
  [Python](http://spark.apache.org/docs/2.2.0/api/python/pyspark.html#pyspark.RDD),  
   [R](http://spark.apache.org/docs/2.2.0/api/R/index.html))  

-》RDD函数   

([Scala](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.PairRDDFunctions),  
 [Java](http://spark.apache.org/docs/2.2.0/api/java/index.html?org/apache/spark/api/java/JavaPairRDD.html)的详细信息。  


* spark SQL

-》[SparkSession -](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.SparkSession)

-》从已知的rdd中创建dataframe
[create DataFrames from an existing RDD](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#interoperating-with-rdds)
-》 [dataset api](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.Dataset)
-》[dataFrameAPi](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.functions$)
-》[DataFrames functions](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.functions$)
-》用户自定义函数
--》聚合-【多对一，比如求和，求平均都需要用到】[UDAF](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.expressions.UserDefinedAggregateFunction)
-》 分区描述 [分区描述地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#partition-discovery)
-》 [json line](http://jsonlines.org/)
-》[检索元数据hive 版本配置项地址]（[配置说明地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#interacting-with-different-versions-of-hive-metastore)）
-》 [jdbcRDD](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.JdbcRDD)
-》 [jdbc 配置选项]([option jdbc ](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#jdbc-to-other-databases))
-》[Migration Guide,改变说明](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#migration-guide)
-> [数据类型Data Types](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#data-types)



* spark Streaming  

-》 [官网地址](http://spark.apache.org/docs/2.2.0/streaming-programming-guide.html)
-》 [spark context](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.streaming.StreamingContext)
-》 [SparkConf](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.SparkConf)
-》 [ Spark, Mesos or YARN cluster URL](http://spark.apache.org/docs/2.2.0/submitting-applications.html#master-urls)
-》[Customer Receiver Guide ](http://spark.apache.org/docs/2.2.0/streaming-custom-receivers.html)
--》spark Streaming 支持的三种 advance sourdce
    [ Kafka Integration Guide ,spark2.2 只支持 > 0.8.2.1以及以上 的版本](http://spark.apache.org/docs/2.2.0/streaming-kafka-integration.html)
    [Flume Integration Guide ,spark2.2 支持flume 1.6.0 ](http://spark.apache.org/docs/2.2.0/streaming-flume-integration.html)
    [Kinesis Integration Guide](http://spark.apache.org/docs/2.2.0/streaming-kinesis-integration.html)
-》[Custom Receiver Guide](http://spark.apache.org/docs/2.2.0/streaming-custom-receivers.html)


* 模块

-》[Spark Streaming](http://spark.apache.org/docs/2.2.0/streaming-programming-guide.html)

-》[Spark SQL, Datasets, and DataFrames](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html)

-》[MLlib](http://spark.apache.org/docs/2.2.0/ml-guide.html)

-》[GraphX](http://spark.apache.org/docs/2.2.0/graphx-programming-guide.html)

> 配置

-》[spark配置](http://spark.apache.org/docs/2.2.0/configuration.html)
--》[off-heap，内存配置管理](http://spark.apache.org/docs/2.2.0/configuration.html#memory-management)


>集群模式

- [Cluster Mode Overview](http://spark.apache.org/docs/2.2.0/cluster-overview.html)

- [Standalone](http://spark.apache.org/docs/2.2.0/spark-standalone.html) Deploy Mode: simplest way to deploy Spark on a private cluster

- [Apache Mesos](http://spark.apache.org/docs/2.2.0/running-on-mesos.html)

- [Hadoop YARN](http://spark.apache.org/docs/2.2.0/running-on-yarn.html)

>APi地址

- [spark-scalaAPi](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.package)
- [Spark dataset API地址](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.Dataset)
- [RDD programming guide](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html)
- [SQL programming guide](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html)

## other

- [集群模式Overview](http://spark.apache.org/docs/2.2.0/cluster-overview.html)
- [standalone 官方介绍,](http://spark.apache.org/docs/2.2.0/spark-standalone.html)



## 琐碎
[各种算子优化](https://blog.csdn.net/u011007180/article/details/62444181)
