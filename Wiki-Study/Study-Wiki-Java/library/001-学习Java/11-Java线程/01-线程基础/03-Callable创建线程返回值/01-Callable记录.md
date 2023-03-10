###  说一下 runnable 和 callable 有什么区别


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


#### 10.8.1 案例 callable 获取线程返回值

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
