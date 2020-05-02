# spark 中组建介绍

# 1-spark work executer task master 的关系

## 1-1 图解关系

### 1 master worker task 图解关系
* 1.1 满意的图解关系
尊重原创原文地址不可少: [https://blog.csdn.net/wiborgite/article/details/77750293](https://blog.csdn.net/wiborgite/article/details/77750293)

![master worker等的关系](assets/001/20180726-d6ac2375.png)  

* 1.2 文字说明：

```
每个Worker上存在一个或者多个ExecutorBackend 进程。每个进程包含一个Executor对象，该对象持有一个线程
池，每个线程可以执行一个task。
每个application包含一个 driver 和多个 executors，每个 executor里面运行的tasks都属于同一个application。
每个Worker上存在一个或者多个ExecutorBackend 进程。
每个进程包含一个Executor对象，该对象持有一个线程池，每个线程可以执行一个task。
```

#### 图解关系汇总


---

### 2 Spark中Task，Partition，RDD、节点数、Executor数、core数目的关系和Application，Driver，Job，Task，Stage理解

原文地址；[https://blog.csdn.net/u013013024/article/details/72876427]


* 简单介绍：

```
输入可能以多个文件的形式存储在HDFS上，每个File都包含了很多块，称为Block。
当Spark读取这些文件作为输入时，会根据具体数据格式对应的InputFormat进行解析，一般是将若干个Block合并成一个输入分片，称为InputSplit，注意InputSplit不能跨越文件。
随后将为这些输入分片生成具体的Task。InputSplit与Task是一一对应的关系。
随后这些具体的Task每个都会被分配到集群上的某个节点的某个Executor去执行。
每个节点可以起一个或多个Executor。
每个Executor由若干core组成，每个Executor的每个core一次只能执行一个Task。
每个Task执行的结果就是生成了目标RDD的一个partiton。
注意: 这里的core是虚拟的core而不是机器的物理CPU核，可以理解为就是Executor的一个工作线程。

而 Task被执行的并发度 = Executor数目 * 每个Executor核数。

至于partition的数目：

对于数据读入阶段，例如sc.textFile，输入文件被划分为多少InputSplit就会需要多少初始Task。
在Map阶段partition数目保持不变。
在Reduce阶段，RDD的聚合会触发shuffle操作，聚合后的RDD的partition数目跟具体操作有关，例如repartition操作会聚合成指定分区数，还有一些算子是可配置的。
```

* 1Application

```
application（应用）其实就是用spark-submit提交的程序。比方说spark examples中的计算pi的SparkPi。一个application通常包含三部分：从数据源（比方说HDFS）取数据形成RDD，通过RDD的transformation和action进行计算，将结果输出到console或者外部存储（比方说collect收集输出到console）。
```


* 2 -Driver

 ```
 Spark中的driver感觉其实和yarn中Application Master的功能相类似。主要完成任务的调度以及和executor和cluster manager进行协调。有client和cluster联众模式。client模式driver在任务提交的机器上运行，而cluster模式会随机选择机器中的一台机器启动driver。从spark官网截图的一张图可以大致了解driver的功能。
 ```

 * 3- job

```

Spark中的Job和MR中Job不一样不一样。MR中Job主要是Map或者Reduce Job。而Spark的Job其实很好区别，一个action算子就算一个Job，比方说count，first等。
```

* 4- Task

```
Task是Spark中最新的执行单元。RDD一般是带有partitions的，每个partition的在一个executor上的执行可以认为是一个Task。
补充：一个文件中在hdfs上面被分为好多个文件快，一个文件快block 是一个文件分片，作为一个分区交给一个excuter 中的一个核 去执行，也就是一个task
```

* 5-Stage

```

Stage概念是spark中独有的。一般而言一个Job会切换成一定数量的stage。各个stage之间按照顺序执行。至于stage是怎么切分的，首选得知道spark论文中提到的narrow dependency(窄依赖)和wide dependency（ 宽依赖）的概念。其实很好区分，看一下父RDD中的数据是否进入不同的子RDD，如果只进入到一个子RDD则是窄依赖，否则就是宽依赖。宽依赖和窄依赖的边界就是stage的划分点
补充：一个stage是根据一个action算子划分的产生了shuffle，这里给出 spark 的一个宽债依赖的图解博主
宽依赖债依赖：https://www.jianshu.com/p/5c2301dfa360

```
