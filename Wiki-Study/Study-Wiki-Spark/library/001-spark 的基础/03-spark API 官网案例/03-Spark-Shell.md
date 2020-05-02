|# SparkShell

## Spark-shell

###  提交作业

* 案例

```shell
# For Scala and Java, use run-example:
./bin/run-example SparkPi

# For Python examples, use spark-submit directly:
./bin/spark-submit examples/src/main/python/pi.py

# For R examples, use spark-submit directly:
./bin/spark-submit examples/src/main/r/dataframe.R
```
* shell 提交
```shell
./bin/spark-shell --master local[4] --jars code.jar --packages "org.example:example:0.1"
```


##
