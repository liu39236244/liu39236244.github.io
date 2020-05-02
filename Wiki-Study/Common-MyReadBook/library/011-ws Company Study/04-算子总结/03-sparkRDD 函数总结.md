# JAVA_api 编写 程序总结


# 各种RDD 有的操作

union 、 persist（StorageLevel.MEMORY_ONLY_SER()）、collect

JavaPairRDD<String, String> 类型 collect 之后是List<Tuple2<String, String>>  
JavaRDDString> 类型 collect 之后是List<String>   类型



# map 、flatmap 、maptopair
##  map

  map(Function(输入，输出)) -》 匿名方法返回String,map返回的是正常的JavaRDD<String>

输入输出，直接加载进来文件也可以直接使用Tuple2<String,String>格式，
如下

###  直接加载tuple2 类型文件

```Java
JavaRDD<String> li = SparkInitMgr.jssc.sparkContext().wholeTextFiles(outputPath + "road/roadSports_*", 25).map(new Function<Tuple2<String, String>, String>() {
            private static final long serialVersionUID = 1L;

            @Override
            public String call(Tuple2<String, String> v1) throws Exception {
                // TODO Auto-generated method stub
                return v1._2;
            }
        });


```
###


---
---

## flatmap

flatmap(new FlatMapFunction(输入，输出)) -》 匿名方法返回 Iterable<String> ，flatmap返回JavaRDD<String>

分隔符可以为很多，也可以为 "\\n" 作为,


tuple2 -> list  可以使用flatmap

### 分割换行符

```Java
JavaRDD<String> li = SparkInitMgr.jssc.sparkContext().wholeTextFiles(outputPath + "road/roadSports_*", 25).map(new Function<Tuple2<String, String>, String>() {
            private static final long serialVersionUID = 1L;

            @Override
            public String call(Tuple2<String, String> v1) throws Exception {
                // TODO Auto-generated method stub
                return v1._2;
            }
        });

```

```
1. 内部 定义List<String> ArrayList<String> 就可以
```


---
分隔符
---


## mapToPair

mapToPair(new PairFucntion(输入，输出)) -> 匿名方法返回 Tuple2<String，String> ，mapToPair返回JavaPairRDD<String,String>

line -> tuple2<String,String>
```




```


## reducebykey （前提必须是key,value 类型的数据）的使用
reduceByKey(new Function2(Tuple<String,String>,String,String))  方法返回的是Function2最后一个参数String类型
用于拼接

reduceByKey(new Function2(Tuple<String,Integer>,String,Integer))  方法返回的是Function2最后一个参数Integer类型
用于计算

```Java
// 公共计算方法
	public JavaPairRDD<String, String> reduceBykey(
			JavaPairRDD<String, String> paris) {
		// 计算当前
		JavaPairRDD<String, String> pairs2 = paris
				.reduceByKey(new Function2<String, String, String>() {
					/**
			 *
			 */
					private static final long serialVersionUID = 1L;

					public String call(String v1, String v2) throws Exception {
						// TODO Auto-generated method stub
//						logger.warn(v1 + "!!%" + v2);
						return Integer.parseInt(v1) + Integer.parseInt(v2) + "";
					}
				});

		return pairs2;
	}

```

## join 拼接


* JavaPairRDD<String, Tuple2<String, String>> join = roadMax.join(roadCount);

```


```

## 两个RDD 数据根据key 进行拼接 union 、

需求描述:

* JavaPairRDD<String,String> area_1
```
数据:
1,2
2,3
3,5


```

JavaPairRDD<String,String> area_2

```
数据:
1,小明
2,小红
3,小兰

```

拼接结果
使用union 合集（注意没有去重功能），
area_1.union(area_2)
```
1,2|小明
2,3|小红
3,5|小兰
```
方法代码如下

```Java
// 根据key值 对value进行拼接
	public JavaPairRDD<String, String> getResultRdds(
			JavaPairRDD<String, String> paris,
			JavaPairRDD<String, String> paris1) {
		JavaPairRDD<String, String> paris_s = paris.union(paris1);
		JavaPairRDD<String, String> countRdd = paris_s
				.reduceByKey(new Function2<String, String, String>() {

					private static final long serialVersionUID = 1L;

					public String call(String v1, String v2) throws Exception {
						return v1+"|"+v2;
					}
				});
		return countRdd;

	}
```


##  匿名函数定义

### PairFunction 方法定义，直接作为参数传递

```Java
PairFunction<String, String, String> keyData = new PairFunction<String, String, String>() {

			private static final long serialVersionUID = 1L;

			public Tuple2<String, String> call(String line) throws Exception {
				Tuple2<String, String> keyValue = null;
				String[] fields = line.split(SpliterFlag.VERTICAL_BAR_SPLIT);
				String key = fields[0]+"|"+fields[1];
				String value = "1";
				keyValue = new Tuple2<String, String>(key, value);
				return keyValue;
			}
		};

```

## 二元数据 JavaPairRDD<String,String>

### 博主总结

[详细解释-博主1地址](https://blog.csdn.net/m0_37636453/article/details/78965992)
[leftOuterJoin、RightOuterJoin、substractByKey-博主地址](http://lxw1234.com/archives/2015/07/386.htm)
```
leftOuterJoin

def leftOuterJoin[W](other: RDD[(K, W)]): RDD[(K, (V, Option[W]))]

def leftOuterJoin[W](other: RDD[(K, W)], numPartitions: Int): RDD[(K, (V, Option[W]))]

def leftOuterJoin[W](other: RDD[(K, W)], partitioner: Partitioner): RDD[(K, (V, Option[W]))]



leftOuterJoin类似于SQL中的左外关联left outer join，返回结果以前面的RDD为主，关联不上的记录为空。只能用于两个RDD之间的关联，如果要多个RDD关联，多关联几次即可。

参数numPartitions用于指定结果的分区数
_____________________________________________________________________________________________________________________
参数partitioner用于指定分区函数

    var rdd1 = sc.makeRDD(Array(("A","1"),("B","2"),("C","3")),2)
    var rdd2 = sc.makeRDD(Array(("A","a"),("C","c"),("D","d")),2)

    scala> rdd1.leftOuterJoin(rdd2).collect
    res11: Array[(String, (String, Option[String]))] = Array((B,(2,None)), (A,(1,Some(a))), (C,(3,Some(c))))

_____________________________________________________________________________________________________________________
rightOuterJoin

def rightOuterJoin[W](other: RDD[(K, W)]): RDD[(K, (Option[V], W))]

def rightOuterJoin[W](other: RDD[(K, W)], numPartitions: Int): RDD[(K, (Option[V], W))]

def rightOuterJoin[W](other: RDD[(K, W)], partitioner: Partitioner): RDD[(K, (Option[V], W))]



rightOuterJoin类似于SQL中的有外关联right outer join，返回结果以参数中的RDD为主，关联不上的记录为空。只能用于两个RDD之间的关联，如果要多个RDD关联，多关联几次即可。

参数numPartitions用于指定结果的分区数
_____________________________________________________________________________________________________________________
参数partitioner用于指定分区函数

    var rdd1 = sc.makeRDD(Array(("A","1"),("B","2"),("C","3")),2)
    var rdd2 = sc.makeRDD(Array(("A","a"),("C","c"),("D","d")),2)
    scala> rdd1.rightOuterJoin(rdd2).collect
    res12: Array[(String, (Option[String], String))] = Array((D,(None,d)), (A,(Some(1),a)), (C,(Some(3),c)))
_____________________________________________________________________________________________________________________

subtractByKey

def subtractByKey[W](other: RDD[(K, W)])(implicit arg0: ClassTag[W]): RDD[(K, V)]

def subtractByKey[W](other: RDD[(K, W)], numPartitions: Int)(implicit arg0: ClassTag[W]): RDD[(K, V)]

def subtractByKey[W](other: RDD[(K, W)], p: Partitioner)(implicit arg0: ClassTag[W]): RDD[(K, V)]



subtractByKey和基本转换操作中的subtract类似

（http://lxw1234.com/archives/2015/07/345.htm），只不过这里是针对K的，返回在主RDD中出现，并且不在otherRDD中出现的元素。

参数numPartitions用于指定结果的分区数
_____________________________________________________________________________________________________________________
参数partitioner用于指定分区函数

    var rdd1 = sc.makeRDD(Array(("A","1"),("B","2"),("C","3")),2)
    var rdd2 = sc.makeRDD(Array(("A","a"),("C","c"),("D","d")),2)

    scala> rdd1.subtractByKey(rdd2).collect
    res13: Array[(String, String)] = Array((B,2))
_____________________________________________________________________________________________________________________   
```



## RDD数据函数

parallelize 、wholeTextFiles
