

# Hadoop 安装搭建 [官网](http://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-common/SingleCluster.html)

---

## 1 单节点安装 Setting up a Single Node Cluster

###  配之前需要注意一些比较坑的地方：
    * 配置文件如果用editplus 或者 nopadd++ 的话注意编码，utf-8 无bom 格式
    * ml 文件中 value 里面的值不能有空格（这个比较容易忽略，一定要谨慎）
    * 注意：重点来了，防火墙。。。防火墙。。。防火墙。。。 重要的事情三遍啊！！！！搞了好久！哎，三台都给下了
    哇真的是！因为manster 我当时配置单机版的时候，win 浏览器访问不到50070 ， 我只是开放了 50070  ， 但是记住，直接把防火墙关了（或者因为特殊需要的话就一个一个的爱防火墙里面开放端口，9001 就是 datanode 访问主机的端口 ）
    * 还有个地方 dfs.datanode.directoryscan.throttle.limit.ms.per.sec  这里官方地方是value：0 ,但默认是1000 ，你需要手动设置一下

    * file://{}/**/** 的地方，注意了 如果配的是/usr/lcoal/** 的话需要  file:///usr/local/***  或者 file:/usr/local/** 如果是file://usr/local/ 是不可以的

    * 在HA集群中，standby状态的NameNode可以完成checkpoint操作，因此没必要配置Secondary NameNode、CheckpointNode、BackupNode。如果真的配置了，还会报错。
### 1.1 准备：

* 平台支持：
    Linux ，但是也可以在windows 上，主要后续操作还是得在linux上进行

*  要求软件 Required software for Linux include:
  > 1 Java™ must be installed. Recommended Java versions are described at HadoopJavaVersions.  具体支持的java版本地址[支持的版本信息](http://wiki.apache.org/hadoop/HadoopJavaVersions)

  > 2 ssh must be installed and sshd must be running to use the Hadoop scripts that manage remote Hadoop daemons.

  > 3 官方给出需要安装的：
  >>$ sudo apt-get install ssh

  >>$ sudo apt-get install rsync

* 区别三种方式：
解释其实就是再单个计算机的单个jvm中运行程序；而为分布式就是单个节点多个jvm；全分布式就是多个节点，每个节点一个jvm

### 一、单机版安装 ：

* 下载java 1.8 , 下载hadoop 安装包，
* 配置java、hadoop 环境变量
```
export HADOOP_HOME=/usr/local/hadoop-2.7.5/bin
export MYSQL_HOME=/usr/local/mysql/bin
JAVA_HOME=/usr/local/MyInstall/jdk1.8.0_161/bin
export PATH="$HADOOP_HOME:$JAVA_HOME:$MYSQL_HOME:$PATH"
```
* 进入 /usr/local/hadoop-2.7.5/etc/hadoop 配置 hadoop-env.sh 配置jdk 路径
![修改hadoop-env.sh](assets/001/20180330-7b494fd5.png)  
    然后执行自带的jar包的一个任务
    hadoop jar /usr/local/hadoop-2.7.5/share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.5.jar  grep /shenyabo/HadoopTest/input/ /shenyabo/HadoopTest/output/ 'dfs[a-z.]+'

就会在相应文件夹下面创建对应的文件

### 二、 伪分布式
继续上面单节点集群的配置
* 配置
1 编辑 ： hadoop/etc/hadoop/core-site.xml:
```xml
<configuration>
<property>
    <name>fs.defaultFS</name>
    <value>hdfs://localhost:9000</value>
</property>
</configuration>

```

2 配置 ： etc/hadoop/hdfs-site.xml:

```xml
<!-- 这个是备份文件数量 1 份-->
<configuration>
    <property>
        <name>dfs.replication</name>
        <value>1</value>
    </property>
</configuration>
```
3 ssh 配置，首先你得可以ssh 本机命令：【ssh localhost】不可以的话ssh 先打通本机
```
ssh-keygen -t rsa  //一路回车
ssh-copy-id ip 如果是打通本机的话就是localhost

及ssh-copy-id localhost
然后测试一下:
ssh localhost // 就ok了

下面是官方给出的：
$ ssh-keygen -t rsa -P '' -f ~/.ssh/id_rsa
$ cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys
$ chmod 0600 ~/.ssh/authorized_keys
```
* 执行
    4 开始执行，The following instructions are to run a MapReduce job locally. If you want to execute a job on YARN, see [YARN on Single Node](http://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-common/SingleCluster.html#YARN_on_Single_Node).意思就是下面的仅仅针对本地mapreduce任务，如果想在单节点跑线上任务，就参照这个链接。[YARN on Single Node]

5 格式化文件系统(如果配置了bin目录的环境变量，这里就不需要前面加bin了)
    bin/hdfs namenode -format

6 启动namenode、datanode的守护进程
    /usr/local/hadoop-2.7.5/sbin/start-dfs.sh
7 就可以在浏览器上看了：NameNode - http://localhost:50070/

```
注意：
我遇到过的问题 ：

<value>hdfs://ip:9000</value>  设置成这样的话，win下面访问会有问题
这个配置localhost 换成你的节点对应的ip:
然后在win 系统中 c:/windows/system32 下面找hosts ，添加对应的信息
ip  主机名
然后再去访问 ip:50070  (别localhost了，换成ip) 然后还是不行

最后查是说的是防火墙没有打开50070端口：

打开50070端口命令【firewall-cmd --zone=public --add-port=50070/tcp --permanent】
重新启动防火墙就ok了，【firewall-cmd --reload】
关闭防火墙的方法：systemctl stop firewalld.service
查看状态：firewall-cmd --state
如果还是不行，就修改主机名试试吧！
vi /etc/hosts
添加
127.0.0.1 localhost
127.0.0.1 主机名字
这一步我没遇到过我猜测的，不过还是先写上来知道可能有这个问题

以上是搭建为分布式的几个小问题。希望可以帮助朋友们学习
```
8 为分布式进行操作
我就不详细写了，命令留下，知道这么用就行了
    $ bin/hdfs dfs -mkdir /user
    $ bin/hdfs dfs -mkdir /user/<username>
    $ bin/hdfs dfs -put etc/hadoop input
    $ bin/hdfs dfs -put etc/hadoop input
    跑一个案例，这个输入输出目录都是在hdfs上的
    $ bin/hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.7.5.jar grep input output 'dfs[a-z.]+'
    文件copy下来 查看一下
    $ bin/hdfs dfs -get output output
    $ cat output/*

    最后是关闭hadoop
    $ sbin/stop-dfs.sh

#### 9 单节点配置YARN

```
You can run a MapReduce job on YARN in a pseudo-distributed mode by setting a few parameters and running ResourceManager daemon and NodeManager daemon in addition.
The following instructions assume that 1. ~ 4. steps of the above instructions are already executed.
上面的都可以你再来配这个吧
```

    1 配置etc/hadoop/mapred-site.xml: 注意，这个文件可能没有，你需要把mapred-site.xml.template 这个改一下
```xml
<configuration>
    <property>
        <name>mapreduce.framework.name</name>
        <value>yarn</value>
    </property>
</configuration>

```
    2 配置etc/hadoop/yarn-site.xml:
```xml
<configuration>
    <property>
        <name>yarn.nodemanager.aux-services</name>
        <value>mapreduce_shuffle</value>
    </property>
</configuration>
```
    3 Start ResourceManager daemon and NodeManager daemon:
    ```
    $ sbin/start-yarn.sh
    ```
    4 在浏览器中查看 Browse the web interface for the ResourceManager; by default it is available at:
      ResourceManager - http://localhost:8088/
      注意访问不了还打通就行了 ：
      打开50070端口命令【firewall-cmd --zone=public --add-port=8088/tcp --permanent】
      重新启动防火墙就ok了，【firewall-cmd --reload】

    5 你可以泡个作业

    6 关闭yarn $ sbin/stop-yarn.sh



以上都是搭建的非全分布式，文件都在tmp临时目录下，所以不用管目录问题
接下来搭建全分布式：

* hadoop全分布式的安装 [官方地址](http://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-common/ClusterSetup.html)


---
### 三、 完全分布式 -非高可用，secondnamenode 冷备份（非高可用！后面还会有zookeeper的安装与配置以及zookeeper 安装 hadoop的高可用！）

#### 1.虚拟机准备

1.1 首先准备三台机子。可以克隆得到，然后修改其IP,MAC 地址。虚拟机的话最好安装VM_Tool 挂在一个共享文件夹。准备好需要用的安装包

Hadoop官网的安装包[下载地址](http://mirror.bit.edu.cn/apache/hadoop/common/)

设置一下共享目录，后期安装方便：[这里记录了一个博客](https://www.cnblogs.com/zejin2008/p/7144514.html)

* 文件共享 的总结

>安装VMTool——言简意赅的方式[方式连接](https://www.cnblogs.com/zejin2008/p/7144514.html)(按照这个就可以)

1.下面共享文件步骤：原文链接：上方的方式连接
```Shell
yum -y install kernel-devel-$(uname -r)
yum -y install net-tools perl gcc gcc-c++

2.安装vm tool，这里也是一个步骤不要忽略了，打开你的虚拟机开机之后，上方两条命令之后点击VMware中的安装Vmtool，（切记一定要有着一步）

3.第三步
mount /dev/cdrom /home/tmp
cp /home/tmp/VMwareTools-9.6.0-1294478.tar.gz /tmp
cd /tmp
tar -zxvf VMwareTools-9.6.0-1294478.tar.gz
cd vmware-tools-distrib
./vmware-install.pl
好坑啊! 上一步执行完之后，你得把虚拟机关了，然后设置共享目录，然后开机就有了！我这一步我没关闭虚拟机直接设置了共享文件夹，结果搞了好半天！坑爹啊

有/mnt/hgfs但没有共享文件的解决方法：

mount -t vmhgfs .host:/  /mnt/hgfs
Error: cannot mount filesystem: No such device


这时不能用mount工具挂载，而是得用vmhgfs-fuse，需要安装工具包

yum install open-vm-tools-devel -y
有的源的名字并不一定为open-vm-tools-devel(centos) ，而是open-vm-dkms(unbuntu)
执行：vmhgfs-fuse .host:/ /mnt/hgfs


此时进入/mnt/hgfs就能看到你设置的共享文件夹了。


```
按提示操作即可。

    1、 克隆记录
          网卡配置

          cd /etc/sysconfig/network-scripts/ifcfg-ens33

![克隆配置（Centos7 ）](assets/001/20180404-35298ff4.png)  

          153.2 中2 只要是1-254 应该都可以(一般153 后面都配成2就行了 )
          service network restart
          ping百度试试：  ping www.baidu.com
          ip addr  # 查看ip
          三、设置主机名为www
          hostname  www  #设置主机名为www
          vi /etc/hostname #编辑配置文件
          www   #修改localhost.localdomain为www
          :wq!  #保存退出
          vi /etc/hosts #编辑配置文件
          127.0.0.1   localhost  www   #修改localhost.localdomain为www
          此外配置里面加上另外两台机器的ip 与主机名

          IP_slave1 主机名_1
          IP_slave2 主机名_2
          IP_slave3 主机名_3

          :wq!  #保存退出
          shutdown -r now  #重启系统

1.2 然后装上jdk ，都要装，环境变量都要配置

```
export HADOOP_HOME=/usr/local/hadoop-2.7.5/bin
export MYSQL_HOME=/usr/local/mysql/bin
JAVA_HOME=/usr/local/MyInstall/jdk1.8.0_161/bin
export PATH="$HADOOP_HOME:$JAVA_HOME:$MYSQL_HOME:$PATH"
```

1.3 ssh 打通

```
linux:免密登录：
• ssh-keygen -t rsa  （注意一路回车，啥也不填！！啥也不填！！！）
• ssh-copy-id [ip]  // 分别分发共钥

以上两条命令即可：以下为补充

   ◇ 或者是：ssh-copy-id [用户名@ip]
   ◇ 或者是：ssh-copy-id -i /root/.ssh/id_rsa.pub [用户名@ip]
• 默认是在 /root/.ssh/下面的 三个文件

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
-rw-------. 1 root root 1766 2月  13 17:22 id_rsa
-rw-r--r--. 1 root root  393 2月  13 17:22 id_rsa.pub
-rw-r--r--. 1 root root  177 2月  13 17:05 known_hosts
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

####  配置文件准备
一下搭建过程中参考了一部分博客：
[博主1](https://blog.csdn.net/cuitaixiong/article/details/51591410)

To configure the Hadoop cluster you will need to configure the environment in which the Hadoop daemons execute as well as the configuration parameters for the Hadoop daemons.

HDFS daemons are NameNode, SecondaryNameNode, and DataNode. YARN damones are ResourceManager, NodeManager, and WebAppProxy. If MapReduce is to be used, then the MapReduce Job History Server will also be running. For large installations, these are generally running on separate hosts.

* 三台机子都装上jdk 目录相同，然后解压hadoop安装包，并且配置hadoop/bin 的环境变量，三台都需要!

* 配置 Hadoop 官方给出的是
官方给出要在/etc/profile 中配置的hadoop的安装路径，（也就相当于 JAVA_HOME 、Hadoop_HOME 一类）
HADOOP_PREFIX=/path/to/hadoop
 export HADOOP_PREFIX

* 配置文件  etc/hadoop/hadoop-env.sh
目的是告诉hadoop的java 的安装目录

export JAVA_HOME="yourJDK_Path"  // 注意这里的话 不能用$JAVA_HOME ，我能echo $JAVA_HOME 但是这里面如果这样写的话识别不了，坑爹，所以还是老老实实写上路径吧！

##### 配置文件  etc/hadoop/core-site.xml

      Parameter 	Value 	Notes
      fs.defaultFS 	NameNode URI 	hdfs://host:port/  // 一般都是9000
      io.file.buffer.size 	131072 	Size of read/write buffer used in SequenceFiles.
      // 设置的是读写缓冲区大小默认4096 (4KB)

最终:core-site.xml
```xml
<configuration>
<property>
	<name>fs.defaultFS</name>
    <value>hdfs://lzkj01:9000</value>
</property>
<property>
	<name>io.file.buffer.size</name>
    <value>4096</value>
</property>
<!-- 错误解决过程,于此同时格式化的时候下面这个路径是hadoop运行的时候临时文件都在这里生成在/tmp/下面也会产生一部分文件-->
<property>
	<!-- 这个配置官方并没有指出为必须配置项-->
	<name>hadoop.tmp.dir</name>
    <value>file:///usr/local/MyInstall/hadoop-2.7.5/tmp/hadoop-${user.name}</value>
</property>
</configuration>
```

##### 配置文件2 etc/hadoop/hdfs-site.xml
Configurations for NameNode:为namenode 准备的配置

dfs.namenode.name.dir
dfs.hosts / dfs.hosts.exclude
dfs.blocksize
dfs.namenode.handler.count

* Configurations for DataNode:
dfs.datanode.data.dir

killall java
最终：hdfs-site.xml


```xml

<configuration>
     <!--指定hdfs的副本数,默认是3，如果用虚拟机搭建的话磁盘有限可以改一下数量-->
		<property>
			<name>dfs.replication</name>
			<value>1</value>
		</property>
		<!-- name 元数据存储目录：在本地文件系统上的路径，NameNode会持久存储名称空间和事务日志。-->
		<property>
            <name>dfs.namenode.name.dir</name>
            <value>file:///home/hadoopdata/dfs/name</value>
		</property>
		<!--List of permitted/excluded DataNodes.  dfs.hosts/dfs.hosts.exclude ,data 的DataNode/或者是排除节点(exclude) 节点机器名，-->
		<!--

		<property>
            <name>dfs.hosts</name>
            <value>lzkj01,lzkj02,lzkj03</value>
			<value>192.168.153.128,192.168.153.129,192.168.153.130</value>
		</property>

		-->

		<!-- 指定文件块大小 这里是128MB -->
		<property>
			<name>dfs.blocksize</name>
            <value>134217728</value>
		</property>
		<!-- 	The number of server threads for the namenode. namenode 服务的线程数 -->
		<property>
			<name>dfs.namenode.handler.count</name>
            <value>5</value>
		</property>

		<!-- 下面是为DataNode准备的-->
		<property>
			<name>dfs.datanode.data.dir</name>
            <value>file:///home/hadoopdata/dfs/data</value>
		</property>


		<!-- 如下是配置的其他配置-->

	   <!--文件系统检测目录-->
     <!--  注意，这里搭建的是  高可用的冷备份，如果要搭建高可用，那么不能自行配置 checkpoint 、与 secondNameNode ，如果后面需要升级为ha ，那么需要把三个给注释掉
     dfs.namenode.secondary.http-address
     dfs.namenode.checkpoint.dir
     dfs.namenode.checkpoint.edits.dir
    -->

	   <property>
			<name>dfs.namenode.checkpoint.dir</name>
			<value>file:///home/hadoopdata/checkpoint/dfs/fsimagename</value>
	   </property>

	   <!--edits的检测目录-->

		<property>
			<name>dfs.namenode.checkpoint.edits.dir</name>
			<value>file:///home/hadoopdata/checkpoint/dfs/editname</value>
		</property>

		<!--是否开启文件系统权限-->
		<property>
			<name>dfs.permissions.enabled</name>
			<value>true</value>
		</property>

		<!--是否启用rest api访问hdfs-->

		<property>
			<name>dfs.webhdfs.enabled</name>
			<value>true</value>
		</property>
	   <!--指定snn的web ui监控地址-->
		<property>
		   <name>dfs.namenode.secondary.http-address</name>
		   <value>lzkj02:50090</value>
		</property>

		<!--错误修改 -->
		<!-- 报告编译线程 的间隔 1-1000 之间有效 -->
		<property>
		   <name>dfs.datanode.directoryscan.throttle.limit.ms.per.sec</name>
		   <value>1000</value>
		   <!--
		   The report compilation threads are limited to only running for a given number of milliseconds per second,
		   as configured by the property.
		   The limit is taken per thread,
		   not in aggregate, e.g.
		   setting a limit of 100ms for 4 compiler threads will result in each thread being limited to 100ms, not 25ms.
		   Note that the throttle does not interrupt the report compiler threads, so the actual running time of the threads per second will typically be somewhat higher than the throttle limit,
		   usually by no more than 20%. Setting this limit to 1000 disables compiler thread throttling. Only values between 1 and 1000 are valid. Setting an invalid value will result in the throttle being disbled and an error message being logged.
		   1000 is the default setting.
		   -->
		</property>
</configuration>

```

##### 配置文件 3 etc/hadoop/yarn-site.xml :配置yarn-site.xml 文件
一下列出搭建过程中的yarn 的配置博客：
[安装翻译版](https://blog.csdn.net/willliuzhangxian/article/details/52669316)
[博主1](https://blog.csdn.net/mlljava1111/article/details/51867883)
[博主2](http://dongxicheng.org/mapreduce-nextgen/hadoop-yarn-configurations-resourcemanager-nodemanager/)[这里记载了一部分配置的解释]
[博主3](https://www.jianshu.com/p/e73e6ba60668)[日志目录的配置]
Configurations for ResourceManager and NodeManager:
    yarn.acl.enable // 是否开acls 可用，默认为false
    yarn.admin.acl // yarn集群中的 领导者，默认是*
    yarn.log-aggregation-enable 是否开启聚合日志，默认 false 这里设置为true

Configurations for ResourceManager:

    yarn.resourcemanager.address  ：	${yarn.resourcemanager.hostname}:8032
    // 主机位客户端提交作业的端口
    // yarn.resourcemanager.address  的注意事项node :主机:如果设置了端口，则覆盖yarn.resourcemanager.hostname中设置的主机名。


Configurations for ResourceManager:

    yarn.resourcemanager.address    ${yarn.resourcemanager.hostname}:8032
    // The address of the applications manager interface in the RM.

    yarn.resourcemanager.scheduler.address   ${yarn.resourcemanager.hostname}:8030
    // The address of the scheduler interface  RM中sscheduler的内部通信地址

    yarn.resourcemanager.resource-tracker.address ${yarn.resourcemanager.hostname}:8031
    // <!--Rm的resource资源追踪-->

    yarn.resourcemanager.admin.address   	${yarn.resourcemanager.hostname}:8033
    //  	ResourceManager host:port for administrative commands.  用于管理命令的端口 The address of the RM admin interface.

    yarn.resourcemanager.webapp.address  	${yarn.resourcemanager.hostname}:8088
    // resourcemanager Ui 网页页面的端口

    yarn.resourcemanager.hostname    0.0.0.0 或者主机名
    // RM 的主机

    yarn.resourcemanager.scheduler.class  org.apache.hadoop.yarn.server.resourcemanager.scheduler.capacity.CapacityScheduler
    // 	The class to use as the resource scheduler.


    yarn.scheduler.minimum-allocation-mb  	1024  也就是一个G
    // RM中每个容器请求的最小分配，In MBs。内存请求低于这将抛出InvalidResourceRequestException。
    // 我在虚拟机中设置的为 512M

    yarn.scheduler.maximum-allocation-mb   8192 (8G) 默认单位是MB
    // yarn.scheduler.maximum-allocation-mb 跟上面的一个配置相反，但同样会报错

    yarn.resourcemanager.nodes.include-path   官方默认参数为空
    // Path to file with nodes to exclude. 就是路径文件中指定的节点将从任务中移除

Configurations for NodeManager:

    yarn.nodemanager.resource.memory-mb  默认也是 8192  （这里给出512MB,大小）
    // Defines total available resources on the NodeManager to be made available to running containers,也是默认为MB,	Amount of physical memory, in MB, that can be allocated for containers.(物理上内存的数量)

    yarn.nodemanager.vmem-pmem-ratio 默认是  2：1
    // value :Maximum ratio by which virtual memory usage of tasks may exceed physical memory (虚拟内存使用任务的最大比率可能超过物理内存。)The virtual memory usage of each task may exceed its physical memory limit by this ratio. The total amount of virtual memory used by tasks on the NodeManager may exceed its physical memory usage by this ratio. (每个任务的虚拟内存使用可能超过其物理内存限制。NodeManager上的任务所使用的虚拟内存总量可能会超过其物理内存使用量。)在设置容器的内存限制时，虚拟内存与物理内存的比率。容器分配是用物理内存来表示的，并且允许虚拟内存使用超过这个比例。

    yarn.nodemanager.local-dirs (待定)
    // value:Comma-separated list of paths on the local filesystem where intermediate data is written.(在写入中间数据的本地文件系统中，以逗号分隔的路径列表。)  
    // note : Multiple paths help spread disk i/o.  (帮助扩展磁盘io)
    // 存储本地化文件的目录列表。应用程序的本地化文件目录将在:${yarn.nodemanag .local-dirs}/usercache/${user}/appcache/application_${appid}中找到。每个容器的工作目录，称为container_${contid}，将是这个的子目录。

    yarn.nodemanager.local-dirs 	${hadoop.tmp.dir}/nm-local-dir 在这里没有进行配置，使用其默认的路径
    // 计算结果的中间路径
    // 解释List of directories to store localized files in. An application's localized file directory will be found in: ${yarn.nodemanager.local-dirs}/usercache/${user}/appcache/application_${appid}. Individual containers' work directories, called container_${contid}, will be subdirectories of this.

    yarn.nodemanager.log-dirs   默认：${yarn.log.dir}/userlogs   这里：默认
    // 单个 nodemanager 的日志文件夹
    // 官网解释：
    	Where to store container logs. An application's localized log directory will be found in ${yarn.nodemanager.log-dirs}/application_${appid}. Individual containers' log directories will be below this, in directories named container_{$contid}. Each container directory will contain the files stderr, stdin, and syslog generated by that container.


      yarn.nodemanager.log.retain-seconds  1080 默认（三个小时） 这里：不设置，因为启用了聚合日志
      // note :默认时间(以秒为单位)保留NodeManager上的日志文件，只适用于禁用日志聚合。也就是启用了聚合日志这里就不需要设定时间了

      yarn.nodemanager.remote-app-log-dir 默认：logs 这里：默认

      // value:/logs
      // note:在应用程序完成时移动应用程序日志的HDFS目录。需要设置适当的权限。只有在启用了日志聚合时才可用。


      yarn.nodemanager.remote-app-log-dir-suffix 默认：logs 这里：默认

      // note：Suffix appended to the remote log dir. Logs will be aggregated to ${yarn.nodemanager.remote-app-log-dir}/${user}/${thisParam} Only applicable if log-aggregation is enabled. (后缀附加到远程日志目录。日志将聚合到${yarn.nodemanager。只有在启用了日志聚合时，才可以使用remote-app-log-dir}/${thisParam}。)

      yarn.nodemanager.aux-services  默认： 无   这里设置为：  	mapreduce_shuffle
      //note: Shuffle service that needs to be set for Map Reduce applications. (需要为Map减少应用程序的洗牌服务),如果不进行设置执行不了MappReduce 程序

Configurations for History Server (Needs to be moved elsewhere):

      yarn.log-aggregation.retain-seconds 默认：-1 ，这里：不设置（默认）
     	//Time between checks for aggregated log retention. If set to 0 or a negative value then the value is computed as one-tenth of the aggregated log retention time. Be careful, set this too small and you will spam the name node. （在检查聚合日志保留之间的时间。如果将值设置为0或负值，则将值计算为聚合日志保留时间的十分之一。要小心，设置这个太小，设置太小的话将会刷新名字节点）

      yarn.log-aggregation.retain-check-interval-seconds  默认-1 ,这里：不设置（默认）
      //Time between checks for aggregated log retention. If set to 0 or a negative value then the value is computed as one-tenth of the aggregated log retention time. Be careful, set this too small and you will spam the name node. （在检查聚合日志保留之间的时间。如果将值设置为0或负值，则将值计算为聚合日志保留时间的十分之一。要小心，设置这个太小，将会刷新名字节点）


配置
最终：yarn-site.xml
```xml
<configuration>

<!-- Site specific YARN configuration properties -->

	<!-- Configurations for ResourceManager and NodeManager: -->

	<!-- 是否呢用acls 默认是false -->
	<property>
		<name>yarn.acl.enable</name>
		<value>false</value>
	</property>

	<!-- Yarn 集群的领导者,这里也是设置的默认值 -->
	<property>
		<name>yarn.admin.acl</name>
		<value>*</value>
	</property>

	<!-- 是否开启聚合日志，默认是不开启的，这里开启-->
	<property>
		<name>yarn.log-aggregation-enable</name>
		<value>true</value>
	</property>


	<!-- Configurations for ResourceManager: -->
	<!-- RM 的地址-->
	<property>
		<name>yarn.resourcemanager.address</name>
		<value>lzkj01:8032</value>
	</property>


	<!-- RM scheduler.address -->
	<property>
		<name>yarn.resourcemanager.scheduler.address</name>
		<value>lzkj01:8030</value>
	</property>

	<!--Rm的resource资源追踪-->
	<property>
		<name>yarn.resourcemanager.resource-tracker.address</name>
		<value>lzkj01:8031</value>
	</property>

	<!--Rm的resource资源追踪-->
	<property>
		<name>yarn.resourcemanager.admin.address</name>
		<value>lzkj01:8033</value>
	</property>



	<!--RM中每个容器请求的最小分配 默认1024 MB =1G -->
	<property>
		<name>yarn.scheduler.minimum-allocation-mb</name>
		<value>512</value>
	</property>
	yarn.scheduler.maximum-allocation-mb

	<!--RM中每个容器请求的最大分配 默认8192 MB =8G -->
	<property>
		<name>yarn.scheduler.minimum-allocation-mb</name>
		<value>1024</value>
	</property>


	<!--RM 每个节点中Noodemanager 的物理内存 默认1024 这里给出 512MB -->
	<property>
		<name>yarn.nodemanager.resource.memory-mb</name>
		<value>1024</value>
	</property>



	<!--RM 每个节点中Noodemanager 中使用的虚拟内存与物理内存的比率，默认是2.1 这里不变 -->
	<property>
		<name>yarn.nodemanager.vmem-pmem-ratio</name>
		<value>2.1</value>
	</property>
	<!-- RM 中计算的中间结果存放位置 -->

	<!-- yarn.nodemanager.local-dirs , 	
	${hadoop.tmp.dir}/nm-local-dir ,
	解释List of directories to store localized files in.
	An application's localized file directory will be found in: ${yarn.nodemanager.local-dirs}/usercache/${user}/appcache/application_${appid}. Individual containers' work directories, called container_${contid}, will be subdirectories of this. -->

	<!-- yarn.nodemanager.log-dirs , 		
	${yarn.log.dir}/userlogs ,
	Where to store container logs.
	An application's localized log directory will be found
	in ${yarn.nodemanager.log-dirs}/application_${appid}.
	Individual containers' log directories will be below this,
	in directories named container_{$contid}.
	Each container directory will contain the files stderr, stdin, and syslog generated by that container.
	-->

	<!--  这里启用了聚合日志所以这里不需要设置
	yarn.nodemanager.log.retain-seconds  1080  (三个小时)
	-->


	<!--  在应用程序完成时移动应用程序日志的HDFS目录。需要设置适当的权限。只有在启用了日志聚合时才可用
	yarn.nodemanager.remote-app-log-dir  //默认：logs )
	-->


	<!--  后缀附加到远程日志目录。日志将聚合到${yarn.nodemanager。只有在启用了日志聚合时，才可以使用remote-app-log-dir}/${thisParam}。
	yarn.nodemanager.remote-app-log-dir-suffix  //默认：logs )
	-->

	<!-- MappReduce 应用程序设置  -->

	<property>
		<name>yarn.nodemanager.aux-services</name>
		<value>mapreduce_shuffle</value>
	</property>

	<!-- Configurations for History Server -->
	<!--

		yarn.log-aggregation.retain-seconds 默认-1 ,表示禁用
		在删除聚合日志之前需要多长时间。-1 禁用。要小心，设置这个太小，将会刷新name node 。
	-->

	<!--

	yarn.log-aggregation.retain-check-interval-seconds  默认-1 ,这里：不设置（默认）
      //Time between checks for aggregated log retention. If set to 0 or a negative
	  value then the value is computed as one-tenth of the aggregated log retention
	  time. Be careful, set this too small and you will spam the name node. （
	  在检查聚合日志保留之间的时间。如果将值设置为0或负值，
	  则将值计算为聚合日志保留时间的十分之一。要小心，设置这个太小，将会刷新名字节点）
	-->

</configuration>
```

##### 配置 4 etc/hadoop/mapred-site.xml  

Configurations for MapReduce Applications:

    mapreduce.framework.name  默认：yarn 。 mapreduce ：执行的框架 。这里：yarn(默认)
    //
    //The runtime framework for executing MapReduce jobs. Can be one of local, classic or yarn.mapreduce 执行的框架

    mapreduce.map.memory.mb  默认: 1024  , 这里 512MB
    //
    // Larger resource limit for maps. 资源限制
    // The amount of memory to request from the scheduler for each map task.

    mapreduce.map.java.opts -Xmx1024M      Larger heap-size for child jvms of map. // 无设置项

    mapreduce.reduce.java.opts  -Xmx2560M  Larger heap-size for child jvms of reduces. // 无设置项

    mapreduce.reduce.memory.mb  3072    	Larger resource limit for reduces. // 这里设置为 1024M

    mapreduce.task.io.sort.mb  value:512 默认是:100   Higher memory-limit while sorting data for efficiency.(排序的时候内存的限制用于提高效率)

    mapreduce.task.io.sort.factor 	value:100 默认：10 	More streams merged at once while sorting files.(排序的时候更多的流进行聚合) // 这里默认 10

    mapreduce.reduce.shuffle.parallelcopies 	value:50  默认：5 	Higher number of parallel copies run by reduces to fetch outputs from very large number of maps. 多少并行输出 // 这里默认 5

Configurations for MapReduce JobHistory Server:

  mapreduce.jobhistory.address ;	MapReduce JobHistory Server host:port(MapReduce JobHistory服务器主机:端口) ;	Default port is 10020.

  mapreduce.jobhistory.webapp.address 	MapReduce JobHistory Server Web UI host:port 	Default port is 19888.

  mapreduce.jobhistory.intermediate-done-dir 	value:/mr-history/tmp 	默认：
  //默认：${yarn.app.mapreduce.am.staging-dir}/history/done_intermediate
  // Directory where history files are written by MapReduce jobs.

  mapreduce.jobhistory.done-dir 	/mr-history/done 	
  // 默认：	${yarn.app.mapreduce.am.staging-dir}/history/done
  //Directory where history files are managed by the MR JobHistory Server.

配置

最终：mapred-site.xml  
```xml
<configuration>
	<!-- mapreduce 使用的框架-->
	<property>
		<name>mapreduce.framework.name</name>
		<value>yarn</value>
	</property>


	<!-- mapreduce map端的执行内存 默认1024（1G）-->
	<property>
		<name>mapreduce.map.memory.mb</name>
		<value>512</value>
	</property>


	<!-- mapreduce reduce 端的执行内存 默认1024（1G）-->
	<property>
		<name>mapreduce.map.memory.mb</name>
		<value>1024</value>
	</property>


	<!-- mapreduce reduce 端的执行内存 默认1024（1G）-->
	<property>
		<name>mapreduce.reduce.memory.mb</name>
		<value>1024</value>
	</property>
	<!-- mapreduce jobhistory 地址 -->
		<property>
		<name>mapreduce.jobhistory.address</name>
		<value>lzkj01:10020</value>
	</property>
	<!-- mapreduce jobhistory webUI 页面监控地址 -->
		<property>
		<name>mapreduce.jobhistory.webapp.address</name>
		<value>lzkj01:19888</value>
	</property>

	<!-- 剩余两个官方写的配置-->
	<!--
		mapreduce.jobhistory.intermediate-done-dir   ${yarn.app.mapreduce.am.staging-dir}/history/done_intermediate
		mapreduce.jobhistory.done-dir 	 	${yarn.app.mapreduce.am.staging-dir}/history/done
	-->

</configuration>
```

* Monitoring Health of NodeManagers （NodeManager 的监视）

Hadoop provides a mechanism by which administrators can configure the NodeManager to run an administrator supplied（提供） script periodically to determine if a node is healthy or not.

Administrators can determine（决定） if the node is in a healthy state by performing any checks of their choice in the script. If the script detects the node to be in an unhealthy state, it must print a line to standard output beginning with the string ERROR. The NodeManager spawns the script periodically and checks its output. If the script’s output contains the string ERROR, as described above, the node’s status is reported as unhealthy and the node is black-listed by the ResourceManager. No further tasks will be assigned to this node. However, the NodeManager continues to run the script, so that if the node becomes healthy again, it will be removed from the blacklisted nodes on the ResourceManager automatically. The node’s health along with the output of the script, if it is unhealthy, is available to the administrator in the ResourceManager web interface. The time since the node was healthy is also displayed on the web interface.

The following parameters can be used to control the node health monitoring script in etc/hadoop/yarn-site.xml.
译文：
Hadoop提供了一种机制，管理员可以通过这个机制来配置NodeManager，以便定期运行管理员提供的脚本，以确定节点是否健康。
管理员可以通过在脚本中执行对其选择的检查来确定节点是否处于健康状态。如果脚本检测到节点处于不健康状态，那么它必须以字符串错误开始输出到标准输出的一行。NodeManager会周期性地生成脚本并检查它的输出。如果脚本的输出包含字符串错误，如上所述，该节点的状态是不健康的，并且该节点是由ResourceManager列出的。没有其他任务将被分配给这个节点。但是，NodeManager继续运行这个脚本，这样如果节点恢复正常，它就会自动从ResourceManager上的黑名单节点中删除。该节点的健康和脚本的输出(如果是不健康的)可以向ResourceManager web界面的管理员提供。该节点健康的时间也显示在web界面上。
可以使用以下参数来控制etc/hadoop/yarn-site.xml中的节点健康监控脚本。
yarn-site.xml (我这里暂时没有进行配置)

        Parameter 	Value 	Notes
        yarn.nodemanager.health-checker.script.path 	Node health script 	Script to check for node’s health status. 默认空值
        // 设置脚本检测路径

        yarn.nodemanager.health-checker.script.opts 	Node health script options 	 默认：空值
        //Options for script to check for node’s health status.	The arguments to pass to the health check script.(传递到检测脚本的参数)

        yarn.nodemanager.health-checker.interval-ms 	Node health script interval  默认：600000
        //Time interval for running health script. Frequency of running node health script.(检测执行脚本频率)

        yarn.nodemanager.health-checker.script.timeout-ms  	默认：	1200000 脚本超时时间：
        //Node health script timeout interval 	Timeout for health script execution.
        //
The health checker script is not supposed to give ERROR if only some of the local disks become bad. NodeManager has the ability to periodically check the health of the local disks (specifically checks nodemanager-local-dirs and nodemanager-log-dirs) and after reaching the threshold of number of bad directories based on the value set for the config property yarn.nodemanager.disk-health-checker.min-healthy-disks, the whole node is marked unhealthy and this info is sent to resource manager also. The boot disk is either raided or a failure in the boot disk is identified by the health checker script.
译文：
如果只有一些本地磁盘变得糟糕，那么health checker脚本不应该出现错误。NodeManager有能力定期检查本地磁盘的健康状况(特别是检查NodeManager -local-dirs和NodeManager -log-dirs)，并且在达到了基于配置属性yarn.nodemanager.disk-health-checker的值设置的坏目录的阈值之后。整个节点都是不健康的，这个信息也被发送到资源管理器。启动磁盘要么被查抄，要么在引导磁盘上出现故障，由健康检查程序脚本识别。


* Slaves File
List all slave hostnames or IP addresses in your etc/hadoop/slaves file, one per line. Helper scripts (described below) will use the etc/hadoop/slaves file to run commands on many hosts at once. It is not used for any of the Java-based Hadoop configuration. In order to use this functionality, ssh trusts (via either passphraseless ssh or some other means, such as Kerberos) must be established for the accounts used to run Hadoop.
译文：就是在slaves 文件中写出集群中的各个节点的主机名/或者IP，一行一个


* Hadoop Rack Awareness 机架感知

Many Hadoop components are rack-aware and take advantage of the network topology for performance and safety. Hadoop daemons obtain the rack information of the slaves in the cluster by invoking an administrator configured module. See the [Rack Awareness](http://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-common/RackAwareness.html) documentation for more specific information.

It is highly recommended configuring rack awareness prior to starting HDFS.
译文：
许多Hadoop组件都是rackaware，并利用网络拓扑来实现性能和安全性。Hadoop守护进程通过调用管理员配置的模块获取集群中的奴隶的机架信息。有关更详细的信息，请参阅“机架感知文档”。
在启动HDFS之前，强烈建议配置机架意识。

* Logging

Hadoop uses the Apache log4j via the Apache Commons Logging framework for logging. Edit the etc/hadoop/log4j.properties file to customize the Hadoop daemons’ logging configuration (log-formats and so on).
译文：
Hadoop通过Apache Commons日志框架使用Apache log4j进行日志记录。编辑等/ hadoop / log4j。属性文件来定制Hadoop守护进程的日志配置(日志格式等)

* Operating the Hadoop Cluster 操作
Once all the necessary configuration is complete, distribute the files to the HADOOP_CONF_DIR directory on all the machines. This should be the same directory on all machines.

In general, it is recommended(推荐) that HDFS and YARN run as separate（使分开） users. In the majority of installations, HDFS processes execute as ‘hdfs’. YARN is typically using the ‘yarn’ account.
译文：
完成所有必要的配置之后，将文件分发到所有机器上的hadoop - conf_dir目录。这应该是所有机器上相同的目录。
一般情况下，建议将HDFS和纱线作为单独的用户运行。在大多数安装中，HDFS进程执行为“HDFS”。纱线通常使用“yarn”账户。


完成以上操作：注意分发配置文件给每个机器，且路径应该是相同的

#### 2.开始hadoop
scp -r /usr/local/MyInstall/hadoop-2.7.5/etc/hadoop/ lzkj02://usr/local/MyInstall/hadoop-2.7.5/etc/
配置分发之后，

*  [hdfs]$ $HADOOP_PREFIX/bin/hdfs namenode -format <cluster_name>
如下：在主节点上：hdfs namenode -format <cluster_name>     (注意需要配置hadoop的环境变量，否则需要进入hadoop/bin中执行)
可行命令：
 hdfs namenode -format  

* 开启namenode（Start the HDFS NameNode with the following command on the designated node as hdfs:）
    [hdfs]$ $HADOOP_PREFIX/sbin/hadoop-daemon.sh --config $HADOOP_CONF_DIR --script hdfs start namenode
* Start a HDFS DataNode with the following command on each designated node as hdfs: 在每个节点单独启动

[hdfs]$ $HADOOP_PREFIX/sbin/hadoop-daemons.sh --config $HADOOP_CONF_DIR --script hdfs start datanode

* 或者一命令启动namenode 与datanode
If etc/hadoop/slaves and ssh trusted access is configured (see Single Node Setup), all of the HDFS processes can be started with a utility script. As hdfs:

[hdfs]$ $HADOOP_PREFIX/sbin/start-dfs.sh


无法找到killall命令：yum install psmisc

* 错误：
2018-04-09 19:09:34,889 ERROR org.apache.hadoop.hdfs.server.datanode.DirectoryScanner: dfs.datanode.directoryscan.throttle.limit.ms.per.sec set to value below 1 ms/sec. Assuming default value of 1000
      这个错误是应为没有配置：dfs.datanode.directoryscan.throttle.limit.ms.per.sec(在hdfs-site.xml 中) 1-1000 之间，slaves 想master 相应心跳的间隔

* 警告：
2018-04-10 13:22:36,496 WARN org.apache.hadoop.hdfs.server.namenode.FSNamesystem: Only one image storage directory (dfs.namenode.name.dir) configured. Beware of data loss due to lack of redundant storage directories!
2018-04-10 13:22:36,496 WARN org.apache.hadoop.hdfs.server.namenode.FSNamesystem: Only one namespace edits storage directory (dfs.namenode.edits.dir) configured. Beware of data loss due to lack of redundant storage directories!

* live node为 1 ，namenode datanode 都启动了,但是live node 为 1
      我来个去啊！切记，只有一个或者的节点，配置文件没问题，格式化没问题，那么一定是防火墙了！！

      调试的时候 写了一个格式化的shell 脚本,格式化，然后启动

* 启动namenode  datanode 启动之后，再来看yarn ，启动Resourcemanager 与nodemanager 服务

Resourcemanager 与 nodemanager 问题

* org.apache.hadoop.yarn.exceptions.YarnRuntimeException: java.net.BindException: Problem binding to [lzkj01:8031] java.net.BindException: 地址已在使用; For more details see:  http://wiki.apache.org/hadoop/BindException
org.apache.hadoop.yarn.exceptions.YarnRuntimeException: java.net.BindException: Problem binding to [lzkj01:8031] java.net.BindException: 地址已在使用; For more details see:  http://wiki.apache.org/hadoop/BindException
    果断看日之：配置文件8031 的忘了改了：yarn.resourcemanager.admin.address 端口应该是8033 的但是

#### 实用shell 脚本

```Shell

#!bin/bash

#!bin/bash
echo "先关闭所有的java应用程序"
echo "重新格式化hadoop"
echo "删除/home/hadoopdata"

ssh root@lzkj01 "killall java ; rm -rf /home/hadoopdata; rm -rf $HADOOP_HOME/logs/* ; rm -rf /tmp/* ; rm -rf /$HADOOP_HOME/tmp"

ssh root@lzkj02 "killall java ; rm -rf /home/hadoopdata;rm -rf $HADOOP_HOME/logs/*; rm -rf /tmp/* ; rm -rf /$HADOOP_HOME/tmp"

ssh root@lzkj03 "killall java ; rm -rf /home/hadoopdata;rm -rf $HADOOP_HOME/logs/*;  rm -rf /tmp/*;rm -rf /$HADOOP_HOME/tmp "

sleep 0.2
echo "格式化"
hdfs namenode -format
sleep 2
echo "开启集群namenode / datanode /resourcemanager /nodemanager / "
start-all.sh
sleep 2

echo "开启jobhistory"
mr-jobhistory-daemon.sh start historyserver
```

---


#  四、 (暂时有问题！)全分布式 （高可用-QJM，手动切换）[官方地址](http://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-hdfs/HDFSHighAvailabilityWithQJM.html#Purpose)


## 问题：
  namenode2 启动起来standby ，namenod1 active  但是 2上面的live为0
  看了错误日志：有问题，暂时不搞这个 了。
    2018-04-13 13:35:26,650 WARN org.apache.hadoop.hdfs.server.namenode.FSNamesystem: Get corrupt file blocks returned error: Operation category READ is not supported in state standby

## 官方介绍背景：

注意:使用Quorum日志管理器或常规共享存储。
本指南讨论了如何使用Quorum Journal Manager (QJM)来配置和使用HDFS HA来共享活动和备用NameNodes之间的编辑日志。有关如何使用NFS而不是QJM来配置HDFS HA的信息，请参阅此替代指南。[代替指南](http://hadoop.apache.org/docs/r2.7.5/hadoop-project-dist/hadoop-hdfs/HDFSHighAvailabilityWithNFS.html)

### Backgorund
Prior to Hadoop 2.0.0, the NameNode was a single point of failure (SPOF) in an HDFS cluster. Each cluster had a single NameNode, and if that machine or process became unavailable, the cluster as a whole would be unavailable until the NameNode was either restarted or brought up on a separate machine.

This impacted the total availability of the HDFS cluster in two major ways:

    In the case of an unplanned event such as a machine crash, the cluster would be unavailable until an operator restarted the NameNode.

    Planned maintenance events such as software or hardware upgrades on the NameNode machine would result in windows of cluster downtime.

The HDFS High Availability feature addresses the above problems by providing the option of running two redundant NameNodes in the same cluster in an Active/Passive configuration with a hot standby. This allows a fast failover to a new NameNode in the case that a machine crashes, or a graceful administrator-initiated failover for the purpose of planned maintenance.

译文：
在Hadoop 2.0.0之前，NameNode是一个HDFS集群中的单点故障(SPOF)。每个集群都有一个单一的NameNode，如果该机器或进程不可用，那么整个集群将不可用，直到NameNode被重新启动或者在单独的机器上被打开。
这对HDFS集群的总可用性有两大影响:
在意外事件(如机器崩溃)的情况下，集群将不可用，直到操作员重新启动NameNode。
计划维护事件，如软件或硬件。

Architecture
In a typical HA cluster, two separate machines are configured as NameNodes. At any point in time, exactly one of the NameNodes is in an Active state, and the other is in a Standby state. The Active NameNode is responsible for all client operations in the cluster, while the Standby is simply acting as a slave, maintaining enough state to provide a fast failover if necessary.

In order for the Standby node to keep its state synchronized with the Active node, both nodes communicate with a group of separate daemons called “JournalNodes” (JNs). When any namespace modification is performed by the Active node, it durably logs a record of the modification to a majority of these JNs. The Standby node is capable of reading the edits from the JNs, and is constantly watching them for changes to the edit log. As the Standby Node sees the edits, it applies them to its own namespace. In the event of a failover, the Standby will ensure that it has read all of the edits from the JounalNodes before promoting itself to the Active state. This ensures that the namespace state is fully synchronized before a failover occurs.

In order to provide a fast failover, it is also necessary that the Standby node have up-to-date information regarding the location of blocks in the cluster. In order to achieve this, the DataNodes are configured with the location of both NameNodes, and send block location information and heartbeats to both.

It is vital for the correct operation of an HA cluster that only one of the NameNodes be Active at a time. Otherwise, the namespace state would quickly diverge between the two, risking data loss or other incorrect results. In order to ensure this property and prevent the so-called “split-brain scenario,” the JournalNodes will only ever allow a single NameNode to be a writer at a time. During a failover, the NameNode which is to become active will simply take over the role of writing to the JournalNodes, which will effectively prevent the other NameNode from continuing in the Active state, allowing the new Active to safely proceed with failover.

译文：
在典型的HA集群中，两个独立的机器被配置为NameNodes。在任何时候，确切的NameNodes都处于活动状态，而另一个处于备用状态。Active NameNode负责集群中的所有客户端操作，而备用服务器只是充当一个奴隶，保持足够的状态，以便在必要时提供快速的故障转移。
为了使备用节点保持与活动节点同步的状态，两个节点都与一组称为“日志节点”(JNs)的独立守护进程通信。当活动节点执行任何名称空间修改时，它会持续记录对大多数JNs的修改记录。备用节点能够读取来自JNs的编辑，并不断地监视它们以更改编辑日志。当备用节点看到编辑器时，它将它们应用到它自己的名称空间中。在发生故障转移时，备用服务器将确保它已经读取了来自J的所有编辑。
对于一个只有一个NameNodes在一次激活的HA集群的正确操作来说，这是非常重要的。否则，名称空间状态将很快在两者之间产生差异，可能导致数据丢失或其他错误的结果。为了确保这个属性并防止所谓的“分裂-大脑场景”，日志节点将只允许单个NameNode一次成为一个作者。在故障转移期间，将变得活跃的NameNode将简单地接管写入日志节点的角色，这将有效地防止其他NameNode继续处于活动状态，从而允许新的活动安全地进行故障转移。

### Configuration overview

Similar to Federation configuration, HA configuration is backward compatible and allows existing single NameNode configurations to work without change. The new configuration is designed such that all the nodes in the cluster may have the same configuration without the need for deploying different configuration files to different machines based on the type of the node.

Like HDFS Federation, HA clusters reuse the nameservice ID to identify a single HDFS instance that may in fact consist of multiple HA NameNodes. In addition, a new abstraction called NameNode ID is added with HA. Each distinct NameNode in the cluster has a different NameNode ID to distinguish it. To support a single configuration file for all of the NameNodes, the relevant configuration parameters are suffixed with the nameservice ID as well as the NameNode ID.Hardware resources

In order to deploy an HA cluster, you should prepare the following:

    NameNode machines - the machines on which you run the Active and Standby NameNodes should have equivalent hardware to each other, and equivalent hardware to what would be used in a non-HA cluster.
    译文：
      NameNode机器——您运行活动和备用NameNodes的机器应该有相应的硬件，以及在非ha集群中使用的等效硬件。

    JournalNode machines - the machines on which you run the JournalNodes. The JournalNode daemon is relatively lightweight, so these daemons may reasonably be collocated on machines with other Hadoop daemons, for example NameNodes, the JobTracker, or the YARN ResourceManager. Note: There must be at least 3 JournalNode daemons, since edit log modifications must be written to a majority of JNs. This will allow the system to tolerate the failure of a single machine. You may also run more than 3 JournalNodes, but in order to actually increase the number of failures the system can tolerate, you should run an odd number of JNs, (i.e. 3, 5, 7, etc.). Note that when running with N JournalNodes, the system can tolerate at most (N - 1) / 2 failures and continue to function normally.
    译文：
      日志节点机器——运行日志节点的机器。日志节点守护进程相对较轻，因此这些守护进程可以合理地配置在与其他Hadoop守护进程的机器上，例如NameNodes、JobTracker或线程ResourceManager。注意:必须至少有3个日志节点守护进程，因为编辑日志修改必须写入到大多数JNs中。这将使系统能够容忍一台机器的故障。您也可以运行超过3个日志节点，但为了实际增加系统能够容忍的故障数量，您应该运行奇数个JNs，(即3、5、7等)。注意，当运行N个日志节点时，系统最多可以容忍(N - 1) / 2个故障，并继续正常运行。

Note that, in an HA cluster, the Standby NameNode also performs checkpoints of the namespace state, and thus it is not necessary to run a Secondary NameNode, CheckpointNode, or BackupNode in an HA cluster. In fact, to do so would be an error. This also allows one who is reconfiguring a non-HA-enabled HDFS cluster to be HA-enabled to reuse the hardware which they had previously dedicated to the Secondary NameNode.
译文：
注意，在HA集群中，备用NameNode还执行名称空间状态的检查点，因此不需要在HA集群中运行第二个NameNode、CheckpointNode或BackupNode。事实上，这样做将是一个错误。这也允许重新配置非ha支持的HDFS集群，使其能够重用以前用于辅助NameNode的硬件。


### Configuration overview

Similar to Federation configuration, HA configuration is backward compatible and allows existing single NameNode configurations to work without change. The new configuration is designed such that all the nodes in the cluster may have the same configuration without the need for deploying different configuration files to different machines based on the type of the node.

Like HDFS Federation, HA clusters reuse the nameservice ID to identify a single HDFS instance that may in fact consist of multiple HA NameNodes. In addition, a new abstraction called NameNode ID is added with HA. Each distinct NameNode in the cluster has a different NameNode ID to distinguish it. To support a single configuration file for all of the NameNodes, the relevant configuration parameters are suffixed with the nameservice ID as well as the NameNode ID.

配置概述
与联邦配置类似，HA配置是向后兼容的，并且允许现有的单个NameNode配置在不改变的情况下工作。新配置的设计使得集群中的所有节点都具有相同的配置，而不需要根据节点的类型将不同的配置文件部署到不同的机器上。
与HDFS联合一样，HA集群重用nameservice ID来标识一个可能实际上由多个HA NameNodes组成的单个HDFS实例。此外，还添加了一个名为NameNode ID的新抽象。集群中的每个不同的NameNode都有一个不同的NameNode ID来区分它。为了支持所有NameNodes的一个配置文件，相关的配置参数使用nameservice ID和NameNode ID作为后缀。

### Configuration details

To configure HA NameNodes, you must add several configuration options to your hdfs-site.xml configuration file.

The order in which you set these configurations is unimportant, but the values you choose for dfs.nameservices and dfs.ha.namenodes.[nameservice ID] will determine the keys of those that follow. Thus, you should decide on these values before setting the rest of the configuration options.

译文：
要配置HA NameNodes，必须向hdfs站点添加几个配置选项。xml配置文件。
您设置这些配置的顺序并不重要，但是您为dfs.nameservice和dfs. namenodes (nameservice ID)所选择的值将会决定后面的键值。因此，在设置其他配置选项之前，您应该决定这些值。

### 在这之前我先备份一下之前的非高可用的
备份普通集群的Shell
```Shell

#!bin/bash
echo  "对非高可用的hadoop进行备份"
echo "第一个节点备份...."
ssh root@lzkj01 "killall java ; cp -r  /usr/local/MyInstall/hadoop-2.7.5/ /usr/local/MyInstall/hadoop-2.7.5.normal_bak; "
echo "第一个节点备份完成!"
echo ""
echo "第二个节点备份...."
ssh root@lzkj02 "killall java ; cp -r  /usr/local/MyInstall/hadoop-2.7.5/ /usr/local/MyInstall/hadoop-2.7.5.normal_bak;"
echo "第二个节点备份完成!"
echo "第三个节点备份...."
ssh root@lzkj03 "killall java ; cp -r  /usr/local/MyInstall/hadoop-2.7.5/ /usr/local/MyInstall/hadoop-2.7.5.normal_bak;"
echo "第三个节点备份完成!"n/bash: in/bash: 没有那个文件或目录
```

### Configuration details

To configure HA NameNodes, you must add several configuration options to your hdfs-site.xml configuration file.

The order in which you set these configurations is unimportant, but the values you choose for dfs.nameservices and dfs.ha.namenodes.[nameservice ID] will determine the keys of those that follow. Thus, you should decide on these values before setting the rest of the configuration options.
译文：
您设置这些配置的顺序并不重要，但是您为dfs.nameservice和dfs. namenodes (nameservice ID)所选择的值将会决定后面的键值。因此，在设置其他配置选项之前，您应该决定这些值。

dfs.nameservices - the logical name for this new nameservice

Choose a logical name for this nameservice, for example “mycluster”, and use this logical name for the value of this config option. The name you choose is arbitrary. It will be used both for configuration and as the authority component of absolute HDFS paths in the cluster.
译文：为这个名称选择一个逻辑名称，例如“mycluster”，并使用这个逻辑名称作为配置选项的值。您选择的名称是任意的。它将用于配置和集群中绝对HDFS路径的权威组件。就是可以随便起啦

Note: If you are also using HDFS Federation, this configuration setting should also include the list of other nameservices, HA or otherwise, as a comma-separated list.
译文：
注意:如果您还使用了HDFS联合，那么这个配置设置也应该包括其他nameservices的列表，HA或其他，作为逗号分隔的列表。

### 配置开始  hdfs-site.xml
这是完整配置，具体细节请点击<a href="#HA_hdfs-site.xml">hdfs-site.xml</a>
```xml

<configuration>
     <!--指定hdfs的副本数,默认是3，如果用虚拟机搭建的话磁盘有限可以改一下数量-->
		<property>
			<name>dfs.replication</name>
			<value>1</value>
		</property>
		<!-- name 元数据存储目录：在本地文件系统上的路径，NameNode会持久存储名称空间和事务日志。-->
		<property>
            <name>dfs.namenode.name.dir</name>
            <value>file:///home/hadoopdata/dfs/name</value>
		</property>
		<!--List of permitted/excluded DataNodes.  dfs.hosts/dfs.hosts.exclude ,data 的DataNode/或者是排除节点(exclude) 节点机器名，-->
		<!--

		<property>
            <name>dfs.hosts</name>
            <value>lzkj01,lzkj02,lzkj03</value>
			<value>192.168.153.128,192.168.153.129,192.168.153.130</value>
		</property>

		-->

		<!-- 指定文件块大小 这里是128MB -->
		<property>
			<name>dfs.blocksize</name>
            <value>134217728</value>
		</property>
		<!-- 	The number of server threads for the namenode. namenode 服务的线程数 -->
		<property>
			<name>dfs.namenode.handler.count</name>
            <value>5</value>
		</property>

		<!-- 下面是为DataNode准备的-->
		<property>
			<name>dfs.datanode.data.dir</name>
            <value>file:///home/hadoopdata/dfs/data</value>
		</property>


		<!-- 如下是配置的其他配置-->



		<!--
		如果配置高可用， 这两个不能配置，secondnamenode 、checkpoint ，因为standby 自己会做检测，所以配置了就会有问题
			 // 文件系统检测目录
	   <property>
			<name>dfs.namenode.checkpoint.dir</name>
			<value>file:///home/hadoopdata/checkpoint/dfs/fsimagename</value>
	   </property>

	   // edits的检测目录

		<property>
			<name>dfs.namenode.checkpoint.edits.dir</name>
			<value>file:///home/hadoopdata/checkpoint/dfs/editname</value>
		</property>

		-->


		<!--是否开启文件系统权限
		namenode的hdfs-site.xml是必须将dfs.webhdfs.enabled属性设置为true，
		否则就不能使用webhdfs的LISTSTATUS、LISTFILESTATUS等需要列出文件、文件夹状态的命令，
		因为这些信息都是由namenode来保存的。 -->
		<property>
			<name>dfs.permissions.enabled</name>
			<value>true</value>
		</property>

		<!--是否启用rest api访问hdfs-->

		<property>
			<name>dfs.webhdfs.enabled</name>
			<value>true</value>
		</property>


	   <!--指定snn的web ui监控地址 HA 配制的时候不能配置这个-->
		<!--
			<property>
		   <name>dfs.namenode.secondary.http-address</name>
		   <value>lzkj02:50090</value>
		</property>
		-->

		<!--错误修改 -->
		<!-- 报告编译线程 的间隔 1-1000 之间有效 -->
		<property>
		   <name>dfs.datanode.directoryscan.throttle.limit.ms.per.sec</name>
		   <value>1000</value>
		   <!--
		   The report compilation threads are limited to only running for a given number of milliseconds per second,
		   as configured by the property.
		   The limit is taken per thread,
		   not in aggregate, e.g.
		   setting a limit of 100ms for 4 compiler threads will result in each thread being limited to 100ms, not 25ms.
		   Note that the throttle does not interrupt the report compiler threads, so the actual running time of the threads per second will typically be somewhat higher than the throttle limit,
		   usually by no more than 20%. Setting this limit to 1000 disables compiler thread throttling. Only values between 1 and 1000 are valid. Setting an invalid value will result in the throttle being disbled and an error message being logged.
		   1000 is the default setting.
		   -->
		</property>
		<!-- 一下是高可用配置，上方的配置搭建普通集群就可以了 -->
		<property>
			<name>dfs.nameservices</name>
			<value>lzkj</value>
		</property>

		<!-- namenode 的两个机器名字，注意目前只能有两个namenode-->
		<property>
			<name>dfs.ha.namenodes.lzkj</name>
			<value>nn1,nn2</value>
		</property>

		<!-- RPC 的端口-->
		<property>
			<name>dfs.namenode.rpc-address.lzkj.nn1</name>
			<value>lzkj01:9000</value>
		</property>
		<property>
			<name>dfs.namenode.rpc-address.lzkj.nn2</name>
			<value>lzkj02:9000</value>
		</property>

		<!-- http 管理页面端口 -->
		<property>
			<name>dfs.namenode.http-address.lzkj.nn1</name>
			<value>lzkj01:50070</value>
		</property>
		<property>
			<name>dfs.namenode.http-address.lzkj.nn2</name>
			<value>lzkj02:50070</value>
		</property>


		<property>
			<name>dfs.namenode.shared.edits.dir</name>
			<value>qjournal://lzkj01:8485;lzkj02:8485;lzkj03:8485/lzkj</value>
			<!--
			这是一个配置日志节点的地址，它提供共享的编辑存储，
			由活动的nameNode编写，并由备用nameNode读取，以保持与所有文件系统的更新同步，
			从而更改活动的nameNode。虽然您必须指定几个日志节点地址，但您应该只配置其中一个uri。
			URI的形式应该是:qjournal://*host1:port1*;*host2:port2*;*host3:port3*/*journalId*。
			-->
		</property>

		<property>
			<name>dfs.client.failover.proxy.provider.lzkj</name>
			<value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
			<!--(配置将由DFS客户端使用的Java类的名称，以确定哪些NameNode是当前活动的，
			因此NameNode当前正在服务客户端请求。目前使用Hadoop的唯一实现是配置failoverproxyprovider，
			所以除非使用定制的，否则使用它。) -->
		</property>

		<property>
			<name>dfs.ha.fencing.methods</name>
			<value>sshfence</value>
		</property>

		<property>
			<name>dfs.ha.fencing.ssh.private-key-files</name>
			<value>/root/.ssh/id_rsa</value>
		</property>
</configuration>

```
### core-site.xmlt 的配置

```xml
<configuration>

<!-- 高可用的话这里需要改变 -->
<!--
<property>
	<name>fs.defaultFS</name>
    <value>hdfs://lzkj01:9000</value>
</property>
-->
<!--高可用配置-->
<property>
  <name>fs.defaultFS</name>
  <value>hdfs://lzkj</value>
</property>

<property>
	<name>io.file.buffer.size</name>
    <value>4096</value>
</property>
<!-- 错误解决过程,于此同时格式化的时候下面这个路径是hadoop运行的时候临时文件都在这里生成在/tmp/下面也会产生一部分文件-->
<property>
	<!-- 这个配置官方并没有指出为必须配置项-->
	<name>hadoop.tmp.dir</name>
    <value>file:///usr/local/MyInstall/hadoop-2.7.5/tmp/hadoop-${user.name}</value>
</property>

<!-- journalnode.edits 日志节点守护进程将存储其本地状态的路径-->
<property>
  <name>dfs.journalnode.edits.dir</name>
  <value>/usr/local/MyInstall/hadoop-2.7.5/journalnode_edits/</value>
</property>
</configuration>
```

### yarn-site.xml  / mapred-site.xml  都跟普通配置一样不变~



<a name="HA_hdfs-site.xml">hdfs-site.xml 细节配置</a>
#### dfs.nameservices   // unique identifiers for each NameNode in the nameservice
note: If you are also using HDFS Federation, this configuration setting should also include the list of other nameservices, HA or otherwise, as a comma-separated list.
```xml
<property>
  <name>dfs.nameservices</name>
  <value>lzkj</value>
</property>

```

#### dfs.ha.namenodes.[nameservice ID]  // unique identifiers for each NameNode in the nameservice, 就是namenode 的两个节点
// Note: Currently, only a maximum of two NameNodes may be configured per nameservice.

```xml
<property>
  <name>dfs.ha.namenodes.lzkj</name>
  <value>nn1,nn2</value>
</property>
```

#### dfs.namenode.rpc-address.[nameservice ID].[name node ID] - the fully-qualified RPC address for each NameNode to listen on
For both of the previously-configured NameNode IDs, set the full address and IPC port of the NameNode processs. Note that this results in two separate configuration options. 也就是分开配置两个namenode
Note: You may similarly configure the “servicerpc-address” setting if you so desire.


```xml
<!-- RPC 的端口-->
<property>
  <name>dfs.namenode.rpc-address.lzkj.nn1</name>
  <value>lzkj01:8020</value>
</property>
<property>
  <name>dfs.namenode.rpc-address.lzkj.nn2</name>
  <value>lzkj02:8020</value>
</property>
```

#### dfs.namenode.http-address.[nameservice ID].[name node ID] - the fully-qualified HTTP address for each NameNode to listen on

Similarly to rpc-address above, set the addresses for both NameNodes’ HTTP servers to listen on. For example:

 Note: If you have Hadoop’s security features enabled, you should also set the https-address similarly for each NameNode.
```xml
<!-- http 管理页面端口 -->
<property>
  <name>dfs.namenode.http-address.lzkj.nn1</name>
  <value>lzkj01:50070</value>
</property>
<property>
  <name>dfs.namenode.http-address.lzkj.nn2</name>
  <value>lzkj02:50070</value>
</property>
```

#### dfs.namenode.shared.edits.dir - the URI which identifies the group of JNs where the NameNodes will write/read edits

dfs.namenode.shared.edits.dir - the URI which identifies the group of JNs where the NameNodes will write/read edits

This is where one configures the addresses of the JournalNodes which provide the shared edits storage, written to by the Active nameNode and read by the Standby NameNode to stay up-to-date with all the file system changes the Active NameNode makes. Though you must specify several JournalNode addresses, you should only configure one of these URIs. The URI should be of the form: qjournal://*host1:port1*;*host2:port2*;*host3:port3*/*journalId*. The Journal ID is a unique identifier for this nameservice, which allows a single set of JournalNodes to provide storage for multiple federated namesystems. Though not a requirement, it’s a good idea to reuse the nameservice ID for the journal identifier.

For example, if the JournalNodes for this cluster were running on the machines “node1.example.com”, “node2.example.com”, and “node3.example.com” and the nameservice ID were “mycluster”, you would use the following as the value for this setting (the default port for the JournalNode is 8485):
译文：
这是一个配置日志节点的地址，它提供共享的编辑存储，由活动的nameNode编写，并由备用nameNode读取，以保持与所有文件系统的更新同步，
从而更改活动的nameNode。虽然您必须指定几个日志节点地址，但您应该只配置其中一个uri。URI的形式应该是:qjournal://*host1:port1*;*host2:port2*;*host3:port3*/*journalId*。日志ID是这个nameservice的惟一标识符，它允许一组日志节点为多个联邦namesystem提供存储。
 配置如下
```xml
<property>
			<name>dfs.namenode.shared.edits.dir</name>
			<value>qjournal://lzkj01:8485;lzkj02:8485;lzkj03:8485/lzkj</value>
			<!--
			这是一个配置日志节点的地址，它提供共享的编辑存储，
			由活动的nameNode编写，并由备用nameNode读取，以保持与所有文件系统的更新同步，
			从而更改活动的nameNode。虽然您必须指定几个日志节点地址，但您应该只配置其中一个uri。
			URI的形式应该是:qjournal://*host1:port1*;*host2:port2*;*host3:port3*/*journalId*。
			-->
		</property>
```


#### dfs.client.failover.proxy.provider.[nameservice ID] - the Java class that HDFS clients use to contact the Active NameNode（HDFS客户端使用的Java类来联系活动的NameNode。）

Configure the name of the Java class which will be used by the DFS Client to determine which NameNode is the current Active, and therefore which NameNode is currently serving client requests. The only implementation which currently ships with Hadoop is the ConfiguredFailoverProxyProvider, so use this unless you are using a custom one.
译文：
(配置将由DFS客户端使用的Java类的名称，以确定哪些NameNode是当前活动的，因此NameNode当前正在服务客户端请求。目前使用Hadoop的唯一实现是配置failoverproxyprovider，所以除非使用定制的，否则使用它。)
配置如下
```xml
<property>
  <name>dfs.client.failover.proxy.provider.lzkj</name>
  <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
</property>
```

#### dfs.ha.fencing.methods - a list of scripts or Java classes which will be used to fence the Active NameNode during a failover

脚本或Java类的列表，该列表将用于在故障转移期间保护活动的NameNode。

It is desirable for correctness of the system that only one NameNode be in the Active state at any given time. Importantly, when using the Quorum Journal Manager, only one NameNode will ever be allowed to write to the JournalNodes, so there is no potential for corrupting the file system metadata from a split-brain scenario. However, when a failover occurs, it is still possible that the previous Active NameNode could serve read requests to clients, which may be out of date until that NameNode shuts down when trying to write to the JournalNodes. For this reason, it is still desirable to configure some fencing methods even when using the Quorum Journal Manager. However, to improve the availability of the system in the event the fencing mechanisms fail, it is advisable to configure a fencing method which is guaranteed to return success as the last fencing method in the list. Note that if you choose to use no actual fencing methods, you still must configure something for this setting, for example “shell(/bin/true)”.
译文：
（在任何给定时间，只有一个NameNode处于活动状态的系统的正确性是可取的。重要的是，当使用Quorum日志管理器时，只有一个NameNode将被允许写入日志节点，因此不可能从分裂的大脑场景中损坏文件系统元数据。然而，当发生故障转移时，仍然有可能以前的活动NameNode可以为客户机读取请求，这可能是过时的，直到NameNode在尝试写入日志节点时关闭。出于这个原因，即使在使用仲裁日志管理器时，仍然需要配置一些击剑(这个应该是再给确定死亡的namenode 再来一刀，确保 namenode 是真的死了 ，所以可能才叫做击剑方法)方法。但是，为了提高系统在击剑机制失败的情况下的可用性，最好配置一种击剑方法，保证在列表中最后一种击剑方法的成功。注意，如果您选择不使用实际的击剑方法，您仍然必须为这个设置配置一些东西，例如“shell(/bin/true)”。）

The fencing methods used during a failover are configured as a carriage-return-separated list, which will be attempted in order until one indicates that fencing has succeeded. There are two methods which ship with Hadoop: shell and sshfence. For information on implementing your own custom fencing method, see the org.apache.hadoop.ha.NodeFencer class.
译文：
（在故障转移过程中使用的击剑方法被配置为一列折回分隔的列表，该列表将被尝试，直到其中一个表明击剑成功。有两种使用Hadoop的方法:shell和sshfence。有关实现自己的自定义击剑方法的信息，请参见org.apache.hadoop.ha。NodeFencer类。）

* sshfence - SSH to the Active NameNode and kill the process（SSH到活动的NameNode并杀死进程。）

The sshfence option SSHes to the target node and uses fuser to kill the process listening on the service’s TCP port. In order for this fencing option to work, it must be able to SSH to the target node without providing a passphrase. Thus, one must also configure the dfs.ha.fencing.ssh.private-key-files option, which is a comma-separated list of SSH private key files. For example:
译文：
（sshfence选项向目标节点发送，并使用fuser来终止监听服务的TCP端口上的进程。为了使这个击剑选项发挥作用，它必须能够在不提供口令的情况下SSH到目标节点。因此，还必须配置dfs.ha. fenc. ssh。私钥文件选项，它是一个以逗号分隔的SSH私有密钥文件列表。例如:）

/root/.ssh

```xml
<property>
  <name>dfs.ha.fencing.methods</name>
  <value>sshfence</value>
</property>

<property>
  <name>dfs.ha.fencing.ssh.private-key-files</name>
  <value>/root/.ssh/id_rsa</value>
</property>
```

Optionally, one may configure a non-standard username or port to perform the SSH. One may also configure a timeout, in milliseconds, for the SSH, after which this fencing method will be considered to have failed. It may be configured like so:
译文：
可选地，您可以配置一个非标准的用户名或端口来执行SSH。您还可以为SSH配置一个超时(以毫秒为单位)，在此之后，这个击剑方法将被认为是失败的。可以这样配置:
配置如下(我在这里没有配置这一项，因为也说了是可选的！)

```xml
<property>
      <name>dfs.ha.fencing.methods</name>
      <value>sshfence([[username][:port]])</value>
</property>
<property>
      <name>dfs.ha.fencing.ssh.connect-timeout</name>
      <value>30000</value>
</property>
```
* 下面是配置击剑方法的第二种，使用shell (同样，作为第二种方法这里我只是点出来了)
The shell fencing method runs an arbitrary shell command. It may be configured like so:（shell击剑方法运行一个任意的shell命令。可以这样配置:）

```xml
<property>
      <name>dfs.ha.fencing.methods</name>
      <value>shell(/path/to/my/script.sh arg1 arg2 ...)</value>
</property>

```
```
注意：The string between ‘(’ and ‘)’ is passed directly to a bash shell and may not include any closing parentheses(不包含任何结束符号).

The shell command will be run with an environment set up to contain all of the current Hadoop configuration variables, with the ‘_’ character replacing any ‘.’ characters in the configuration keys. The configuration used has already had any namenode-specific configurations promoted to their generic forms – for example dfs_namenode_rpc-address will contain the RPC address of the target node, even though the configuration may specify that variable as dfs.namenode.rpc-address.ns1.nn1.
译文：
（shell命令将运行一个环境设置，以包含所有当前的Hadoop配置变量，并使用“_”字符替换任何“。”配置键中的字符。所使用的配置已经将任何namenode特定的配置提升为它们的通用表单——例如，dfs_namenode_rpc-address将包含目标节点的RPC地址，即使配置可以指定该变量为dfs.namenode.rpc-address.ns1.nn1。）
如下是官方给出的：

Additionally, the following variables referring to the target node to be fenced are also available:

$target_host 	hostname of the node to be fenced
$target_port 	IPC port of the node to be fenced
$target_address 	the above two, combined as host:port
$target_nameserviceid 	the nameservice ID of the NN to be fenced
$target_namenodeid 	the namenode ID of the NN to be fenced

These environment variables may also be used as substitutions in the shell command itself. For example:


<property>
   <name>dfs.ha.fencing.methods</name>
   <value>shell(/path/to/my/script.sh --nameservice=$target_nameserviceid $target_host:$target_port)</value>
</property>
```

If the shell command returns an exit code of 0, the fencing is determined to be successful. If it returns any other exit code, the fencing was not successful and the next fencing method in the list will be attempted.

Note: This fencing method does not implement any timeout. If timeouts are necessary, they should be implemented in the shell script itself (eg by forking a subshell to kill its parent in some number of seconds).

译文：
（如果shell命令返回一个0的退出码，那么击剑就决定要成功。如果它返回任何其他退出代码，那么击剑就不会成功，列表中的下一个击剑方法将被尝试。
注意:此击剑方法不执行任何超时。如果超时是必要的，它们应该在shell脚本本身中实现(例如，通过forking子shell在若干秒内杀死其父节点)。）

###  core-site.xml 的配置
#### fs.defaultFS - the default path prefix used by the Hadoop FS client when none is given
(当没有给定的时候，Hadoop FS客户端使用的默认路径前缀。)

Optionally, you may now configure the default path for Hadoop clients to use the new HA-enabled logical URI. If you used “mycluster” as the nameservice ID earlier, this will be the value of the authority portion of all of your HDFS paths. This may be configured like so, in your core-site.xml file:

```xml
<property>
  <name>fs.defaultFS</name>
  <value>hdfs://lzkj</value>
</property>
```
#### dfs.journalnode.edits.dir - the path where the JournalNode daemon will store its local state
（日志节点守护进程将存储其本地状态的路径。）
This is the absolute path on the JournalNode machines where the edits and other local state used by the JNs will be stored. You may only use a single path for this configuration. Redundancy for this data is provided by running multiple separate JournalNodes, or by configuring this directory on a locally-attached RAID array. For example:
（这是日志节点机器上的绝对路径，在这里，将存储JNs使用的编辑器和其他本地状态。您可能只对该配置使用一条路径。此数据的冗余是通过运行多个独立的日志节点来提供的，或者通过在本地附加的RAID阵列中配置这个目录来提供。）
配置如下：
```xml
<property>
  <name>dfs.journalnode.edits.dir</name>
  <value>/usr/local/MyInstall/hadoop-2.7.5/journalnode_edits/</value>
</property>
```


---

After all of the necessary configuration options have been set, you must start the JournalNode daemons on the set of machines where they will run. This can be done by running the command “hadoop-daemon.sh start journalnode” and waiting for the daemon to start on each of the relevant machines.
译文：（在设置了所有必要的配置选项之后，您必须在它们将要运行的机器集合上启动日志节点守护进程。这可以通过运行命令“hadoop-daemon”来完成。启动日志节点“并等待守护进程从每个相关的机器上启动。）

Once the JournalNodes have been started, one must initially synchronize the two HA NameNodes’ on-disk metadata.
（一旦开始了日志节点，就必须首先同步两个HA NameNodes的磁盘元数据。）

    If you are setting up a fresh HDFS cluster, you should first run the format command (hdfs namenode -format) on one of NameNodes.
      （如果搭建的是一个新的集群，首先应该格式化format ）

    If you have already formatted the NameNode, or are converting a non-HA-enabled cluster to be HA-enabled, you should now copy over the contents of your NameNode metadata directories to the other, unformatted NameNode by running the command “hdfs namenode -bootstrapStandby” on the unformatted NameNode. Running this command will also ensure that the JournalNodes (as configured by dfs.namenode.shared.edits.dir) contain sufficient edits transactions to be able to start both NameNodes.
      （如果您已经格式化了NameNode，或者正在将一个非ha支持的集群转换为启用ha的，那么您现在应该将NameNode元数据目录的内容复制到另一个未格式化的NameNode上，通过在未格式化的NameNode上运行命令“hdfs NameNode -bootstrapStandby”。运行此命令还可以确保日志节点(由dfs.namenode.sharedidir .edit .dir配置)包含足够的编辑事务，以便能够启动两个NameNodes。）

    If you are converting a non-HA NameNode to be HA, you should run the command “hdfs namenode -initializeSharedEdits”, which will initialize the JournalNodes with the edits data from the local NameNode edits directories.
      （如果您正在将非HA NameNode转换为HA，那么您应该运行“hdfs NameNode - initializesharededit”命令，该命令将使用本地NameNode编辑目录中的edits数据初始化日志节点。）

At this point you may start both of your HA NameNodes as you normally would start a NameNode.（此时，您可以启动您的HA NameNodes，因为您通常会启动一个NameNode。）

You can visit each of the NameNodes’ web pages separately by browsing to their configured HTTP addresses. You should notice that next to the configured address will be the HA state of the NameNode (either “standby” or “active”.) Whenever an HA NameNode starts, it is initially in the Standby state.
译文：
（通过浏览它们配置的HTTP地址，您可以分别访问NameNodes的每个web页面。您应该注意到，在配置的地址旁边将是NameNode的HA状态(“备用”或“active”)。当HA NameNode启动时，它首先处于备用状态。）

## Administrative commands

Now that your HA NameNodes are configured and started, you will have access to some additional commands to administer your HA HDFS cluster. Specifically, you should familiarize yourself with all of the subcommands of the “hdfs haadmin” command. Running this command without any additional arguments will display the following usage information:

Usage: haadmin
    [-transitionToActive <serviceId>]
    [-transitionToStandby <serviceId>]
    [-failover [--forcefence] [--forceactive] <serviceId> <serviceId>]
    [-getServiceState <serviceId>]
    [-checkHealth <serviceId>]
    [-help <command>]


    This guide describes high-level uses of each of these subcommands. For specific usage information of each subcommand, you should run “hdfs haadmin -help <command>”.

        transitionToActive and transitionToStandby - transition the state of the given NameNode to Active or Standby

        These subcommands cause a given NameNode to transition to the Active or Standby state, respectively. These commands do not attempt to perform any fencing, and thus should rarely be used. Instead, one should almost always prefer to use the “hdfs haadmin -failover” subcommand.

        failover - initiate a failover between two NameNodes

        This subcommand causes a failover from the first provided NameNode to the second. If the first NameNode is in the Standby state, this command simply transitions the second to the Active state without error. If the first NameNode is in the Active state, an attempt will be made to gracefully transition it to the Standby state. If this fails, the fencing methods (as configured by dfs.ha.fencing.methods) will be attempted in order until one succeeds. Only after this process will the second NameNode be transitioned to the Active state. If no fencing method succeeds, the second NameNode will not be transitioned to the Active state, and an error will be returned.


        getServiceState - determine whether the given NameNode is Active or Standby

        Connect to the provided NameNode to determine its current state, printing either “standby” or “active” to STDOUT appropriately. This subcommand might be used by cron jobs or monitoring scripts which need to behave differently based on whether the NameNode is currently Active or Standby.

        checkHealth - check the health of the given NameNode

        Connect to the provided NameNode to check its health. The NameNode is capable of performing some diagnostics on itself, including checking if internal services are running as expected. This command will return 0 if the NameNode is healthy, non-zero otherwise. One might use this command for monitoring purposes.

        Note: This is not yet implemented, and at present will always return success, unless the given NameNode is completely down.

---

# 总结
总结：不能着急，越奇葩的问题，看起来越难解决，越不知道从何入手的问题，往往是最简单的问题！静下心来！不能着急！多看日志！多记英文！
暂时命令：
为了部署HA集群，应该准备以下事情：


* NameNode服务器：运行NameNode的服务器应该有相同的硬件配置。

* JournalNode服务器：运行的JournalNode进程非常轻量，可以部署在其他的服务器上。注意：必须允许至少3个节点。当然可以运行更多，但是必须是奇数个，如3、5、7、9个等等。当运行N个节点时，系统可以容忍至少(N-1)/2(N至少为3)个节点失败而不影响正常运行。


# HA QJM 非zookeeper 高可用 问题：

部分问题：

  * 不能配置secondnamenode ：HA 中配置反而会错，还有checkpoint
  在HA集群中，standby状态的NameNode可以完成checkpoint操作，因此没必要配置Secondary NameNode、CheckpointNode、BackupNode。如果真的配置了，还会报错。

 * 启动不起来journode，去看了日志，说是journode 说这个路径应该是自绝对路径，但是我的确是绝对路径啊，

  java.lang.IllegalArgumentException: Journal dir 'file:/usr/local/MyInstall/hadoop-2.7.5/journalnode_edits' should be an absolute path

  随后查了好多，其中看了一个是说绝对路径不需要加file:// 前缀，我试了试，解决了。真坑：
  解决:将HDFS-site.xml中的journalnode属性value的值设置为绝对路径.不需要加file:关键字

**Note:**

* ***Note that, in an HA cluster, the Standby NameNode also performs checkpoints of the namespace state, and thus it is not necessary to run a Secondary NameNode, CheckpointNode, or BackupNode in an HA cluster. In fact, to do so would be an error.***
* ***另外就是需要在配置文件完成之后，先开启journode，然后再同步元数据，之后在执行hdfs namenode -bootstrapStandby***

      * 开启顺序 （这里standby的live node 为零！暂时还解决）
            * 打开普通集群
            * 配置好HA配置
            * 开启守护进程（三台都要开启！目的：共享日至节点，开启8485进程，创建hournode共享日志文件夹）
            * 然后在namenode1 上面再次进行格式化：hdfs namenode -format
                  (注意：这里官方有一句命令：hdfs namenode -initializeSharedEdits)，这里当时特别蒙蔽，也不说清楚，到底是什么时候这一步，也不说是那台机子，好坑，然后经过后面遇到的各种问题，后来又冷静分析。发现还是得用 hdfs namenode -format 在第一个namenode 上面进行格式化，具体我用官方给出的时候报错！网上查有的人说是 hdfs namenode -format 这个命令.但是启动的时候，汇报一个错误，就是应该是也去寻找 namenode3 的name元数据目录了。这个有点不解！暂时留下！
            * 下面是我写的启动脚本！

```shell

#!bin/bash

  echo "先打开普通集群..."
  sh /shenyabo/MyShell/Ha_Hadoop/Open_Gen.sh

  echo "开启 普通集群的namenode ，datanode "
  sh /shenyabo/MyShell/Ha_Hadoop/formatHadoop.sh
  echo "普通集群开启成功！"

  echo "----------找不到9000 端口就是因为把进程都杀了，以前普通集群应该开启了9000端口--------"

  echo "打开高可用配置"
  sh /shenyabo/MyShell/Ha_Hadoop/Open_HA.sh

  echo "转换及群从非HA到HA"
  echo "hadoop-daemon.sh start journalnode ..."

  ssh root@lzkj01 "source /etc/profile ;  rm -rf /usr/local/MyInstall/hadoop-2.7.5/journalnode_edits; hadoop-daemon.sh start journalnode "

  ssh root@lzkj02 "source /etc/profile; rm -rf /home/hadoop/dfs/name ;rm -rf /usr/local/MyInstall/hadoop-2.7.5/journalnode_edits  ;hadoop-daemon.sh start journalnode "

  ssh root@lzkj03 "source /etc/profile ; rm -rf /usr/local/MyInstall/hadoop-2.7.5/journalnode_edits;hadoop-daemon.sh start journalnode  "


  echo "拉取元数据..."
  ssh lzkj01 "source /etc/profile ;scp -r /home/hadoopdata/dfs/name root@lzkj02:/home/hadoopdata/dfs"

  echo "namenode 2 上面的boot"

  sh root@lzkj01 "source /etc/profile ; hdfs namenode -format;"
  #ssh root@lzkj01 "source /etc/profile ; hdfs namenode -initializeSharedEdits;"

  # 注意，下面这两步必须得做，不做也报错
  ssh root@lzkj02 "source /etc/profile ; hdfs namenode -initializeSharedEdits;"
  ssh root@lzkj03 "source /etc/profile ; hdfs namenode -initializeSharedEdits;"

  #ssh root@lzkj01 "scp -r /usr/local/MyInstall/hadoop-2.7.5/logs /usr/local/MyInstall/hadoop-2.7.5/journalnode_edits/"

  ssh root@lzkj02 "source /etc/profile;  hdfs namenode -bootstrapStandby"


```

# 基于zookeeper 的高可用安装 - 基于zookeeper 的安装

## 安装zookeeper 可以看02-Zookeeper的配置，这里就不在叙述

## Hadoop zookeeper 配置

### 失败重配需要如下：

（删除、元数据、数据内容，jouranlnode的数据、zk协调服务数据）cd

元数据：/home/hadata/dfs/name/

数据内容：cd /home/hadata/dfs/data/

jouranlnode的数据：cd /home/hadata/journalnodedata/

zk协调服务数据： /home/zkdata/zookeeper/version-2/ （zookeeper里的数据删了就行）

### 规划
zkfc 这里掌管失败自动转移

lzkj01  ip  namenode/datanode/journalnode/zkFailoverContronal/quroumpeermain

lzkj02 ip  namenode/datanode/journalnode/zkFailoverContronal/quroumpeermain

lzkj03 ip  /datanode/journalnode /quroumpeermain


### 修改配置文件

#### core-site.xml

```xml
<!--指定命名空间的总入口地址-->

<property>
  <name>fs.defaultFS</name>
  <value>hdfs://lzkj</value>
</property>

<property>
	<name>io.file.buffer.size</name>
    <value>4096</value>
</property>
<!-- 错误解决过程,于此同时格式化的时候下面这个路径是hadoop运行的时候临时文件都在这里生成在/tmp/下面也会产生一部分文件-->
<property>
	<!-- 这个配置官方并没有指出为必须配置项-->
	<name>hadoop.tmp.dir</name>
    <value>file:///usr/local/MyInstall/hadoop-2.7.5/tmp/hadoop-${user.name}</value>
</property>

<!-- journalnode.edits 日志节点守护进程将存储其本地状态的路径-->
<property>
  <name>dfs.journalnode.edits.dir</name>
  <value>/usr/local/MyInstall/hadoop-2.7.5/journalnode_edits/</value>
</property>

<!--指定zk的集群地址-->

 <property>

   <name>ha.zookeeper.quorum</name>

   <value>lzkj01:2181,lzkj02:2181,lzkj03:2181</value>

 </property>
</configuration>

```
#### 设置 hdfs-site.xml

```xml
<configuration>
     <!--指定hdfs的副本数,默认是3，如果用虚拟机搭建的话磁盘有限可以改一下数量-->
		<property>
			<name>dfs.replication</name>
			<value>1</value>
		</property>
		<!-- name 元数据存储目录：在本地文件系统上的路径，NameNode会持久存储名称空间和事务日志。-->
		<property>
            <name>dfs.namenode.name.dir</name>
            <value>file:///home/hadoopdata/dfs/name</value>
		</property>
		<!--List of permitted/excluded DataNodes.  dfs.hosts/dfs.hosts.exclude ,data 的DataNode/或者是排除节点(exclude) 节点机器名，-->
		<!--

		<property>
            <name>dfs.hosts</name>
            <value>lzkj01,lzkj02,lzkj03</value>
			<value>192.168.153.128,192.168.153.129,192.168.153.130</value>
		</property>

		-->

		<!-- 指定文件块大小 这里是128MB -->
		<property>
			<name>dfs.blocksize</name>
            <value>134217728</value>
		</property>
		<!-- 	The number of server threads for the namenode. namenode 服务的线程数 -->
		<property>
			<name>dfs.namenode.handler.count</name>
            <value>5</value>
		</property>

<!--是否进行失败自动切换-->
  <property>
    <name>dfs.ha.automatic-failover.enabled</name>
    <value>true</value>
  </property>

		<!-- 下面是为DataNode准备的-->
		<property>
			<name>dfs.datanode.data.dir</name>
            <value>file:///home/hadoopdata/dfs/data</value>
		</property>


		<!-- 如下是配置的其他配置-->
		<!--
		如果配置高可用， 这两个不能配置，secondnamenode 、checkpoint ，因为standby 自己会做检测，所以配置了就会有问题
			 // 文件系统检测目录
	   <property>
			<name>dfs.namenode.checkpoint.dir</name>
			<value>file:///home/hadoopdata/checkpoint/dfs/fsimagename</value>
	   </property>

	   // edits的检测目录
		<property>
			<name>dfs.namenode.checkpoint.edits.dir</name>
			<value>file:///home/hadoopdata/checkpoint/dfs/editname</value>
		</property>
		-->
		<!--是否开启文件系统权限
		namenode的hdfs-site.xml是必须将dfs.webhdfs.enabled属性设置为true，
		否则就不能使用webhdfs的LISTSTATUS、LISTFILESTATUS等需要列出文件、文件夹状态的命令，
		因为这些信息都是由namenode来保存的。 -->
		<property>
			<name>dfs.permissions.enabled</name>
			<value>true</value>
		</property>
		<!--是否启用rest api访问hdfs-->
		<property>
			<name>dfs.webhdfs.enabled</name>
			<value>true</value>
		</property>


	   <!--指定snn的web ui监控地址 HA 配制的时候不能配置这个-->
		<!--
			<property>
		   <name>dfs.namenode.secondary.http-address</name>
		   <value>lzkj02:50090</value>
		</property>
		-->

		<!--错误修改 -->
		<!-- 报告编译线程 的间隔 1-1000 之间有效 -->
		<property>
		   <name>dfs.datanode.directoryscan.throttle.limit.ms.per.sec</name>
		   <value>1000</value>
		   <!--
		   The report compilation threads are limited to only running for a given number of milliseconds per second,
		   as configured by the property.
		   The limit is taken per thread,
		   not in aggregate, e.g.
		   setting a limit of 100ms for 4 compiler threads will result in each thread being limited to 100ms, not 25ms.
		   Note that the throttle does not interrupt the report compiler threads, so the actual running time of the threads per second will typically be somewhat higher than the throttle limit,
		   usually by no more than 20%. Setting this limit to 1000 disables compiler thread throttling. Only values between 1 and 1000 are valid. Setting an invalid value will result in the throttle being disbled and an error message being logged.
		   1000 is the default setting.
		   -->
		</property>
		<!-- 一下是高可用配置，上方的配置搭建普通集群就可以了 lzkj就是你的服务名，nn1,nn2 也是可以随意设置，-->
		<property>
			<name>dfs.nameservices</name>
			<value>lzkj</value>
		</property>

		<!-- namenode 的两个机器名字，注意目前只能有两个namenode-->
		<property>
			<name>dfs.ha.namenodes.lzkj</name>
			<value>nn1,nn2</value>
		</property>

		<!-- RPC 的端口-->
		<property>
			<name>dfs.namenode.rpc-address.lzkj.nn1</name>
			<value>lzkj01:9000</value>
		</property>
		<property>
			<name>dfs.namenode.rpc-address.lzkj.nn2</name>
			<value>lzkj02:9000</value>
		</property>

		<!-- http 管理页面端口 -->
		<property>
			<name>dfs.namenode.http-address.lzkj.nn1</name>
			<value>lzkj01:50070</value>
		</property>
		<property>
			<name>dfs.namenode.http-address.lzkj.nn2</name>
			<value>lzkj02:50070</value>
		</property>

		<property>
			<name>dfs.namenode.shared.edits.dir</name>
			<value>qjournal://lzkj01:8485;lzkj02:8485;lzkj03:8485/lzkj</value>
			<!--
			这是一个配置日志节点的地址，它提供共享的编辑存储，
			由活动的nameNode编写，并由备用nameNode读取，以保持与所有文件系统的更新同步，
			从而更改活动的nameNode。虽然您必须指定几个日志节点地址，但您应该只配置其中一个uri。
			URI的形式应该是:qjournal://*host1:port1*;*host2:port2*;*host3:port3*/*journalId*。
			-->
		</property>

		<property>
			<name>dfs.client.failover.proxy.provider.lzkj</name>
			<value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
			<!--(配置将由DFS客户端使用的Java类的名称，以确定哪些NameNode是当前活动的，
			因此NameNode当前正在服务客户端请求。目前使用Hadoop的唯一实现是配置failoverproxyprovider，
			所以除非使用定制的，否则使用它。) -->
		</property>

		<property>
			<name>dfs.ha.fencing.methods</name>
			<value>sshfence</value>
		</property>

		<property>
			<name>dfs.ha.fencing.ssh.private-key-files</name>
			<value>/root/.ssh/id_rsa</value>
		</property>

		<property>

		  <name>dfs.ha.fencing.ssh.connect-timeout</name>

		  <value>30000</value>

		</property>
</configuration>
```
### 分发给小弟配置文件，注意这里的yarn 与mappreduce 的配置不需要分发，你自己随意了
### 开启集群

### 这里开启过程写入道了一个shell 脚本中，如下：
说明：
  每次启动的时候，都需要把相应的文件夹，与文件删除，其实也就是四个地方：
      * hdfs 的元数据路径 /name
      * 数据路径 /data ，
      * 日志共享路径 /journode
      * zookeeper 数据存储路径
说明2：
  注意开启journode ，且每个节点都需要开启，否则会提示8485 访问不到，开启journode 其实就是创建日志共享目录
   * 第二个节点hdfs namenode -bootstrapStandby 之前切记，一定要先开启namenode1 上面的namenode ，随后复制namenode1 格式化生成的name元数据目录到第二个节点上。才可以执行-bootstrapStandby 命令。如果没有开启namenode的话，会提示找不到9000 ,(这里注意官网上说的是配置8020 这里需要注意)
   * 随后就可以看到集群开启成功！
```java
#!bin/bash
echo "格式化之前需要删除四个地方的文件，journode/zkData/name/data 四个地方"

ssh lzkj01 "source /etc/profile;killall java ; rm -rf /home/hadoopdata; rm -rf  /usr/local/MyInstall/hadoop-2.7.5/journalnode_edits ;rm -rf /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/version-2*"

ssh lzkj02 "source /etc/profile;killall java ;rm -rf /home/hadoopdata; rm -rf  /usr/local/MyInstall/hadoop-2.7.5/journalnode_edits ;rm -rf /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/version-2*"

ssh lzkj03 "source /etc/profile;killall java ;rm -rf /home/hadoopdata; rm -rf  /usr/local/MyInstall/hadoop-2.7.5/journalnode_edits ;rm -rf /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/version-2*"

echo "删除所需文件成功,！"
echo "格式化zookeeper"
#sh /shenyabo/MyShell/Zo_HA_Hadoop/zkformat.sh
echo "开启zookeeper"
echo "lzkj01:"
ssh lzkj01 "source /etc/profile; zkServer.sh start ; zkService.sh status"
echo "lzkj02:"
ssh lzkj02 "source /etc/profile; zkServer.sh start ; zkService.sh status"
echo "lzkj03:"
ssh lzkj03 "source /etc/profile; zkServer.sh start ;zkService.sh status"
echo "开启journode"
ssh lzkj01 "source /etc/profile; hadoop-daemon.sh start journalnode "
ssh lzkj02 "source /etc/profile; hadoop-daemon.sh start journalnode "
ssh lzkj03 "source /etc/profile; hadoop-daemon.sh start journalnode "
echo "然后格式化namenode1..."
ssh lzkj01 "source /etc/profile; hdfs  namenode -format; hadoop-daemon.sh start namenode ;scp -r /home/hadoopdata/dfs/name lzkj02:/home/hadoopdata/dfs/; "
echo "hdfs namenode -bootstrapStandby....."
ssh lzkj02 "source /etc/profile; hdfs namenode -bootstrapStandby "
echo "格式化zkfc "
ssh lzkj01 "source /etc/profile ; hdfs zkfc -formatZK; start-dfs.sh"
```
# 启动hadoop 的一些命令使用

```
快启动
start-dfs.sh
stop-dfs.sh
start-yarn.sh
stop-yarn.sh

单个启动
Hadoop-deamon.sh    start/stop/    namenode/datanode/secondarynamenode

Yar-daemon.sh    start/stop resourcemanager/nodemanager

mr-jobhistory-daemon.sh  start/stop  historyserver    --》mr-jobhistory-daemon.sh start historyserver



HA:中的一些命令：

hdfs NameNode -bootstrapStandby ：这个应该是在 第二个namenode 上面运行命令，拉去元数据

hdfs NameNode - initializesharededit：
  如果您正在将非HA NameNode转换为HA，那么您应该运行“hdfs NameNode - initializesharededit”命令，该命令将使用本地NameNode编辑目录中的edits数据初始化日志节点

HA 命令：


```


# Hadoop命令

[原地址](https://segmentfault.com/a/1190000002672666)

```

```

# 端口说明

```
9000 是配置hdfs的端口
50070 是文件系统端口
8088 是yarn 的web端口
19888 是以后需要的聚合日志的端口，查看任务日志,jobhistory.webapp.address
8032： yarn.resourcemanager.address  ：	${yarn.resourcemanager.hostname}:8032



进程：
NameNode
DataNode

Yarn:
ResourceManager
NodeManager
JobHistory

HA：
JournalNodes :守护进程
      In order for the Standby node to keep its state synchronized with the Active node, both nodes communicate with a group of separate daemons called “JournalNodes” (JNs). 也就是stnadby 一直保持同步 active 的状态

8020 ： dfs.namenode.rpc-address namenode rpc 的端口
8485 : 这是一个配置日志节点的地址，它提供共享的编辑存储，由活动的nameNode编写，并由备用nameNode读取，以保持与所有文件系统的更新同步，

HA:zookeeper
在这里，hdfs中的 rpc地址不能为8020 ,应该设置为9000，因为默认开启namenode之后，在第二台节点，namenode会访问第一个节点的9000端口

```

# 用的到的linux命令

## [防火墙相关](https://www.linuxidc.com/Linux/2016-12/138979.htm)

# ambira 集群
  [博客地址](http://www.cnblogs.com/braveym/p/8847905.html)
# cdh 集群
