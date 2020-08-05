# spring-cloud springboot 项目整合到任意一服务中webservcie并且调用



## 总结

## 步骤

### 引入pom，

这种cxf 与上一个cxf 引得包有区别暂时先记录下来
```xml
        <dependency>
            <groupId>org.apache.cxf</groupId>
            <artifactId>cxf-spring-boot-starter-jaxws</artifactId>
            <version>3.2.5</version>
        </dependency>

```

### 2 编写webservice

* 1 包结构自行定义即可没有什么要求

![](assets/003/02/02/02-1587087386453.png)
 
* 2 接口 SmartCityService.java

```java
package com.graphsafe.user.webService.smartCityService;

import org.springframework.stereotype.Component;

import javax.jws.WebMethod;
import javax.jws.WebParam;
import javax.jws.WebResult;
import javax.jws.WebService;
import javax.jws.soap.SOAPBinding;

/**
 * @author ：syb
 * @date ：Created in 2020-04-16 10:13
 * @description：cxf webService 服务
 * @modified By：syb
 * @version: 1.0
 */
@WebService(name = "SmartCityService", // 暴露服务名称
        targetNamespace = "http://www.smartCityService.webService.user.graphsafe.com")   //命名空间,一般是接口的包名倒序
@SOAPBinding(style = SOAPBinding.Style.RPC)
public interface SmartCityService {
    @WebMethod
    @WebResult(name = "String",targetNamespace = "") // 这个暂时没去看，不加也应该可以感觉
    public String HelloWorld(@WebParam(name = "HelloWorld") String name);


    /**
     * 同步用户
     */
    @WebMethod
    public String addPerson(@WebParam(name = "addPerson") String personXML);

}

```


* 3 SmartCityServiceImpl.java


```java
    package com.graphsafe.user.webService.smartCityService.impl;

import com.graphsafe.user.webService.smartCityService.SmartCityService;
import org.springframework.stereotype.Component;

import javax.jws.WebService;

/**
 * @author ：syb
 * @date ：Created in 2020-04-16 10:20
 * @description：智慧城市cxf形式实现
 * @modified By：syb
 * @version: 1.0
 */
@WebService(serviceName = "SmartCityService",//与前面接口一致
        targetNamespace = "http://www.smartCityService.webService.user.graphsafe.com",  //与前面接口一致
        endpointInterface = "com.graphsafe.user.webService.smartCityService.SmartCityService")  //接口地址
@Component
public class SmartCityServiceImpl implements SmartCityService {
    @Override
    public String HelloWorld(String name) {
        return "Hello World!!! --->"+name;
    }

    @Override
    public String addPerson(String personXML) {
        return "同步添加用户！"+personXML;
    }


}

```

* 编写配置文件，配置类


```java
package com.graphsafe.user.config;

import com.graphsafe.user.webService.smartCityService.SmartCityService;
import com.graphsafe.user.webService.smartCityService.impl.SmartCityServiceImpl;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.apache.cxf.transport.servlet.CXFServlet;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.xml.ws.Endpoint;

/**
 * @author ：syb
 * @date ：Created in 2020-04-16 10:29
 * @description：智慧城市webservice配置
 * @modified By：syb
 * @version:
 */

@Configuration
public class WebServiceConfig {
    @Autowired
    private Bus bus;

    @Autowired
    SmartCityService smartCityService;

    /**
     * 访问路径：http://localhost:8094/user/smartService/smart?wsdl  或者 http://localhost:8762/api/user/smartService/smart?wsdl  （后者有拦截器） 8094 本服务端口； user 本服务地址
     */
    @Bean
    public ServletRegistrationBean cxfServlet() {
        return new ServletRegistrationBean(new CXFServlet(), "/smartService/*");
    }

    @Bean
    ServletWebServerFactory servletWebServerFactory() {
        return new TomcatServletWebServerFactory();
    }

    /*jax-ws*/
    @Bean
    public Endpoint endpoint() {
        EndpointImpl endpoint = new EndpointImpl(bus, smartCityService);
        endpoint.publish("/smart");

        return endpoint;
    }
}

```

### 测试，web服务随着本服务开启而开启


```java
import com.graphsafe.user.webService.smartCityService.SmartCityService;
import io.netty.handler.codec.DecoderResultProvider;
import org.apache.cxf.endpoint.Client;
import org.apache.cxf.jaxws.JaxWsProxyFactoryBean;
import org.apache.cxf.jaxws.endpoint.dynamic.JaxWsDynamicClientFactory;

/**
 * @author ：syb
 * @date ：Created in 2020-04-16 10:34
 * @description：smart智慧城市 webservice服务测试
 * @modified By：syb
 * @version: 1.0
 */
public class cxfTest {
    public static void main(String[] args) {
        cl1();
//        cl2();
    }

    /**
     * 方式1.代理类工厂的方式,需要拿到对方的接口
     */
    public static void cl1() {
        try {
            // 接口地址
            String address = "http://localhost:8094/user/smartService/smart?wsdl";
            // 代理工厂
            JaxWsProxyFactoryBean jaxWsProxyFactoryBean = new JaxWsProxyFactoryBean();
            // 设置代理地址
            jaxWsProxyFactoryBean.setAddress(address);
            // 设置接口类型
            jaxWsProxyFactoryBean.setServiceClass(SmartCityService.class);
            // 创建一个代理接口实现
            SmartCityService cs = (SmartCityService) jaxWsProxyFactoryBean.create();
            // 数据准备
            String userName = "Leftso";
            // 调用代理接口的方法调用并返回结果
            String result = cs.HelloWorld(userName);
            String resultPerson = cs.addPerson("xml人员数据");
            System.out.println("返回结果:" + result);
            System.out.println("返回结果,添加人员:" + resultPerson);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * 动态调用方式
     */
    public static void cl2() {
        // 创建动态客户端
        JaxWsDynamicClientFactory dcf = JaxWsDynamicClientFactory.newInstance();
        Client client = dcf.createClient("http://localhost:8094/user/smartService/smart?wsdl");
        // 需要密码的情况需要加上用户名和密码
        // client.getOutInterceptors().add(new ClientLoginInterceptor(USER_NAME,
        // PASS_WORD));
        Object[] objects = new Object[0];
        Object[] objects2 = new Object[0];
        try {
            // invoke("方法名",参数1,参数2,参数3....);
            objects = client.invoke("HelloWorld", "Leftso");
            System.out.println("返回数据 HelloWorld:" + objects[0]);

            objects2 = client.invoke("addPerson", "添加xml数据");
            System.out.println("返回数据 addPerson:" + objects2[0]);
        } catch (java.lang.Exception e) {
            e.printStackTrace();
        }
    }


}

```
