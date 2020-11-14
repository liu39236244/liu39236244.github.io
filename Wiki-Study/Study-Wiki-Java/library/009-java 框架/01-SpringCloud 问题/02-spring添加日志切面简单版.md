# spirng cloud 添加日志切面比较简单的，只写一个类即可


## 代码如下


```java
package com.szdp.dp_government.config;

import java.util.HashMap;

import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.szdp.dp_api.feign.government.GovernmentFeign;
import com.szdp.dp_api.model.government.po.OperaRecord;
import org.apache.commons.lang3.StringUtils;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Aspect
@Component
public class GovernmentLogAspect {
    static HashMap <String, String> map = new HashMap <String, String>();

    static {
        map.put( "DICTIONARY", "字典信息" );
        map.put( "DLUCKFILINGWARNING", "报警信息" );
        map.put( "DLUCKQYBLACK", "黑名单" );
        map.put( "WEATHERSMS", "天气短信" );
        map.put("REMENDINFO" , "消息提醒");
    }

    @Autowired
    private GovernmentFeign governmentFeign;

    @Pointcut("execution(public * com.szdp.dp_user.controller..*.*(..))")//切入点描述 这个是controller包的切入点
    public void controllerLog() {
    }//签名，可以理解成这个切入点的一个名称

    @Before("controllerLog()") //在切入点的方法run之前要干的
    public void logAfterController( JoinPoint joinPoint ) throws Exception {

        RequestAttributes requestAttributes = RequestContextHolder.getRequestAttributes();//这个RequestContextHolder是Springmvc提供来获得请求的东西
        if (requestAttributes == null) {
            return;
        }
        HttpServletRequest request = ((ServletRequestAttributes) requestAttributes).getRequest();
        HttpServletResponse response = ((ServletRequestAttributes) requestAttributes).getResponse();

        String operationName = "";

        Set <String> keys = map.keySet();
        for (String key : keys) {
            if (joinPoint.getSignature().getDeclaringTypeName().toUpperCase().contains( key )) {
                operationName = map.get( key );
            }
        }
        if (StringUtils.isNotEmpty( operationName )) {
            OperaRecord operaRecord = new OperaRecord();
            if (request == null) {
                return;
            }
            if (request.getRequestURL().toString().matches( ".*save.*|.*add.*|.*insert.*" )) {
                operaRecord.setType( operationName + "管理" );
                operaRecord.setContent( "新增" + operationName + "信息" );
                operaRecord.setOperaType( "新增" );
                if (response.getStatus() == HttpServletResponse.SC_OK) {
                    operaRecord.setResult( "成功" );
                } else {
                    operaRecord.setResult( "失败" );
                }
                governmentFeign.insertLogRecord( operaRecord );
            } else if (request.getRequestURL().toString().matches( ".*del.*|.*delete.*" )) {
                operaRecord.setType( operationName + "管理" );
                operaRecord.setContent( "删除" + operationName + "信息" );
                operaRecord.setOperaType( "删除" );
                if (response.getStatus() == HttpServletResponse.SC_OK) {
                    operaRecord.setResult( "成功" );
                } else {
                    operaRecord.setResult( "失败" );
                }
                governmentFeign.insertLogRecord( operaRecord );
            } else if (request.getRequestURL().toString().matches( ".*update.*|.*change.*" )) {
                operaRecord.setType( operationName + "管理" );
                operaRecord.setContent( "修改" + operationName + "信息" );
                operaRecord.setOperaType( "修改" );
                if (response.getStatus() == HttpServletResponse.SC_OK) {
                    operaRecord.setResult( "成功" );
                } else {
                    operaRecord.setResult( "失败" );
                }
                governmentFeign.insertLogRecord( operaRecord );
            }
        }
    }
}
```


* 起到作用的包如下

![](assets/009/01/02-1605256560900.png)