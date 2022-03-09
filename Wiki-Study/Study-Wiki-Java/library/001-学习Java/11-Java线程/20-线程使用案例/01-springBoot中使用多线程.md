# springBoot中使用多线程


原文点击:[原文](https://mp.weixin.qq.com/s/Vbde0rqk2EotvlW9FpVHhQ)

## 线程配置类


```java
package com.graphsafe.xsn.thread;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @author : shenyabo
 * @date : Created in 2021-12-16 11:30
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Configuration
@EnableAsync
@Slf4j
public class ExecutorConfig {
    @Value("${async.executor.thread.core_pool_size}")
    private int corePoolSize;
    @Value("${async.executor.thread.max_pool_size}")
    private int maxPoolSize;
    @Value("${async.executor.thread.queue_capacity}")
    private int queueCapacity;
    @Value("${async.executor.thread.name.prefix}")
    private String namePrefix;

    @Bean(name = "asyncServiceExecutor")
    public Executor asyncServiceExecutor() {
        log.info("start asyncServiceExecutor");
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(corePoolSize);
        //配置最大线程数
        executor.setMaxPoolSize(maxPoolSize);
        //配置队列大小
        executor.setQueueCapacity(queueCapacity);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix(namePrefix);

        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //执行初始化
        executor.initialize();
        return executor;
    }
}
```


## 配置

### yml 中的配置
@Value是我配置在application.yml，可以参考配置，自由定义

```yml
# 异步线程配置
async:
  executor:
    thread:
      # 配置核心线程数
      core_pool_size: 5
      # 配置最大线程数
      max_pool_size: 5
      # 配置队列大小
      queue_capacity: 99999
      # 配置线程池中的线程的名称前缀
      name:
        prefix: async-service-


```

### properties 中的配置
@Value是我配置在application.properties，可以参考配置，自由定义

```
# 异步线程配置
# 配置核心线程数
async.executor.thread.core_pool_size = 5
# 配置最大线程数
async.executor.thread.max_pool_size = 5
# 配置队列大小
async.executor.thread.queue_capacity = 99999
# 配置线程池中的线程的名称前缀
async.executor.thread.name.prefix = async-service-

```


## service 接口创建

```java
public interface AsyncService {
   
     
    /**
     * 执行异步任务
     * 可以根据需求，自己加参数拟定，我这里就做个测试演示
     */
    void executeAsync();
}
```

## service 实现类

```java
@Service
public class AsyncServiceImpl implements AsyncService {
   
     
    private static final Logger logger = LoggerFactory.getLogger(AsyncServiceImpl.class);

    @Override
    @Async("asyncServiceExecutor")
    public void executeAsync() {
        logger.info("start executeAsync");

        System.out.println("异步线程要做的事情");
        System.out.println("可以在这里执行批量插入等耗时的事情");

        logger.info("end executeAsync");
    }
}
```


将Service层的服务异步化，在executeAsync()方法上增加注解@Async("asyncServiceExecutor")，asyncServiceExecutor方法是前面ExecutorConfig.java中的方法名，表明executeAsync方法进入的线程池是asyncServiceExecutor方法创建的

接下来就是在Controller里或者是哪里通过注解@Autowired注入这个Service

## Controller

```java
@Autowired
private AsyncService asyncService;

@GetMapping("/async")
public void async(){
    asyncService.executeAsync();
}
```

### postman 或者其他方式测试

```java
 2021-04-16 22:15:47.655  INFO 10516 --- [async-service-5] c.u.d.e.executor.impl.AsyncServiceImpl   : start executeAsync
异步线程要做的事情
可以在这里执行批量插入等耗时的事情
2021-04-16 22:15:47.655  INFO 10516 --- [async-service-5] c.u.d.e.executor.impl.AsyncServiceImpl   : end executeAsync
2021-04-16 22:15:47.770  INFO 10516 --- [async-service-1] c.u.d.e.executor.impl.AsyncServiceImpl   : start executeAsync
异步线程要做的事情
可以在这里执行批量插入等耗时的事情
2021-04-16 22:15:47.770  INFO 10516 --- [async-service-1] c.u.d.e.executor.impl.AsyncServiceImpl   : end executeAsync
2021-04-16 22:15:47.816  INFO 10516 --- [async-service-2] c.u.d.e.executor.impl.AsyncServiceImpl   : start executeAsync
异步线程要做的事情
可以在这里执行批量插入等耗时的事情
2021-04-16 22:15:47.816  INFO 10516 --- [async-service-2] c.u.d.e.executor.impl.AsyncServiceImpl   : end executeAsync
2021-04-16 22:15:48.833  INFO 10516 --- [async-service-3] c.u.d.e.executor.impl.AsyncServiceImpl   : start executeAsync
```


## 如何获取线程情况

通过以上日志可以发现，[async-service-]是有多个线程的，显然已经在我们配置的线程池中执行了，并且每次请求中，controller的起始和结束日志都是连续打印的，表明每次请求都快速响应了，而耗时的操作都留给线程池中的线程去异步执行；

虽然我们已经用上了线程池，但是还不清楚线程池当时的情况，有多少线程在执行，多少在队列中等待呢？这里我创建了一个ThreadPoolTaskExecutor的子类，在每次提交线程的时候都会将当前线程池的运行状况打印出来

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.util.concurrent.ListenableFuture;

import java.util.concurrent.Callable;
import java.util.concurrent.Future;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @Author: ChenBin
 */
public class VisiableThreadPoolTaskExecutor extends ThreadPoolTaskExecutor {
   
     

    private static final Logger logger = LoggerFactory.getLogger(VisiableThreadPoolTaskExecutor.class);

    private void showThreadPoolInfo(String prefix) {
        ThreadPoolExecutor threadPoolExecutor = getThreadPoolExecutor();

        if (null == threadPoolExecutor) {
            return;
        }

        logger.info("{}, {},taskCount [{}], completedTaskCount [{}], activeCount [{}], queueSize [{}]",
                this.getThreadNamePrefix(),
                prefix,
                threadPoolExecutor.getTaskCount(),
                threadPoolExecutor.getCompletedTaskCount(),
                threadPoolExecutor.getActiveCount(),
                threadPoolExecutor.getQueue().size());
    }

    @Override
    public void execute(Runnable task) {
        showThreadPoolInfo("1. do execute");
        super.execute(task);
    }

    @Override
    public void execute(Runnable task, long startTimeout) {
        showThreadPoolInfo("2. do execute");
        super.execute(task, startTimeout);
    }

    @Override
    public Future<?> submit(Runnable task) {
        showThreadPoolInfo("1. do submit");
        return super.submit(task);
    }

    @Override
    public <T> Future<T> submit(Callable<T> task) {
        showThreadPoolInfo("2. do submit");
        return super.submit(task);
    }

    @Override
    public ListenableFuture<?> submitListenable(Runnable task) {
        showThreadPoolInfo("1. do submitListenable");
        return super.submitListenable(task);
    }

    @Override
    public <T> ListenableFuture<T> submitListenable(Callable<T> task) {
        showThreadPoolInfo("2. do submitListenable");
        return super.submitListenable(task);
    }
}
```

### 配置类修改；


如上所示，showThreadPoolInfo方法中将任务总数、已完成数、活跃线程数，队列大小都打印出来了，然后Override了父类的execute、submit等方法，在里面调用showThreadPoolInfo方法，这样每次有任务被提交到线程池的时候，都会将当前线程池的基本情况打印到日志中；

修改ExecutorConfig.java的asyncServiceExecutor方法，将ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor()改为ThreadPoolTaskExecutor executor = new VisiableThreadPoolTaskExecutor()

```java
@Bean(name = "asyncServiceExecutor")
    public Executor asyncServiceExecutor() {
        logger.info("start asyncServiceExecutor");
        //在这里修改
        ThreadPoolTaskExecutor executor = new VisiableThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(corePoolSize);
        //配置最大线程数
        executor.setMaxPoolSize(maxPoolSize);
        //配置队列大小
        executor.setQueueCapacity(queueCapacity);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix(namePrefix);

        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        //执行初始化
        executor.initialize();
        return executor;
    }
```

## 日志解释

2021-04-16 22:23:32.496  INFO 14088 --- [nio-8087-exec-7] u.d.e.e.i.VisiableThreadPoolTaskExecutor : async-service-, 2. do submit,taskCount [3], completedTaskCount [3], activeCount [0], queueSize [0]

这说明提交任务到线程池的时候，调用的是submit(Callable task)这个方法，当前已经提交了3个任务，完成了3个，当前有0个线程在处理任务，还剩0个任务在队列中等待，线程池的基本情况一路了然；