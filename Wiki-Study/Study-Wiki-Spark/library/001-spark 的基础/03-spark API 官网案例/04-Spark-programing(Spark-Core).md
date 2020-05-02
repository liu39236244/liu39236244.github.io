# programing [官网地址](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html)

## maven包的导入与上下文创建

To write a Spark application, you need to add a Maven dependency on Spark. Spark is available through Maven Central at:

    groupId = org.apache.spark
    artifactId = spark-core_2.11
    version = 2.2.0

In addition, if you wish to access an HDFS cluster, you need to add a dependency on hadoop-client for your version of HDFS.

    groupId = org.apache.hadoop
    artifactId = hadoop-client
    version = <your-hdfs-version>

Finally, you need to import some Spark classes into your program. Add the following lines:

    import org.apache.spark.SparkContext
    import org.apache.spark.SparkConf
创建上下文对象
val conf = new SparkConf().setAppName(appName).setMaster(master)
new SparkContext(conf)

## [accumulators](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#accumulators)

```scala
val data =Array(1,2,3,4,5)
    var counter = 0
    var rdd = sc.parallelize(data)

    // 不可以这么做
    rdd.foreach(x => counter += x)

    println("Counter value: " + counter)


```

```Scala
/**
    * 并行数据
    */
  def Demo01_Parallelized_Collections() = {
    // 官网案例链接 (http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#using-the-shell)
    val data = Array(1, 2, 3, 4, 5)
    //可以在第二个的参数中设置分区数，
    val distData = sc.parallelize(data)
    // distData.collect().foreach(println(_))
    val resoult: Int = distData.reduce((a, b) => Math.max(a, b))
    //println("数值中最大数"+resoult)

    /**
      * 官方描述
      * External Datasets 外部数据集
      * Spark可以从Hadoop支持的任何存储源创建分布式数据集，
      * 包括本地文件系统、HDFS、Cassandra、HBase、Amazon S3等。
      * Spark支持文本文件、SequenceFiles和任何其他Hadoop InputFormat。
      * scala> val distFile = sc.textFile("data.txt")
      * distFile: org.apache.spark.rdd.RDD[String] = data.txt MapPartitionsRDD[10] at textFile at <console>:26
      */
    //加载本地数据
    val SourceLine: RDD[String] = sc.textFile("src/main/MyData/TxtData/readme.md")
     SourceLine.collect().foreach(println)

    //此外可以通过map reduce 计算每一行的内容长度，并返回内容最长哪一行的字的个数
    /**
      *
      * distFile.map(s => s.length).reduce((a, b) => a + b).
      */
    SourceLine.map(_.size).reduce((a, b) => if (a > b) a else b)
    //或者SourceLine.map(_.size).reduce((a,b) => Math.max(a,b))
    /**
      * Some notes on reading files with Spark
      * If using a path on the local filesystem, the file must also be accessible at the same path on worker nodes. Either copy the file to all workers or use a network-mounted shared file system.
      * 如果是在本地路径的话，每个机器在相同的路径上都应该有相同的文件，
      *
      * All of Spark’s file-based input methods, including textFile, support running on directories, compressed files, and wildcards as well.
      * For example, you can use textFile("/my/directory"), textFile("/my/directory/星号.txt"), and textFile("/my/directory/星号.gz")
      * spark 读取文件都基于input方法，包括 文本文档。支持正在使用的目录，压缩文件甚至还能支持通配符
      *
      * The textFile method also takes an optional second argument for controlling the number of partitions of
      * the file. By default, Spark creates one partition for each block of the file (blocks being 128MB by default in HDFS),
      * but you can also ask for a higher number of partitions by passing a larger value. Note that you cannot have fewer partitions than blocks.
      * 默认情况下，Spark为文件的每个块创建一个分区(默认情况下是在HDFS中为128MB一个块)，但是您也可以通过传递一个较大的值来请求更多的分区。请注意，不能有比块更少的分区。比如你一个文件分了两个块儿，你不能设置分区小于2
      *
      * 而且除了文本格式spark还支持其他数据格式：
      *
      * SparkContext。wholeTextFiles允许您读取包含多个小文本文件的目录，并将其中的每个文件作为(文件名、内容)对返回。
      * 这与textFile形成对比，textFile将在每个文件中返回一行记录。分区是由数据位置决定的，
      * 在某些情况下，可能导致分区太少。对于这些情况，wholeTextFiles提供了一个可选的第二个参数，用于控制最小数量的分区。
      *
      * 对于 SequenceFiles，可以使用 SparkContext 的  sequenceFile[K, V]  方法创建，K 和 V
      * 分别对应的是 key 和 values 的类型。像 IntWritable 与 Text 一样，它们必须是 Hadoop
      * 的 Writable 接口的子类。另外，对于几种通用的 Writables，Spark 允许你指定原生类型
      * 来替代。例如：  sequenceFile[Int, String]  将会自动读取 IntWritables 和 Text。
      *
      * 对于其他的 Hadoop InputFormats，你可以使用  SparkContext.hadoopRDD  方法，它可以
      * 指定任意的  JobConf  ，输入格式(InputFormat)，key 类型，values 类型。你可以跟设置
      * Hadoop job 一样的方法设置输入源。你还可以在新的 MapReduce 接口
      * (org.apache.hadoop.mapreduce)基础上使用  SparkContext.newAPIHadoopRDD  (译者注：老
      * 的接口是  SparkContext.newHadoopRDD )
      *
      * RDD.saveAsObjectFile and SparkContext.objectFile 这两种方法定义了一种可以存储任何rdd到本地，但是不是一种有效率的格式比如avro
      */

    /**
      * 读取外部数据，由于懒加载机制，在textfile/map  reduce  三个算子中 只有reduce 才真正进行数据的加载计算
      * 如果重复想使用数据 的话可以缓存
      */

    // SourceLine.persist() // 进行缓存数据

    /**
      * 分割*************
      */
    //Passing Functions to Spark 通过传入函数
    /**
      * object MyFunctions {
      * def func1(s: String): String = { ... }
      * }
      *
      *myRdd.map(MyFunctions.func1)
      */

    object MyFunctions {
      def func1(s: String): String = {
        var rs: String = ""
        if (s.contains("com/)")) {
          rs = s
        }
        rs
      }
    }
    // 打印到控制台
    //SourceLine.map(MyFunctions.func1(_)).filter(_!="").collect().foreach(println(_))

    // 存储到本地
    //SourceLine.map(MyFunctions.func1(_)).filter(_!="").saveAsTextFile("F:\\MyTestFold_Spark\\gitTestData\\output\\00")

    /**
      * 分割***************
      */

    // * 也可以定义定义到一个类中
    /*    class MyClass {
          def func1(s: String): String = { s }
          def doStuff(rdd: RDD[String]): RDD[String] = { rdd.map(func1) }
        }*/

    // ---------------------------------------------------------------------------------
    /*  class MyClass  {
        val field = "Hello"
        def doStuff(rdd: RDD[String]): RDD[String] = { rdd.map(x => field + x) }
      }*/
    // 下面这种情况会报错
    /**
      * Exception in thread "main" org.apache.spark.SparkException: Task not serializable
      *
      * 因为任务要传到集群上面，而每一个map中都调用了外部类的一个属性字段，就相当于每次都调用了外部类，但是外部类没有序列化就会有此类错误！
      * 这里参考过的博客：http://www.cnblogs.com/zwCHAN/p/4305156.html
      */
    // new MyClass().doStuff(SourceLine).foreach(println(_))

    /**
      * 解决办法
      *
      */

    class MyClass {
      val field = "前缀"

      def doStuff(rdd: RDD[String]): RDD[String] = {
        val field_ = this.field
        rdd.map(x => field_ + x)
      }
    }
    new MyClass().doStuff(SourceLine).foreach(println(_))

    // -------------------------------------------------------------------------------

  }

```

在程序执行foreach 中添加一个变量的行为的代码中会出现全局变量问题：

The behavior of the above code is undefined, and may not work as intended. To execute jobs, Spark breaks up the processing of RDD operations into tasks, each of which is executed by an executor. Prior to execution, Spark computes the task’s closure. The closure is those variables and methods which must be visible for the executor to perform its computations on the RDD (in this case foreach()). This closure is serialized and sent to each executor.

    官网给的解释：
    (上述代码的行为是未定义的，可能不像预期的那样工作。为了执行作业，Spark将RDD操作的处理分解为任务，每个任务由执行器执行。在执行之前，Spark计算任务的闭包。闭包是执行器在RDD上执行其计算时必须可见的变量和方法(在本例中foreach())。这个闭包被序列化并发送给每个执行器。)

The variables within the closure sent to each executor are now copies and thus, when counter is referenced within the foreach function, it’s no longer the counter on the driver node. There is still a counter in the memory of the driver node but this is no longer visible to the executors! The executors only see the copy from the serialized closure. Thus, the final value of counter will still be zero since all operations on counter were referencing the value within the serialized closure.

    (关闭发送给每个executor的变量现在是副本，因此，当在foreach函数中引用计数器时，它不再是驱动节点上的计数器。在驱动节点的内存中仍然有一个计数器，但是这对执行器来说已经不可见了!执行程序只从序列化的闭包中看到副本。因此，计数器的最终值仍然为零，因为计数器上的所有操作都引用了序列化闭包中的值。)

In local mode, in some circumstances the foreach function will actually execute within the same JVM as the driver and will reference the same original counter, and may actually update it.

    (在本地模式中，在某些情况下，foreach函数实际上会在同一JVM中执行驱动程序，并引用相同的原始计数器，并可能实际更新它。)

To ensure well-defined behavior in these sorts(种类) of scenarios one should use an Accumulator. [Accumulators](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#accumulators) in Spark are used specifically to provide a mechanism(机制) for safely updating a variable when execution is split up across worker nodes in a cluster. The Accumulators section（部分） of this guide discusses these in more detail.

    (为了确保在这些场景中定义良好的行为，应该使用累加器。Spark中的累加器专门用于提供一种机制，用于在集群中跨工作节点的执行时安全地更新一个变量。本指南的累加器部分更详细地讨论了这些问题。)

In general, closures - constructs like loops or locally defined methods, should not be used to mutate（改变） some global state. Spark does not define or guarantee（保证） the behavior of mutations（突变） to objects referenced from outside of closures. Some code that does this may work in local mode, but that’s just by accident（事故） and such code will not behave as expected in distributed mode. Use an Accumulator instead（代替） if some global aggregation（聚合） is needed

  （一般来说，闭包——像循环或局部定义的方法——不应该被用来改变某些全局状态。Spark没有定义或保证从闭包外部引用的对象的突变行为。有些代码可以在本地模式下工作，但这只是偶然，这种代码在分布式模式下不会像预期那样运行。如果需要一些全局聚合，则使用累加器。）

## Printing elements of an RDD

>Another common idiom is attempting to print out the elements of an RDD using rdd.foreach(println) or rdd.map(println). On a single machine, this will generate(使形成) the expected output and print all the RDD’s elements. However, in cluster mode, the output to stdout being called by the executors is now writing to the executor’s stdout instead, not the one on the driver, so stdout on the driver won’t show these! To print all elements on the driver, one can use the collect() method to first bring the RDD to the driver node thus: rdd.collect().foreach(println). This can cause the driver to run out of memory, though, because collect() fetches the entire RDD to a single machine; if you only need to print a few elements of the RDD, a safer approach is to use the take(): rdd.take(100).foreach(println).

    （另一个常见的用法是尝试用rdd.foreach(println)或rdd.map(println)来打印RDD的元素。在一台机器上，这将生成预期的输出并打印所有RDD的元素。然而，在集群模式中，执行程序调用stdout的输出现在写入执行者的stdout，而不是驱动程序中的stdout，所以stdout在驱动程序上不会显示这些!要在驱动程序上打印所有元素，可以使用collect()方法首先将RDD带到驱动节点:rdd.collect().foreach(println)。这可能导致驱动程序耗尽内存，因为collect()将整个RDD提取到一台机器;如果您只需要打印RDD的一些元素，那么使用take(): rdd.take(100).foreach(println)就更安全了。）

## Working with Key-Value

>While most Spark operations work on RDDs containing any type of objects, a few special operations are only available on RDDs of key-value pairs. The most common ones are distributed “shuffle” operations, such as grouping or aggregating the elements by a key.

    虽然大多数Spark操作都在包含任何类型对象的RDDs上工作，但是一些特殊操作只在键值对的RDDs上可用。最常见的是分布式的“洗牌”操作，例如按一个键分组或聚合元素。

>In Scala, these operations are automatically available on RDDs containing [Tuple2](http://www.scala-lang.org/api/2.11.8/index.html#scala.Tuple2) objects (the built-in tuples in the language, created by simply writing (a, b)). The key-value pair operations are available in the [PairRDDFunctions](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.PairRDDFunctions) class, which automatically wraps around an RDD of tuples.

    在Scala中，这些操作可以在包含Tuple2对象的RDDs上自动获得(通过简单的编写(a, b)创建的语言中的内置元组)。键值对操作可在PairRDDFunctions类中使用，它可以自动地封装元组的RDD。

例如，下面的代码使用键-值对上的reduceByKey操作来计算文件中每一行文本的数量:

```
val lines = sc.textFile("data.txt")
val pairs = lines.map(s => (s, 1))
val counts = pairs.reduceByKey((a, b) => a + b)
```
We could also use counts.sortByKey(), for example, to sort the pairs alphabetically, and finally counts.collect() to bring them back to the driver program as an array of objects.
    我们还可以使用counts.sortByKey()来按字母顺序对它们进行排序，最后是counts.collect()将它们作为对象数组返回给驱动程序。

>Note: when using custom objects as the key in key-value pair operations, you must be sure that a custom equals() method is accompanied with a matching hashCode() method. For full details, see the contract outlined in the Object.hashCode() documentation.

    注意:在键-值对操作中使用自定义对象时，必须确保自定义equals()方法附带了一个匹配的hashCode()方法。有关详细信息，请参见Object.hashCode()文档中概述的契约。


## Transformations

The following table lists some of the common transformations supported by Spark. Refer to the RDD API doc (Scala, Java, Python, R) and pair RDD functions doc (Scala, Java) for details.

>下表列出了Spark支持的一些常见转换。请参考RDD API doc ([Scala](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.RDD), [Java](http://spark.apache.org/docs/2.2.0/api/java/index.html?org/apache/spark/api/java/JavaRDD.html), [Python](http://spark.apache.org/docs/2.2.0/api/python/pyspark.html#pyspark.RDD), [R](http://spark.apache.org/docs/2.2.0/api/R/index.html))和对RDD函数([Scala](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.PairRDDFunctions), [Java](http://spark.apache.org/docs/2.2.0/api/java/index.html?org/apache/spark/api/java/JavaPairRDD.html))的详细信息。
这里为了写wiki方便，创建了一个方法，自动生成md格式的表格！
```Scala
/**
    * 把表格转换成md 的表格
    */
  def common_ModifyTable(input :String="src/main/MyData/TxtData/transformation.txt",output:String="src/main/MyData/TxtData/output") ={
   val data=sc.textFile(input)
      .map(line => {
        val arrays=line.split("\\t")
        s"|${arrays(0)}|${arrays(1)}|注释|"
      }).persist()
    data.repartition(1).saveAsTextFile(output)
  }
```
### Transformations <a name="transformation">算子</a>

|算子     | 描述    | 解释|
| :------------- | :------------- |:------------- |
|<a href="#map">map(func)</a><a name="map_back">:</a>|Return a new distributed dataset formed by passing each element of the source through a function func.|返回一个新的分布式数据集，该数据集通过函数func传递源的每个元素。|
|filter(func)|Return a new dataset formed by selecting those elements of the source on which func returns true.|过滤，返回满足条件为true的数据行|
|<a href="#flatMap">flatMap(func)</a><a name="flatMap_back">:</a>|Similar to map, but each input item can be mapped to 0 or more output items (so func should return a Seq rather than a single item).|类似于map，但是每个输入项都可以映射到0或更多的输出项(因此func应该返回一个Seq而不是单个项目)。比如，worldcount案例中，根据空格分开的数据map返回值RDD[Array[String]],而flatMap返回 RDD[String]|
|<a href="#mapPartitions">mapPartitions(func)</a><a name="mapPartitions_back">:</a>|Similar to map, but runs separately on each partition (block) of the RDD, so func must be of type Iterator<T> => Iterator<U> when running on an RDD of type T.|类似于map，但是在RDD的每个分区(块)上分别运行，所以func必须在类型为T的RDD上运行时，类型迭代器<T> =>迭代器<U>。假设一个rdd有10个元素，分成3个分区。如果使用map方法，map中的输入函数会被调用10次；而使用mapPartitions方法的话，其输入函数会只会被调用3次，每个分区调用1次。从而提高效率|
|<a href="#mapPartitionsWithIndex">mapPartitionsWithIndex(func)</a><a name="mapPartitionsWithIndex_back">:</a>|Similar to mapPartitions, but also provides func with an integer value representing the index of the partition, so func must be of type (Int, Iterator<T>) => Iterator<U> when running on an RDD of type T.|类似于mapPartitions，但也为func提供了一个表示分区索引的整数值，因此func 方法必须是(Int, Iterator<T>) => Iterator<U> when running on an RDD of type T [参照博客](https://blog.csdn.net/u012684933/article/details/46894951)|
|<a href="#sample">sample(withReplacement, fraction, seed)</a><a name="sample_back">:</a>|Sample a fraction fraction of the data, with or without replacement, using a given random number generator seed.|取数据的部分样本，不确定的进行更换，使用随机生成器种子，withReplacement ：Boolean 类型，决定是否可以多次取样；fraction 在没有替换的情况下，样本的期望尺寸是这个RDD大小的一部分:每个元素被选择的概率;分数必须为[0,1]替换:所选元素的期望次数;分数必须大于等于0。seed for the random number generator，seed便是生成器种子了。需要注意：这并不能保证提供给定RDD的精确分数。 |
|<a href="#union">union(otherDataset)</a><a name="union_back">:</a>|Return a new dataset that contains the union of the elements in the source dataset and the argument.|两个元素的和集，没有去重功能|
|intersection(otherDataset)|Return a new RDD that contains the intersection of elements in the source dataset and the argument.|返回一个新的RDD，它包含源数据集中元素和参数的交集。就是取交集，比如a :(123),b：（345），a.intersection(b) = （3），这里不做过多解释（此操作会产生shuffle）|
|distinct([numTasks]))|Return a new dataset that contains the distinct elements of the source dataset.|返回包含源数据集的不同元素的新数据集。就是去重这里也不做过多描述|
|<a href="#groupByKey">groupByKey([numTasks])</a><a name="groupByKey_back">:</a>|When called on a dataset of (K, V) pairs, returns a dataset of (K, Iterable<V>) pairs. Note: If you are grouping in order to perform an aggregation (such as a sum or average) over each key, using reduceByKey or aggregateByKey will yield much better performance. Note: By default, the level of parallelism in the output depends on the number of partitions of the parent RDD. You can pass an optional numTasks argument to set a different number of tasks.|当调用(K, V)对的数据集时，返回一个数据集(K, Iterable<V>)对。注意:如果要对每个键执行聚合(比如求和或平均值)，使用reduceByKey或aggregateByKey会获得更好的性能。注意:默认情况下，输出的并行度取决于父RDD分区的数量。您可以通过一个可选的numTasks参数来设置不同数量的任务。|
|<a href="#reduceByKey">reduceByKey(func, [numTasks]) </a><a name="reduceByKey_back">:</a>  |When called on a dataset of (K, V) pairs, returns a dataset of (K, V) pairs where the values for each key are aggregated using the given reduce function func, which must be of type (V,V) => V. Like in groupByKey, the number of reduce tasks is configurable through an optional second argument.|当呼吁(K、V)的数据集对,返回一个数据集(K、V)对每个键的值在哪里聚合使用给定减少函数func,必须(V,V)= > V型像groupByKey,reduce task 的数量通过一个可选的第二个参数配置，func中可以进行自定义函数操作，注意与groupby不一样的是，reducebykey会现在本地端进行聚合，进行小型的combiner ，从而减少集群shuffle 的io，提高性能|
| <a href="#combineByKey">combineByKey(createCombiner, mergeValue, mergeCombiners, partitioner)</a><a name="combineByKey_back">:</a>|也是聚合的一种，具体点击查看代码案例，参考博客[博主](https://blog.csdn.net/liangyihuai/article/details/54377226)|附加|
| <a href="#aggregate">aggregate[U: ClassTag](zeroValue: U)(seqOp: (U, T) => U, combOp: (U, U) => U): U </a><a name="aggregate_back">:</a>|附加|附加：聚合|
| <a href="#aggregateByKey">aggregateByKey(zeroValue)(seqOp, combOp, [numTasks])</a><a name="aggregateByKey_back">:</a> |When called on a dataset of (K, V) pairs, returns a dataset of (K, U) pairs where the values for each key are aggregated using the given combine functions and a neutral "zero" value. Allows an aggregated value type that is different than the input value type, while avoiding unnecessary allocations. Like in groupByKey, the number of reduce tasks is configurable through an optional second argument.|集合每个键的值，使用给定的组合函数和一个中性的“零值”。这个函数可以返回一个不同的结果类型，U，而不是这个RDD中值的类型。因此，我们需要一个操作来合并一个V到一个U，以及一个合并两个U的操作，就像在scala.TraversableOnce中一样。前一个操作用于合并分区中的值，后者用于合并分区之间的值。为了避免内存分配，这两个函数都可以修改和返回第一个参数，而不是创建一个新的U。 |
| <a href="#sortBy">sortBy </a><a name="sortBy_back">:</a> |附加|附加，对元素进行排序，具体案例点击链接查看|
| <a href="#sortByKey">sortByKey([ascending], [numTasks]) </a><a name="sortByKey_back">:</a> |When called on a dataset of (K, V) pairs where K implements Ordered, returns a dataset of (K, V) pairs sorted by keys in ascending or descending order, as specified in the boolean ascending argument.|当调用(K, V)的数据集时，K实现了排序，返回一个(K, V)的数据集，按照布尔提升参数中指定的升序或降序排序。|
|<a href="#join">join(otherDataset, [numTasks]) </a><a name="join_back">:</a>  |When called on datasets of type (K, V) and (K, W), returns a dataset of (K, (V, W)) pairs with all pairs of elements for each key. Outer joins are supported through leftOuterJoin, rightOuterJoin, and fullOuterJoin.|当调用类型(K, V)和(K, W)的数据集时，返回一个(K， (V, W))对每个键的所有对元素的数据集。外部连接通过leftOuterJoin、右端连接和fullOuterJoin来支持。 join 是结果中两个数据源种都包含的key，leftOuterJoin 显示完全第一个数据集中的key以及对应的数据，rightOuterJoin 则相反|
|  <a href="#cogroup">cogroup(otherDataset, [numTasks])  </a><a name="cogroup_back">:</a> |When called on datasets of type (K, V) and (K, W), returns a dataset of (K, (Iterable<V>, Iterable<W>)) tuples. This operation is also called groupWith.|当调用type (K, V)和(K, W)的数据集时，返回一个(K， (Iterable, Iterable)元组的数据集。这个操作也称为groupWith。|
|<a href="#cartesian">cartesian(otherDataset) </a><a name="cartesian_back">:</a> |When called on datasets of types T and U, returns a dataset of (T, U) pairs (all pairs of elements).|当调用类型T和U的数据集时，返回(T, U)对的数据集(所有对元素)|
| <a href="#pipe">pipe(command, [envVars])</a><a name="pipe_back">:</a>  |Pipe each partition of the RDD through a shell command, e.g. a Perl or bash script. RDD elements are written to the process's stdin and lines output to its stdout are returned as an RDD of strings.|通过shell命令(例如:Perl或bash脚本)将RDD的每个分区连接起来。RDD元素被写入到进程的stdin中，输出到它的stdout的行被作为字符串的RDD返回。|
|<a href="#coalesce">coalesce(numPartitions)</a><a name="coalesce_back">:</a>   |Decrease the number of partitions in the RDD to numPartitions. Useful for running operations more efficiently after filtering down a large dataset.|将RDD中的分区数量减少到numPartitions指定的分区数量。在过滤大数据集之后更有效地运行操作|
|repartition(numPartitions)|Reshuffle the data in the RDD randomly to create either more or fewer partitions and balance it across them. This always shuffles all data over the network.|在RDD中随机地重新调整数据，以创建更多或更少的分区，并在它们之间进行平衡。这总是会打乱网络上的所有数据。这里不做事例|
| <a href="#repartitionAndSortWithinPartitions">repartitionAndSortWithinPartitions(partitioner)</a><a name="repartitionAndSortWithinPartitions_back">:</a> |Repartition the RDD according to the given partitioner and, within each resulting partition, sort records by their keys. This is more efficient than calling repartition and then sorting within each partition because it can push the sorting down into the shuffle machinery.|根据给定的分区器重新划分RDD，并在每个结果分区中按其键对记录进行排序。这比调用repartition并在每个分区中进行排序更有效，因为它可以将排序分解到shuffle机器中。|

### 具体案例
#### <a name="map" >1-map</a> [<a href="#map_back">返回表格</a>]

> 1-简单实用

```Scala
val a = sc.parallelize(List("dog", "salmon", "salmon", "rat", "elephant"), 3)
val b = a.map(_.length)
val c = a.zip(b)
c.collect
res0: Array[(String, Int)] = Array((dog,3), (salmon,6), (salmon,6), (rat,3), (elephant,8))
```
>2- 获取u路中全部文件

```Java
JavaRDD<String> li = SparkInitMgr.jssc.sparkContext().wholeTextFiles(outputPath + "road/roadSports_*", 25).map(new Function<Tuple2<String, String>, String>() {
            private static final long serialVersionUID = 1L;

            @Override
            public String call(Tuple2<String, String> v1) throws Exception {
                // TODO Auto-generated method stub
                return v1._2;
            }
        });
	    JavaRDD<String> lines = li.flatMap(new FlatMapFunction<String, String>() {
            private static final long serialVersionUID = 1L;
            @Override
            public Iterable<String> call(String t) throws Exception {
                String[] line = t.split("\\n");
                return Arrays.asList(line);
            }
        }).persist(StorageLevel.MEMORY_ONLY_SER());
```

* 相近案例  mapValues
如下图所示： 针对(k,v)类型的仅仅对 v进行操作
![mapValues](assets/001/20180423-ad8c3c97.png)  


#### <a name="flatMap" >2-flatMap</a> [<a href="#flatMap_back">返回表格</a>]
```Scala
val a = sc.parallelize(1 to 10, 5)
a.flatMap(1 to _).collect
res47: Array[Int] = Array(1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 5, 1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6, 7, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

sc.parallelize(List(1, 2, 3), 2).flatMap(x => List(x, x, x)).collect
res85: Array[Int] = Array(1, 1, 1, 2, 2, 2, 3, 3, 3)

```
##### 类似算子 glom
* 形成数组

```Scala
val a = sc.parallelize(1 to 100, 3)
a.glom.collect
res8: Array[Array[Int]] = Array(Array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33), Array(34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66), Array(67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100))
```

#### <a name="mapPartitions" >3-mapPartitions</a> [<a href="#mapPartitions_back">返回表格</a>]
```Scala
def myfuncPerElement(e:Int):Int = {
          println("e="+e)
          e*2
     }
    //mapPartitions的输入函数。iter是分区中元素的迭代子，返回类型也要是迭代子
   def myfuncPerPartition ( iter : Iterator [Int] ) : Iterator [Int] = {
        println("run in partition")
        var res = for (e <- iter ) yield e*2
         res
   }
   val b = a.map(myfuncPerElement).collect
   val c =  a.mapPartitions(myfuncPerPartition).collect

```

#### <a name="mapPartitionsWithIndex" >4-mapPartitionsWithIndex</a> [<a href="#mapPartitionsWithIndex_back">返回表格</a>]

* 附加参考博客
[分区如何运行每个分区执行](https://blog.csdn.net/xingzhiqing/article/details/56304155)  
[]()

```Scala
package com.oreilly.learningsparkexamples.scala  

import org.apache.spark._  

import org.eclipse.jetty.client.ContentExchange  
import org.eclipse.jetty.client.HttpClient  

object BasicMapPartitions {  
    def main(args: Array[String]) {  
      val master = args.length match {  
        case x: Int if x > 0 => args(0)  
        case _ => "local"  
      }  
      val sc = new SparkContext(master, "BasicMapPartitions", System.getenv("SPARK_HOME"))  
      val input = sc.parallelize(List("KK6JKQ", "Ve3UoW", "kk6jlk", "W6BB"))  
      val result = input.mapPartitions{  
        signs =>  
        val client = new HttpClient()  
        client.start()  
        signs.map {sign =>  
          val exchange = new ContentExchange(true);  
          exchange.setURL(s"http://qrzcq.com/call/${sign}")  
          client.send(exchange)  
          exchange  
        }.map{ exchange =>  
          exchange.waitForDone();  
          exchange.getResponseContent()  
        }  
      }  
      println(result.collect().mkString(","))  
    }  
}  

```
>下面的代码：mapPartitions的参数signs是input这个rdd的一个分区的所有element组成的Iterator
mapPartitions结果是一个分区的所有element被分区处理函数加工后的element组成的Iterator.
mapPartitions函数会对每个分区调用分区函数处理，然后将处理的结果(若干个Iterator)生成新的RDDs

就如下面的代码

```Scala
package com.oreilly.learningsparkexamples.scala  

import org.apache.spark._  

object BasicAvgMapPartitions {  
  case class AvgCount(var total: Int = 0, var num: Int = 0) {  
    def merge(other: AvgCount): AvgCount = {  
      total += other.total  
      num += other.num  
      this  
    }  
    def merge(input: Iterator[Int]): AvgCount = {  
      input.foreach{elem =>  
        total += elem  
        num += 1  
      }  
      this  
    }  
    def avg(): Float = {  
      total / num.toFloat;  
    }  
  }  

  def main(args: Array[String]) {  
    val master = args.length match {  
      case x: Int if x > 0 => args(0)  
      case _ => "local"  
    }  
    val sc = new SparkContext(master, "BasicAvgMapPartitions", System.getenv("SPARK_HOME"))  
    val input = sc.parallelize(List(1, 2, 3, 4))  
    val result = input.mapPartitions(partition =>  
      // Here we only want to return a single element for each partition, but mapPartitions requires that we wrap our return in an Iterator  
      Iterator(AvgCount(0, 0).merge(partition)))  
      .reduce((x,y) => x.merge(y))  
    println(result)  
  }  
}  

```
    上面的测试代码，首先对一个RDDs的分区所有元素组成的Iterator进行了合并操作，生成了一个元素，然后调用Iterator()生成一个新的Iterator，然后作为结果返回(虽然返回的Iterator中只有一个元素)

    mapPartitionsWithIndex与mapPartition基本相同，只是在处理函数的参数是一个二元元组，元组的第一个元素是当前处理的分区的index，元组的第二个元素是当前处理的分区元素组成的Iterator

#### <a name="sample" >5-sample(withReplacement, fraction, seed)</a> [<a href="#sample_back">返回表格</a>]
* 案例1
```Scala
val a = sc.parallelize(1 to 10000, 3)
a.sample(false, 0.1, 0).count
res24: Long = 960
```

* 案例2
是对RDD集合中进行采样的结果是：获取RDD的子集。
fraction =0.5 保留分片的50%也就是一半
如图：

![sample随机提取](assets/001/20180423-9fb36388.png)  




#### <a name="union" >6-union(otherDataset)</a> [<a href="#union_back">返回表格</a>]  ***注意：并不会去除重复元素***
* 对两个数据进行求和集

```Scala
val a = sc.parallelize(1 to 5, 1)
val b = sc.parallelize(5 to 7, 1)
(a ++ b).collect
就等同于
a.union(b)
res0: Array[Int] = Array(1, 2, 3, 5,5, 6, 7)
```

##### 相反算子 subtract ,就是uniton 然后filter，然后删除 两个数据集中都存在的数据，***也就是两个rdd的交集***

![进行subtract](assets/001/20180423-5719c590.png)  

计算差的一种函数
去除两个RDD中相同的元素，不同的RDD将保留下来

##### 类似算子
* 笛卡尔积

```Scala
val x = sc.parallelize(List(1,2,3,4,5))
val y = sc.parallelize(List(6,7,8,9,10))
x.cartesian(y).collect
res0: Array[(Int, Int)] = Array((1,6), (1,7), (1,8), (1,9), (1,10), (2,6), (2,7), (2,8), (2,9), (2,10), (3,6), (3,7), (3,8), (3,9), (3,10), (4,6), (5,6), (4,7), (5,7), (4,8), (5,8), (4,9), (4,10), (5,9), (5,10))

```

#### <a name="groupByKey" >8-groupByKey([numTasks])</a> [<a href="#groupByKey_back">返回表格</a>]

```Scala
val scoreDetail = sc.parallelize(List(("xiaoming",75),("xiaoming",90),("lihua",95),("lihua",100),("xiaofeng",85)))
scoreDetail.groupByKey().collect().foreach(println(_));
/*输出
(lihua,CompactBuffer(95, 100))
(xiaoming,CompactBuffer(75, 90))
(xiaofeng,CompactBuffer(85))
*/
```
#### <a name="reduceByKey" >9-reduceByKey(func, [numTasks])</a> [<a href="#reduceByKey_back">返回表格</a>]

```Scala
scala> val x = sc.parallelize(Array(("a", 1), ("b", 1), ("a", 1),
     | ("a", 1), ("b", 1), ("b", 1),
     | ("b", 1), ("b", 1)), 3)

val y = x.reduceByKey((pre, after) => (pre + after))

scala> y.collect
res0: Array[(String, Int)] = Array((a,3), (b,5))

scala> val x = sc.parallelize(Array(("a", 1), ("b", 1), ("a", 1),
     | ("a", 1), ("b", 1), ("b", 1),
     | ("b", 1), ("b", 2)), 3)
val y = x.reduceByKey((pre, after) => (pre + after))
scala> y.collect
res0: Array[(String, Int)] = Array((a,3), (b,6))

其实是相同key 的value 值进行相加，除了相加还可以* / 等运算，如果是字符串还可以相加
```
#### <a name="combineByKey" >10-combineByKey(createCombiner, mergeValue, mergeCombiners, partitioner)</a> [<a href="#combineByKey_back">返回表格</a>]
---   

源码定义：
```Scala
def combineByKey[C](
      createCombiner: V => C,
      mergeValue: (C, V) => C,
      mergeCombiners: (C, C) => C,
      partitioner: Partitioner,
      mapSideCombine: Boolean = true,
      serializer: Serializer = null): RDD[(K, C)] = self.withScope {}



```
官网给的解释，能看出combineByKey返回的类型c 就是 createCombiner 的时候创建的类型
    Generic function to combine the elements for each key using a custom set of aggregation
     * functions. Turns an RDD[(K, V)] into a result of type RDD[(K, C)], for a "combined type" C
     *
     * Users provide three functions:
     *
     *  - `createCombiner`, which turns a V into a C (e.g., creates a one-element list)
     *  - `mergeValue`, to merge a V into a C (e.g., adds it to the end of a list)
     *  - `mergeCombiners`, to combine two C's into a single one.
     *
     * In addition, users can control the partitioning of the output RDD, and whether to perform
     * map-side aggregation (if a mapper can produce multiple items with the same key).

```
combineByKey的作用是：Combine values with the same key using a different result type.

createCombiner函数是通过value构造并返回一个新的类型为C的值，这个类型也是combineByKey函数返回值中value的类型（key的类型不变）。

mergeValue函数是把具有相同的key的value合并到C中。这时候C相当于一个累计器。（同一个partition内）

mergeCombiners函数把两个C合并成一个C。（partitions之间）
```

下面是一个例子：
```Scala
scala>  val textRDD = sc.parallelize(List(("A", "aa"), ("B","bb"),("C","cc"),("C","cc"), ("D","dd"), ("D","dd")))
textRDD: org.apache.spark.rdd.RDD[(String, String)] = ParallelCollectionRDD[0] at parallelize at <console>:24

scala>     val combinedRDD = textRDD.combineByKey(
     |       value => (1, value),
     |       (c:(Int, String), value) => (c._1+1, c._2),
     |       (c1:(Int, String), c2:(Int, String)) => (c1._1+c2._1, c1._2)
     |     )
combinedRDD: org.apache.spark.rdd.RDD[(String, (Int, String))] = ShuffledRDD[1] at combineByKey at <console>:26

scala>

scala>     combinedRDD.collect.foreach(x=>{
     |       println(x._1+","+x._2._1+","+x._2._2)
     |     })

D,2,dd
A,1,aa
B,1,bb
C,2,cc
```

下面第二格例子

```Scala
scala>  val textRDD = sc.parallelize(List(("A", "aa"), ("B","bb"),("C","cc"),("C","cc"), ("D","dd"), ("D","dd")))
textRDD: org.apache.spark.rdd.RDD[(String, String)] = ParallelCollectionRDD[0] at parallelize at <console>:24

scala> val combinedRDD2 = textRDD.combineByKey(
     |       value => 1,
     |       (c:Int, String) => (c+1),
     |       (c1:Int, c2:Int) => (c1+c2)
     |     )
combinedRDD2: org.apache.spark.rdd.RDD[(String, Int)] = ShuffledRDD[2] at combineByKey at <console>:26

scala> combinedRDD2.collect.foreach(x=>{
     |       println(x._1+","+x._2)
     |     })
D,2
A,1
B,1
C,2

scala>
```
解释：
    上面两个函数的作用是相同的，返回类型不一样，目的是统计key的个数。第一个的类型是（String，（Int，String）），第二个的类型是（String，Int）。
---

#### <a name="aggregate" >11-aggregate[U: ClassTag](zeroValue: U)(seqOp: (U, T) => U, combOp: (U, U) => U): U </a> [<a href="#aggregate_back">返回表格</a>]

源码解释：
```Scala
/**
   * Aggregate the elements of each partition, and then the results for all the partitions, using
   * given combine functions and a neutral "zero value". This function can return a different result
   * type, U, than the type of this RDD, T. Thus, we need one operation for merging a T into an U
   * and one operation for merging two U's, as in scala.TraversableOnce. Both of these functions are
   * allowed to modify and return their first argument instead of creating a new U to avoid memory
   * allocation.
   *
   * @param zeroValue the initial value for the accumulated result of each partition for the
   *                  `seqOp` operator, and also the initial value for the combine results from
   *                  different partitions for the `combOp` operator - this will typically be the
   *                  neutral element (e.g. `Nil` for list concatenation or `0` for summation)
   * @param seqOp an operator used to accumulate results within a partition
   * @param combOp an associative operator used to combine results from different partitions
   */
  def aggregate[U: ClassTag](zeroValue: U)(seqOp: (U, T) => U, combOp: (U, U) => U): U = withScope {
    // Clone the zero value since we will also be serializing it as part of tasks
    var jobResult = Utils.clone(zeroValue, sc.env.serializer.newInstance())
    val cleanSeqOp = sc.clean(seqOp)
    val cleanCombOp = sc.clean(combOp)
    val aggregatePartition = (it: Iterator[T]) => it.aggregate(zeroValue)(cleanSeqOp, cleanCombOp)
    val mergeResult = (index: Int, taskResult: U) => jobResult = combOp(jobResult, taskResult)
    sc.runJob(this, aggregatePartition, mergeResult)
    jobResult
  }
```
案例一：
在spark shell中，输入下面代码。注意，本例子的初始值是一个元组，该类型也是aggregate函数的输出类型。这个函数的作用是统计字母的个数，同时拼接所有的字母。
```Scala
scala> val textRDD = sc.parallelize(List("A", "B", "C", "D", "D", "E"))
textRDD: org.apache.spark.rdd.RDD[String] = ParallelCollectionRDD[3] at parallelize at <console>:24

scala> val resultRDD = textRDD.aggregate((0, ""))((acc, value)=>{(acc._1+1, acc._2+":"+value)}, (acc1, acc2)=> {(acc1._1+acc2._1, acc1._2+":"+acc2._2)})
resultRDD: (Int, String) = (6,::D:E::D::A::B:C)


val textRDD=sc.parallelize(List("A","B","C"))
scala> val resultRDD=textRDD.aggregate((0,""))((acc,value)=>{(acc._1+1,acc._2+":"+value)},(acc1,acc2)=>{(acc1._1+acc2._1,acc1._2+":"+acc2._2)})
resultRDD: (Int, String) = (3,:::B::::::A::C)
```
第二个案例：  
初始值为20000，Int类型，所以该函数的输出类型也为Int，该函数的作用是在20000基础上叠加所有字母的ascall码的值

```Scala
scala> val textRDD = sc.parallelize(List('A', 'B', 'C', 'D', 'D', 'E'))
textRDD: org.apache.spark.rdd.RDD[Char] = ParallelCollectionRDD[4] at parallelize at <console>:24

scala> val resultRDD2 = textRDD.aggregate[Int](20000)((acc, cha) => {acc+cha}, (acc1, acc2)=>{acc1+acc2})
resultRDD2: Int = 100403

```

#### <a name="aggregateByKey" >12-aggregateByKey(zeroValue)(seqOp, combOp, [numTasks])</a> [<a href="#aggregateByKey_back">返回表格</a>]
[官网aggregateByKey相关api地址](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.PairRDDFunctions)
>aggregateByKey函数对PairRDD中相同Key的值进行聚合操作，在聚合过程中同样使用了一个中立的初始值。和aggregate函数类似，aggregateByKey返回值得类型不需要和RDD中value的类型一致。因为aggregateByKey是对相同Key中的值进行聚合操作，所以aggregateByKey函数最终返回的类型还是Pair RDD，对应的结果是Key和聚合好的值；而aggregate函数直接返回非RDD的结果。

```Scala
参数：

    zeroValue：表示在每个分区中第一次拿到key值时,用于创建一个返回类型的函数,这个函数最终会被包装成先生成一个返回类型,然后通过调用seqOp函数,把第一个key对应的value添加到这个类型U的变量中。
    seqOp：这个用于把迭代分区中key对应的值添加到zeroValue创建的U类型实例中。
    combOp：这个用于合并每个分区中聚合过来的两个U类型的值。

```

案例：
```Scala
def aggregateByKey(sc: SparkContext): Unit = {

    // 合并在同一个partition中的值，a的数据类型为zeroValue的数据类型，b的数据类型为原value的数据类型
    def seq(a:Int, b:Int): Int = {
        println("seq: " + a + "\t" + b)
        math.max(a, b)
    }

    // 合并在不同partition中的值，a,b的数据类型为zeroValue的数据类型
    def comb(a:Int, b:Int): Int = {
        println("comb: " + a + "\t" + b)
        a + b
    }

    // 数据拆分成两个分区
    // 分区一数据: (1,3) (1,2)
    // 分区二数据: (1,4) (2,3)
    // zeroValue 中立值，定义返回value的类型，并参与运算
    // seqOp 用来在一个partition中合并值的
    // 分区一相同key的数据进行合并
    // seq: 0   3  (1,3)开始和中位值合并为3
    // seq: 3   2  (1,2)再次合并为3
    // 分区二相同key的数据进行合并
    // seq: 0   4  (1,4)开始和中位值合并为4
    // seq: 0   3  (2,3)开始和中位值合并为3
    // comb 用来在不同partition中合并值的
    // 将两个分区的结果进行合并
    // key为1的, 两个分区都有, 合并为(1,7)
    // key为2的, 只有一个分区有, 不需要合并(2,3)
    sc.parallelize(List((1, 3), (1, 2), (1, 4), (2, 3)), 2)
        .aggregateByKey(0)(seq, comb)
        .collect()
        .foreach(println)
}

// 结果
(2,3)
(1,7)
```
#### <a name="sortBy" >13-sortBy</a> [<a href="#sortBy_back">返回表格</a>]
* 过往记忆
[原文链接](https://www.iteblog.com/archives/1240.html)
源码如下，org.apache.spark.rdd.RDD 中实现的sortbykey
```Scala
/**
 * Return this RDD sorted by the given key function.
 */
def sortBy[K](
    f: (T) => K,
    ascending: Boolean = true,
    numPartitions: Int = this.partitions.size)
    (implicit ord: Ordering[K], ctag: ClassTag[K]): RDD[T] =
  this.keyBy[K](f)
      .sortByKey(ascending, numPartitions)
      .values
```
参数说明：

```
该函数最多可以传三个参数：
　　第一个参数是一个函数，该函数的也有一个带T泛型的参数，返回类型和RDD中元素的类型是一致的；
　　第二个参数是ascending，从字面的意思大家应该可以猜到，是的，这参数决定排序后RDD中的元素是升序还是降序，默认是true，也就是升序；
　　第三个参数是numPartitions，该参数决定排序后的RDD的分区个数，默认排序后的分区个数和排序之前的个数相等，即为this.partitions.size。
```
从sortBy函数的实现可以看出，第一个参数是必须传入的，而后面的两个参数可以不传入。而且sortBy函数函数的实现依赖于sortByKey函数，关于sortByKey函数后面会进行说明。keyBy函数也是RDD类中进行实现的，它的主要作用就是将将传进来的每个元素作用于f(x)中，并返回tuples类型的元素，也就变成了Key-Value类型的RDD了，它的实现如下：
案例如下：
```Scala
scala> val data = List(3,1,90,3,5,12)
data: List[Int] = List(3, 1, 90, 3, 5, 12)

scala> val rdd = sc.parallelize(data)
rdd: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[0] at parallelize at <console>:14

scala> rdd.collect
res0: Array[Int] = Array(3, 1, 90, 3, 5, 12)

scala> rdd.sortBy(x => x).collect
res1: Array[Int] = Array(1, 3, 3, 5, 12, 90)

scala> rdd.sortBy(x => x, false).collect
res3: Array[Int] = Array(90, 12, 5, 3, 3, 1)

scala> val result = rdd.sortBy(x => x, false)
result: org.apache.spark.rdd.RDD[Int] = MappedRDD[23] at sortBy at <console>:16

scala> result.partitions.size
res9: Int = 2

scala> val result = rdd.sortBy(x => x, false, 1)
result: org.apache.spark.rdd.RDD[Int] = MappedRDD[26] at sortBy at <console>:16

scala> result.partitions.size
res10: Int = 1
```

---

  上面是sortby的实现,下面是sortByKey

#### <a name="sortByKey" >13-sortByKey([ascending], [numTasks])</a> [<a href="#sortByKey_back">返回表格</a>]

  sortByKey函数作用于Key-Value形式的RDD，并对Key进行排序。  
  它是在org.apache.spark.rdd.OrderedRDDFunctions中实现的，实现如下
```Scala
  def sortByKey(ascending: Boolean = true, numPartitions: Int = self.partitions.size)
    : RDD[(K, V)] =
  {
  val part = new RangePartitioner(numPartitions, self, ascending)
  new ShuffledRDD[K, V, V](self, part)
    .setKeyOrdering(if (ascending) ordering else ordering.reverse)
  }
```
该函数返回的RDD一定是ShuffledRDD类型的，因为对源RDD进行排序，必须进行Shuffle操作，而Shuffle操作的结果RDD就是ShuffledRDD。其实这个函数的实现很优雅，里面用到了RangePartitioner，它可以使得相应的范围Key数据分到同一个partition中，然后内部用到了mapPartitions对每个partition中的数据进行排序，而每个partition中数据的排序用到了标准的sort机制，避免了大量数据的shuffle。下面对sortByKey的使用进行说明：

* 使用示例

```Scala
scala> val a = sc.parallelize(List("wyp", "iteblog", "com", "397090770", "test"), 2)
a: org.apache.spark.rdd.RDD[String] =
ParallelCollectionRDD[30] at parallelize at <console>:12

scala> val b = sc. parallelize (1 to a.count.toInt , 2)
b: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[31] at parallelize at <console>:14

scala> val c = a.zip(b)
c: org.apache.spark.rdd.RDD[(String, Int)] = ZippedPartitionsRDD2[32] at zip at <console>:16

scala> c.sortByKey().collect
res11: Array[(String, Int)] = Array((397090770,4), (com,3), (iteblog,2), (test,5), (wyp,1))
```


  如上对key进行排序，sortBy第一个参数可以自定义排序方式，这个也有，不必一定要使用默认排序规则(默认数字在前，字母按照abc的顺序)。其实在OrderedRDDFunctions类中有个变量ordering它是隐形的：private val ordering = implicitly[Ordering[K]]。他就是默认的排序规则，我们可以对它进行重写，如下：

```Scala
scala> val b = sc.parallelize(List(3,1,9,12,4))
b: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[38] at parallelize at <console>:12

scala> val c = b.zip(a)
c: org.apache.spark.rdd.RDD[(Int, String)] = ZippedPartitionsRDD2[39] at zip at <console>:16

scala> c.sortByKey().collect
res15: Array[(Int, String)] = Array((1,iteblog), (3,wyp), (4,test), (9,com), (12,397090770))

scala> implicit val sortIntegersByString = new Ordering[Int]{
     | override def compare(a: Int, b: Int) =
     | a.toString.compare(b.toString)}
sortIntegersByString: Ordering[Int] = $iwC$$iwC$$iwC$$iwC$$iwC$$anon$1@5d533f7a

scala>  c.sortByKey().collect
res17: Array[(Int, String)] = Array((1,iteblog), (12,397090770), (3,wyp), (4,test), (9,com))

```
  例子中的sortIntegersByString就是修改了默认的排序规则。这样将默认按照Int大小排序改成了对字符串的排序，所以12会排序在3之前。


---

* 二次排序案例
[原文链接](https://blog.csdn.net/dwb1015/article/details/52207945)

```

实现：
package com.spark.App

/**
  * Created by Administrator on 2016/8/14 0014.
  */
class SecondarySortKey(val first: Int, val second: Int) extends Ordered[SecondarySortKey] with Serializable {
  override def compare(other: SecondarySortKey): Int = {
    if (this.first > other.first || (this.first == other.first && this.second > other.second)) {
      return 1;
    }
    else if (this.first < other.first || (this.first == other.first && this.second < other.second)) {
      return -1;
    }
    return 0;
  }
}


调用：
package com.spark.App

import org.apache.spark.{SparkContext, SparkConf}

/**
  * Created by Administrator on 2016/8/14 0014.
  */
object SecondarySortApp {
  def main(args: Array[String]) {
    val conf = new SparkConf().setAppName("SecondarySortApp").setMaster("local")
    val sc = new SparkContext(conf)

     val lines = sc.textFile("src/main/MyData/TxtData/SecondSortBy/SecondSortByKey.txt")

    val pairRDD = lines.map(line => {
      val splited = line.split(" ")
      val key = new SecondarySortKey(splited(0).toInt, splited(1).toInt)
      (key, line)
    })

    val sorted = pairRDD.sortByKey(false)
    val result = sorted.map(item => item._2)
    result.collect().foreach(println)
  }
}

实验数据:
SecondSortByKey.Txt
1 2
1 3
1 4
2 1
2 2
2 3
2 4

测试结果：
2 4
2 3
2 2
2 1
1 4
1 3
1 2

```
#### <a name="join" >13-join(otherDataset, [numTasks])</a> [<a href="#joiny_back">返回表格</a>]
[原博主地址](https://blog.csdn.net/pmp4561705/article/details/53212196)
[reduceByKey实现join博客地址](https://blog.csdn.net/bluejoe2000/article/details/47306439)
spark中join的操作，类似于sql中的join ，源码如下

```
/**  
 * Return an RDD containing all pairs of elements with matching keys in `this` and `other`. Each  
 * pair of elements will be returned as a (k, (v1, v2)) tuple, where (k, v1) is in `this` and  
 * (k, v2) is in `other`. Uses the given Partitioner to partition the output RDD.  
 */  
def join[W](other: RDD[(K, W)], partitioner: Partitioner): RDD[(K, (V, W))] = self.withScope {  
  this.cogroup(other, partitioner).flatMapValues( pair =>  
    for (v <- pair._1.iterator; w <- pair._2.iterator) yield (v, w)  
  )  
}  

```
* leftOuterJoin
其中join 又有leftjoin 与rightjoin
leftjoin 源码

```
/**  
   * Perform a left outer join of `this` and `other`. For each element (k, v) in `this`, the  
   * resulting RDD will either contain all pairs (k, (v, Some(w))) for w in `other`, or the  
   * pair (k, (v, None)) if no elements in `other` have key k. Uses the given Partitioner to  
   * partition the output RDD.  
   */  
  def leftOuterJoin[W](  
      other: RDD[(K, W)],  
      partitioner: Partitioner): RDD[(K, (V, Option[W]))] = self.withScope {  
    this.cogroup(other, partitioner).flatMapValues { pair =>  
      if (pair._2.isEmpty) {  
        pair._1.iterator.map(v => (v, None))  
      } else {  
        for (v <- pair._1.iterator; w <- pair._2.iterator) yield (v, Some(w))  
      }  
    }  
  }  

```
* rightOuterJoin
源码如下

```
/**  
   * Perform a right outer join of `this` and `other`. For each element (k, w) in `other`, the  
   * resulting RDD will either contain all pairs (k, (Some(v), w)) for v in `this`, or the  
   * pair (k, (None, w)) if no elements in `this` have key k. Uses the given Partitioner to  
   * partition the output RDD.  
   */  
  def rightOuterJoin[W](other: RDD[(K, W)], partitioner: Partitioner)  
      : RDD[(K, (Option[V], W))] = self.withScope {  
    this.cogroup(other, partitioner).flatMapValues { pair =>  
      if (pair._1.isEmpty) {  
        pair._2.iterator.map(w => (None, w))  
      } else {  
        for (v <- pair._1.iterator; w <- pair._2.iterator) yield (Some(v), w)  
      }  
    }  
  }  
```

join/leftOuterJoin/rightOuterJoin案例代码

```
//设置运行环境  
val conf = new SparkConf().setAppName("SparkRDDJoinOps").setMaster("local[4]")  
val sc = new SparkContext(conf)  
//建立一个基本的键值对RDD，包含ID和名称，其中ID为1、2、3、4  
val rdd1 = sc.makeRDD(Array(("1","Spark"),("2","Hadoop"),("3","Scala"),("4","Java")),2)  
//建立一个行业薪水的键值对RDD，包含ID和薪水，其中ID为1、2、3、5  
val rdd2 = sc.makeRDD(Array(("1","30K"),("2","15K"),("3","25K"),("5","10K")),2)  

println("//下面做Join操作，预期要得到（1,×）、（2,×）、（3,×）")  
val joinRDD=rdd1.join(rdd2).collect.foreach(println)  

println("//下面做leftOutJoin操作，预期要得到（1,×）、（2,×）、（3,×）、(4,×）")  
val leftJoinRDD=rdd1.leftOuterJoin(rdd2).collect.foreach(println)  
println("//下面做rightOutJoin操作，预期要得到（1,×）、（2,×）、（3,×）、(5,×）")  
val rightJoinRDD=rdd1.rightOuterJoin(rdd2).collect.foreach(println)  

sc.stop()  
```
结果

```Scala
<span style="font-size:18px;">//下面做Join操作，预期要得到（1,×）、（2,×）、（3,×）  
(2,(Hadoop,15K))  
(3,(Scala,25K))  
(1,(Spark,30K))  
//下面做leftOutJoin操作，预期要得到（1,×）、（2,×）、（3,×）、(4,×）  
(4,(Java,None))  
(2,(Hadoop,Some(15K)))  
(3,(Scala,Some(25K)))  
(1,(Spark,Some(30K)))  
//下面做rightOutJoin操作，预期要得到（1,×）、（2,×）、（3,×）、(5,×）  
(2,(Some(Hadoop),15K))  
(5,(None,10K))  
(3,(Some(Scala),25K))  
(1,(Some(Spark),30K))</span>  
```

* 优化[原博主](https://www.cnblogs.com/goforward/p/4748128.html)

```Scala
大表与大表之间的join(Reduce-join)

大表之间的join无法通过缓存数据来达到优化目的,因此需要把优化的重点放在分区效率及key的设计上

1、join的key值尽量使用数值类型,减少分区及shuffle的操作时间,在join时数值类型的key值在匹配时更快

2、将过滤条件放在join之前,使得join的数据量尽量最少

3、在join之前将两个表按相同分区数进行重新分区

reduce-join:指将两个表按key值进行分区,相同key的数据会被分在同一个分区,最后使用mapPartition进行join操作。

 4、如果需要减少分区和并行度,请使用coalesce 而非repartition 方法。

* If you are decreasing the number of partitions in this RDD, consider using `coalesce`,
* which can avoid performing a shuffle.

三、其它优化方式

1、同一份数据被多次用到,在读入时进行缓存,后面直接使用,例如配置表,如果数据量不大则进行broadcast,否则使用cache

2、尽量减少重复计算,同样的计算逻辑只计算一次

3、几个优化参数

spark.akka.frameSize 1000     　　　　　　　 　　　　   　　 集群间通信 一帧数据的大小,设置太小可能会导致通信延迟

spark.akka.timeout 100　　　　 　　　　         　　　　       通信等待最长时间(秒为单位)
spark.akka.heartbeat.pauses 600　　　　　　　　　　    　  心跳失败最大间隔(秒为单位)
spark.serializer org.apache.spark.serializer.KryoSerializer    序列化方式(sprak自己的实现方式)
spark.sql.autoBroadcastJoinThreshold -1　　　　　　　　　  禁止自动broadcast表
spark.shuffle.consolidateFiles true　　　　　　　　　　　　　shuffle 自动合并小文件



四、后续优化方向

1、内存优化：对象所占用的内存，访问对象的消耗以及垃圾回收（garbage collection)所占用的开销

2、优化数据结构

3、优化RDD存储

4、并行度
```

#### <a name="cogroup" >14-cogroup(otherDataset, [numTasks])</a> [<a href="#cogroup_back">返回表格</a>]
[转自过往记忆（原文链接）](https://www.iteblog.com/archives/1280.html)
将多个RDD中相同key对应的value 结合到一起，函数原型总共有9个，而最多进行组合的RDD上限为4个，也就是说最多可以组合四个RDD

函数原型：

```Scala
def cogroup[W1, W2, W3](other1: RDD[(K, W1)],
      other2: RDD[(K, W2)], other3: RDD[(K, W3)], partitioner: Partitioner) :
      RDD[(K, (Iterable[V], Iterable[W1], Iterable[W2], Iterable[W3]))]
def cogroup[W1, W2, W3](other1: RDD[(K, W1)],
      other2: RDD[(K, W2)], other3: RDD[(K, W3)], numPartitions: Int) :
      RDD[(K, (Iterable[V], Iterable[W1], Iterable[W2], Iterable[W3]))]
def cogroup[W1, W2, W3](other1: RDD[(K, W1)],
      other2: RDD[(K, W2)], other3: RDD[(K, W3)])
      : RDD[(K, (Iterable[V], Iterable[W1], Iterable[W2], Iterable[W3]))]
def cogroup[W1, W2](other1: RDD[(K, W1)], other2: RDD[(K, W2)],
       partitioner: Partitioner)
      : RDD[(K, (Iterable[V], Iterable[W1], Iterable[W2]))]
def cogroup[W1, W2](other1: RDD[(K, W1)], other2: RDD[(K, W2)],
      numPartitions: Int)
      : RDD[(K, (Iterable[V], Iterable[W1], Iterable[W2]))]
def cogroup[W1, W2](other1: RDD[(K, W1)], other2: RDD[(K, W2)])
      : RDD[(K, (Iterable[V], Iterable[W1], Iterable[W2]))]
def cogroup[W](other: RDD[(K, W)], partitioner: Partitioner) :
      RDD[(K, (Iterable[V], Iterable[W]))]
def cogroup[W](other: RDD[(K, W)], numPartitions: Int): RDD[(K, (Iterable[V], Iterable[W]))]
def cogroup[W](other: RDD[(K, W)]): RDD[(K, (Iterable[V], Iterable[W]))]
```
事例：

```Scala
scala> val data1 = sc.parallelize(List((1, "www"), (2, "bbs")))
data1: org.apache.spark.rdd.RDD[(Int, String)] =
      ParallelCollectionRDD[32] at parallelize at <console>:12

scala> val data2 = sc.parallelize(List((1, "iteblog"), (2, "iteblog"), (3, "very")))
data2: org.apache.spark.rdd.RDD[(Int, String)] =
      ParallelCollectionRDD[33] at parallelize at <console>:12

scala> val data3 = sc.parallelize(List((1, "com"), (2, "com"), (3, "good")))
data3: org.apache.spark.rdd.RDD[(Int, String)] =
      ParallelCollectionRDD[34] at parallelize at <console>:12

scala> val result = data1.cogroup(data2, data3)
result: org.apache.spark.rdd.RDD[(Int, (Iterable[String],
      Iterable[String], Iterable[String]))] = MappedValuesRDD[38] at cogroup at <console>:18

scala> result.collect
res30: Array[(Int, (Iterable[String], Iterable[String], Iterable[String]))] =
Array((1,(CompactBuffer(www),CompactBuffer(iteblog),CompactBuffer(com))),
(2,(CompactBuffer(bbs),CompactBuffer(iteblog),CompactBuffer(com))),
(3,(CompactBuffer(),CompactBuffer(very),CompactBuffer(good))))
```
  从上面的结果可以看到，data1中不存在Key为3的元素（自然就不存在Value了），在组合的过程中将data1对应的位置设置为CompactBuffer()了，而不是去掉


#### <a name="cartesian" >15-cartesian(otherDataset) </a> [<a href="#cartesian_back">返回表格</a>]
[参考博客过往记忆（原文链接）](https://www.iteblog.com/archives/1277.html)
* 函数原型

    def cartesian[U: ClassTag](other: RDD[U]): RDD[(T, U)]

* 该函数返回的是Pair类型的RDD，计算结果是当前RDD和other RDD中每个元素进行笛卡儿计算的结果。最后返回的是CartesianRDD。
事例如下

```Scala
scala> val a = sc.parallelize(List(1,2,3))
a: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[62] at parallelize at <console>:12

scala> val b = sc.parallelize(List(4,5,6))
b: org.apache.spark.rdd.RDD[Int] = ParallelCollectionRDD[63] at parallelize at <console>:12

scala> val result = a.cartesian(b)
result: org.apache.spark.rdd.RDD[(Int, Int)] = CartesianRDD[64] at cartesian at <console>:16

scala> result.collect
res78: Array[(Int, Int)] = Array((1,4), (1,5), (1,6), (2,4),
　　　　 (2,5), (2,6), (3,4), (3,5), (3,6))
```
* 注意：
    笛卡尔积计算量还是蛮大的，笛卡儿计算是很恐怖的，特别消耗内存还是小心使用


---

#### <a name="pipe" >16-pipe(command, [envVars])</a> [<a href="#pipe_back">返回表格</a>]
[原文链接](https://blog.csdn.net/guotong1988/article/details/50801151)
案例代码
```Scala
package test

import org.apache.spark.SparkConf
import org.apache.spark.SparkContext

object PipeTest {

  def main(args: Array[String]) {
    val sparkConf = new SparkConf().setAppName("pipe Test")
    val sc = new SparkContext(sparkConf)
    val data = List("hi", "hello", "how", "are", "you")
    val dataRDD = sc.makeRDD(data)//out123.txt里有hi hello how are you，如果加一个参数变成sc.makeRDD(data，2)则是how are you，我想应该是只有一个worker的缘故
    val scriptPath = "/home/gt/spark/bin/echo.sh"
    val pipeRDD = dataRDD.pipe(scriptPath)
    print(pipeRDD.collect())
    sc.stop()
  }

}

```
shell脚本内容

```shell
#!/bin/bash
echo "Running shell script";
RESULT="";#变量两端不能直接接空格符
while read LINE; do
   RESULT=${RESULT}" "${LINE}
done

echo ${RESULT} > out123.txt
```
提交命令

    /spark-submit --class test.PipeTest --master local pipe.jar

#### <a name="coalesce" >17-coalesce(numPartitions)</a> [<a href="#coalesce_back">返回表格</a>]

[原文链接](https://www.iteblog.com/archives/1279.html)
* 重新指定分区数量，可以用在filter之后提高执行效率，并且能够指定是否发生shuffle

函数原型

```Scala
def coalesce(numPartitions: Int, shuffle: Boolean = false)
　　　　(implicit ord: Ordering[T] = null): RDD[T]
```
```Scala
scala> var data = sc.parallelize(List(1,2,3,4))
data: org.apache.spark.rdd.RDD[Int] =
　　　　ParallelCollectionRDD[45] at parallelize at <console>:12

scala> data.partitions.length
res68: Int = 30

scala> val result = data.coalesce(2, false)
result: org.apache.spark.rdd.RDD[Int] = CoalescedRDD[57] at coalesce at <console>:14

scala> result.partitions.length
res77: Int = 2

scala> result.toDebugString
res75: String =
(2) CoalescedRDD[57] at coalesce at <console>:14 []
 |  ParallelCollectionRDD[45] at parallelize at <console>:12 []

scala> val result1 = data.coalesce(2, true)
result1: org.apache.spark.rdd.RDD[Int] = MappedRDD[61] at coalesce at <console>:14

scala> result1.toDebugString
res76: String =
(2) MappedRDD[61] at coalesce at <console>:14 []
 |  CoalescedRDD[60] at coalesce at <console>:14 []
 |  ShuffledRDD[59] at coalesce at <console>:14 []
 +-(30) MapPartitionsRDD[58] at coalesce at <console>:14 []
    |   ParallelCollectionRDD[45] at parallelize at <console>:12 []
```

    从上面可以看出shuffle为false的时候并不进行shuffle操作；而为true的时候会进行shuffle操作。RDD.partitions.length可以获取相关RDD的分区数。

#### <a name="repartitionAndSortWithinPartitions" >18-repartitionAndSortWithinPartitions(partitioner)</a> [<a href="#repartitionAndSortWithinPartitions_back">返回表格</a>]
[参考博客](https://www.cnblogs.com/suinlove/p/5594754.html)

* shuffle与sort两个操作同时进行，比先shuffle再sort来说，性能可能是要高的。 分区的同时进行排序


```Scala
package lzkj.Spark_Study.Spark_Core.RepartitionAndSortWithinPartitions

import org.apache.spark.{SparkConf, SparkContext}

class Student {

}
//创建key类，key组合键为grade，score
case class StudentKey(grade:String,score:Int)
//  extends Ordered[StudentKey]{
//  def compare(that: StudentKey) : Int = {
//    var result:Int = this.grade.compareTo(that.grade)
//    if (result == 0){
//      result = this.student.compareTo(that.student)
//      if(result ==0){
//        result = that.score.compareTo(this.score)
//      }
//    }
//    result
//  }
//}

object StudentKey {
  implicit def orderingByGradeStudentScore[A <: StudentKey] : Ordering[A] = {
    // Ordering.by(fk => (fk.grade, fk.student, fk.score * -1))
    Ordering.by(fk => (fk.grade, fk.score * -1))
  }
}

object Student {
  def main(args: Array[String]) {


    //定义hdfs文件索引值
    val grade_idx: Int = 0
    val student_idx: Int = 1
    val course_idx: Int = 2
    val score_idx: Int = 3

    //定义转化函数，不能转化为Int类型的，给默认值0
    def safeInt(s: String): Int = try {
      s.toInt
    } catch {
      case _: Throwable => 0
    }

    //定义提取key的函数
    def createKey(data: Array[String]): StudentKey = {
      StudentKey(data(grade_idx), safeInt(data(score_idx)))
    }

    //定义提取value的函数
    def listData(data: Array[String]): List[String] = {
      List(data(grade_idx), data(student_idx), data(course_idx), data(score_idx))
    }

    def createKeyValueTuple(data: Array[String]): (StudentKey, List[String]) = {
      (createKey(data), listData(data))
    }

    //创建分区类
    import org.apache.spark.Partitioner
    class StudentPartitioner(partitions: Int) extends Partitioner {
      require(partitions >= 0, s"Number of partitions ($partitions) cannot be negative.")

      override def numPartitions: Int = partitions

      override def getPartition(key: Any): Int = {
        val k = key.asInstanceOf[StudentKey]
        k.grade.hashCode() % numPartitions
      }
    }

    //设置master为local，用来进行本地调试
    val conf = new SparkConf().setAppName("Student_partition_sort").setMaster("local")
    val sc = new SparkContext(conf)

    //学生信息是打乱的
    val student_array = Array(
      "c001,n003,chinese,59",
      "c002,n004,english,79",
      "c002,n004,chinese,13",
      "c001,n001,english,88",
      "c001,n002,chinese,10",
      "c002,n006,chinese,29",
      "c001,n001,chinese,54",
      "c001,n002,english,32",
      "c001,n003,english,43",
      "c002,n005,english,80",
      "c002,n005,chinese,48",
      "c002,n006,english,69"
    )

    　 　 //将学生信息并行化为rdd
    val student_rdd = sc.parallelize(student_array)
    　 　 //生成key-value格式的rdd
    val student_rdd2 = student_rdd.map(line => line.split(",")).map(createKeyValueTuple)
    //根据StudentKey中的grade进行分区，并根据score降序排列
    val student_rdd3 = student_rdd2.repartitionAndSortWithinPartitions(new StudentPartitioner(10))
    　 　 //打印数据
    student_rdd3.collect.foreach(println)


  }
}
```



#### 参考博客
* 以上案例均参考博客

[博主1原文地址](https://blog.csdn.net/u013980127/article/details/53046760)
[博主2原文地址](https://blog.csdn.net/liangyihuai/article/details/54377226)


## Action 算子

[参考链接](https://blog.csdn.net/zdy0_2004/article/details/51204983)

[暂时](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#Action)
###  Action

| 算子名字    | 描述    |解释|
| :------------- | :------------- |:---:|
|<a href="#reduce">reduce(func)</a><a name="reduce_back">:</a> |Aggregate the elements of the dataset using a function func (which takes two arguments and returns one). The function should be commutative and associative so that it can be computed correctly in parallel.|使用函数func聚合数据集的元素(它接受两个参数并返回一个参数)。函数应该是可交换的和关联的，这样可以并行计算。|
|collect()|Return all the elements of the dataset as an array at the driver program. This is usually useful after a filter or other operation that returns a sufficiently small subset of the data.|将数据集的所有元素作为一个数组返回到驱动程序。在过滤器或其他操作返回足够小的数据子集之后，这通常是有用的。|
|count()|Return the number of elements in the dataset.|计算数据条数|
|first()|Return the first element of the dataset (similar to take(1)).|取出来数据的第一条|
|take(n)|Return an array with the first n elements of the dataset.|取出来前n条数据|
|<a href="#takeSample">takeSample(withReplacement, num, [seed]) </a><a name="takeSample_back">:</a>  |Return an array with a random sample of num elements of the dataset, with or without replacement, optionally pre-specifying a random number generator seed.|返回一个包含数据集的num元素的随机样本的数组，有或没有替换，可选地预先指定一个随机数生成器种子。|
|takeOrdered(n, [ordering])|Return the first n elements of the RDD using either their natural order or a custom comparator.|使用自然顺序或自定义比较器返回RDD的前n个元素。|
|saveAsTextFile(path)|Write the elements of the dataset as a text file (or set of text files) in a given directory in the local filesystem, HDFS or any other Hadoop-supported file system. Spark will call toString on each element to convert it to a line of text in the file.注意：路径是目录的路径，且如果分区不等于1，name最终写入多个文件中|将数据集的元素作为文本文件（或文本文件集）写入本地文件系统，HDFS或任何其他Hadoop支持的文件系统中的给定目录。 Spark将在每个元素上调用toString将其转换为文件中的一行文本。|
|saveAsSequenceFile(path)(Java and Scala)|Write the elements of the dataset as a Hadoop SequenceFile in a given path in the local filesystem, HDFS or any other Hadoop-supported file system. This is available on RDDs of key-value pairs that implement Hadoop's Writable interface. In Scala, it is also available on types that are implicitly convertible to Writable (Spark includes conversions for basic types like Int, Double, String, etc).|将数据集的元素作为Hadoop SequenceFile写入本地文件系统，HDFS或任何其他Hadoop支持的文件系统的给定路径中。这在实现Hadoop的Writable接口的键值对的RDD上可用。在Scala中，它也可用于可隐式转换为Writable的类型（Spark包含Int，Double，String等基本类型的转换）。|
|saveAsObjectFile(path)(Java and Scala)|Write the elements of the dataset in a simple format using Java serialization, which can then be loaded using SparkContext.objectFile().|使用Java序列化以简单的格式写入数据集的元素，然后使用SparkContext.objectFile（）加载该序列化。|
|countByKey()|Only available on RDDs of type (K, V). Returns a hashmap of (K, Int) pairs with the count of each key.|仅适用于类型（K，V）的RDD。用（K，Int）对的hashmap返回每个键的计数。|
|foreach(func)|Run a function func on each element of the dataset. This is usually done for side effects such as updating an Accumulator or interacting with external storage systems.Note: modifying variables other than Accumulators outside of the foreach() may result in undefined behavior. See Understanding closures for more details.|在数据集的每个元素上运行函数func。这通常用于副作用，如更新累加器或与外部存储系统交互。注意：修改除foreach（）之外的累加器以外的变量可能会导致未定义的行为。有关更多详细信息，请参阅了解闭包|

### 案例

#### 案例总结博客

[博客1](https://www.cnblogs.com/liuzhongfeng/p/5285613.html)

####  <a name="reduce" >18-reduce(func)</a> [<a href="#reduce_back">返回表格</a>]
[参考链接](https://blog.csdn.net/zdy0_2004/article/details/51204983)


#### <a name="takeSample" >19-takeSample(withReplacement, num, [seed])</a> [<a href="#takeSample_back">返回表格</a>]
```
从源码中可以看出，takeSample函数类似于sample函数，该函数接受三个参数，第一个参数withReplacement ，表示采样是否放回，true表示有放回的采样，false表示无放回采样；第二个参数num，表示返回的采样数据的个数，这个也是takeSample函数和sample函数的区别；第三个参数seed，表示用于指定的随机数生成器种子。另外，takeSample函数先是计算fraction，也就是采样比例，然后调用sample函数进行采样，并对采样后的数据进行collect()，最后调用take函数返回num个元素。注意，如果采样个数大于RDD的元素个数，且选择的无放回采样，则返回RDD的元素的个数。
```
withReplacement：boolean 。 是否又放回，true表示无放回
num：抽取结果集中多少条数据


#### 总结

The Spark RDD API also exposes asynchronous versions of some actions, like foreachAsync for foreach, which immediately return a FutureAction to the caller instead of blocking on completion of the action. This can be used to manage or wait for the asynchronous execution of the action.
译文：
```
Spark RDD API还公开了一些操作的异步版本，例如foreach的foreachAsync，它会立即向调用者返回一个futuresponse，而不是阻塞完成操作。这可以用于管理或等待操作的异步执行。
```
---

#### Shuffle operations （action会产生shuffle）

Certain operations within Spark trigger an event known as the shuffle. The shuffle is Spark’s mechanism for re-distributing data so that it’s grouped differently across partitions. This typically involves copying data across executors and machines, making the shuffle a complex and costly operation.
译文：
```
Spark中的某些操作会触发一个名为shuffle的事件。shuffle是Spark的重新分配数据的机制，以便在不同的分区之间进行不同的分组。这通常涉及在执行器和机器之间复制数据，从而使操作变得复杂且代价高昂。
就是说shuffle 动用计算资源代价比较高
```


## Background

To understand what happens during the shuffle we can consider the example of the reduceByKey operation. The reduceByKey operation generates a new RDD where all values for a single key are combined into a tuple - the key and the result of executing a reduce function against all values associated with that key. The challenge is that not all values for a single key necessarily reside on the same partition, or even the same machine, but they must be co-located to compute the result.
译文：
```

为了理解shuffle过程中发生了什么，我们可以考虑reduceByKey操作的例子。 reduceByKey操作生成一个新的RDD，其中单个键的所有值都组合为一个元组 - 键和对与该键相关的所有值执行reduce功能的结果。我们面临的挑战是，并非所有单个key的值都必须位于同一个分区，甚至是同一台计算机上，但它们必须位于同一位置才能计算结果。

```
In Spark, data is generally not distributed across partitions to be in the necessary place for a specific operation. During computations, a single task will operate on a single partition - thus, to organize all the data for a single reduceByKey reduce task to execute, Spark needs to perform an all-to-all operation. It must read from all partitions to find all the values for all keys, and then bring together values across partitions to compute the final result for each key - this is called the shuffle.
译文：
```
在Spark中，数据通常不会跨分区进行分布，无法在特定操作的必要位置进行分配。在计算过程中，单个任务将在单个分区上运行 - 因此，要组织执行单个reduceByKey reduce任务的所有数据，Spark需要执行全部操作。它必须从所有分区中读取以找到所有键的所有值，然后将分区中的值汇总在一起以计算每个键的最终结果 - 这称为shuffle。
```
Although the set of elements in each partition of newly shuffled data will be deterministic, and so is the ordering of partitions themselves, the ordering of these elements is not. If one desires predictably ordered data following shuffle then it’s possible to use:

译文：
```
虽然新洗牌数据的每个分区中的元素集合都是确定性的，分区本身的排序也是确定性的，但这些元素的排序不是确定的。如果人们希望随机播放数据，那么可以使用：
```

    mapPartitions to sort each partition using, for example, .sorted （对每个分区排序使用  ：.sorted）
    repartitionAndSortWithinPartitions to efficiently sort partitions while simultaneously repartitioning(分区的同时有效的排序)
    sortBy to make a globally ordered RDD （生成全局有序的rdd）

## 产生shuffle 的操作

Operations which can cause a shuffle include repartition operations like repartition and coalesce, ‘ByKey operations (except for counting) like groupByKey and reduceByKey, and join operations like cogroup and join.
```
重新分区操作：
  repartition 、 coalesce
ByKey 操作（除了计数counting） ，比如：
  groupByKey 、 reduceByKey
join 聚合操作
  cogrooup、join

```

### repartition、与coalesce 同样是分区，name他们有什么区别呢？

```
repartition(numPartitions:Int):RDD[T]和coalesce(numPartitions:Int，shuffle:Boolean=false):RDD[T]

他们两个都是RDD的分区进行重新划分，repartition只是coalesce接口中shuffle为true的简易实现，（假设RDD有N个分区，需要重新划分成M个分区）

1）、N<M。一般情况下N个分区有数据分布不均匀的状况，利用HashPartitioner函数将数据重新分区为M个，这时需要将shuffle设置为true。

2）如果N>M并且N和M相差不多，(假如N是1000，M是100)那么就可以将N个分区中的若干个分区合并成一个新的分区，最终合并为M个分区，这时可以将shuff设置为false，在shuffl为false的情况下，如果M>N时，coalesce为无效的，不进行shuffle过程，父RDD和子RDD之间是窄依赖关系。

3）如果N>M并且两者相差悬殊，这时如果将shuffle设置为false，父子RDD是窄依赖关系，他们同处在一个Stage中，就可能造成spark程序的并行度不够，从而影响性能，如果在M为1的时候，为了使coalesce之前的操作有更好的并行度，可以讲shuffle设置为true。

总之：如果shuff为false时，如果传入的参数大于现有的分区数目，RDD的分区数不变，也就是说不经过shuffle，是无法将RDDde分区数变多的。

```

## Performance Impact（性能的影响）

The Shuffle is an expensive operation since it involves disk I/O, data serialization, and network I/O. To organize data for the shuffle, Spark generates sets of tasks - map tasks to organize the data, and a set of reduce tasks to aggregate it. This nomenclature comes from MapReduce and does not directly relate to Spark’s map and reduce operations.

译文：
```
Shuffle是一项昂贵的操作，因为它涉及磁盘I / O，数据序列化和网络I / O。为了组织数据，Spark生成一组任务 - 映射任务以组织数据，以及一组减少任务来聚合它。这个术语来自MapReduce，并不直接与Spark的map和reduce操作相关。
```

Internally, results from individual map tasks are kept in memory until they can’t fit. Then, these are sorted based on the target partition and written to a single file. On the reduce side, tasks read the relevant sorted blocks.
译文：
```
在内部，来自单个map任务的结果将保存在内存中，直到它们不适合为止。然后，这些将根据目标分区进行排序并写入单个文件。在reduce方面，任务读取相关的排序块。
```

Certain shuffle operations can consum（消耗）e significant（重大的） amounts（数量） of heap memory since they employ in-memory data structures to organize records before or after transferring them. Specifically, reduceByKey and aggregateByKey create these structures on the map side, and 'ByKey operations generate these on the reduce side. When data does not fit in memory Spark will spill these tables to disk, incurring the additional overhead of disk I/O and increased garbage collection.

```
某些随机操作会消耗大量的堆内存，因为它们使用内存中的数据结构在传输之前或之后组织记录。具体来说，reduceByKey和aggregateByKey在map一侧创建这些结构，'ByKey操作在reduce一侧生成这些结构。当数据不适合存储在内存中时，Spark会将这些表泄露到磁盘中，从而导致磁盘I / O的额外开销和增加的垃圾回收。
```

Shuffle also generates a large number of intermediate(中间的) files on disk. As of Spark 1.3, these files are preserved until the corresponding （相应的）RDDs are no longer used and are garbage collected. This is done so the shuffle files don’t need to be re-created if the lineage is re-computed. Garbage collection may happen only after a long period of time, if the application retains references to these RDDs or if GC does not kick in frequently. This means that long-running Spark jobs may consume a large amount of disk space. The temporary storage directory is specified by the spark.local.dir configuration parameter when configuring the Spark context.

译文
```

shuffle 还会在磁盘上生成大量中间文件。从Spark 1.3开始，这些文件将被保留，直到相应的RDD不再使用并被垃圾收集为止。这样做是为了在重新计算谱系时不需要重新创建洗牌文件。如果应用程序保留对这些RDD的引用或者GC未频繁引入，垃圾收集可能会在很长一段时间后才会发生。这意味着长时间运行的Spark作业可能会消耗大量的磁盘空间。临时存储目录在配置Spark上下文时由spark.local.dir配置参数指定。
```

Shuffle behavior can be tuned by adjusting a variety of configuration parameters. See the ‘Shuffle Behavior’ section within the [Spark Configuration Guide](http://spark.apache.org/docs/2.2.0/configuration.html).
译文：
```
shuffle可以通过调整各种配置参数来调整。请参阅“Spark配置指南”中的“Shuffle Behavior”部分。
```


## RDD Persistence （RDD 持久性）
[官方链接](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#rdd-persistence)

* persist（）或cache（） 方法

One of the most important capabilities in Spark is persisting (or caching) a dataset in memory across operations. When you persist an RDD, each node stores any partitions of it that it computes in memory and reuses them in other actions on that dataset (or datasets derived from it). This allows future actions to be much faster (often by more than 10x). Caching is a key tool for iterative algorithms and fast interactive use.

译文
```
Spark中最重要的功能之一是在整个操作中persisting（或caching）内存中的数据集。当持久化RDD时，每个节点都会存储它在内存中计算的所有分区，并在该数据集上的其他操作（或从中派生的数据集）中重用它们。这可以使未来的行动更快（通常超过10倍）。缓存是迭代算法和快速交互式使用的关键工具。
```

You can mark an RDD to be persisted using the persist() or cache() methods on it. The first time it is computed in an action, it will be kept in memory on the nodes. Spark’s cache is fault-tolerant – if any partition of an RDD is lost, it will automatically be recomputed using the transformations that originally created it.

译文：
```
您可以使用其上的persist（）或cache（）方法将RDD标记为持久化。第一次在动作中计算时，它将保存在节点的内存中。 Spark的缓存是容错的 - 如果RDD的任何分区丢失，它将自动使用最初创建它的转换重新计算。
```

In addition, each persisted RDD can be stored using a different storage level, allowing you, for example, to persist the dataset on disk, persist it in memory but as serialized Java objects (to save space), replicate it across nodes. These levels are set by passing a StorageLevel object (Scala, Java, Python) to persist(). The cache() method is a shorthand for using the default storage level, which is StorageLevel.MEMORY_ONLY (store deserialized objects in memory). The full set of storage levels is:
译文：
```
另外，每个持久化的RDD都可以使用不同的存储级别来存储，例如，允许您在磁盘上保存数据集，将其保存在内存中，但是作为序列化的Java对象(为了节省空间)，可以跨节点复制它。这些级别是通过传递一个StorageLevel对象([Scala](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.storage.StorageLevel)、[Java](http://spark.apache.org/docs/2.2.0/api/java/index.html?org/apache/spark/storage/StorageLevel.html)、Python)来持久化()的。缓存()方法是使用默认存储级别(即StorageLevel)的简写.MEMORY_ONLY(存储在内存中的反序列化对象)。完整的存储级别为:
```
| Storage Level    | Meaning     | 解释 |
| :------------- | :------------- | :---:|
| MEMORY_ONLY  （默认级别）  | Store RDD as deserialized Java objects in the JVM. If the RDD does not fit in memory, some partitions will not be cached and will be recomputed on the fly each time they're needed. This is the default level. |将RDD作为反序列化的Java对象存储在JVM中。如果RDD不适合内存，则某些分区将不会被缓存，并会在每次需要时重新计算。这是默认级别。|
|MEMORY_AND_DISK| 	Store RDD as deserialized Java objects in the JVM. If the RDD does not fit in memory, store the partitions that don't fit on disk, and read them from there when they're needed. |将RDD作为反序列化的Java对象存储在JVM中。如果RDD不适合内存，请存储不适合磁盘的分区，并在需要时从中读取它们。|
|MEMORY_ONLY_SER(Java and Scala) |	Store RDD as serialized Java objects (one byte array per partition). This is generally more space-efficient than deserialized objects, especially when using a fast [serializer](http://spark.apache.org/docs/2.2.0/tuning.html), but more CPU-intensive to read. |将RDD存储为序列化的Java对象（每个分区一个字节的数组）。这通常比反序列化的对象更节省空间，特别是在使用快速序列化器时，但需要更多的CPU密集型读取。|
|MEMORY_AND_DISK_SER(Java and Scala) |Similar to MEMORY_ONLY_SER, but spill partitions that don't fit in memory to disk instead of recomputing them on the fly each time they're needed. |与MEMORY_ONLY_SER类似，但将不适合内存的分区溢出到磁盘上，而不是每次需要时重新计算它们。|
|DISK_ONLY | 	Store the RDD partitions only on disk. |仅将RDD分区存储在磁盘上。|
|MEMORY_ONLY_2, MEMORY_AND_DISK_2, etc. |Same as the levels above, but replicate each partition on two cluster nodes. |与上面的级别相同，但是在两个集群节点上复制每个分区。|
|OFF_HEAP (experimental) |Similar to MEMORY_ONLY_SER, but store the data in off-heap memory. This requires [off-heap](http://spark.apache.org/docs/2.2.0/configuration.html#memory-management) memory to be enabled. |与MEMORY_ONLY_SER类似，但将数据存储在非堆内存中。这需要启用非堆内存。|

Note: In Python, stored objects will always be serialized with the [Pickle](https://docs.python.org/2/library/pickle.html) library, so it does not matter whether you choose a serialized level. The available storage levels in Python include MEMORY_ONLY, MEMORY_ONLY_2, MEMORY_AND_DISK, MEMORY_AND_DISK_2, DISK_ONLY, and DISK_ONLY_2.
译文：
```

注意：在Python中，存储的对象将始终与Pickle库串行化，所以选择序列化级别无关紧要。 Python中的可用存储级别包括MEMORY_ONLY，MEMORY_ONLY_2，MEMORY_AND_DISK，MEMORY_AND_DISK_2，DISK_ONLY和DISK_ONLY_2。
```
Spark also automatically persists some intermediate data in shuffle operations (e.g. reduceByKey), even without users calling persist. This is done to avoid recomputing the entire input if a node fails during the shuffle. We still recommend users call persist on the resulting RDD if they plan to reuse it.

```
即使没有用户调用persist，Spark也会在shuffle操作中自动保留一些中间数据（例如reduceByKey）。这是为了避免在洗牌过程中节点失败时重新计算整个输入。如果用户打算重用RDD，我们仍建议用户调用persist 对rdd进行持久化。
```
### Which Storage Level to Choose?

Spark’s storage levels are meant to provide different trade-offs between memory usage and CPU efficiency. We recommend going through the following process to select one:
译文：
```
Spark的存储级别旨在提供内存使用和CPU效率之间的不同折衷。我们建议通过以下流程来选择一个：
```

*  If your RDDs fit comfortably with the default storage level (MEMORY_ONLY), leave them that way. This is the most CPU-efficient option, allowing operations on the RDDs to run as fast as possible.
>如果您的RDD适合默认存储级别（MEMORY_ONLY），请将其留在那里。这是CPU处理效率最高的选项，允许RDD上的操作尽可能快地运行。

* If not, try using MEMORY_ONLY_SER and selecting a fast serialization library to make the objects much more space-efficient, but still reasonably fast to access. (Java and Scala)
>如果没有，请尝试使用MEMORY_ONLY_SER并选择一个快速序列化库以使对象更加节省空间，但仍然可以快速访问。 （Java和Scala

* Don’t spill to disk unless the functions that computed your datasets are expensive, or they filter a large amount of the data. Otherwise, recomputing a partition may be as fast as reading it from disk.
>除非计算数据集的函数很昂贵，否则它们会过滤大量数据，否则不要泄露到磁盘。否则，重新计算分区可能与从磁盘读取分区一样快。

* Use the replicated storage levels if you want fast fault recovery (e.g. if using Spark to serve requests from a web application). All the storage levels provide full fault tolerance by recomputing lost data, but the replicated ones let you continue running tasks on the RDD without waiting to recompute a lost partition.
>如果要快速恢复故障（例如，如果使用Spark来为Web应用程序提供请求），请使用复制的存储级别。所有的存储级别通过重新计算丢失的数据来提供完全的容错能力，但是复制的容量可让您继续在RDD上运行任务，而无需等待重新计算丢失的分区。


## Removing Data ：消除数据
Spark automatically monitors cache usage on each node and drops out old data partitions in a least-recently-used (LRU) fashion. If you would like to manually remove an RDD instead of waiting for it to fall out of the cache, use the RDD.unpersist() method
译文：
```
Spark会自动监视每个节点上的高速缓存使用情况，并以最近最少使用（LRU）方式删除旧数据分区。如果您想要手动删除RDD而不是等待它退出缓存，请使用RDD.unpersist（）方法
```
就是缓存的数据可以使用unpersist进行清除，而不是等待垃圾回收机制


##Shared Variables ：共享变量

Normally, when a function passed to a Spark operation (such as map or reduce) is executed on a remote cluster node, it works on separate copies of all the variables used in the function. These variables are copied to each machine, and no updates to the variables on the remote machine are propagated back to the driver program. Supporting general, read-write shared variables across tasks would be inefficient. However, Spark does provide two limited types of shared variables for two common usage patterns: broadcast variables and accumulators.
译文：
```
通常，当在远程集群节点上执行传递给Spark操作（如map或reduce）的函数时，它将在函数中使用的所有变量的单独副本上运行。这些变量被复制到每台机器上，并且远程机器上变量的更新没有传播回驱动程序。在任务之间支持通用的，可读写的共享变量将是低效的。但是，Spark为两种常见使用模式提供了两种有限类型的共享变量：broadcast(广播变量)和accumulators（累加器）。
```

## Broadcast Variables :广播变量

Broadcast variables allow the programmer to keep a read-only variable cached on each machine rather than shipping a copy of it with tasks. They can be used, for example, to give every node a copy of a large input dataset in an efficient manner. Spark also attempts to distribute broadcast variables using efficient broadcast algorithms to reduce communication cost.
译文：
```
广播变量允许程序员将只读变量保存在每台机器上，而不是将其复制到任务中。例如，可以使用它们以有效的方式为每个节点提供一个大型输入数据集的副本。Spark还尝试使用高效的广播算法来分配广播变量，
```
Spark actions are executed through a set of stages, separated by distributed “shuffle” operations. Spark automatically broadcasts the common data needed by tasks within each stage. The data broadcasted this way is cached in serialized form and deserialized before running each task. This means that explicitly creating broadcast variables is only useful when tasks across multiple stages need the same data or when caching the data in deserialized form is important.
译文：
```

Spark动作通过一系列阶段执行，由分布式“混洗”操作分隔。 Spark会自动广播每个阶段中任务所需的通用数据。以这种方式广播的数据以序列化形式缓存并在运行每个任务之前反序列化。这意味着只有跨多个阶段的任务需要相同的数据或以反序列化形式缓存数据时，显式创建广播变量才是有用的。
```

Broadcast variables are created from a variable v by calling SparkContext.broadcast(v). The broadcast variable is a wrapper around v, and its value can be accessed by calling the value method. The code below shows this:
译文：
```
广播变量是通过调用SparkContext.broadcast（v）从变量v创建的。广播变量是v的一个包装，它的值可以通过调用value方法来访问。下面的代码显示了这一点：
```

```Scala


scala> val broadcastVar = sc.broadcast(Array(1, 2, 3))
broadcastVar: org.apache.spark.broadcast.Broadcast[Array[Int]] = Broadcast(0)

scala> broadcastVar.value
res0: Array[Int] = Array(1, 2, 3)

* api：

val conf: SparkConf = new SparkConf().setAppName("Broadcast test").setMaster("local[3]")
val sc: SparkContext = new SparkContext(conf)
val broadcastVar: Broadcast[Array[Int]] = sc.broadcast(Array(1,2,3))
println(broadcastVar.value.asInstanceOf[Array[Int]].map(x => println(x)))


```
After the broadcast variable is created, it should be used instead of the value v in any functions run on the cluster so that v is not shipped to the nodes more than once. In addition, the object v should not be modified after it is broadcast in order to ensure that all nodes get the same value of the broadcast variable (e.g. if the variable is shipped to a new node later).
译文：
```
在创建了广播变量之后，应该在集群中运行的任何函数中使用它，而不是值v，这样就不会不止一次地将v发送到节点。此外，在广播之后，对象v不应该被修改，以确保所有节点都获得广播变量的相同值(例如，如果该变量稍后被发送到一个新节点)。

```


## Accumulators ：全局变量累加器 [官方链接](http://spark.apache.org/docs/2.2.0/rdd-programming-guide.html#accumulators)

Accumulators are variables that are only “added” to through an associative（组合） and commutative operation and can therefore be efficiently supported in parallel. They can be used to implement counters (as in MapReduce) or sums. Spark natively supports accumulators of numeric types, and programmers can add support for new types.
译文：
```

累加器是仅通过关联和交换操作“添加”的变量，因此可以并行有效地支持。它们可以用来实现计数器（如在MapReduce中）或者和。 Spark本身支持数字类型的累加器，程序员可以添加对新类型的支持。
```

As a user, you can create named or unnamed accumulators. As seen in the image below, a named accumulator (in this instance counter) will display in the web UI for the stage that modifies that accumulator. Spark displays the value for each accumulator modified by a task in the “Tasks” table.
译文：
```

作为用户，您可以创建命名或未命名的累加器。如下图所示，命名累加器（在此实例计数器中）将显示在修改该累加器的阶段的Web UI中。 Spark显示由“任务”表中的任务修改的每个累加器的值。
```

Tracking accumulators in the UI can be useful for understanding the progress of running stages (NOTE: this is not yet supported in Python).

```
跟踪UI中的累加器对于理解运行阶段的进度很有用（注意：Python尚未支持）。
```

代码：
A numeric accumulator can be created by calling SparkContext.longAccumulator() or SparkContext.doubleAccumulator() to accumulate values of type Long or Double, respectively. Tasks running on a cluster can then add to it using the add method. However, they cannot read its value. Only the driver program can read the accumulator’s value, using its value method.
译文：
```
可以通过调用SparkContext.longAccumulator（）或SparkContext.doubleAccumulator（）分别累积Long或Double类型的值来创建数字累加器。然后，使用add方法可以将在群集上运行的任务添加到群集中。但是，它们无法读取其价值。只有驱动程序可以使用其值方法读取累加器的值。
```

The code below shows an accumulator being used to add up the elements of an array:

```Scala
scala> val accum = sc.longAccumulator("My Accumulator")
accum: org.apache.spark.util.LongAccumulator = LongAccumulator(id: 0, name: Some(My Accumulator), value: 0)

scala> sc.parallelize(Array(1, 2, 3, 4)).foreach(x => accum.add(x))
...
10/09/29 18:41:08 INFO SparkContext: Tasks finished in 0.317106 s

scala> accum.value
res2: Long = 10
```
测试代码
```Scala
val conf = new SparkConf().setAppName("Accumulators_Demo").setMaster("local[4]")
   val sc = new SparkContext(conf)
   val my_Accumulator: LongAccumulator = sc.longAccumulator("My_Accumulator")

   /**
     * 输出位零,Here, accum is still 0 because no actions have caused the map operation to be computed.这是官方原话
     */
   sc.parallelize(List(1, 2, 3, 4), 2).map(x => {
     my_Accumulator.add(x)
   })
   println(s".map()-${my_Accumulator.value}") // 0

   sc.parallelize(List(1, 2, 3, 4), 2).map(x => {
     my_Accumulator.add(x)
   }).collect()
   println(s"map().collect${my_Accumulator.value}") // 10
   /**
     * val accum = sc.longAccumulator
     *data.map { x => accum.add(x); x }
     * // Here, accum is still 0 because no actions have caused the map operation to be computed.
     */

   //输出位10
   sc.parallelize(List(1, 2, 3, 4), 2).foreach(x => {
     my_Accumulator.add(x)
   })

   /**
     * 输出位4
     */

   sc.parallelize(List(1, 2, 3, 4), 2).foreach(x => {
     val a = 1
     my_Accumulator.add(a)
   })
   println(my_Accumulator.value) // 4  ,只性了四次，List中有四个元素

```

解释：


While this code used the built-in support for [accumulators](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.util.AccumulatorV2) of type Long, programmers can also create their own types by subclassing AccumulatorV2. The AccumulatorV2 abstract class has several methods which one has to override: reset for resetting the accumulator to zero, add for adding another value into the accumulator, merge for merging another same-type accumulator into this one. Other methods that must be overridden are contained in the [API documentation](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.util.AccumulatorV2) For example, supposing we had a MyVector class representing mathematical vectors, we could write:
译文：

```
虽然此代码使用对Long类型的累加器的内置支持，但程序员还可以通过继承AccumulatorV2来创建它们自己的类型。 AccumulatorV2抽象类有几个方法必须覆盖：reset 以将累加器复位为零，add用于将另一个值添加到累加器中，merge以将另一个相同类型的累加器合并到该累加器中。其他必须被覆盖的方法包含在API文档中。例如，假设我们有一个表示数学向量的MyVector类，我们可以这样写：
```
### 自定义全累加器

```Scala
class VectorAccumulatorV2 extends AccumulatorV2[MyVector, MyVector] {

  private val myVector: MyVector = MyVector.createZeroVector

  def reset(): Unit = {
    myVector.reset()
  }

  def add(v: MyVector): Unit = {
    myVector.add(v)
  }
  ...
}

// Then, create an Accumulator of this type:
val myVectorAcc = new VectorAccumulatorV2
// Then, register it into spark context:
sc.register(myVectorAcc, "MyVectorAcc1")

```

Note that, when programmers define their own type of AccumulatorV2, the resulting type can be different than that of the elements added.
译文：

```
请注意，当程序员定义自己的AccumulatorV2类型时，生成的类型可能与添加的元素的类型不同。
```

For accumulator updates performed inside actions only, Spark guarantees that each task’s update to the accumulator will only be applied once, i.e. restarted tasks will not update the value. In transformations, users should be aware of that each task’s update may be applied more than once if tasks or job stages are re-executed.
译文：
```
对于仅在actions算子内执行的累加器更新，Spark保证每个任务对累加器的更新只会应用一次，即重新启动的任务不会更新该值。在transformationd算子中，用户应该意识到，如果任务或作业阶段被重新执行，每个任务的更新可能会被应用多次。

```
Accumulators do not change the lazy evaluation model of Spark. If they are being updated within an operation on an RDD, their value is only updated once that RDD is computed as part of an action. Consequently, accumulator updates are not guaranteed to be executed when made within a lazy transformation like map(). The below code fragment demonstrates this property:
译文：
```
累加器不会改变Spark的延迟评估模型。如果它们在RDD的操作中被更新，它们的值只会在RDD被计算为action的一部分时更新。因此，在像map()这样的惰性转换中，不保证会执行累加器更新。下面的代码片段演示了该属性:
```

如下：
```Scala
val accum = sc.longAccumulator
data.map { x => accum.add(x); x }
// Here, accum is still 0 because no actions have caused the map operation to be computed.

```

### 自定义累加器——2
[原文博客](https://blog.csdn.net/leen0304/article/details/78866353)
[官方api-Accumulator](http://spark.apache.org/docs/latest/api/java/org/apache/spark/util/AccumulatorV2.html)
```
/**
  * 1、类继承extends AccumulatorV2[String, String]，第一个为输入类型，第二个为输出类型
  * 2、覆写抽象方法：
  * isZero: 当AccumulatorV2中存在类似数据不存在这种问题时，是否结束程序。
  * copy: 拷贝一个新的AccumulatorV2
  * reset: 重置AccumulatorV2中的数据
  * add: 操作数据累加方法实现
  * merge: 合并数据
  * value: AccumulatorV2对外访问的数据结果
  */
```
自定义累加器类的创建

```Scala
package lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulator_2

import org.apache.spark.util.AccumulatorV2


class  MyAccumulator extends AccumulatorV2[String,String]{

  /**
    * 1、类继承extends AccumulatorV2[String, String]，第一个为输入类型，第二个为输出类型
    * 2、覆写抽象方法：
    * isZero: 当AccumulatorV2中存在类似数据不存在这种问题时，是否结束程序。
    * copy: 拷贝一个新的AccumulatorV2
    * reset: 重置AccumulatorV2中的数据
    * add: 操作数据累加方法实现
    * merge: 合并数据
    * value: AccumulatorV2对外访问的数据结果
    */

  private var res = ""
  /**
    * 此方法必须返回true
    * @return
    */

  override def isZero: Boolean = {res == ""}

  override def merge(other: AccumulatorV2[String, String]): Unit = other match {
    case o : MyAccumulator => res += o.res
    case _ => throw new UnsupportedOperationException(
      s"Cannot merge ${this.getClass.getName} with ${other.getClass.getName}")
  }

  override def copy(): MyAccumulator = {
    val newMyAcc = new MyAccumulator
    newMyAcc.res = this.res
    newMyAcc
  }

  override def value: String = res

  override def add(v: String): Unit = res += v +"-"

  override def reset(): Unit = res = ""
}


```

自定义累加器的使用

```Scala
package lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulator_2

import org.apache.spark.{SparkConf, SparkContext}

object MyAccumulator_Test {
  def main(args: Array[String]) {
    val conf = new SparkConf().setAppName("MyAccumulator_Test").setMaster("local[2]")
    val sc = new SparkContext(conf)

    val myAcc = new MyAccumulator
    sc.register(myAcc,"myAcc")
    val numsRdd = sc.parallelize(Array("1","2","3","4","5","6","7","8")) //MyAccumulator(id: 0, name: Some(myAcc), value: 1-2-3-4-5-6-7-8-)
   // val numsRdd = sc.parallelize(Array("1","2","3","","5","6","7","8")) //MyAccumulator(id: 0, name: Some(myAcc), value: 1-2-3--5-6-7-8-)
    numsRdd.foreach(num => myAcc.add(num))
    println(myAcc)
    sc.stop()
  }
}

```
## Deploying to a Cluster 部署到集群[部署到集群-application submission](http://spark.apache.org/docs/2.2.0/submitting-applications.html)
The application submission guide describes how to submit applications to a cluster. In short, once you package your application into a JAR (for Java/Scala) or a set of .py or .zip files (for Python), the bin/spark-submit script lets you submit it to any supported cluster manager.

```Scala

应用程序提交指南介绍了如何将应用程序提交到群集。简而言之，将应用程序打包为JAR（用于Java / Scala）或一组.py或.zip文件（用于Python）后，bin / spark-submit脚本可让您将其提交给任何受支持的集群管理器。
```

## Launching Spark jobs from Java / Scala

The [org.apache.spark.launcher](http://spark.apache.org/docs/2.2.0/api/java/index.html?org/apache/spark/launcher/package-summary.html) package provides classes for launching Spark jobs as child processes using a simple Java API.
```

org.apache.spark.launcher包提供了使用简单的Java API作为子进程启动Spark作业的类
```
部分代码如下：
```

  import org.apache.spark.launcher.SparkAppHandle;
  import org.apache.spark.launcher.SparkLauncher;

  public class MyLauncher {
    public static void main(String[] args) throws Exception {
      SparkAppHandle handle = new SparkLauncher()
        .setAppResource("/my/app.jar")
        .setMainClass("my.spark.app.Main")
        .setMaster("local")
        .setConf(SparkLauncher.DRIVER_MEMORY, "2g")
        .startApplication();
      // Use handle API to monitor / control application.
    }
  }



It's also possible to launch a raw child process, using the SparkLauncher.launch() method:


  import org.apache.spark.launcher.SparkLauncher;

  public class MyLauncher {
    public static void main(String[] args) throws Exception {
      Process spark = new SparkLauncher()
        .setAppResource("/my/app.jar")
        .setMainClass("my.spark.app.Main")
        .setMaster("local")
        .setConf(SparkLauncher.DRIVER_MEMORY, "2g")
        .launch();
      spark.waitFor();
    }
  }


```

## unit Testing （单元测试）
Spark is friendly to unit testing with any popular unit test framework. Simply create a SparkContext in your test with the master URL set to local, run your operations, and then call SparkContext.stop() to tear it down. Make sure you stop the context within a finally block or the test framework’s tearDown method, as Spark does not support two contexts running concurrently in the same program.
译文：
```
Spark对任何流行的单元测试框架的单元测试都很友善。只需在您的测试中创建一个SparkContext，将主URL设置为本地，运行您的操作，然后调用SparkContext.stop（）将其拆分。确保停止finally块或测试框架的tearDown方法中的上下文，因为Spark不支持在同一程序中同时运行的两个上下文。
```
## 从这里开始

Where to Go from Here

You can see some example Spark programs on the Spark website. In addition, Spark includes several samples in the examples directory (Scala, Java, Python, R). You can run Java and Scala examples by passing the class name to Spark’s bin/run-example script; for instance:

./bin/run-example SparkPi

For Python examples, use spark-submit instead:

./bin/spark-submit examples/src/main/python/pi.py

For R examples, use spark-submit instead:

./bin/spark-submit examples/src/main/r/dataframe.R


---

You can see some [example Spark programs](http://spark.apache.org/examples.html) on the Spark website. In addition, Spark includes several samples in the examples directory (Scala, Java, Python, R). You can run Java and Scala examples by passing the class name to Spark’s bin/run-example script; for instance:

下面是官网案例：
wordcount
在本例中，我们使用一些转换来构建一个名为count的(String, Int)对的数据集，然后将其保存到一个文件中。
```
val textFile = sc.textFile("hdfs://...")
val counts = textFile.flatMap(line => line.split(" "))
                 .map(word => (word, 1))
                 .reduceByKey(_ + _)
counts.saveAsTextFile("hdfs://...")
```
2-
Spark还可以用于计算密集型任务。这个代码通过“投掷飞镖”在一个圆圈来估计π。我们选择单位平方（（0,0）到（1,1））中的随机点，并查看单位圆中有多少个下降点。分数应该是π/ 4，所以我们用它来得到我们的估计。

```Scala
val count = sc.parallelize(1 to NUM_SAMPLES).filter { _ =>
  val x = math.random
  val y = math.random
  x*x + y*y < 1
}.count()
println(s"Pi is roughly ${4.0 * count / NUM_SAMPLES}")
```
3- DataFrame api

在Spark中，DataFrame是组织为命名列的分布式数据集合。用户可以使用DataFrame API在外部数据源和Spark的内置分布式集合上执行各种关系操作，而无需提供处理数据的特定过程。另外，基于DataFrame API的程序也会通过Spark的内置优化器Catalyst自动优化。
在本例中，我们将在日志文件中搜索错误消息。

```Scala
val textFile = sc.textFile("hdfs://...")

// Creates a DataFrame having a single column named "line"
val df = textFile.toDF("line")
val errors = df.filter(col("line").like("%ERROR%"))
// Counts all the errors
errors.count()
// Counts errors mentioning MySQL
errors.filter(col("line").like("%MySQL%")).count()
// Fetches the MySQL errors as an array of strings
errors.filter(col("line").like("%MySQL%")).collect()

```

4- Simple Data Operations 简单的数据操作

在本例中，我们读取存储在数据库中的表，并计算每个年龄的人数。最后，我们将计算结果保存到JSON格式的S3中。示例中使用了一个简单的MySQL表“people”，该表有两列“name”和“age”。

```Scala
// Creates a DataFrame based on a table named "people"
// stored in a MySQL database.
val url =
  "jdbc:mysql://yourIP:yourPort/test?user=yourUsername;password=yourPassword"
val df = sqlContext
  .read
  .format("jdbc")
  .option("url", url)
  .option("dbtable", "people")
  .load()

// Looks the schema of this DataFrame.
df.printSchema()

// Counts people by age
val countsByAge = df.groupBy("age").count()
countsByAge.show()

// Saves countsByAge to S3 in the JSON format.
countsByAge.write.format("json").save("s3a://...")
```
##  MLlib 案例
MLlib, Spark’s Machine Learning (ML) library, provides many distributed ML algorithms. These algorithms cover tasks such as feature extraction, classification, regression, clustering, recommendation, and more. MLlib also provides tools such as ML Pipelines for building workflows, CrossValidator for tuning parameters, and model persistence for saving and loading models.

译文：
```

Spark的机器学习（ML）库MLlib提供了许多分布式ML算法。这些算法涵盖诸如特征提取，分类，回归，聚类，推荐等任务。 MLlib还提供了用于构建工作流的ML管道，用于调整参数的CrossValidator以及用于保存和加载模型的模型持久性等工具。
```
### Prediction with Logistic Regression 逻辑回归预测

In this example, we take a dataset of labels and feature vectors. We learn to predict the labels from feature vectors using the Logistic Regression algorithm.
```

在这个例子中，我们采用标签和特征向量的数据集。我们学习使用Logistic回归算法预测特征向量中的标签。
```

```Scala
// Every record of this DataFrame contains the label and //这个DataFrame的每一个记录都包含标签
// features represented by a vector. // 由一个向量表示的特征。
val df = sqlContext.createDataFrame(data).toDF("label", "features")

// Set parameters for the algorithm.(算法的设置参数)
// Here, we limit the number of iterations to 10.(现在设置迭代次数为10)
val lr = new LogisticRegression().setMaxIter(10)

// Fit the model to the data.（将模型与数据相匹配。）
val model = lr.fit(df)

// Inspect the model: get the feature weights.（检查模型：获得特征权重。）
val weights = model.weights

// Given a dataset, predict each point's label, and show the results.（给定一个数据集，预测每个点的标签，并显示结果。）
model.transform(df).show()

```

Additional Examples

Many additional examples are distributed with Spark:

    Basic Spark: Scala examples, Java examples, Python examples
    Spark Streaming: Scala examples, Java examples
