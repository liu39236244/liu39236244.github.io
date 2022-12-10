# 01-异步async注解配置线程池


[参考原文链接](https://blog.csdn.net/qq_44750696/article/details/123960134)

## springboot 中使用异步注解配置线程池问题


### 1 yml配置文件

```yml
asynctask:
  execution:
    pool:
      max-size: 20
      core-size: 2
      keep-alive: 5
      queue-capacity: 1000
      thread-name-prefix: myAsyncThreadPrefix
```

### 2 配置文件 AsyncConfigParam.java


```java
package com.graphsafe.admin.config.async;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date:  2022/7/5 10:51
 * @Description: 异步执行线程yml配置对象
 * @Version: 1.0
 */
@ConfigurationProperties("asynctask.execution.pool")
@Component
@Data
public class AsyncConfigParam {
    /**
     * 核心线程
     */
    private int coreSize;
    /**
     * 最大线程
     */
    private int maxSize;
    /**
     * 队列容量
     */
    private int queueCapacity;
    /**
     * 保持时间
     */
    private int keepAlive;

    /**
     * 名称前缀
     */
    private String threadNamePrefix;
}

```


### 3 注入线程池对象到 ioc容器中 AsyncExecutorConfig.java


```java
package com.graphsafe.admin.config.async;

import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date:  2022/7/5 10:14
 * @Description: 异步async注解异步执行创建的线程池配置类
 * @Version: 1.0
 */
@Component
@Data
public class AsyncExecutorConfig {
    @Autowired
    private AsyncConfigParam asyncConfigParam;

    @Bean("MyAsyncExecutor")
    public Executor myExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(asyncConfigParam.getCoreSize());
        executor.setMaxPoolSize(asyncConfigParam.getMaxSize());
        executor.setQueueCapacity(asyncConfigParam.getQueueCapacity());
        executor.setKeepAliveSeconds(asyncConfigParam.getKeepAlive());
        executor.setThreadNamePrefix(asyncConfigParam.getThreadNamePrefix());
        executor.setRejectedExecutionHandler( new ThreadPoolExecutor.AbortPolicy());
        executor.initialize();
        return executor;
    }

}

```

### 4 使用


```java
package com.graphsafe.admin.service.impl;

import com.graphsafe.admin.enums.base.ScheduleEnum;
import com.graphsafe.admin.model.po.BaseScheduledRecord;
import com.graphsafe.admin.quartz.schedule.QuartezScheduleService;
import com.graphsafe.admin.service.BaseScheduledRecordService;
import com.graphsafe.api.security.UserUtil;
import com.graphsafe.base.service.impl.BaseServiceImpl;
import com.graphsafe.admin.model.po.BaseScheduled;
import com.graphsafe.admin.service.BaseScheduledService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

/**
 * @description: 定时任务实现类
 * @author: syb
 * @create: 2020-09-16 17:54
 **/
@Transactional(rollbackFor = Exception.class)
@Service("baseScheduledService")
public class BaseScheduledServiceImpl extends BaseServiceImpl<BaseScheduled> implements BaseScheduledService {

    @Autowired
    private BaseScheduledRecordService baseScheduledRecordService;


    /**
     * @Author: shenyabo
     * @Date: Create in 2022/7/5 11:28
     * @Description: 插入任务记录
     * @Params: [beginTime, scheduled, executeResult]
     * @Return: void
     */
    //使用自定义的线程池(执行器)
    @Async("MyAsyncExecutor")
    @Override
    public void saveRecord(Date beginTime, BaseScheduled scheduled, String executeResult) {

        BaseScheduledRecord baseScheduledRecord = new BaseScheduledRecord();
        baseScheduledRecord.setBeginTime(beginTime);
        baseScheduledRecord.setEndTime(new Date());
        baseScheduledRecord.setSchedulerId(scheduled.getId());
        baseScheduledRecord.setExecuteResult(executeResult);
        baseScheduledRecord.setExecuteType(ScheduleEnum.LJZX.getValue());
        baseScheduledRecord.setSchedulerName(scheduled.getName());
        baseScheduledRecord.setExecutePeople(UserUtil.getCurrUserId());
        baseScheduledRecordService.addSelective(baseScheduledRecord);
        BaseScheduled byId = super.getById(scheduled.getId());
        byId.setCount(byId.getCount() + 1);
        byId.setLastExecuteTime(new Date());
        super.updateSelective(byId);
    }
}


```

### 注意事项

使用 @Async 注解 声明 方法是一个异步方法，且主类上需要添加注解  @EnableAsync

![](assets/003/13/04/01-1667287757232.png)




## @Async 说明


### 1 含义


```

        1，在方法上使用该@Async注解，申明该方法是一个异步任务；

        2，在类上面使用该@Async注解，申明该类中的所有方法都是异步任务；

        3，使用此注解的方法的类对象，必须是spring管理下的bean对象； 

        4，要想使用异步任务，需要在主类上开启异步配置，即，配置上@EnableAsync注解；
```

### 2 使用

```
在Spring中启用@Async：

        1，@Async注解在使用时，如果不指定线程池的名称，则使用Spring默认的线程池，Spring默认的线程池为SimpleAsyncTaskExecutor。

        2，方法上一旦标记了这个@Async注解，当其它线程调用这个方法时，就会开启一个新的子线程去异步处理该业务逻辑。
```



### 3 代码 案例


#### 启动类中增加@EnableAsync
以Spring boot 为例，启动类中增加@EnableAsync：

```java
@EnableAsync
@SpringBootApplication
public class ManageApplication {
    //...
}
```


#### 方法上加@Async注解：


```java
@Component
public class MyAsyncTask {
     @Async
    public void asyncCpsItemImportTask(Long platformId, String jsonList){
        //...具体业务逻辑
    }
}
```


### 4 默认线程池的缺陷：
        
        
上面的配置会启用默认的线程池/执行器，异步执行指定的方法。

Spring默认的线程池的默认配置：

```
    默认核心线程数：8，
    最大线程数：Integet.MAX_VALUE，
    队列使用LinkedBlockingQueue，
    容量是：Integet.MAX_VALUE，
    空闲线程保留时间：60s，
    线程池拒绝策略：AbortPolicy。
```

从最大线程数的配置上，相信你也看到问题了：并发情况下，会无限创建线程。。。 

所以才会有上述自定义线程池的写法 

## 异步任务的事务问题：

@Async注解由于是异步执行的，在其进行数据库的操作之时，将无法控制事务管理。

解决办法：可以把@Transactional注解放到内部的需要进行事务的方法上。

### 异步任务的返回结果：


异步的业务逻辑处理场景 有两种：一个是不需要返回结果，另一种是需要接收返回结果。

不需要返回结果的比较简单，就不多说了。

需要接收返回结果的示例如下：


```java
@Async("MyExecutor")
public Future<Map<Long, List>> queryMap(List ids) {
    List<> result = businessService.queryMap(ids);
    ..............
    Map<Long, List> resultMap = Maps.newHashMap();
    ...
    return new AsyncResult<>(resultMap);
}
```