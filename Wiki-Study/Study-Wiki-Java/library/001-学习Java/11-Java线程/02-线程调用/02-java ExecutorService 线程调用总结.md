# java线程调用方式


## 四种

博主总结: https://www.cnblogs.com/look-look/p/12802170.html
 
 基础是用:https://www.jianshu.com/p/d901b25e0d4a

## Executors 创建线程的方式以及不足

Executors 下面文章提到会无线创建线程，但是设定数量不就行了？这一点有点疑惑

 原文：https://blog.csdn.net/generalfu/article/details/111306939    
#  一文秒懂 Java ExecutorService

## 参考博客

[一文秒懂 Java ExecutorService](https://www.twle.cn/c/yufei/javatm/javatm-basic-executorservice.html)


## 创建线程池使用

```java
public class Demo02 {
    public static void main(String[] args) {
        ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
                2,//核心线程池大小
                5,//获取CPU核数 System.out.println(Runtime.getRuntime().availableProcessors());
                3,//超时时间，没人调用时就会释放
                TimeUnit.SECONDS,
                new LinkedBlockingQueue<>(3),
                Executors.defaultThreadFactory(),
                new ThreadPoolExecutor.AbortPolicy()
        );
        try {
            for (int i = 1; i <= 12; i++) {
                threadPoolExecutor.execute(()->{
                    System.out.println(Thread.currentThread().getName());
                });
            }
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            threadPoolExecutor.shutdown();
        }
    }
}

new ThreadPoolExecutor.AbortPolicy()//队列满了，还有线程进来，不处理，抛出异常
new ThreadPoolExecutor.CallerRunsPolicy()// 哪里来的回哪去
new ThreadPoolExecutor.DiscardPolicy()//队列满了，丢掉任务，不抛异常
new ThreadPoolExecutor.DiscardOldestPolicy()//队列满了，尝试和最早的竞争，不抛异常

```