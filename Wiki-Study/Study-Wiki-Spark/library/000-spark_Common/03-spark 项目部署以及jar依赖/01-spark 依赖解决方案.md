# spark 程序jar依赖解决方案

## 使用过的





## other 的

### other1 ，三种jar依赖解决方案
spark 任务是分布式进行的所以如果可能运行任务的机器上如果没有 依赖jar的话，则会出现classnotfount 的异常

原文地址：https://blog.csdn.net/u012893747/article/details/78718053

#### 1.将第三方的jar文件打包到最终形成的应用的jar文件中
```
使用的场景为：第三方jar文件比较小，可能会进行改动的情况下
```
#### 2.使用参数 –jars给定驱动

* 2-1
```

使用场景为：jar文件比较小，依赖于改jar文件的应用比较少
操作命令为：
    bin/spark-shell --jars /opt/cdh-5.3.6/hive/lib/mysql-connector-java-5.1.27-bin.jar,/opt/cdh-5.3.6/hive/lib/derby-10.10.1.1.jar

 用户提交应用的时候使用--jars参数给定，回在driver运行的jvm中启动一个socket进程，提供jar文件的一个下载功能，所以这种方式不要求所有机器上均有第三方的jar文件，只要求jar文件位于使用spark-submit提交应用的机器上有这个jar文件即可，

 缺点：根据spark官网，在提交任务的时候指定–jars，用逗号分开。这样做的缺点是每次都要指定jar包，如果jar包少的话可以这么做，但是如果多的话会很麻烦。

 示例：
 spark-submit --master yarn-client --jars ***.jar,***.jar(你的jar包，用逗号分隔) mysparksubmit.jar

 此外：

 如果你使用了sbt的话，并且在build.sbt中配置好了依赖并下载完成，那么你可以直接去用户home目录下的.ivy/cache/中拷贝你的jar需要的jar包

```
#### 3.使用SPARK_CLASSPATH来设置第三方依赖包
* 3-1 在spark-env.sh 中添加spark 配置
```
使用场景：jar文件在spark应用中比较多
操作：在spark目录下创建一个external_jars文件夹，然后将jar复制到这个文件夹中，然后配置SPARK_CLASSPATH
     cd /opt/cdh-5.3.6/spark
     mkdir external_jars
     cp /opt/cdh-5.3.6/hive/lib/mysql-connector-java-5.1.27-bin.jar external_jars/
     cp /opt/cdh-5.3.6/hive/lib/derby-10.10.1.1.jar external_jars/
     vim conf/spark-env.sh
   添加内容如下：
SPARK_CLASSPATH=/opt/cdh-5.3.6/spark/external_jars/*
要求spark应用运行的所有机器上均存在你添加的这些jar文件


```
* 3-2  在代码中设置spark的jar依赖

```
方法二：extraClassPath

提交时在spark-default中设定参数，将所有需要的jar包考到一个文件里，然后在参数中指定该目录就可以了，较上一个方便很多：

spark.executor.extraClassPath=/home/hadoop/wzq_workspace/lib/*
spark.driver.extraClassPath=/home/hadoop/wzq_workspace/lib/*

需要注意的是,你要在所有可能运行spark任务的机器上保证该目录存在，并且将jar包考到所有机器上。这样做的好处是提交代码的时候不用再写一长串jar了，缺点是要把所有的jar包都拷一遍。
```
#### 4 sbt 方式

最终办法，这种方法是将所有依赖的jar包包括你写的代码全部打包在一起（fat-jar）。
在项目根目录输入sbt，键入plugins，发现assembly并没有默认安装，因此我们要为sbt安装sbt-assembly插件。
在你的项目目录中project/plugins.sbt中添加
```
addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.13.0")
resolvers += Resolver.url("bintray-sbt-plugins", url("http://dl.bintray.com/sbt/sbt-plugin-releases"))(Resolver.ivyStylePatterns)
```




# Hadoop： jar 解决方案
## hadoop依赖第三方jar文件解决方式

```
hadoop依赖jar解决方案和spark解决方案基本类似，
    第一种和spark完全一样
    第二种将jars改为libjars
    第三种修改HADOOP_CLASSPATH
```
