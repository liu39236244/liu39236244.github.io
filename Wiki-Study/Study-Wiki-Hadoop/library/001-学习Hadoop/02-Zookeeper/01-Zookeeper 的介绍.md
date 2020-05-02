# Zookeeper

---

## 介绍

在Hadoop 分布式集群中，Hadoop 的高可用需要依赖Zookeeper.


## zookeeper 的命令
---

zookeeper 的shell 开启 命令： zkCli.sh


Zk创建znode节点有四种：

普通节点(永久)：create name=zs

普通序列化节点：create  -s  name =ls

临时节点 ：create –e name=zs

临时序列化节点：
案例：
* ls /
* create /node "node1"
      注意：你 create  node =node1 ; create  /node ="node1" ; 都不行，
* create /node "node1"
* ls /node
* get /node
* delete /node
* create /node/node_left "node_left"  // 在node 下面创建一个节点,此时node1 已经不为空了，delete /node1 ,删不掉，会提示node1不为空值
    * 此时需要用 ：rmr /node 命令才能删除不为空的节点
* quit 离开命令
* zkServer.sh stop
## 文件夹介绍

    -rw-r--r-- 1 root root  2 4月  12 18:26 myid
    drwxr-xr-x 2 root root 68 4月  12 18:34 version-2
    -rw-r--r-- 1 root root  5 4月  12 18:30 zookeeper_server.pid

    zookeeper_server.pid 这个是启动zookeeper 自动成生的，myid 使自己创建的，version-2 是创建数据的时候生成的


## 永久删除数据
    删除version-2 这个文件夹就ok了，
    /usr/local/MyInstall/zookeeper3410/zkdata/zookeeper/version-2
