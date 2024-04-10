# springboot 中线程 @async 的使用

[源博客地址](https://blog.51cto.com/u_15733182/6007080)

## 简单摘要

### 一、@Async注解

@Async的作用就是异步处理任务。

在方法上添加@Async，表示此方法是异步方法；
在类上添加@Async，表示类中的所有方法都是异步方法；
使用此注解的类，必须是Spring管理的类；
需要在启动类或配置类中加入@EnableAsync注解，@Async才会生效；
在使用@Async时，如果不指定线程池的名称，也就是不自定义线程池，@Async是有默认线程池的，使用的是Spring默认的线程池SimpleAsyncTaskExecutor。

默认线程池的默认配置如下：

默认核心线程数：8；
最大线程数：Integet.MAX_VALUE；
队列使用LinkedBlockingQueue；
容量是：Integet.MAX_VALUE；
空闲线程保留时间：60s；
线程池拒绝策略：AbortPolicy；
从最大线程数可以看出，在并发情况下，会无限制的创建线程，我勒个吗啊。

也可以通过yml重新配置：

```
spring:
  task:
    execution:
      pool:
        max-size: 10
        core-size: 5
        keep-alive: 3s
        queue-capacity: 1000
        thread-name-prefix: my-executor
```


也可以自定义线程池，下面通过简单的代码来实现以下@Async自定义线程池。


### 二、代码实例


Spring为任务调度与异步方法执行提供了注解@Async支持，通过在方法上标注@Async注解，可使得方法被异步调用。在需要异步执行的方法上加入@Async注解，并指定使用的线程池，当然可以不指定，直接写@Async。

#### 1、导入POM
复制 
```xml
<dependency>
    <groupId>com.google.guava</groupId>
    <artifactId>guava</artifactId>
    <version>31.0.1-jre</version>
</dependency>

```



#### 2、配置类 


```java

package com.nezhac.config;

import com.google.common.util.concurrent.ThreadFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.*;

@EnableAsync// 支持异步操作
@Configuration
public class AsyncTaskConfig {

    /**
     * com.google.guava中的线程池
     * @return
     */
    @Bean("my-executor")
    public Executor firstExecutor() {
        ThreadFactory threadFactory = new ThreadFactoryBuilder().setNameFormat("my-executor").build();
        // 获取CPU的处理器数量
        int curSystemThreads = Runtime.getRuntime().availableProcessors() * 2;
        ThreadPoolExecutor threadPool = new ThreadPoolExecutor(curSystemThreads, 100,
                200, TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(), threadFactory);
        threadPool.allowsCoreThreadTimeOut();
        return threadPool;
    }

    /**
     * Spring线程池
     * @return
     */
    @Bean("async-executor")
    public Executor asyncExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        // 核心线程数
        taskExecutor.setCorePoolSize(10);
        // 线程池维护线程的最大数量，只有在缓冲队列满了之后才会申请超过核心线程数的线程
        taskExecutor.setMaxPoolSize(100);
        // 缓存队列
        taskExecutor.setQueueCapacity(50);
        // 空闲时间，当超过了核心线程数之外的线程在空闲时间到达之后会被销毁
        taskExecutor.setKeepAliveSeconds(200);
        // 异步方法内部线程名称
        taskExecutor.setThreadNamePrefix("async-executor-");

        /**
         * 当线程池的任务缓存队列已满并且线程池中的线程数目达到maximumPoolSize，如果还有任务到来就会采取任务拒绝策略
         * 通常有以下四种策略：
         * ThreadPoolExecutor.AbortPolicy:丢弃任务并抛出RejectedExecutionException异常。
         * ThreadPoolExecutor.DiscardPolicy：也是丢弃任务，但是不抛出异常。
         * ThreadPoolExecutor.DiscardOldestPolicy：丢弃队列最前面的任务，然后重新尝试执行任务（重复此过程）
         * ThreadPoolExecutor.CallerRunsPolicy：重试添加当前的任务，自动重复调用 execute() 方法，直到成功
         */
        taskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        taskExecutor.initialize();
        return taskExecutor;
    }
}

```


#### 3、  service

```java
package com.nezha.service;

public interface UserService {

    // 普通方法
    void test();

    // 异步方法
    void asyncTest();
}
```

#### 4、实现类


```java

package com.nezha.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Override
    public void test() {
        logger.info("执行普通任务");
    }

    @Async("my-executor")
    @Override
    public void asyncTest() {
        logger.info("执行异步任务");
    }
}

```


### 三、总结

如果代码没有按照逻辑多线程执行：以下是注意事项



```
注解@Async的方法不是public方法；
注解@Async的返回值只能为void或Future；
注解@Async方法使用static修饰也会失效；
没加@EnableAsync注解；
调用方和@Async不能在一个类中；
在Async方法上标注@Transactional是没用的，但在Async方法调用的方法上标注@Transcational是有效的；
```


### 四、 两个线程池区别

配置中分别使用了ThreadPoolTaskExecutor和ThreadPoolExecutor，这两个有啥区别？
ThreadPoolTaskExecutor是spring core包中的，而ThreadPoolExecutor是JDK中的JUC。ThreadPoolTaskExecutor是对ThreadPoolExecutor进行了封装。


```
ThreadPoolTaskExecutor 和 ThreadPoolExecutor 都是用于创建和管理线程池的类，但它们来自不同的框架和库。
ThreadPoolTaskExecutor 是 Spring 框架提供的一个类，用于在 Spring 应用程序中创建和管理线程池。它是基于 ThreadPoolExecutor 类的封装，提供了一些额外的功能和配置选项，以方便在 Spring 环境中使用线程池。
ThreadPoolExecutor 是 Java 的内置类，位于 java.util.concurrent 包中，它提供了更底层和通用的线程池实现。你可以直接使用 ThreadPoolExecutor 类来创建和配置自己的线程池，而不依赖于任何特定的框架。

主要区别如下：
框架依赖：ThreadPoolTaskExecutor 是 Spring 框架的一部分，而 ThreadPoolExecutor 是 Java 原生的类，不依赖于任何特定框架。

配置和管理：ThreadPoolTaskExecutor 提供了一些便利的配置选项，例如设置核心线程数、最大线程数、队列容量等，并且可以通过 Spring 的配置文件进行外部化配置。而使用 ThreadPoolExecutor，你需要手动设置这些参数。

集成和上下文：ThreadPoolTaskExecutor 与 Spring 的其他组件和上下文集成更好，可以自动管理线程池的生命周期和资源释放。它还可以利用 Spring 的事务管理、注解等功能。

功能和扩展性：ThreadPoolTaskExecutor 可能提供了一些额外的功能，例如与 Spring 的任务执行器（TaskExecutor）接口集成，以及与 Spring 的事务管理集成。如果你不需要这些特定的功能，或者需要更灵活的扩展性，使用 ThreadPoolExecutor 可能更合适。

总体而言，如果你在 Spring 框架中开发应用程序，并且希望利用 Spring 的一些集成和管理功能，使用 ThreadPoolTaskExecutor 可能更方便。如果你需要更底层的控制和灵活性，或者不依赖于 Spring，可以使用 ThreadPoolExecutor。

需要注意的是，这只是一个简要的对比，具体使用哪个类取决于你的项目需求和偏好。

```



五、核心线程数
配置文件中的线程池核心线程数为何配置为

```java
// 获取CPU的处理器数量
int curSystemThreads = Runtime.getRuntime().availableProcessors() * 2;
```

Runtime.getRuntime().availableProcessors()获取的是CPU核心线程数，也就是计算资源。

CPU密集型，线程池大小设置为N，也就是和cpu的线程数相同，可以尽可能地避免线程间上下文切换，但在实际开发中，一般会设置为N+1，为了防止意外情况出现线程阻塞，如果出现阻塞，多出来的线程会继续执行任务，保证CPU的利用效率。

IO密集型，线程池大小设置为2N，这个数是根据业务压测出来的，如果不涉及业务就使用推荐。
在实际中，需要对具体的线程池大小进行调整，可以通过压测及机器设备现状，进行调整大小。
如果线程池太大，则会造成CPU不断的切换，对整个系统性能也不会有太大的提升，反而会导致系统缓慢。


### 执行流程图


![](assets/001/11/20/07-1705905418527.png)