# websocket 或者其他工具类中注入service 方法


## 1 在启动类上run 返回的conetxt 去获取


```java
public class OperationApplication {
    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(OperationApplication.class);
        WebSocketService.setApplicationContext(context);
    }
}

```

```java

@ServerEndpoint(value = "/websocketService/{modulePath}/{teamId}")
@Component
@Slf4j

public class WebSocketService {


    // baseUserFeign =applicationContext.getBean(BaseUserFeign.class);
    private static ApplicationContext applicationContext;

    public static void setApplicationContext(ApplicationContext context){
        applicationContext = context;
    }


}
```


## 2 创建一个工具类

这里只写了一个根据id 获取bean(我这里使用getBean并没有获取到容器中对应的对象，使用context 去获取才可以。) 的，也可以直接获取context对象 去getBean. 

```java
package com.graphsafe.operation.utils;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * @author : shenyabo
 * @date : Created in 2022-11-07 14:17
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Component

public class SpringContextUtil implements ApplicationContextAware {

    /**
     *   Spring应用上下文环境
     */

    private static ApplicationContext applicationContext;

    /**
     * 实现ApplicationContextAware接口的回调方法，设置上下文环境
     */

    @Override
    public void setApplicationContext(ApplicationContext applicationContext)
            throws BeansException {
        SpringContextUtil.applicationContext = applicationContext;
    }

    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    /**
     * 获取对象 这里重写了bean方法，起主要作用
     */

    public static Object getBean(String beanId) throws BeansException {
        return applicationContext.getBean(beanId);
    }

}

```
