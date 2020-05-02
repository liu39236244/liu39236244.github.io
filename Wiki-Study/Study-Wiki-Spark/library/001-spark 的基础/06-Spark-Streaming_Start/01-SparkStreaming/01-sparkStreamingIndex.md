# SparkStreaming 流失数据 [官网地址](http://spark.apache.org/docs/2.2.0/streaming-programming-guide.html)

## 给予spark2.2

# Overview

Spark Streaming is an extension of the core Spark API that enables scalable, high-throughput, fault-tolerant stream processing of live data streams. Data can be ingested from many sources like Kafka, Flume, Kinesis, or TCP sockets, and can be processed using complex algorithms expressed with high-level functions like map, reduce, join and window. Finally, processed data can be pushed out to filesystems, databases, and live dashboards. In fact, you can apply Spark’s [machine learning](http://spark.apache.org/docs/2.2.0/ml-guide.html) and [graph processing](http://spark.apache.org/docs/2.2.0/graphx-programming-guide.html) algorithms on data streams.
译文：

```
Spark流是核心Spark API的扩展，它支持可伸缩、高吞吐量、容错流处理实时数据流。数据可以从诸如Kafka、Flume、Kinesis或TCP套接字之类的许多来源中获取，并且可以使用复杂的算法来处理，这些算法可以通过像map、reduce、join和window这样的高级功能来表达。最后，可以将处理过的数据推送到文件系统、数据库和实时指示板。实际上，您可以在数据流上应用Spark的机器学习和图形处理算法。
```

![spark Streaming 图示](assets/001/20180511-9ec10683.png)  

Internally, it works as follows. Spark Streaming receives live input data streams and divides the data into batches, which are then processed by the Spark engine to generate the final stream of results in batches.
译文：

```

在内部，它的工作原理如下。 Spark Streaming接收实时输入数据流并将数据分成批，然后由Spark引擎处理，以批量生成最终结果流。
```

![数据原理](assets/001/20180511-f65fc223.png)  






Spark Streaming provides a high-level abstraction called discretized stream or DStream, which represents a continuous stream of data. DStreams can be created either from input data streams from sources such as Kafka, Flume, and Kinesis, or by applying high-level operations on other DStreams. Internally, a DStream is represented as a sequence of [RDDs](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.RDD)
译文：
```
Spark Streaming提供了一个高层抽象，称为离散流或DStream，它表示连续的数据流。 DStream可以通过Kafka，Flume和Kinesis等来源的输入数据流创建，也可以通过在其他DStream上应用高级操作来创建。在内部，DStream表示为一系列RDD。

```
This guide shows you how to start writing Spark Streaming programs with DStreams. You can write Spark Streaming programs in Scala, Java or Python (introduced in Spark 1.2), all of which are presented in this guide. You will find tabs throughout this guide that let you choose between code snippets of different languages.
译文：
```
本指南将向您介绍如何开始使用DStream编写Spark Streaming程序。您可以使用Scala，Java或Python（Spark 1.2中引入）编写Spark Streaming程序，所有这些都在本指南中介绍。您将在本指南中找到标签，让您在不同语言的代码片段之间进行选择。
```

Note: There are a few APIs that are either different or not available in Python. Throughout this guide, you will find the tag Python API highlighting these differences.
```
注意：Python中有一些或者不同或者不可用的API。在本指南中，您将找到标记Python API来突出显示这些差异。
```

## A Quick Example

Before we go into the details of how to write your own Spark Streaming program, let’s take a quick look at what a simple Spark Streaming program looks like. Let’s say we want to count the number of words in text data received from a data server listening on a TCP socket. All you need to do is as follows.
译文：
```
在介绍如何编写自己的Spark Streaming程序的细节之前，让我们快速了解一下简单的Spark Streaming程序的外观。假设我们想要统计从侦听TCP套接字的数据服务器接收到的文本数据中的单词数量。你需要做的只是如下。
```

### 第一个程序

First, we import the names of the Spark Streaming classes and some implicit conversions from StreamingContext into our environment in order to add useful methods to other classes we need (like DStream). StreamingContext is the main entry point for all streaming functionality. We create a local StreamingContext with two execution threads, and a batch interval of 1 second.
译文：
```

首先，我们将Spark Streaming类的名称和一些来自StreamingContext的隐式转换导入到我们的环境中，以便为我们需要的其他类（如DStream）添加有用的方法。 StreamingContext是所有流媒体功能的主要入口点。我们使用两个执行线程创建一个本地StreamingContext，批处理间隔为1秒。
```


### 依赖的导入

```xml
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming_2.11</artifactId>
    <version>2.2.0</version>
</dependency>
```

Using this context, we can create a DStream that represents streaming data from a TCP source, specified as hostname (e.g. localhost) and port

### 先安装 nc

```

    /**
      * 在计算机上免安装 nc netcat ，
      * yum install -y nc
      * nc -lk 9999
      *
      * 然后输入信息，在其另外一个终端
      *
      * nc ip:9999
      */
```


### Basic Concepts

Next, we move beyond （超越）the simple example and elaborate（复杂） on the basics of Spark Streaming.

### Linking

Similar to Spark, Spark Streaming is available through Maven Central. To write your own Spark Streaming program, you will have to add the following dependency to your SBT or Maven project.
就是导入依赖包：
```xml
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming_2.11</artifactId>
    <version>2.2.0</version>
</dependency>
```

For ingesting data from sources like Kafka, Flume, and Kinesis that are not present in the Spark Streaming core API, you will have to add the corresponding artifact spark-streaming-xyz_2.11 to the dependencies. For example, some of the common ones are as follows.

| Source |	Artifact |
| :------------- | :------------- |
|Kafka |	spark-streaming-kafka-0-8_2.11|
| Flume | 	spark-streaming-flume_2.11|
| Kinesis|spark-streaming-kinesis-asl_2.11 [Amazon Software License]|


## Initializing StreamingContext

To initialize a Spark Streaming program, a StreamingContext object has to be created which is the main entry point of all Spark Streaming functionality.

A StreamingContext object can be created from a SparkConf object.

```Scala

import org.apache.spark._
import org.apache.spark.streaming._

val conf = new SparkConf().setAppName(appName).setMaster(master)
val ssc = new StreamingContext(conf, Seconds(1))

```


```
appName参数是您的应用程序在集群UI上显示的名称。 master是Spark，Mesos或YARN群集URL[地址](http://spark.apache.org/docs/2.2.0/submitting-applications.html#master-urls)，或者是以本地模式运行的特殊“本地[*]”字符串。实际上，在群集上运行时，您不会希望在程序中对主机进行硬编码，而是使用spark-submit启动应用程序并在其中接收它。但是，对于本地测试和单元测试，您可以通过“本地[*]”运行进程内的Spark Streaming（检测本地系统中的核心数量）。请注意，这在内部创建了一个SparkContext（所有Spark功能的起点），它可以作为ssc.sparkContext被访问。

批处理间隔必须根据应用程序和可用群集资源的延迟要求来设置。有关更多详细信息，请参阅性能调整部分。

```

```Scala
import org.apache.spark.streaming._

val sc = ...                // existing SparkContext
val ssc = new StreamingContext(sc, Seconds(1))

```


* After a context is defined, you have to do the following.

```
Define the input sources by creating input DStreams.
Define the streaming computations by applying transformation and output operations to DStreams.
Start receiving data and processing it using streamingContext.start().
Wait for the processing to be stopped (manually or due to any error) using streamingContext.awaitTermination().
The processing can be manually stopped using streamingContext.stop().
```

翻译：

    通过创建输入DStream来定义输入源。
    通过将转换和输出操作应用于DStream来定义流式计算。
    开始接收数据并使用streamingContext.start（）处理它。
    等待使用streamingContext.awaitTermination（）停止处理（手动或由于任何错误）。
    可以使用streamingContext.stop（）手动停止处理。


* Points to remember:( 注意问题)

```
Once a context has been started, no new streaming computations can be set up or added to it.
Once a context has been stopped, it cannot be restarted.
Only one StreamingContext can be active in a JVM at the same time.
stop() on StreamingContext also stops the SparkContext. To stop only the StreamingContext, set the optional parameter of stop() called stopSparkContext to false.
A SparkContext can be re-used to create multiple StreamingContexts, as long as the previous StreamingContext is stopped (without stopping the SparkContext) before the next StreamingContext is created.

译文：

一旦上下文已经启动，就不能建立或添加新的流式计算。
一旦上下文被停止，它就不能被重新启动。
同时只有一个StreamingContext可以在JVM中处于活动状态。
StreamingContext上的stop（）也会停止SparkContext。要仅停止StreamingContext，请将stop（）的可选参数stopSparkContext设置为false。
只要先前的StreamingContext在创建下一个StreamingContext之前停止（不停止SparkContext），就可以重新使用SparkContext来创建多个StreamingContext。
```


## Discretized Streams (DStreams) 离散流

Discretized Stream or DStream is the basic abstraction provided by Spark Streaming. It represents（代表） a continuous stream of data, either the input data stream received from source, or the processed（处理） data stream generated（使产生） by transforming the input stream. Internally, a DStream is represented by a continuous series of RDDs, which is Spark’s abstraction of an immutable, distributed dataset (see Spark Programming Guide for more details). Each RDD in a DStream contains data from a certain interval, as shown in the following figure.

译文：
```

离散流或DStream是Spark Streaming提供的基本抽象。它表示连续的数据流，即从源接收的输入数据流或通过转换输入流生成的已处理数据流。在内部，DStream由连续的RDD系列表示，这是Spark对不可变的分布式数据集的抽象（有关更多详细信息，请参阅Spark Programming Guide）。 DStream中的每个RDD都包含来自特定时间间隔的数据，如下图所示。
```

![连续的rdd](assets/001/20180511-5b072fed.png)  

Any operation applied on a DStream translates to operations on the underlying RDDs. For example, in the earlier example of converting a stream of lines to words, the flatMap operation is applied on each RDD in the lines DStream to generate the RDDs of the words DStream. This is shown in the following figure.
译文：
```
在DStream上应用的任何操作都会转化为对基础RDD的操作。例如，在前面将线路流转换为单词的示例中，flatMap操作应用于DStream行中的每个RDD，以生成单词DStream的RDD。这在下图中显示。
```


![如图所示](assets/001/20180511-7249013c.png)  

These underlying RDD transformations are computed by the Spark engine. The DStream operations hide most of these details and provide the developer with a higher-level API for convenience. These operations are discussed in detail in later sections.
译文：
```

这些基础RDD转换由Spark引擎计算。 DStream操作隐藏了大部分这些细节，并为开发人员提供了更高级别的API以方便使用。这些操作将在后面的章节中详细讨论。
```

## Input DStreams and Receivers



Input DStreams are DStreams representing the stream of input data received from streaming sources. In the quick example, lines was an input DStream as it represented the stream of data received from the netcat server. Every input DStream (except file stream, discussed later in this section) is associated with a Receiver (Scala doc, Java doc) object which receives the data from a source and stores it in Spark’s memory for processing.
译文：
```

输入DStreams是DStreams，表示从流源接收到的输入数据流。在这个快速示例中，行是一个输入DStream，因为它表示从netcat服务器接收到的数据流。每个输入DStream（本节稍后讨论的文件流除外）都与Receiver（Scala doc，Java doc）对象相关联，该对象从源接收数据并将其存储在Spark的内存中进行处理。
```

Spark Streaming provides two categories of built-in streaming sources. 创建streaming source 的两种方式

    1-Basic sources: Sources directly available in the StreamingContext API. Examples: file systems, and socket connections.(
基本来源：StreamingContext API中直接可用的来源。示例：文件系统和套接字连接。)
    2-Advanced sources: Sources like Kafka, Flume, Kinesis, etc. are available through extra utility classes. These require linking against extra dependencies as discussed in the linking section.(
高级来源：可通过额外的实用程序课程获得Kafka，Flume，Kinesis等来源。这些要求链接部分中讨论的额外依赖关系。)

* We are going to discuss some of the sources present in each category later in this section.

Note that, if you want to receive multiple streams of data in parallel in your streaming application, you can create multiple input DStreams (discussed further in the Performance Tuning section). This will create multiple receivers which will simultaneously receive multiple data streams. But note that a Spark worker/executor is a long-running task, hence it occupies one of the cores allocated to the Spark Streaming application. Therefore, it is important to remember that a Spark Streaming application needs to be allocated enough cores (or threads, if running locally) to process the received data, as well as to run the receiver(s).
译文：

```

请注意，如果您想在流式传输应用程序中并行接收多个数据流，则可以创建多个输入DStream（在性能调整部分中进一步讨论）。这将创建多个接收器，它将同时接收多个数据流。但请注意，Spark worker / executor是一项长期运行的任务，因此它占用了分配给Spark Streaming应用程序的核心之一。因此，重要的是要记住，Spark Streaming应用程序需要分配足够的内核（或线程，如果在本地运行）来处理接收到的数据以及运行接收器。
```


* Points to remember

```
When running a Spark Streaming program locally, do not use “local” or “local[1]” as the master URL. Either of these means that only one thread will be used for running tasks locally. If you are using an input DStream based on a receiver (e.g. sockets, Kafka, Flume, etc.), then the single thread will be used to run the receiver, leaving no thread for processing the received data. Hence, when running locally, always use “local[n]” as the master URL, where n > number of receivers to run (see Spark Properties for information on how to set the master).
译文：
在本地运行Spark Streaming程序时，请勿使用“local”或“local [1]”作为主URL。这两者中的任何一个意味着只有一个线程将用于本地运行任务。如果您使用的是基于接收器的输入DStream（例如套接字，Kafka，Flume等），那么将使用单线程来运行接收器，而不用处理接收到的数据的线程。因此，在本地运行时，请始终使用“local [n]”作为主URL，其中n>要运行的接收器的数量（有关如何设置主站的信息，请参阅Spark Properties）。

Extending the logic to running on a cluster, the number of cores allocated to the Spark Streaming application must be more than the number of receivers. Otherwise the system will receive data, but not be able to process it.
译文：
将逻辑扩展到在群集上运行，分配给Spark Streaming应用程序的内核数量必须多于接收器的数量。否则系统将接收数据，但无法处理它。

```

### Basic Sources

We have already taken a look at the ssc.socketTextStream(...) in the quick example which creates a DStream from text data received over a TCP socket connection. Besides sockets, the StreamingContext API provides methods for creating DStreams from files as input sources.
译文：
```
我们已经在快速示例中查看了ssc.socketTextStream（...），该示例根据通过TCP套接字连接接收的文本数据创建一个DStream。除了套接字之外，StreamingContext API还提供了从文件创建DStream作为输入源的方法。
```

* File Streams: For reading data from files on any file system compatible with the HDFS API (that is, HDFS, S3, NFS, etc.), a DStream can be created as:（文件流：为了从与HDFS API兼容的任何文件系统（即HDFS，S3，NFS等）的文件中读取数据，可以创建DStream为：）

```Scala
  streamingContext.fileStream[KeyClass, ValueClass, InputFormatClass](dataDirectory)
```

Spark Streaming will monitor the directory dataDirectory and process any files created in that directory (files written in nested directories not supported). Note that(Spark Streaming将监视目录dataDirectory并处理在该目录中创建的所有文件（以不支持的嵌套目录编​​写的文件）。注意)


```
* The files must have the same data format.
* The files must be created in the dataDirectory by atomically moving or renaming them into the data directory.(这些文件必须通过原子地移动或重命名到data目录中来在dataDirectory中创建)
*Once moved, the files must not be changed. So if the files are being continuously appended, the new data will not be read. (一旦移动，文件不得更改。所以如果文件被连续追加，新的数据将不会被读取。)

* For simple text files, there is an easier method ```streamingContext.textFileStream(dataDirectory)```. And file streams do not require running a receiver(接收器), hence does not require allocating cores.（
对于简单的文本文件，有一个更简单的方法streamingContext.textFileStream（dataDirectory）。文件流不需要运行接收器，因此不需要分配内核。）

* Python API fileStream is not available in the Python API, only textFileStream is available.

```

* Streams based on Custom Receivers:
DStreams can be created with data streams received through custom receivers. See the [Custom Receiver Guide](http://spark.apache.org/docs/2.2.0/streaming-custom-receivers.html) for more details.(可以使用通过自定义接收器接收的数据流创建DStream。有关更多详细信息，请参阅“自定义接收器指南)

* Queue of RDDs as a Stream:
 For testing a Spark Streaming application with test data, one can also create a DStream based on a queue of RDDs, using streamingContext.queueStream(queueOfRDDs). Each RDD pushed into the queue will be treated as a batch of data in the DStream, and processed like a stream.(将RDD排队为Stream：为了使用测试数据测试Spark Streaming应用程序，还可以使用streamingContext.queueStream（queueOfRDDs）基于RDD队列创建DStream。被推入队列的每个RDD将被视为DStream中的一批数据，并像流一样进行处理。)

 For more details on streams from sockets and files, see the API documentations of the relevant functions in StreamingContext for Scala, JavaStreamingContext for Java, and StreamingContext for Python.(
有关来自套接字和文件的流的更多详细信息，请参阅Scala的StreamingContext中的相关函数的API文档，Java的JavaStreamingContext和Python中的StreamingContext。)

### Advanced Sources

Python API As of Spark 2.2.0, out of these sources, Kafka, Kinesis and Flume are available in the Python API.

This category of sources require interfacing with external non-Spark libraries, some of them with complex dependencies (e.g., Kafka and Flume). Hence, to minimize issues related to version conflicts of dependencies, the functionality to create DStreams from these sources has been moved to separate libraries that can be linked to explicitly when necessary.

译文：
```
这类资源需要与外部非Spark类库进行交互，其中一些库具有复杂的依赖关系（例如，Kafka和Flume）。因此，为了尽量减少与依赖关系版本冲突相关的问题，从这些源创建DStream的功能已移至单独的库，可以在必要时明确链接到这些库。
```

Note that these advanced sources are not available in the Spark shell, hence applications based on these advanced sources cannot be tested in the shell. If you really want to use them in the Spark shell you will have to download the corresponding Maven artifact’s JAR along with its dependencies and add it to the classpath.
译文：
```
请注意，这些高级源在Spark shell中不可用，因此无法在shell中测试基于这些高级源的应用程序。如果你真的想在Spark shell中使用它们，你将不得不下载相应的Maven工件的JAR及其依赖关系，并将它添加到类路径中。
```
Some of these advanced sources are as follows.

```
Kafka: Spark Streaming 2.2.0 is compatible with Kafka broker versions 0.8.2.1 or higher. See the Kafka Integration Guide for more details.

Flume: Spark Streaming 2.2.0 is compatible with Flume 1.6.0. See the Flume Integration Guide for more details.

Kinesis: Spark Streaming 2.2.0 is compatible with Kinesis Client Library 1.2.1. See the Kinesis Integration Guide for more details.

```


### Custom Sources

Python API This is not yet supported in Python.

Input DStreams can also be created out of custom data sources. All you have to do is implement a user-defined receiver (see next section to understand what that is) that can receive data from the custom sources and push it into Spark. See the [Custom Receiver Guide](http://spark.apache.org/docs/2.2.0/streaming-custom-receivers.html) for details.



* Receiver Reliability (接收器的可靠性)

There can be two kinds of data sources based on their reliability（可靠性）. Sources (like Kafka and Flume) allow the transferred（转移的） data to be acknowledged（公认的）. If the system receiving data from these reliable sources acknowledges the received data correctly, it can be ensured that no data will be lost due to any kind of failure. This leads to two kinds of receivers:
译文：
```
根据可靠性（可靠性），可以有两种数据源。来源（如Kafka和Flume）允许转移的数据被确认（公认的）。如果从这些可靠来源接收数据的系统正确地确认接收到的数据，则可以确保不会由于任何类型的故障而丢失数据。这导致两种接收器：
```

```
1. Reliable Receiver - A reliable receiver correctly sends acknowledgment to a reliable source when the data has been received and stored in Spark with replication.（
可靠的接收器 - 当数据已被接收并存储在具有复制功能的Spark中时，可靠的接收器正确地向可靠的源发送确认。）

2. Unreliable Receiver - An unreliable receiver does not send acknowledgment to a source. This can be used for sources that do not support acknowledgment, or even for reliable sources when one does not want or need to go into the complexity of acknowledgment.（
不可靠的接收器 - 不可靠的接收器不会向源发送确认。这可以用于不支持确认的来源，或者用于不希望或不需要进行确认复杂性的可靠来源。）
```

The details of how to write a reliable receiver are discussed in the [Custom Receiver Guide](http://spark.apache.org/docs/2.2.0/streaming-custom-receivers.html).


## Transformations on DStreams

Similar to that of RDDs, transformations allow the data from the input DStream to be modified. DStreams support many of the transformations available on normal Spark RDD’s. Some of the common ones are as follows.

|Transformation|	Meaning|译文|
| :------------- | :------------- | :---:|
|map(func) |Return a new DStream by passing each element of the source DStream through a function func. |返回一个新的DStream，通过函数func传递源DStream的每个元素。|
|flatMap(func) |Similar to map, but each input item can be mapped to 0 or more output items. |类似于map，但是每个输入项可以映射到0或更多的输出项。|
|filter(func) |Return a new DStream by selecting only the records of the source DStream on which func returns true|通过只选择源DStream的记录返回一个新的DStream, func返回true。|
|repartition(numPartitions) | 	Changes the level of parallelism in this DStream by creating more or fewer partitions. |通过创建更多或更少的分区来改变这个DStream中的并行度。|
|union(otherStream) |Return a new DStream that contains the union of the elements in the source DStream and otherDStream. |返回一个新的DStream，它包含源DStream和otherDStream中元素的联合。|
|count() |Return a new DStream of single-element RDDs by counting the number of elements in each RDD of the source DStream. |通过计算源DStream的每个RDD中元素的数量，返回一个新的单元素RDDs的DStream。|
|reduce(func) |Return a new DStream of single-element RDDs by aggregating the elements in each RDD of the source DStream using a function func (which takes two arguments and returns one). The function should be associative and commutative so that it can be computed in parallel. |通过使用函数func将源DStream的每个RDD中的元素聚合起来，返回一个新的DStream(单元素RDDs)(它需要两个参数并返回一个参数)。函数应该是相联的和可交换的，这样就可以并行计算了。|
|countByValue() | 	When called on a DStream of elements of type K, return a new DStream of (K, Long) pairs where the value of each key is its frequency in each RDD of the source DStream. |当调用类型K的DStream时，返回一个新的DStream (K, Long)对，其中每个键的值是源DStream的每个RDD中的频率。|
|reduceByKey(func, [numTasks]) |When called on a DStream of (K, V) pairs, return a new DStream of (K, V) pairs where the values for each key are aggregated using the given reduce function. Note: By default, this uses Spark's default number of parallel tasks (2 for local mode, and in cluster mode the number is determined by the config property spark.default.parallelism) to do the grouping. You can pass an optional numTasks argument to set a different number of tasks.|
当在（K，V）对的DStream上调用时，返回一个新的（K，V）对的DStream，其中每个键的值使用给定的reduce函数进行聚合。注意：默认情况下，它使用Spark的默认并行任务数（2表示本地模式，而在集群模式下，数字由config属性spark.default.parallelism决定）进行分组。您可以传递一个可选的numTasks参数来设置不同数量的任务。|
|join(otherStream, [numTasks]) |When called on two DStreams of (K, V) and (K, W) pairs, return a new DStream of (K, (V, W)) pairs with all pairs of elements for each key. |当调用两个DStreams (K, V)和(K, W)对时，返回一个新的DStream (K， (V, W))对每个键的所有对元素|
|cogroup(otherStream, [numTasks]) |When called on a DStream of (K, V) and (K, W) pairs, return a new DStream of (K, Seq[V], Seq[W]) tuples.|当调用DStream (K, V)和(K, W)对时，返回一个新的DStream (K, Seq[V]， Seq[W])元组。|
|transform(func) | 	Return a new DStream by applying a RDD-to-RDD function to every RDD of the source DStream. This can be used to do arbitrary RDD operations on the DStream. |通过将RDD-to-RDD函数应用到源DStream的每个RDD，返回一个新的DStream。这可以用于在DStream上执行任意的RDD操作。|
|updateStateByKey(func) | 	Return a new "state" DStream where the state for each key is updated by applying the given function on the previous state of the key and the new values for the key. This can be used to maintain arbitrary state data for each key.|返回一个新的“状态”DStream，其中每个键的状态通过在键的前一个状态和键的新值上应用给定的函数来更新。这可以用来为每个键维护任意的状态数据。|

A few of these transformations are worth discussing in more detail.(其中的一些转换值得详细讨论。)

### UpdateStateByKey Operation

The updateStateByKey operation allows you to maintain arbitrary state while continuously updating it with new information. To use this, you will have to do two steps.(
updateStateByKey操作允许您保持任意状态，同时不断用新信息更新它。要使用此功能，您必须执行两个步骤)

```
1- Define the state - The state can be an arbitrary(任意的数据类型) data type.

2- Define the state update function - Specify with a function how to update the state using the previous state and the new values from an input stream. （使用函数指定如何使用之前的状态更新状态以及输入流中的新值。）

```

In every batch, Spark will apply the state update function for all existing keys, regardless（不管不问） of whether they have new data in a batch or not. If the update function returns None then the key-value pair will be eliminated（除去）.
（
在每个批次中，Spark将为所有现有key应用状态更新功能，而不管它们是否具有批处理中的新数据。如果更新函数返回None，那么将取消键值对。）
Let’s illustrate this with an example. Say you want to maintain a running count of each word seen in a text data stream. Here, the running count is the state and it is an integer. We define the update function as:（
我们用一个例子来说明这一点。假设你想保持文本数据流中每个单词的运行次数。这里，运行计数是状态，它是一个整数。我们将更新函数定义为：）



```Scala
def updateFunction(newValues: Seq[Int], runningCount: Option[Int]): Option[Int] = {
    val newCount = ...  // add the new values with the previous running count to get the new count
    Some(newCount)
}

```

This is applied on a DStream containing words (say, the pairs DStream containing (word, 1) pairs in the earlier example).(这是在包含单词的DStream上应用的(例如，在前面的示例中，对包含(word, 1)对的对DStream)。)

```Scala
val runningCounts = pairs.updateStateByKey[Int](updateFunction _)

```

The update function will be called for each word, with newValues having a sequence of 1’s (from the (word, 1) pairs) and the runningCount having the previous count.

Note that using updateStateByKey requires the checkpoint directory to be configured, which is discussed in detail in the checkpointing section.


## Transform Operation [连接](http://spark.apache.org/docs/2.2.0/streaming-programming-guide.html#transform-operation)
