# spark RDD 生成

# spark core  RDD

## SparkContext


## 2-JavaSparkStreaming

### 2-0单个List


```java
public static List<String> stationlist=new ArrayList<String>();
....数据添加
final JavaRDD<String> parallelize = SparkInitMgr.jssc.sparkContext().parallelize(SysInfo.stationlist); // parallelize(List<T extends Object>)

```

### 2-1 单个文本

```java
// jssc ： JavaSparkStreaming 类型
JavaRDD<String> sport = SparkInitMgr.jssc.sparkContext().textFile(savePath + "Stop" + beforeMintu + ".dat");
```

## 2-2 多个文本

```Java
// 键值对：v1._1 文件的路径 ，v1._2 对应的是文件的内容
final JavaPairRDD<String, String> stringStringJavaPairRDD = SparkInitMgr.jssc.sparkContext().wholeTextFiles("").map(new Function<Tuple2<String, String>, String>() {
                        private static final long serialVersionUID = 1L;
                        @Override
                        public String call(Tuple2<String, String> v1)
                            throws Exception {
                            return v1._2;
                        }
                    });;


```












# 2-spark-sql RDD 生成
