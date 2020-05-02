
# spark读取数据的扩展

## spark 读取json

```Scala
val peopleDF = spark.read.format("json").load("examples/src/main/resources/people.json")
```

* 除了读取路径中的json，也能够通过读取Dataset[String]来加载json

```Scala
val otherPeopleDataset: Dataset[String]= spark.createDataset(
   """{"name":"Yin","address":{"city":"Columbus","state":"Ohio"}}""" :: Nil)

 val otherPeople = spark.read.json(otherPeopleDataset)
 otherPeople.show()
```

## spark 读取csv文件

1- 添加依赖，使用ssqlContext
```xml
<dependency>
       <groupId>com.databricks</groupId>
       <artifactId>spark-csv_2.10</artifactId>
       <version>1.4.0</version>
</dependency>

```

2- 编写代码

```Scala
package lzkj.Spark_Study.Review

/**
  * 本类中记录公用的加载数据代码
  */

import java.io.{File, PrintWriter}

import lzkj.Spark_Study.Common_Remember.Use_Tools
import org.apache.spark.rdd.RDD
import org.apache.spark.sql._
import org.apache.spark.sql.types.{IntegerType, StringType, StructField, StructType}
import org.apache.spark.{SparkConf, SparkContext}

object Load_Review {
  var spark: SparkSession = null

  def init(): Unit = {
    spark = SparkSession.builder().master("local").appName("Data_Source_Demo").getOrCreate()


  }

  def main(args: Array[String]): Unit = {
    init()

    // 加载其他文件
    Load_Other_File(spark)

  }

  def save_Load_General(spark: SparkSession): Unit = {
    val userDF: DataFrame = spark.read.load(s"${Use_Tools.Spark_resource}/users.parquet")
    userDF.printSchema()
    //    root
    //    |-- name: string (nullable = true)
    //    |-- favorite_color: string (nullable = true)
    //    |-- favorite_numbers: array (nullable = true)
    //    |    |-- element: integer (containsNull = true)
    userDF.show(false)

    var selectExprDF: DataFrame = userDF.selectExpr("name as Name", "favorite_color as Color")

    selectExprDF.printSchema()

    var count = 0
    val Pro_RDD: RDD[Row] = selectExprDF.rdd.map(x => {
      val count_curr = count + 1
      Row("Name:" + x.getAs[String](0), "Color:" + x.getAs("Color"), count_curr)
    })

    //val schema=StructType((StructField("Name",StringType,true)::StructField("Color",StringType,true)::StructField("Count_Index",IntegerType,true)::Nil))
    val schema = StructType(Array(
      StructField("Name", StringType, true),
      StructField("Color", StringType, true),
      StructField("Count_Index", IntegerType, true)
    ))
    val Pro_DF = spark.createDataFrame(Pro_RDD, schema)
    println(s" Pro_DF.printSchema()")
    // // Pro_DF.printSchema()

    //    root
    //    |-- Name: string (nullable = true)
    //    |-- Color: string (nullable = true)
    //    |-- Count_Index: integer (nullable = true)
    // // Pro_DF.show(false)
    //    +-----------+----------+-----------+
    //    |Name       |Color     |Count_Index|
    //    +-----------+----------+-----------+
    //    |Name:Alyssa|Color:null|0          |
    //    |Name:Ben   |Color:red |1          |
    //    +-----------+----------+-----------+

    // // Pro_DF.write.save(s"${Use_Tools.Spark_resource}/output/spark_parquent")

    // ---------------------------------------------------

    // 下面是隐士转化进行统一一列的
    var Color_index = 1

    import spark.implicits._ // 这里如果不引入隐士转化的话，那么需要进行.rdd.map()进行操作
    val Text_DF = selectExprDF.map(x => {
      val cur_Color_index = Color_index + 1
      s"${x.getAs[String]("Name")},${x.getAs[String]("Color")},${cur_Color_index}"
    }).cache()


    println("Text_DF.show() ↓")
    Text_DF.printSchema()
    Text_DF.unpersist()
    //    root
    //    |-- value: string (nullable = true)

    Text_DF.show(false)
    //    +-------------+
    //    |value        |
    //    +-------------+
    //    |Alyssa,null,2|
    //    |Ben,red,2    |
    //    +-------------+


    // // Text_DF.write.save(s"${Use_Tools.Spark_resource}/output/spark_parquent_text")

    // ------------------ 创建Row 类型数据 这种操作如果DataFrame .rdd 才能重新构建，这里的.rdd 不能省略！-------------------


    val Text_DF_2 = selectExprDF.rdd.map(x => {
      val cur_Color_index = Color_index + 1
      Row(x.getAs[String]("Name"), x.getAs[String]("Color"), cur_Color_index)
    }).cache()

    // 一下操作与第一步基本相同
    //val schema=StructType((StructField("Name",StringType,true)::StructField("Color",StringType,true)::StructField("Count_Index",IntegerType,true)::Nil))
    val schema_2 = StructType(Array(
      StructField("Name", StringType, true),
      StructField("Color", StringType, true),
      StructField("Count_Index", IntegerType, true)
    ))
    val Pro_DF_2 = spark.createDataFrame(Pro_RDD, schema_2)
    println(s" Pro_DF.printSchema()")
    Pro_DF_2.printSchema()

    //    root
    //    |-- Name: string (nullable = true)
    //    |-- Color: string (nullable = true)
    //    |-- Count_Index: integer (nullable = true)


  }

  /**
    * spark 加载其他文件
    */
  def Load_Other_File(spark: SparkSession): Unit = {

    /*    val person_DF: DataFrame = spark.read.format("com.databricks.spark.csv")
          .option("header", "false") // 文件的第一行是否有标题，没有就是false
          .option("inferSchema", true.toString) // 是否自动推断属性列表的数据类型
          .load(s"${Use_Tools.Spark_resource}/MyTest/person.csv")*/

    // 普通加载成DF的形式
    val optionMap: Map[String, String] = Map("header" -> "false", "inferSchema" -> "true")
    val person_DF: DataFrame = spark.read.format("com.databricks.spark.csv")
      .options(optionMap)
      .load(s"${Use_Tools.Spark_resource}/MyTest/person.csv")
    person_DF.printSchema()
    //person_DF.show(false)

    var index=0
    val RDD_ROW: RDD[Row] = person_DF.rdd.map(x => {
      index+=1
      Row(index,x(0), x.getAs[Int](1), x.getAs[String](2))
    })

    val schema = StructType(StructField("index", IntegerType, false) ::StructField("name", StringType, true) :: StructField("age", IntegerType, true) :: StructField("hobby", StringType, true) :: Nil)

    val people_DF: DataFrame = spark.createDataFrame(RDD_ROW,schema).persist()

    people_DF.printSchema()
    people_DF.show(false)

    import spark.implicits._
    people_DF.filter($"index" > 10 && $"age" > 13 && $"name".contains("9")).show(false)


    /**
      * 以下是保存本地文件PW 方式写入文件
      */

    val FilePeople_2=new File(s"${Use_Tools.Spark_resource}/MyTest/person_2.csv")
    if(FilePeople_2.exists()&&FilePeople_2.isFile){
      FilePeople_2.delete()
      FilePeople_2.createNewFile()
    }

    /**
      * 吧df中的数据，使用pw写出来
      */
    //        val PwPeople =new PrintWriter(FilePeople_2,"utf-8")
    //        val peopleIterator: Iterator[String] = people_DF.rdd.map(line => {
    //          s"${line.getAs[String]("index")},${line.getString(3)}"
    //        }).toLocalIterator
    //        while(peopleIterator.hasNext){
    //          PwPeople.println(peopleIterator.next())
    //        }
    //        PwPeople.flush()
    //        PwPeople.close()

    /**
      * 吧df中的数据，使用pw写出来,并且添加标题,这里指定编码
      */
    val PwPeople =new PrintWriter(FilePeople_2,"GBK")
    var peopleList:List[String] = people_DF.rdd.map(line => {
      s"${line.getAs[String]("index")},${line.getString(3)}"
    }).toLocalIterator.toList

    PwPeople.println("索引,爱好")
    for(line <- peopleList){
      PwPeople.println(line)
    }
    PwPeople.flush()
    PwPeople.close()
  }
  /**
    * 读取csv文件旧版本代码，保存csv文件
    */
  def Old_LoadCsv(): Unit = {
    /**
      * 如果读取csv文件有问题可以考虑添加依赖包，方法sqlcontext在 spark2.2 中过时
      * <dependency>
      * <groupId>com.databricks</groupId>
      * <artifactId>spark-csv_2.10</artifactId>
      * <version>1.4.0</version>
      * </dependency>
      */
    val conf = new SparkConf()
    conf.setAppName("FilterAndWhere").setMaster("local")
    val sparkContext = new SparkContext(conf)
    val sqlContext = new SQLContext(sparkContext)
    val data = sqlContext.read.format("com.databricks.spark.csv")
      .option("header", "false") //这里如果在csv第一行有属性的话，没有就是"false"
      .option("inferSchema", true.toString) //这是自动推断属性列的数据类型。
      .load(s"${Use_Tools.Spark_resource}/MyTest/person.csv") //文件的路径
    data.show(false)



  }


}


```
## 读取jdbc数据库

```Scala
private def runJdbcDatasetExample(spark: SparkSession): Unit = {
    // $example on:jdbc_dataset$
    // Note: JDBC loading and saving can be achieved via either the load/save or jdbc methods
    // Loading data from a JDBC source
    val jdbcDF = spark.read
      .format("jdbc")
      .option("url", "jdbc:postgresql:dbserver")
      .option("dbtable", "schema.tablename")
      .option("user", "username")
      .option("password", "password")
      .load()

    val connectionProperties = new Properties()
    connectionProperties.put("user", "username")
    connectionProperties.put("password", "password")
    val jdbcDF2 = spark.read
      .jdbc("jdbc:postgresql:dbserver", "schema.tablename", connectionProperties)

    // Saving data to a JDBC source
    jdbcDF.write
      .format("jdbc")
      .option("url", "jdbc:postgresql:dbserver")
      .option("dbtable", "schema.tablename")
      .option("user", "username")
      .option("password", "password")
      .save()

    jdbcDF2.write
      .jdbc("jdbc:postgresql:dbserver", "schema.tablename", connectionProperties)

    // Specifying create table column data types on write
    jdbcDF.write
      .option("createTableColumnTypes", "name CHAR(64), comments VARCHAR(1024)")
      .jdbc("jdbc:postgresql:dbserver", "schema.tablename", connectionProperties)
    // $example off:jdbc_dataset$
  }
```
