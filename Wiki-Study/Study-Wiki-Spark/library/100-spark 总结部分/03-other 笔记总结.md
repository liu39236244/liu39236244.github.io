版本选择:
	spark1.6.1
介绍:
	快如闪电的集群计算 快速通用的大规模数据处理技术
	有DAG(有向无环图)执行引擎
	速度 比MapReduce在 内存上快一百倍 磁盘上快10倍
	可以使用多种语言编写 java Scala Python R
	80多种高级操作用于并行app
三种部署模式
	standalone
		在hdfs上分配空间,spark和MR同时运行,覆盖到所有的job
	hadoop yarn
		在yarn上运行,不需要预先安装或者要求root访问
		有助于spark和hadoop生态系统进行集成
	spark in mapreduce

Spark核心组成:
	Spark Core(内核)
		位于执行引擎上,所有功能都在其上运行,覆盖到所有spark job
	Spark SQL
		新推出的交互式大数据SQL技术,支持结构化与半结构化.把sql语句翻译成Spark上的RDD操作可以支持Hive、Json等类型的数据.
	Spark Streaming
		通过对kafka数据读取 将Stream数据分成小的时间片段(几秒) 以类似batch批处理的方式来处理这一部分小数据 每个时间片生成一个RDD 有高效的容错性 对小批量数据可以兼容批量实时数据处理的逻辑算法 用一些历史数据和实时数据联合进行分析 比如分类算法等 也可以对小批量的stream进行mapreduce、join等操作 而保证其实时性 针对数据流时间要求不到毫秒级的工程性问题都可以
		Spark Streaming也有一个StreamingContext 其核心是DStream 是通过以组时间序列上的连续RDD来组成的 包含一个有Time作为key、RDD作为value的结构体 每一个RDD都包含特定时间间隔的数据流 可以通过persist将其持久化 在接受不断的数据流后 在blockGenerator中维护一个队列 将流数据放到队列中 等处理时间间隔到来后将其中的所有数据合并成为一个RDD(这一间隔中的数据) 其作业提交和spark相似 只不过在提交时拿到DStream内部的RDD并产生Job提交 RDD在action触发之后 将job提交给jobManager中的JobQueue 又jobScheduler调度 JobScheduler将job提交到spark的job调度器 然后将job转换成为大量的任务分发给spark集群执行 Job从outputStream中生成的 然后触发反向回溯执行DStreamDAG 在流数据处理的过程中 一般节点失效的处理比离线数据要复杂 Spark streamin在1.3之后可以周期性的将DStream写入HDFS 同时将offset也进行存储 避免写到zk 一旦主节点失效 会通过checkpoint的方式读取之前的数据 当worknode节点失效 如果HDFS或文件作为输入源那Spark会根据依赖关系重新计算数据 如果是基于Kafka、Flume等网络数据源spark会将手机的数据源在集群中的不同节点进行备份 一旦有一个工作节点失效 系统能够根据另一份还存在的数据重新计算 但是如果接受节点失效会丢失一部分数据 同时接受线程会在其他的节点上重新启动并接受数据
	MLlib(machine learning library)

    GraphX
    	主要用于图的计算.核心算法有PageRank、SVD奇异矩阵、TriangleConut等.
    Spark R
    	通过R语言调用spark,目前不会拥有像Scala或者java那样广泛的API,Spark通过RDD类提供Spark API,并且允许用户使用R交互式方式在集群中运行任务.同时集成了MLlib机器学习类库.
    MLBase
    从上到下包括了MLOptimizer(给使用者)、MLI(给算法使用者)、MLlib(给算法开发者)、Spark.也可以直接使用MLlib.ML Optimizer,一个优化机器学习选择更合适的算法和相关参数的模块,还有MLI进行特征抽取和高级ML编程 抽象算法实现API平台,MLlib分布式机器学习库,可以不断扩充算法.MLRuntime基于spark计算框架,将Spark的分布式计算应用到机器学习领域.MLBase提供了一个简单的声明方法指定机器学习任务,并且动态地选择最优的学习算法.
    Tachyon
    	高容错的分布式文件系统.宣称其性能是HDFS的3000多倍.有类似java的接口,也实现了HDFS接口,所以Spark和MR程序不需要任何的修改就可以运行.目前支持HDFS、S3等.
    核心RDD:
    	弹性分布式数据集 完全弹性的 如果数据丢失一部分还可以重建 有自动容错、位置感知调度和可伸缩性 通过数据检查点和记录数据更新金象容错性检查 通过SparkContext.textFile()加载文件变成RDD 然后通过transformation构建新的RDD 通过action将RDD存储到外部系统
    	RDD使用延迟加载(懒加载) 只有当用到的时候才加载数据 如果加载存储所有的中间过程会浪费空间 因此要延迟加载 一旦spark看到整个变换链 他可以计算仅需的结果数据 如果下面的函数不需要数据那么数据也不会再加载 转换RDD是惰性的 只有在动作中才可以使用它们
    	Spark分为driver和executor driver提交作业 executor是application早worknode上的进程 运行task driver对应为sparkcontext Spark的RDD操作有transformation、action Transformation对RDD进行依赖包装 RDD所对应的依赖都进行DAG的构建并保存 在worknode挂掉之后除了通过备份恢复还可以通过元数据对其保存的依赖再计算一次得到 当作业提交也就是调用runJob时 spark会根据RDD构建DAG图 提交给DAGScheduler 这个DAGScheduler是在SparkContext创建时一同初始化的 他会对作业进行调度处理 当依赖图构建好以后 从action开始进行解析 每一个操作作为一个task 每遇到shuffle就切割成为一个taskSet 并把数据输出到磁盘 如果不是shuffle数据还在内存中存储 就这样再往前推进 直到没有算子 然后运行从前面开始 如果没有action的算子在这里不会执行 直到遇到action为止才开始运行 这就形成了spark的懒加载 taskset提交给TaskSheduler生成TaskSetManager并且提交给Executor运行 运行结束后反馈给DAGScheduler完成一个taskSet 之后再提交下一个 当TaskSet运行失败时就返回DAGScheduler并重新再次创建 一个job里面可能有多个TaskSet 一个application可能包含多个job
    Spark算子
    	```
    1、Map.对原数据进行处理,类似于遍历操作,转换成MappedRDD,原分区不变.
    	2、flatMap.将原来的RDD中的每一个元素通过函数转换成新的元素,将RDD的每个集合中的元素合并成一个集合.比如一个元素里面多个list,通过这个函数都合并成一个大的list,最经典的就是wordcount中将每一行元素进行分词以后成为,通过flapMap变成一个个的单词,line.flapMap(_.split(“ ”)).map((_,1))如果通过map就会将一行的单词变成一个list.
    	3、mapPartitions.对每个分区进行迭代,生成MapPartitionsRDD.
    	4、Union.是将两个RDD合并成一个.使用这个函数要保证两个RDD元素的数据类型相同,返回的RDD的数据类型和被合并的RDD数据类型相同.
    	5、Filter.其功能是对元素进行过滤,对每个元素调用f函数,返回值为true的元素就保留在RDD中.
    	6、Distinct.对RDD中元素进行去重操作.
    	7、Subtract.对RDD1中取出RDD1与RDD2交集中的所有元素.
    	8、Sample.对RDD中的集合内元素进行采样,第一个参数withReplacement是true表示有放回取样,false表示无放回.第二个参数表示比例,第三个参数是随机种子.如data.sample(true, 0.3,new Random().nextInt()).
    	9、takeSample.和sample用法相同,只不第二个参数换成了个数.返回也不是RDD,而是collect.
    	10、Cache.将RDD缓存到内存中.相当于persist(MEMORY_ONLY).可以通过参数设置缓存和运行内存之间的比例,如果数据量大于cache内存则会丢失.
    	11、Persist.里面参数可以选择DISK_ONLY/MEMORY_ONLY/MEMORY_AND_DISK等,其中的MEMORY_AND_DISK当缓存空间满了后自动溢出到磁盘.
    	12、MapValues.针对KV数据,对数据中的value进行map操作,而不对key进行处理.
    	13、reduceByKey.针对KV数据将相同key的value聚合到一起.与groupByKey不同,会进行一个类似mapreduce中的combine操作,减少相应的数据IO操作,加快效率.如果想进行一些非叠加操作,我们可以将value组合成字符串或其他格式将相同key的value组合在一起,再通过迭代,组合的数据拆开操作.

    	groupByKey 对每个key进行操作，但只生成一个sequence。需要特别注意“Note”中的话，它告诉我们：如果需要对sequence进行aggregation操作（注意，groupByKey本身不能自定义操作函数），那么，选择reduceByKey/aggregateByKey更好。这是因为groupByKey不能自定义函数，我们需要先用groupByKey生成RDD，然后才能对此RDD通过map进行自定义函数操作。
    	14、partitionBy.可以将RDD进行分区,重新生成一个ShuffleRDD,进行一个shuffle操作,对后面进行频繁的shuffle操作可以加快效率.
    	15、randomSplit.对RDD进行随机切分.如data.randomSplit(new double[]{0.7, 0.3})返回一个RDD的数组.
    	16、Cogroup.对两个RDD中的KV元素,每个RDD中相同key中的元素分别聚合成一个集合.与reduceByKey不同的是针对两个RDD中相同的key的元素进行合并.
    	17、Join.相当于inner join.对两个需要连接的RDD进行cogroup,然后对每个key下面的list进行笛卡尔积的操作,输出两两相交的两个集合作为value. 相当于sql中where a.key=b.key.
    	18、leftOutJoin,rightOutJoin.在数据库中左连接以左表为坐标将表中所有的数据列出来,右面不存在的用null填充.在这里面对join的基础上判断左侧的RDD元素是否是空,如果是空则填充.右连接则相反.
    	19、saveAsTextFile.将数据输出到HDFS的指定目录.
    	20、saveAsObjectFile.写入HDFS为SequenceFile格式.
    	21、Collect、collectAsMap.将RDD转换成list或者Map.结果以List或者HashMap的方式输出.
    	22、Count.对RDD的元素进行统计,返回个数.
    	23、Top(k).返回最大的k个元素,返回List的形式.
    	24、Take返回数据的前k个元素.
    	25、takeOrdered.返回数据的最小的k个元素,并在返回中保持元素的顺序.
    优化
    	1、RDD.repartition(n)可以在最初对RDD进行分区操作,这个操作实际上是一个shuffle,可能比较耗时,但是如果之后的action比较多的话,可以减少下面操作的时间.其中的n值看cpu的个数,一般大于2倍cpu,小于1000.
    	2、Action不能够太多,每一次的action都会将以上的taskset划分一个job,这样当job增多,而其中task并不释放,会占用更多的内存,使得gc拉低效率.
    	3、在shuffle前面进行一个过滤,减少shuffle数据,并且过滤掉null值,以及空值.
    	4、groupBy尽量通过reduceBy替代.reduceBy会在work节点做一次reduce,在整体进行reduce,相当于做了一次hadoop中的combine操作,而combine操作和reduceBy逻辑一致,这个groupBy不能保证.
    	5、做join的时候,尽量用小RDD去join大RDD,用大RDD去join超大的RDD.
    	6、避免collect的使用.因为collect如果数据集超大的时候,会通过各个work进行收集,io增多,拉低性能,因此当数据集很大时要save到HDFS.
    	7、RDD如果后面使用迭代,建议cache,但是一定要估计好数据的大小,避免比cache设定的内存还要大,如果大过内存就会删除之前存储的cache,可能导致计算错误,如果想要完全的存储可以使用persist(MEMORY_AND_DISK),因为cache就是persist(MEMORY_ONLY).
    	8、设置spark.cleaner.ttl,定时清除task,因为job的原因可能会缓存很多执行过去的task,所以定时回收可能避免集中gc操作拉低性能.
    	9、适当pre-partition,通过partitionBy()设定,每次partition
    ```

安装:
	vim /etc/profile

    	# scala
    	export SCALA_HOME=/opt/scala
    	export PATH=$SCALA_HOME/bin:$PATH
    	# spark
    	export SPARK_HOME=/opt/spark
    	export PATH=$SPARK_HOME/bin:$PATH

语法:
	SparkContext:
		类名:org.apache.spark.SparkContext
		spark上下文对象,是spark程序的入口文件,负责连接到spark cluster
		可用于创建RDD,在集群上创建累加器和广播变量
		每个JVM只能激活一个SparkContext对象,创建新的SparkContext对象时,必须stop掉原来的对象
	MapReduce:
		map : split
	RDD (Resilient弹性 Distributed分布式 Dataset数据集):
		类名:org.apache.spark.rdd.RDD (抽象类)
		不可变、可分区的元素集合,可进行并行操作,该类包含了可用于与所有RDD之上的基本操作,如map,filter,persist

    	在RDD内部,每个RDD有五个特征
    	1.有一个分区列表
    	2.每个split都有一个计算函数
    	3.存放parent的RDD以来列表
    	4.(可选)基于key-value的分区器
    	5.(可选)首选的位置列表
    	Spark集群中的所有调度和执行都是基于这些方法,RDD可以自定义实现方式
    	eg:
    		val lines = sc.textFile("file:///home/ubuntu/data.txt")		//加载文本,形成rdd,不加file读取hdfs上的文件
    		lines.count()												//行数统计
    		lines.take(2)												//读取前两行
    		lines.first(2)												//读取前两行
    Spark-Shell:
    	每个spark应用由driver构成,由它启动各种并行操作
    	driver含有main函数和分布式数据集,并对它们应用各种操作
    	Spark-Shell就是driver(包含main方法)
    	driver通过SparkContext访问spark,代表和spark集群的连接

    	运行程序时,驱动程序需要一些叫做executor的节点
    	eg:
    	```scala
    val lines = sc.textFile("file:///home/ubuntu/data.txt")		//加载文本,形成rdd,不加file读取hdfs上的文件
    val rdd2 = lines.filter( x => x.contrains("0000"))			//调用rdd.filter(x=>boolean),过滤含0000的行
    val rdd3 = lines.map(x => {
      val tname = Thread.currentThread().getName()
      println("tname: " + tname + " x: " + x)
      x
    })
    rdd3.count()    
    ```
    使用maven编写Scala程序:
    	1.编写scala程序
    		[ws.ascala]
    	```scala
    import org.apache.spark.SparkConf
    import org.apache.spark.SparkContext
    import org.apache.spark.SparkContext._

    object wcAPP{
      def main(args:Array[String]){
        val conf = new SparkConf().setAppName("WordCount")			//创建SparkConf对象
        val sc = new SparkContext(conf)								//创建SparkContext对象
        val input = sc.textFile("file:///home/ubuntu/bonus.txt")							//加载文件
        val words = input.flatMap(line => line.split(" "))			//安装空格切割行,然后进行压扁
        val counts = words.map(word => (word,1)).reduceByKey(case (x,y) => x + y)	//计算单词个数
        counts.saveAsTextFile("file:///home/ubuntu/result.txt")						//输出文件
      }
    }    

    ```
    	2.编写pom.xml文件
    	3.mvn clean && mvn compile && mvn package
    	4.spark-submit 提交脚本运行spark文件
    java语言编程的wc:
    	1.编写java程序
    	```java
    import org.apache.spark.SparkConf;
    import org.apache.spark.SparkContext;

    public class WcApp {
      public static void main(String[] args){
        SparkConf conf = new SparkConf();
        conf.setMaster("local[4]");
        conf.setAppName("WCApp");

        // 创建spark上下文对象
        JavaSparkContext context = new JavaSparkContext(conf);

        RDD<String> rdd = context.textFile("D:/a.txt");
        JavaRDD<String> words = rdd.flatMap(new FlatMapFunction<String, String>(){
          public Iterable<String> call(String t) throws Exception {
            return Arrays.asList(t.split(","));				// 可迭代数组集
          }
        });
        JavaPairRDD<String, Integer> counts = words.maToPair(
          new PairFunction<String, String, Integer>(){
            public Tuple2<String, Integer> call(String x){
              return new Tuple2(x, 1);
            }
          }
        ).reduceByKey(new Function2<Integer, Integer, Integer>(){
          public Integer call(Integer x, Integer y){
            return x + y;
          }
        });
        counts.saveAsTextFile("D:/result.txt");
      }
    }    
    ```
    	2.引入类库:
    	```
    	hadoop/shared/common/lib/*.jar
    ```
    	3.运行程序

````shell
     # java
       java -cp /soft/spark/lib/spark-assembly-1.6.1-hadoop2.2.0.jar:`hadoop classpath`:. WcApp
       spark-submit --class WcApp ./target/learning-spark-mini-example-0.0.1.jar \
       ./README.md ./wordcounts  
     ```
    	spark master 界面:
    		http://localhost:4040/
    	启动spark-shell,指定并发线程数:

    	```shell
     spark-shell --master local[4]
     spark-shell --master spark://master:7077  
````

    ## RDD基础:

  
