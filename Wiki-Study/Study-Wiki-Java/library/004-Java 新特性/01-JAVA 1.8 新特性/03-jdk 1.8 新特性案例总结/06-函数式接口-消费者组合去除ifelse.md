# 函数式接口-消费者组合去除ifelse


BranchHandle

```java
package com.graphsafe.xsn.testTrue.function;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date:  2021/12/15 17:34
 * @Description: 为true false 进行不同操作
 * @Version: 1.0
 */

@FunctionalInterface
public interface BranchHandle {

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/12/15 17:36
     * @Description: 分支操作
     * @Params: [trueHandle： 为true时要进行的操作 , falseHandle:为false时要进行的操作]
     * @Return: void
     */
    void trueOrFalseHandle(Runnable trueHandle, Runnable falseHandle);

}

```


PresentOrElseHandler

```java
package com.graphsafe.xsn.testTrue.function;

import java.util.function.Consumer;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date:  2021/12/15 17:43
 * @Description: 值为空活不为空执行操作
 * @Version: 1.0
 */
@FunctionalInterface
public interface PresentOrElseHandler<T extends Object> {

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/12/15 17:44
     * @Description:
     * @Params: [action 值不为空时，执行的消费操作, emptyAction 值为空时，执行的操作]
     * @Return: void
     */
    void presentOrElseHandle(Consumer<? super T> action, Runnable emptyAction);

}
```

ThrowExceptionFunction

```java
package com.graphsafe.xsn.testTrue.function;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date:  2021/12/15 17:28
 * @Description: 抛出异常的函数式接口
 * @Version: 1.0
 */
@FunctionalInterface
public interface ThrowExceptionFunction {
    void throwMessage(String message);
}

```

## 工具类

VUtils

```java
package com.graphsafe.xsn.testTrue.utils;

import com.graphsafe.xsn.testTrue.function.BranchHandle;
import com.graphsafe.xsn.testTrue.function.PresentOrElseHandler;
import com.graphsafe.xsn.testTrue.function.ThrowExceptionFunction;
import com.graphsafe.xsn.utils.StringUtils;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date:  2021/12/15 17:29
 * @Description:  工具类
 * @Version: 1.0
 */
public class VUtils {


    /**
     * @Author: shenyabo
     * @Date: Create in 2021/12/15 17:30
     * @Description: 如果为true 则抛出异常
     * @Params: [flag]
     * @Return: com.graphsafe.xsn.testTrue.function.ThrowExceptionFunction
     */
    public static ThrowExceptionFunction isTrue(boolean flag){

        return (errorMessage) -> {
            if (flag) {
                throw new RuntimeException(errorMessage);
            }
        };
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/12/15 17:37
     * @Description: 为true false 执行不同操作
     * @Params: [b]
     * @Return: com.graphsafe.xsn.testTrue.function.BranchHandle
     */
    public static BranchHandle isTureOrFalse(boolean b){

        return (trueHandle, falseHandle) -> {
            if (b){
                trueHandle.run();
            } else {
                falseHandle.run();
            }
        };
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2021/12/15 17:46
     * @Description: 为空执行逻辑；不为空执行逻辑
     * @Params: [str]
     * @Return: com.graphsafe.xsn.testTrue.function.PresentOrElseHandler<?>
     */
    public static PresentOrElseHandler<?> isBlankOrNoBlank(String str){

        return (consumer, runnable) -> {
            if (StringUtils.isEmpty(str)){
                runnable.run();
            } else {
                consumer.accept(str);
            }
        };
    }
}


```


### 测试

```java
 @Test
    public void testVutils(){
        VUtils.isTrue(false).throwMessage("你是真的就报错了");

        VUtils.isTureOrFalse(true).trueOrFalseHandle(()->{
            System.out.println("为true，我是真的");
        },()->{
            System.out.println("false，我是假的");
        });

        // 为空不为空


        VUtils.isBlankOrNoBlank("123").presentOrElseHandle(new Consumer<Object>() {
            @Override
            public void accept(Object o) {
                System.out.println("不为空"+ o.toString());
            }
        }, () -> {
            System.out.println("为空字符串");
        });

        VUtils.isBlankOrNoBlank("123").presentOrElseHandle((cunsumerParam)->{
            System.out.println("不为空"+cunsumerParam);
        }, () -> {
            System.out.println("为空字符串");
        });

        VUtils.isBlankOrNoBlank("123").presentOrElseHandle(System.out::println, () -> {
            System.out.println("为空字符串");
        });
    }

```