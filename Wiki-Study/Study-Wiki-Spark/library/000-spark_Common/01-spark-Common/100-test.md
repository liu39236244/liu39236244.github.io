# 测试
## 1
spark-submit \
  --class lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulator_2.MyAccumulator_Test \
  --master local[3] \
  D:\MyGitClone-Res\git-liu-55-2\liu39236255.github.io\AllProject\Spark_Study\out\artifacts\Spark_Study_jar\Spark_Study.jar

### 本地测试
spark-submit --class lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulator_2.MyAccumulator_Test --master local[3] F:\MyTestFold_Spark\jars\sc.jar

###　jvm测试

#### 找不到主类解决，出现其他问题
spark-submit --class lzkj.Spark_Study.Spark_Core.pipeTest.PipeTest  --master local[4] /shenyabo/HadoopTest/jars/sc.jar  /shenyabo/HadoopTest/shell/echo.sh

#### 本地
lzkj01:上面执行
spark-submit --class lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulator_2.MyAccumulator_Test --master local[3] /shenyabo/HadoopTest/jars/sc.jar


spark-submit --class lzkj.Spark_Study.Spark_Core.Accumulators.MyOwnAccumulator_2.MyAccumulator_Test --master yarn   --deploy-mode cluster   --executor-memory 512 --total-executor-cores 1  /shenyabo/HadoopTest/jars/sc.jar
遇到的问题：
Will allocate AM container, with 1408 MB memory including 384 MB overhead
