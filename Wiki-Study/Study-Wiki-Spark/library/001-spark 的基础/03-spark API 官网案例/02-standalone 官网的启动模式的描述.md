# 三种启动官网介绍

## standalone
* Spark Standalone Mode
除了在Mesos或纱线集群管理器上运行之外，Spark还提供了一个简单的独立部署模式。您可以手动启动一个独立的集群，或者手动启动一个主机和工人，或者使用我们提供的启动脚本。也可以在一台机器上运行这些守护进程进行测试。

* 将spark 独立安装到集群
要安装Spark独立模式，只需在集群的每个节点上放置一个编译版本的Spark。您可以在每个版本中获得预先构建的Spark版本，或者自己构建它。

* Cluster Launch Scripts
>官网给出的一些脚本

```shell
    sbin/start-master.sh - Starts a master instance on the machine the script is executed on.
    sbin/start-slaves.sh - Starts a slave instance on each machine specified in the conf/slaves file.
    sbin/start-slave.sh - Starts a slave instance on the machine the script is executed on.
    sbin/start-all.sh - Starts both a master and a number of slaves as described above.
    sbin/stop-master.sh - Stops the master that was started via the sbin/start-master.sh script.
    sbin/stop-slaves.sh - Stops all slave instances on the machines specified in the conf/slaves file.
    sbin/stop-all.sh - Stops both the master and the slaves as described above.

```
> 命令注意事项

```java
Note that these scripts must be executed on the machine you want to run the Spark master on, not your local machine.
// 注意：这些脚本只能在master上麦难治性，而不是你的本地机器

You can optionally configure the cluster further by setting environment variables in conf/spark-env.sh. Create this file by starting with the conf/spark-env.sh.template, and copy it to all your worker machines for the settings to take effect. The following settings are available:
```

> 集群中的一些配置(这里省略)

Connecting an Application to the Cluster

To run an application on the Spark cluster, simply pass the spark://IP:PORT URL of the master as to the SparkContext constructor.

To run an interactive Spark shell against the cluster, run the following command:

    ./bin/spark-shell --master spark://IP:PORT

You can also pass an option --total-executor-cores <numCores> to control the number of cores that spark-shell uses on the cluster.


> Launching Spark Applications(提交应用程序)

    The spark-submit script provides the most straightforward way to submit a compiled Spark application to the cluster. For standalone clusters, Spark currently supports two deploy modes. In client mode, the driver is launched in the same process as the client that submits the application. In cluster mode, however, the driver is launched from one of the Worker processes inside the cluster, and the client process exits as soon as it fulfills its responsibility of submitting the application without waiting for the application to finish.

    (Spark -submit脚本提供了向集群提交已编译的Spark应用程序的最直接方式。对于独立集群，Spark目前支持两种部署模式。在客户端模式中，驱动程序与提交应用程序的客户机在同一进程中启动。但是，在集群模式中，驱动程序是从集群内部的一个Worker进程中启动的，并且客户端进程在完成提交应用程序的职责时就会退出，而无需等待应用程序完成。)

    If your application is launched through Spark submit, then the application jar is automatically distributed to all worker nodes. For any additional jars that your application depends on, you should specify them through the --jars flag using comma as a delimiter (e.g. --jars jar1,jar2). To control the application’s configuration or execution environment, see Spark Configuration.

    (如果您的应用程序是通过Spark提交启动的，那么应用程序jar将自动分配给所有的工作节点。对于应用程序所依赖的任何其他jar，您应该通过-jar标记将它们指定为一个分隔符(例如，jar jar1,jar2)。要控制应用程序的配置或执行环境，请参见[Spark配置](http://spark.apache.org/docs/2.2.0/configuration.html)。)

    Additionally, standalone cluster mode supports restarting your application automatically if it exited with non-zero exit code. To use this feature, you may pass in the --supervise flag to spark-submit when launching your application. Then, if you wish to kill an application that is failing repeatedly, you may do so through:

    (此外，独立集群模式支持在非零退出代码退出时自动重新启动应用程序。要使用此功能，您可以在启动应用程序时传入—监督标志以进行spark提交。然后，如果您想要杀死重复失败的应用程序，您可以通过以下方式进行:)

        ./bin/spark-class org.apache.spark.deploy.Client kill <master url> <driver ID>

    You can find the driver ID through the standalone Master web UI at http://<master url>:8080.
