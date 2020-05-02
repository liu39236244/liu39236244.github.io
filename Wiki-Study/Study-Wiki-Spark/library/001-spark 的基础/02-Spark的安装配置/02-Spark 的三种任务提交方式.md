# 本章节介绍Spark 的启动方式三种

---

## 相关博主


## 1-spark 相关方式简介[原文链接](https://blog.csdn.net/joy6331/article/details/51162044)

1、standlone模式  

这种模式是spark在做计算时候的一种独立模式，这种模式是为了让初学spark的人能更快的上手去开发spark作业和进行调试，其基本原理是：spark实际上自己实现了一套资源分配机制（类似yarn），在这种模式下需要部署一个spark集群，并在master上面用start-all.sh启动集群，这个时候我们就可以使用spark来运行作业了，提交作业的时候的地址应该是  --master spark://master:7077(默认7077端口)，这就是说把作业提交给master，然后我们可以在master:8080上面看到作业的相关信息。总的来说这种模式下的spark就是一个整体（只是指分布式计算方面，输入和输出还是可能要借助外部框架的，比如从hdfs读取文件等），可以自己分配资源，自己创建executor，自己玩。默认是client模式的spark集群

2、yarn-client模式

这种模式会使用yarn来进行资源的分配，而不再使用spark自身实现的资源分配机制了。具体的执行过程为：从客户端（执行发布作业动作的机器,比如eclipse、spark-submit命令等）发布作业到yarn，这里有一个地方要注意，需要把spark支持hadoop的那个包（这里是/lib/spark-assembly-1.6.1-hadoop2.6.0.jar）上传到hdfs的某个目录下面，因为这种模式下作业和standlon模式下的spark集群没有什么关系了，yarn不会把任务分配到spark集群中的（换句话说，我们在standlone模式下搭建的那个集群启动不启动跟它没鸟关系）而是分配到hadoop集群中的节点去计算，而这些hadoop节点没有spark运行的环境啊，这个时候就是靠着这个spark-assembly-1.6.1-hadoop2.6.0.jar包来以spark的模式跑作业的，所以我们在运行官方的那个spark-submit的时候，会看到有upload这个jar到hdfs的打印信息，应该是他会默认的把SPARK_HOME下的这个jar包上传到hdfs，当然我们也可以在手动上传该jar包到hdfs后，在job的代码中的SparkConf中设置一下“spark.yarn.jar”变量，告诉框架，你要的这个包我已经上传了，就在那，这样就不会上传了。下一步就是上传job的jar包了，等这个做完后，作业就开始运行了。

3、yarn-cluster模式

这种模式的基本执行过程与yarn-client基本一致，那区别在哪里，区别在于spark driver（也可以说sparkContext）在哪里运行，先说一下这个sparkContext，这是一个很重要的东西，它负责作业过程中任务调度，还有最后的结果处理，在这个作业的运行过程中要与executor交互的，在standlone模式下，spark driver是会放在某一个worker上；yarn-client模式下会放在客户端，也就是说在作业运行的过程中，客户端会与yarn集群不停的交互，直到结束；而yarn-cluster模式下，spark driver会跟application manager放在一起，也就是说，作业提交后，客户端就没屁事了，所有的都交给yarn集群了，包括怎么创建spark driver，创建在哪，那都是你yarn集群的事，客户端拍拍屁股就完工了，但这样客户端最终拿不到最后的结果，往往这种模式下的输出都会写到其他地方（比如hdfs等）。

如要要用standlone模式远程执行，只需要把--master后面的参数由yarn—client改成spark://xxxx:7077，提交任务方式就变了。成功后可以在master:8080上看到作业的信息。

---

### spark 启动方式

>[spark启动方式原文链接简书：俺是亮哥](https://www.jianshu.com/p/65a3476757a5)

 提交任务指定 API模式：
     spark-submit --master yarn-cluster
     SparkConf sparkConf = new SparkConf().setMaster("yarn-standalone").setAppName("JavaSparkPi");
#### 1-单机版 （local）


spark-submit 和 spark-submit --master local 效果是一样的

（同理：spark-shell 和 spark-shell --master local 效果是一样的）

spark-submit --master local[4] 代表会有4个线程（每个线程一个core）来并发执行应用程序。

#### 2-单机版模拟集群（local-cluster）
spark-submit --master local-cluster[2, 3, 1024] // 指定2个executor ，每个executor 有三个 core ，每个core 有1G 内存

#### 3-Spark自带Cluster Manager的Standalone Client模式（集群)（spark://master节点ip或主机名:7077）

这个时候如果用不到hdfs上面的文件，那么就不需要启动hadoop集群，spark自己的集群就够了，使用8080 端口可以查看资源执行过程！

提交任务之前需要开启spark集群
    start-all.sh 或者start-master.sh 、start-slave.sh -h hostname url:master
提交任务命令：
    spark-submit --master spark://wl1:7077
    或者 spark-submit --master spark://wl1:7077 --deploy-mode client

    提交任务之后，每个worker都会对应有一个sparksubmit进程

    Master进程做为cluster manager，用来对应用程序申请的资源进行管理；

    SparkSubmit 做为Client端和运行driver程序；

    CoarseGrainedExecutorBackend 用来并发执行应用程序；

    注意，Worker进程生成几个Executor，每个Executor使用几个core，这些都可以在spark-env.sh里面配置。

#### 4- spark自带cluster manager的standalone cluster模式（集群）

这种运行模式和上面第3个还是有很大的区别的。使用如下命令执行应用程序（前提是已经启动了spark的Master、Worker守护进程）不用启动Hadoop服务，除非你用到了HDFS的内容。

spark-submit --master spark://wl1:6066 --deploy-mode cluster

master节点上的进程
```
Master
CoarseGrainedExecutorBackend
Worker
jps
```
提交应用程序的客户端上的进程
```
Master
SparkSubmit
Worker
DriverWrapper
jps
```
某worker节点上的进程

standonload 模式的client 与cluster 的区别？
    客户端的SparkSubmit进程会在应用程序提交给集群之后就退出（区别1）

    Master会在集群中选择一个Worker进程生成一个子进程DriverWrapper来启动driver程序(区别2)

    而该DriverWrapper 进程会占用Worker进程的一个core，所以同样的资源下配置下，会比第3种运行模式，少用1个core来参与计算(观察下图executor id 7的core数)（区别3）

    应用程序的结果，会在执行driver程序的节点的stdout中输出，而不是打印在屏幕上（区别4）
    评论区补充：
    client必须在集群上的某个节点执行，所谓的客户端，也就是说提交应用程序的节点要作为整个程序运行的客户端，也就是说这个节点必须从属于集群！而cluster顾名思义，就是集群的意思，可以理解为提交的程序在某个集群运行，也就是说提交的机器只需要拥有单机版的spark环境就行了，至于提交的地方是哪里通过spark://指定就行了，提交的机器只作为提交的功能，提交完了之后就和他无关了！（区别5）



#### 5- 基于YARN的Resource Manager的Client模式（集群）

现在越来越多的场景，都是Spark跑在Hadoop集群中，所以为了做到资源能够均衡调度，会使用YARN来做为Spark的Cluster Manager，来为Spark的应用程序分配资源。
在执行Spark应用程序前，要启动Hadoop的各种服务。由于已经有了资源管理器，所以不需要启动Spark的Master、Worker守护进程。相关配置的修改，请自行研究。

命令如下：
    spark-submit --master yarn
    或者 spark-submit --master yarn --deploy-mode client
在Resource Manager节点上提交应用程序，会生成SparkSubmit进程，该进程会执行driver程序。RM会在集群中的某个NodeManager上，启动一个ExecutorLauncher进程，来做为ApplicationMaster。另外，也会在多个NodeManager上生成CoarseGrainedExecutorBackend进程来并发的执行应用程序。

#### 6- 基于YARN的Resource Manager的Cluster模式（集群）

spark-submit --master yarn --deploy-mode cluster

在Resource Manager端提交应用程序，会生成SparkSubmit进程，该进程只用来做Client端，应用程序提交给集群后，就会删除该进程。
Resource Manager在集群中的某个NodeManager上运行ApplicationMaster，该AM同时会执行driver程序。紧接着，会在各NodeManager上运行CoarseGrainedExecutorBackend来并发执行应用程序。
应用程序的结果，会在执行driver程序的节点的stdout中输出，而不是打印在屏幕上。
对应的YARN资源管理的单元Container，关系如下：


#### 提交案例：

 ```
 转自知乎博主：
链接：https://www.zhihu.com/question/23967309/answer/26243256

# Run application locally on 8 cores
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master local[8] \
  /path/to/examples.jar \
  100

# Run on a Spark standalone cluster
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master spark://207.184.161.138:7077 \
  --executor-memory 20G \
  --total-executor-cores 100 \
  /path/to/examples.jar \
  1000

# Run on a YARN cluster
export HADOOP_CONF_DIR=XXX
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master yarn-cluster \  # can also be `yarn-client` for client mode
  --executor-memory 20G \
  --num-executors 50 \
  /path/to/examples.jar \
  1000

# Run a Python application on a cluster
./bin/spark-submit \
  --master spark://207.184.161.138:7077 \
  examples/src/main/python/pi.py \
  1000
 ```

## 2- other 提交模式

```
原文地址：https://blog.csdn.net/englishsname/article/details/72864537 ，spark-submit的提交模式

```
