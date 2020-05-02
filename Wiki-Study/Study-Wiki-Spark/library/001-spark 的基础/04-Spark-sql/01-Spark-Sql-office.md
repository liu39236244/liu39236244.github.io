# [Spark SQL, DataFrames and Datasets Guide](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html)

## 说明

spark-core 在 03-spark API 官网案例 中
## 官方案例

[example案例地址](https://github.com/apache/spark/blob/master/examples/src/main/scala/org/apache/spark/examples/sql/SparkSQLExample.scala)


## Overview

Spark SQL is a Spark module for structured data processing. Unlike the basic Spark RDD API, the interfaces provided by Spark SQL provide Spark with more information about the structure of both the data and the computation being performed. Internally, Spark SQL uses this extra information to perform extra optimizations. There are several ways to interact with Spark SQL including SQL and the Dataset API. When computing a result the same execution engine is used, independent of which API/language you are using to express the computation. This unification means that developers can easily switch back and forth between different APIs based on which provides the most natural way to express a given transformation.

```
Spark SQL是用于结构化数据处理的Spark模块。与基本的Spark RDD API不同，Spark SQL提供的接口为Spark提供了关于数据结构和正在执行的计算的更多信息。在内部，Spark SQL使用这些额外的信息来执行额外的优化。有几种与Spark SQL进行交互的方式，包括SQL和Dataset API。在计算结果时，使用相同的执行引擎，而不管使用哪种API /语言来表示计算。这种统一意味着开发人员可以轻松地在不同的API之间来回切换，基于这些API提供了表达给定转换的最自然的方式。
```
All of the examples on this page use sample data included in the Spark distribution and can be run in the spark-shell, pyspark shell, or sparkR shell.
```
本页面上的所有示例均使用Spark分发中包含的示例数据，并且可以在spark-shell，pyspark外壳或sparkR外壳中运行。

```

## Datasets and DataFrames

A Dataset is a distributed collection of data. Dataset is a new interface added in Spark 1.6 that provides the benefits of RDDs (strong typing, ability to use powerful lambda functions) with the benefits of Spark SQL’s optimized execution engine. A Dataset can be constructed from JVM objects and then manipulated(操作) using functional transformations (map, flatMap, filter, etc.). The Dataset API is available in Scala and Java. Python does not have the support for the Dataset API. But due to Python’s dynamic nature, many of the benefits of the Dataset API are already available (i.e. you can access the field of a row by name naturally row.columnName). The case for R is similar.

A DataFrame is a Dataset organized into named columns. It is conceptually equivalent to a table in a relational database or a data frame in R/Python, but with richer optimizations under the hood. DataFrames can be constructed from a wide（大的） array of sources such as: structured data files, tables in Hive, external databases, or existing RDDs. The DataFrame API is available in Scala, Java, Python, and R. In Scala and Java, a DataFrame is represented（表示） by a Dataset of Rows. In the Scala API, DataFrame is simply a type alias of Dataset[Row]. While, in Java API, users need to use Dataset<Row> to represent a DataFrame.

Throughout this document, we will often refer to Scala/Java Datasets of Rows as DataFrames.

```

数据集是分布式数据集合。DataSet是Spark 1.6中添加的新接口，它提供了RDD的优点（强打字，使用强大的lambda函数的能力）以及Spark SQL优化执行引擎的优势。数据集可以从JVM对象构建，然后使用功能转换（地图，flatMap，过滤器等）进行操作。数据集API可用于Scala和Java。 Python不支持数DataSet API。但由于Python的动态特性，数据集API的许多优点已经可用（即，您可以通过自然的row.columnName名称访问行的字段）。 R的情况类似。

DataFrame是一个数据集，组织到命名列中。它在概念上等同于关系数据库中的表或R / Python中的数据框，但在引擎盖下具有更丰富的优化。 DataFrame可以从各种来源构建而成，例如：结构化数据文件，Hive中的表格，外部数据库或现有的RDD。 DataFrame API可用于Scala，Java，Python和R.在Scala和Java中，DataFrame由行数据集表示。在Scala API中，DataFrame只是Dataset [Row]的类型别名。而在Java API中，用户需要使用数Dataset<Row>来表示DataFrame。

在整篇文档中，我们经常将Scala / Java数据集作为DataFrames。

```

## Starting Point: SparkSession


The entry point into all functionality in Spark is the  [SparkSession](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.SparkSession)class. To create a basic SparkSession, just use SparkSession.builder():

译文：
```
Spark中所有功能的入口点是SparkSession类。要创建一个基本的SparkSession，只需使用SparkSession.builder():
```

### 需要注意的是需要导入包spark sql
prom.xml 中添加

```xml
<properties>
       <apache.hadoop.version>2.7.5</apache.hadoop.version>
       <apache.spark.version>2.2.0</apache.spark.version>
   </properties>
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-sql_2.11</artifactId>
    <version>${apache.spark.version}</version>
</dependency>
```

```Scala
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

// For implicit conversions like converting RDDs to DataFrames,隐式转换RDDD to DataFrames
import spark.implicits._

```
更多代码案例 ：
Find full example code at "examples/src/main/scala/org/apache/spark/examples/sql/SparkSQLExample.scala" in the Spark repo.

SparkSession in Spark 2.0 provides builtin（内部的） support for Hive features including the ability to write queries using HiveQL, access to Hive UDFs, and the ability to read data from Hive tables. To use these features, you do not need to have an existing Hive setup.

译文：
```
Spark 2.0中的SparkSession为Hive特性提供内置（内部的）支持，包括使用HiveQL编写查询，访问Hive UDF以及从Hive表读取数据的能力。要使用这些功能，您不需要有现有的Hive安装程序。
```

### Creating DataFrames

With a SparkSession, applications can [create DataFrames from an existing RDD](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#interoperating-with-rdds), from a Hive table, or from Spark data sources.

As an example, the following creates a DataFrame based on the content of a JSON file:


### Untyped Dataset Operations (aka DataFrame Operations) 无类型的操作


```Scala
//    The entry point into all functionality in Spark is the SparkSession class. To create a basic SparkSession, just use SparkSession.builder():
    val spark = SparkSession
      .builder()
      .master("local[4]")
      .appName("Spark SQL basic example")
      .config("spark.some.config.option", "some-value")
      .getOrCreate()

    // For implicit conversions like converting RDDs to DataFrames
    import spark.implicits._

    // 2
    val df = spark.read.json(s"${Use_Tools.Spark_resource}/people.json")

    /**
      * {"name":"Michael"}
      * {"name":"Andy", "age":30}
      * {"name":"Justin", "age":19}
      */
    // Displays the content of the DataFrame to stdout

    /**
      * df.show()
      */

    // +----+-------+
    // | age|   name|
    // +----+-------+
    // |null|Michael|
    // |  30|   Andy|
    // |  19| Justin|
    // +----+-------+

    /**
      * df.printSchema()
      */
    //打印目录树结构
    //df.printSchema()
    // root
    // |-- age: long (nullable = true)
    // |-- name: string (nullable = true)

    //df.select("name").show()
    // +-------+
    // |   name|
    // +-------+
    // |Michael|
    // |   Andy|
    // | Justin|
    // +-------+


    // Select everybody, but increment the age by 1 年龄都 +1
    df.select($"name", $"age" + 1).show()
    // +-------+---------+
    // |   name|(age + 1)|
    // +-------+---------+
    // |Michael|     null|
    // |   Andy|       31|
    // | Justin|       20|
    // +-------+---------+


    //年龄超过21的

    //df.filter($"age" > 21 ).show()
    //    +---+----+
    //    |age|name|
    //    +---+----+
    //    | 30|Andy|
    //    +---+----+

    // Count people by age
    df.groupBy("age").count().show()
    // +----+-----+
    // | age|count|
    // +----+-----+
    // |  19|    1|
    // |null|    1|
    // |  30|    1|
    // +----+-----+

```

For a complete list of the types of operations that can be performed on a Dataset refer to the [API Documentation](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.Dataset).

In addition to simple column references and expressions, Datasets also have a rich library of functions including string manipulation, date arithmetic, common math operations and more. The complete list is available in the DataFrame Function Reference.
译文：
```
除了简单的列引用和表达式之外，数据集还拥有丰富的函数库，包括字符串操作、日期算术、常见的数学运算等等。完整的列表在DataFrame函数引用中可用。
```


## Running SQL Queries Programmatically sql编程方式
创建临时的表视图

```Scala

    df.createOrReplaceTempView("people")

    val sqlDF = spark.sql("SELECT * FROM people")
    sqlDF.show()

    // +----+-------+
    // | age|   name|
    // +----+-------+
    // |null|Michael|
    // |  30|   Andy|
    // |  19| Justin|
    // +----+-------+
```

## Global Temporary View   全局的临时视图

Temporary views in Spark SQL are session-scoped and will disappear if the session that creates it terminates. If you want to have a temporary view that is shared among all sessions and keep alive until the Spark application terminates, you can create a global temporary view. Global temporary view is tied to a system preserved database global_temp, and we must use the qualified name to refer it, e.g. SELECT * FROM global_temp.view1.
译文：

```
Spark SQL中的临时视图是会话范围的，如果创建会话的会话终止，将会消失。如果您希望在所有会话之间共享临时视图并保持活动状态，直到Spark应用程序终止，则可以创建全局临时视图。全局临时视图与系统保存的数据库global_temp绑定，我们必须使用限定名称来引用它，例如， SELECT * FROM global_temp.view1。
```


```Scala
/**
     *  Register the DataFrame as a global temporary view
     */
   df.createGlobalTempView("people")

   // Global temporary view is tied to a system preserved database `global_temp`
   spark.sql("SELECT * FROM global_temp.people").show()
   // +----+-------+
   // | age|   name|
   // +----+-------+
   // |null|Michael|
   // |  30|   Andy|
   // |  19| Justin|
   // +----+-------+

   // Global temporary view is cross-session
   spark.newSession().sql("SELECT * FROM global_temp.people").show()
   // +----+-------+
   // | age|   name|
   // +----+-------+
   // |null|Michael|
   // |  30|   Andy|
   // |  19| Justin|
   // +----+-------+

```


##  Create DataSets

Datasets are similar to RDDs, however, instead of using Java serialization or Kryo they use a specialized(专业的) Encoder to serialize the objects for processing or transmitting（传送） over the network. While both encoders（编码器） and standard serialization are responsible（负责的） for turning an object into bytes, encoders are code generated dynamically（动态的） and use a format that allows Spark to perform many operations like filtering, sorting and hashing without deserializing the bytes back into an object.

译文：

```

数据集类似于RDD，但是，它们不使用Java序列化或Kryo，而是使用专门的编码器来串行化对象以便通过网络进行处理或传输。虽然编码器和标准序列化都负责将对象转换为字节，但编码器是动态生成的代码，并使用允许Spark执行许多操作（如过滤，排序和散列）的格式，而无需将字节反序列化回对象
```


代码如下：
注意：下面的caseclass 需要定义在引用caseclass 外面，所以把 caseclass 定义在外面，就行了！！

```Scala
// Note: Case classes in Scala 2.10 can support only up to 22 fields. To work around this limit,需要注意在scala2.10 仅支持到22个字段，
// you can use custom classes that implement the Product interface
case class Person(name: String, age: Long)  // 注意要拉到外面

// Encoders are created for case classes
val caseClassDS = Seq(Person("Andy", 32)).toDS()
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
val peopleDS = spark.read.json(path).as[Person]
peopleDS.show()
// +----+-------+
// | age|   name|
// +----+-------+
// |null|Michael|
// |  30|   Andy|
// |  19| Justin|
// +----+-------+
```


## Interoperating with RDDs

Spark SQL supports two different methods for converting existing RDDs into Datasets. The first method uses reflection to infer the schema of an RDD that contains specific types of objects. This reflection based approach leads to more concise code and works well when you already know the schema while writing your Spark application.
译文：
```

Spark SQL支持将现有RDD转换为Datasets的两种不同方法。第一种方法使用反射来推断包含特定类型对象的RDD的模式。这种基于反射的方法会导致更简洁的代码，并且在编写Spark应用程序时已经知道模式的情况下工作良好。
```


The second method for creating Datasets is through a programmatic interface that allows you to construct a schema and then apply it to an existing RDD. While this method is more verbose, it allows you to construct Datasets when the columns and their types are not known until runtime.

```

第二种创建数据集的方法是通过编程接口，允许您构建模式，然后将其应用于现有的RDD。虽然此方法更详细，但它允许您在直到运行时才知道列及其类型时才构建数据集。
```


## 第一种方式 Inferring the Schema Using Reflection 使用反射机制

The Scala interface for Spark SQL supports automatically converting an RDD containing case classes to a DataFrame. The case class defines the schema of the table. The names of the arguments to the case class are read using reflection and become the names of the columns. Case classes can also be nested or contain complex types such as Seqs or Arrays. This RDD can be implicitly converted to a DataFrame and then be registered as a table. Tables can be used in subsequent SQL statements.

译文：

```
Spark SQL的Scala接口可以自动将包含case类的RDD转换为DataFrame。case类定义了表的模式。用反射来读取case类的参数的名称，并成为列的名称。Case类也可以嵌套或包含复杂类型，如Seqs或数组。这个RDD可以隐式地转换为DataFrame，然后注册为一个表。表可以在后续的SQL语句中使用。
```

案例代码如下：

```Scala
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


## 第二种方式 Programmatically Specifying the Schema 以编程方式


When case classes cannot be defined ahead of time (for example, the structure of records is encoded in a string, or a text dataset will be parsed and fields will be projected differently for different users), a DataFrame can be created programmatically with three steps.
译文：
```
当无法提前定义case类时(例如，记录的结构被编码在一个字符串中，或者将对文本数据集进行解析，而对于不同的用户将对字段进行不同的预测)，可以通过三个步骤以编程方式创建DataFrame。

```
    1-Create an RDD of Rows from the original RDD; （创建Row(data);RDD (people) to Rows）
    2-Create the schema represented by a StructType matching the structure of Rows in the RDD created in Step 1.(创建与由步骤1中创建的RDD中的行结构匹配的StructType所表示的模式。)
    3-Apply the schema to the RDD of Rows via createDataFrame method provided by SparkSession.(通过SparkSession提供的createDataFrame方法将模式应用于行的RDD。)

代码案例如下：


```Scala
/**
    * 第二种，编程方式指定 schema 的数据结构
    */

  def RDD_Interoperation_Programmatically = {

    val spark = SparkSession.builder().master("local").appName("RDD_Interoperation_Programmatically").getOrCreate()
    val peopleRDD = spark.sparkContext.textFile(s"${Use_Tools.Spark_resource}/people.txt")
    import spark.implicits._

    /**
      * 注意这样指定的类型是String类型的
      * 构建StructField需要导入包
      * import org.apache.spark.sql.types.{StringType, StructField, StructType}
      */

    /**
      * 1. 构建StructType
      */
    val schemaString = "name age"
    var fields = schemaString.split(" ").map(x => {
      StructField(x, StringType, nullable = true)
    })
    /**
      * 此外 fields也可以是 不同类型的,如下。Array封装的不同的StructField 都可行
      */

    /*   fields=Array(
         StructField("name",StringType,true),
         StructField("age",IntegerType,true)
       )*/
    // or 写成以下形式

    /*   val fields = StructType(
         StructField("a", StringType) ::
           StructField("b", IntegerType) ::
           StructField("c", IntegerType) ::
           StructField("d", IntegerType) ::
           StructField("e", IntegerType) :: Nil)
           */

    val schema = StructType(fields)

    /**
      * 2.构建RDD（Row()） 对象.
      */
    val rowRdd = peopleRDD.map(_.split(","))
      .map(x => {
        Row(x(0), x(1).trim)
      })

    val peopleDF = spark.createDataFrame(rowRdd, schema)


    peopleDF.createOrReplaceTempView("people")

    val result = spark.sql("select name from people")

    // The results of SQL queries are DataFrames and support all the normal RDD operations（SQL查询的结果是DataFrames并支持所有正常的RDD操作。）
    // The columns of a row in the result can be accessed by field index or by field name（结果中的一行的列可以通过字段索引或字段名访问。）

    // 注意这里需要引入隐士转换 import spark.implicits._
    // //peopleDF.map(attributes => "Name:" + attributes(0)).show()


    /**
      * 展示结果
      */

    // 使用$"列明" 需要注意导入隐式转换  import spark.implicits._

    peopleDF.show(false)
    peopleDF.printSchema()
    result.select($"name").show()
    // 这里即使是string类型的 spark 也会转化成能够比较的对象
    result.filter($"age" > 18 ).show()


  }
}

```


## Aggregations 聚合

The built-in[ DataFrames functions](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.functions$)provide common aggregations such as count(), countDistinct(), avg(), max(), min(), etc. While those functions are designed for DataFrames, Spark SQL also has type-safe versions for some of them in Scala and Java to work with strongly typed Datasets. Moreover, users are not limited to the predefined aggregate functions and can create their own
译文：
```
内置的DataFrames函数提供了常见的聚合，如count()、countDistinct()、avg()、max()、min()等等。虽然这些函数是为DataFrames设计的，Spark SQL也为一些Scala和Java的类型安全版本提供了强类型数据集。此外，用户不限于预定义的聚合函数，可以创建自己的聚合函数。
```
### Untyped User-Defined Aggregate Functions 无类型的自定义聚合函数

Users have to extend the [UserDefinedAggregateFunction](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.sql.expressions.UserDefinedAggregateFunction) abstract class to implement a custom untyped aggregate function. For example, a user-defined average can look like:

用户必须扩展UserDefinedAggregateFunction抽象类来实现定制的无类型聚合函数。例如，用户定义的平均值:

* 先自定义球平均数的udaf

```Scala
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF

import org.apache.spark.sql.Row
import org.apache.spark.sql.expressions.{MutableAggregationBuffer, UserDefinedAggregateFunction}
import org.apache.spark.sql.types._

/**
  * 本包实现的是udaf 的官网案例,继承UDAF类
  */
object MyAverage extends  UserDefinedAggregateFunction{
  // Data types of input arguments of this aggregate function （聚合缓冲区中的输入数据类型）
  override def inputSchema: StructType = StructType(StructField("inputColum",LongType,true)::Nil)
  // Data types of values in the aggregation buffer（聚合缓冲区中的数据类型）
  override def bufferSchema: StructType = {
    StructType(StructField("count",LongType,true)::StructField("sum",LongType,true)::Nil)
  }
  // // The data type of the returned value（返回的数据类型）
  override def dataType: DataType = DoubleType

  //Whether this function always returns the same output on the identical input(这个函数是否总是在相同的输入上返回相同的输出。)
  override def deterministic: Boolean = true

  // Initializes the given aggregation buffer. The buffer itself is a `Row` that in addition to
  // standard methods like retrieving a value at an index (e.g., get(), getBoolean()), provides
  // the opportunity to update its values. Note that arrays and maps inside the buffer are still
  // immutable.
 /* (初始化给定的聚合缓冲区。缓冲区本身就是一个“行”，除了
  标准方法，比如在索引中检索值(例如，get()， getBoolean())，提供
  更新其值的机会。注意，缓冲区中的Arrays和inside仍然是
  不可变的。)*/
  override def initialize(buffer: MutableAggregationBuffer): Unit = {
    buffer(0)=0L
    buffer(1)=0L
  }

  // Updates the given aggregation buffer `buffer` with new input data from `input`(使用来自“buffer”的新输入数据更新给定的聚合缓冲区“缓冲区”)
  override def update(buffer: MutableAggregationBuffer, input: Row): Unit = {
    if(!input.isNullAt(0)){
      buffer(0)=buffer.getLong(0)+input.getLong(0)
      buffer(1)=buffer.getLong(1)+1
    }
  }

  // Merges two aggregation buffers and stores the updated buffer values back to `buffer1`（合并两个聚合缓冲区并将更新后的缓冲区值存储回“buffer1”）
  override def merge(buffer1: MutableAggregationBuffer, buffer2: Row): Unit = {
    buffer1(0)=buffer1.getLong(0)+buffer2.getLong(0)
    buffer1(1)=buffer1.getLong(1)+buffer2.getLong(1)

  }

  // Calculates the final result (计算最终结果)
  override def evaluate(buffer: Row): Any = {
    buffer.getLong(0).toDouble / buffer.getLong(1)
  }

}


```

* 然后创建测试类进行测试

```Scala
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF

import lzkj.Spark_Study.Common_Remember.Use_Tools
import org.apache.spark.sql.SparkSession

object MyAverage_Demo {
  def main(args: Array[String]): Unit = {
    val spark= SparkSession.builder().master("local[4]").appName("MyAverage_Demo").getOrCreate()
    //spark.udf.register("Average",MyAverage)
    spark.udf.register("MyAverage_Function",MyAverage)

    val employeeDF=spark.read.json(s"${Use_Tools.Spark_resource}/employees.json")

    employeeDF.createOrReplaceTempView("employees")
    employeeDF.show(false)

//      +-------+------+
//      |name   |salary|
//      +-------+------+
//      |Michael|3000  |
//      |Andy   |4500  |
//      |Justin |3500  |
//      |Berta  |4000  |
//      +-------+------+


    // 求出来平均成绩
    val averageDF=spark.sql("select MyAverage_Function(salary) as Average_Salary from employees ")
    averageDF.show(false)
//    +--------------+
//    |Average_Salary|
//    +--------------+
//    |3750.0        |
//    +--------------+
  }
}


```

### Type-Safe User-Defined Aggregate Functions (类型安全的用户定义的聚合函数)

User-defined aggregations for strongly typed Datasets revolve around the Aggregator abstract class. For example, a type-safe user-defined average can look like:
译文：

```
强类型数据集的用户定义聚合围绕着聚合器抽象类。例如，一个类型安全的用户定义的平均值可以是:

```

代码如下：
* 1- 先进行case class 的创建，这里与测试类进行分开

```Scala
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF.Common

case class Employee( name:String, salary:Long)
case class Average(var sum:Long,var count:Long)

```

* 2- 创建自定义 udaf

```Scala
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF
import lzkj.Spark_Study.Spark_Sql.UDF.UDAF.Common.{Average, Employee}
import org.apache.spark.sql._
import org.apache.spark.sql.expressions.Aggregator
//import org.apache.spark.Aggregator  // 这个是错误的包，导上面的包，别导错了

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
  //import org.apache.spark.sql.{Encoder, Encoders} ，这是下面代码需要导入的两个包
  override def bufferEncoder:Encoder[Average] = Encoders.product
  // Specifies the Encoder for the final output value type （指定最终输出值类型的编码器。）
  override def outputEncoder :Encoder[Double]= Encoders.scalaDouble
}

```

* 3- 测试类

```Scala
package lzkj.Spark_Study.Spark_Sql.UDF.UDAF

import lzkj.Spark_Study.Common_Remember.Use_Tools
import lzkj.Spark_Study.Spark_Sql.UDF.UDAF.Common.Employee
import org.apache.spark.sql.{Dataset, SparkSession, TypedColumn}

object MyAverage_2_Demo {
  def main(args: Array[String]): Unit = {
    val spark=SparkSession.builder().master("local").appName("MyAverage_2_Demo").getOrCreate()
    var employee_DS= spark.read.json(s"${Use_Tools.Spark_resource}/employees.json")
    // 注意下面的这个as[Employee] 需要提前定义case class 、并且导入隐士转换
    import spark.implicits._
    var employee_DF= employee_DS.as[Employee]
    employee_DS.show()
    val averageSalary: TypedColumn[Employee, Double] = MyAverage_2.toColumn.name("average_salary")
    val result: Dataset[Double] = employee_DF.select(averageSalary)
    result.show(false)
  }
}

```

## DataSource

Spark SQL supports operating on a variety of data sources through the DataFrame interface. A DataFrame can be operated on using relational transformations and can also be used to create a temporary view. Registering a DataFrame as a temporary view allows you to run SQL queries over its data. This section describes the general methods for loading and saving data using the Spark Data Sources and then goes into specific options that are available for the built-in data sources.

译文：
```
Spark SQL支持通过DataFrame接口在各种数据源上运行。 DataFrame可以使用关系变换进行操作，也可以用来创建临时视图。将DataFrame注册为临时视图允许您对其数据运行SQL查询。本节介绍使用Spark Data Sources加载和保存数据的一般方法，然后介绍可用于内置数据源的特定选项。

```

##　Generic Load/Save Functions

### 简单方式
In the simplest form, the default data source (parquet unless otherwise configured by spark.sql.sources.default) will be used for all operations.
译文：

```
以一种较简单的方式，磨人的 DataSource（parquet，除非另外的配置为spark.sql.sources.default)） 能被用作所有的操作
```
* 代码：

```Scala
val usersDF = spark.read.load("examples/src/main/resources/users.parquet")
usersDF.select("name", "favorite_color").write.save("namesAndFavColors.parquet")
```
完整代码目录：

Find full example code at "examples/src/main/scala/org/apache/spark/examples/sql/SQLDataSourceExample.scala" in the Spark repo.


### Manually Specifying Options

You can also manually specify the data source that will be used along with any extra options that you would like to pass to the data source. Data sources are specified by their fully qualified name (i.e., org.apache.spark.sql.parquet), but for built-in sources you can also use their short names (json, parquet, jdbc, orc, libsvm, csv, text). DataFrames loaded from any data source type can be converted into other types using this syntax.

译文：

```
您还可以手动指定将要使用的数据源以及您想要传递给数据源的其他选项。数据源由其完全限定名称（即org.apache.spark.sql.parquet）指定，但对于内置源，您还可以使用其短名称（json，parquet，jdbc，orc，libsvm，csv，text ）。使用此语法可以将从任何数据源类型加载的DataFrame转换为其他类型。
```

代码：

```Scala
val peopleDF = spark.read.format("json").load("examples/src/main/resources/people.json")
peopleDF.select("name", "age").write.format("parquet").save("namesAndAges.parquet")
```

###　Run SQL on files directly

Instead of using read API to load a file into DataFrame and query it, you can also query that file directly with SQL.（除了使用读取API将文件加载到DataFrame中并对其进行查询外，还可以使用SQL直接查询该文件。）


## Save Modes

Save operations can optionally take a SaveMode, that specifies how to handle existing data if present. It is important to realize that these save modes do not utilize any locking and are not atomic. Additionally, when performing an Overwrite, the data will be deleted before writing out the new data.
译文：

```

保存操作可以选择使用SaveMode，指定如何处理现有数据（如果存在）。认识到这些保存模式不使用任何锁定并且不是原子是很重要的。此外，执行覆盖时，数据将在写入新数据之前被删除
```

下面是spark中save mode 的几种格式

| Scala/Java   | Any Language     |Meaning|
| :------------- | :------------- |:----:|
|SaveMode.ErrorIfExists (default)   | "error" (default) |When saving a DataFrame to a data source, if data already exists, an exception is expected to be thrown. 如果要保存文件已经存在，则会报错|
|SaveMode.Append|	"append" 	|When saving a DataFrame to a data source, if data/table already exists, contents of the DataFrame are expected to be appended to existing data.如果文件存在则进行追加
|SaveMode.Overwrite |	"overwrite" |	Overwrite mode means that when saving a DataFrame to a data source, if data/table already exists, existing data is expected to be overwritten by the contents of the DataFrame. 文件如果存在则会被重新覆盖
|SaveMode.Ignore |	"ignore" |	Ignore mode means that when saving a DataFrame to a data source, if data already exists, the save operation is expected to not save the contents of the DataFrame and to not change the existing data. This is similar to a CREATE TABLE IF NOT EXISTS in SQL. 存在则忽略！类似于失去了中的 ：CREATE TABLE IF NOT EXISTS|


## Saving to Persistent（持久的） Tables [官网地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#saving-to-persistent-tables)

DataFrames can also be saved as persistent tables into Hive metastore using the saveAsTable command. Notice that an existing Hive deployment is not necessary to use this feature. Spark will create a default local Hive metastore (using Derby) for you. Unlike the createOrReplaceTempView command, saveAsTable will materialize the contents of the DataFrame and create a pointer to the data in the Hive metastore. Persistent tables will still exist even after your Spark program has restarted, as long as you maintain your connection to the same metastore. A DataFrame for a persistent table can be created by calling the table method on a SparkSession with the name of the table.
译文：

```

也可以使用saveAsTable命令将DataFrames作为持久表保存到Hive Metastore中。请注意，现有的Hive部署对于使用此功能不是必需的。 Spark将为您创建一个默认的本地Hive Metastore（使用Derby）。与createOrReplaceTempView命令不同，saveAsTable将实现DataFrame的内容并创建指向Hive Metastore中的数据的指针。即使您的Spark程序重新启动后，持久性表仍然存在，只要您保持与同一个Metastore的连接即可。永久表的DataFrame可以通过使用表的名称调用SparkSession上的表方法来创建。
```


For file-based data source, e.g. text, parquet, json, etc. you can specify a custom table path via the path option, e.g. df.write.option("path", "/some/path").saveAsTable("t"). When the table is dropped, the custom table path will not be removed and the table data is still there. If no custom table path is specified, Spark will write data to a default table path under the warehouse directory. When the table is dropped, the default table path will be removed too.(对于基于文件的数据源，例如 text，parquet，json等，您可以通过路径选项指定自定义表格路径，例如df.write.option（“path”，“/some/path").saveAsTable("t”）。当表被删除时，自定义表路径将不会被删除，表数据仍然存在。如果未指定自定义表格路径，则Spark会将数据写入仓库目录下的默认表格路径。当表被删除时，默认表路径也将被删除。)


Starting from Spark 2.1, persistent datasource tables have per-partition metadata stored in the Hive metastore. This brings several benefits:(
从Spark 2.1开始，持久数据源表具有存储在Hive Metastore中的每分区元数据。这带来了几个好处：)
    * Since the metastore can return only necessary partitions for a query, discovering all the partitions on the first query to the table is no longer needed.(元数据能返回所需要的分区数据，再也不需要查找所有分区)
    * Hive DDLs such as ALTER TABLE PARTITION ... SET LOCATION are now available for tables created with the Datasource API.（诸如ALTER TABLE分区之类的Hive DDLs…设置位置现在可以使用Datasource API创建的表。）

Note that partition information is not gathered by default when creating external datasource tables (those with a path option). To sync the partition information in the metastore, you can invoke MSCK REPAIR TABLE.
译文：

```
请注意，在创建外部数据源表（具有路径选项的那些表）时，默认情况下不会收集分区信息。 要同步Metastore中的分区信息，您可以调用MSCK REPAIR TABLE。
```


## Bucketing, Sorting and Partitioning[地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#bucketing-sorting-and-partitioning)

For file-based data source, it is also possible to bucket and sort or partition the output. Bucketing and sorting are applicable only to persistent tables:(对于基于文件的数据源，也可以对输出进行分类和分类。 分段和排序仅适用于持久表格：)

while partitioning can be used with both save and saveAsTable when using the Dataset APIs.(而在使用数据集API时，分区可以与save和saveAsTable一起使用。)


partitionBy creates a directory structure as described in the [Partition Discovery](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#partition-discovery) section. Thus, it has limited applicability to columns with high cardinality. In contrast bucketBy distributes data across a fixed number of buckets and can be used when a number of unique values is unbounded.
译文：

```
分区创建一个目录结构，如在分区发现部分中描述的那样。因此，它对具有高基数的列的适用性很有限。相反，bucketBy在固定数量的桶中分布数据，当一些独特的值不受限制时，可以使用它。

```

##　Parquet Files

[Parquet](http://parquet.io/) is a columnar format that is supported by many other data processing systems. Spark SQL provides support for both reading and writing Parquet files that automatically preserves the schema of the original data. When writing Parquet files, all columns are automatically converted to be nullable for compatibility reasons.

译文：
```
Parquet是一种列式格式，受许多其他数据处理系统的支持。 Spark SQL为阅读和编写自动保留原始数据模式的Parquet文件提供支持。 在编写Parquet文件时，出于兼容性原因，所有列都会自动转换为空值。
```

## Loading Data Programmatically

官网案例：

```Scala


// Encoders for most common types are automatically provided by importing spark.implicits._
import spark.implicits._

val peopleDF = spark.read.json("examples/src/main/resources/people.json")

// DataFrames can be saved as Parquet files, maintaining the schema information
peopleDF.write.parquet("people.parquet")

// Read in the parquet file created above
// Parquet files are self-describing so the schema is preserved
// The result of loading a Parquet file is also a DataFrame
val parquetFileDF = spark.read.parquet("people.parquet")

// Parquet files can also be used to create a temporary view and then used in SQL statements
parquetFileDF.createOrReplaceTempView("parquetFile")
val namesDF = spark.sql("SELECT name FROM parquetFile WHERE age BETWEEN 13 AND 19")
namesDF.map(attributes => "Name: " + attributes(0)).show()
// +------------+
// |       value|
// +------------+
// |Name: Justin|
// +------------+


```

## Partition Discovery

Table partitioning is a common optimization approach used in systems like Hive. In a partitioned table, data are usually stored in different directories, with partitioning column values encoded in the path of each partition directory. The Parquet data source is now able to discover and infer partitioning information automatically. For example, we can store all our previously used population data into a partitioned table using the following directory structure, with two extra columns, gender and country as partitioning columns:
译文：

```
表分区是在象Hive这样的系统中使用的一种常用的优化方法。在分区表中，数据通常存储在不同的目录中，分区列值编码在每个分区目录的路径中。Parquet数据源现在能够自动发现和推断分区信息。例如，我们可以使用以下目录结构将以前使用的所有人口数据存储到一个分区表中，并将两个额外的列、性别和国家作为分区列:
```


```
path
└── to
    └── table
        ├── gender=male
        │   ├── ...
        │   │
        │   ├── country=US
        │   │   └── data.parquet
        │   ├── country=CN
        │   │   └── data.parquet
        │   └── ...
        └── gender=female
            ├── ...
            │
            ├── country=US
            │   └── data.parquet
            ├── country=CN
            │   └── data.parquet
            └── ...

```

By passing path/to/table to either SparkSession.read.parquet or SparkSession.read.load, Spark SQL will automatically extract the partitioning information from the paths. Now the schema of the returned DataFrame becomes:

```
root
|-- name: string (nullable = true)
|-- age: long (nullable = true)
|-- gender: string (nullable = true)
|-- country: string (nullable = true)
```

Notice that the data types of the partitioning columns are automatically inferred. Currently, numeric data types and string type are supported. Sometimes users may not want to automatically infer the data types of the partitioning columns. For these use cases, the automatic type inference can be configured by spark.sql.sources.partitionColumnTypeInference.enabled, which is default to true. When type inference is disabled, string type will be used for the partitioning columns.
译文：

```
注意，分区列的数据类型是自动推断的。目前，支持数字数据类型和字符串类型。有时用户可能不想自动推断分区列的数据类型。对于这些用例，自动类型推断可以由sparksql . sources.partitioncolumntype推断来配置。启用，默认为true。当类型推断被禁用时，字符串类型将被用于分区列。
```

Starting from Spark 1.6.0, partition discovery only finds partitions under the given paths by default. For the above example, if users pass path/to/table/gender=male to either SparkSession.read.parquet or SparkSession.read.load, gender will not be considered as a partitioning column. If users need to specify the base path that partition discovery should start with, they can set basePath in the data source options. For example, when path/to/table/gender=male is the path of the data and users set basePath to path/to/table/, gender will be a partitioning column.

译文：
```
从Spark 1.6.0开始，分区发现只能在缺省情况下找到给定路径下的分区。在上面的例子中，如果用户将path/to/table/gender=male改为SparkSession.read.parquet或SparkSession.read。load, gender将不会被认为是一个分区列。如果用户需要指定分区发现应该开始的基本路径，他们可以在数据源选项中设置basePath。例如，当path/to/table/gender=male 是数据的路径，而用户设置basePath到path/to/table/时，gender 将是一个分区列
```


## Schema Merging

Like ProtocolBuffer, Avro, and Thrift, Parquet also supports schema evolution. Users can start with a simple schema, and gradually add more columns to the schema as needed. In this way, users may end up with multiple Parquet files with different but mutually compatible schemas. The Parquet data source is now able to automatically detect this case and merge schemas of all these files.

```
像ProtocolBuffer，Avro和Thrift一样，Parquet也支持模式演变。 用户可以从简单的模式开始，并根据需要逐渐向模式添加更多列。 通过这种方式，用户可能会得到具有不同但是相互兼容的模式的多个Parquet文件。 Parquet数据源现在能够自动检测这种情况并合并所有这些文件的模式。
```

Since schema merging is a relatively expensive operation, and is not a necessity in most cases, we turned it off by default starting from 1.5.0. You may enable it by（由于模式合并是一种相对昂贵的操作，在大多数情况下都不是必需的，所以我们默认从1.5.0开始关闭它。你可以启用它。）

    * setting data source option ```mergeSchema``` to true when reading Parquet files (as shown in the examples below), or
    * setting the global SQL option ```spark.sql.parquet.mergeSchema``` to ```true```.


## Hive metastore Parquet table conversion

When reading from and writing to Hive metastore Parquet tables, Spark SQL will try to use its own Parquet support instead of Hive SerDe for better performance. This behavior is controlled by the spark.sql.hive.convertMetastoreParquet configuration, and is turned on by default.（在阅读并写入Hive metastore Parquet表时，Spark SQL将尝试使用自己的Parquet支持而不是Hive SerDe来获得更好的性能。 此行为由spark.sql.hive.convertMetastoreParquet配置控制，并且默认情况下处于打开状态。）

###  Hive/Parquet Schema Reconciliation

There are two key differences between Hive and Parquet from the perspective of table schema processing.（从表模式处理的角度来看，Hive和Parquet有两个关键的区别。）

    * Hive is case insensitive, while Parquet is not // hive区分大小写，parquet 不区分
    * Hive considers all columns nullable, while nullability in Parquet is significant // Hive认为所有列都可以为空，而Parquet的可空性很重要

Due to this reason, we must reconcile Hive metastore schema with Parquet schema when converting a Hive metastore Parquet table to a Spark SQL Parquet table. The reconciliation rules are:（由于这个原因，当将Hive metastore Parquet表转换为Spark SQL Parquet表时，我们必须将Hive Metastore模式与Parquet模式协调一致。 对帐规则是：）


    * Fields that have the same name in both schema must have the same data type regardless of nullability. The reconciled field should have the data type of the Parquet side, so that nullability is respected.（无论是否可为空，在两个模式中都具有相同名称的字段必须具有相同的数据类型。 协调字段（和解的字段）应具有Parquet侧的数据类型，以保证可空性。）

    * The reconciled schema contains exactly those fields defined in Hive metastore schema.(协调的Schema恰好包含在Hive Metastore模式中定义的那些字段。)
        Any fields that only appear in the Parquet schema are dropped in the reconciled schema.
        Any fields that only appear in the Hive metastore schema are added as nullable field in the reconciled schema.

### Metadata Refreshing

Spark SQL caches Parquet metadata for better performance. When Hive metastore Parquet table conversion is enabled, metadata of those converted tables are also cached. If these tables are updated by Hive or other external tools, you need to refresh them manually to ensure consistent metadata.
译文：

```
Spark SQL缓存Parquet元数据以获得更好的性能。 当启用Hive metastore Parquet表转换时，这些转换表的元数据也会被缓存。 如果这些表由Hive或其他外部工具更新，则需要手动刷新它们以确保一致的元数据。
```
分区案例

```Scala
/**
   * 分区的案例
   * @param spark
   */
 def schemaMerge(spark: SparkSession): Unit = {
   import spark.implicits._

/*    val squaresDF: DataFrame = spark.sparkContext.makeRDD(1 to 5).map(i => {
     (i, i * i)
   }).toDF("value", "square")
   squaresDF.write.save(s"${Use_Tools.Spark_resource}/mergerSchema/data/data-Test/key=1")

   val cubesDF: DataFrame = spark.sparkContext.makeRDD(6 to 10).map(i => {
     (i, i * i * i)
   }).toDF("value", "cube")
   cubesDF.write.save(s"${Use_Tools.Spark_resource}/mergerSchema/data/data-Test/key=2")*/

   val mergeDF: DataFrame = spark.read.option("mergeSchema","true").parquet(s"${Use_Tools.Spark_resource}/mergerSchema/data/data-Test")

   mergeDF.printSchema()

   //    root
   //    |-- value: integer (nullable = true)
   //    |-- square: integer (nullable = true)
   //    |-- cube: integer (nullable = true)
   //    |-- key: integer (nullable = true)

   mergeDF.show(false)
   //    +-----+------+----+---+
   //    |value|square|cube|key|
   //    +-----+------+----+---+
   //    |1    |1     |null|1  |
   //    |2    |4     |null|1  |
   //    |3    |9     |null|1  |
   //    |4    |16    |null|1  |
   //    |5    |25    |null|1  |
   //    |6    |null  |216 |2  |
   //    |7    |null  |343 |2  |
   //    |8    |null  |512 |2  |
   //    |9    |null  |729 |2  |
   //    |10   |null  |1000|2  |
   //    +-----+------+----+---+

   // 输出包含两个数据的文件路径
   println(mergeDF.inputFiles.mkString)

   //刷新表数据

   spark.catalog.refreshTable("my_table")

 }

```


## configuration

Configuration of Parquet can be done using the setConf method on SparkSession or by running SET key=value commands using SQL.(可以使用SparkSession上的setConf方法或使用SQL运行SET key = value命令来完成Parquet的配置。)

|Property |Name |	Default	Meaning | meaning comment|
| :------------- | :------------- |:---:|
| spark.sql.parquet.binaryAsString |	false |	Some other Parquet-producing systems, in particular Impala, Hive, and older versions of Spark SQL, do not differentiate between binary data and strings when writing out the Parquet schema. This flag tells Spark SQL to interpret binary data as a string to provide compatibility with these systems.|一些其他的Parquet生成系统，特别是Impala、Hive和老版本的Spark SQL，在编写Parquet模式时，不区分二进制数据和字符串。此标志告诉Spark SQL将二进制数据解释为字符串，以提供与这些系统的兼容性。|
|spark.sql.parquet.int96AsTimestamp |	true |	Some Parquet-producing systems, in particular Impala and Hive, store Timestamp into INT96. This flag tells Spark SQL to interpret INT96 data as a timestamp to provide compatibility with these systems.|一些Parquet-producing系统，特别是Impala和Hive，将Timestamp存储到INT96中。 该标志告诉Spark SQL将INT96数据解释为时间戳以提供与这些系统的兼容性。|
|spark.sql.parquet.cacheMetadata |	true |	Turns on caching of Parquet schema metadata. Can speed up querying of static data.|打开Parquet模式元数据的缓存。 可以加速查询静态数据 |
|spark.sql.parquet.compression.codec |	snappy |	Sets the compression codec use when writing Parquet files. Acceptable values include:uncompressed, snappy, gzip, lzo.|设置编写Parquet文件时使用的压缩编解码器。 可接受的值包括：uncompressed，snappy，gzip，lzo。|
|spark.sql.parquet.filterPushdown 	| true |	Enables Parquet filter push-down optimization when set to true.|设置为true时启用Parquet过滤器下推优化|
|spark.sql.hive.convertMetastoreParquet |	true |	When set to false, Spark SQL will use the Hive SerDe for parquet tables instead of the built in support.|当设置为false时，Spark SQL将使用Hive SerDe来实现地板表，而不是内置支持。|
|spark.sql.parquet.mergeSchema |	false 	|When true, the Parquet data source merges schemas collected from all data files, otherwise the schema is picked from the summary file or a random data file if no summary file is available.|如果为true，则Parquet数据源会合并从所有数据文件收集的模式，否则将从摘要文件或随机数据文件中摘取模式（如果没有摘要文件可用）。|
|spark.sql.optimizer.metadataOnly |	true 	|When true, enable the metadata-only query optimization that use the table's metadata to produce the partition columns instead of table scans. It applies when all the columns scanned are partition columns and the query has an aggregate operator that satisfies distinct semantics.|如果为true，则启用使用表元数据的元数据优化查询优化来生成分区列，而不是表扫描。 它适用于扫描的所有列都是分区列并且查询具有满足不同语义的聚合运算符的情况。|





## JSON Datasets

Spark SQL can automatically infer the schema of a JSON dataset and load it as a Dataset[Row]. This conversion can be done using SparkSession.read.json() on either a Dataset[String], or a JSON file.(Spark SQL可以自动推断JSON数据集的模式并将其作为数据集[Row]加载。 此转换可以使用SparkSession.read.json（）在数据集[String]或JSON文件上完成。)

Note that the file that is offered as a json file is not a typical JSON file. Each line must contain a separate, self-contained valid JSON object. For more information, please see JSON Lines text format, also called [newline-delimited JSON.]()

```
请注意，作为json文件提供的文件不是典型的JSON文件。 每行必须包含一个单独的，独立的有效JSON对象。 有关更多信息，请参阅JSON行文本格式，也称为换行符分隔的JSON。
```

For a regular multi-line JSON file, set the multiLine option to true.(对于常规的多行JSON文件，请将multiLine选项设置为true。)

案例如下：

```Scala
// Primitive types (Int, String, etc) and Product types (case classes) encoders are
// supported by importing this when creating a Dataset.
import spark.implicits._

// A JSON dataset is pointed to by path.
// The path can be either a single text file or a directory storing text files
val path = "examples/src/main/resources/people.json"
val peopleDF = spark.read.json(path)

// The inferred schema can be visualized using the printSchema() method
peopleDF.printSchema()
// root
//  |-- age: long (nullable = true)
//  |-- name: string (nullable = true)

// Creates a temporary view using the DataFrame
peopleDF.createOrReplaceTempView("people")

// SQL statements can be run by using the sql methods provided by spark
val teenagerNamesDF = spark.sql("SELECT name FROM people WHERE age BETWEEN 13 AND 19")
teenagerNamesDF.show()
// +------+
// |  name|
// +------+
// |Justin|
// +------+

// 这里需要引入隐式转化
// Alternatively, a DataFrame can be created for a JSON dataset represented by
// a Dataset[String] storing one JSON object per string
val otherPeopleDataset = spark.createDataset(
  """{"name":"Yin","address":{"city":"Columbus","state":"Ohio"}}""" :: Nil)
val otherPeople = spark.read.json(otherPeopleDataset)
otherPeople.show()
// +---------------+----+
// |        address|name|
// +---------------+----+
// |[Columbus,Ohio]| Yin|
// +---------------+----+

```


## Hive Tables

Spark SQL also supports reading and writing data stored in Apache Hive. However, since Hive has a large number of dependencies, these dependencies are not included in the default Spark distribution. If Hive dependencies can be found on the classpath, Spark will load them automatically. Note that these Hive dependencies must also be present on all of the worker nodes, as they will need access to the Hive serialization and deserialization libraries (SerDes) in order to access data stored in Hive.
译文：
```
Spark SQL还支持读取和写入存储在Apache Hive中的数据。 但是，由于Hive具有大量的依赖项，因此这些依赖项不包含在默认的Spark分配中。 如果可以在类路径上找到Hive依赖关系，则Spark将自动加载它们。 请注意，这些Hive依赖项也必须存在于所有工作节点上，因为它们需要访问Hive序列化和反序列化库（SerDes）才能访问存储在Hive中的数据。
```

Configuration of Hive is done by placing your hive-site.xml, core-site.xml (for security configuration), and hdfs-site.xml (for HDFS configuration) file in conf/.（通过在conf /中放置hive-site.xml，core-site.xml（用于安全配置）和hdfs-site.xml（用于HDFS配置）文件来完成Hive的配置。）


When working with Hive, one must instantiate SparkSession with Hive support, including connectivity to a persistent Hive metastore, support for Hive serdes, and Hive user-defined functions. Users who do not have an existing Hive deployment can still enable Hive support. When not configured by the hive-site.xml, the context automatically creates metastore_db in the current directory and creates a directory configured by spark.sql.warehouse.dir, which defaults to the directory spark-warehouse in the current directory that the Spark application is started. Note that the hive.metastore.warehouse.dir property in hive-site.xml is deprecated since Spark 2.0.0. Instead, use spark.sql.warehouse.dir to specify the default location of database in warehouse. You may need to grant write privilege to the user who starts the Spark application.

译文：

```
使用Hive时，必须使用Hive支持实例化SparkSession，包括连接到持久Hive Metastore，支持Hive serdes和Hive用户定义的函数。没有现有Hive部署的用户仍然可以启用Hive支持。当未由hive-site.xml配置时，上下文会自动在当前目录中创建metastore_db，并创建一个由spark.sql.warehouse.dir配置的目录，该目录默认为Spark应用程序当前目录中的spark-warehouse目录开始。请注意，自从Spark 2.0.0以来，hive-site.xml中的hive.metastore.warehouse.dir属性已被弃用。相反，使用spark.sql.warehouse.dir指定仓库中数据库的默认位置。您可能需要向启动Spark应用程序的用户授予写权限。

```


案例：

```Scala
import java.io.File

import org.apache.spark.sql.Row
import org.apache.spark.sql.SparkSession

case class Record(key: Int, value: String)

// warehouseLocation points to the default location for managed databases and tables
val warehouseLocation = new File("spark-warehouse").getAbsolutePath

val spark = SparkSession
  .builder()
  .appName("Spark Hive Example")
  .config("spark.sql.warehouse.dir", warehouseLocation)
  .enableHiveSupport()
  .getOrCreate()

import spark.implicits._
import spark.sql

sql("CREATE TABLE IF NOT EXISTS src (key INT, value STRING) USING hive")
sql("LOAD DATA LOCAL INPATH 'examples/src/main/resources/kv1.txt' INTO TABLE src")

// Queries are expressed in HiveQL
sql("SELECT * FROM src").show()
// +---+-------+
// |key|  value|
// +---+-------+
// |238|val_238|
// | 86| val_86|
// |311|val_311|
// ...

// Aggregation queries are also supported.
sql("SELECT COUNT(*) FROM src").show()
// +--------+
// |count(1)|
// +--------+
// |    500 |
// +--------+

// The results of SQL queries are themselves DataFrames and support all normal functions.
val sqlDF = sql("SELECT key, value FROM src WHERE key < 10 ORDER BY key")

// The items in DataFrames are of type Row, which allows you to access each column by ordinal.
val stringsDS = sqlDF.map {
  case Row(key: Int, value: String) => s"Key: $key, Value: $value"
}
stringsDS.show()
// +--------------------+
// |               value|
// +--------------------+
// |Key: 0, Value: val_0|
// |Key: 0, Value: val_0|
// |Key: 0, Value: val_0|
// ...

// You can also use DataFrames to create temporary views within a SparkSession. // 需要隐式转换

val recordsDF = spark.createDataFrame((1 to 100).map(i => Record(i, s"val_$i")))
recordsDF.createOrReplaceTempView("records")

// Queries can then join DataFrame data with data stored in Hive.
sql("SELECT * FROM records r JOIN src s ON r.key = s.key").show()
// +---+------+---+------+
// |key| value|key| value|
// +---+------+---+------+
// |  2| val_2|  2| val_2|
// |  4| val_4|  4| val_4|
// |  5| val_5|  5| val_5|
// ...

```

## Specifying storage format for Hive tables 指定存储hive表的 存储格式

When you create a Hive table, you need to define how this table should read/write data from/to file system, i.e. the “input format” and “output format”. You also need to define how this table should deserialize the data to rows, or serialize rows to data, i.e. the “serde”. The following options can be used to specify the storage format(“serde”, “input format”, “output format”), e.g. CREATE TABLE src(id int) USING hive OPTIONS(fileFormat 'parquet'). By default, we will read the table files as plain text. Note that, Hive storage handler is not supported yet when creating table, you can create a table using storage handler at Hive side, and use Spark SQL to read it.
译文：

```
在创建Hive表时，您需要定义该表应该如何从文件系统读取/写入数据，即“输入格式”和“输出格式”。 您还需要定义此表应该如何将数据反序列化为行，或者将行序列化为数据，即“serde”。 可以使用以下选项来指定存储格式（“serde”，“输入格式”，“输出格式”） CREATE TABLE src（id int）使用配置单元选项（fileFormat'parquet'）。 默认情况下，我们将以纯文本形式读取表格文件。 请注意，Hive存储处理程序在创建表时不受支持，您可以使用Hive端的存储处理程序创建表并使用Spark SQL进行读取。

```
| Property Name     | Meaning    |Comment|
| :------------- | :------------- |:----:|
|fileFormat 	|A fileFormat is kind of a package of storage format specifications, including "serde", "input format" and "output format".Currently we support 6 fileFormats: 'sequencefile', 'rcfile', 'orc', 'parquet', 'textfile' and 'avro'.|fileFormat是一种存储格式规范包，包括“serde”，“输入格式”和“输出格式”。 目前我们支持6个fileFormats：'sequencefile'，'rcfile'，'orc'，'parquet'，'textfile'和'avro'。|
|inputFormat, outputFormat |	These 2 options specify the name of a corresponding `InputFormat` and `OutputFormat` class as a stringliteral, e.g. `org.apache.hadoop.hive.ql.io.orc.OrcInputFormat`. These 2 options must be appeared in pair, and you can not specify   them if you already specified the `fileFormat` option.|这两个选项将相应的`InputFormat`和`OutputFormat`类的名称指定为字符串文字，例如`org.apache.hadoop.hive.ql.io.orc.OrcInputFormat`。 这两个选项必须成对出现，如果您已经指定`fileFormat`选项，则不能指定它们|
|serde 	|This option specifies the name of a serde class. When the `fileFormat` option is specified, do not specify this option if the given `fileFormat` already include the information of serde. Currently "sequencefile", "textfile" and "rcfile" don't include the serde information and you can use this option with these 3 fileFormats.|该选项指定serde类的名称。 当指定`fileFormat`选项时，如果给定的`fileFormat`已经包含了serde的信息，则不要指定这个选项。 目前“sequencefile”，“textfile”和“rcfile”不包含serde信息，您可以在这3个fileFormats中使用此选项。|
|fieldDelim, escapeDelim, collectionDelim, mapkeyDelim, lineDelim |	These options can only be used with "textfile" fileFormat. They define how to read delimited files into rows. |这些选项只能与“textfile”文件格式一起使用。它们定义如何将分隔的文件读入行。|


## Interacting with Different Versions of Hive Metastore

One of the most important pieces of Spark SQL’s Hive support is interaction with Hive metastore, which enables Spark SQL to access metadata of Hive tables. Starting from Spark 1.4.0, a single binary build of Spark SQL can be used to query different versions of Hive metastores, using the configuration described below. Note that independent of the version of Hive that is being used to talk to the metastore, internally Spark SQL will compile against Hive 1.2.1 and use those classes for internal execution (serdes, UDFs, UDAFs, etc).
译文：
```
Spark SQL的Hive支持中最重要的部分之一是与Hive Metastore进行交互，这使Spark SQL可以访问Hive表的元数据。 从Spark 1.4.0开始，使用下面描述的配置，可以使用Spark SQL的单个二进制版本查询不同版本的Hive metastore。 请注意，独立于用于与Metastore交谈的Hive版本，内部Spark SQL将针对Hive 1.2.1进行编译，并将这些类用于内部执行（serdes，UDF，UDAF等）。
```

The following options can be used to configure the version of Hive that is used to retrieve metadata:(以下选项可用于配置用于检索元数据的Hive版本：)

配置地址这里不再给出，只给出路径地址[配置说明地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#interacting-with-different-versions-of-hive-metastore)，以下是截图，原文请点击链接

![option上半部分](assets/001/20180508-4312017c.png)  
![option下半部分](assets/001/20180508-0bc4d1fd.png)  


## JDBC To Other Databases

Spark SQL also includes a data source that can read data from other databases using JDBC. This functionality should be preferred over using [JdbcRDD](http://spark.apache.org/docs/2.2.0/api/scala/index.html#org.apache.spark.rdd.JdbcRDD). This is because the results are returned as a DataFrame and they can easily be processed in Spark SQL or joined with other data sources. The JDBC data source is also easier to use from Java or Python as it does not require the user to provide a ClassTag. (Note that this is different than the Spark SQL JDBC server, which allows other applications to run queries using Spark SQL).
译文：

```
Spark SQL还包含一个可以使用JDBC从其他数据库读取数据的数据源。 这个功能应该比使用JdbcRDD更受欢迎。 这是因为结果作为DataFrame返回，并且可以轻松地在Spark SQL中处理它们或者与其他数据源结合使用。 JDBC数据源也更容易在Java或Python中使用，因为它不需要用户提供ClassTag。 （请注意，这与Spark SQL JDBC服务器不同，后者允许其他应用程序使用Spark SQL运行查询）。
```

To get started you will need to include the JDBC driver for you particular database on the spark classpath. For example, to connect to postgres from the Spark Shell you would run the following command:(为了开始工作，您需要在spark类路径上为您的特定数据库包含JDBC驱动程序。例如，要从Spark Shell连接到postgres，您将运行以下命令:)

```
bin/spark-shell --driver-class-path postgresql-9.4.1207.jar --jars postgresql-9.4.1207.jar

```

Tables from the remote database can be loaded as a DataFrame or Spark SQL temporary view using the Data Sources API. Users can specify the JDBC connection properties in the data source options. user and password are normally provided as connection properties for logging into the data sources. In addition to the connection properties, Spark also supports the following case-insensitive options:
译文：

```
来自远程数据库的表可以使用Data Sources API作为DataFrame或Spark SQL临时视图加载。 用户可以在数据源选项中指定JDBC连接属性。 用户和密码通常作为登录数据源的连接属性提供。 除连接属性外，Spark还支持以下不区分大小写的选项：
```

配置选项这里给出链接地址[option jdbc ](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#jdbc-to-other-databases)

![配置上半页](assets/001/20180508-c6040e75.png)  
![配置下半页](assets/001/20180508-1390fa39.png)  

| 配置     | 解释     |
| :------------- | :------------- |
|dtable|应该读取的JDBC表。请注意，在SQL查询的FROM子句中，任何有效的内容都可以使用。例如，您还可以在括号中使用子查询，而不是完整的表。|
|partitionColumn|如果指定了这些选项，则必须全部指定这些选项。 另外，必须指定numPartition。|
|lowerBound, upperBound|他们描述了如何在多名员工平行读取时对表格进行分区。 partitionColumn必须是相关表中的数字列。 请注意，lowerBound和upperBound仅用于决定分区跨度，而不用于过滤表中的行。 所以表中的所有行都将被分区并返回。 该选项仅适用于阅读。|
|numPartitions|表格读取和写入中可用于并行的分区的最大数量。 这也决定了并发JDBC连接的最大数量。 如果要写入的分区数量超过此限制，我们会在写入之前通过调用coalesce（numPartitions）将其降至此限制。|
|fetchsize|JDBC提取大小，它确定每次往返需要提取多少行。 这可以帮助默认为低获取大小的JDBC驱动程序（例如，具有10行的Oracle）的性能。 该选项仅适用于阅读。|
|batchsize|JDBC批量大小，用于确定每次往返要插入多少行。 这可以帮助JDBC驱动程序的性能。 该选项仅适用于书写。 它默认为1000。|
|isolationLevel|事务隔离级别，适用于当前连接。 它可以是NONE，READ_COMMITTED，READ_UNCOMMITTED，REPEATABLE_READ或SERIALIZABLE之一，对应于由JDBC的Connection对象定义的标准事务隔离级别，默认为READ_UNCOMMITTED。 该选项仅适用于书写。 请参阅java.sql.Connection中的文档。|
|truncate|这是一个JDBC编写器相关的选项。 启用SaveMode.Overwrite后，此选项将导致Spark截断现有表而不是删除并重新创建它。 这可以更高效，并且防止表元数据（例如，索引）被移除。 但是，在某些情况下它不起作用，例如新数据具有不同的schema时。 它默认为false。 该选项仅适用于书写。|
|createTableOptions|这是一个JDBC编写器相关的选项。 如果指定，则此选项允许在创建表时设置数据库特定的表和分区选项（例如，CREATE TABLE t（name string）ENGINE = InnoDB。）。 该选项仅适用于书写。|
|createTableColumnTypes|创建表时使用的数据库列数据类型，而不是默认值。 应该使用与CREATE TABLE列语法相同的格式（例如：“name CHAR（64），comments VARCHAR（1024）”）指定数据类型信息。 指定的类型应该是有效的spark sql数据类型。 该选项仅适用于书写。|


## Troubleshooting [地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#troubleshooting)

    1 The JDBC driver class must be visible to the primordial class loader on the client session and on all executors. This is because Java’s DriverManager class does a security check that results in it ignoring all drivers not visible to the primordial class loader when one goes to open a connection. One convenient way to do this is to modify compute_classpath.sh on all worker nodes to include your driver JARs.
    （JDBC驱动程序类必须对客户机会话和所有执行程序上的原始类加载器可见。 这是因为Java的DriverManager类会执行安全检查，导致它忽略所有在初始类加载器中不可见的驱动程序，以便打开连接。 一种方便的方法是修改所有工作节点上的compute_classpath.sh以包含驱动程序JAR。）
    2 Some databases, such as H2, convert all names to upper case. You’ll need to use upper case to refer to those names in Spark SQL.
    （一些数据库（如H2）将所有名称转换为大写。 您需要使用大写字母来引用Spark SQL中的这些名称。）


## Performance Tuning性能调优

For some workloads it is possible to improve performance by either caching data in memory, or by turning on some experimental options.

    （对于某些工作负载，可以通过缓存内存中的数据或打开一些实验选项来提高性能。）

### Caching Data In Memory

Spark SQL can cache tables using an in-memory columnar format by calling spark.catalog.cacheTable("tableName") or dataFrame.cache(). Then Spark SQL will scan only required columns and will automatically tune compression to minimize memory usage and GC pressure. You can call spark.catalog.uncacheTable("tableName") to remove the table from memory.
译文

```
Spark SQL可以通过调用spark.catalog.cacheTable（“tableName”）或dataFrame.cache（）来使用内存列式格式缓存表。 然后，Spark SQL将只扫描所需的列，并自动调整压缩以最大限度地减少内存使用和GC压力。 您可以调用spark.catalog.uncacheTable（“tableName”）从内存中删除表。
```

Configuration of in-memory caching can be done using the setConf method on SparkSession or by running SET key=value commands using SQL.

| Property Name	 | Default	| Meaning|
|:---:|:---:|:---:|
|spark.sql.inMemoryColumnarStorage.compressed |	true |	When set to true Spark SQL will automatically select a compression codec for each column based on statistics of the data.|当设置为真正的Spark SQL时，根据数据的统计数据，将自动为每个列选择一个压缩编解码器。|
| spark.sql.inMemoryColumnarStorage.batchSize |	10000 	|Controls the size of batches for columnar caching. Larger batch sizes can improve memory utilization and compression, but risk OOMs when caching data.|控制柱状缓存的批量大小。 更大的批量大小可以提高内存利用率和压缩率，但是在缓存数据时会面临OOM风险。|


### Other Configuration Options

The following options can also be used to tune(调整) the performance（性能） of query execution. It is possible that these options will be deprecated（v,不赞成） in future release as more optimizations are performed automatically.
（以下选项也可用于调整查询执行的性能。 这些选项可能会在将来的版本中被弃用，因为会自动执行更多优化。）

* 调优
|Property Name|	Default	Meaning|comment|
| :----: | :--: |:---:|:---:|
|spark.sql.files.maxPartitionBytes |	134217728 (128 MB) |	The maximum number of bytes to pack into a single partition when reading files.|读取文件时打包到单个分区的最大字节数。|
|spark.sql.files.openCostInBytes |	4194304 (4 MB) |	The estimated cost to open a file, measured by the number of bytes could be scanned in the same time. This is used when putting multiple files into a partition. It is better to over estimated, then the partitions with small files will be faster than partitions with bigger files (which is scheduled first).|通过字节数衡量的打开文件的估计成本可以在同一时间进行扫描。 将多个文件放入分区时使用此功能。 最好高估，那么具有小文件的分区将比具有更大文件的分区（其首先被调度）更快。|
|spark.sql.broadcastTimeout 	|300 	|Timeout in seconds for the broadcast wait time in broadcast joins|广播连接中的广播等待时间以秒为单位超时|
|spark.sql.autoBroadcastJoinThreshold |	10485760 (10 MB) |	Configures the maximum size in bytes for a table that will be broadcast to all worker nodes when performing a join. By setting this value to -1 broadcasting can be disabled. Note that currently statistics are only supported for Hive Metastore tables where the command ANALYZE TABLE <tableName> COMPUTE STATISTICS noscan has been run.|配置在执行连接时将广播给所有工作节点的表的最大大小（以字节为单位）。 通过将此值设置为-1，可以禁用广播。 请注意，当前统计信息仅支持运行命令ANALYZE TABLE <tableName> COMPUTE STATISTICS noscan 的Hive Metastore表。|
|spark.sql.shuffle.partitions 	|200 |	Configures the number of partitions to use when shuffling data for joins or aggregations.|配置用于混合连接或聚合的数据时要使用的分区数|


## Distributed SQL Engine

Spark SQL can also act as a distributed query engine using its JDBC/ODBC or command-line interface. In this mode, end-users or applications can interact with Spark SQL directly to run SQL queries, without the need to write any code.
```
Spark SQL也可以使用其JDBC / ODBC或命令行界面作为分布式查询引擎。 在这种模式下，最终用户或应用程序可以直接与Spark SQL交互以运行SQL查询，而无需编写任何代码。
```


### Running the Thrift JDBC/ODBC server

The Thrift JDBC/ODBC server implemented here corresponds to the HiveServer2 in Hive 1.2.1 You can test the JDBC server with the beeline script that comes with either Spark or Hive 1.2.1.

```
此处实现的Thrift JDBC / ODBC服务器对应于Hive 1.2.1中的HiveServer2。您可以使用Spark或Hive 1.2.1附带的beeline脚本测试JDBC服务器。
```

To start the JDBC/ODBC server, run the following in the Spark directory:

    ./sbin/start-thriftserver.sh

This script accepts all bin/spark-submit command line options, plus a --hiveconf option to specify Hive properties. You may run ./sbin/start-thriftserver.sh --help for a complete list of all available options. By default, the server listens on localhost:10000. You may override this behaviour via either environment variables, i.e.:

```
这个脚本接受所有的bin / spark-submit命令行选项，加上一个--hiveconf选项来指定Hive属性。 您可以运行./sbin/start-thriftserver.sh --help以获取所有可用选项的完整列表。 默认情况下，服务器在localhost：10000上侦听。 您可以通过任一环境变量覆盖此行为，即：
```

```Shell
export HIVE_SERVER2_THRIFT_PORT=<listening-port>
export HIVE_SERVER2_THRIFT_BIND_HOST=<listening-host>
./sbin/start-thriftserver.sh \
  --master <master-uri> \
  ...


```

or system properties:

```Shell

./sbin/start-thriftserver.sh \
  --hiveconf hive.server2.thrift.port=<listening-port> \
  --hiveconf hive.server2.thrift.bind.host=<listening-host> \
  --master <master-uri>
  ...

```

Now you can use beeline to test the Thrift JDBC/ODBC server:


```Shell
./bin/beeline

```

Connect to the JDBC/ODBC server in beeline with:

```Shell
beeline> !connect jdbc:hive2://localhost:10000

```


Beeline will ask you for a username and password. In non-secure mode, simply enter the username on your machine and a blank password. For secure mode, please follow the instructions given in the beeline documentation.

```
Beeline 会要求您输入用户名和密码。 在非安全模式下，只需在您的机器上输入用户名并输入一个空白密码即可。 对于安全模式，请按照直线文档中的说明进行操作。

```
Configuration of Hive is done by placing(移动) your hive-site.xml, core-site.xml and hdfs-site.xml files in conf/.

You may also use the beeline script that comes with Hive.（使用来自hive的脚本）

Thrift JDBC server also supports sending thrift RPC messages over HTTP transport（运输）. Use the following setting to enable HTTP mode as system property or in hive-site.xml file in conf/:

```
hive.server2.transport.mode - Set this to value: http
hive.server2.thrift.http.port - HTTP port number to listen on; default is 10001
hive.server2.http.endpoint - HTTP endpoint; default is cliservice
```

To test, use beeline to connect to the JDBC/ODBC server in http mode with:（To test, use beeline to connect to the JDBC/ODBC server in http mode with:）

```
beeline> !connect jdbc:hive2://<host>:<port>/<database>?hive.server2.transport.mode=http;hive.server2.thrift.http.path=<http_endpoint>
```

## Running the Spark SQL CLI

The Spark SQL CLI is a convenient（方便的） tool to run the Hive metastore service in local mode and execute queries input from the command line. Note that the Spark SQL CLI cannot talk to the Thrift JDBC server.

```
Spark SQL CLI是一种方便的工具，可以在本地模式下运行Hive Metastore服务，并执行来自命令行的查询输入。 请注意，Spark SQL CLI无法与Thrift JDBC服务器通信。
```

To start the Spark SQL CLI, run the following in the Spark directory:

```
./bin/spark-sql
```

Configuration of Hive is done by placing your hive-site.xml, core-site.xml and hdfs-site.xml files in conf/. You may run ./bin/spark-sql --help for a complete list of all available options.



# Migration Guide 迁徙向导 [迁徙地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#migration-guide)

* 这里不再给出，提供链接地址


下面是部分总结：
* sparksql 2.1 to 2.2 的改变
Spark 2.1.1引入了一个新的配置键：spark.sql.hive.caseSensitiveInferenceMode。它有一个默认设置NEVER_INFER，保持与2.1.0相同的行为。但是，Spark 2.2.0将此设置的默认值更改为INFER_AND_SAVE，以恢复与读取基础文件模式具有混合大小写列名称的Hive Metastore表的兼容性。通过INFER_AND_SAVE配置值，首次访问时，Spark将对任何尚未保存推断模式的Hive Metastore表执行模式推断。请注意，对于包含数千个分区的表，模式推断可能非常耗时。如果不兼容混合大小写的列名称，则可以安全地将spark.sql.hive.caseSensitiveInferenceMode设置为NEVER_INFER，以避免模式推断的初始开销。请注意，使用新的默认INFER_AND_SAVE设置，模式推断的结果将保存为Metastore密钥以供将来使用。因此，初始模式推断仅在表的第一次访问时发生。


*  。。。。。


# 参考[Reference]


## Data Types [原地址](http://spark.apache.org/docs/2.2.0/sql-programming-guide.html#data-types)

Spark SQL and DataFrames support the following data types:

    Numeric types
        ByteType: Represents 1-byte signed integer numbers. The range of numbers is from -128 to 127.
        ShortType: Represents 2-byte signed integer numbers. The range of numbers is from -32768 to 32767.
        IntegerType: Represents 4-byte signed integer numbers. The range of numbers is from -2147483648 to 2147483647.
        LongType: Represents 8-byte signed integer numbers. The range of numbers is from -9223372036854775808 to 9223372036854775807.
        FloatType: Represents 4-byte single-precision floating point numbers.
        DoubleType: Represents 8-byte double-precision floating point numbers.
        DecimalType: Represents arbitrary-precision signed decimal numbers. Backed internally by java.math.BigDecimal. A BigDecimal consists of an arbitrary precision integer unscaled value and a 32-bit integer scale.
    String type
        StringType: Represents character string values.
    Binary type
        BinaryType: Represents byte sequence values.
    Boolean type
        BooleanType: Represents boolean values.
    Datetime type
        TimestampType: Represents values comprising values of fields year, month, day, hour, minute, and second.
        DateType: Represents values comprising values of fields year, month, day.
    Complex types
        ArrayType(elementType, containsNull): Represents values comprising a sequence of elements with the type of elementType. containsNull is used to indicate if elements in a ArrayType value can have null values.
        MapType(keyType, valueType, valueContainsNull): Represents values comprising a set of key-value pairs. The data type of keys are described by keyType and the data type of values are described by valueType. For a MapType value, keys are not allowed to have null values. valueContainsNull is used to indicate if values of a MapType value can have null values.
        StructType(fields): Represents values with the structure described by a sequence of StructFields (fields).
            StructField(name, dataType, nullable): Represents a field in a StructType. The name of a field is indicated by name. The data type of a field is indicated by dataType. nullable is used to indicate if values of this fields can have null values.





* All data types of Spark SQL are located in the package org.apache.spark.sql.types. You can access them by doing

```
import org.apache.spark.sql.types._
```

数据类型截图如下：

![数据类型上半部分](assets/001/20180509-9ed4b164.png)  
![数据类型下半部分](assets/001/20180509-dfd3bb4b.png)  


## next


##
