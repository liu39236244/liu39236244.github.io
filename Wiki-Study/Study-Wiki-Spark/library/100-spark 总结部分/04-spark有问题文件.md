

```

1.不可变的集合
2.每个RDD切割成分区,每个分区在不同节点上计算
3.创建RDD两种方式
a.加载外部数据集,sc.textFile(...)
b.分发一个对象集合
4.RDD两种操作类型
a.transformations
  从前一个RDD,产生一个新的RDD.
  lazy() map() filter()
b.actions
  基于RDD计算一个结果/返回值给driver/存储文件到存储系统上
  count() first() take()
5.rdd.persist()	//持久化到内存,也可以持久化到磁盘,为了重用.

```
``` java
  // 伪集合操作

  1.rdd1 = tom tom tomas tomasLee
    rdd2 = tomas tomasLee jerry bob
    val rdd1 = sc.parallelize(List("tom","tom","tomas","tomasLee"))
    val rdd2 = sc.parallelize(List("tomas","tomasLee","jerry","bob"))
  2.rdd1.distinct()			//去重
  3.rdd1.union(rdd2)			//联合
  4.rdd1.intersection(rdd2)	//交集
  5.rdd1.subtract(rdd2)		//差集
  6.rdd1.cartesian(rdd2)		//笛卡尔积
  7.rdd1.fold()
  8.rdd1.aggregate()			//聚合
    val result = input.aggregate((0,0))((acc,value)=>(acc._1+value, acc._2+1),(acc1,acc2)=>(acc1._1+acc2._1,acc1._2+acc2._2))	//科里化,第一个参数初始值,第二个参数两个函数
    val avg = result._1 / result._2.toDouble
  actions
  1.rdd1.collect()			//返回所有的元素
  2.rdd1.count()				//元素的个数
  3.rdd1.countByValue()		//每个元素出现的次数
  4.rdd1.take(n)				//提取前n个元素
  5.rdd1.first()				//提取第一个值
  6.rdd1.top(n)				//提取末尾的n个元素
  7.rdd1.takeOrdered(num)		//提取前num个元素
  8.rdd1.takeSample()			// ???
  9.rdd1.reduce(func)			//
  10.rdd1.fold(zero)(func)	//相当于reduce,但提供了初始值
  11.rdd1.aggregate()
  12.rdd1.foreach(func)		//遍历
  mean()			//均值
  variance()		//方差
  persist()		//持久化
  1.spark默认持久化对象到jvm heap中没有串行化
  2.如果是off-heap必须是串行化
  3.五种级别
    级别				使用空间	CPU时间	是否在内存中	是否在磁盘上	备注
    MEMORY_ONLY			高			低		是				否
    MEMORY_ONLY_SER		低			高		是				否				数据序列化
    MEMORY_AND_DISK		高			中等	部分			部分			如果数据在内存中放不下,则溢写到磁盘
    MEMORY_AND_DISK_SER	低			高		部分			部分
    DISK_ONLY			低			高		否				是
  ETL(extract,transform,and load)
  抽取,变换,加载
  操作key-value
  1.创建PairRDD        
    rdd.map(x=>(xxx,yyy))
  2.pairRDD准备

    prdd = {1,2},{3,4},{3,6}
    prdd.reduceByKey((x+y)=>x+y)	//按照key分组,key不变,value运算
      {{1,2},{3,10}}
    rdd.groupByKey()				//通过key进行分组
    combineByKey()					//???
    rdd.mapValues(x=>x+1)			//{1,3},{3,5},{3,7}
    rdd.flatMapValues(x=>(x to 5))	//{1,2},{1,3}{1,4},{1,5},{3,4},{3,5}
    rdd.keys()
    rdd.values()
    rdd.sortByKey()


  文件操作：
  csv文件:","分割文件
    import java.io.StringReader
    import au.com.bytecode.opencsv.CSVReader
    rdd.map(x=>{
      val reader = new CSVReader(new StringReader(x);
        val arr = reader.reader.readNext();
        println(arr.length);
      )
    }).collect
  使用CSVWriter写入csv文件
    import java.io.StringWriter
    import au.com.bytecode.opencsv.CSVWriter

    val fw = new StringWriter("file:///home/ubuntu/1.json")
    val w = new CSVWriter(sw)

    val arr = Array("name","tom","age","12")
    val list = new java.util.ArrayList[Array[String]]()
    list.add(arr)

    w.writeAll(list)
    w.close()
  scala中操纵sequenceFile
    存储seqfile
      val rdd = sc.parallelize((),(),()...)
      rdd.saveAsSequenceFile("file:///x/x/x/")
    加载seqfile
      import org.apache.hadoop.io._
      val rdd = sc.sequenceFile("file:///x/x/x/",classOf[IntWritable],classOf[Text])
      rdd.map(x=>println(x._1 + " : " + x._2)).collect		//action
  object文件
    save
      val rdd = ...
      rdd.saveObjectFile("file:///x/x/x/")
    load
      sc.objectFile("file:///x/x/x/")
  使用压缩编解码保存文件
    存储
      rdd.saveAsTextFile("file:///x/x/x/",classOf[SnappyCodec])		//	xxx.snappy
    load
      sc.newAPIHadoopFile("",fClass,kClass.vClass);
  spark访问hive 数据仓库
    hive:类sql方式编写 MR
    1.提供一个hive的配置文件
      复制hive-site.xml文件到spark/conf目录下
    2.编写程序
      import org.apache.spark.sql.hive.HiveContext
      val hc = new org.apache.spark.sql.hive.HiveContext(sc)
      val rows = hiveCtx.sql("SELECT name,age FROM t01")
      val firstRow = rows.first()
      println(firstRow.getString(0))
  spark使用JdbcRDD访问RDBMS数据（mysql）
    1.复制驱动程序到spark classpath下
    2.编程
      Class.forName("com.mysql.jdbc.Driver")
      val conn = DriverManager.getConnection("jdbc:mysql://192.168.12.5:330/mybase","root","root")

      def createConnection() = {
        Class.forName("com.mysql.jdbc.Driver").newInstance();;
        DriverManager.getConnection("jdbc:mysql://192.168.12.5:330/mybase","root","root");
      }

      def extractValues(r:ResultSet) = {
        (r.getInt(1), r.getString2())
      }

      val data = new JdbcRDD(
        sc, createConnection, "select * from customers where ? <= id and id <= ?",
        lowerBound = 1, upperBound = 3, numPartitions = 2, mapRow = extractValues
      )
      data.collect
  rdd.mapPartitions()
  rdd.count()			//
  rdd.mean()			//均值
  rdd.sum()
  rdd.max()
  rdd.min()
  rdd.variance()		//方差
  rdd.SampleVariance()//标准差
  rdd.stdev()			//偏差

  ```

##  spark运行时框架

  ```
 
  1.分布式模式下,使用master/slave主从模式。
    中央协调器 + 分布式的worker node
    spark(app) === hadoop(job) === storm(topology)
    spark driver:jvm
    executor	:jvm
  2.driver职责
    a.转换用户程序到task
      spark隐式创建operation的DAG,运行执行转换成plan
    b.在executor上调度task

  3.executor
    在work node负责运行单个task,在spark app启动时启动（启动一次）
    运行task并返回结果给driver,提供RDD的内存存储以备让程序员缓存数据
    每个executor都有一个block manager
  4.cluster manager
    spark通过该对象启动executor,特殊时候还要启动driver,可插拔,可以运行在几种cluster manager,yarn|mesos|standard alone。
  5.spark提供脚本spark-submit,可以提交脚本到集群
  使用spark-submit部署程序
  spark://host:port	//spark的对立集群
  mesos://host:port	//mesos
  yarn				//连接到yarn集群,需要配置HADOOP_CONF_DIR环境变量
  local				//单个core
  local[N]			//n core
  local[*]			//机器有多少用多少
  spark-submit选项
  --master			//以上选项一个
  --deploy-mode		//client,driver运行在提交机器上
            //cluster,driver在一个worker node上（默认client）
  --class				//指定类名
  --name				//指定应用程序的名称
  --jars				//指定第三方依赖
  --files				//
  --py-files			//
  --executor-memory	//
  --driver-memory		//
  其他用户提交spark-submit任务
  sudo -u hdfs /data/hdfs/spark-2.2.0-bin-hadoop2.7/bin/spark-submit --class org.apache.spark.examples.JavaSparkPi --master local --num-executors 1 --driver-memory 1g --executor-memory 1g --executor-cores 1 	$SPARK_HOME/examples/jars/spark-examples_2.11-2.2.0.jar 100
  ???
    $>disk -l			//重新查看分区
  3.格式化文件系统
    $>reboot				//需要重启，否则识别不出来
    $>mkfs.ext3	/dev/sda3	//格式化分区
  4.挂载分区
    $>mkdir /mnt/sda4
    $>mount	/dev/sda4 /mnt/sda4
  5.整理文件系统
    //将/home/ubuntu目录转移到新的分区
    $>mkdir /mnt/sda4/home/ubuntu
  6.自动挂载
    //重启系统时，自动挂载分区文件
    $>/dev/sda4	/mnt/sda4 ext3 defaults 0 1
  7.ok
  spark提交的部署模式
  1.client
    driver运行在提交的jvm中
    spark-submit --master xxx --class xxx --name xxx --deloy-mode client xxx.jar
  2.cluster
    driver运行在一个worker上的
    spark-submit --master xxx --class xxx --name xxx --deloy-mode client xxx.jar
  spark使用yarn cluster manager
  1.配置环境变量HADOOP_CONF_DIR,指向hadoop配置目录
    $>HADOOP_CONF_DIR环境变量
  2.提交spark作业
    $>spark-submit --master yarn --deloy-mode cluster --class xxx xxx.jar
  优化spark
  1.并发级别
    $>sc.parallelize(,4)
  2.设置串行化格式
    conf.set("spark.serializer","org.apache.spark.serializer.KryoSerializer")
    conf.set("spark.kyro.registrationRequired","true")
    conf.registerKryoClasses(Array(ClassOf[MyClass],classOf[MyOtherClass]))
  spark sql
  操纵结构化和半结构化数据，三个主要功能
  1.从各种结构化数据源加载数据（json|hive|parquet）
  2.使用sql查询，使用JDBC机制
  3.在sql和Python/java代码中做了整合,可以进行RDD和table join操作
  4.spark给出SchemaRDD，和record
  整合spark sql 和 hive
  1.复制hive-site.xml到spark/conf下
  2.初始化spark sql
    import org.apache.spark._
    import org.apache.spark.sql.hive.HiveContext
    val sc = new SparkContext(master,"LoadHive",System.getenv("SPARK_HOME"))
    val hiveCtx = new HiveContext(sc)
    val input = hiveCtx.sql("FROM src SELECT key,value")
    val data = input.map(_.getInt(0))
    println(data.collect().toList)
  实验
  1.使用standalone模式启动spark集群
  2.创建maven项目
  3.引入spark-hive依赖
  4.编写scala程序
    [MySparkHiveTest.scala]
    import org.apache.spark._
    import org.apache.spark.sql.hive.HiveContext
    object MySparkHiveTest{
      def main(args:Array[String]){
        val sc = new SparkContext(master,"LoadHive",System.getenv("SPARK_HOME"))
        val hiveCtx = new HiveContext(sc)
        val input = hiveCtx.sql("select id,name,age from customer")
        val data = input.map(_.getInt(0))
        println(data.collect().toList)
      }
    }
  5.编译
    使用maven package进行编译打包
  6.将jar传入ubuntu
  7.提交jar给spark
    spark-submit --master spark://s100:7077 --class xxx.xxx --name xxx xxx.jar
  Spark-Streaming
  mirco batch:
  DStream			//discretized stream --- 离散流

  [使用]
  1.启动spark-shell
  2.导入相应类库
    import org.apache.spark.streaming.StreamingContext
    import org.apache.spark.streaming.StreamingContext._
    import org.apache.spark.streaming.dstream.DStream
    import org.apache.spark.streaming.Duration
    import org.apache.spark.streaming.Seconds

  MLlib
```
