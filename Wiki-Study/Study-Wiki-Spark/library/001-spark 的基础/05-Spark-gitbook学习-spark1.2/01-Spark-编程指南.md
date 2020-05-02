# git-book的介绍

## 概述

    宏观上说，每个 Spark 应用程序都由一个驱动程序(driver programe)构成，驱动程序在集群上
    运行用户的  main  函数来执行各种各样的并行操作(parallel operations)。Spark 的主要抽象
    是提供一个弹性分布式数据集(RDD resilient distributed dataset)，RDD 是指能横跨集群所有
    节点进行并行计算的分区元素集合。RDD 可以从 Hadoop 文件系统中的一个文件中创建而来
    (或其他 Hadoop 支持的文件系统)，或者从一个已有的 Scala 集合转换得到。用户可以要求
    Spark 将 RDD 持久化(persist)到内存中，来让它在并行计算中高效地重用。最后，RDD 能从
    节点失败中自动地恢复过来。
    Spark 的第二个抽象是共享变量(shared variables)，共享变量能被运行在并行计算中。默认情
    况下，当 Spark 运行一个并行函数时，这个并行函数会作为一个任务集在不同的节点上运
    行，它会把函数里使用的每个变量都复制搬运到每个任务中。有时，一个变量需要被共享到
    交叉任务中或驱动程序和任务之间。Spark 支持 2 种类型的共享变量：广播变量(broadcast
    variables)，用来在所有节点的内存中缓存一个值；累加器(accumulators)，仅仅只能执行“添
    加(added)”操作，例如：记数器(counters)和求和(sums)。
    这个指南会在 Spark 支持的所有语言中演示它的每一个特征。可以非常简单地从一个 Spark
    交互式 shell 开始 -——  bin/spark-shell  开始一个 Scala shell，或  bin/pyspark  开始一个
    Python shell。


## spark 简单案例

```java
# For Scala and Java, use run-example:
./bin/run-example SparkPi
# For Python examples, use spark-submit directly:
./bin/spark-submit examples/src/main/python/pi.py
```

## spark 的初始化

### 初始化 Spark
Spark 编程的第一步是需要创建一个 SparkContext 对象，用来告诉 Spark 如何访问集群。在
创建  SparkContext  之前，你需要构建一个 SparkConf 对象， SparkConf 对象包含了一些你
应用程序的信息。

    val conf = new SparkConf().setAppName(appName).setMaster(master)
    new SparkContext(conf)
appName  参数是你程序的名字，它会显示在 cluster UI 上。 master  是 Spark, Mesos 或
YARN 集群的 URL，或运行在本地模式时，使用专用字符串 “local”。在实践中，当应用程序
运行在一个集群上时，你并不想要把  master  硬编码到你的程序中，你可以用 spark-submit
启动你的应用程序的时候传递它。然而，你可以在本地测试和单元测试中使用 “local” 运行
Spark 进程


### 使用 Shell
在 Spark shell 中，有一个专有的 SparkContext 已经为你创建好。在变量中叫做  sc  。你自
己创建的 SparkContext 将无法工作。可以用  --master  参数来设置 SparkContext 要连接的
集群，用  --jars  来设置需要添加到 classpath 中的 JAR 包，如果有多个 JAR 包使用逗号分
割符连接它们。例如：在一个拥有 4 核的环境上运行  bin/spark-shell  ，使用：

    $ ./bin/spark-shell --master local[4]
或在 classpath 中添加  code.jar  ，使用：

    $ ./bin/spark-shell --master local[4] --jars code.jar
执行  spark-shell --help  获取完整的选项列表。在这之后，调用  spark-shell  会比 spark-
submit 脚本更为普遍


## 弹性分布式数据集 (RDDs)

Spark 核心的概念是 Resilient Distributed Dataset (RDD)：一个可并行操作的有容错机制的数
据集合。有 2 种方式创建 RDDs：第一种是在你的驱动程序中并行化一个已经存在的集合；
另外一种是引用一个外部存储系统的数据集，例如共享的文件系统，HDFS，HBase或其他
Hadoop 数据格式的数据源

    并行集合
    外部数据集
    RDD 操作 <<<<<<< HEAD
    传递函数到 Spark
    使用键值对
    Transformations
    Actions
    RDD持久化
    传递函数到 Spark
    使用键值对
    Transformations
    Actions
    RDD 持久化

### 1-并行集合

并行集合 (Parallelized collections) 的创建是通过在一个已有的集合(Scala  Seq  )上调用
SparkContext 的  parallelize  方法实现的。集合中的元素被复制到一个可并行操作的分布式
数据集中。例如，这里演示了如何在一个包含 1 到 5 的数组中创建并行集合：

    val data = Array(1, 2, 3, 4, 5)
    val distData = sc.parallelize(data)
一旦创建完成，这个分布式数据集( distData  )就可以被并行操作。例如，我们可以调用
distData.reduce((a, b) => a + b)  将这个数组中的元素相加。我们以后再描述在分布式上的
一些操作。
并行集合一个很重要的参数是切片数(slices)，表示一个数据集切分的份数。Spark 会在集群
上为每一个切片运行一个任务。你可以在集群上为每个 CPU 设置 2-4 个切片(slices)。正常情
况下，Spark 会试着基于你的集群状况自动地设置切片的数目。然而，你也可以通过
parallelize  的第二个参数手动地设置(例如： sc.parallelize(data, 10)  )。


### 2-外部数据集
Spark 可以从任何一个 Hadoop 支持的存储源创建分布式数据集，包括你的本地文件系统，
HDFS，Cassandra，HBase，Amazon S3等。 Spark 支持文本文件(text
files)，SequenceFiles 和其他 Hadoop InputFormat。
文本文件 RDDs 可以使用 SparkContext 的  textFile  方法创建。 在这个方法里传入文件的
URI (机器上的本地路径或  hdfs://  ， s3n://  等)，然后它会将文件读取成一个行集合。这里
是一个调用例子：
    scala> val distFile = sc.textFile("data.txt")
    distFile: RDD[String] = MappedRDD@1d4cee08
一旦创建完成， distFiile  就能做数据集操作。例如，我们可以用下面的方式使用  map  和
reduce  操作将所有行的长度相加：
    distFile.map(s => s.length).reduce((a, b) => a + b)  。

* 注意，Spark 读文件时：

>1. 如果使用本地文件系统路径，文件必须能在 work 节点上用相同的路径访问到。要么复制
文件到所有的 workers，要么使用网络的方式共享文件系统。
所有 Spark 的基于文件的方法，包括  textFile  ，能很好地支持文件目录，压缩过的文件
和通配符。例如，你可以使用  textFile("/my/文件目录")  ， textFile("/my/文件目
录/*.txt")  和  textFile("/my/文件目录/*.gz")  。

>2. textFile  方法也可以选择第二个可选参数来控制切片(slices)的数目。默认情况下，
Spark 为每一个文件块(HDFS 默认文件块大小是 64M,hadoop 2 中是128M)创建一个切片(slice)。但是你也可
以通过一个更大的值来设置一个更高的切片数目。注意，你不能设置一个小于文件块数
目的切片值。你比如一个文件在hdfs上面分了三个文件块儿，你不能设置切片小鱼3

* 除了文本文件，Spark 的 Scala API 支持其他几种数据格式：

>1. SparkContext.wholeTextFiles  让你读取一个包含多个小文本文件的文件目录并且返回每
一个(filename, content)对。与  textFile  的差异是：它记录的是每个文件中的每一行。

>2. 对于 SequenceFiles，可以使用 SparkContext 的  sequenceFile[K, V]  方法创建，K 和 V
分别对应的是 key 和 values 的类型。像 IntWritable 与 Text 一样，它们必须是 Hadoop
的 Writable 接口的子类。另外，对于几种通用的 Writables，Spark 允许你指定原生类型
来替代。例如：  sequenceFile[Int, String]  将会自动读取 IntWritables 和 Text。

>3. 对于其他的 Hadoop InputFormats，你可以使用  SparkContext.hadoopRDD  方法，它可以
指定任意的  JobConf  ，输入格式(InputFormat)，key 类型，values 类型。你可以跟设置
Hadoop job 一样的方法设置输入源。你还可以在新的 MapReduce 接口
(org.apache.hadoop.mapreduce)基础上使用  SparkContext.newAPIHadoopRDD  (译者注：老
的接口是  SparkContext.newHadoopRDD  )。

>4. RDD.saveAsObjectFile  和  SparkContext.objectFile  支持保存一个RDD，保存格式是一
个简单的 Java 对象序列化格式。这是一种效率不高的专有格式，如 Avro，它提供了简
单的方法来保存任何一个 RDD。

### 3- RDD的操作


### 4-RDD

DDs 支持 2 种类型的操作：转换(transformations) 从已经存在的数据集中创建一个新的数据
集；动作(actions) 在数据集上进行计算之后返回一个值到驱动程序。例如， map  是一个转换
操作，它将每一个数据集元素传递给一个函数并且返回一个新的 RDD。另一方面， reduce
是一个动作，它使用相同的函数来聚合 RDD 的所有元素，并且将最终的结果返回到驱动程序
(不过也有一个并行  reduceByKey  能返回一个分布式数据集)。

在 Spark 中，所有的转换(transformations)都是惰性(lazy)的，它们不会马上计算它们的结
果。相反的，它们仅仅记录转换操作是应用到哪些基础数据集(例如一个文件)上的。转换仅仅
在这个时候计算：当动作(action) 需要一个结果返回给驱动程序的时候。这个设计能够让
Spark 运行得更加高效。例如，我们可以实现：通过  map  创建一个新数据集在  reduce  中使
用，并且仅仅返回  reduce  的结果给 driver，而不是整个大的映射过的数据集。

默认情况下，每一个转换过的 RDD 会在每次执行动作(action)的时候重新计算一次。然而，
你也可以使用  persist  (或  cache  )方法持久化( persist  )一个 RDD 到内存中。在这个情况
下，Spark 会在集群上保存相关的元素，在你下次查询的时候会变得更快。在这里也同样支持
持久化 RDD 到磁盘，或在多个节点间复制。

###  如下简单程序

    val lines = sc.textFile("data.txt")
    val lineLengths = lines.map(s => s.length)
    val totalLength = lineLengths.reduce((a, b) => a + b)


第一行是定义来自于外部文件的 RDD。这个数据集并没有加载到内存或做其他的操
作： lines  仅仅是一个指向文件的指针。第二行是定义  lineLengths  ，它是  map  转换
(transformation)的结果。同样， lineLengths  由于懒惰模式也没有立即计算。最后，我们执
行  reduce  ，它是一个动作(action)。在这个地方，Spark 把计算分成多个任务(task)，并且让
它们运行在多个机器上。每台机器都运行自己的 map 部分和本地 reduce 部分。然后仅仅将
结果返回给驱动程序。
如果我们想要再次使用  lineLengths  ，我们可以添加：

    lineLengths.persist()
在  reduce  之前，它会导致  lineLengths  在第一次计算完成之后保存到内存中。



### 传递函数到 Spark
Spark 的 API 很大程度上依靠在驱动程序里传递函数到集群上运行。这里有两种推荐的方
式：
匿名函数 (Anonymous function syntax)，可以在比较短的代码中使用。
全局单例对象里的静态方法。例如，你可以定义  object MyFunctions  然后传递
MyFounctions.func1  ，像下面这样：

    object MyFunctions {
    def func1(s: String): String = { ... }
    }
    
    myRdd.map(MyFunctions.func1)


# 剩余本书看[原文链接](https://legacy.gitbook.com/book/aiyanbo/spark-programming-guide-zh-cn/details)
这里仅在本04小节总结问题
