# spark 学习中记录的问题

## spark-问题总结——core

### 1-spark 中的两种共享变量

    Spark 支持 2 种类型的共享变量：广播变量(broadcast
    variables)，用来在所有节点的内存中缓存一个值；累加器(accumulators)，仅仅只能执行“添
    加(added)”操作，例如：记数器(counters)和求和(sums)。


### 2-Spark 创建两种RDD的方式

Spark 核心的概念是 Resilient Distributed Dataset (RDD)：一个可并行操作的有容错机制的数
据集合。有 2 种方式创建 RDDs：第一种是在你的驱动程序中并行化一个已经存在的集合；
另外一种是引用一个外部存储系统的数据集，例如共享的文件系统，HDFS，HBase或其他
Hadoop 数据格式的数据源

### 3-RDD 并行集合重要的参数
* slices 切片
并行集合一个很重要的参数是切片数(slices)，表示一个数据集切分的份数。Spark 会在集群
上为每一个切片运行一个任务。你可以在集群上为每个 CPU 设置 2-4 个切片(slices)。正常情
况下，Spark 会试着基于你的集群状况自动地设置切片的数目。然而，你也可以通过
parallelize  的第二个参数手动地设置(例如： sc.parallelize(data, 10)  )。


### 4-RDD 的操作
RDD有两种操作，Transformations 、atcion 两种，一种是转换，窄依赖。第二种是action算子，宽依赖也就是产生shuffle

#### [4-1]Transformations 操作

##### 1-map
并没有产生真正的数据转换如：map 是一个转换操作，它将每一个数据集元素传递给一个函数并且返回一个新的 RDD


---

#### [4-2] action 算子

#### 1- reduce
将集合中的元素进行聚合，并返回个李驱动程序

#### 2- reducebykey

返回是分布式数据集

### spark 执行快的原因你认为？

* 拥有两种操作，transformations 算子是惰性的，并没有真正计算

* 计算的数据能够被持久化persist （cache） 到内存中，也能缓存到磁盘，也能在多节点之间进行备份。


---


## spark-创建RDD 的方式

* parallelize()/textFile()
* 此外spark sql 读取不同类型的文档，包括读取json数据，txt数据，或是数据库数据

## spark 共享变量有几种方法？

* 两种，一种是广播变量broadcast ，临沂中就是Accumulators
官方原文：
Normally, when a function passed to a Spark operation (such as map or reduce) is executed on a remote cluster node, it works on separate copies of all the variables used in the function. These variables are copied to each machine, and no updates to the variables on the remote machine are propagated back to the driver program. Supporting general, read-write shared variables across tasks would be inefficient. However, Spark does provide two limited types of shared variables for two common usage patterns: broadcast variables and accumulators.
译文：
```
通常，当在远程集群节点上执行传递给Spark操作（如map或reduce）的函数时，它将在函数中使用的所有变量的单独副本上运行。这些变量被复制到每台机器上，并且远程机器上变量的更新没有传播回驱动程序。在任务之间支持通用的，可读写的共享变量将是低效的。但是，Spark为两种常见使用模式提供了两种有限类型的共享变量：broadcast(广播变量)和accumulators（累加器）。
```

---

## spark 如何杀死进程任务

## Spark 任务相关

### 提交命令指定jar，根据id杀死进程

> ./bin/spark-class org.apache.spark.deploy.Client kill <master url> <driver ID>

    You can find the driver ID through the standalone Master web UI at http://<master url>:8080.

## python 中的 持久化机制 需要序列化吗？

* 不需要，python 中如果持久化数据的话不支持带有ser的 级别，因为他是串行数据，跟序列话没有关系

## Accumulators 在python中如何使用？

* python暂时不支持Accumulators


## Accumulators 的创建方法

可以通过调用SparkContext.longAccumulator（）或SparkContext.doubleAccumulator（）分别累积Long或Double类型的值来创建数字累加器。然后，使用add方法可以将在群集上运行的任务添加到群集中。但是，它们无法读取其价值。只有驱动程序可以使用其值方法读取累加器的值。
### 累加器自定义的实现，需要实现多少方法？

While this code used the built-in support for [accumulators](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.util.AccumulatorV2) of type Long, programmers can also create their own types by subclassing AccumulatorV2. The AccumulatorV2 abstract class has several methods which one has to override: reset for resetting the accumulator to zero, add for adding another value into the accumulator, merge for merging another same-type accumulator into this one. Other methods that must be overridden are contained in the [API documentation](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.util.AccumulatorV2) For example, supposing we had a MyVector class representing mathematical vectors, we could write:
译文：

```
虽然此代码使用对Long类型的累加器的内置支持，但程序员还可以通过继承AccumulatorV2来创建它们自己的类型。 AccumulatorV2抽象类有几个方法必须覆盖：reset 以将累加器复位为零，add用于将另一个值添加到累加器中，merge以将另一个相同类型的累加器合并到该累加器中。其他必须被覆盖的方法包含在API文档中。例如，假设我们有一个表示数学向量的MyVector类，我们可以这样写：
```
案例：

第三方类：My_Vector

```js
package lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulators

object My_Vector {
  def createZeroVector(): My_Vector = {
    return new My_Vector(1, 2, 3)
  }
}

class My_Vector(x: Int, y: Int, val z: Int = 0) {
  def createZeroVector(): Unit = {

  }

  def reset(): Unit = {

  }

  def add(v: My_Vector): Unit = {

  }
}

```

```
import lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulators.My_Vector
import org.apache.spark.util.AccumulatorV2

class Vector_Accumulator2  extends AccumulatorV2[My_Vector,My_Vector] {
  private val v:My_Vector = My_Vector.createZeroVector()

  override def isZero: Boolean = ???

  override def copy(): AccumulatorV2[My_Vector, My_Vector] = ???

  override def reset(): Unit = {v.reset()}

  override def add(v: My_Vector): Unit = v.add(v)

  override def merge(other: AccumulatorV2[My_Vector, My_Vector]): Unit = ???

  override def value: My_Vector = ???
}

```

下面是早期版本的api(仅供参考)

```Java
object VectorAccumulatorParam extends AccumulatorParam[Vector] {
def zero(initialValue: Vector): Vector = {
Vector.zeros(initialValue.size)
}
def addInPlace(v1: Vector, v2: Vector): Vector = {
v1 += v2
}
}
// Then, create an Accumulator of this type:
val vecAccum = sc.accumulator(new Vector(...))(VectorAccumulatorParam)
```
---
# 后期解决的问题

# 执行找不到主类

* spark pipeTest 主类找不到

spark-submit --class lzkj.Spark_Study.Spark_Core.pipeTest.PipeTest  --master local[4] /shenyabo/HadoopTest/jars/sc.jar  /shenyabo/HadoopTest/shell/echo.sh

原因：达成jar包，用idea的方式不可以

## 因此实用插件打包：


```xml
<build>
        <defaultGoal>compile</defaultGoal>
        <plugins>
            <!--Java代码编译插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.7.0</version>
                <executions>
                    <execution>
                        <id>default-compile</id>
                        <phase>compile</phase>
                        <goals>
                            <goal>compile</goal>
                        </goals>
                        <configuration>
                            <encoding>UTF-8</encoding>
                        </configuration>
                    </execution>
                </executions>
            </plugin>

            <!--Scala代码编译插件-->
            <plugin>
                <groupId>net.alchim31.maven</groupId>
                <artifactId>scala-maven-plugin</artifactId>
                <version>3.3.1</version>
                <executions>
                    <execution>
                        <id>scala-compile-first</id>
                        <phase>process-resources</phase>
                        <goals>
                            <goal>add-source</goal>
                            <goal>compile</goal>
                        </goals>
                    </execution>
                    <execution>
                        <id>scala-test-compile</id>
                        <phase>process-test-resources</phase>
                        <goals>
                            <goal>testCompile</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!--依赖JAR提取插件-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-dependency-plugin</artifactId>
                <version>3.0.2</version>
                <configuration>
                    <outputDirectory>${project.build.directory}/lib</outputDirectory>
                </configuration>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>copy-dependencies</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <!--生成主清单属性-->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.0.2</version>
                <configuration>
                    <archive>
                        <manifest>
                            <addClasspath>true</addClasspath>
                            <classpathPrefix>lib/</classpathPrefix>
                            <mainClass>lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulator_2.MyAccumulator_Test</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>
        </plugins>
    </build>

```



## spark-sql 中的问题

###  spark 2.2 中提供了那些 关于hive 的支持


SparkSession in Spark 2.0 provides builtin（内部的） support for Hive features including the ability to write queries using HiveQL, access to Hive UDFs, and the ability to read data from Hive tables. To use these features, you do not need to have an existing Hive setup.
译文：

```
Spark 2.0中的SparkSession为Hive特性提供内置（内部的）支持，包括使用HiveQL编写查询，访问Hive UDF以及从Hive表读取数据的能力。要使用这些功能，您不需要有现有的Hive安装程序。
```
### 创建 sparksession
import org.apache.spark.sql.SparkSession

val spark = SparkSession
  .builder()
  .appName("Spark SQL basic example")
  .config("spark.some.config.option", "some-value")
  .getOrCreate()

// 本地
SparkSession.builder
  .master("local")
  .appName("Word Count")
  .config("spark.some.config.option", "some-value")
  .getOrCreate()

### spark 的sql 语句方式创建临时全局视图需要注意：
1- 知道spark应用程序终止前都可以访问
2- 必须要注意global-temp.tablename

Temporary views in Spark SQL are session-scoped and will disappear if the session that creates it terminates. If you want to have a temporary view that is shared among all sessions and keep alive until the Spark application terminates, you can create a global temporary view. Global temporary view is tied to a system preserved database global_temp, and we must use the qualified name to refer it, e.g. SELECT * FROM global_temp.view1.
译文：
```
Spark SQL中的临时视图是会话范围的，如果创建会话的会话终止，将会消失。如果您希望在所有会话之间共享临时视图并保持活动状态，直到Spark应用程序终止，则可以创建全局临时视图。全局临时视图与系统保存的数据库global_temp绑定，我们必须使用限定名称来引用它，例如， SELECT * FROM global_temp.view1。
```
* 映射虚拟表
局部：
df.createOrReplaceTempView("people")
val sqlDF = spark.sql("SELECT * FROM people")

全局：
df.createGlobalTempView("people")
// Global temporary view is tied to a system preserved database `global_temp`
spark.sql("SELECT * FROM global_temp.people").show()


### dataset 与dataframe 的区别

```
数据集类似于RDD，但是，它们不使用Java序列化或Kryo，而是使用专门的编码器来串行化对象以便通过网络进行处理或传输。虽然编码器和标准序列化都负责将对象转换为字节，但编码器是动态生成的代码，并使用允许Spark执行许多操作（如过滤，排序和散列）的格式，而无需将字节反序列化回对象
```

* 在这里caseclass 有个注意事项

// Note: Case classes in Scala 2.10 can support only up to 22 fields. To work around this limit,需要注意在scala2.10 仅支持到22个字段，
// you can use custom classes that implement the Product interface


* 使用官网案例时需要注意的：

case class Person(name: String, age: Long)  // 注意要拉到外面，否则会报错

// Encoders are created for case classes
val caseClassDS = Seq(Person("Andy", 32)).toDS()

## 创建dataset

```
val caseClassDS = Seq(Person("Andy", 32)).toDS()
val primitiveDS = Seq(1, 2, 3).toDS()
val peopleDS = spark.read.json(path).as[Person]
```

创建类对象
方式一：

```Scala
// 除了导入隐士转换，还需要case class
import spark.implicits._

// Create an RDD of Person objects from a text file, convert it to a Dataframe,
val peopleDF = spark.sparkContext
  .textFile("examples/src/main/resources/people.txt")
  .map(_.split(","))
  .map(attributes => Person(attributes(0), attributes(1).trim.toInt))
  .toDF()

```

方式二：

```Scala
import spark.implicits._
   // $example on:create_ds$
   // Encoders are created for case classes
   val caseClassDS = Seq(Person("Andy", 32)).toDS()  // toDS()需要手动导入隐士转化
   caseClassDS.show()
   // +----+---+
   // |name|age|
   // +----+---+
   // |Andy| 32|
   // +----+---+

   // Encoders for most common types are automatically provided by importing spark.implicits._
   val primitiveDS = Seq(1, 2, 3).toDS()
   primitiveDS.map(_ + 1).collect() // Returns: Array(2, 3, 4)

   // DataFrames can be converted to a Dataset by providing a class. Mapping will be done by name
   val path = "examples/src/main/resources/people.json"
   val peopleDS:Dataset[Person] = spark.read.json(path).as[Person]
   peopleDS.show()

```

## rdd 与数据集转化的时候的注意事项

### 本身有两种方式

1- 通过反射的方式。Spark SQL的Scala接口可以自动将包含case类的RDD转换为DataFrame。case类定义了表的模式。用反射来读取case类的参数的名称，并成为列的名称。Case类也可以嵌套或包含复杂类型，如Seqs或数组。这个RDD可以隐式地转换为DataFrame，然后注册为一个表。表可以在后续的SQL语句中使用。
隐式转化：
```
import spark.implicits._
spark.sparkContext.textFile(s"${Use_Tools.Spark_resource}/person.txt")
  .map(_.split(","))
  .map(attribute =>
    Person(attribute(0),attribute(1).trim.toInt)
  ).toDF()
完整测试代码如下：
  /**
       * 方式 一：通过反射
       */
     val spark=SparkSession.builder()
       .master("local")
       .appName("reflection_RDD_DAtaset")
       .getOrCreate()

     // 注意下面的隐式转换
     import spark.implicits._
     val person_DF=spark.sparkContext.textFile(s"${Use_Tools.Spark_resource}/people.txt")
       .map(_.split(","))
       .map(attribute =>
         Person(attribute(0),attribute(1).trim.toInt)
       ).toDF()

     person_DF.createOrReplaceTempView("people")
     val select_Df=spark.sql("select name ,age  from people where age between 13 and 19")
     select_Df.show()
     select_Df.printSchema()
     //    root
     //    |-- name: string (nullable = true)
     //    |-- age: long (nullable = false)

     select_Df.map(x =>

       s"name:${x(0)},age:${x(1)}"
     ).show(false)
     //    +--------------------+
     //    |value               |
     //    +--------------------+
     //    |name:Justin,age:19  |
     //      |name:Justin_3,age:18|
     //      |name:Justin_4,age:16|
     //      +--------------------+

 /*    select_Df.map(x=>{
       {
         s"name:${x(0)},age:${x(1)}"
       }
     }).show(false)*/

     select_Df.map(x=>{
       s"naem:${x.getAs[String]("name")}"
     }).show()

     //+-------------+
     //|        value|
     //+-------------+
     //|  naem:Justin|
     //|naem:Justin_3|
     //|naem:Justin_4|
     //+-------------+



     // No pre-defined encoders for Dataset[Map[K,V]], define explicitly,没有预先定义好的数据集编码器类型
     implicit val mapEncoder = org.apache.spark.sql.Encoders.kryo[Map[String, Any]]
     // Primitive types and case classes can be also defined as
     // implicit val stringIntMapEncoder: Encoder[Map[String, Any]] = ExpressionEncoder()

     // row.getValuesMap[T] retrieves multiple columns at once into a Map[String, T]
    // select_Df.map(teenager => teenager.getValuesMap[Any](List("name", "age"))).show(false)

     //+-------------------------------------------------------------------------------------------+
     //|value                                                                                      |
     //+-------------------------------------------------------------------------------------------+
     //|[35 01 02 40 01 03 01 6E 61 6D E5 03 01 4A 75 73 74 69 EE 40 01 03 01 61 67 E5 09 26]      |
     //|[35 01 02 40 01 03 01 6E 61 6D E5 03 01 4A 75 73 74 69 6E 5F B3 40 01 03 01 61 67 E5 09 24]|
     //|[35 01 02 40 01 03 01 6E 61 6D E5 03 01 4A 75 73 74 69 6E 5F B4 40 01 03 01 61 67 E5 09 20]|
     //+-------------------------------------------------------------------------------------------+

     select_Df.map(teenager => teenager.getValuesMap[Any](List("name", "age"))).collect().foreach(println(_))

     //Map(name -> Justin, age -> 19)
     //Map(name -> Justin_3, age -> 18)
     //Map(name -> Justin_4, age -> 16)
     // Array(Map("name" -> "Justin", "age" -> 19))

```

### 第二种方式创建数据集，编程方式的步骤？

```
1-Create an RDD of Rows from the original RDD; （创建Row(data);RDD (people) to Rows）
2-Create the schema represented by a StructType matching the structure of Rows in the RDD created in Step 1.(创建与由步骤1中创建的RDD中的行结构匹配的StructType所表示的模式。)
3-Apply the schema to the RDD of Rows via createDataFrame method provided by SparkSession.(通过SparkSession提供的createDataFrame方法将模式应用于行的RDD。)
```
官方代码：
```
import org.apache.spark.sql.types._

// Create an RDD
val peopleRDD = spark.sparkContext.textFile("examples/src/main/resources/people.txt")

// The schema is encoded in a string
val schemaString = "name age"

// Generate the schema based on the string of schema
val fields = schemaString.split(" ")
  .map(fieldName => StructField(fieldName, StringType, nullable = true))
val schema = StructType(fields)

// Convert records of the RDD (people) to Rows
val rowRDD = peopleRDD
  .map(_.split(","))
  .map(attributes => Row(attributes(0), attributes(1).trim))

// Apply the schema to the RDD
val peopleDF = spark.createDataFrame(rowRDD, schema)

// Creates a temporary view using the DataFrame
peopleDF.createOrReplaceTempView("people")

// SQL can be run over a temporary view created using DataFrames
val results = spark.sql("SELECT name FROM people")

// The results of SQL queries are DataFrames and support all the normal RDD operations
// The columns of a row in the result can be accessed by field index or by field name
results.map(attributes => "Name: " + attributes(0)).show()
// +-------------+
// |        value|
// +-------------+
// |Name: Michael|
// |   Name: Andy|
// | Name: Justin|
// +-------------+



```

#### 第二种方式创建的Schema 中，String 类型的 数据也能够进行 大小的判断！



### 创建dataframe 方式

With a SparkSession, applications can create DataFrames from an existing RDD, from a Hive table, or from Spark data sources.
1- 从已经存在的RDD
2- Hive中的表格
3- spark的一个数据源


```
val df = spark.read.json(s"${Use_Tools.Spark_resource}/people.json")

val peopleDF = spark.sparkContext
  .textFile("examples/src/main/resources/people.txt")
  .map(_.split(","))
  .map(attributes => Person(attributes(0), attributes(1).trim.toInt))
  .toDF()

```

### spark sql -读取数据

spark.read.json("examples/src/main/resources/people.json").show()


### spark sql - 操作

### spark sql 中隐士转换小细节：

// 注意这里需要引入隐士转换 import spark.implicits._
peopleDF.map(attributes => "Name:" + attributes(0)).show()
result.printSchema()

* 细节1
```
// 注意这里需要引入隐士转换 import spark.implicits._
peopleDF.map(attributes => "Name:" + attributes(0)).show()
result.printSchema()

// 使用$"列明" 需要注意导入隐式转换  import spark.implicits._
result.select($"name").show()
```
* 细节2

```

// 注意下面的隐式转换，与反射的类// case class Person(name: String, age: Int) ,注意
// import spark.implicits._ ，如果这里不定义case class Person（） ，要注意在类外面定义。如果没有 隐士转化则不能进行那个toDF（）
val person_DF = spark.sparkContext.textFile(s"${Use_Tools.Spark_resource}/people.txt")
  .map(_.split(","))
  .map(attribute =>
    Person(attribute(0), attribute(1).trim.toInt)
  ).toDF()
```

### spark UDAF 中实现的

#### 无类型定义的udaf
```
  // Data types of input arguments of this aggregate function （聚合缓冲区中的输入数据类型）
override def inputSchema: StructType = ???

override def bufferSchema: StructType = ???

override def dataType: DataType = ???

override def deterministic: Boolean = ???

override def initialize(buffer: MutableAggregationBuffer): Unit = ???

override def update(buffer: MutableAggregationBuffer, input: Row): Unit = ???

override def merge(buffer1: MutableAggregationBuffer, buffer2: Row): Unit = ???

```

#### 类型安全的用户自定义udaf

* 官网给出的定义

```
import org.apache.spark.sql.expressions.Aggregator
//import org.apache.spark.Aggregator

case class Employee (name:String,salary:Long)
case class Average(var sum:Long,var count:Long)
// 这里注意别导包导错了，应该是sql.expressions.Aggregator 中的包
object MyAverage_2 extends Aggregator[Employee,Average,Double] {
  override def zero = ???

  override def reduce(b: Average, a: Employee) = ???

  override def merge(b1: Average, b2: Average) = ???

  override def finish(reduction: Average) = ???

  override def bufferEncoder = ???

  override def outputEncoder = ???
}
```
* 这里为了好整理直接放到别的包里面 了

* 1 定义case class

```
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF.Common


case class Employee( name:String, salary:Long)
case class Average(var sum:Long,var count:Long)

```

* 2 定义自定义udaf

```
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF
import lzkj.Spark_Study.Spark_Sql.UDF.UDAF.Common.{Average, Employee}
import org.apache.spark.sql._
import org.apache.spark.sql.expressions.Aggregator
//import org.apache.spark.Aggregator
// 这里注意别导包导错了
object MyAverage_2 extends Aggregator[Employee,Average,Double] {
  // A zero value for this aggregation. Should satisfy the property that any b + zero = b (这个聚合中的zero应该满足这个特性， b +zero= b)
  override def zero:Average = Average(0L,0L)


  // Combine two values to produce a new value. For performance, the function may modify `buffer`
  // and return it instead of constructing a new object
  override def reduce(buffer: Average, employee: Employee):Average = {
    buffer.sum+=employee.salary
    buffer.count+=1
    buffer
  }

  // Merge two intermediate(中间的) values
  override def merge(b1: Average, b2: Average) :Average= {
    b1.sum+=b2.sum
    b1.count+=b2.count
    b1
  }

  // Transform the output of the reduction,转换最终的输出
  override def finish(reduction: Average):Double = {
    reduction.sum.toDouble / reduction.count

  }
  // Specifies the Encoder for the intermediate value type(指定中间值类型的编码器。)
  //import org.apache.spark.sql.{Encoder, Encoders} ，这是下面代码需要导入的
  override def bufferEncoder:Encoder[Average] = Encoders.product
  // Specifies the Encoder for the final output value type （指定最终输出值类型的编码器。）
  override def outputEncoder :Encoder[Double]= Encoders.scalaDouble
}

```

* 3 测试类

> 有个注意事项，切记as[Employee] 需要导入隐士转化，官网这里直接给出了倒入隐士转换之后的代码！这点需要注意！

```
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF

import lzkj.Spark_Study.Common_Remember.Use_Tools
import lzkj.Spark_Study.Spark_Sql.UDF.UDAF.Common.Employee
import org.apache.spark.sql.{Dataset, SparkSession, TypedColumn}


object MyAverage_2_Demo {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().master("local").appName("MyAverage_2_Demo").getOrCreate()
    var employee_DS= spark.read.json(s"${Use_Tools.Spark_resource}/employees.json")
    import spark.implicits._
    var employee_DF= employee_DS.as[Employee]
    employee_DS.show()
    val averageSalary: TypedColumn[Employee, Double] = MyAverage_2.toColumn.name("average_salary")
    val result: Dataset[Double] = employee_DF.select(averageSalary)
    result.show(false)
  }
}


```

### Data Sources

Spark SQL supports operating on a variety of data sources through the DataFrame interface. A DataFrame can be operated on using relational transformations and can also be used to create a temporary view. Registering a DataFrame as a temporary view allows you to run SQL queries over its data. This section describes the general methods for loading and saving data using the Spark Data Sources and then goes into specific options that are available for the built-in data sources.
译文：

```
Spark SQL支持通过DataFrame接口在各种数据源上运行。DataFrame可以使用关系转换操作，也可以用于创建临时视图。将DataFrame注册为临时视图可以让您在其数据上运行SQL查询。本节描述使用Spark数据源加载和保存数据的一般方法，然后进入可用于内置数据源的特定选项。
```


## Generic Load/Save Functions

In the simplest form, the default data source (parquet unless otherwise configured by spark.sql.sources.default) will be used for all operations.
译文：

```
简单的形式，默认的 datasource（parquet，除非其他配置为spark.sql.sources.default。） 支持所有的操作，

```

## spark加载数据创建DF中rdd 问题

* 需要注意DF需要需要创建RDD[Row]而不是Dataset[Row]，在map 中进行操作之前记住西安转化rdd **person_DF.rdd.map**

```
// 普通加载成DF的形式
   val optionMap: Map[String, String] = Map("header" -> "false", "inferSchema" -> "true")
   val person_DF: DataFrame = spark.read.format("com.databricks.spark.csv")
     .options(optionMap)
     .load(s"${Use_Tools.Spark_resource}/MyTest/person.csv")
   person_DF.printSchema()
   //person_DF.show(false)

   val DS_ROW: RDD[Row] = person_DF.rdd.map(x => {
     Row(x(0), x.getAs[Int](1), x.getAs[String](2))
   })

   val schema = StructType(StructField("name", StringType, true) :: StructField("age", IntegerType, true) :: StructField("hobby", StringType, true) :: Nil)

   spark.createDataFrame(DS_ROW,schema)
```

## Datasource 中的save保存持久表，如果删除了表，那么数据还存在么？

存在，删除表之后，文件路径还存在，表数据也都还存在。
官网的一句话：
For file-based data source, e.g. text, parquet, json, etc. you can specify a custom table path via the path option, e.g. df.write.option("path", "/some/path").saveAsTable("t"). When the table is dropped, the custom table path will not be removed and the table data is still there. If no custom table path is specified, Spark will write data to a default table path under the warehouse directory. When the table is dropped, the default table path will be removed too.
译文：

```
对于基于文件的数据源，例如 text，parquet，json等，您可以通过路径选项指定自定义表格路径，例如df.write.option（“path”，“/some/path").saveAsTable("t”）。当表被删除时，自定义表路径将不会被删除，表数据仍然存在。如果未指定自定义表格路径，则Spark会将数据写入仓库目录下的默认表格路径。当表被删除时，默认表路径也将被删除。

```
## 从Spark 2.1 开始，持久数据源表具有存储在Hive Metastore中的每分区元数据，有什么意义呢？
有两个好处：

  * Since the metastore can return only necessary partitions for a query, discovering all the partitions on the first query to the table is no longer needed.(元数据能返回所需要的分区数据，再也不需要查找所有分区)
  * Hive DDLs such as ALTER TABLE PARTITION ... SET LOCATION are now available for tables created with the Datasource API.（诸如ALTER TABLE分区之类的Hive DDLs…设置位置现在可以使用Datasource API创建的表。）


* 注意单：
请注意，在创建外部数据源表（具有路径选项的那些表）时，默认情况下不会收集分区信息。 要同步Metastore中的分区信息，您可以调用MSCK REPAIR TABLE。

## spark sql 中 的分区

```
注意，分区列的数据类型是自动推断的。目前，支持数字数据类型和字符串类型。有时用户可能不想自动推断分区列的数据类型。对于这些用例，自动类型推断可以由sparksql . sources.partitioncolumntype推断来配置。启用，默认为true。当类型推断被禁用时，字符串类型将被用于分区列。

从Spark 1.6.0开始，分区发现只能在缺省情况下找到给定路径下的分区。在上面的例子中，如果用户将path/to/table/gender=male改为SparkSession.read.parquet或SparkSession.read。load, gender将不会被认为是一个分区列。如果用户需要指定分区发现应该开始的基本路径，他们可以在数据源选项中设置basePath。例如，当path/to/table/gender=male 是数据的路径，而用户设置basePath到path/to/table/时，gender 将是一个分区列
```

## hive 与parquet的两大区别，从表结构来看

```

There are two key differences between Hive and Parquet from the perspective of table schema processing.（从表模式处理的角度来看，Hive和Parquet有两个关键的区别。）

    * Hive is case insensitive, while Parquet is not // hive区分大小写，parquet 不区分
    * Hive considers all columns nullable, while nullability in Parquet is significant // Hive认为所有列都可以为空，而Parquet的可空性很重要
```


## DataFrame 操作：

```Scala
获取输入文件：

返回构成此Dataset的文件的尽力而为快照。 这个方法简单
要求每个组织的BaseRelation各自的文件，并采取所有结果的联合。
根据源关系，这可能无法找到所有输入文件。 重复被删除。
/**
  * Returns a best-effort snapshot of the files that compose this Dataset. This method simply
  * asks each constituent BaseRelation for its respective files and takes the union of all results.
  * Depending on the source relations, this may not find all input files. Duplicates are removed.
  *
  * @group basic
  * @since 2.0.0
  */
 def inputFiles: Array[String] = {
   val files: Seq[String] = queryExecution.optimizedPlan.collect {
     case LogicalRelation(fsBasedRelation: FileRelation, _, _) =>
       fsBasedRelation.inputFiles
     case fr: FileRelation =>
       fr.inputFiles
     case r: CatalogRelation if DDLUtils.isHiveTable(r.tableMeta) =>
       r.tableMeta.storage.locationUri.map(_.toString).toArray
   }.flatten
   files.toSet.toArray
 }


```


## 从spark 2.0 以来 spark 在hive操作中 做了哪些改变

```
使用Hive时，必须使用Hive支持实例化SparkSession，包括连接到持久Hive Metastore，支持Hive serdes和Hive用户定义的函数。没有现有Hive部署的用户仍然可以启用Hive支持。当未由hive-site.xml配置时，上下文会自动在当前目录中创建metastore_db，并创建一个由spark.sql.warehouse.dir配置的目录，该目录默认为Spark应用程序当前目录中的spark-warehouse目录开始。请注意，自从Spark 2.0.0以来，hive-site.xml中的hive.metastore.warehouse.dir属性已被弃用。相反，使用spark.sql.warehouse.dir指定仓库中数据库的默认位置。您可能需要向启动Spark应用程序的用户授予写权限。

```


## 需要引入隐式转化的


* 构造DataSet[String] 的时候
```Scala
import spark.implicits._
val otherPeopleDataset = spark.createDataset(
  """{"name":"Yin","address":{"city":"Columbus","state":"Ohio"}}""" :: Nil)
val otherPeople = spark.read.json(otherPeopleDataset)
otherPeople.show()

```

* rdd 与dataframe 转化的时候

```Scala

import spark.implicits._

/*    val squaresDF: DataFrame = spark.sparkContext.makeRDD(1 to 5).map(i => {
     (i, i * i)
   }).toDF("value", "square")
```

* 利用case 创建df

```Scala

import spark.implicits._

//val recordsDF = spark.createDataFrame((1 to 100).map(i => Record(i, s"val_$i")))  //import spark.implicits._ 使用
    spark.createDataFrame((1 to 100 ).map(i => Record(i,s"val_$i") ))

```

## spark sql 中对hive 支持最重要的一部分是什么，与hive 元数据的交互

```
Spark SQL的Hive支持中最重要的部分之一是与Hive Metastore进行交互，这使Spark SQL可以访问Hive表的元数据。 从Spark 1.4.0开始，使用下面描述的配置，可以使用Spark SQL的单个二进制版本查询不同版本的Hive metastore。 请注意，独立于用于与Metastore交谈的Hive版本，内部Spark SQL将针对Hive 1.2.1进行编译，并将这些类用于内部执行（serdes，UDF，UDAF等）。
```


## spark的优化涉及

spark 优化两方面，一个是数据缓存，另一个是通过配置选项

### 官网原话
```
For some workloads it is possible to improve performance by either caching data in memory, or by turning on some experimental options.

    （对于某些工作负载，可以通过缓存内存中的数据或打开一些实验选项来提高性能。）
```


#### 内存数据缓存

```

```

#### 配置选项

```

```


## spark SQL 中的schema 中的数据类型-Datatime，包括哪些

```
Datetime type

    TimestampType: Represents values comprising values of fields year, month, day, hour, minute, and second.
    DateType: Represents values comprising values of fields year, month, day.

```

## spark读写各种文件博客

* 博客总结

[spark读取各种文件](https://www.cnblogs.com/caiyisen/p/7527459.html)



## spark 1.5 转2.1 版本 需要注意

```
返回1.5 的版本中返回Iterable 类型 的话，返回可以直接 new Arrays.asList()
但是2.1 之后会报错，Iterator 是2.1 创建的指定的类型，怎么办呢，
需要
 new Arrays.asList().Iterator
  或者  
如果遇到tuple 的话需要：
return Arrays.asList(new Tuple2<Integer, Integer>(1, new Integer(s.split(SpliterFlag.VERTICAL_BAR_SPLIT)[1]))).listIterator()

然而groupbykey() 返回的是：JavaPairRDD<String, Iterable<String>>

```
