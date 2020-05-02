# Hue 的简单介绍

## 1.Hue 的介绍
先附上博客:




---

其他链接[博客链接1-SmallPuddingHappy](https://blog.csdn.net/ywheel1989/article/details/51560312)

下面是一些文摘：[原文链接](https://blog.csdn.net/ywheel1989/article/details/51560312)

### Hue 是什么


HUE=Hadoop User Experience

Hue是一个开源的Apache Hadoop UI系统，由Cloudera Desktop演化而来，最后Cloudera公司将其贡献给Apache基金会的Hadoop社区，它是基于Python Web框架Django实现的。

通过使用Hue我们可以在浏览器端的Web控制台上与Hadoop集群进行交互来分析处理数据，例如操作HDFS上的数据，运行MapReduce Job，执行Hive的SQL语句，浏览HBase数据库等等。

### 核心功能


    SQL编辑器，支持Hive, Impala, MySQL, Oracle, PostgreSQL, SparkSQL, Solr SQL, Phoenix…
    搜索引擎Solr的各种图表
    Spark和Hadoop的友好界面支持
    支持调度系统Apache Oozie，可进行workflow的编辑、查看

HUE提供的这些功能相比Hadoop生态各组件提供的界面更加友好，但是一些需要debug的场景可能还是需要使用原生系统才能更加深入的找到错误的原因。

HUE中查看Oozie workflow时，也可以很方便的看到整个workflow的DAG图，不过在最新版本中已经将DAG图去掉了，只能看到workflow中的action列表和他们之间的跳转关系，想要看DAG图的仍然可以使用oozie原生的界面系统查看。
