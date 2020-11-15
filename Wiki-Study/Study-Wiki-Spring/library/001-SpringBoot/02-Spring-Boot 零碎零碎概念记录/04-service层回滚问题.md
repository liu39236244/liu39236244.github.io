# service 层 事务回滚问题


## 总结

手动回滚

* 在@Transactional注解中如果不配置rollbackFor属性,那么事物只会在遇到RuntimeException的时候才会回滚,加上rollbackFor=Exception.class,可以让事物在遇到非运行时异常时也回滚


* 添加注解


```
如果对spring配置了service层事物的管理。

在一些业务中需要回滚，正常来说抛出一个运行时异常即可

throw new RuntimeException();
只是这样的话代码就结束了，如果要返回给用户错误信息，不太方便，这时可以添加如下代码，在catch中手动回滚

TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
这样既能正常返回错误信息，而又保持了事物的原子性。

```

* other 博客记录


> 注解失效的6中场景：https://baijiahao.baidu.com/s?id=1661565712893820457&wfr=spider&for=pc

>https://www.baidu.com/link?url=PHAE55WheuqSJJNrO8i44fgumxu-dlpAw_DnCXsYzLVY8zzU2SsBqYlPgAptbtOO62a_Pf4wVLIR_RN5QDgQW5GTZxy1qufwi2SyQ4JQEy3&wd=&eqid=a40cc55a0001d5dd000000025ef0279a


# 事务回滚总结2 

原文地址：https://blog.csdn.net/qq_41107231/article/details/106698940?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.nonecase&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-2.nonecase


## try catch 想要回滚怎么回滚

*  方法1 抛出运行时异常


1、一个添加信息的实现类方法上，此处我们加了Spring的事务。

2、问题：一个方法报异常（int a = 10/0）进行了异常捕获，另一个方法不会回滚（insert添加方法）

这是什么情况呢，相当于Spring事务策略失效了。

try-catch捕获了异常后，这种业务方法也就等于脱离了spring事务的管理，因为没有任何异常会从业务方法中抛出，全被捕获并“吞掉”，导致spring异常抛出触发事务回滚策略失效。

通俗的来说：默认spring事务只在发生未被捕获的 runtimeexcetpion或error时才回滚。


```java
@Transactional(rollbackFor=Exception.class) //表示此方法有异常时触发Spring事务,rollbackfor 属性指定了非运行时异常（运行时异常throw new runtimeException()） 也会回滚    
@Override
public CommonResult<User> saveUser(User user) {
    int insert = baseMapper.insert(user);
    try {
        // 添加异常，并进行捕获
        int a = 10/0;
    }catch (Exception e){
        logger.info("打印异常信息："+e);
        return CommonResult.commentFailure("服务器异常，事务回滚");
    }
    if(insert > 0){
        return CommonResult.commentSuccess(user);
    }else {
        return CommonResult.commentFailure("添加失败");
    }
}

```

* 方法二 手动try catch 中回滚

catch 中添加
```
TransactionAspectSupport.currentTransactionStatus().setRollbackOnly(); //手动回滚，这样上层就无需去处理异常了
```

代码如下
```java
@Transactional(rollbackFor=Exception.class) //表示此方法有异常时触发Spring事务
@Override
 public CommonResult<User> saveUser(User user) {
     int insert = baseMapper.insert(user);
     try {
         // 添加异常，并进行捕获
         int a = 10/0;
     }catch (Exception e){
         logger.info("异常信息："+e);
         // 方案二：手动回滚
         TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
         return CommonResult.commentFailure("服务器异常，事务回滚");
     }
     if(insert > 0){
         return CommonResult.commentSuccess(user);
     }else {
         return CommonResult.commentFailure("添加失败");
     }
 }

```

* 方法三写一个简单的工具类


```java
public class SpringRollBackUtil {

    /**
     * 事务回滚机制
     */
    public static void rollBack() {
        try {
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

```



# 事务回滚总结博主3 

* 原文博客：
[@Transactional回滚问题（try catch、嵌套）](https://www.cnblogs.com/pjjlt/p/10926398.html)


博主测试以及总结都挺好这里摘抄一下最终用总结

```
结论
结论一：对于@Transactional可以保证RuntimeException错误的回滚，如果想保证非RuntimeException错误的回滚，需要加上rollbackFor = Exception.class 参数。
结论二：try catch只是对异常是否可以被@Transactional 感知 到有影响。如果错误抛到切面可以感知到的地步，那就可以起作用。
结论三：由于REQUIRED属性，“两个事务”其实是一个事务，处理能力看报错时刻，是否添加了处理非RuntimeException的能力。
```



