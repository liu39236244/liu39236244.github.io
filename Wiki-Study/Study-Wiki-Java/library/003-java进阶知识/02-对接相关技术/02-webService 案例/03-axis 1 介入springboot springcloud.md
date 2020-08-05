# axis 形式介入springboot-springcloud 


## 总结
 这里挺坑的，搜了大量的博客，案例 要么有的是wsdl 文件然后下载asix项目，自动根据命令生成服务端，客户端 ;要么就是实际情况跟我框架情况的很少，都是部分类似的情况，有时候需要自行修改测试

参考原文：https://www.cnblogs.com/JohnDawson/p/11151806.html 

 ## 步骤 


 ### 1 pom 引入jar 

 ```xml
 <dependency>
            <groupId>org.apache.axis</groupId>
            <artifactId>axis</artifactId>
            <version>1.4</version>
        </dependency>

        <dependency>
            <groupId>axis</groupId>
            <artifactId>axis-jaxrpc</artifactId>
            <version>1.4</version>
        </dependency>

        <dependency>
            <groupId>commons-discovery</groupId>
            <artifactId>commons-discovery</artifactId>
            <version>0.2</version>
        </dependency>
        <dependency>
            <groupId>wsdl4j</groupId>
            <artifactId>wsdl4j</artifactId>
            <version>1.6.3</version>
        </dependency>
 ```

 ### 2 编写接口、实现类、以及servlet 过滤规则


* 文件结构


![](assets/003/02/02/03-1587088057400.png)

* 1 SmartCitySynchrodataService.java,就是一个普通的接口，不需要家人和注解。其实还是挺方便的
 ```java
package com.graphsafe.user.smartWebService.service;

/**
 * @author ：syb
 * @date ：Created in 2020-04-15 14:07
 * @description：智慧新城数据同步webservice
 * @modified By：syb
 * @version: 1.0
 */

public interface SmartCitySynchrodataService {

    /**
     * 同步用户
     */
    public String addPerson(String personXML);

    public String deletePerson(String personXML);

    public String updatePerson(String personXML);


    /**
     * 部门同步
     */
    public String addDepartment(String deptXML);

    public String deleteDepartment(String deptXML);

    public String updateDepartment(String deptXML);




}

 ```

 * SmartCitySynchrodataServiceImp.java


 ```java
 package com.graphsafe.user.smartWebService.service.impl;



import com.graphsafe.user.smartWebService.service.SmartCitySynchrodataService;
import com.graphsafe.user.utils.XmlUtil;
import org.dom4j.Element;

import java.util.Map;

/**
 * @author ：syb
 * @date ：Created in 2020-04-15 14:14
 * @description：智慧城市同步数据实现类
 * @modified By：syb
 * @version: 1.0
 */

public class SmartCitySynchrodataServiceImp implements SmartCitySynchrodataService {


    /**
     * 访问路径：http://localhost:8094/user/services/smartCitySynchron?wsdl 或者 http://localhost:8762/user/services/smartCitySynchron?wsdl （有登陆失效问题）
     * @param personXML
     * @return
     */
    @Override
    /**
     * @Author: shenyabo
     * @Date: Create in 2020/4/16
     * @Description: 智慧新城用户同步添加
     * @Params: [personXML]
     * @Return:
     */
    public String addPerson(String personXML) {
        // personXML 就是xml 整个文件的string 字符串
        System.out.println("新增用户数据");
        Element rootElement = XmlUtil.getRootElement(personXML);
        Element element = XmlUtil.parseXml(personXML);
    

        return "success，获取数据为 \n"+personXML;
    }

    @Override
    public String deletePerson(String personXML) {
        return null;
    }

    @Override
    public String updatePerson(String personXML) {
        return null;
    }

    @Override
    public String addDepartment(String deptXML) {
        return null;
    }

    @Override
    public String deleteDepartment(String deptXML) {
        return null;
    }

    @Override
    public String updateDepartment(String deptXML) {
        return null;
    }


}

 ```

 * 编写servlet 过滤规则


 ```java
 package com.graphsafe.user.smartWebService.servlet;

/**
 * @author ：syb
 * @date ：Created in 2020-04-16 15:51
 * @description：servlet过滤规则
 * @modified By：syb
 * @version:
 */
import org.apache.axis.transport.http.AxisServlet;

@javax.servlet.annotation.WebServlet(
        urlPatterns =  "/services/*",
        loadOnStartup = 1,
        name = "AxisServlet"
)
public class WebServlet extends AxisServlet {

}
 ```

###   resource 资源目录下面编写配置文件 server-config.wsdd

 ```xml
 <?xml version="1.0" encoding="UTF-8"?>
<deployment xmlns="http://xml.apache.org/axis/wsdd/"
            xmlns:java="http://xml.apache.org/axis/wsdd/providers/java">
    <handler type="java:org.apache.axis.handlers.http.URLMapper"
             name="URLMapper" />

    <!--要告诉别人的接口名-->
    <service name="smartCitySynchron" provider="java:RPC">
        <!--这个是 实现类-->
        <parameter name="className" value="com.graphsafe.user.smartWebService.service.impl.SmartCitySynchrodataServiceImp" />
        <!--这是是暴露的方法名   比如可以值暴露一个-->
<!--        <parameter name="allowedMethods" value="addPerson" />-->
        <!--这是是暴露的方法名   也可以用* 表示暴露全部的public方法-->
        <parameter name="allowedMethods" value="*" />
    </service>

    <transport name="http">
        <requestFlow>
            <handler type="URLMapper" />
        </requestFlow>
    </transport>

</deployment>
 ```


### 测试

* TestUserService.java

```java
/**
 * @author ：syb
 * @date ：Created in 2020-04-16 15:15
 * @description：测试webservice
 * @modified By：syb
 * @version:
 */
import javax.xml.namespace.QName;
import org.apache.axis.client.Call;
import org.apache.axis.client.Service;

public class TestUserService {
//    private static String url="http://192.168.31.149:9090/wamp/services/UserInfoWebService";
    private static String url="http://localhost:8094/user/services/smartCitySynchron?wsdl";

    public static void addTest() throws Exception{
        String personXML="<Request>  <Header>    <RequestApp Name='ZHSZPT'/>    <Service Method='updatePerson' Name='SynOrgAndUser_jyyjpt'/>    <Summary>修改职工信息，编码：帐号：ctf姓名：天飞</Summary>  </Header>  <Body>    <Data>      <Cell Name='epPersonID' Value='11e0-d2ac-4d7313b2-8c3d-b9240344d6bb1134' Annotation='用户ID' DataType='int'/>        </Data>  </Body></Request>";
        Service service = new Service();
        Call call = (Call) service.createCall();
        call.setTargetEndpointAddress(new java.net.URL(url));
        call.setOperationName(new QName(url, "addPerson"));
        String returnXml = (String) call.invoke(new Object[] { personXML });
        System.out.println("返回结果:"+returnXml);
    }

    public static void updateTest() throws Exception{

        String personXML="<Request>  <Header>    <RequestApp Name='ZHSZPT'/>    <Service Method='updatePerson' Name='SynOrgAndUser_jyyjpt'/>    <Summary>修改职工信息，编码：帐号：ctf姓名：天飞</Summary>  </Header>  <Body>    <Data>      <Cell Name='epPersonID' Value='11e0-d2ac-4d7313b2-8c3d-b9240344d6bb1134' Annotation='用户ID' DataType='int'/>      </Data>  </Body></Request>";
        Service service = new Service();
        Call call = (Call) service.createCall();
        call.setTargetEndpointAddress(new java.net.URL(url));
        call.setOperationName(new QName(url, "updatePerson"));
        String returnXml = (String) call.invoke(new Object[] { personXML });
        System.out.println("返回结果:"+returnXml);
    }

    public static void deleteTest() throws Exception{

        String personXML="<Request>  <Header>    <RequestApp Name='ZHSZPT'/>    <Service Method='updatePerson' Name='SynOrgAndUser_jyyjpt'/>    <Summary>修改职工信息，编码：帐号：ctf姓名：天飞</Summary>  </Header>  <Body>    <Data>      <Cell Name='epStatus' Value='1' Annotation='用户状态' DataType='int'/>    </Data>  </Body></Request>";
        Service service = new Service();
        Call call = (Call) service.createCall();
        call.setTargetEndpointAddress(new java.net.URL(url));
        call.setOperationName(new QName(url, "deletePerson"));
        String returnXml = (String) call.invoke(new Object[] { personXML });
        System.out.println("返回结果:"+returnXml);
    }

    public static void main(String[] args) throws Exception
    {

        addTest();
        //updateTest();
        //deleteTest();
    }
}

```
## 注意点：

因为当时三种方式都在尝试，所以有的jar包 不用但也会引入，神奇的是这居然造成地址访问不了，你敢信？？？ 


```xml
        <!--cxf 形式的webservice，axis 形式webservice的话，千万不能引入cxf 包，否则服务地址访问不到-->
        <dependency>
            <groupId>org.apache.cxf</groupId>
            <artifactId>cxf-spring-boot-starter-jaxws</artifactId>
            <version>3.2.5</version>
        </dependency>

```

* 地址栏输入地址：http://localhost:8094/user/services/smartCitySynchron?wsdl ， 如果上面的包在你的pom里面，那么僵访问不到，别问我为啥。我也不知道！！就是这么坑。感觉挺有意思


![](assets/003/02/02/03-1587089181960.png)

