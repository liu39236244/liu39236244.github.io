# springboot中线程池基本用法 ThreadPoolExecutor


[参考博客：](https://blog.csdn.net/Wan_Yuan/article/details/109476578)


Java创建线程池，查看当前cpu的核心数


## 线程池设置最大线程数量公式：

（1）线程池大小 = CPU的数量 × 目标CPU的使用率 × （1＋等待时间与计算时间的比）

（2）一般情况：

```
IO密集型应用，则线程池大小设置为 2N+1 (N为CPU数量，下同)

CPU密集型应用，则线程池大小设置为 N+1

IO密集型和 CPU密集型简单来说就是看服务器是注重CPU运算还是IO传输
```


首先，查看当前cpu核的数量的代码

```java
System.out.println(Runtime.getRuntime().availableProcessors());
```


## 最基础的（案例手册 不推荐 只是作为了解就行）

创建线程池首先想到的是使用工具类Executors中的三中方式

### 第一种


```java
//创建一个单例的线程池，池中只有一个线程
ExecutorService newSingleThreadExecutor = Executors.newSingleThreadExecutor();
```

jdk底层源码

```java
public static ExecutorService newSingleThreadExecutor() {
        return new FinalizableDelegatedExecutorService
            (new ThreadPoolExecutor(1, 1,
                                    0L, TimeUnit.MILLISECONDS,
                                    new LinkedBlockingQueue<Runnable>()));
    }

```

### 第二种



```java
//创建一个固定大小的线程池
ExecutorService newFixedThreadPool = Executors.newFixedThreadPool(5);
```

底层源码

```java

public static ExecutorService newFixedThreadPool(int nThreads) {
        return new ThreadPoolExecutor(nThreads, nThreads,
                                      0L, TimeUnit.MILLISECONDS,
                                      new LinkedBlockingQueue<Runnable>());
    }

```

### 第三种

```java
//创建一个可缓存的线程池，即池中的线程数量会自动增长
ExecutorService newCachedThreadPool = Executors.newCachedThreadPool();
```

底层源码

```java
public static ExecutorService newCachedThreadPool() {
        return new ThreadPoolExecutor(0, Integer.MAX_VALUE,
                                      60L, TimeUnit.SECONDS,
                                      new SynchronousQueue<Runnable>());
    }

```


可以看到，这三种方式底层都是用 new ThreadPoolExecutor（）方法，只是其中的参数有所区别而已。
但是

在阿里开发手册中明确说明不要直接使用Executors工具类直接创建线程,其实根本原因就是某些参数 问题，所以咱么用底层 ThreadPoolExecutor 自己制定参数就行了。




![](assets/001/11/20/02-1682387050624.png)



七个参数
在ThreadPoolExecutor种有七个参数用来控制线程池。


```java
//创建一个线程池
		ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
				corePoolSize, //核心线程数
				maxPoolSize，//最大线程数
				 keepAliveTime，线程空闲时间
				allowCoreThreadTimeout，//允许核心线程超时设置，分钟，秒，毫秒等
				queueCapacity，//任务队列容量（阻塞队列）
				threadFactory,  //线程创建工厂
				rejectedExecutionHandler，//线程的拒绝策略
			);

```


七个参数说明：

corePoolSize：核心线程数

* 核心线程会一直存活，及时没有任务需要执行
* 当线程数小于核心线程数时，即使有线程空闲，线程池也会优先创建新线程处理
* 设置allowCoreThreadTimeout=true（默认false）时，核心线程会超时关闭

maxPoolSize：最大线程数

* 当线程数>=corePoolSize，且任务队列已满时。线程池会创建新线程来处理任务
* 当线程数=maxPoolSize，且任务队列已满时，线程池会采用拒绝策略(最后一个参数)

keepAliveTime：线程空闲时间

* 当阻塞队列满了或者空了达到阻塞时，等待该时间，超过该时间，自动退出。
* 当线程空闲时间达到keepAliveTime时，线程会退出，直到线程数量=corePoolSize
* 如果allowCoreThreadTimeout=true，则会直到线程数量=0

allowCoreThreadTimeout：允许核心线程超时

* 使用TimeUnit类设置

queueCapacity：任务队列容量（阻塞队列）

* 当核心线程数达到最大时，新任务会放在队列中排队等待执行

threadFactory, //线程创建工厂

* 默认一般不改变

rejectedExecutionHandler：任务拒绝策略处理器
两种情况会拒绝处理任务：

1、当线程数已经达到maxPoolSize，切队列已满，会拒绝新任务
2、 当线程池被调用shutdown()后，会等待线程池里的任务执行完毕，再shutdown。如果在调用shutdown()和线程池真正shutdown之间提交任务，会拒绝新任务




4种拒绝策略

* ThreadPoolExecutor类有几个内部实现类来处理这类情况：
* CallerRunsPolicy ： 返回原调用者执行任务,由调用execute方法提交任务的线程来执行这个任务
* AbortPolicy ： 丢弃任务，抛运行时异常 ， 默认
* DiscardPolicy ： 队列满了，抛弃任务，不抛出异常
* DiscardOldestPolicy ：队列满了，尝试去和最早的任务竞争，也不会抛出异常！去除任务队列中的第一个任务，重新提交
* 实现RejectedExecutionHandler接口，可自定义处理器


例如：使用ThreadPoolExecutor创建线程池，使用threadPoolExecutor.execute执行


```java
public class TestPool {

	public static void main(String[] args) {
		System.out.println(Runtime.getRuntime().availableProcessors());
		
		//创建一个线程池
		ThreadPoolExecutor threadPoolExecutor = new ThreadPoolExecutor(
				2, 
				5, 
				2, 
				TimeUnit.SECONDS, 
				new LinkedBlockingQueue<>(5), 
				Executors.defaultThreadFactory(),
				new ThreadPoolExecutor.DiscardOldestPolicy()
			);
		try {
			for(int i = 1; i <= 20; i++) {
				int temp = i;
				threadPoolExecutor.execute(()->{
					try {
						TimeUnit.SECONDS.sleep(1);
						System.out.println(Thread.currentThread().getName()+" = >" + temp);
					} catch (InterruptedException e) {
						e.printStackTrace();
					}
				});
			}
		}finally {
			threadPoolExecutor.shutdown();
		}
	}
}

```

## 线程池运行过程中情况描述



一个任务通过execute(Runnable)方法欲添加到线程池时
```

如果此时线程池中的数量小于corePoolSize，即使线程池中的线程都处于空闲状态，也要创建新的线程来处理被添加的任务。
如果此时线程池中的数量等于 corePoolSize，但是缓冲队列 workQueue未满，那么任务被放入缓冲队列。
如果此时线程池中的数量大于corePoolSize，缓冲队列workQueue满，并且线程池中的数量小于maximumPoolSize，建新的线程来处理被添加的任务。
如果此时线程池中的数量大于corePoolSize，缓冲队列workQueue满，并且线程池中的数量等于maximumPoolSize，那么通过 handler所指定的策略来处理此任务。
```

## 队列参数

workQueue任务队列
任务队列，被添加到线程池中，但尚未被执行的任务；它一般分为直接提交队列、有界任务队列、无界任务队列、优先任务队列几种；

### 直接切换

```
设置为SynchronousQueue队列，SynchronousQueue是一个特殊的BlockingQueue，它没有容量，没执行一个插入操作就会阻塞，需要再执行一个删除操作才会被唤醒，反之每一个删除操作也都要等待对应的插入操作。

使用SynchronousQueue队列，提交的任务不会被保存，总是会马上提交执行。如果用于执行任务的线程数量小于maximumPoolSize，则尝试创建新的进程，如果达到maximumPoolSize设置的最大值，则根据你设置的handler执行拒绝策略。因此这种方式你提交的任务不会被缓存起来，而是会被马上执行，在这种情况下，你需要对你程序的并发量有个准确的评估，才能设置合适的maximumPoolSize数量，否则很容易就会执行拒绝策略

```

### 无界队列

```
一般使用基于链表的阻塞队列LinkedBlockingQueue。使用无界任务队列，线程池的任务队列可以无限制的添加新的任务，而线程池创建的最大线程数量就是你corePoolSize设置的数量，也就是说在这种情况下maximumPoolSize这个参数是无效的，哪怕你的任务队列中缓存了很多未执行的任务，当线程池的线程数达到corePoolSize后，就不会再增加了；若后续有新的任务加入，则直接进入队列等待，当使用这种任务队列模式时，一定要注意你任务提交与处理之间的协调与控制，不然会出现队列中的任务由于无法及时处理导致一直增长，直到最后资源耗尽的问题。
```


### 使用有界队列

```

一般使用ArrayBlockingQueue。使用该方式可以将线程池的最大线程数量限制为maximumPoolSize，这样能够降低资源的消耗，但同时这种方式也使得线程池对线程的调度变得更困难，因为线程池和队列的容量都是有限的值，所以要想使线程池处理任务的吞吐率达到一个相对合理的范围，又想使线程调度相对简单，并且还要尽可能的降低线程池对资源的消耗，就需要合理的设置这两个数量。

使用ArrayBlockingQueue有界任务队列，若有新的任务需要执行时，线程池会创建新的线程，直到创建的线程数量达到corePoolSize时，则会将新的任务加入到等待队列中。若等待队列已满，即超过ArrayBlockingQueue初始化的容量，则继续创建线程，直到线程数量达到maximumPoolSize设置的最大线程数量，若大于maximumPoolSize，则执行拒绝策略。在这种情况下，线程数量的上限与有界任务队列的状态有直接关系，如果有界队列初始容量较大或者没有达到超负荷的状态，线程数将一直维持在corePoolSize以下，反之当任务队列已满时，则会以maximumPoolSize为最大线程数上限。


```

```
如果要想降低系统资源的消耗（包括CPU的使用率，操作系统资源的消耗，上下文环境切换的开销等）, 可以设置较大的队列容量和较小的线程池容量, 但这样也会降低线程处理任务的吞吐量。
如果提交的任务经常发生阻塞，那么可以考虑通过调用 setMaximumPoolSize() 方法来重新设定线程池的容量。
如果队列的容量设置的较小，通常需要将线程池的容量设置大一点，这样CPU的使用率会相对的高一些。但如果线程池的容量设置的过大，则在提交的任务数量太多的情况下，并发量会增加，那么线程之间的调度就是一个要考虑的问题，因为这样反而有可能降低处理任务的吞吐量。

```



## 处理任务的优先级为

核心线程corePoolSize、任务队列workQueue、最大线程maximumPoolSize，如果三者都满了，使用handler处理被拒绝的任务。
当线程池中的线程数量大于 corePoolSize 时，如果某线程空闲时间超过 keepAliveTime，线程将被终止。这样，线程池可以动态的调整池中的线程数。



## ThreadPoolExecutor 线程关闭

```
//平缓关闭，不允许新的线程加入，正在运行的都跑完即可关闭。
pool.shutdown();
//暴力关闭。不允许新的线程加入，且直接停到正在进行的线程。
pool.shutdownNow();
```
