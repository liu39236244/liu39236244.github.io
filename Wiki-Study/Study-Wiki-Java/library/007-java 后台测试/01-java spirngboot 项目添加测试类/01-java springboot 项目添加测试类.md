# java springboot 添加测试类



## 测试springboot 的类

>1 选中springboot启动类 使用快捷键 ctrl+shift+t 或者 navigate 创建测试类


![](assets/007/01/01-1596790209240.png)


![](assets/007/01/01-1596790159575.png)


> 2 创建测试类，注意：需要与springboot启动类的包名一模一样


![](assets/007/01/01-1596790258906.png)


> 3 测试

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