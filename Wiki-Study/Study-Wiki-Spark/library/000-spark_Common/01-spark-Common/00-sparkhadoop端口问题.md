# spark hadoop端口 总结文档

## hadoop:
  rpc: 8020/9000 -> 端口解释8020/9000
    ```
    hadoop2.x 默认的rpc端口为8020 hdfs-site.xml 中可以进行配置
    ```
  web-ui:50070
  yarn-ui:8088
  (HA)journode:journalnode  :8485 要根据zookeeper 的安装
  ```
  <property>
        <name>dfs.namenode.journalnode</name>
        <value>nuc-1:8485;nuc-2:8485;nuc-3:8485</value>
    </property>
    <property>
        <name>dfs.namenode.shared.edits.dir</name>
        <value>qjournal://${dfs.namenode.journalnode}/mycluster</value>
    </property>
    <property>
        <name>dfs.client.failover.proxy.provider.mycluster</name>
        <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>
    </property>

  ```
## spark:  spark master 配置必须为ip
  rpc: 7077
  web-ui:8080
  job_history:18080
  单个任务单独一个web-ui:4040  // 每个Driver的SparkContext都会启动一个web节目，默认端口是4040


## 端口解释8020/9000
    core-site.xml 中的配置

    ```
    core-site.xml 配置
    <property>
    <name>fs.defaultFS</name>
    <value>hdfs://h1:9000<alue>
    </property>
    <property>
    ```

    hadoop2.x 中的配置

    ```
    hadoop 2.X 版本中HDFS默认的namenode rpc监听端口，可以在hdfs-site.xml 中配置，
    例如使用java代码或控件对hdfs文件系统的操作都是用这个端口。
    <property>
        <name>dfs.nameservices</name>
        <value>mycluster</value>
    </property>
    <property>
        <name>dfs.ha.namenodes.mycluster</name>
        <value>nn1,nn2</value>
    </property>
    <property>
        <name>dfs.namenode.rpc-address.mycluster.nn1</name>
        <value>nuc-1:8020</value>
    </property>
    <property>
        <name>dfs.namenode.rpc-address.mycluster.nn2</name>
        <value>nuc-2:8020</value>
    </property>
    <property>
        <name>dfs.namenode.http-address.mycluster.nn1</name>
        <value>nuc-1:50070</value>
    </property>
    <property>
        <name>dfs.namenode.http-address.mycluster.nn2</name>
        <value>nuc-2:50070</value>
    </property>

    ```

## hadoop端口博主总结

### 博主1

```


默认端口                            设置位置                                    描述信息

8020        namenode RPC交互端口

8021        JT RPC交互端口

50030       mapred.job.tracker.http.address        JobTracker administrative web GUI           

JOBTRACKER的HTTP服务器和端口

50070              dfs.http.address                             NameNode administrative web GUI

NAMENODE的HTTP服务器和端口
50010          dfs.datanode.address                   DataNode control port (each DataNode listens on this port and registers it with the  NameNode on startup)

DATANODE控制端口，主要用于DATANODE初始化时向NAMENODE提出注册和应答请求

50020          dfs.datanode.ipc.address               DataNode IPC port, used for block transfer

DATANODE的RPC服务器地址和端口

50060      mapred.task.tracker.http.address           Per TaskTracker web interface

TASKTRACKER的HTTP服务器和端口

50075          dfs.datanode.http.address                  Per   DataNode web interface
DATANODE的HTTP服务器和端口
50090            dfs.secondary.http.address             Per secondary NameNode web interface

辅助DATANODE的HTTP服务器和端口

```
