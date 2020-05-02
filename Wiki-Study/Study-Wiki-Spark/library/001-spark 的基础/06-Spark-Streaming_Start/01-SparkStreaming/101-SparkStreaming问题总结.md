# SparkStreaming 总结的问题

## spark Streaming中的StreamingContext 从spark 1.3 开始就不必须了

import org.apache.spark.streaming.StreamingContext._ // not necessary since Spark 1.3

## spark Streaming 提供了集中Streaming 源

```
Spark Streaming provides two categories of built-in streaming sources.

    Basic sources: Sources directly available in the StreamingContext API. Examples: file systems, and socket connections.
    Advanced sources: Sources like Kafka, Flume, Kinesis, etc. are available through extra utility classes. These require linking against extra dependencies as discussed in the linking section.
```

## Sparkstreming 定义URL的注意事项

```
When running a Spark Streaming program locally, do not use “local” or “local[1]” as the master URL. Either of these means that only one thread will be used for running tasks locally. If you are using an input DStream based on a receiver (e.g. sockets, Kafka, Flume, etc.), then the single thread will be used to run the receiver, leaving no thread for processing the received data. Hence, when running locally, always use “local[n]” as the master URL, where n > number of receivers to run (see Spark Properties for information on how to set the master).
译文：
在本地运行Spark Streaming程序时，请勿使用“local”或“local [1]”作为主URL。这两者中的任何一个意味着只有一个线程将用于本地运行任务。如果您使用的是基于接收器的输入DStream（例如套接字，Kafka，Flume等），那么将使用单线程来运行接收器，而不用处理接收到的数据的线程。因此，在本地运行时，请始终使用“local [n]”作为主URL，其中n>要运行的接收器的数量（有关如何设置主站的信息，请参阅Spark Properties）。

Extending the logic to running on a cluster, the number of cores allocated to the Spark Streaming application must be more than the number of receivers. Otherwise the system will receive data, but not be able to process it.
译文：
将逻辑扩展到在群集上运行，分配给Spark Streaming应用程序的内核数量必须多于接收器的数量。否则系统将接收数据，但无法处理它。

```
## spark Streaming   textFileStream 在 三种脚本中支持度


* advance source 在spark 2.2 中的支持
Python API As of Spark 2.2.0, out of these sources, Kafka, Kinesis and Flume are available in the Python API.

## Spark Streaming  advance source 需要 在shell中的话，则需要下载 maven 支持，jar包

```
Kafka: Spark Streaming 2.2.0 is compatible with Kafka broker versions 0.8.2.1 or higher. See the Kafka Integration Guide for more details.

Flume: Spark Streaming 2.2.0 is compatible with Flume 1.6.0. See the Flume Integration Guide for more details.

Kinesis: Spark Streaming 2.2.0 is compatible with Kinesis Client Library 1.2.1. See the Kinesis Integration Guide for more details.

```

## python api 不支持spark streaming 中的那些

```
* Python API fileStream is not available in the Python API, only textFileStream is available.
* Python API This is not yet supported in Python.
```
