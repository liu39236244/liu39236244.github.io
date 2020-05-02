# Spark [官网](http://spark.apache.org/)
---
# 1-spark
## 1-1spark 的简单介绍
### 1 spark 与hadoop 相比
运行时间要提高 100 倍（理论）
* Speed
Apache Spark achieves high performance for both batch and streaming data, using a state-of-the-art DAG scheduler, a query optimizer, and a physical execution engine.
(Apache Spark通过使用最先进的DAG调度器、查询优化器和物理执行引擎来实现批处理和流数据的高性能。)
* Ease of Use
Write applications quickly in Java, Scala, Python, R, and SQL.

Spark offers over 80 high-level operators(经营者) that make it easy to build parallel（类似的） apps. And you can use it interactively（交互式） from the Scala, Python, R, and SQL shells.


* Generality

Combine SQL, streaming, and complex analytics.

Spark powers a stack of libraries including [SQL and DataFrames](http://spark.apache.org/sql/), MLlib for machine learning, GraphX, and Spark Streaming. You can combine these libraries seamlessly in the same application.（Spark提供了一堆库，包括SQL和DataFrames、用于机器学习的MLlib、GraphX和Spark流。您可以在同一个应用程序中无缝地组合这些库。）

![](assets/001/20180417-84e1334b.png)  


* Runs Everywhere

Spark runs on Hadoop, Apache Mesos, Kubernetes, standalone, or in the cloud. It can access diverse data sources.

You can run Spark using its standalone cluster mode, on EC2, on Hadoop YARN, on Mesos, or on Kubernetes. Access data in HDFS, Apache Cassandra, Apache HBase, Apache Hive, and hundreds of other data sources.

![能够执行环境](assets/001/20180417-d4ec9ffd.png)  
