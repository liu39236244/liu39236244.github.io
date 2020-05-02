# 本节记录了Zookeeper 的配置与使用

# Zookeeper 的安装与配置 [官网](https://zookeeper.apache.org/)

## 1 Zookeeper 的安装下载[点击下载](https://archive.apache.org/dist/zookeeper/)

## 官网搭建（暂过）

## zookeeper 安装(这里直接作为hadoop高可用进行配置)

### 配置下载

#### 下载解压配置变量
    tar -zxvf ./zookeeper-3.4.10.tar.gz  -C /usr/local/MyInstall/
    * 随后更改文件名（随意）
    * 配置环境变量与分发
        ZK_HOME=/usr/local/MyInstall/zookeeper3410
        export ZK_HOME
        scp /etc/profile lzkj02:/etc/
#### 配置

* 复制配置文件
    cd /usr/local/MyInstall/zookeeper-3.4.10/conf
    [root@lzkj01 conf]# ll
    总用量 16
    -rw-rw-r-- 1 root root  535 3月  23 2017 configuration.xsl
    -rw-rw-r-- 1 root root 2161 3月  23 2017 log4j.properties
    -rw-r--r-- 1 root root  922 4月  12 18:07 zoo.cfg
    -rw-rw-r-- 1 root root  922 3月  23 2017 zoo_sample.cfg
* 修改配置
vi ./zoo.cfg
```shell
# The number of milliseconds of each tick 滴答单位 2秒
tickTime=2000
# The number of ticks that the initial
# synchronization phase can take 滴答数 10 也就相当于20 秒
initLimit=10
# The number of ticks that can pass between
# sending a request and getting an acknowledgement
syncLimit=5

# 这个文件需要自己手动创建
#dataDir=/home/zkdata/zookeeper ,这个文件夹随便
dataDir=/usr/local/MyInstall/zookeeper3410/zkdata/zookeeper

clientPort=2181

#maxClientCnxns=60

server.1=lzkj01:2888:3888

server.2=lzkj02:2888:3888

server.3=lzkj03:2888:3888

#server.n=server:duankou:duankou
```

* 分给及群众其它节点
scp -r ./zookeeper3410/ lzkj02:/usr/local/MyInstall/
scp -r ./zookeeper3410/ lzkj03:/usr/local/MyInstall/
* 进行初始化
分别在各个节点上面创建文件夹与文件：dataDir=/usr/local/MyInstall/zookeeper3410/zkdata/zookeeper

mkdir -p /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper
vi /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/myid

按照你给的id，每个节点上都有一个标示： node1:1  ;  node2:2 ; node3: 3;(注意就只有一个数字)
* 开启服务：zkServer.sh  start
    zookeeper因为修改了配置文件，所以这里不需要执行后面的  ./conf   或者  ./conf/zk.cfg，所以这里要如下：zkServer.sh  start
    查看状态：zkServer.sh status

这里写了一个脚本用于初始化zkData文件夹与myid
```shell
#!bin/bash
zkDataDir="/usr/local/MyInstall/zookeeper3410/zkdata/zookeeper"
echo "创建文件夹:$zkDataDir"

ssh root@lzkj01 "mkdir -p /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper ;touch  /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/myid; echo  "1" > /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/myid; "


ssh root@lzkj02 "mkdir -p /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper ;touch /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/myid;echo  "2" > /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/myid; "


ssh root@lzkj03 "mkdir -p /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper ;touch /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/myid; echo "3" > /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/myid; "
```



ok ! 配置结束


# 启动
## 单个启动

```
QuorumPeerMain
sh /data/hdfs/zookeeper-3.4.6/bin/zkServer.sh start

```

# 端口
启动之后zookeeper端口


```
  QuorumPeerMain

```
