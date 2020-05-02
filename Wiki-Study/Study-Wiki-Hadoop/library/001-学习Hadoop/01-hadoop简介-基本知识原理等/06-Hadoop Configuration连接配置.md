# Hadoop连接集配置

## Hadoop  配置的两种方式

### 1-代码配置

```
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
### 2-拉取配置文件

```
把配置文件拉到  core-site.xml  /hdfs-site.xml 到Resource资源目录下面

```
