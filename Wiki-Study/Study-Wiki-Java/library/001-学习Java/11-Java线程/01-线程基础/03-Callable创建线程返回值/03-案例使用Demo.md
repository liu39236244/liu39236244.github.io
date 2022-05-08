# Callable 基本使用

## 基本使用

```java
public class CallableTest {
    public static void main(String[] args) throws ExecutionException, InterruptedException {
        ExecutorService executorService=Executors.newCachedThreadPool();
        Future<String> submit = executorService.submit(new TaskCallable());
        System.out.println("1.主程序开始执行");
        String result = submit.get();
        System.out.println("2.主程序继续执行");
        System.out.println(result);
 
    }
}
class TaskCallable implements Callable<String> {
 
    @Override
    public String call() throws Exception {
        System.out.println("3.正在执行任务，需要等待五秒，执行任务开始");
        Thread.sleep(5000);
        System.out.println("4.正在执行任务，需要等待五秒，执行任务结束");
        return "任务执行完成";
    }

```

### 执行结果

![](assets/001/11/01/03/03-1651917854595.gif)

## Callable 创建多个线程，获取每个线程结果进行操作，不按照任务创建顺序


### 学生类

```java
package com.test;

import lombok.Data;

/**
 * @author : shenyabo
 * @date : Created in 2022-05-07 17:47
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Data
public class Student {
    private int id;
    private String name;
    private int age;
    private int sleepTime;

}

```

### 测试类

```java
package com.test;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.LinkedBlockingDeque;

/**
 * 将Executor和BlockingQueue功能融合在一起，可以将Callable的任务提交给它来执行， 然后使用take()方法获得已经完成的结果
 *
 * @author zhy
 */
public class CompletionServiceDemo {

    public static void main(String[] args) throws InterruptedException,
            ExecutionException {
        /**
         * 内部维护11个线程的线程池
         */
        ExecutorService exec = Executors.newFixedThreadPool(11);
        /**
         * 容量为10的阻塞队列
         */
        final BlockingQueue<Future<Student>> queue = new LinkedBlockingDeque<Future<Student>>(
                10);
        //实例化CompletionService
        final CompletionService<Student> completionService = new ExecutorCompletionService<Student>(
                exec, queue);

        List<Student> students = new ArrayList<Student>();

        for (int i = 0; i < 5; i++) {
            Student stu = new Student();
            stu.setId(i+1);
            stu.setName("小明("+(i+1)+")");
            stu.setAge((i+1));
            students.add(stu);
        }
        students.forEach(System.out::println);
        /**
         * 模拟瞬间产生10个任务，且每个任务执行时间不一致
         */
        System.out.println("1： ------------------------ 创建循环多线程任务之前");
        for (Student student : students) {
            completionService.submit(new Callable<Student>() {
                @Override
                public Student call() throws Exception {
                    int ran = new Random().nextInt(3000);
                    student.setSleepTime(ran);
                    Thread.sleep(ran);
                    System.out.println(Thread.currentThread().getName()
                            + " 休息了 " + ran);
                    return student;
                }
            });
        }

        System.out.println("2： ------------------------ 循环方法体后");
        /**
         * 立即输出结果
         */
        for (int i = 0; i < students.size(); i++) {
            try {
                //谁最先执行完成，直接返回
                Future<Student> f = completionService.take();
                System.out.println(f.get()+"第"+(i+1)+"个完成任务，睡眠了"+f.get().getSleepTime()+"毫秒");
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            }
        }

        System.out.println("3： ------------------------ shutdown之前");

        exec.shutdown();


        System.out.println("4： ------------------------ shutdown之后");

    }

}
```

### 返回结果

```
Student(id=1, name=小明(1), age=1, sleepTime=0)
Student(id=2, name=小明(2), age=2, sleepTime=0)
Student(id=3, name=小明(3), age=3, sleepTime=0)
Student(id=4, name=小明(4), age=4, sleepTime=0)
Student(id=5, name=小明(5), age=5, sleepTime=0)
1： ------------------------ 创建循环多线程任务之前
2： ------------------------ 循环方法体后
pool-1-thread-2 休息了 460
Student(id=2, name=小明(2), age=2, sleepTime=460)第1个完成任务，睡眠了460毫秒
pool-1-thread-4 休息了 882
Student(id=4, name=小明(4), age=4, sleepTime=882)第2个完成任务，睡眠了882毫秒
pool-1-thread-3 休息了 1137
Student(id=3, name=小明(3), age=3, sleepTime=1137)第3个完成任务，睡眠了1137毫秒
pool-1-thread-1 休息了 2021
Student(id=1, name=小明(1), age=1, sleepTime=2021)第4个完成任务，睡眠了2021毫秒
pool-1-thread-5 休息了 2950
Student(id=5, name=小明(5), age=5, sleepTime=2950)第5个完成任务，睡眠了2950毫秒
3： ------------------------ shutdown之前
4： ------------------------ shutdown之后
```