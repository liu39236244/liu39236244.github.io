# spark-submit 的shell 脚本记录

## 提交spark
[原路径](http://spark.apache.org/docs/2.2.0/submitting-applications.html)
```sh
# Run application locally on 8 cores
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master local[8] \
  /path/to/examples.jar \
  100

# Run on a Spark standalone cluster in client deploy mode
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master spark://IP:7077 \
  --executor-memory 20G \
  --total-executor-cores 100 \
  /path/to/examples.jar \
  1000

# Run on a Spark standalone cluster in cluster deploy mode with supervise
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master spark://IP:7077 \
  --deploy-mode cluster \
  --supervise \
  --executor-memory 20G \
  --total-executor-cores 100 \
  /path/to/examples.jar \
  1000

# Run on a YARN cluster
export HADOOP_CONF_DIR=XXX
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master yarn \
  --deploy-mode cluster \  # can be client for client mode
  --executor-memory 20G \
  --num-executors 50 \
  /path/to/examples.jar \
  1000

# Run a Python application on a Spark standalone cluster
./bin/spark-submit \
  --master spark://IP:7077 \
  examples/src/main/python/pi.py \
  1000

# Run on a Mesos cluster in cluster deploy mode with supervise
./bin/spark-submit \
  --class org.apache.spark.examples.SparkPi \
  --master mesos://IP:7077 \
  --deploy-mode cluster \
  --supervise \
  --executor-memory 20G \
  --total-executor-cores 100 \
  http://path/to/examples.jar \
  1000
```

# 公司shell spark 脚本提交记录

## 1- lz

```shell
#!/bin/sh

jarf=/data/bigwork/wangya/simple-analysis/simple-analysis-1.0.jar

#zip -d ./$jarf 'META-INF/.SF' 'META-INF/.RSA' 'META-INF/*SF'

spark2-submit --master yarn \
--deploy-mode cluster \
--driver-memory 2G \
--executor-memory 4G \
--jars hdfs://lzkjnameservice/lzkj/lib/ojdbc14.jar \
--repositories http://maven.aliyun.com/nexus/content/groups/public,http://repository.cloudera.com/artifactory/cloudera-repos \
--verbose \
--packages com.databricks:spark-csv_2.11:1.5.0,com.databricks:spark-xml_2.11:0.4.1,com.databricks:spark-avro_2.11:4.0.0,org.scalaj:scalaj-http_2.11:2.3.0,com.fasterxml.jackson.core:jackson-databind:2.9.2,com.fasterxml.jackson.module:jackson-module-scala_2.11:2.9.2,org.apache.hbase:hbase-common:1.2.0-cdh5.12.2,org.apache.hbase:hbase-client:1.2.0-cdh5.12.2,org.apache.hbase:hbase-spark:1.2.0-cdh5.12.2,org.scalaj:scalaj-http_2.11:2.3.0,org.apache.solr:solr-solrj:4.10.3-cdh5.12.2,org.mongodb.spark:mongo-spark-connector_2.11:2.2.1 \
--name "TEST-name" \
--class com.lzkj.bi.App \
$jarf $@




```
