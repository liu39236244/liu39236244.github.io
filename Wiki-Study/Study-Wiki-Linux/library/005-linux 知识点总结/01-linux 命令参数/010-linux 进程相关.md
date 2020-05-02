# linux 进程相关

# ps 命令参数详解

原文地址：https://www.cnblogs.com/sexybear/p/Linux_ps.html
```
---------------------------------------------------
1.
名称：ps
使用权限：所有使用者
使用方式：ps [options] [--help]
说明：显示瞬间行程 (process) 的动态
参数：ps的参数非常多, 在此仅列出几个常用的参数并大略介绍含义
-A    列出所有的进程
-w    显示加宽可以显示较多的资讯
-au    显示较详细的资讯
-aux    显示所有包含其他使用者的行程

---------------------------------------------------
2. 常用参数

-A 显示所有进程（等价于-e）(utility)
-a 显示一个终端的所有进程，除了会话引线
-N 忽略选择。
-d 显示所有进程，但省略所有的会话引线(utility)
-x 显示没有控制终端的进程，同时显示各个命令的具体路径。dx不可合用。（utility）
-p pid 进程使用cpu的时间
-u uid or username 选择有效的用户id或者是用户名
-g gid or groupname 显示组的所有进程。
U username 显示该用户下的所有进程，且显示各个命令的详细路径。如:ps U zhang;(utility)
-f 全部列出，通常和其他选项联用。如：ps -fa or ps -fx and so on.
-l 长格式（有F,wchan,C 等字段）
-j 作业格式
-o 用户自定义格式。
v 以虚拟存储器格式显示
s 以信号格式显示
-m 显示所有的线程
-H 显示进程的层次(和其它的命令合用，如：ps -Ha)（utility）
e 命令之后显示环境（如：ps -d e; ps -a e）(utility)
h 不显示第一行

---------------------------------------------------
3. 常用命令

ps命令常用用法（方便查看系统进程）

1）ps a 显示现行终端机下的所有程序，包括其他用户的程序。
2）ps -A 显示所有进程。
3）ps c 列出程序时，显示每个程序真正的指令名称，而不包含路径，参数或常驻服务的标示。
4）ps -e 此参数的效果和指定"A"参数相同。
5）ps e 列出程序时，显示每个程序所使用的环境变量。
6）ps f 用ASCII字符显示树状结构，表达程序间的相互关系。
7）ps -H 显示树状结构，表示程序间的相互关系。
8）ps -N 显示所有的程序，除了执行ps指令终端机下的程序之外。
9）ps s 采用程序信号的格式显示程序状况。
10）ps S 列出程序时，包括已中断的子程序资料。
11）ps -t<终端机编号> 　指定终端机编号，并列出属于该终端机的程序的状况。
12）ps u 　以用户为主的格式来显示程序状况。
13）ps x 　显示所有程序，不以终端机来区分。
最常用的方法是ps -aux,然后再利用一个管道符号导向到grep去查找特定的进程,然后再对特定的进程进行操作。
---------------------------------------------------
4. ps aux 每一列的字段描述

Head标头：

USER    用户名
UID    用户ID（User ID）
PID    进程ID（Process ID）
PPID    父进程的进程ID（Parent Process id）
SID    会话ID（Session id）
%CPU    进程的cpu占用率
%MEM    进程的内存占用率
VSZ    进程所使用的虚存的大小（Virtual Size）
RSS    进程使用的驻留集大小或者是实际内存的大小，Kbytes字节。
TTY    与进程关联的终端（tty）
STAT    进程的状态：进程状态使用字符表示的（STAT的状态码）
R 运行    Runnable (on run queue)            正在运行或在运行队列中等待。
S 睡眠    Sleeping                休眠中, 受阻, 在等待某个条件的形成或接受到信号。
I 空闲    Idle
Z 僵死    Zombie（a defunct process)        进程已终止, 但进程描述符存在, 直到父进程调用wait4()系统调用后释放。
D 不可中断    Uninterruptible sleep (ususally IO)    收到信号不唤醒和不可运行, 进程必须等待直到有中断发生。
T 终止    Terminate                进程收到SIGSTOP, SIGSTP, SIGTIN, SIGTOU信号后停止运行运行。
P 等待交换页
W 无驻留页    has no resident pages        没有足够的记忆体分页可分配。
X 死掉的进程
< 高优先级进程                    高优先序的进程
N 低优先    级进程                    低优先序的进程
L 内存锁页    Lock                有记忆体分页分配并缩在记忆体内
s 进程的领导者（在它之下有子进程）；
l 多进程的（使用 CLONE_THREAD, 类似 NPTL pthreads）
+ 位于后台的进程组
START    进程启动时间和日期
TIME    进程使用的总cpu时间
COMMAND    正在执行的命令行命令
NI    优先级(Nice)
PRI    进程优先级编号(Priority)
WCHAN    进程正在睡眠的内核函数名称；该函数的名称是从/root/system.map文件中获得的。
FLAGS    与进程相关的数字标识

========================================
每个进程的详细解读：
https://blog.csdn.net/ahjxhy2010/article/details/51177618

---------------------------------------------------
4.1 排序例子
例子:
查看当前系统进程的uid,pid,stat,pri, 以uid号排序.
ps -eo pid,stat,pri,uid –sort uid

查看当前系统进程的user,pid,stat,rss,args, 以rss排序.
ps -eo user,pid,stat,rss,args –sort rss

---------------------------------------------------



```
# KILL命令 解释
原文地址：https://www.cnblogs.com/sexybear/p/Linux_ps.html
```
4、kill 终止（杀死）进程，有十几种控制进程的方法，下面是一些常用的方法:
[root@localhost ~]#kill -STOP [pid]
发送SIGSTOP (17,19,23)停止一个进程，而并不消灭这个进程。
[root@localhost ~]#kill -CONT [pid]
发送SIGCONT (19,18,25)重新开始一个停止的进程。
[root@localhost ~]#kill -KILL [pid]
发送SIGKILL (9)强迫进程立即停止，并且不实施清理操作。
[root@localhost ~]#kill -9 -1
终止你拥有的全部进程。
SIGKILL 和 SIGSTOP 信号不能被捕捉、封锁或者忽略，但是，其它的信号可以。所以这是你的终极武器。
```

# 进程名字判断,jps 命令
## 1-jps 命令参数

```
-q 	只输出LVMID,省略主类的名称
-m 	输出启动时，传给main（）函数的参数
-l 	输出主类全类名
-v 	输出jvm参数
```
### 1-1 查看jps 路径
  pwdx 进程id
## 2-进程名字判断进程
  ps -ef | grep ApacheJetspeed
  ps -efH | grep NameNode
## 3-jps  查看参数
  jps -v |grep 4502

## 4- jps 查看进程的全路径
  * 1 : ps -ef|grep python
  * 2 : ll /proc/进程id
## Kill 直接杀掉 查出来的进程id
原文地址：https://blog.csdn.net/dax1n/article/details/66969645
```
jps | grep RunJar  ：是获取进程名字为RunJar的java进程，输出信息为：

[daxin@node ~]$  9564 RunJar


jps | grep RunJar | awk '{print $1}' 是打印jps | grep RunJar 的输出的第二个参数，输出为：9564


所以kill -9 `jps | grep RunJar | awk '{print $1}'`直接生成的命令就是：

kill -9  9564  

案例如下：
jps -lm |grep DataNode
4735 org.apache.hadoop.hdfs.server.datanode.DataNode
[hdfs@NUC-1 sbin]$ pwdx 4136
4136: /data/hdfs/zookeeper-3.4.6/bin
[hdfs@NUC-1 sbin]$ jps |grep DataNode
4735 DataNode
[hdfs@NUC-1 sbin]$ jps |grep DataNode | awk '{print $1}'
4735
[hdfs@NUC-1 sbin]$ jps |grep DataNode | awk '{print $2}'
DataNode
```


## ps 命令


```
netstat -nap | grep pid
```


## 查看进程，进程详情

### 1- lsof
```
[root@boloveshi logs]# lsof -i:8080
COMMAND   PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
java    11937 root   47u  IPv6  62249      0t0  TCP *:webcache (LISTEN)


```

### 2-ps -aux

```
[root@boloveshi logs]# ps aux|grep 11937
root     11937  1.5  8.2 2317836 83796 pts/1   Sl   07:56   0:03 /usr/bin/java -Djava.util.logging.config.file=/shenyabo/MyInstall/apache-tomcat-8.0.52/conf/logging.properties -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djdk.tls.ephemeralDHKeySize=2048 -Djava.protocol.handler.pkgs=org.apache.catalina.webresources -Dignore.endorsed.dirs= -classpath /shenyabo/MyInstall/apache-tomcat-8.0.52/bin/bootstrap.jar:/shenyabo/MyInstall/apache-tomcat-8.0.52/bin/tomcat-juli.jar -Dcatalina.base=/shenyabo/MyInstall/apache-tomcat-8.0.52 -Dcatalina.home=/shenyabo/MyInstall/apache-tomcat-8.0.52 -Djava.io.tmpdir=/shenyabo/MyInstall/apache-tomcat-8.0.52/temp org.apache.catalina.startup.Bootstrap start
root     12185  0.0  0.0 112704   968 pts/1    S+   08:00   0:00 grep --color=auto 11937

```

### 3- 查看进程详细信息


* 1- ps -ef | grep 进程ID
```

[hdfs@NUC-1 zookeeper-3.4.6]$ ps -ef |grep 4136
hdfs      4136     1  0 09:31 pts/2    00:00:01 /opt/jdk1.8.0_66/bin/java -Dzookeeper.log.dir=. -Dzookeeper.root.logger=INFO,CONSOLE -cp /data/hdfs/zookeeper-3.4.6/bin/../build/classes:/data/hdfs/zookeeper-3.4.6/bin/../build/lib/*.jar:/data/hdfs/zookeeper-3.4.6/bin/../lib/slf4j-log4j12-1.6.1.jar:/data/hdfs/zookeeper-3.4.6/bin/../lib/slf4j-api-1.6.1.jar:/data/hdfs/zookeeper-3.4.6/bin/../lib/netty-3.7.0.Final.jar:/data/hdfs/zookeeper-3.4.6/bin/../lib/log4j-1.2.16.jar:/data/hdfs/zookeeper-3.4.6/bin/../lib/jline-0.9.94.jar:/data/hdfs/zookeeper-3.4.6/bin/../zookeeper-3.4.6.jar:/data/hdfs/zookeeper-3.4.6/bin/../src/java/lib/*.jar:/data/hdfs/zookeeper-3.4.6/bin/../conf:.:/opt/jdk1.8.0_66/lib:/opt/jdk1.8.0_66/jre/lib -Dcom.sun.management.jmxremote -Dcom.sun.management.jmxremote.local.only=false org.apache.zookeeper.server.quorum.QuorumPeerMain /data/hdfs/zookeeper-3.4.6/bin/../conf/zoo.cfg
hdfs      6064  2558  0 09:56 pts/0    00:00:00 grep 4136
```

* 2- ps -u --pid 4136

```

```

* 3- linux按照指定名称查找进程信息

原文地址：https://www.cnblogs.com/xingzc/p/5986444.html
```
Linux 查找指定名称的进程并显示进程详细信息

实际应用中可能有这样的场景：给定一个进程名称特征串，查找所有匹配该进程名称的进程的详细信息。

解决的办法是：

(1) 先用pgrep [str] 命令进行模糊匹配，找到匹配该特征串的进程ID；

(2) 其次根据进程ID显示指定的进程信息，ps --pid [pid]；

(3) 因为查找出来的进程ID需要被作为参数传递给ps命令，故使用xargs命令，通过管道符号连接；

(4) 最后显示进程详细信息，需要加上-u参数。

最终命令形如:

pgrep Java | xargs ps -u --pid
```

* 4- linux 根据id 查找最详细的进程信息
原文地址： https://blog.csdn.net/chenyulancn/article/details/52956394

* 4-1 top 查看进程
* ll /proc/进程id
```
cwd符号链接的是进程运行目录；

exe符号连接就是执行程序的绝对路径；

cmdline就是程序运行时输入的命令行命令；

environ记录了进程运行时的环境变量；

fd目录下是进程打开或使用的文件的符号连接。

```

* 5- linux根据 进程id查看端口
原文地址：https://www.linuxidc.com/Linux/2012-03/57060.htm
```
首先用ps命令查看进程的id：

    $ ps -ef | grep Name  

其中每一行（很长的时候会占用若干行）的第二个字段就是进程的id。

当然，对于在java虚拟机中运行的进程，比如hadoop的守护进程，可以直接用jsp命令查看：

    $ jps | grep Name  

或者已经知道进程的确切名称，可以用pidof查看：

    $ pidof Name  

查看到进程id之后，使用netstat命令查看其占用的端口：

    $ netstat -nap | grep pid  
```
### pp
