# HDFS 访问集群
## HDFS 工具类总结

### 访问集群的config配置
```java
    private static final String clusterID = "mycluster"; // 设定集群模式的时候需要设定rpcip


    //单独使用需自行加载配置
    static {
        conf.set("fs.defaultFS", "hdfs://" + clusterID);
        conf.set("dfs.nameservices", clusterID);
        conf.set("dfs.ha.namenodes." + clusterID, "nn1,nn2");
        conf.set("dfs.namenode.rpc-address." + clusterID + ".nn1", "192.168.20.60:8020");
        conf.set("dfs.namenode.rpc-address." + clusterID + ".nn2", "192.168.20.61:8020");
        conf.set("dfs.client.failover.proxy.provider." + clusterID, "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider");
    }

```

### 2-访问单机版

```java

  private static final String clusterID = "NUC-2:8020";
  //单独使用需自行加载配置
  static {
      conf.set("fs.defaultFS", "hdfs://" + clusterID);
  }


```

### 3-路径带上地址

```java
JavaRDD<String> lines = SparkInitMgr.jssc.sparkContext().textFile("hdfs://second:9000/rastext/file/");
```
