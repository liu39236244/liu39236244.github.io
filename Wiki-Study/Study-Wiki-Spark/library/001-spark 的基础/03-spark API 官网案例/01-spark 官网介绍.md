# spark 2.2.0  [网址](http://spark.apache.org/docs/2.2.0/index.html)

## Spark Overview
Apache Spark is a fast and general-purpose cluster computing system. It provides high-level APIs in Java, Scala, Python and R, and an optimized engine that supports general execution graphs. It also supports a rich set of higher-level tools including Spark SQL for SQL and structured data processing, MLlib for machine learning, GraphX for graph processing, and Spark Streaming.
译文：（Apache Spark是一种快速、通用的集群计算系统。它提供了Java、Scala、Python和R的高级api，以及一个支持通用执行图的优化引擎。它还支持丰富的高级工具集，包括用于SQL和结构化数据处理的Spark SQL、用于机器学习的MLlib、图形处理的GraphX和Spark流。）

* Downing
Get Spark from the downloads page of the project website. This documentation is for Spark version 2.2.0. Spark uses Hadoop’s client libraries for HDFS and YARN. Downloads are pre-packaged for a handful of popular Hadoop versions. Users can also download a “Hadoop free” binary and run Spark with any Hadoop version by augmenting Spark’s classpath. Scala and Java users can include Spark in their projects using its Maven coordinates and in the future Python users can also install Spark from PyPI.
(从项目网站的下载页面获得spark。此文档用于Spark版本2.2.0。Spark使用Hadoop的客户端库用于HDFS和yarn。下载是预先打包为少数流行的Hadoop版本。用户还可以下载一个“Hadoop free”二进制文件，并通过增强Spark的类路径来运行任何Hadoop版本的Spark。Scala和Java用户可以在他们的项目中使用Maven坐标来包含Spark，在将来的Python用户中也可以安装PyPI的Spark。)

注意事项：
Spark在Windows和unix系统(例如Linux、Mac OS)上运行。在一台机器上本地运行很容易——只需将java安装在系统路径上，或者JAVA_HOME环境变量指向java安装。
兼容版本：
Spark runs on Java 8+, Python 2.7+/3.4+ and R 3.1+. For the Scala API, Spark 2.2.0 uses Scala 2.11. You will need to use a compatible（兼容的） Scala version (2.11.x).

Note that support for Java 7, Python 2.6 and old Hadoop versions before 2.6.5 were removed as of Spark 2.2.0.
spark 在2.2.0 ***不支持*** ：
    hadoop2.6.5 之前的版本
    python 2.6
    java 7

Note that support for Scala 2.10 is deprecated as of Spark 2.1.0, and may be removed in Spark 2.3.0.
从spark2.1.0 版本开始不支持scala2.10 ，或许会在spark2.3.0 中也会被不支持

Spark附带了几个示例程序。Scala、Java、Python和R示例都在示例/src/main。要运行一个Java或Scala示例程序，可以在顶级Spark目录中使用bin/run-example [params]。(内部其实还是调用了更通用的启动应用程序的spark-submit脚本)。例如,

* ***注意需要安装java 8  与scala 2.11.x 搭配spark2.2.0***
##  简单shell案例
执行计算圆周率，

    ./bin/run-example SparkPi 10
    ./bin/spark-shell --master local[2]

Spark also provides a Python API. To run Spark interactively(交互式) in a Python interpreter（解释着）, use bin/pyspark:   

    ./bin/pyspark --master local[2]

Example applications are also provided in Python. For example,

    ./bin/spark-submit examples/src/main/python/pi.py 10

Spark also provides an experimental R API since 1.4 (only DataFrames APIs included). To run Spark interactively in a R interpreter, use bin/sparkR:

    ./bin/sparkR --master local[2]
Example applications are also provided in R. For example,

    ./bin/spark-submit examples/src/main/r/dataframe.R
# launcher cluster

The Spark [cluster mode overview](http://spark.apache.org/docs/2.2.0/cluster-overview.html) explains the key concepts in running on a cluster. Spark can run both by itself, or over several existing cluster managers. It currently provides several options for deployment:
Spark集群模式概述解释了在集群上运行的关键概念。Spark可以单独运行，也可以运行多个现有的集群管理器。它目前提供了几个部署选项:

[Standalone](http://spark.apache.org/docs/2.2.0/spark-standalone.html) Deploy Mode: simplest way to deploy Spark on a private cluster

[Apache Mesos](http://spark.apache.org/docs/2.2.0/running-on-mesos.html)

[Hadoop YARN](http://spark.apache.org/docs/2.2.0/running-on-yarn.html)


# 从这里开始学习

Programming Guides:
[Quick Start](http://spark.apache.org/docs/2.2.0/quick-start.html): a quick introduction to the Spark API; start here!
[Spark Programming Guide](http://spark.apache.org/docs/2.2.0/programming-guide.html): detailed overview of Spark in all supported languages (Scala, Java, Python, R)
Modules built on Spark:
    [Spark Streaming](http://spark.apache.org/docs/2.2.0/streaming-programming-guide.html): processing real-time data streams
    [Spark SQL, Datasets, and DataFrames](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html): support for structured data and relational queries
    [MLlib](http://spark.apache.org/docs/2.2.0/ml-guide.html): built-in machine learning library
    [GraphX](http://spark.apache.org/docs/2.2.0/graphx-programming-guide.html): Spark’s new API for graph processing


## quick start

### 基本
基本shell，Spark的shell提供了一种简单的方法来学习API，以及一个强大的工具来交互式地分析数据。它可以在Scala(在Java VM上运行，因此是使用现有Java库的好方法)或Python中使用。在Spark目录中运行以下步骤启动它:

    （我启动的时候因为spark配置的是带有hadoop中的配置，所以hadoop如果不开启的话，就会报错，以至于spark 、sc 都用不了，所以这里开启了集群的dfs）
    ./bin/spark-shell
shell 操作，Spark的主要抽象是一个名为Dataset的分布式集合。数据集可以从Hadoop inputformat(例如HDFS文件)或通过转换其他数据集创建。让我们从Spark源目录中的README文件的文本中创建一个新的数据集:

    scala> val text =spark.read.textFile("file:///shenyabo/HadoopTest/input/Spark_README.md")
    text: org.apache.spark.sql.Dataset[String] = [value: string]

您可以通过调用一些操作或转换数据集来获得新的数据集，从而直接从数据集获取值。有关详细信息，[请阅读DatasetAPI文档](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.Dataset)。

* 计算 总行数

    scala> text.count
    res0: Long = 103
* 返回第一行数据    

    scala> text.first
    res1: String = # Apache Spark

* 过滤，筛选出来包含有Spark的行并且返回一个新的Dataset

    scala> val filter_1=text.filter(line => line.contains("Spark"))
    filter_1: org.apache.spark.sql.Dataset[String] = [value: string]

    >查看结果    

    filter_1.collect
    res3: Array[String] = Array(# Apache Spark,

* 也可以一块写出来

    scala> text.filter(line => line.contains("Spark")).count
    res4: Long = 20



### 更多操作

* 找到一行中单词最多的一行有多少单词

    scala> text.map(line => line.split(" ").size).reduce ((a,b)=>if(a>b) a else b )
    res9: Int = 22
* 你也可以根据 导入包，直接用公式

    scala> import java.lang.Math
    import java.lang.Math

    scala> text.map(line => line.split(" ").size).reduce((a,b) => Math.max(a,b))
    res10: Int = 22

* 计算单词案例，spark可以较简单做出来

    >1 普通分组 groupByKey(必须有个参数，参数随便写)

    scala> text.flatMap(line => line.split(" ")).groupByKey(identity).count
      res14: org.apache.spark.sql.Dataset[(String, Long)] = [value: string, count(1): bigint]

    scala> text.flatMap(line => line.split(" ")).groupByKey(identity).count.collect
      res15: Array[(String, Long)] = Array((online,1), (graphs,1), (["Parallel,1), (["Building,1), (thread,1), (documentation,3), (command,,2), (abbreviated,1), (overview,1), (rich,1), (set,2), (-DskipTests,1), (name,1), (page](http://spark.apache.org/documentation.html).,1), (["Specifying,1), (stream,1), (run:,1), (not,1), (programs,2), (tests,2), (./dev/run-tests,1), (will,1), ([run,1), (particular,2), (option,1), (Alternatively,,1), (by,1), (must,1), (using,5), (you,4), (MLlib,1), (DataFrames,,1), (variable,1), (Note,1), (core,1), (more,1), (protocols,1), (guidance,2), (shell:,2), (can,7), (site,,1), (systems.,1), (Maven,1), ([building,1), (configure,1), (for,12), (README,1), (Interactive,2), (how,3), ([Configuration,1), (Hive,2), (system,1), (provides,1), (Hadoop-supported,1), (pre-built,...
      scala>

### caching 缓存

Spark also supports pulling data sets into a cluster-wide in-memory cache. This is very useful when data is accessed repeatedly, such as when querying a small “hot” dataset or when running an iterative algorithm like PageRank. As a simple example, let’s mark our linesWithSpark dataset to be cached:
（Spark还支持将数据集放到集群范围内的内存缓存中。当数据被重复访问时，比如查询一个小的“热”数据集或者运行一个类似PageRank的迭代算法时，这是非常有用的。作为一个简单的例子，让我们将linesWithSpark数据集标记为缓存:）
用法：

    val cached_1 =ext.filter(line => line.contains("Spark")).cache()
    cached_1.count()

---

## Spark Programing Guide

## 具体代码在```AllProject/Spark_Study```  中
