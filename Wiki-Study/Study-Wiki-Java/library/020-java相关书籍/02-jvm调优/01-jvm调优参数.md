# jvm调优参数

## 参考博客

[原文](http://www.manongjc.com/detail/28-yvdfwgtcjssluyw.html#3-xmn350m)

### 1、-Xmx1800M
设置JVM最大可用内存为1800M。

### 2、-Xms1000M
设置JVM初始化内存为1000M。此值可以设置与-Xmx相同，以避免每次垃圾回收完成后JVM重新分配内存。

### 3、-Xmn350M

设置年轻代大小为350M。整个JVM内存大小=年轻代大小 + 年老代大小 + 持久代大小。持久代一般固定大小为64m，所以增大年轻代后，将会减小年老代大小。此值对系统性能影响较大，Sun官方推荐配置为整个堆的3/8。

### 4、-Xss300K
设置每个线程的堆栈大小。JDK5.0以后每个线程堆栈大小为1M，以前每个线程堆栈大小为256K。更具应用的线程所需内存大小进行调整。在相同物理内存下，减小这个值能生成更多的线程。但是操作系统对一个进程内的线程数还是有限制的，不能无限生成，经验值在3000~5000左右。

### 5、-XX:MetaspaceSize=128m -XX:MaxMetaspaceSize=512m
参数是指Metaspace扩容时触发FullGC的初始化阈值，也是最小的阈值。这里有几个要点需要明确：

如果没有配置-XX:MetaspaceSize，那么触发FGC的阈值是21807104（约20.8M），可以通过jinfo -flag MetaspaceSize pid得到这个值；

如果配置了-XX:MetaspaceSize，那么触发FGC的阈值就是配置的值；

Metaspace由于使用不断扩容到-XX:MetaspaceSize参数指定的量，就会发生FGC；且之后每次Metaspace扩容都可能会发生FGC（至于什么时候会，比较复杂，跟几个参数有关）；

如果Old区配置CMS垃圾回收，那么扩容引起的FGC也会使用CMS算法进行回收；

如果MaxMetaspaceSize设置太小，可能会导致频繁FullGC，甚至OOM；

具体设置多大，建议稳定运行一段时间后通过jstat -gc pid确认且这个值大一些，对于大部分项目256m即可
tips: 任何一个JVM参数的默认值可以通过如下指令获取

java -XX:+PrintFlagsFinal -version |grep MetaspaceSize


### 6、-XX:SurvivorRatio 

该参数作用：Eden区与每一个Survivor区的比值

XX:SurvivorRatio=8


-XX:SurvivorRatio=8，这是该参数的默认值，所以Eden:S0:S1=8:1:1。

-XX:SurvivorRatio=4，Eden:S0:S1=4:1:1,千万不要以为新生代是被分成10份，Eden:S0:S1会是4:3:3，这是错误的。

-XX:SurvivorRatio=5，Eden:S0:S1=5:1:1。


#### 举例

[原文博客地址](https://blog.csdn.net/kq1983/article/details/105742162)

以-Xmn1000m 为例

-XX:SurvivorRatio=4，这样Survivor(2个)与Eden区的大小比值 2:4 

1000/6=166.6，也就是每份166.6，Eden有4份=666.66

![](assets/020/02/01-1666320432503.png)

上图有1点点差距，是不能被整除原因，但如果是-XX:SurvivorRatio=3，这样Survivor(2个)与Eden区的大小比值 2:3

这样可以被整除，总共5份，每份200m，看下图

![](assets/020/02/01-1666320451020.png)


### -XX:+UseG1GC  

指定垃圾回收器为G1



### -Dfile.encoding=utf-8 

[-Dfile.encoding=utf-8到底是设置什么，有什么含义与作用？](https://blog.csdn.net/hachi_rt/article/details/121741313)


Java程序运行、程序运行经常看到博客提示设置JVM参数-Dfile.encoding=utf-8，但是到底它是设置什么参数呢？为我们做了哪些事情呢？拨开云雾且看下文。

一、程序运行源代码历经处理阶段

一份代码到运行得到正确输出，经过步骤：

Java源代码----Javac编译成class字节码文件----Java虚拟机JVM加载运行---操作系统----显示设备。

Java源码---字节码：调用jdk的javac命令执行编译，javac默认采用系统字符集。通常我们会设置文件编码UTF-8。使用命令编译也可以加上-encoding UTF-8；


```
System.getProperty("file.encoding")   //可以获取当前系统使用的编码字符集
```

Java字节码---虚拟机---操作系统:虚拟机启动的时候以什么字符集编码来解析我们的class字节码文件呢？这时候我们就通常会设置 -Dfile.encoding=utf-8.   Dfile=decode file. 这里也就解释了设置这个VM参数的意义了。

操作系统---显示设备：针对编码阶段出现的中文，在这一步骤就需要操作系统安装中文字体以支持中文。


### -XX:+HeapDumpOnOutOfMemoryError

-XX:+HeapDumpOnOutOfMemoryError
当堆内存空间溢出时输出堆的内存快照。

jar启动 命令中加入 设置，会在服务产生崩溃的时候导出一份对快照，可以用mat 等工具进行分析

-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=E:\jvmTY\filling\filling-heap.hprof


## java堆转储 dump文件几种方式

[Java堆转储Dump文件的几种方法](https://www.jianshu.com/p/7e09c681f703)

## 调优jmap 命令

win查看进程: tasklist  /v | findstr java
杀进程：taskkill -PID 55232 -F
linux查看进程: ps -ef | grep  java 
杀进程: kill -9  55232 

jmap -dump:live,format=b,file=/tmp/dump.hprof 12587
jmap -dump:live,format=b,file=D:\tmp\dump.hprof 12587



## 调优使用 -XX:+HeapDumpOnOutOfMemoryError

[参考原博客](https://blog.csdn.net/sayyy/article/details/100081737)

jar启动 命令中加入 设置，会在服务产生崩溃的时候导出一份对快照，可以用mat 等工具进行分析

-XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=E:\jvmTY\filling\filling-heap.hprof


## 调优工具

### 命令

#### jmap

![](assets/020/02/01-1666334672237.png)

jhat  

### jconsole

win中是一个exe程序  ， 直接命令行输入 jconsole

![](assets/020/02/01-1666334463164.png)


![](assets/020/02/01-1666334484409.png)

### java visualVM

![](assets/020/02/01-1666334402130.png)

### mat

