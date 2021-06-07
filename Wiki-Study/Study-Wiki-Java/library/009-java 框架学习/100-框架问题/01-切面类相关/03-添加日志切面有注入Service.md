# 注入service 切面的日志切面类

## 总结

参考博客：https://www.iteye.com/blog/tiangai-2103708


## demo

```java

import java.lang.annotation.*;

/**
 * @author : shenyabo
 * @date : Created in 2021-05-31 16:23
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Documented
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RefreshDic {

    String[] refreshTableList() default  {} ;



}

```


```java
import com.xzjy.common.annotation.RefreshDic;
import com.xzjy.zl_edu.service.XzExamScoreService;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 *@Author: shenyabo
 *@date: Create in 2021/5/31 16:33
 *@Description:  定义注解刷新指定字典项
 */
@Aspect
@Slf4j
@Component
public class Refresh {

    @Autowired
    private XzExamScoreService xzExamScoreService;

    public Refresh() {
        System.out.println("刷新字典表");

    }

    @Pointcut("@annotation(com.xzjy.common.annotation.RefreshDic)")
    private void refresh() {

    }

    @Around("refresh()")
    public Object doBefore(ProceedingJoinPoint joinPoint) throws Throwable {
        Object res = null;
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        try {
            res = joinPoint.proceed();
            return res;
        } finally {
            RefreshDic annotation = signature.getMethod().getAnnotation(RefreshDic.class);
            String[] strings = annotation.refreshTableList();
            if(strings.length == 0 ){
                // 没有配置则刷新所有字典项
                xzExamScoreService.initDics();

            }else{
                // 配置了那个刷新那个
                xzExamScoreService.initDics(strings);
            }
        }

    }
}

```