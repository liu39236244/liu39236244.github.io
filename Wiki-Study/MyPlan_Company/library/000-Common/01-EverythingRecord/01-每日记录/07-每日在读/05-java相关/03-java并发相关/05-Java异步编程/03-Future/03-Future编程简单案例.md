# Future 简单获取多线程返回值案例

## 简单用法

原文地址：https://blog.csdn.net/boguesfei/article/details/81711839



在并发编程时，一般使用runnable，然后扔给线程池完事，这种情况下不需要线程的结果。 
所以run的返回值是void类型。 

如果是一个多线程协作程序，比如菲波拉切数列，1，1，2，3，5，8...使用多线程来计算。 
但后者需要前者的结果，就需要用callable接口了。 
callable用法和runnable一样，只不过调用的是call方法，该方法有一个泛型返回值类型，你可以任意指定。 

线程是属于异步计算模型，所以你不可能直接从别的线程中得到函数返回值。 
 这时候，Future就出场了。Futrue可以监视目标线程调用call的情况，当你调用Future的get()方法以获得结果时，当前线程就开始阻塞，直接call方法结束返回结果。 

下面三段简单的代码可以很简明的揭示这个意思：

![](assets/000/01/01/07/05/03/05/03/03-1628230575447.png)


runnable接口实现的没有返回值的并发编程。 

![](assets/000/01/01/07/05/03/05/03/03-1628230592641.png)


callable实现的存在返回值的并发编程。（call的返回值String受泛型的影响） 

![](assets/000/01/01/07/05/03/05/03/03-1628230603617.png)

同样是callable，使用Future获取返回值。


## 代码案例


### 案例1 

```java

package demo.future;
 
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
 
/**
 * 试验 Java 的 Future 用法
 */
public class FutureTest {
 
    public static class Task implements Callable<String> {
        @Override
        public String call() throws Exception {
            String tid = String.valueOf(Thread.currentThread().getId());
            System.out.printf("Thread#%s : in call\n", tid);
            return tid;
        }
    }
 
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        List<Future<String>> results = new ArrayList<Future<String>>();
        ExecutorService es = Executors.newCachedThreadPool();
        for(int i=0; i<100;i++)
            results.add(es.submit(new Task()));
 
        for(Future<String> res : results)
            System.out.println(res.get());
    }
 
}
```

Future接口，一般都是取回Callable执行的状态用的。其中的主要方法：

cancel，取消Callable的执行，当Callable还没有完成时
get，获得Callable的返回值
isCanceled，判断是否取消了
isDone，判断是否完成
 

用Executor来构建线程池，应该要做的事：

1).调用Executors类中的静态方法newCachedThreadPool(必要时创建新 线程，空闲线程会被保留60秒)或newFixedThreadPool(包含固定数量的线程池)等，返回的是一个实现了ExecutorService 接口的ThreadPoolExecutor类或者是一个实现了ScheduledExecutorServiece接口的类对象。

2).调用submit提交Runnable或Callable对象。

3).如果想要取消一个任务，或如果提交Callable对象，那就要保存好返回的Future对象。

4).当不再提交任何任务时，调用shutdown方法。

### 案例2



[简单使用案例1](https://zhuanlan.zhihu.com/p/439879500)

```java
@RestController
@EnableAsync //开启异步调用
public class MyController {

    @Autowired
    private MyAAServiceImpl service;

    @GetMapping("/select")
    public String test() throws ExecutionException {
        System.out.println("主线程线程=========="+Thread.currentThread().getName());
        Future future = service.select();
        //boolean done = future.isDone(); 用于判断线程是否执行完毕
        return future.get().toString;
    }
}
@Service
public class MyAAServiceImpl implements MyAAService {

    @Override
    @Async
    public Future select() {
        System.out.println("select()线程=========="+Thread.currentThread().getName());
        return new AsyncResult<>("success");
    }
}
```