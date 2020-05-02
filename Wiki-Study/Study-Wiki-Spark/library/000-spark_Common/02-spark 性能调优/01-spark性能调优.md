# 本章节记录了spark 的性能调优
# 性能调优
## qf 性能调优



# 调优博客记录
## 调优指南高级篇
[性能调优高级篇](https://www.cnblogs.com/seaspring/p/5641950.html)


# 性能调优之

## 调整 spark_default_parallelism控制生成的分区数（也就相当于task数量了），

```
spark spark_default_parallelism 调优配置

控制生成的task数量，一个分区一个task

博主原地址（https://blog.csdn.net/bbaiggey/article/details/51984753）
spark中有partition的概念（和slice是同一个概念，在spark1.2中官网已经做出了说明），一般每个partition对应一个task。在我的测试过程中，如果没有设置spark.default.parallelism参数，spark计算出来的partition非常巨大，与我的cores非常不搭。我在两台机器上（8cores *2 +6g * 2）上，spark计算出来的partition达到2.8万个，也就是2.9万个tasks，每个task完成时间都是几毫秒或者零点几毫秒，执行起来非常缓慢。在我尝试设置了 spark.default.parallelism 后，任务数减少到10，执行一次计算过程从minute降到20second。

Clusters will not be fully utilized unless you set the level of parallelism for each operation high enough. Spark automatically sets the number of “map” tasks to run on each file according to its size (though you can control it through optional parameters to SparkContext.textFile, etc), and for distributed “reduce” operations, such as groupByKey and reduceByKey, it uses the largest parent RDD’s number of partitions. You can pass the level of parallelism as a second argument (see the spark.PairRDDFunctions documentation), or set the config propertyspark.default.parallelism to change the default. In general, we recommend 2-3 tasks per CPU core in your cluster.（除非您将每个操作的并行度设置得足够高，否则不会充分利用集群。Spark根据每个文件的大小自动设置要在其上运行的“map”任务的数量(尽管您可以通过可选的参数来控制它，以SparkContext。对于分布式的“减少”操作，例如groupByKey和reduceByKey，它使用最大的父RDD的分区数。您可以将并行级别作为第二个参数传递(请参阅spark。或者设置config propertyspark.default.parallelism可以更改默认值。通常，我们建议您的集群中每个CPU内核执行2-3个任务。）

```
