# spring cloud添加日志切面类



## spring cloud 添加日志切面类


* 此版本是微服务调用common中的切面类

> 1 日志切面注解


结构如下

![](assets/009/01/01-1605253215855.png)

```java
package com.szdp.annotation;
import com.szdp.enums.OperationType;

import java.lang.annotation.*;

@Documented
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface OperationLog {
    //操作内容
    String operationContent() default "";

    //操作类型
    OperationType operationType() default OperationType.UNKNOWN;

    //操作业务模块
    String operationBu() default "";

}

```

> 2 日志切面类


* spring cloud 项目，所以配置写到spring 配置中


```java
package com.szdp.aop;

import com.alibaba.fastjson.JSON;
import com.szdp.annotation.OperationLog;
import com.szdp.security.UserUtil;
import lombok.Getter;
import lombok.Setter;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.sql.*;
import java.util.UUID;

/**
 * @ClassName OpLog
 * @Description 日志切面类
 **/

@Aspect
@Component
public class OpLog {
    @Getter
    @Setter
    @Value("${spring.datasource.url}")
    private String url;
    @Getter
    @Setter
    @Value("${spring.datasource.username}")
    private String user;
    @Getter
    @Setter
    @Value("${spring.datasource.password}")
    private String password;
    public OpLog(){
        System.out.println("-----日志初始化");
    }
    @Pointcut("@annotation(com.szdp.annotation.OperationLog)")
    private void log() {
    }

    @Around("log()")
    public Object doAround(ProceedingJoinPoint joinPoint) throws Throwable {
        PreparedStatement pst = null;
        Connection conn = null;
        Object res = null;
        System.out.print("进入日志记录页面");
        MethodSignature signature = (MethodSignature)joinPoint.getSignature();
        try {
            res =  joinPoint.proceed();
            return res;
        } finally {
            try {
                //获取到拦截的接口的方法名
//                String methodName = joinPoint.getSignature().getName();
                //被拦截的方法的参数名称数组
//                String[] parameterNames = signature.getParameterNames();
                //被拦截的方法的参数值对象数组，这里我们将传入的参数转为json字符串格式便于存入数据库
                //1.加载驱动程序
                Class.forName("oracle.jdbc.driver.OracleDriver");
                //2.获得数据库链接
                conn= DriverManager.getConnection(url, user, password);

                //方法执行完成后增加日志
                OperationLog annotation = signature.getMethod().getAnnotation(OperationLog.class);
                String content = annotation.operationContent();
                String type = annotation.operationType().getValue();
                String bu = annotation.operationBu();
                String uid = UserUtil.getCurrUserId();
                String id = UUID.randomUUID().toString();
                Object[] objects = joinPoint.getArgs();
                StringBuilder args = new StringBuilder("");
                //暂时只记录删除操作
                if("delete".equals(type)){
                    for (int i = 0; i < objects.length; i++) {
                        String s = JSON.toJSONString(objects[i]);
                        if (i == objects.length - 1){
                            args.append(s);
                        }else {
                            args.append(s).append(",");
                        }
                    }
                }
                String inSql = "insert into OPERA_RECORD (id,create_people,content,opera_type,create_time,type,operate_opinions) values(?,?,?,?,?,?,?)";

                pst = conn.prepareStatement(inSql);
                pst.setString(1,id);
                pst.setString(2,uid);
                pst.setString(3,content);
                pst.setString(4,type);
                pst.setTimestamp(5,new Timestamp(new java.util.Date().getTime()));

                // 注意这里日期字段不能用setDate ，我用Date到时候会出现日志类走了，也没报错，但是数据没有插入成功，
//                pst.setDate(5,new Date(new java.util.Date().getTime())); // 这个是错误的写法，会插入数据不成功
                pst.setString(6,bu);
                pst.setString(7,args.toString());
                pst.execute();
                pst.executeUpdate();
            }catch (Exception e){
                e.printStackTrace();
            }
            finally {
                pst.close();
                conn.close();
            }
        }
    }
}

```

> 3 重点：将切面类注入到本服务中

* 1 通过configuration 中加入一个bean 

![](assets/009/01/01-1605253543884.png)


* 2 通过扫描

注：如果使用扫描的方式添加了，common中的aop中的切面类，那么spring 默认就不会扫描本包下的所有的 bean 了，所以在education 服务中，即使服务器起来了，但是呢访问controller 都是404 访问不到的，所以要加上本服务顶层的包， 至于指定到 com.jstc/ com.jstc/education 都是可以的


* 下面是错误的引用，因为加入自定义扫描的话，本包下面的都将不会被扫描，地址都将会 404

![](assets/009/01/01-1605254979821.png)



* 所以吧本服务中的类的扫描全加上

![](assets/009/01/01-1605254357384.png)


* 使用

![](assets/009/01/01-1605255092461.png)