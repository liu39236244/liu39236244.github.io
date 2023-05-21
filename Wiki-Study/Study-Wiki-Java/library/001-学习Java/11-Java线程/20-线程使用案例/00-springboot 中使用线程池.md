# springboot中使用线程池


## Java多线程之线程池的参数和配置

[原文地址:](https://blog.csdn.net/MRZHQ/article/details/129107342)

在Java多线程编程中，线程池是一种常见的技术，用于管理线程的创建和销毁。线程池中的线程可以被重复利用，从而减少了线程的创建和销毁的开销，提高了程序的性能。在Java中，线程池的参数和配置非常重要，不同的参数和配置会影响线程池的性能和行为。

## 线程池参数


```
Java线程池的主要参数如下：

核心线程数（corePoolSize）：线程池中的基本线程数量，即线程池中一直存在的线程数。

最大线程数（maximumPoolSize）：线程池中最大的线程数量，即线程池中最多可以存在的线程数。

空闲线程的存活时间（keepAliveTime）：当线程池中的线程数量大于corePoolSize时，空闲线程在多长时间内会被回收。

任务队列（workQueue）：用于保存提交给线程池但还未被执行的任务。

线程工厂（threadFactory）：用于创建新的线程。

拒绝策略（RejectedExecutionHandler）：当线程池中的任务数量超过了maximumPoolSize+workQueue容量时，新的任务会被拒绝执行，拒绝策略就是用来处理这种情况的。
```

### 线程池基本最简单用法

```java

import java.util.concurrent.*;
public class MyThreadPool {
    public static void main(String[] args) {
        int corePoolSize = 2;  // 核心线程数
        int maximumPoolSize = 4;  // 最大线程数
        long keepAliveTime = 10;  // 空闲线程的存活时间
        TimeUnit unit = TimeUnit.SECONDS;  // 存活时间单位
        BlockingQueue<Runnable> workQueue = new ArrayBlockingQueue<>(2);  // 任务队列
        ThreadFactory threadFactory = Executors.defaultThreadFactory();  // 线程工厂
        RejectedExecutionHandler handler = new ThreadPoolExecutor.CallerRunsPolicy();  // 拒绝策略
        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, threadFactory, handler);
    }
}

```


```
在进行线程池的配置时，可以遵循以下几个建议：

1. 核心线程数设置为CPU核心数或略大于CPU核心数，这样可以充分利用CPU资源，提高程序性能。

2. 最大线程数根据实际情况和任务类型进行设置，不能设置过大或过小，过大会导致线程过多而浪费资源，过小会导致任务无法及时处理。

3. 空闲线程的存活时间应该根据任务类型和处理时间进行设置，如果任务处理时间较长，可以适当延长存活时间，避免频繁创建和销毁线程。

4. 任务队列可以选择不同类型的队列，如ArrayBlockingQueue、LinkedBlockingQueue等，根据任务类型和量进行选择。

5. 线程工厂可以自定义实现，实现自己的线程创建方式。

6. 拒绝策略可以根据实际情况选择，如CallerRunsPolicy、AbortPolicy、DiscardOldestPolicy、DiscardPolicy等。

通过合理的参数和配置，可以有效地管理线程池中的线程，提高程序的性能和稳定性。在实际项目中，需要根据任务类型和量进行具体的配置，不断优化和调整，以达到最优的效果。

```

### 几种拒绝策略


CallerRunsPolicy、AbortPolicy、DiscardOldestPolicy、DiscardPolicy


当线程池中没有空闲的线程且阻塞队列满了，或者线程池不是RUNNING状态时，增加任务时执行拒绝策略。线程池总共有四种拒绝策略，分别为：CallerRunsPolicy、AbortPolicy、 DiscardPolicy 、DiscardOldestPolicy。默认AbortPolicy策略


#### 一、CallerRunsPolicy
     当前线程直接执行，既然线程池没有空闲线程，那么就我自己执行吧

```java
 /**
     * A handler for rejected tasks that runs the rejected task
     * directly in the calling thread of the {@code execute} method,
     * unless the executor has been shut down, in which case the task
     * is discarded.
     */
    public static class CallerRunsPolicy implements RejectedExecutionHandler {
        /**
         * Creates a {@code CallerRunsPolicy}.
         */
        public CallerRunsPolicy() { }
 
        /**
         * Executes task r in the caller's thread, unless the executor
         * has been shut down, in which case the task is discarded.
         *
         * @param r the runnable task requested to be executed
         * @param e the executor attempting to execute this task
         */
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
            if (!e.isShutdown()) {
                //当前线程直接run，而不是使用线程池e执行
                r.run();
            }
        }
    }

```

####  二、 AbortPolicy 
    丢弃这个任务，但是会抛异常

```java
     /**
     * A handler for rejected tasks that throws a
     * {@code RejectedExecutionException}.
     */
    public static class AbortPolicy implements RejectedExecutionHandler {
        /**
         * Creates an {@code AbortPolicy}.
         */
        public AbortPolicy() { }
 
        /**
         * Always throws RejectedExecutionException.
         *
         * @param r the runnable task requested to be executed
         * @param e the executor attempting to execute this task
         * @throws RejectedExecutionException always
         */
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
 
            //抛出异常
            throw new RejectedExecutionException("Task " + r.toString() +
                                                 " rejected from " +
                                                 e.toString());
        }
    }

```


#### 三、DiscardPolicy
  
  丢弃当前任务，也不抛出异常

```java
/**
     * A handler for rejected tasks that silently discards the
     * rejected task.
     */
    public static class DiscardPolicy implements RejectedExecutionHandler {
        /**
         * Creates a {@code DiscardPolicy}.
         */
        public DiscardPolicy() { }
 
        /**
         * Does nothing, which has the effect of discarding task r.
         *
         * @param r the runnable task requested to be executed
         * @param e the executor attempting to execute this task
         */
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
             //什么都没做
        }
    }

```


#### 四、DiscardOldestPolicy

抛弃线程池中最老的任务，线程池执行（线程池不一定会马上执行这个任务，大概率是加入到任务队列中）。


```java
 /**
     * A handler for rejected tasks that discards the oldest unhandled
     * request and then retries {@code execute}, unless the executor
     * is shut down, in which case the task is discarded.
     */
    public static class DiscardOldestPolicy implements RejectedExecutionHandler {
        /**
         * Creates a {@code DiscardOldestPolicy} for the given executor.
         */
        public DiscardOldestPolicy() { }
 
        /**
         * Obtains and ignores the next task that the executor
         * would otherwise execute, if one is immediately available,
         * and then retries execution of task r, unless the executor
         * is shut down, in which case task r is instead discarded.
         *
         * @param r the runnable task requested to be executed
         * @param e the executor attempting to execute this task
         */
        public void rejectedExecution(Runnable r, ThreadPoolExecutor e) {
            if (!e.isShutdown()) {
                e.getQueue().poll(); //删除任务队列中最老的任务
                e.execute(r);  //执行任务
            }
        }
    }

```