# 多线程执行主线程等待场景


## 线程等待场景的几种实现方式

原文：[ExecutorService 等待线程完成的那些事？](https://www.twle.cn/t/373)


### Executors 创建线程笨方法主线程等待方式

while循环方式 ，

```java
List<HazardousPersonnel> listQyInfo = hazardousPersonnelMapper.getQyInfo(dto);
int poolSize = 2;
if (listQyInfo.size() > 0) {
    poolSize = listQyInfo.size() / 4;
}

// ExecutorService pool = Executors.newFixedThreadPool(poolSize);
 ThreadPoolExecutor pool = new ThreadPoolExecutor(
                    //核心线程池大小
                    2,
                    //获取CPU核数 System.out.println(Runtime.getRuntime().availableProcessors());
                    poolSize,
                    //超时时间，没人调用时就会释放
                    3,
                    TimeUnit.SECONDS,
                    new LinkedBlockingQueue<>(3),
                    Executors.defaultThreadFactory(),
                    new ThreadPoolExecutor.AbortPolicy()
            );
 for (int i = 0; i < listQyInfo.size(); i++) {

    HazardousPersonnel hazardousPersonnel01 = listQyInfo.get(i);
    Runnable runnable = new Runnable() {
        ///... 耗时逻辑
    };
    pool.execute(runnable);

}
pool.shutdown();
while(true){
    // 判断是否线程池中都执行完毕
    if(pool.isTerminated()){
        break;
    }
}
return list;
```

### 使用ExecutorService.awaitTermination 定时等待线程执行完

当使用执行器 ( Executor ) 执行多线程时，我们可以通过调用 shutdown() 或 shutdownNow()关闭创建的线程

```java
List<HazardousPersonnel> listQyInfo = hazardousPersonnelMapper.getQyInfo(dto);
int poolSize = 2;
if (listQyInfo.size() > 0) {
    poolSize = listQyInfo.size() / 4;
}

// ExecutorService pool = Executors.newFixedThreadPool(poolSize);
 ThreadPoolExecutor pool = new ThreadPoolExecutor(
                    //核心线程池大小
                    2,
                    //获取CPU核数 System.out.println(Runtime.getRuntime().availableProcessors());
                    poolSize,
                    //超时时间，没人调用时就会释放
                    3,  
                    TimeUnit.SECONDS,
                    new LinkedBlockingQueue<>(3),
                    Executors.defaultThreadFactory(),
                    new ThreadPoolExecutor.AbortPolicy()
            );
 for (int i = 0; i < listQyInfo.size(); i++) {

    HazardousPersonnel hazardousPersonnel01 = listQyInfo.get(i);
    Runnable runnable = new Runnable() {
        ///... 耗时逻辑
    };
    pool.execute(runnable);

}
   pool.shutdown();
try {
    // 60秒未执行完就关闭线程
    if (!pool.awaitTermination(60, TimeUnit.SECONDS)) {
        pool.shutdownNow();
    }
} catch (InterruptedException ex) {
    pool.shutdownNow();
    // 标记当前主线程为需要关闭的线程
    Thread.currentThread().interrupt();
}

```


### 使用 CountDownLatch

#### 原文案例


还记得那篇 一文秒懂 Java CountDownLatch 文章吗？ 在这篇文章中，我们介绍了 CountDownLatch 类的用法。

因为，它提供了解决上述问题的另一种方法，准确的说，就是使用 CountDownLatch 来指示任务是否全部完成。

在那篇介绍文章中，我们知道 CountDownLatch 类提供了一个计数器，这个计数器一般设置为线程的数量，当线程完成时，就把值减 1 ，这样，当值为 0 的时候，就表示所有线程读执行完成了。

我们可以在执行器中使用它，使用在调用 await() 方法的所有线程被通知之前可以递减的次数来初始化计数器。

例如，如果我们需要当前线程等待另外 N 个线程完成执行，我们可以使用 N 初始化锁 ( latch )

```java


ExecutorService WORKER_THREAD_POOL 
  = Executors.newFixedThreadPool(10);
CountDownLatch latch = new CountDownLatch(2);
for (int i = 0; i < 2; i++) {
     // WORKER_THREAD_POOL.execute(() -> {
    WORKER_THREAD_POOL.submit(() -> {
        try {
            // ...
            latch.countDown();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    });
}

// wait for the latch to be decremented by the two remaining threads
latch.await();

try {
        // 阻塞，等到所有的线程执行完毕才能往下执行
        countDown.await();
        // 关闭线程池。shutdown：线程池拒接收新提交的任务，同时等待线程池里的任务执行完毕后关闭线程池。
        WORKER_THREAD_POOL.shutdown();
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

### 使用 invokeAll() 方法

中间也用到了 awaitTermination 

```java
public void awaitTerminationAfterShutdown(ExecutorService threadPool) {
    threadPool.shutdown();
    try {
        if (!threadPool.awaitTermination(60, TimeUnit.SECONDS)) {
            threadPool.shutdownNow();
        }
    } catch (InterruptedException ex) {
        threadPool.shutdownNow();
        Thread.currentThread().interrupt();
    }
}
```



我们可以用来运行线程的第一种方式是 invokeAll() 方法。该方法在所有任务完成或超时到期后，会返回一个 Future 对象列表。

此外，我们必须注意返回的 Future 对象的顺序与提供的 Callable 对象的列表相同。

```java
ExecutorService WORKER_THREAD_POOL = Executors.newFixedThreadPool(10);

List<Callable<String>> callables = Arrays.asList(
  new DelayedCallable("fast thread", 100), 
  new DelayedCallable("slow thread", 3000));

long startProcessingTime = System.currentTimeMillis();
List<Future<String>> futures = WORKER_THREAD_POOL.invokeAll(callables);

awaitTerminationAfterShutdown(WORKER_THREAD_POOL);

long totalProcessingTime = System.currentTimeMillis() - startProcessingTime;

assertTrue(totalProcessingTime >= 3000);

String firstThreadResponse = futures.get(0).get();

assertTrue("fast thread".equals(firstThreadResponse));

String secondThreadResponse = futures.get(1).get();
assertTrue("slow thread".equals(secondThreadResponse));
```