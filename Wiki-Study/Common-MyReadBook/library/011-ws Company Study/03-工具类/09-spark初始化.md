# Spark初始化工具类

## spark 初始化

```Java
mport cn.netcommander.ptt.config.Config;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.JavaSparkContext;


import java.io.Serializable;
import java.util.Arrays;


public class SparkInitMgr implements Serializable{
	private final static Log logger = LogFactory.getLog(SparkInitMgr.class);
	/**
	 *
	 */
	private static final long serialVersionUID = 1L;
	public static SparkConf conf=null;
	public static JavaSparkContext jsc;
	public static void initSpark(){

		if(conf == null){
			//指定核数
//			System.setProperty("spark.cores.max",Config.spark_cores_max);
			conf = new SparkConf();
			conf.setAppName("PTT_Streaming");
			conf.set("spark.default.parallelism", "200");
			conf.set("spark.serializer", "org.apache.spark.serializer.KryoSerializer");
			conf.set("spark.kryo.registrator", toKryoRegistrator.class.getName());
			conf.set("spark.kryoserializer.buffer.max","1024m"); // 序列化最大缓存
			conf.set("spark.rdd.compress", "true");
			conf.set("spark.driver.maxResultSize","3g");
			conf.setMaster("local[*]");
			conf.setMaster(Config.master);//NUC-2:7077
		/*	conf.setMaster(Config.master);//ras224:7077
			conf.set("spark.executor.memory", Config.spark_executor_memory); //spark 运行内存 16
			conf.set("spark.executor.cores", Config.spark_executor_cores);//3
			conf.set("spark.executor.num", Config.spark_executor_num);//8
//			conf.set("spark.executor.instances","14");
			conf.set("spark.driver.maxResultSize", Config.spark_driver_maxResultSize);
			System.out.println("spark_default_parallelism:"+Config.spark_default_parallelism);
			conf.set("spark.default.parallelism", Config.spark_default_parallelism);
			conf.set("spark.deploy-mode", "client");*/
//			org.apache.spark.SparkException: Found both spark.executor.extraJavaOptions and SPARK_JAVA_OPTS. Use only the former.

//			conf.set("spark.eventLog.enabled","true"); memory:400G cores:100 n*c=25
//			conf.set("spark.eventLog.compress","true");
//			conf.set("spark.eventLog.dir","hdfs://NUC-2:8020/directory");
		}else{
			logger.info("----------Spark.conf---------:"+conf.getAppId());
		}

//

		if(jsc == null){
//			jssc = new JavaStreamingContext(conf, Durations.seconds(5));
//			jssc.sparkContext().addJar("lib/risktransportable_streaming-0.0.1.jar");
			jsc=new JavaSparkContext(conf);
//			String userdir = System.getProperty("user.dir");
//			jssc.sparkContext().addJar(userdir+"/lib/risktransportable_streaming-0.0.1.jar");
		}


	}

	/*
	 * 初始化共享变量，广播变量
	 */
	public static void initSparkSharedVariables(){
		//		if(sc != null){
		//			SysInfo.industryActions_spark = sc.broadcast(SysInfo.industryActions);
		//			SysInfo.content_map_spark = sc.broadcast(SysInfo.content_map);
		//			SysInfo.content_mate_map_spark = sc.broadcast(SysInfo.content_mate_map);
		//			SysInfo.weixin_map_spark = sc.broadcast(SysInfo.weixin_map);
		//		}
	}

	public static void main(String[] args) {
		String a="s|sa|sad|dffd|sadasd|sadq|";
		System.out.println(Arrays.asList(a.split("\\|")));
	}
}

```
