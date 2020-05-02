# 这里记录Spark_Core_API 学习记录

## 博客总结 java API

### java 语言编写spark 中的 map （包括lambad，Function ，定义类）、reduce、flatmap、mapPartitions、mapTopair的使用
[原博主地址](https://blog.csdn.net/huochen1994/article/details/60143562)

#### map 的三种使用

```Java
final JavaRDD<String> data = jsc.textFile(Use_Tools.spark_resource_Java() + "/Data.md");
 final JavaRDD<String> data_world = jsc.textFile(Use_Tools.spark_resource_Java() + "/world.txt");

 //　1. 使用ｌａｍｂｄａ　表达式

 final JavaRDD<String> line_length_count = data.map(s -> s.toString() + s.length());
 line_length_count.filter(x -> {
     if (x.toString().endsWith("0")) {
         return false;
     } else {
         return true;
     }
 }).foreach(x -> System.out.println(x));

 // 2. Function 用到map中输入一个输出一个
 final JavaRDD<Integer> line_length = data.map(new Function<String, Integer>() {
     @Override
     public Integer call(String s) throws Exception {
         return s.length();
     }
 });
 line_length.filter(x -> x != 0).foreach(x -> System.out.println(x.toString()));

 // 3. 自定义类
/*
class GetLength implements Function<String, int> {
     public Inter call(String s) { return s.length(); }
 }

 JavaDStream<String> lineLengths = lines.map(new GetLength())
 */


```

#### reduce

```Java
/**
  * reduce 的使用
  */

 // 1. lambda 表达式
 final Integer reduced = line_length.reduce((a, b) -> (a + b));

 // Function2 表示
 final Integer Function_reduced = line_length.reduce(new Function2<Integer, Integer, Integer>() {
     @Override
     public Integer call(Integer integer, Integer integer2) throws Exception {
         return integer + integer2;
     }
 });

```

#### reduceBykey

```Java
/**
       * reducebykey 的使用
       */

      System.out.println("reducebykey 使用");
      // maptoPair 把一行当作一个单词
      /**
       (world java,1)
       (,1)
       (world count,1)
       (php 2,null)
       (java,1)
       */
     /* final JavaPairRDD<String, Integer> tupRDD = data_world.mapToPair(
          x -> new Tuple2<String, Integer>(x, 1));*/

      // 需要注意mapToPair 把一行当做一个单词
      final JavaPairRDD<String, Integer> tupRDD = data_world.mapToPair(new PairFunction<String, String, Integer>() {
          @Override
          public Tuple2<String, Integer> call(String s) throws Exception {
              return new Tuple2(s, 1);
          }
      });

      tupRDD.reduceByKey(new Function2<Integer, Integer, Integer>() {
          @Override
          public Integer call(Integer i1, Integer i2) throws Exception {
              return i1 + i2;
          }
      }).foreach(x -> System.out.println(x.toString()));
```

#### MapPartitions



```Java
/**
        * mapPartitions
        */
       final JavaRDD<Tuple2<String, String>> tuple2JavaRDD = jsc.textFile(Use_Tools.spark_resource_Java() +"/world_ip.txt").mapPartitions(parts -> {
           List<Tuple2<String, String>> list = new ArrayList<Tuple2<String, String>>();
           while (parts.hasNext()) {
               String msg = parts.next();
               String ip = msg.split(" ")[0];
               String domain = msg.split(" ")[1];
               list.add(new Tuple2<String, String>(ip, domain));
           };
           return list.iterator();
       });

       tuple2JavaRDD.collect().forEach(x-> System.out.println(x.toString()));
       /*        (1,城市)
               (2,小明)
               (3,你的)
               (4,我的)*/
       // FlatMapFunction[T, R]
       final JavaRDD<Tuple2<String, String>> tuple2JavaRDD = jsc.textFile(
           Use_Tools.spark_resource_Java() + "/world_ip.txt").mapPartitions(
           new FlatMapFunction<Iterator<String>, Tuple2<String, String>>() {
               @Override
               public Iterator<Tuple2<String, String>> call(Iterator<String> s) throws Exception {
                   List<Tuple2<String, String>> list = new ArrayList<Tuple2<String, String>>();
                   while (s.hasNext()) {
                       final String lines = s.next();
                       String ip = lines.split(" ")[0];
                       String main = lines.split(" ")[1];
                       list.add(new Tuple2<String, String>(ip, main));
                   }
                   return list.iterator();
               }
           }
       );
```


#### flatMap

```Java
// lambda 表达式有问题的,下面一行不行
data_world.flatMap(x-> Lists.newArrayList(x.split(" "))).iterator()); //错误！

// 一下是正确示范
// flatmap
  final JavaRDD<String> stringJavaRDD1 = data_world.flatMap(x -> Arrays.asList(x.split(" ")).iterator());
  final JavaRDD<String> stringJavaRDD = data_world.flatMap(new FlatMapFunction<String, String>() {
      @Override
      public Iterator<String> call(String s) throws Exception {
          return Arrays.asList(s.split(" ")).iterator();
      }
  });

  System.out.println("flatmap 切分-----------------------------");
  //stringJavaRDD1.foreach(x-> System.out.println(x.toString()));
  final JavaPairRDD<String, Integer> stringIntegerJavaPairRDD = stringJavaRDD1.mapToPair(
      x -> new Tuple2<String, Integer>(x, 1));
  final JavaPairRDD<String, Integer> reduceBykeyed = stringIntegerJavaPairRDD.reduceByKey(
      (a, b) -> a + b);

  System.out.println("reduceBykeed.collect.foreach--------------------");
  reduceBykeyed.collect().forEach(x-> System.out.println(x.toString()));


```


#### flatMapToPair

```Java
/**
        * flatMapToPair
        */

       // lamba 表达式

       final JavaPairRDD<String, String> stringStringJavaPairRDD1 = data_world.flatMapToPair(x -> {
           final String[] line = x.split(" ");
           List<Tuple2<String, String>> list = new ArrayList<>();
           list.add(new Tuple2<String, String>(line[0].toString(), line[1].toString()));
           return list.iterator();
       });
       stringStringJavaPairRDD1.collect().forEach(x -> System.out.println(x.toString()));

       // PairFlatMapFunction
       final JavaPairRDD<String, String> stringStringJavaPairRDD = data_world.flatMapToPair(
           new PairFlatMapFunction<String, String, String>() {
               List<Tuple2<String, String>> list = new ArrayList<>();

               @Override
               public Iterator<Tuple2<String, String>> call(String s) throws Exception {
                   final String[] array = s.split(" ");

                   list.add(new Tuple2<String, String>(array[0].toString(), array[1].toString()));
                   return list.iterator();
               }
           });

```




原博主有冲突地方：

#### flatMap

* //博主版本
```Scala
// Use lambda syntax
JavaDStream<String> words = lines.flatMap(x -> Lists.newArrayList(x.split(" ")));
Implement the Function interfaces

// FlatMapFunction[T, R]
JavaDStream<String> words = lines.flatMap(new FlatMapFunction<String, String>() {
    // call(t: T): Iterator[R]
    public Iterable<String> call(String x) {
        return Lists.newArrayList(SPACE.split(x));
    }
});

```

```Scala



// 返回正确flatmap
       final JavaRDD<String> stringJavaRDD1 = data_world.flatMap(x -> Arrays.asList(x.split(" ")).iterator());
       final JavaRDD<String> stringJavaRDD = data_world.flatMap(new FlatMapFunction<String, String>() {
           @Override
           public Iterator<String> call(String s) throws Exception {
               return Arrays.asList(s.split(" ")).iterator();
           }
       });

       System.out.println("flatmap 切分-----------------------------");
       //stringJavaRDD1.foreach(x-> System.out.println(x.toString()));
       final JavaPairRDD<String, Integer> stringIntegerJavaPairRDD = stringJavaRDD1.mapToPair(
           x -> new Tuple2<String, Integer>(x, 1));
       final JavaPairRDD<String, Integer> reduceBykeyed = stringIntegerJavaPairRDD.reduceByKey(
           (a, b) -> a + b);
       System.out.println("reduceBykeed.collect.foreach--------------------");
       reduceBykeyed.collect().forEach(x-> System.out.println(x.toString()));

```

* mapPartitions

```Scala


```


[博主2]()

```Scala
import akka.japi.Function2;  
import org.apache.spark.HashPartitioner;  
import org.apache.spark.SparkConf;  
import org.apache.spark.api.java.JavaPairRDD;  
import org.apache.spark.api.java.JavaRDD;  
import org.apache.spark.api.java.JavaSparkContext;  
import org.apache.spark.api.java.function.FlatMapFunction;  
import org.apache.spark.api.java.function.Function;  
import org.apache.spark.api.java.function.PairFlatMapFunction;  
import org.apache.spark.storage.StorageLevel;  
import scala.Tuple2;  

import java.io.File;  
import java.io.Serializable;  
import java.util.ArrayList;  
import java.util.Arrays;  
import java.util.Iterator;  
import java.util.List;  

/**
         * map flatMap flatMapToPair mapPartitions 的区别和用途
         *
         * 例如数据是：name：gaoyue age：28
         *
         * 方法一：map,我们可以看到数据的每一行在map之后产生了一个数组，那么rdd存储的是一个数组的集合
         * rdd存储的状态是Array[Array[String]] = Array(Array(name, gaoyue), Array(age, 28))
         *Array[String] = Array(name, gaoyue, age, 28)
         */  

        JavaRDD<String[]> mapresult=lines.map(new Function<String, String[]>() {  

            @Override  
            public String[] call(String s) throws Exception {  
                return s.split(":");  
            }  
        });  




        /**
         * 方法二：flatMap
         * 操作1：同map函数一样：对每一条输入进行指定的操作，然后为每一条输入返回一个对象
         * 操作2：最后将所有对象合并为一个对象
         */  
        JavaRDD<String> objectJavaRDD = lines.flatMap(new FlatMapFunction<String, String>() {  

            @Override  
            public Iterable<String> call(String s) throws Exception {  
                return Arrays.asList(s.split(" "));  
            }  
        });  

        /**
         * 方法三：
         * mappartition
         *rdd的mapPartitions是map的一个变种，它们都可进行分区的并行处理。两者的主要区别是调用的粒度不一样：
         * map的输入变换函数是应用于RDD中每个元素，而mapPartitions的输入函数是应用于每个分区。也就是把每个分区中的内容作为整体来处理的。
         *
         */  
        lines2.mapPartitions(new FlatMapFunction<Iterator<String>, String>() {  
            ArrayList<String> results = new ArrayList<String>();  

            @Override  
            public Iterable<String> call(Iterator<String> s) throws Exception {  
                while (s.hasNext()) {  
                    results.addAll(Arrays.asList(s.next().split(":")));  
                }  
                return results;  
            }  
        }).saveAsTextFile("/Users/luoluowushengmimi/Documents/result");  

        /**
         * flatMapToPair
         * 操作1：同map函数一样：对每一条输入进行指定的操作，然后为每一条输入返回一个key－value对象
         * 操作2：最后将所有key－value对象合并为一个对象 Iterable<Tuple2<String, String>>
         *
         */  

        JavaPairRDD<String,String> pair=lines.flatMapToPair(new PairFlatMapFunction<String, String, String>() {  

            @Override  
            public Iterable<Tuple2<String, String>> call(String s) throws Exception {  
                String[] temp=s.split(":");  
                ArrayList<Tuple2<String,String>> list=new ArrayList<Tuple2<String,String>>();  
                list.add(new Tuple2<String,String>(temp[0],temp[1]));  
                return list;  
            }  
        });  
```

# 官网API

## spark2.2 官方 wc

```Java
/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.spark.examples;

import scala.Tuple2;

import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.sql.SparkSession;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

public final class JavaWordCount {
  private static final Pattern SPACE = Pattern.compile(" ");

  public static void main(String[] args) throws Exception {

    if (args.length < 1) {
      System.err.println("Usage: JavaWordCount <file>");
      System.exit(1);
    }

    SparkSession spark = SparkSession
      .builder()
      .appName("JavaWordCount")
      .getOrCreate();

    JavaRDD<String> lines = spark.read().textFile(args[0]).javaRDD();

    JavaRDD<String> words = lines.flatMap(s -> Arrays.asList(SPACE.split(s)).iterator());

    JavaPairRDD<String, Integer> ones = words.mapToPair(s -> new Tuple2<>(s, 1));

    JavaPairRDD<String, Integer> counts = ones.reduceByKey((i1, i2) -> i1 + i2);

    List<Tuple2<String, Integer>> output = counts.collect();
    for (Tuple2<?,?> tuple : output) {
      System.out.println(tuple._1() + ": " + tuple._2());
    }
    spark.stop();
  }
}
```
