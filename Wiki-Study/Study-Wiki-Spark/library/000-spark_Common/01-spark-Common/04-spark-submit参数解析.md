# spark submit参数解析

## 1-spark 终端命令中的一部分
原文地址：https://blog.csdn.net/zrc199021/article/details/53999293
进入$SPARK_HOME目录，输入bin/spark-submit --help可以得到该命令的使用帮助。

```
--master  MASTER_URL                          spark://host:port, mesos://host:port, yarn, or local.
       --deploy-mode    DEPLOY_MODE          driver运行之处，client运行在本机，cluster运行在集群
       --class CLASS_NAME                              应用程序包的要运行的class
       --name NAME                                             应用程序名称
       --jars JARS                                                  用逗号隔开的driver本地jar包列表以及executor类路径
       --py-files PY_FILES                                   用逗号隔开的放置在Python应用程序PYTHONPATH上的.zip, .egg, .py文件列表
       --files                                                            FILES 用逗号隔开的要放置在每个executor工作目录的文件列表
       --properties-file                                           FILE 设置应用程序属性的文件放置位置，默认是conf/spark-defaults.conf
       --driver-memory MEM                               driver内存大小，默认512M
       --driver-java-options                                  driver的java选项
       --driver-library-path                                    driver的库路径Extra library path entries to pass to the driver
       --driver-class-path                                      driver的类路径，用--jars 添加的jar包会自动包含在类路径里
       --executor-memory MEM                          executor内存大小，默认1G

       Spark standalone with cluster deploy mode only:
       --driver-cores NUM driver使用内核数，默认为1
       --supervise 如果设置了该参数，driver失败是会重启

       Spark standalone and Mesos only:
       --total-executor-cores NUM executor使用的总核数

       YARN-only:
       --executor-cores NUM 每个executor使用的内核数，默认为1
       --queue QUEUE_NAME 提交应用程序给哪个YARN的队列，默认是default队列
       --num-executors NUM 启动的executor数量，默认是2个
       --archives ARCHIVES 被每个executor提取到工作目录的档案列表，用逗号隔开
```

注意强调：
关于以上spark-submit的help信息，有几点需要强调一下：

```
    关于--master  --deploy-mode，正常情况下，可以不需要配置--deploy-mode，使用下面的值配置--master就可以了，使用类似 --master spark://host:port --deploy-mode cluster会将driver提交给cluster，然后就将worker给kill的现象。
```

Master URL 	 含义
```
 local 	 使用1个worker线程在本地运行Spark应用程序
 local[K] 	 使用K个worker线程在本地运行Spark应用程序
 local[*] 	 使用所有剩余worker线程在本地运行Spark应用程序
 spark://HOST:PORT 	 连接到Spark Standalone集群，以便在该集群上运行Spark应用程序
 mesos://HOST:PORT 	 连接到Mesos集群，以便在该集群上运行Spark应用程序
 yarn-client 	 以client方式连接到YARN集群，集群的定位由环境变量HADOOP_CONF_DIR定义，该方式driver在client运行。
 yarn-cluster 	 以cluster方式连接到YARN集群，集群的定位由环境变量HADOOP_CONF_DIR定义，该方式driver也在集群中运行。
```


* 如果要使用--properties-file的话，在--properties-file中定义的属性就不必要在spark-sumbit中再定义了，比如在conf/spark-defaults.conf 定义了spark.master，就可以不使用--master了。关于Spark属性的优先权为：SparkConf方式 > 命令行参数方式 >文件配置方式，具体参见[Spark1.0.0属性配置](https://blog.csdn.net/book_mmicky/article/details/29472439)
* 和之前的版本不同，Spark1.0.0会将自身的jar包和--jars选项中的jar包自动传给集群。
Spark使用下面几种URI来处理文件的传播：
    file:// 使用file://和绝对路径，是由driver的HTTP server来提供文件服务，各个executor从driver上拉回文件。
    hdfs:, http:, https:, ftp: executor直接从URL拉回文件
    local: executor本地本身存在的文件，不需要拉回；也可以是通过NFS网络共享的文件。
* 如果需要查看配置选项是从哪里来的，可以用打开--verbose选项来生成更详细的运行信息以做参考。

## 2-spark 命令参数博客

### 2-1 spark 命令参数详解博主1

原文地址： https://blog.csdn.net/u013063153/article/details/73384770

部分总结：
* 2.1.1 总资源
```
Master 节点

8 核 16G 500G 高效云盘

1 台

Worker 节点 x 10 台

8 核 16G 500G 高效云盘

10 台

总资源：8 核 16G（Worker）x 10 + 8 核 16G（Master）

注意：由于作业提交的时候资源只计算 CPU 和内存，所以这里磁盘的大小并未计算到总资源中。

Yarn 可分配总资源：12 核 12.8G（worker）x 10

注意：默认情况下，yarn 可分配核 = 机器核 x 1.5，yarn 可分配内存 = 机器内存 x 0.8。

提交作业
```

* 2.2.2 配置详细解释

```
上图所示的作业，直接使用了 Spark 官方的 example 包，所以不需要自己上传 jar 包。

参数列表如下所示：

--class org.apache.spark.examples.SparkPi --master yarn --deploy-mode client --driver-memory 4g –num-executors 2 --executor-memory 2g --executor-cores 2 /opt/apps/spark-1.6.0-bin-hadoop2.6/lib/spark-examples*.jar 10
参数说明如下所示：

参数	参考值	说明
class	org.apache.spark.examples.SparkPi	作业的主类。
master	yarn	因为 E-MapReduce 使用 Yarn 的模式，所以这里只能是 yarn 模式。

yarn-client	等同于 –-master yarn —deploy-mode client， 此时不需要指定deploy-mode。

yarn-cluster	等同于 –-master yarn —deploy-mode cluster， 此时不需要指定deploy-mode。
deploy-mode	client	client 模式表示作业的 AM 会放在 Master 节点上运行。要注意的是，如果设置这个参数，那么需要同时指定上面 master 为 yarn。

cluster	cluster 模式表示 AM 会随机的在 worker 节点中的任意一台上启动运行。要注意的是，如果设置这个参数，那么需要同时指定上面 master 为yarn。
driver-memory	4g	driver 使用的内存，不可超过单机的 core 总数。
num-executors	2	创建多少个 executor。
executor-memory	2g	各个 executor 使用的最大内存，不可超过单机的最大可使用内存。
executor-cores	2	各个 executor 使用的并发线程数目，也即每个 executor 最大可并发执行的 Task 数目。
```

* 3-几种模式计算资源详解
博主总结的还是蛮不错的！

* 3-1 yarn-client
```
资源计算
在不同模式、不同的设置下运行时，作业使用的资源情况如下表所示：

yarn-client 模式的资源计算
节点	资源类型	资源量（结果使用上面的例子计算得到）
master	core	1

mem	driver-memroy = 4G
worker	core	num-executors * executor-cores = 4

mem	num-executors * executor-memory = 4G
作业主程序（Driver 程序）会在 master 节点上执行。按照作业配置将分配 4G（由 —driver-memroy 指定）的内存给它（当然实际上可能没有用到）。

会在 worker 节点上起 2 个（由 —num-executors 指定）executor，每一个 executor 最大能分配 2G（由 —executor-memory 指定）的内存，并最大支持 2 个（由- -executor-cores 指定）task 的并发执行。
```
附上截图：更有感觉

![yarn-client 启动资源计算](assets/000/20180726-67999265.png)  


* 3-2 yarn-cluster

```
yarn-cluster 模式的资源计算
节点	资源类型	资源量（结果使用上面的例子计算得到）
master
一个很小的 client 程序，负责同步 job 信息，占用很小。
worker	core	num-executors * executor-cores+spark.driver.cores = 5

mem	num-executors * executor-memory + driver-memroy = 8g
注意：这里的 spark.driver.cores 默认是 1，也可以设置为更多。

```
也附上原图：

![yarn-cluster 资源的计算](assets/000/20180726-f2d6618b.png)  


* 4- yarn 模式的两种优化

* 4-1yarn-client 模式
若您有了一个大作业，使用 yarn-client 模式，想要多用一些这个集群的资源，请参见如下配置：

注意：

Spark 在分配内存时，会在用户设定的内存值上溢出 375M 或 7%（取大值）。
Yarn 分配 container 内存时，遵循向上取整的原则，这里也就是需要满足 1G 的整数倍。

```
--master yarn-client --driver-memory 5g –-num-executors 20 --executor-memory 4g --executor-cores 4
按照上述的资源计算公式，

master 的资源量为：

core：1
mem：6G (5G + 375M 向上取整为 6G)
workers 的资源量为：

core: 20*4 = 80
mem: 20*5G (4G + 375M 向上取整为 5G) = 100G
可以看到总的资源没有超过集群的总资源，那么遵循这个原则，您还可以有很多种配置，例如：

可以看到总的资源没有超过集群的总资源，那么遵循这个原则，您还可以有很多种配置，例如：

--master yarn-client --driver-memory 5g –num-executors 40 --executor-memory 1g --executor-cores 2
--master yarn-client --driver-memory 5g –num-executors 15 --executor-memory 4g --executor-cores 4
--master yarn-client --driver-memory 5g –num-executors 10 --executor-memory 9g --executor-cores 6
原则上，按照上述的公式计算出来的需要资源不超过集群的最大资源量就可以。但在实际场景中，因为系统，hdfs 以及 E-MapReduce 的服务会需要使用 core 和 mem 资源，如果把 core 和 mem 都占用完了，反而会导致性能的下降，甚至无法运行。

executor-cores 数一般也都会被设置成和集群的可使用核一致，因为如果设置的太多，CPU 会频繁切换，性能并不会提高。
```

* 4-2 yarn-cluster 模式

```
当使用 yarn-cluster 模式后，Driver 程序会被放到 worker 节点上。资源会占用到 worker 的资源池子里面，这时若想要多用一些这个集群的资源，请参加如下配置：

--master yarn-cluster --driver-memory 5g –num-executors 15 --executor-memory 4g --executor-cores 4

```

---
配置建议
如果将内存设置的很大，要注意 gc 所产生的消耗。一般我们会推荐一个 executor 的内存 <= 64G。

如果是进行 HDFS 读写的作业，建议是每个 executor 中使用 <= 5个并发来读写。

如果是进行 OSS 读写的作业，我们建议是将 executor 分布在不同的 ECS 上，这样可以将每一个 ECS 的带宽都用上。比如有 10 台 ECS，那么就可以配置 num-executors=10，并设置合理的内存和并发。

如果作业中使用了非线程安全的代码，那么在设置 executor-cores 的时候需要注意多并发是否会造成作业的不正常。如果会，那么推荐就设置 executor-cores=1。
---

### 2-2 spark submit 参数详解 博主2
原文地址：https://www.jianshu.com/p/9d5234185d68

```
启动参数
/bin/spark-submit
--master yarn-cluster
--num-executors 100
--executor-memory 6G
--executor-cores 4
--driver-memory 1G
--conf spark.default.parallelism=1000
--conf spark.storage.memoryFraction=0.5
--conf spark.shuffle.memoryFraction=0.3 \

这样的配置的话：
假如集群 ：
  125G 内存  2个物理cpu ，每个cpu 是8 核 ，逻辑核数 32。
      32* 10=320 个核
      125G * 10 =1250 G 内存
假设 executor 设置为 50-100 区间
每个ececutor 的核数为 2-4个为准
那么：
总共任务请求了上述申请资源申请了：--num-executors 100  100个executor评分到10个机子上，每台机器 10个executor
每台机器：内存 --executor-memory 6G * 10（executor） =60G 每台有125G内存可行
每台机器：核数
      四个核数：
        --executor-cores 4(个)* 10 也就是 =40核数 40>32 了，所以不可行，怎么办呢
      三个核的话
        --executor-cores 3(个)* 10 也就是 =30核数 30<32 了,虽然没有达到总量但是也不可行，会占用更多别的资源，影响其他队列或者gc 的调优
      两个：可行
        --executor-cores 2(个)* 10 也就是 =20核数 20<32 了  更合适
        一个核数：
          适用于代码中没有处理线程安全问题的话，可以每个executor用一个核 ，如果设置为2，你的项目没有这个线程安全问题的话，也可以设置为2

num-executors
参数说明：该参数用于设置Spark作业总共要用多少个Executor进程来执行。Driver在向YARN集群管理器申请资源时，YARN集群管理器会尽可能按照你的设置来在集群的各个工作节点上，启动相应数量的Executor进程。这个参数非常之重要，如果不设置的话，默认只会给你启动少量的Executor进程，此时你的Spark作业的运行速度是非常慢的。
参数调优建议：每个Spark作业的运行一般设置50~100个左右的Executor进程比较合适，设置太少或太多的Executor进程都不好。设置的太少，无法充分利用集群资源；设置的太多的话，大部分队列可能无法给予充分的资源。

executor-memory
参数说明：该参数用于设置每个Executor进程的内存。Executor内存的大小，很多时候直接决定了Spark作业的性能，而且跟常见的JVM OOM异常，也有直接的关联。
参数调优建议：每个Executor进程的内存设置4G8G较为合适。但是这只是一个参考值，具体的设置还是得根据不同部门的资源队列来定。可以看看自己团队的资源队列的最大内存限制是多少，num-executors乘以executor-memory，就代表了你的Spark作业申请到的总内存量（也就是所有Executor进程的内存总和），这个量是不能超过队列的最大内存量的。此外，如果你是跟团队里其他人共享这个资源队列，那么申请的总内存量最好不要超过资源队列最大总内存的1/31/2，避免你自己的Spark作业占用了队列所有的资源，导致别的同学的作业无法运行。

executor-cores
参数说明：该参数用于设置每个Executor进程的CPU core数量。这个参数决定了每个Executor进程并行执行task线程的能力。因为每个CPU core同一时间只能执行一个task线程，因此每个Executor进程的CPU core数量越多，越能够快速地执行完分配给自己的所有task线程。
参数调优建议：Executor的CPU core数量设置为2~4个较为合适。同样得根据不同部门的资源队列来定，可以看看自己的资源队列的最大CPU core限制是多少，再依据设置的Executor数量，来决定每个Executor进程可以分配到几个CPU core。同样建议，如果是跟他人共享这个队列，那么num-executors * executor-cores不要超过队列总CPU core的1/3~1/2左右比较合适，也是避免影响其他同学的作业运行。
比如一个 executor 设置为


spark.default.parallelism
参数说明：该参数用于设置每个stage的默认task数量。这个参数极为重要，如果不设置可能会直接影响你的Spark作业性能。
参数调优建议：Spark作业的默认task数量为500~1000个较为合适。很多同学常犯的一个错误就是不去设置这个参数，那么此时就会导致Spark自己根据底层HDFS的block数量来设置task的数量，默认是一个HDFS block对应一个task。通常来说，Spark默认设置的数量是偏少的（比如就几十个task），如果task数量偏少的话，就会导致你前面设置好的Executor的参数都前功尽弃。试想一下，无论你的Executor进程有多少个，内存和CPU有多大，但是task只有1个或者10个，那么90%的Executor进程可能根本就没有task执行，也就是白白浪费了资源！因此Spark官网建议的设置原则是，设置该参数为num-executors * executor-cores的2~3倍较为合适，比如Executor的总CPU core数量为300个，那么设置1000个task是可以的，此时可以充分地利用Spark集群的资源。

spark.storage.memoryFraction
参数说明：该参数用于设置RDD持久化数据在Executor内存中能占的比例，默认是0.6。也就是说，默认Executor 60%的内存，可以用来保存持久化的RDD数据。根据你选择的不同的持久化策略，如果内存不够时，可能数据就不会持久化，或者数据会写入磁盘。
参数调优建议：如果Spark作业中，有较多的RDD持久化操作，该参数的值可以适当提高一些，保证持久化的数据能够容纳在内存中。避免内存不够缓存所有的数据，导致数据只能写入磁盘中，降低了性能。但是如果Spark作业中的shuffle类操作比较多，而持久化操作比较少，那么这个参数的值适当降低一些比较合适。此外，如果发现作业由于频繁的gc导致运行缓慢（通过spark web ui可以观察到作业的gc耗时），意味着task执行用户代码的内存不够用，那么同样建议调低这个参数的值。

spark.shuffle.memoryFraction
参数说明：该参数用于设置shuffle过程中一个task拉取到上个stage的task的输出后，进行聚合操作时能够使用的Executor内存的比例，默认是0.2。也就是说，Executor默认只有20%的内存用来进行该操作。shuffle操作在进行聚合时，如果发现使用的内存超出了这个20%的限制，那么多余的数据就会溢写到磁盘文件中去，此时就会极大地降低性能。
参数调优建议：如果Spark作业中的RDD持久化操作较少，shuffle操作较多时，建议降低持久化操作的内存占比，提高shuffle操作的内存占比比例，避免shuffle过程中数据过多时内存不够用，必须溢写到磁盘上，降低了性能。此外，如果发现作业由于频繁的gc导致运行缓慢，意味着task执行用户代码的内存不够用，那么同样建议调低这个参数的值。



```
