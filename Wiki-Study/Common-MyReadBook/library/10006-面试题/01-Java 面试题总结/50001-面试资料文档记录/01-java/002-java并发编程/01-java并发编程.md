java 并发编程123 道




# 基础知识

## 1 为什么使用并发编程

提升多核CPU的利用率：一般来说一台主机上的会有多个CPU核心，我们可以创建多个线程，理论上讲操作系统可以将多个线程分配给不同的CPU去执行，每个CPU执行一个线程，这样就提高了CPU的使用效率，如果使用单线程就只能有一个CPU核心被使用。


比如当我们在网上购物时，为了提升响应速度，需要拆分，减库存，生成订单等等这些操作，就可以进行拆分利用多线程的技术完成。

面对复杂业务模型，并行程序会比串行程序更适应业务需求，而并发编程更能吻合这种业务拆分 。

    简单来说就是：
        充分利用多核CPU的计算能力；
        方便进行业务拆分，提升应用性能

## 2 多线程应用场景

例如: 迅雷多线程下载、数据库连接池、分批发送短信等。


##  3 并发编程有什么缺点

并发编程的目的就是为了能提高程序的执行效率，提高程序运行速度，但是并发编程并不总是能提
高程序运行速度的，而且并发编程可能会遇到很多问题，比如：内存泄漏、上下文切换、线程安
全、死锁等问题。


    并发编程三个必要因素是什么？

        原子性：原子，即一个不可再被分割的颗粒。原子性指的是一个或多个操作要么全部执行成功要么全部执行失败。

        可见性：一个线程对共享变量的修改,另一个线程能够立刻看到。（synchronized,volatile）

        有序性：程序执行的顺序按照代码的先后顺序执行。（处理器可能会对指令进行重排序）


## 4 Java 程序中怎么保证多线程的运行安全？


    出现线程安全问题的原因一般都是三个原因：

    1 线程切换带来的原子性问题 

        解决办法：使用多线程之间同步synchronized或使用锁(lock)。

    2 缓存导致的可见性问题 

        解决办法：synchronized、volatile、LOCK，可以解决可见性问题

    3 编译优化带来的有序性问题 

        解决办法：Happens-Before 规则可以解决有序性问题


## 5 并行、并发什么区别

并发：多个任务在同一个 CPU 核上，按细分的时间片轮流(交替)执行，从逻辑上来看那些任务是同时执行。

并行：单位时间内，多个处理器或多核处理器同时处理多个任务，是真正意义上的“同时进行”。

串行：有n个任务，由一个线程按顺序执行。由于任务、方法都在一个线程执行所以不存在线程不安全情况，也就不存在临界区的问题。

做一个形象的比喻：

    并发 = 俩个人用一台电脑。
    并行 = 俩个人分配了俩台电脑。
    串行 = 俩个人排队使用一台电脑。



## 6 多线程的好处

可以提高 CPU 的利用率。在多线程程序中，一个线程必须等待的时候，CPU 可以运行其它的线程而不是等待，这样就大大提高了程序的效率。也就是说允许单个程序创建多个并行执行的线程来完成各自的任务。

## 7 多线程的劣势：

1 线程也是程序，所以线程需要占用内存，线程越多占用内存也越多；

2 多线程需要协调和管理，所以需要 CPU 时间跟踪线程；

3 线程之间对共享资源的访问会相互影响，必须解决竞用共享资源的问题。


## 8 线程和进程区别


### 8.1 什么是线程和进程?

进程

    一个在内存中运行的应用程序。 每个正在系统上运行的程序都是一个进程

线程

    进程中的一个执行任务（控制单元）， 它负责在程序里独立执行。
    
* 一个进程至少有一个线程，一个进程可以运行多个线程，多个线程可共享数据。


### 8.2 进程与线程的区别

```
根本区别：进程是操作系统资源分配的基本单位，而线程是处理器任务调度和执行的基本单
位

资源开销：每个进程都有独立的代码和数据空间（程序上下文），程序之间的切换会有较大的开销；线程可以看做轻量级的进程，同一类线程共享代码和数据空间，每个线程都有自己独立的运行栈和程序计数器（PC），线程之间切换的开销小。

包含关系：如果一个进程内有多个线程，则执行过程不是一条线的，而是多条线（线程）共同完成的；线程是进程的一部分，所以线程也被称为轻权进程或者轻量级进程。

内存分配：同一进程的线程共享本进程的地址空间和资源，而进程与进程之间的地址空间和
资源是相互独立的

影响关系：一个进程崩溃后，在保护模式下不会对其他进程产生影响，但是一个线程崩溃有可能导致整个进程都死掉。所以多进程要比多线程健壮。

执行过程：每个独立的进程有程序运行的入口、顺序执行序列和程序出口。但是线程不能独
立执行，必须依存在应用程序中，由应用程序提供多个线程执行控制，两者均可并发执行

```

## 9 什么是上下文切换



```
多线程编程中一般线程的个数都大于 CPU 核心的个数，而一个 CPU 核心在任意时刻只能被一个线
程使用，为了让这些线程都能得到有效执行，CPU 采取的策略是为每个线程分配时间片并轮转的
形式。当一个线程的时间片用完的时候就会重新处于就绪状态让给其他线程使用，这个过程就属于
一次上下文切换。

概括来说就是：当前任务在执行完 CPU 时间片切换到另一个任务之前会先保存自己的状态，以便
下次再切换回这个任务时，可以再加载这个任务的状态。任务从保存到再加载的过程就是一次上下
文切换。

上下文切换通常是计算密集型的。也就是说，它需要相当可观的处理器时间，在每秒几十上百次的
切换中，每次切换都需要纳秒量级的时间。所以，上下文切换对系统来说意味着消耗大量的 CPU
时间，事实上，可能是操作系统中时间消耗最大的操作。

Linux 相比与其他操作系统（包括其他类 Unix 系统）有很多的优点，其中有一项就是，其上下文
切换和模式切换的时间消耗非常少。
```

## 10 守护线程和用户线程有什么区别呢？

用户 (User) 线程：运行在前台，执行具体的任务，如程序的主线程、连接网络的子线程等都是用户线程;
如果没有特殊设定,默认我们new出来的都是用户线程,每一个用户线程都是相互独立的.


守护 (Daemon) 线程：运行在后台，为其他前台线程服务。也可以说守护线程是 JVM 中非守护线程的 “佣人”。一旦所有用户线程都结束运行，守护线程会随 JVM 一起结束工作;一般为系统线程,比如Java中的垃圾回收线程,是为用户线程服务的,当所有的用户线程执行完毕后,守护线程会自动结束.


### 10.1 如何判断是否为守护线程 以及 如何线程修改为守护线程


#### 1 判断一个线程是否为守护线程
true为守护线程,false为用户线程

![](assets/10006/01/50001/01/002/01-1673228679765.png)


#### 2 代码演示

##### 2.1 用户线程

![](assets/10006/01/50001/01/002/01-1673228727441.png)

以看到,我们new出来的线程都是用户线程,并且程序不会被中止,会一直在运行.


##### 2.2 守护线程

当其设置为守护线程后,即使没有运行完毕,程序也会中止,因为守护线程是为用户线程服务的.

![](assets/10006/01/50001/01/002/01-1673229044711.png)


### 10.2 总结

1.守护线程是为用户线程服务的,如果所有的用户线程已经执行完毕,那么守护线程会随着JVM一同结束工作.

2.我们可以跟据需要设置一个线程为守护或用户线程.


windows上面用任务管理器看，linux下可以用 top 这个工具看。

找出cpu耗用厉害的进程pid， 终端执行top命令，然后按下shift+p (shift+m是找出消耗内存
最高)查找出cpu利用最厉害的pid号根据上面第一步拿到的pid号，top -H -p pid 。然后按下shift+p，查找出cpu利用率最厉害的
线程号，比如top -H -p 1328

将获取到的线程号转换成16进制，去百度转换一下就行
使用jstack工具将进程信息打印输出，jstack pid号 > /tmp/t.dat，比如jstack 31365 > /tmp/t.dat

编辑/tmp/t.dat文件，查找线程号对应的信息，或者直接使用JDK自带的工具查看“jconsole” 、“visualVm”，这都是JDK自带的，可以直接在JDK的bin目录
下找到直接使用

### 10.3  什么是线程死锁


死锁是指两个或两个以上的进程（线程）在执行过程中，由于竞争资源或者由于彼此通信而造成的
一种阻塞的现象，若无外力作用，它们都将无法推进下去。

此时称系统处于死锁状态或系统产生了死锁，这些永远在互相等待的进程（线程）称为死锁进程（线程）。多个线程同时被阻塞，它们中的一个或者全部都在等待某个资源被释放。由于线程被无限期地阻塞，因此程序不可能正常终止。

如下图所示，线程 A 持有资源 2，线程 B 持有资源 1，他们同时都想申请对方的资源，所以这两个线程就会互相等待而进入死锁状态。


![](assets/10006/01/50001/01/002/01-1673232172822.png)


### 10.4 形成死锁的四个必要条件是什么

互斥条件：在一段时间内某资源只由一个进程占用。如果此时还有其它进程请求资源，就只能等待，直至占有资源的进程用毕释放。

占有且等待条件：指进程已经保持至少一个资源，但又提出了新的资源请求，而该资源已被其它进程占有，此时请求进程阻塞，但又对自己已获得的其它资源保持不放。

不可抢占条件：别人已经占有了某项资源，你不能因为自己也需要该资源，就去把别人的资源抢过来。

循环等待条件：若干进程之间形成一种头尾相接的循环等待资源关系。（比如一个进程集合，A在等B，B在等C，C在等A）


### 10.5  如何避免线程死锁1. 避免一个线程同时获得多个锁

1. 避免一个线程在锁内同时占用多个资源，尽量保证每个锁只占用一个资源
 
2. 尝试使用定时锁，使用lock.tryLock(timeout)来替代使用内部锁机制


## 11 java创建线程的基本的四种方法

### 11.1 继承 Thread 类；

继承 Thread 类；


![](assets/10006/01/50001/01/002/01-1673232532545.png)

### 11.2 实现 Runnable 接口；

实现 Runnable 接口；

![](assets/10006/01/50001/01/002/01-1673232556797.png)


### 11.3 实现 Callable 接口；

实现 Callable 接口；


![](assets/10006/01/50001/01/002/01-1673232604162.png)


### 11.4 使用匿名内部类方式

使用匿名内部类方式


![](assets/10006/01/50001/01/002/01-1673232624529.png)

### 11.5  说一下 runnable 和 callable 有什么区别


* 1 相同点：

都是接口
都可以编写多线程程序
都采用Thread.start()启动线程

* 2 主要区别：

Runnable 接口 run 方法无返回值；Callable 接口 call 方法有返回值，是个泛型，和Future、
FutureTask配合可以用来获取异步执行的结果


Runnable 接口 run 方法只能抛出运行时异常，且无法捕获处理；Callable 接口 call 方法允许抛出
异常，可以获取异常信息 注：Callalbe接口支持返回执行结果，需要调用FutureTask.get()得到，
此方法会阻塞主进程的继续往下执行，如果不调用不会阻塞。


#### 11.5.1 案例 callable 获取线程返回值

##### 1 参考

参考原文：https://blog.csdn.net/m0_37899908/article/details/126275706

![](assets/10006/01/50001/01/002/01-1673235146929.png)

明显能看到区别：

1.Callable能接受一个泛型，然后在call方法中返回一个这个类型的值。而Runnable的run方法没有返回值
2.Callable的call方法可以抛出异常，而Runnable的run方法不会抛出异常。


Future
返回值Future也是一个接口，通过他可以获得任务执行的返回值。

接口定义如下：

```java
public interface Future<V> {
    boolean cancel(boolean var1);

    boolean isCancelled();

    boolean isDone();

    V get() throws InterruptedException, ExecutionException;

    V get(long var1, TimeUnit var3) throws InterruptedException, ExecutionException, TimeoutException;
}

```
其中的get方法获取的就是返回值。


```java

public class Main {
　　public static void main(String[] args) throws InterruptedException, ExecutionException {
　　ExecutorService executor = Executors.newFixedThreadPool(2);
　　//创建一个Callable，3秒后返回String类型
　　Callable myCallable = new Callable() {
　　　　@Override
　　　　public String call() throws Exception {
　　　　　　Thread.sleep(3000);
　　　　　　System.out.println("calld方法执行了");
　　　　　　return "call方法返回值";
　　　　}
　　};
　　System.out.println("提交任务之前 "+getStringDate());
　　Future future = executor.submit(myCallable);
　　System.out.println("提交任务之后，获取结果之前 "+getStringDate());
　　System.out.println("获取返回值: "+future.get());
　　System.out.println("获取到结果之后 "+getStringDate());
　　}
　　public static String getStringDate() {
　　　　Date currentTime = new Date();
　　　　SimpleDateFormat formatter = new SimpleDateFormat("HH:mm:ss");
　　　　String dateString = formatter.format(currentTime);
　　　　return dateString;
　　　　}
　　}

```

通过executor.submit提交一个Callable，返回一个Future，然后通过这个Future的get方法取得返回值。

执行结果：

```
提交任务之前 12:13:01
提交任务之后，获取结果之前 12:13:01
calld方法执行了
获取返回值: call方法返回值
获取到结果之后 12:13:04
```

##### 2 get()方法的阻塞性

通过上面的输出可以看到，在调用submit提交任务之后，主线程本来是继续运行了。但是运行到future.get()的时候就阻塞住了，一直等到任务执行完毕，拿到了返回的返回值，主线程才会继续运行。

这里注意一下，他的阻塞性是因为调用get()方法时，任务还没有执行完，所以会一直等到任务完成，形成了阻塞。

任务是在调用submit方法时就开始执行了，如果在调用get()方法时，任务已经执行完毕，那么就不会造成阻塞。

下面在调用方法前先睡4秒，这时就能马上得到返回值。

```java
System.out.println("提交任务之前 "+getStringDate());
Future future = executor.submit(myCallable);
System.out.println("提交任务之后 "+getStringDate());
Thread.sleep(4000);
System.out.println("已经睡了4秒,开始获取结果 "+getStringDate());
System.out.println("获取返回值: "+future.get());
System.out.println("获取到结果之后 "+getStringDate());

```

结果如下

```
提交任务之前 12:36:04
提交任务之后 12:36:04
calld方法执行了
已经睡了4秒,开始获取结果 12:36:08
获取返回值: call方法返回值
获取到结果之后 12:36:08
```


同样的原因，submit两个任务时，总阻塞时间是最长的那个。

下面看下有多个个任务，一个3秒，一个5秒。


```java
Callable myCallable = new Callable() {
　　@Override
　　public String call() throws Exception {
　　Thread.sleep(5000);
　　System.out.println("calld方法执行了");
　　return "call方法返回值";
　　}
};
Callable myCallable2 = new Callable() {
　　@Override
　　public String call() throws Exception {
　　Thread.sleep(3000);
　　System.out.println("calld2方法执行了");
　　return "call2方法返回值";
　　}
};
System.out.println("提交任务之前 "+getStringDate());
Future future = executor.submit(myCallable);
Future future2 = executor.submit(myCallable2);
System.out.println("提交任务之后 "+getStringDate());
System.out.println("开始获取第一个返回值 "+getStringDate());
System.out.println("获取返回值: "+future.get());
System.out.println("获取第一个返回值结束，开始获取第二个返回值 "+getStringDate());
System.out.println("获取返回值2: "+future2.get());
System.out.println("获取第二个返回值结束 "+getStringDate());

```

结果

```
提交任务之前 14:14:47
提交任务之后 14:14:48
开始获取第一个返回值 14:14:48
calld2方法执行了
calld方法执行了
获取返回值: call方法返回值
获取第一个返回值结束，开始获取第二个返回值 14:14:53
获取返回值2: call2方法返回值
获取第二个返回值结束 14:14:53

```


获取第一个结果阻塞了5秒，所以获取第二个结果立马就得到了。

### 10.6 Java线程间通信&&进程间通信

[原文博客地址：](https://blog.csdn.net/qq_44146560/article/details/123808595?spm=1001.2101.3001.6650.5&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-123808595-blog-116031799.pc_relevant_multi_platform_whitelistv4&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-5-123808595-blog-116031799.pc_relevant_multi_platform_whitelistv4&utm_relevant_index=10)





### 11.6 线程的 run()和 start()有什么区别？

* 1 每个线程都是通过某个特定Thread对象所对应的方法run()来完成其操作的，run()方法称为线程体。通过调用Thread类的start()方法来启动一个线程。

* 2 start() 方法用于启动线程，run() 方法用于执行线程的运行时代码。run() 可以重复调用，而 start()只能调用一次。


* 3 start()方法来启动一个线程，真正实现了多线程运行。调用start()方法无需等待run方法体代码执行完毕，可以直接继续执行其他的代码； 此时线程是处于就绪状态，并没有运行。 然后通过此Thread类调用方法run()来完成其运行状态， run()方法运行结束， 此线程终止。然后CPU再调度其它线程。

* 4 run()方法是在本线程里的，只是线程里的一个函数，而不是多线程的。 如果直接调用run()，其实就相当于是调用了一个普通函数而已，直接待用run()方法必须等待run()方法执行完毕才能执行下面的代码，所以执行路径还是只有一条，根本就没有线程的特征，所以在多线程执行时要使用
start()方法而不是run()方法。


### 11.7 为什么我们调用 start() 方法时会执行 run() 方法，为什么我们不能直接调用

run() 方法？这是另一个非常经典的 java 多线程面试问题，而且在面试中会经常被问到。很简单，但是很多人都会答不上来！

```

new 一个 Thread，线程进入了新建状态。调用 start() 方法，会启动一个线程并使线程进入了就绪
状态，当分配到 时间片 后就可以开始运行了。 start() 会执行线程的相应准备工作，然后自动执行
run() 方法的内容，这是真正的多线程工作。

而直接执行 run() 方法，会把 run 方法当成一个 main 线程下的普通方法去执行，并不会在某个线
程中执行它，所以这并不是多线程工作。
```

总结： 调用 start 方法方可启动线程并使线程进入就绪状态，而 run 方法只是 thread 的一个普通方法调用，还是在主线程里执行。


### 11.8  什么是 Callable 和 Future?

Callable 接口类似于 Runnable，从名字就可以看出来了，但是 Runnable 不会返回结果，并且无法抛出返回结果的异常，而 Callable 功能更强大一些，被线程执行后，可以返回值，这个返回值可以被 Future 拿到，也就是说，Future 可以拿到异步执行任务的返回值。

Future 接口表示异步任务，是一个可能还没有完成的异步任务的结果。所以说 Callable用于产生
结果，Future 用于获取结果。


### 11.9  什么是 FutureTask

FutureTask 表示一个异步运算的任务。FutureTask 里面可以传入一个 Callable 的具体实现类，可以对这个异步运算的任务的结果进行等待获取、判断是否已经完成、取消任务等操作。只有当运算完成的时候结果才能取回，如果运算尚未完成 get 方法将会阻塞。一个 FutureTask 对象可以对调用了 Callable 和 Runnable 的对象进行包装，由于 FutureTask 也是Runnable 接口的实现类，所以 FutureTask 也可以放入线程池中。

[FutureTask 使用详解，博客参考](https://www.cnblogs.com/kelelipeng/p/16331015.html)

[FutureTask介绍以及使用](https://blog.csdn.net/ywb201314/article/details/123548108)


[FutureTask的用法及两种经常使用的使用场景](https://blog.csdn.net/shengxiaohua1/article/details/120702347)



#### 11.9.1 future 简单使用


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


## 12 线程的状态

![](assets/10006/01/50001/01/002/01-1673248888747.png)


![](assets/10006/01/50001/01/002/01-1673249005340.png)


