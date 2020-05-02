# 这里记录部分记录
##　Ｓｐａｒｋ开始 Core

[使用快捷键](https://blog.csdn.net/xuanze520/article/details/6773976)

[java git官网地址](https://github.com/apache/spark/tree/master/examples/src/main/java/org/apache/spark/examples)
[datasource parquet](https://github.com/apache/spark/blob/master/examples/src/main/java/org/apache/spark/examples/sql/JavaSQLDataSourceExample.java)

### 简单使用
```Scala
public static void Test_Start (){
        SparkConf conf = new SparkConf().setAppName("appName").setMaster("local[2]");
        JavaSparkContext sc = new JavaSparkContext(conf);

       /**
        * 1. 创造JavaRDD
        */
       List<Integer> data= Arrays.asList(1,2,3,4,5);
        JavaRDD<Integer> distData = sc.parallelize(data);

       /**
        * distFile
        */
       //final JavaRDD<String> distFile = sc.textFile(Use_Tools.Spark_Java_resource() + "Data_Test.md");
       final JavaRDD<String> distFile = sc.textFile(Use_Tools.Spark_Java_resource() + "world.txt");

       System.out.println(distFile.collect().toString());
       //[java, english, python, scala]

       final JavaRDD<Integer> lineLength = distFile.map(line -> line.length());
       // 给了三个分区

       System.out.println(lineLength.collect().toString());
       //[4, 7, 6, 5]

       int allLength=lineLength.reduce((a,b) -> a+b);
       //[4, 7, 6, 5] 每行文字长度综合 22
       System.out.println(allLength);

       lineLength.persist(StorageLevel.MEMORY_ONLY());

       lineLength.unpersist();


   }

```
### 自定义函数

```Scala
JavaRDD<String> lines = sc.textFile("data.txt");
JavaRDD<Integer> lineLengths = lines.map(new Function<String, Integer>() {
  public Integer call(String s) { return s.length(); }
});
int totalLength = lineLengths.reduce(new Function2<Integer, Integer, Integer>() {
  public Integer call(Integer a, Integer b) { return a + b; }
});

Or, if writing the functions inline is unwieldy:

class GetLength implements Function<String, Integer> {
  public Integer call(String s) { return s.length(); }
}
class Sum implements Function2<Integer, Integer, Integer> {
  public Integer call(Integer a, Integer b) { return a + b; }
}

JavaRDD<String> lines = sc.textFile("data.txt");
JavaRDD<Integer> lineLengths = lines.map(new GetLength());
int totalLength = lineLengths.reduce(new Sum());
```

### tuple2 使用javaPairRDD 表示

```Scala
/**
    * tuple2 类的使用， 表示为JavaPairRDD
    */
   public static void tuple_2(){
       SparkConf conf = new SparkConf().setAppName("appName").setMaster("local[2]");
       JavaSparkContext sc = new JavaSparkContext(conf);
       //final JavaRDD<String> distFile = sc.textFile(Use_Tools.Spark_Java_resource() + "Data_Test.md");
       final JavaRDD<String> distFile = sc.textFile(Use_Tools.Spark_Java_resource() + "world.txt");
       final JavaPairRDD<String, Integer> pairs = distFile.mapToPair(s -> new Tuple2(s, 1));
       final JavaPairRDD<String, Integer> counts = pairs.reduceByKey((a, b) -> a + b);
       System.out.println(counts.collect().toString());
   }
```

### broadcast

```Scala

    /**
     * broad cast
     *
     */
    public static void broadcast (JavaSparkContext jsc){

        final Broadcast<int[]> broadcast = jsc.broadcast(new int[] {1, 2, 3});
        broadcast.value();
        // returns [1, 2, 3]
    }


```
### 自定义Accumulator

```Scala
/**
 * 这个是  Accumulator_Custoer 所用
 */
 class VectorAccumulatorV2 extends AccumulatorV2<MyVector,MyVector> {

    private MyVector myVector = MyVector.createZeroVector();

     @Override
     public boolean isZero() {
         return false;
     }

     @Override
     public AccumulatorV2<MyVector, MyVector> copy() {
         return null;
     }

     @Override
    public void reset() {
        myVector.reset();
    }

    @Override
    public void add(MyVector v) {
        myVector.add(v);
    }

     @Override
     public void merge(AccumulatorV2<MyVector, MyVector> other) {

     }

     @Override
     public MyVector value() {
         return null;
     }

 }
class MyVector {

    public static MyVector createZeroVector() {
        return new MyVector();
    }

    public void reset() {
    }

    public void add(MyVector v) {
    }
}


// 使用
public void Accumulator_Custoer(JavaSparkContext jsc){

       VectorAccumulatorV2 myVectorAcc=new VectorAccumulatorV2();
       jsc.sc().register(myVectorAcc,"MyVectorAcc_1");

       myVectorAcc.add(new MyVector());
       myVectorAcc.value();
   }


```

### 注意没有action的话数值是不会变得

```Scala
LongAccumulator accum = jsc.sc().longAccumulator();
data.map(x -> { accum.add(x); return f(x); });
// Here, accum is still 0 because no actions have caused the `map` to be computed.


```
