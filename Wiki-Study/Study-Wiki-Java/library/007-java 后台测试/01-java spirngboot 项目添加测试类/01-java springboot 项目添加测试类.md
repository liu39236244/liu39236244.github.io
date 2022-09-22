# java springboot 添加测试类



## 测试springboot 的类

>1 选中springboot启动类 使用快捷键 ctrl+shift+t 或者 navigate 创建测试类


![](assets/007/01/01-1596790209240.png)


![](assets/007/01/01-1596790159575.png)


> 2 创建测试类，注意：需要与springboot启动类的包名一模一样


![](assets/007/01/01-1596790258906.png)


> 3 测试

添加依赖

```xml
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <version>2.2.6.RELEASE</version>
        </dependency>
   
```

* 测试1 

```java
package com.szdp.dp_synthesize;

import com.szdp.dp_synthesize.service.SpreadManageService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import javax.annotation.Resource;


/**
 * @ClassName: test
 * @Author: shenyabo
 * @Date: 2020/8/7 16:45
 * @Description:
 * @Version: 1.0
 */
@RunWith(SpringRunner.class)
@SpringBootTest

public class test {

    @Resource
    private SpreadManageService spreadManageService;

    @Test
    public void test(){
        spreadManageService.getAllTerminalByParam(null);
    }
}


```


* 测试2

```java
/**
 * @author : shenyabo
 * @date : Created in 2021-05-26 16:39
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ZlEduApplication.class)
public class test {

    @Autowired
    private XzExamScoreService xzExamScoreService;
    @Test
    public void addExamData(){
        XzExamScore test = new XzExamScore();
        test.setExamineTime(new Date());
        test.setLlkhScore(1.0f);
        test.setUserId("123123123");
        xzExamScoreService.addSelective(test);
        System.out.println(test.getId());
    }
}

```


##   如果项目中引入了websocket 那么就会报错,那么如何解决呢

* 因为项目中引入了 webSocket  ， 就会在单元测试类中包一下错误

```java

import com.szdp.dp_synthesize.service.impl.TestService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author : shenyabo
 * @date : Created in 2020-11-19 10:57
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@RunWith(SpringRunner.class)
//@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) // 这里如果不指定，那么就会报一下错误
// @SpringBootTest // 如果服务中引入了websocket 那么则需要用上面的注解设置，否则报错
public class ProductTest {
    @Autowired
    TestService testService;
    @Test
    public void postTest() {
        System.out.println(1);
        com.szdp.dp_api.model.synthesize.po.Test test = new com.szdp.dp_api.model.synthesize.po.Test();
        test.setId(new BigDecimal(1));
        List<com.szdp.dp_api.model.synthesize.po.Test> tests = testService.selectDataBy(test);
        System.out.println(tests);
    }
}
```

如果 SpringBootTest注解 不设置 webEnvironment，测试就会报一下错误
具体参考博客 ：[spring boot 运行测试类时：Error creating bean with name 'serverEndpointExporter' 问题](https://blog.csdn.net/qq_27101653/article/details/85072241)

```java

Error starting ApplicationContext. To display the conditions report re-run your application with 'debug' enabled.
2020-11-19 11:28:35.034 ERROR 23096 --- [           main] o.s.boot.SpringApplication               : Application run failed

org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'serverEndpointExporter' defined in class path resource [com/szdp/dp_synthesize/config/WebSocketConfig.class]: Invocation of init method failed; nested exception is java.lang.IllegalStateException: javax.websocket.server.ServerContainer not available
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1745) ~[spring-beans-5.1.4.RELEASE.jar:5.1.4.RELEASE]
	at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:576) ~[spring-beans-5.1.4.RELEASE.jar:5.1.4.RELEASE]
```

就是应为定义了webSocket 配置类，并且使用了  @ServerEndpoint 注解， 

![](assets/007/01/01-1605757395877.png)

又或是博主报错的截图


![](assets/007/01/01-1605757415467.png)


* 所以解决方案两个


两种解决方式:

第一种：将@RunWith(SpringRunner.class) 去掉即可,但是这种方式会有局限，比如下方你要@Authwired一个类的时候会报错

![](assets/007/01/01-1605757463237.png)





第二种方式:

在SpringBootTest后加上

(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT) 即可
原因:websocket是需要依赖tomcat等容器的启动。所以在测试过程中我们要真正的启动一个tomcat作为容器。


![](assets/007/01/01-1605757546950.png)



