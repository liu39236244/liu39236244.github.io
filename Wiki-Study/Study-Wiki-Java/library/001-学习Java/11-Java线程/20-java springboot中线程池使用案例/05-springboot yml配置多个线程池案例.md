# 配置多个线程池 

## 线程池配置以及简单使用版本1 

```
# 异步线程池配置
async:
  executor:
    thread-socket-threadPool:
      # 配置核心线程数
      core_pool_size: 12
      # 配置最大线程数
      max_pool_size: 20
      # 配置队列大小
      queue_capacity: 1000
      # 空闲线程 保持时间 ：秒
      keep_alive_seconds: 60
      # 配置线程池中的线程的名称前缀
      name:
        prefix: async-socket-thread
    # 每次往starrocks 一张表中插入数据线程池配置，一个桥 1s 按照3万条数据， 1个线程批量插入1000条 大概30次， 往后会有7 座桥甚至 30座桥 ， 按照7座桥的标准 给 70 个核心线程数
    thread-addDataToStarrocks-threadPool:
      # 配置核心线程数
      core_pool_size: 12
      # 配置最大线程数
      max_pool_size: 16
      # 配置队列大小
      queue_capacity: 1000
      # 空闲线程 保持时间 ：秒
      keep_alive_seconds: 60
      # 超时等待秒数
      set_awaitTermination_seconds: 180
      # 配置线程池中的线程的名称前缀
      name:
        prefix: async-addDataToStarrocks-thread
    # 每次往 kafka中 生产数据使用的线程池
    thread-produceToKafka-threadPool:
      # 配置核心线程数
      core_pool_size: 8
      # 配置最大线程数
      max_pool_size: 16
      # 配置队列大小
      queue_capacity: 500
      # 空闲线程 保持时间 ：秒
      keep_alive_seconds: 60
      # 超时等待秒数
      set_awaitTermination_seconds: 180
      # 配置线程池中的线程的名称前缀
      name:
        prefix: async-produceToKafka-thread
    # 匹配数据报警规则用的线程池
    thread-matchProbeDataWarningRule-threadPool:
      # 配置核心线程数
      core_pool_size: 8
      # 配置最大线程数
      max_pool_size: 16
      # 配置队列大小
      queue_capacity: 500
      # 空闲线程 保持时间 ：秒
      keep_alive_seconds: 60
      # 超时等待秒数
      set_awaitTermination_seconds: 180
      # 配置线程池中的线程的名称前缀
      name:
        prefix: async-matchProbeDataWarningRule-thread
```


## 配置文件

MyThreadPoolConfig
```
package com.graphsafe.bridge.Utils.socket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * @author : shenyabo
 * @date : Created in 2023-04-25 11:30
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Configuration
@Slf4j
public class MyThreadPoolConfig {


    //  socket 服务端接受客户端 对应线程池配置 -  暂时没用到

    @Value("${async.executor.thread-socket-threadPool.core_pool_size}")
    private int mqttCorePoolSize;
    @Value("${async.executor.thread-socket-threadPool.max_pool_size}")
    private int mqttMaxPoolSize;
    @Value("${async.executor.thread-socket-threadPool.queue_capacity}")
    private int mqttQueueCapacity;
    @Value("${async.executor.thread-socket-threadPool.name.prefix}")
    private String mqttNamePrefixMqtt;
    @Value("${async.executor.thread-socket-threadPool.keep_alive_seconds}")
    private Integer mqttKeepAliveSeconds;



    @Bean(name = "asyncSocketServiceExecutor")
    public Executor asyncSocketServiceExecutor() {
        log.info("start asyncMqttServiceExecutor 初始化线程池1");
        log.info("Runtime.getRuntime().availableProcessors() 查看服务器核心数{}",Runtime.getRuntime().availableProcessors());
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(mqttCorePoolSize);
        //配置最大线程数
        executor.setMaxPoolSize(mqttMaxPoolSize);
        //配置队列大小
        executor.setQueueCapacity(mqttQueueCapacity);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix(mqttNamePrefixMqtt);

        // 空闲线程保持多久
        executor.setKeepAliveSeconds(mqttKeepAliveSeconds);

        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());

        //调度器shutdown被调用时等待当前被调度的任务完成
        executor.setWaitForTasksToCompleteOnShutdown(true);
        //等待时长
        executor.setAwaitTerminationSeconds(60);

        //执行初始化
        executor.initialize();
        return executor;
    }





    //  socket 服务端接受客户端 对应线程池配置
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.core_pool_size}")
    private int addStarrocksCorePoolSize;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.max_pool_size}")
    private int addStarrocksMaxPoolSize;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.queue_capacity}")
    private int addStarrocksQueueCapacity;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.name.prefix}")
    private String addStarrocksNamePrefixSocket;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.keep_alive_seconds}")
    private Integer addStarrocksKeepAliveSeconds;

    @Value("${async.executor.thread-addDataToStarrocks-threadPool.set_awaitTermination_seconds}")
    private Integer setAwaitTerminationSeconds;


    @Bean(name = "asyncAddStarrocksServiceExecutor")
    public Executor asyncAddStarrocksServiceExecutor() {
        log.info("start asyncAddStarrocksServiceExecutor 初始化线程池 asyncAddStarrocksServiceExecutor");
        log.info("Runtime.getRuntime().availableProcessors() 查看服务器核心数{}",Runtime.getRuntime().availableProcessors());
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(addStarrocksCorePoolSize);
        //配置最大线程数
        executor.setMaxPoolSize(addStarrocksMaxPoolSize);
        //配置队列大小
        executor.setQueueCapacity(addStarrocksQueueCapacity);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix(addStarrocksNamePrefixSocket);

        // 空闲线程保持多久
        executor.setKeepAliveSeconds(addStarrocksKeepAliveSeconds);

        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());

        //调度器shutdown被调用时等待当前被调度的任务完成
        executor.setWaitForTasksToCompleteOnShutdown(true);
        //等待时长
        executor.setAwaitTerminationSeconds(setAwaitTerminationSeconds);

        //执行初始化
        executor.initialize();
        return executor;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/7/7 10:03
     * @Description: 配置kafka 生产者线程池  -  暂时没用到
     * @Params: []
     * @Return: java.util.concurrent.Executor
     */

    // 生产者 生产数据到produce 服务端接受客户端 对应线程池配置
    @Value("${async.executor.thread-produceToKafka-threadPool.core_pool_size}")
    private int produceToKafkaCorePoolSize;
    @Value("${async.executor.thread-produceToKafka-threadPool.max_pool_size}")
    private int  produceToKafkaMaxPoolSize;
    @Value("${async.executor.thread-produceToKafka-threadPool.queue_capacity}")
    private int  produceToKafkaQueueCapacity;
    @Value("${async.executor.thread-produceToKafka-threadPool.name.prefix}")
    private String  produceToKafkaPrefixKafka;
    @Value("${async.executor.thread-produceToKafka-threadPool.keep_alive_seconds}")
    private Integer produceToKafkaKeepAliveSeconds;

    @Value("${async.executor.thread-produceToKafka-threadPool.set_awaitTermination_seconds}")
    private Integer produceToKafkaSetAwaitTerminationSeconds;


    @Bean(name = "asyncKafkaProduceServiceExecutor")
    public Executor asyncKafkaProduceServiceExecutor() {

        log.info("start asyncKafkaProduceServiceExecutor 初始化线程池- asyncKafkaProduceServiceExecutor【kafka生产者】");
        log.info("Runtime.getRuntime().availableProcessors() 查看服务器核心数{}【kafka生产者】",Runtime.getRuntime().availableProcessors());
        int corePoolSize = produceToKafkaCorePoolSize; // 线程池的核心线程数
        int maxPoolSize = produceToKafkaMaxPoolSize; // 线程池的最大线程数
        int keepAliveTime = produceToKafkaKeepAliveSeconds; // 线程池中线程的最大空闲时间，单位为秒
        int queueCapacity = produceToKafkaQueueCapacity; // 线程池使用的任务队列长度

        ThreadPoolExecutor threadPool = new ThreadPoolExecutor(
                corePoolSize,
                maxPoolSize,
                keepAliveTime,
                TimeUnit.SECONDS,
                new ArrayBlockingQueue<>(queueCapacity),
                // 对列如果满了 则主线程去执行
                new ThreadPoolExecutor.CallerRunsPolicy()
        );

        return threadPool;
    }



    // 多线程去匹配探头报警规则数据
    @Value("${async.executor.thread-matchProbeDataWarningRule-threadPool.core_pool_size}")
    private int matchProbeWarningRuleCorePoolSize;
    @Value("${async.executor.thread-matchProbeDataWarningRule-threadPool.max_pool_size}")
    private int  matchProbeWarningRuleMaxPoolSize;
    @Value("${async.executor.thread-matchProbeDataWarningRule-threadPool.queue_capacity}")
    private int  matchProbeWarningRuleQueueCapacity;
    @Value("${async.executor.thread-matchProbeDataWarningRule-threadPool.name.prefix}")
    private String matchProbeWarningRulePrefix;
    @Value("${async.executor.thread-matchProbeDataWarningRule-threadPool.keep_alive_seconds}")
    private Integer matchProbeWarningRuleKeepAliveSeconds;

    @Value("${async.executor.thread-matchProbeDataWarningRule-threadPool.set_awaitTermination_seconds}")
    private Integer matchProbeWarningRuleSetAwaitTerminationSeconds;


    /**
     * @Author: shenyabo
     * @Date: Create in 2023/9/6 15:15
     * @Description: 多线程去匹配探头报警规则数据
     * @Params: []
     * @Return: java.util.concurrent.Executor
     */
    @Bean(name = "asyncProbeDataWarningRuleMatchExecutor")
    public Executor asyncProbeDataWarningRuleMatchExecutor() {

        log.info("start asyncKafkaProduceServiceExecutor 初始化线程池- asyncKafkaProduceServiceExecutor【匹配报警规则】");
        log.info("Runtime.getRuntime().availableProcessors() 查看服务器核心数{}【匹配报警规则】",Runtime.getRuntime().availableProcessors());
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(matchProbeWarningRuleCorePoolSize);
        //配置最大线程数
        executor.setMaxPoolSize(matchProbeWarningRuleMaxPoolSize);
        //配置队列大小
        executor.setQueueCapacity(matchProbeWarningRuleQueueCapacity);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix(matchProbeWarningRulePrefix);

        // 空闲线程保持多久
        executor.setKeepAliveSeconds(matchProbeWarningRuleKeepAliveSeconds);

        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());

        //调度器shutdown被调用时等待当前被调度的任务完成
        executor.setWaitForTasksToCompleteOnShutdown(true);
        //等待时长
        executor.setAwaitTerminationSeconds(matchProbeWarningRuleSetAwaitTerminationSeconds);

        //执行初始化
        executor.initialize();
        return executor;
    }











}


```



## 使用

```
    @Resource(name = "asyncSocketServiceExecutor")
    private ThreadPoolTaskExecutor asyncSocketServiceExecutor;

    @Resource(name = "asyncKafkaProduceServiceExecutor")
    private ThreadPoolExecutor asyncKafkaProduceServiceExecutor;


    
    @Scheduled(cron = "0/5 * * * * ?")//1秒执行一次
    @Async("asyncSocketServiceExecutor")

    public void probe1() {}
```


```java
public void probe1() {
        int deviceNum = 30000;
        List<Callable<Object>> tasks = new ArrayList<>();


        for (int i = 0; i < deviceNum; i++) {
            int andAdd = count.getAndAdd(1);
            String s = dataMap.get(i);
            CollectionTransmission analysis = BridgeDataAnalysisUtils.analysis(s);
            analysis.setId(andAdd);

            bridgeDataSend.sendBridge(kafkaBussinessConfig.getTopic(), JSONObject.toJSONString(analysis));
            // bridgeDataSend.sendBridge(KafkaConstant.BRIDGE_SENSOR_TOPIC, s);

            // if (count.get() == 1 || (count.get() % 10000) == 0) {
            //     log.info("生产第{}条数据", count.get());
            // }
            if (i ==  0 || i == 2999) {
                log.info("生产第{}条数据,对象id{}", andAdd,analysis.getId());
            }
        }


        for (int i = 0; i < deviceNum; i++) {
            String s = dataMap.get(i);
            Callable<Object> task = new Callable<Object>() {
                @Override
                public Object call() throws Exception {
                    int andAdd = count.getAndAdd(1);

                    CollectionTransmission analysis = BridgeDataAnalysisUtils.analysis(s);
                    analysis.setId(andAdd);

                    bridgeDataSend.sendBridge(KafkaConstant.BRIDGE_SENSOR_TOPIC, JSONObject.toJSONString(analysis));
                    // bridgeDataSend.sendBridge(KafkaConstant.BRIDGE_SENSOR_TOPIC, s);

                    // if (count.get() == 1 || (count.get() % 10000) == 0) {
                    //     log.info("生产第{}条数据", count.get());
                    // }
                    if (andAdd == 1 || (andAdd % 10000) == 0) {
                        log.info("生产第{}条数据,对象id{}", andAdd,analysis.getId());
                    }
                    // socketChannel.write(StandardCharsets.UTF_8.encode(s));
                    // socketChannel.close();
                    return null;

                }
            };

            tasks.add(task);

            asyncKafkaProduceServiceExecutor.submit(task);


        }

        try {
            asyncKafkaProduceServiceExecutor.invokeAll(tasks, 10, TimeUnit.SECONDS);

        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {

            // 停止向线程池提交新的任务，并等待所有任务执行完成
            // asyncKafkaProduceServiceExecutor.shutdown();
        }

        log.info(".....生产三万条数据完成..");

    }

```


## springboot 配置线自定义线程池 且 future 有线程阻塞等待的接口


### yml 配置


```yml
# 异步线程池配置
async:
  executor:
    # 每次往starrocks 一张表中插入数据线程池配置，一个桥 1s 按照3万条数据， 1个线程批量插入1000条 大概30次， 往后会有7 座桥甚至 30座桥 ， 按照7座桥的标准 给 70 个核心线程数
    thread-addDataToStarrocks-threadPool:
      # 配置核心线程数
      core_pool_size: 12
      # 配置最大线程数
      max_pool_size: 16
      # 配置队列大小
      queue_capacity: 1000
      # 空闲线程 保持时间 ：秒
      keep_alive_seconds: 60
      # 超时等待秒数
      set_awaitTermination_seconds: 180
      # 配置线程池中的线程的名称前缀
      name:
        prefix: async-addDataToStarrocks-thread
```


### java配置类

```java


package com.graphsafe.dataStorage.config.thread;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @author : shenyabo
 * @date : Created in 2023-04-25 11:30
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Configuration
@Slf4j
public class MyThreadPoolConfig {
    /**
     * @Description: socket 服务端接受客户端 对应线程池配置
     * @Date: 2023-10-18 17:14:29
     */
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.core_pool_size}")
    private int addStarrocksCorePoolSize;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.max_pool_size}")
    private int addStarrocksMaxPoolSize;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.queue_capacity}")
    private int addStarrocksQueueCapacity;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.name.prefix}")
    private String addStarrocksNamePrefixSocket;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.keep_alive_seconds}")
    private Integer addStarrocksKeepAliveSeconds;
    @Value("${async.executor.thread-addDataToStarrocks-threadPool.set_awaitTermination_seconds}")
    private Integer setAwaitTerminationSeconds;

    @Bean(name = "asyncAddStarRocksServiceExecutor")
    public Executor asyncAddStarRocksServiceExecutor() {
        log.info("start asyncAddStarrocksServiceExecutor 初始化线程池 asyncAddStarrocksServiceExecutor");
        log.info("Runtime.getRuntime().availableProcessors() 查看服务器核心数{}",Runtime.getRuntime().availableProcessors());
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(addStarrocksCorePoolSize);
        //配置最大线程数
        executor.setMaxPoolSize(addStarrocksMaxPoolSize);
        //配置队列大小
        executor.setQueueCapacity(addStarrocksQueueCapacity);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix(addStarrocksNamePrefixSocket);

        // 空闲线程保持多久
        executor.setKeepAliveSeconds(addStarrocksKeepAliveSeconds);

        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());

        //调度器shutdown被调用时等待当前被调度的任务完成
        executor.setWaitForTasksToCompleteOnShutdown(true);
        //等待时长
        executor.setAwaitTerminationSeconds(setAwaitTerminationSeconds);

        //执行初始化
        executor.initialize();
        return executor;
    }
}



```

### 使用demo



```java

@Component
@Slf4j
public class KafkaConsumer {

    @Resource(name = "asyncAddStarRocksServiceExecutor")
    private ThreadPoolTaskExecutor asyncAddStarRocksServiceExecutor;

    public void topicListener2(List<Message<String>> list, Consumer consumer) {
        List<Future> futureList = new ArrayList<>();
        try {
            for (Message<String> stringMessage : list) {
                FutureTask<String> task = new FutureTask<>(() -> {
                    /**
                    * 耗时间的业务逻辑代码
                    */
                
                    return "";
                });
                Future<?> future = asyncAddStarRocksServiceExecutor.submit(task);
                futureList.add(future);
            }

            //等待 所有线程都执行完
            for (Future future:futureList) {
                try {
                    //监听线程池子线程执行状态及执行结果。
                    future.get();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }
            }
        }

}

```