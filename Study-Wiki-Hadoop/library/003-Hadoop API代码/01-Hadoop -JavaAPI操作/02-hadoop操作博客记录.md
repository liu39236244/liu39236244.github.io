# hadoop 操作

## hadoop 操作hdfs文件

### 博主1

原文地址：https://blog.csdn.net/czw698/article/details/44405923

```
1 配置客户端，后台连接到客户端进行工作

客户端的配置比较简单，只要把配置好的hadoop的namenode节点的hadoop 打包，发到另一台机器（该机器不出现在 etc/hadoop/slaves里就可以）

设置一下环境变量 JAVA_HOME HADOOP_HOME

还有一些在hadoop xml配置的临时文件目录等 也改一下（启动时查看日志，根据日志来进行修改就好）

剩下的就是让你的后台连到这个机器上进行任务提交就行

这种方式使用的是core-site.xml里 dfs.defaultFS 来进行工作的。

如果配置了HA，那么这种方式是可以用到HA的。下面这种方式用不了，需要把主机端口换成nameservice的星驰



2 使用dfs://namenode机器ip:8020（或不加端口号）进行rpc访问

上面是配置了客户端的方式进行使用。这种方式不用客户端部署，进行绝对地址访问

可以在自己的hadoop 程序中通过haoop 提供的api进行操作
```

### 博主2

原文地址：https://blog.csdn.net/qq_37914579/article/details/79495230


```
当集群是ha高可用时，namenode为多节点，当namenode为standby时是不能被访问hdfs的，需要灵活的指定namenode，不能使用普通的hdfs地址，高可用要用nameservice去访问，每个hadoop的hdfs集群的配置是不一样的，因为nameservice的配置不同，需要把集群的hdfs-site.xml文件放到maven的resource目录中，configuration会自动加载resource中配置文件，hdfs://nameserivice/user/expr，直接用nameservice替换集群地址
URI：hdfs://nodexx:8020/user/hive/warehouse  修改为hdfs://nameservice1/user/hive/warehouse 即可。





```

```Java
import java.io.File;  
import java.io.FileOutputStream;  
import java.net.URI;  
import org.apache.hadoop.conf.Configuration;  
import org.apache.hadoop.fs.FileSystem;  
import org.apache.hadoop.fs.FSDataInputStream;  
import org.apache.hadoop.fs.FileUtil;  
import org.apache.hadoop.fs.Path;  
import org.apache.hadoop.fs.FileStatus;  
import org.apache.hadoop.io.IOUtils;  

public class HDFS_Downloader  
{  
    public static FileSystem hdfs;  

    public static void downloadFile(String srcPath, String dstPath) throws Exception  
    {  
        FSDataInputStream in = null;  
        FileOutputStream out = null;  
        try  
        {  
            in = hdfs.open(new Path(srcPath));  
            out = new FileOutputStream(dstPath);  
            IOUtils.copyBytes(in, out, 4096, false);  
        }  
        finally  
        {  
            IOUtils.closeStream(in);  
            IOUtils.closeStream(out);  
        }  
    }  

    public static void downloadFolder(String srcPath, String dstPath) throws Exception  
    {  
        File dstDir = new File(dstPath);  
        if (!dstDir.exists())  
        {  
            dstDir.mkdirs();  
        }  
        FileStatus[] srcFileStatus = hdfs.listStatus(new Path(srcPath));  
        Path[] srcFilePath = FileUtil.stat2Paths(srcFileStatus);  
        for (int i = 0; i < srcFilePath.length; i++)  
        {  
            String srcFile = srcFilePath[i].toString();  
            int fileNamePosi = srcFile.lastIndexOf('/');  
            String fileName = srcFile.substring(fileNamePosi + 1);  
            download(srcPath + '/' + fileName, dstPath + '/' + fileName);  
        }  
    }  

    public static void download(String srcPath, String dstPath) throws Exception  
    {  
        if (hdfs.isFile(new Path(srcPath)))  
        {  
            downloadFile(srcPath, dstPath);  
        }  
        else  
        {  
            downloadFolder(srcPath, dstPath);  
        }  
    }  

    public static void main(String[] args)  
    {  
        if (args.length != 2)  
        {  
            System.out.println("Invalid input parameters");  
        }  
        else  
        {  
            try  
            {  
                Configuration conf = new Configuration();  
                hdfs = FileSystem.get(URI.create(args[0]), conf);  
                download(args[0], args[1]);  
            }  
            catch (Exception e)  
            {  
                System.out.println("Error occured when copy files");  
            }  
        }  
    }  
}  
```

配置文件:

```xml
<property>  
    <name>dfs.nameservices</name>  
    <value>nameservice1</value>  
  </property>  
  <property>  
    <name>dfs.client.failover.proxy.provider.nameservice1</name>  
    <value>org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider</value>  
  </property>  
  <property>  
    <name>dfs.ha.automatic-failover.enabled.nameservice1</name>  
    <value>true</value>  
  </property>  
  <property>  
    <name>ha.zookeeper.quorum</name>  
    <value>bdc40.hexun.com:2181,bdc41.hexun.com:2181,bdc46.hexun.com:2181,bdc53.hexun.com:2181,bdc54.hexun.com:2181</value>  
  </property>  
  <property>  
    <name>dfs.ha.namenodes.nameservice1</name>  
    <value>namenode50,namenode85</value>  
  </property>  
  <property>  
    <name>dfs.namenode.rpc-address.nameservice1.namenode50</name>  
    <value>bdc20.hexun.com:8020</value>  
  </property>  
  <property>  
    <name>dfs.namenode.servicerpc-address.nameservice1.namenode50</name>  
    <value>bdc20.hexun.com:8022</value>  
  </property>  
  <property>  
    <name>dfs.namenode.http-address.nameservice1.namenode50</name>  
    <value>bdc20.hexun.com:50070</value>  
  </property>  
  <property>  
    <name>dfs.namenode.https-address.nameservice1.namenode50</name>  
    <value>bdc20.hexun.com:50470</value>  
  </property>  
  <property>  
    <name>dfs.namenode.rpc-address.nameservice1.namenode85</name>  
    <value>bdc220.hexun.com:8020</value>  
  </property>  
  <property>  
    <name>dfs.namenode.servicerpc-address.nameservice1.namenode85</name>  
    <value>bdc220.hexun.com:8022</value>  
  </property>  
  <property>  
    <name>dfs.namenode.http-address.nameservice1.namenode85</name>  
    <value>bdc220.hexun.com:50070</value>  
  </property>  
  <property>  
    <name>dfs.namenode.https-address.nameservice1.namenode85</name>  
    <value>bdc220.hexun.com:50470</value>  
  </property>  
```
