# SparkCarbondata 数据库使用示例

## javaAPi-spark程序 -SparkCarbondata


### 1-carbondata使用

 * 一、在spark shell 下使用carbondata
1、使用外部包加载的方式启动carbondata 的spark shell:
spark-shell –jars /data1/bd/carbondata/carbondata_2.10-1.1.0-shade-hadoop2.2.0.jar
2、启动后，引入carbondata的context

```scala
import org.apache.spark.sql.CarbonContext //引入CarbonContext包
val cc = new CarbonContext(sc, "hdfs://base/user/hive/warehouse/dw_behavior_pageview_carbondatats2") //创建一个CarbonContext，里面的路径是carbondata 的存储路径
  cc.sql("""show create table dw_open_biz_order_part_carbondata """) //执行sql语句
       // 执行查询语句
cc.sql("""select cinemano, count(distinct orderid) from dw_open_biz_order_part_carbondata  group by cinemano""")
       //执行updata更新数据
  cc.sql("""UPDATE dw_open_biz_order_part_carbondata SET (openid) = ('o0aT-d5MmmrqSPmM5ewiHkrcnDpY') where dt='2017-07-02' and openid='test_o0aT-d5MmmrqSPmM5ewiHkrcnDpY'""").show()
  cc.sql(""" select dt,openid from dw_open_biz_order_part_carbondata where dt='2017-07-02' and openid='test_o0aT-d5MmmrqSPmM5ewiHkrcnDpY' """).show()
```
* 二、 使用spark-submit 方式执行carbondata任务。
carbondata执行sql的api我已经封装了一个jar包，jar路径/data1/bimining/shenxiang/CarbonDataSql.jar
执行命令：

```
spark-submit --executor-memory 8G  CarbonDataSql.jar carbontestss "hdfs://base/user/hive/warehouse/dw_behavior_pageview_carbondatats2" f "/data1/bimining/shenxiang/load_data_to_carbon2.hql"


说明：--executor-memory： 执行内存
                   CarbonDataSql.jar 程序jar包名
  carbontestss：jar 包的第一个参数，表示spark任务的名称
  "hdfs://base/user/hive/warehouse/dw_behavior_pageview_carbondatats2": 第二个参数，carbondata 的存储路径
                  f (s) :第三个参数，f表示从文件读取sql，s表示从字符串读取sql
                  最后一个参数表示 sql文件路径或sql语句，当第三个参数为f时，这个参数为sql文件的路径，当第三个参数为s时，这个参数为sql语句。

```
三、如何编写一个carbondata（spark）程序
1、语言支持：carbondata目前只支持scala API和java API（这里以java为例）
2、maven pom.xml配置 ，需要在工程的pom中加入一下配置，导入spak,hadoop相关的包

```xml
<dependency>
<groupId>org.apache.spark< groupId>
<artifactId>spark-core_2.10< artifactId>
<version>1.6.1< version>
<dependency>
<dependency>
<groupId>org.apache.hadoop< groupId>
<artifactId>hadoop-client< artifactId>
<version>2.7.2< version>
<dependency>
<dependency>
<groupId>org.apache.spark< groupId>
<artifactId>spark-sql_2.11< artifactId>
<version>1.6.1< version>
<scope>provided< scope>
<dependency>
<dependency>
<groupId>org.apache.spark< groupId>
<artifactId>spark-hive_2.10< artifactId>
<version>1.6.1< version>
<dependency>
```
3、在build path 中加入 carbondata_2.10-1.1.0-shade-hadoop2.2.0.jar（不加会提示找不到该包）
4、carbondata demo:

```Java
package com.yupiao.carbondata;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.spark.SparkConf;
import org.apache.spark.SparkContext;
import org.apache.spark.sql.CarbonContext;
public class CarbonDataSql {
//创建sparkconf,SparkContext,CarbonContext 的成员变量
private static SparkConf conf ;
private static SparkContext sc;
private static CarbonContext cc ;


public CarbonDataSql(String app_name,String store_Path) {
        //初始化conf，sc,cc
        conf= new SparkConf().setAppName("CarbonDataSql_"+app_name);
        sc= new SparkContext(conf);
        cc = new CarbonContext(sc,store_Path);
}
private void exectue_str(String sql_str){
      //执行sql语句
       cc.sql(sql_str).show();
}

private void exectue_file(String path){
       //执行sql文件
       File f=new File(path);
       BufferedReader readfile = null;
       StringBuffer sql_str=new StringBuffer ("");
       try {
              readfile = new BufferedReader(new FileReader(f));
              String strline = null;
              while ((strline=readfile.readLine())!= null) {
              sql_str.append(strline.trim()+"\n");
              }
       } catch (FileNotFoundException e) {
              e.printStackTrace();
       } catch (IOException e) {
              e.printStackTrace();
       }
       System.out.println(sql_str.toString());
       cc.sql(sql_str.toString()).show();
}

public static void main(String[] args) {
       //检测参数个数
       if(args.length!=4){
       System.out.println("args length error");
       System.exit(0);
       }
       String appname = args[0];
       String store_Path = args[1];
       CarbonDataSql cds = new CarbonDataSql(appname,store_Path);
       if("s".equals(args[2])){
              cds.exectue_str(args[3]);
       } else if("f".equals(args[2])){
              cds.exectue_file(args[3]);
       }else{
              System.out.println("option s、f");
       }
       sc.stop();
       }
}
```
