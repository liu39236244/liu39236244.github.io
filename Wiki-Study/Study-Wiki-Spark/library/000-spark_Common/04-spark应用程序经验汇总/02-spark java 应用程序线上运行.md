# spark java 程序问题

# 1版本：

## 1-1 暂留

## 1-2 线上环境

```
spark 2.0.2 线上，quartz 1.5.0 ，jdk ：1.7
```

## 1-3 线上执行问题汇总


### 1- shell 脚本提交程序问题  :  /jars/null

```
这种方式导致错误可能原因：
1. spark-submit：提交指定jar 应用程序主jar包没找到，没有提交上spark集群
2. 代码中也设置了应用程序主jar 包路径，两者不一样，冲突
3. spark 线上路径 export (这个是猜想，实验之后再改)

解决问题：
1. 提交脚本
2. 只在一个地方指定应用程序主jar

```

### 2- 报错类没有定义异常（注意：不是类找不到，而是 ClassNoDefinException ）

```

```


### 3- 分区不一致导致问题：CoarseGrainedScheduler

问题
```
2018-08-21 18:19:59,602  ERROR  - [TransportRequestHandler.java:182] - Error while invoking RpcHandler#receive() for one-way message.
org.apache.spark.SparkException: Could not find CoarseGrainedScheduler.
	at org.apache.spark.rpc.netty.Dispatcher.postMessage(Dispatcher.scala:154)
	at org.apache.spark.rpc.netty.Dispatcher.postOneWayMessage(Dispatcher.scala:134)
	at org.apache.spark.rpc.netty.NettyRpcHandler.receive(NettyRpcEnv.scala:571)
	at org.apache.spark.network.server.TransportRequestHandler.processOneWayMessage(TransportRequestHandler.java:180)
	at org.apache.spark.network.server.TransportRequestHandler.handle(TransportRequestHandler.java:109)
	at org.apache.spark.network.server.TransportChannelHandler.channelRead0(TransportChannelHandler.java:119)
	at org.apache.spark.network.server.TransportChannelHandler.channelRead0(TransportChannelHandler.java:51)
	at io.netty.channel.SimpleChannelInboundHandler.channelRead(SimpleChannelInboundHandler.java:105)
	at io.netty.channel.AbstractChannelHandlerContext.invokeChannelRead(AbstractChannelHandlerContext.java:308)
```

原因：

```
程序中用到repartition前后不一致导致这个问题
```

解决方案：

```
缓存之前重新分区：
repartation()
```

### 4- sparkcontext 未关闭导致问题：

* 1- 参考地址：

```
【1】http://spark.apache.org/docs/1.5.2/programming-guide.html
【2】https://github.com/xubo245/SparkLearning
```
* 2-  错误：

```
1.错误方式
ERROR scheduler.LiveListenerBus: SparkListenerBus has already stopped! Dropping event SparkListenerExecutorMetricsUpdate(1,WrappedArray()

2.错误方式
SparkListenerBus has already stopped! Dropping event SparkListenerTaskEnd(0,0,Shuf
fleMapTask,ExceptionFailure(java.lang.NullPointerException,null,[Ljava.lang.StackTraceElement;@5a436d10,java.lang.NullPointerException
```

* 3- 方案：

```
关闭sparkcontext
```

### 5- 找不到quartz 等连接数据库包

```
就需要 在 spark-submit 中 --jars **.jar, **.jar ，手动指定包名
```

### 6- 此外找不到主程序

分析：
```
1.很大程度上是打包方式出问题导致，重新打包，
2. 有可能是版本问题，比如spark使用2.2.0 的scala 版本是2.11.8  ，查看对应的spark 对应的scala 去对应的spark 安装包中lib中查看就行。
3. 类名没有写对
4. jdk 本地与线上一定要一致，否则直接报错
```

#### （我遇到过的）7 无法初始化应用程序中的某一个

* 详细说明：，但是又不是jar包，也没有类名写错，也没有提交脚本出错，能进去方法

错误原因！
```
这个错误贼难受，刚开始去网上查，好多类似的都说是jar冲突，天，我哪知道那个jar包冲突了。后来发现错误了！
我用的jdk 1.7  spark 线上2.0.2  ，我打包用的idea中pom引入的spark2.2（当然这个2.2.0 不影响！），然后本地win 跑没问题，但是一旦上线就会有问题。
原因：
  因为我的算子操作，与算子里面匿名对象分开写的，
    如： **RDD.filter() 这个写在一个 service 对象中
    内部的 new Function 写在了另外一个 service_fun 对象中。这个不会出问题，但是如果！注意！如果你在 service_fun 中的Function 或者其他集群算子内部调用了另外别的类定义的 （广播变量）（累加器）就会报错，加载不到广播变量的那个类。

解决：
  算子内部的匿名方法的所在类中初始化广播变量与累加器，这样就能解决上述问题了！


```
