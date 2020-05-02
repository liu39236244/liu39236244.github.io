# Oozie 的简单介绍

## 1.Oozie简介：

---

博客链接：

[博客地址](https://www.cnblogs.com/cenzhongman/p/7229387.html?yyue=a21bo.50862.201879)

下面是摘自上述博客：
Oozie is a workflow scheduler system to manage Apache Hadoop jobs.
Oozie 是一个工作流调度系统用来管理 Hadoop 任务
工作流调度：工作流程的编排，调度：安排事件的触发执行(时间触发,事件触发)

Oozie is integrated with the rest of the Hadoop stack supporting several types of Hadoop jobs out of the box (such as Java map-reduce, Streaming map-reduce, Pig, Hive, Sqoop and Distcp) as well as system specific jobs (such as Java programs and shell scripts).
Oozip 集成了 Hadoop 其他的几种协议(如 MapReduce Pig Hive Sqoop Distcp)和系统专有的任务(如 java程序 shell脚本)

底层是一个仅有 Map Task 的 MapReduce 程序

1.Oozie是 Cloudeara 公司共享给 Apache 的一个开源顶级项目，提供对 Hadoop MapReduce Hive Pig 的任务的调度；Oozie需要部署到一个 Java Servlet 容器中(如：Tomcat)运行，需要使用关系型数据库存储调度信息

2.Oozie 工作流的定义，同 Jboss jBPM 提供的 jPDL 一样，提供了类似流程定义语言 hPDL ,通过 XML 格式实现流程定义。对于工作流系统，一般都会有很多不同的功能节点，如分支、并发、汇合等

3.Ooize 定义了控制流节点 Control Flow Nodes 和动作节点 Action Nodes 。其中控制流节点定义了流程的开始和结束，以及控制流程的执行路径( Execution Path ) ,如 decision / fork / join 等；而动作节点包括 Hadoop MapReduce / HDFS / Pig / SSH / HTTP / eMail / Oozie 子流程等。

* 整体的架构(Oozie经历了三个阶段，这里就略过，在上述博客地址连接链中)
![Oozie 的整体架构](assets/001/20180408-007e38e3.png)  

    左侧：Oozie 通过 Tomcat Http Server 对外提供了 JAVA API 、REST API 、CLI(终端) 、Web 接口（hue） ；产生的数据存储在 Oozie object dstabase 上

    中间：Oozie 的三层结构

    右侧：Oozie 的 Coordinator Engine 协调引擎 能够监控基于 Time-based triggers 和 HDFS 上的 Data-based triggers；每一个 Oozie Job 都是一个只有 Map Task 的 MapReduce 程序

这里附上一个博主连接：[博主的博客](http://www.cnblogs.com/cenzhongman/)
