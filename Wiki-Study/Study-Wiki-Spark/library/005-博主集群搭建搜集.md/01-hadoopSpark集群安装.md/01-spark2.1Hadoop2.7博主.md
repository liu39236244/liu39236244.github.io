# 记录博主安装集群记录

## 博主原文地址
https://www.cnblogs.com/zengxiaoliang/p/6478859.html
##  摘录

```
1.选取三台服务器（CentOS系统64位）

　　114.55.246.88 主节点

　　114.55.246.77 从节点

　　114.55.246.93 从节点

     之后的操作如果是用普通用户操作的话也必须知道root用户的密码，因为有些操作是得用root用户操作。如果是用root用户操作的话就不存在以上问题。

　　我是用root用户操作的。

2.修改hosts文件

　　修改三台服务器的hosts文件。

　　vi /etc/hosts

　　在原文件的基础最后面加上：

114.55.246.88 Master
114.55.246.77 Slave1
114.55.246.93 Slave2

　　修改完成后保存执行如下命令。

　　source /etc/hosts

3.ssh无密码验证配置

　　3.1安装和启动ssh协议

　　我们需要两个服务：ssh和rsync。

　　可以通过下面命令查看是否已经安装：

　　rpm -qa|grep openssh

　　rpm -qa|grep rsync

　　如果没有安装ssh和rsync，可以通过下面命令进行安装：

　　yum install ssh （安装ssh协议）

　　yum install rsync （rsync是一个远程数据同步工具，可通过LAN/WAN快速同步多台主机间的文件）

　　service sshd restart （启动服务）

　　3.2 配置Master无密码登录所有Salve

　　配置Master节点，以下是在Master节点的配置操作。

　　1）在Master节点上生成密码对，在Master节点上执行以下命令：

　　ssh-keygen -t rsa -P ''

　　生成的密钥对：id_rsa和id_rsa.pub，默认存储在"/root/.ssh"目录下。

　　2）接着在Master节点上做如下配置，把id_rsa.pub追加到授权的key里面去。

　　cat ~/.ssh/id_rsa.pub >> ~/.ssh/authorized_keys

　　3）修改ssh配置文件"/etc/ssh/sshd_config"的下列内容，将以下内容的注释去掉：

　　RSAAuthentication yes # 启用 RSA 认证

　　PubkeyAuthentication yes # 启用公钥私钥配对认证方式

　　AuthorizedKeysFile .ssh/authorized_keys # 公钥文件路径（和上面生成的文件同）

　　4）重启ssh服务，才能使刚才设置有效。

　　service sshd restart

　　5）验证无密码登录本机是否成功。

　　ssh localhost

　　6）接下来的就是把公钥复制到所有的Slave机器上。使用下面的命令进行复制公钥：

　　scp /root/.ssh/id_rsa.pub root@Slave1:/root/

　　scp /root/.ssh/id_rsa.pub root@Slave2:/root/

　　

　　接着配置Slave节点，以下是在Slave1节点的配置操作。

　　1）在"/root/"下创建".ssh"文件夹，如果已经存在就不需要创建了。

　　mkdir /root/.ssh

　　2）将Master的公钥追加到Slave1的授权文件"authorized_keys"中去。

　　cat /root/id_rsa.pub >> /root/.ssh/authorized_keys

　　3）修改"/etc/ssh/sshd_config"，具体步骤参考前面Master设置的第3步和第4步。

　　4）用Master使用ssh无密码登录Slave1

　　ssh 114.55.246.77

　　5）把"/root/"目录下的"id_rsa.pub"文件删除掉。

　　rm –r /root/id_rsa.pub

　　重复上面的5个步骤把Slave2服务器进行相同的配置。

　　3.3 配置所有Slave无密码登录Master

　　以下是在Slave1节点的配置操作。

　　1）创建"Slave1"自己的公钥和私钥，并把自己的公钥追加到"authorized_keys"文件中，执行下面命令：

　　ssh-keygen -t rsa -P ''

　　cat /root/.ssh/id_rsa.pub >> /root/.ssh/authorized_keys

　　2）将Slave1节点的公钥"id_rsa.pub"复制到Master节点的"/root/"目录下。

　　scp /root/.ssh/id_rsa.pub root@Master:/root/

　　

　　以下是在Master节点的配置操作。

　　1）将Slave1的公钥追加到Master的授权文件"authorized_keys"中去。

　　cat ~/id_rsa.pub >> ~/.ssh/authorized_keys

　　2）删除Slave1复制过来的"id_rsa.pub"文件。

　　rm –r /root/id_rsa.pub



　　配置完成后测试从Slave1到Master无密码登录。

　　ssh 114.55.246.88

　　按照上面的步骤把Slave2和Master之间建立起无密码登录。这样，Master能无密码验证登录每个Slave，每个Slave也能无密码验证登录到Master。

4.安装基础环境（JAVA和SCALA环境）

　　4.1 Java1.8环境搭建

　　1）下载jdk-8u121-linux-x64.tar.gz解压

　　tar -zxvf jdk-8u121-linux-x64.tar.gz

　　2）添加Java环境变量，在/etc/profile中添加：

export JAVA_HOME=/usr/local/jdk1.8.0_121
PATH=$JAVA_HOME/bin:$PATH
CLASSPATH=.:$JAVA_HOME/lib/rt.jar
export JAVA_HOME PATH CLASSPATH

　　3）保存后刷新配置

　　source /etc/profile

　　4.2 Scala2.11.8环境搭建

　　1）下载scala安装包scala-2.11.8.rpm安装

　　rpm -ivh scala-2.11.8.rpm

　　2）添加Scala环境变量，在/etc/profile中添加：

export SCALA_HOME=/usr/share/scala
export PATH=$SCALA_HOME/bin:$PATH

　　3）保存后刷新配置

　　source /etc/profile

5.Hadoop2.7.3完全分布式搭建

　　以下是在Master节点操作：

　　1）下载二进制包hadoop-2.7.3.tar.gz

　　2）解压并移动到相应目录，我习惯将软件放到/opt目录下，命令如下：

　　tar -zxvf hadoop-2.7.3.tar.gz

　　mv hadoop-2.7.3 /opt

　　3）修改相应的配置文件。

　　修改/etc/profile，增加如下内容：
复制代码

 export HADOOP_HOME=/opt/hadoop-2.7.3/
 export PATH=$PATH:$HADOOP_HOME/bin
 export PATH=$PATH:$HADOOP_HOME/sbin
 export HADOOP_MAPRED_HOME=$HADOOP_HOME
 export HADOOP_COMMON_HOME=$HADOOP_HOME
 export HADOOP_HDFS_HOME=$HADOOP_HOME
 export YARN_HOME=$HADOOP_HOME
 export HADOOP_ROOT_LOGGER=INFO,console
 export HADOOP_COMMON_LIB_NATIVE_DIR=$HADOOP_HOME/lib/native
 export HADOOP_OPTS="-Djava.library.path=$HADOOP_HOME/lib"

复制代码

　　修改完成后执行：

　　source /etc/profile



　　修改$HADOOP_HOME/etc/hadoop/hadoop-env.sh，修改JAVA_HOME 如下：

  export JAVA_HOME=/usr/local/jdk1.8.0_121

　　

　　修改$HADOOP_HOME/etc/hadoop/slaves，将原来的localhost删除，改成如下内容：

Slave1
Slave2

　　

　　修改$HADOOP_HOME/etc/hadoop/core-site.xml
复制代码

<configuration>
      <property>
          <name>fs.defaultFS</name>
          <value>hdfs://Master:9000</value>
      </property>
      <property>
         <name>io.file.buffer.size</name>
         <value>131072</value>
     </property>
     <property>
          <name>hadoop.tmp.dir</name>
          <value>/opt/hadoop-2.7.3/tmp</value>
     </property>
</configuration>

复制代码

　　

　　修改$HADOOP_HOME/etc/hadoop/hdfs-site.xml
复制代码

<configuration>
    <property>
      <name>dfs.namenode.secondary.http-address</name>
      <value>Master:50090</value>
    </property>
    <property>
      <name>dfs.replication</name>
      <value>2</value>
    </property>
    <property>
      <name>dfs.namenode.name.dir</name>
      <value>file:/opt/hadoop-2.7.3/hdfs/name</value>
    </property>
    <property>
      <name>dfs.datanode.data.dir</name>
      <value>file:/opt/hadoop-2.7.3/hdfs/data</value>
    </property>
</configuration>

复制代码



　　复制template，生成xml，命令如下：

　　cp mapred-site.xml.template mapred-site.xml

　　修改$HADOOP_HOME/etc/hadoop/mapred-site.xml
复制代码

<configuration>
 <property>
    <name>mapreduce.framework.name</name>
    <value>yarn</value>
  </property>
  <property>
          <name>mapreduce.jobhistory.address</name>
          <value>Master:10020</value>
  </property>
  <property>
          <name>mapreduce.jobhistory.address</name>
          <value>Master:19888</value>
  </property>
</configuration>

复制代码



　　修改$HADOOP_HOME/etc/hadoop/yarn-site.xml
复制代码

<configuration>
     <property>
         <name>yarn.nodemanager.aux-services</name>
         <value>mapreduce_shuffle</value>
     </property>
     <property>
         <name>yarn.resourcemanager.address</name>
         <value>Master:8032</value>
     </property>
     <property>
         <name>yarn.resourcemanager.scheduler.address</name>
         <value>Master:8030</value>
     </property>
     <property>
         <name>yarn.resourcemanager.resource-tracker.address</name>
         <value>Master:8031</value>
     </property>
     <property>
         <name>yarn.resourcemanager.admin.address</name>
         <value>Master:8033</value>
     </property>
     <property>
         <name>yarn.resourcemanager.webapp.address</name>
         <value>Master:8088</value>
     </property>
</configuration>

复制代码



　　4）复制Master节点的hadoop文件夹到Slave1和Slave2上。

　　scp -r /opt/hadoop-2.7.3 root@Slave1:/opt

　　scp -r /opt/hadoop-2.7.3 root@Slave2:/opt



　　5）在Slave1和Slave2上分别修改/etc/profile，过程同Master一样。

　　6）在Master节点启动集群，启动之前格式化一下namenode：

　　hadoop namenode -format

　　启动：

　　/opt/hadoop-2.7.3/sbin/start-all.sh

　　至此hadoop的完全分布式环境搭建完毕。

　　

　　7）查看集群是否启动成功：

　　jps

　　Master显示：

　　SecondaryNameNode

　　ResourceManager

　　NameNode

　　

　　Slave显示：

　　NodeManager

　　DataNode

6.Spark2.1.0完全分布式环境搭建

　　以下操作都在Master节点进行。

　　1）下载二进制包spark-2.1.0-bin-hadoop2.7.tgz

　　2）解压并移动到相应目录，命令如下：

　　tar -zxvf spark-2.1.0-bin-hadoop2.7.tgz

　　mv hadoop-2.7.3 /opt

　　3）修改相应的配置文件。

　　修改/etc/profie，增加如下内容：

export SPARK_HOME=/opt/spark-2.1.0-bin-hadoop2.7/
export PATH=$PATH:$SPARK_HOME/bin

　　

　　复制spark-env.sh.template成spark-env.sh

　　cp spark-env.sh.template spark-env.sh

　　修改$SPARK_HOME/conf/spark-env.sh，添加如下内容：
复制代码

export JAVA_HOME=/usr/local/jdk1.8.0_121
export SCALA_HOME=/usr/share/scala
export HADOOP_HOME=/opt/hadoop-2.7.3
export HADOOP_CONF_DIR=/opt/hadoop-2.7.3/etc/hadoop
export SPARK_MASTER_IP=114.55.246.88
export SPARK_MASTER_HOST=114.55.246.88
export SPARK_LOCAL_IP=114.55.246.88
export SPARK_WORKER_MEMORY=1g
export SPARK_WORKER_CORES=2
export SPARK_HOME=/opt/spark-2.1.0-bin-hadoop2.7
export SPARK_DIST_CLASSPATH=$(/opt/hadoop-2.7.3/bin/hadoop classpath)

复制代码



　　复制slaves.template成slaves

　　cp slaves.template slaves

　　修改$SPARK_HOME/conf/slaves，添加如下内容：

Master
Slave1
Slave2

　　4）将配置好的spark文件复制到Slave1和Slave2节点。

　　scp /opt/spark-2.1.0-bin-hadoop2.7 root@Slave1:/opt

      scp /opt/spark-2.1.0-bin-hadoop2.7 root@Slave2:/opt

　　5）修改Slave1和Slave2配置。

　　在Slave1和Slave2上分别修改/etc/profile，增加Spark的配置，过程同Master一样。

　　在Slave1和Slave2修改$SPARK_HOME/conf/spark-env.sh，将export SPARK_LOCAL_IP=114.55.246.88改成Slave1和Slave2对应节点的IP。

　　6）在Master节点启动集群。

　　/opt/spark-2.1.0-bin-hadoop2.7/sbin/start-all.sh

　　7）查看集群是否启动成功：

　　jps

　　Master在Hadoop的基础上新增了：

　　Master

　　

　　Slave在Hadoop的基础上新增了：

　　Worker
```
