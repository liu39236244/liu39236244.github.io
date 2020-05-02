# Hadoop 基本简介

---

## 一 Hadoop 基本知识

### Hadoop 简介：
* wiki 给出的解释
Apache Hadoop is a framework for running applications on large cluster built of commodity hardware. The Hadoop framework transparently provides applications both reliability and data motion. Hadoop implements a computational paradigm named Map/Reduce, where the application is divided into many small fragments of work, each of which may be executed or re-executed on any node in the cluster. In addition, it provides a distributed file system (HDFS) that stores data on the compute nodes, providing very high aggregate bandwidth across the cluster. Both MapReduce and the Hadoop Distributed File System are designed so that node failures are automatically handled by the framework.

没关系给你翻译：
Apache Hadoop是在大型集群上运行应用程序的框架。Hadoop框架透明地提供了可靠性和数据移动的应用。Hadoop实现了一个名为Map/Reduce的计算范式，其中应用程序被划分为许多小的工作片段，每一个都可以在集群中的任何节点上执行或重新执行。此外，它还提供了一个分布式文件系统(HDFS)，可以在计算节点上存储数据，从而在集群中提供非常高的聚合带宽。设计了MapReduce和Hadoop分布式文件系统，使节点故障被框架自动处理。

* 官网第一页的解释：

The Apache Hadoop software library is a framework that allows for the distributed processing of large data sets across clusters of computers using simple programming models. It is designed to scale up from single servers to thousands of machines, each offering local computation and storage. Rather than rely on hardware to deliver high-availability, the library itself is designed to detect and handle failures at the application layer, so delivering a highly-available service on top of a cluster of computers, each of which may be prone to failures.

解释：
Apache Hadoop软件库是一个框架，它允许使用简单的编程模型在计算机集群中对大数据集进行分布式处理。它被设计成从单个服务器扩展到数千台机器，每个服务器提供本地计算和存储。库本身并不是依赖于硬件来提供高可用性，而是设计用于在应用层检测和处理故障，因此在一组计算机上提供高可用性服务，每一种计算机都有可能出现故障。

The project includes these modules:// 项目中的组件

```
Hadoop Common: The common utilities that support the other Hadoop modules. //支持其他Hadoop模块的公共实用程序。
Hadoop Distributed File System (HDFS™): A distributed file system that provides high-throughput access to application data. //一个分布式文件系统，它提供对应用程序数据的高吞吐量访问。
Hadoop YARN: A framework for job scheduling and cluster resource management. //作业调度和集群资源管理的框架。
Hadoop MapReduce: A YARN-based system for parallel processing of large data sets. // 一种用于大型数据集并行处理的基于yarn的系统。
```

Other Hadoop-related projects at Apache include. //apache中hadoop其他相关组件

```

    Ambari™: A web-based tool for provisioning, managing, and monitoring Apache Hadoop clusters which includes support for Hadoop HDFS, Hadoop MapReduce, Hive, HCatalog, HBase, ZooKeeper, Oozie, Pig and Sqoop. Ambari also provides a dashboard for viewing cluster health such as heatmaps and ability to view MapReduce, Pig and Hive applications visually alongwith features to diagnose their performance characteristics in a user-friendly manner.
    (一个用于提供、管理和监控Apache Hadoop集群的基于web的工具，包括支持Hadoop HDFS、Hadoop MapReduce、Hive、HCatalog、HBase、ZooKeeper、Oozie、Pig和Sqoop。Ambari还提供了一个用于查看集群健康的仪表板，如热图和查看MapReduce、Pig和Hive应用程序的能力，以直观的方式诊断其性能特征。)



    Avro™: A data serialization system.(一个数据序列化系统)

    Cassandra™: A scalable multi-master database with no single points of failure.(一个可伸缩的多主数据库，没有单点故障。)

    Chukwa™: A data collection system for managing large distributed systems.(用于管理大型分布式系统的数据收集系统。)

    HBase™: A scalable, distributed database that supports structured data storage for large tables.(一个可伸缩的分布式数据库，支持大型表的结构化数据存储。)

    Hive™: A data warehouse infrastructure that provides data summarization and ad hoc querying.(提供数据汇总和临时查询的数据仓库基础设施。)

    Mahout™: A Scalable machine learning and data mining library. (一个可扩展的机器学习和数据挖掘库。)

    Pig™: A high-level data-flow language and execution framework for parallel computation.(用于并行计算的高级数据流语言和执行框架。)[我是感觉没怎么用过]

    Spark™: A fast and general compute engine for Hadoop data. Spark provides a simple and expressive programming model that supports a wide range of applications, including ETL, machine learning, stream processing, and graph computation.（用于Hadoop数据的快速通用计算引擎。Spark提供了一个简单和表达性的编程模型，支持广泛的应用程序，包括ETL、机器学习、流处理和图形计算。）

    Tez™: A generalized data-flow programming framework, built on Hadoop YARN, which provides a powerful and flexible engine to execute an arbitrary DAG of tasks to process data for both batch and interactive use-cases. Tez is being adopted by Hive™, Pig™ and other frameworks in the Hadoop ecosystem, and also by other commercial software (e.g. ETL tools), to replace Hadoop™ MapReduce as the underlying execution engine.（一个基于Hadoop纱线的通用数据流编程框架，它提供了一个强大而灵活的引擎来执行任意DAG任务，以处理批处理和交互式用例的数据。在Hadoop生态系统中，Tez被Hive, Pig和其他框架所采用，也被其他商业软件(例如ETL工具)所采用，以取代Hadoop作为底层执行引擎。）[此外有Storm]

    ZooKeeper™: A high-performance coordination service for distributed applications.(分布式应用程序的高性能协调服务。)

```

### 2 Getting Started  
---

官方给了三步：
To get started, begin here:

> Learn about Hadoop by reading the documentation. 就是让你通过看官方文档->[官方文档](http://hadoop.apache.org/docs/current/)

> Download Hadoop from the release page. 让你下载包 -> [下载地址](http://hadoop.apache.org/releases.html)

> Discuss Hadoop on the mailing list. 在邮件列表讨论，少不了讨论啊！[地址](http://hadoop.apache.org/mailing_lists.html)


# hadoop 相关网站
---

## 官方网站：

---

* [官网](http://hadoop.apache.org/)
* [2.7.5 文档向导](http://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-common/SingleCluster.html)
* [3.0.1 所做的改变](http://hadoop.apache.org/docs/r3.0.1/index.html)【这边3.0先放着，主要看2.7.5 的版本，原因你懂的】

## 所做的更改
* 1 擦除编码：HDFS Erasure Coding

> 1. 支持在hdfs中删除编码：Support for erasure coding in HDFS，也就是数据持久存储的一种方法More details are available in the[ HDFS Erasure](http://hadoop.apache.org/docs/r3.0.1/hadoop-project-dist/hadoop-hdfs/HDFSErasureCoding.html#Purpose) Coding documentation.
>> 擦除编码部分介绍
```
1.目的：
Replication is expensive – the default 3x replication scheme in HDFS has 200% overhead in storage space and other resources (e.g., network bandwidth). However, for warm and cold datasets with relatively low I/O activities, additional block replicas are rarely accessed during normal operations, but still consume the same amount of resources as the first replica.
Therefore, a natural improvement is to use Erasure Coding (EC) in place of replication, which provides the same level of fault-tolerance with much less storage space. In typical Erasure Coding (EC) setups, the storage overhead is no more than 50%. Replication factor of an EC file is meaningless. It is always 1 and cannot be changed via -setrep command.
(复制是昂贵的——在HDFS中默认的3x复制方案在存储空间和其他资源(例如，网络带宽)上有200%的开销。但是，对于相对较低的I/O活动的warm和cold数据集，在正常操作期间很少访问额外的块副本，但仍然消耗与第一个副本相同的资源。
因此，一个自然的改进是使用Erasure编码(EC)来代替复制，它提供了相同级别的容错和更少的存储空间。在典型的删除编码(EC)设置中，存储开销不超过50%。EC文件的复制因子是没有意义的。它总是1，不能通过-setrep命令更改。)
```

2.背景：

```
In storage systems, the most notable usage of EC is Redundant Array of Inexpensive Disks (RAID). RAID implements EC through striping, which divides logically sequential data (such as a file) into smaller units (such as bit, byte, or block) and stores consecutive units on different disks. In the rest of this guide this unit of striping distribution is termed a striping cell (or cell). For each stripe of original data cells, a certain number of parity cells are calculated and stored – the process of which is called encoding. The error on any striping cell can be recovered through decoding calculation based on surviving data and parity cells.
(在存储系统中，EC最显著的用途是冗余磁盘阵列(RAID)。RAID通过striping实现EC，它将逻辑上连续的数据(比如文件)分成较小的单元(例如位、字节或块)，并在不同的磁盘上存储连续的单元。在本指南的其余部分中，这种条纹分布的单位称为条纹细胞(或细胞)。对于原始数据单元的每条条带，计算并存储一定数量的奇偶性单元，这一过程称为编码。任何条纹单元的误差都可以通过基于幸存数据和奇偶单元的解码计算得到。)
```

3.特性
```
In the context of EC, striping has several critical advantages. First, it enables online EC (writing data immediately in EC format), avoiding a conversion phase and immediately saving storage space. Online EC also enhances sequential I/O performance by leveraging multiple disk spindles in parallel; this is especially desirable in clusters with high end networking. Second, it naturally distributes a small file to multiple DataNodes and eliminates the need to bundle multiple files into a single coding group. This greatly simplifies file operations such as deletion, quota reporting, and migration between federated namespaces.
In typical HDFS clusters, small files can account for over 3/4 of total storage consumption. To better support small files, in this first phase of work HDFS supports EC with striping. In the future, HDFS will also support a contiguous EC layout. See the design doc and discussion on HDFS-7285 for more information.
在欧共体的背景下，striping具有几个关键的优势。首先，它支持在线EC(立即以EC格式编写数据)，避免转换阶段，并立即节省存储空间。在线欧共体还通过同时利用多个磁盘主轴来提高连续的I/O性能;这在具有高端网络的集群中尤其可取。其次，它自然地将一个小文件分发到多个DataNodes，并消除了将多个文件捆绑到单个编码组的需要。这极大地简化了文件操作，如删除、配额报告和联邦名称空间之间的迁移。
在典型的HDFS集群中，小文件可以占总存储消耗的3/4以上。为了更好地支持小文件，在第一阶段的工作中，HDFS支持通过striping来支持EC。将来，HDFS还将支持一个连续的EC布局。请参阅设计文档并讨论HDFS-7285以获得更多信息。
```
---























## 注意事项(基于hadoop3.0 )

* 1- 最低java要求从java 8.0
