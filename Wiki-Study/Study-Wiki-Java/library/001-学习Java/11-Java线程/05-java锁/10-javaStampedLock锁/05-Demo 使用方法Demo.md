# StampedLock


###  Demo 乐观锁

这里感觉就说了简单使用，没有涉及到真正的场景

[StampedLock详解：](https://blog.csdn.net/qq_36649893/article/details/135549861)

```java
public class CounterTest {
    public static void main(String[] args) throws InterruptedException {
        final Counter counter = new Counter();

        // 创建并启动写线程
        Thread writer = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });

        // 创建并启动读线程
        Thread reader = new Thread(() -> {
            int sum = 0;
            for (int i = 0; i < 1000; i++) {
                sum += counter.read();
            }
            System.out.println("Sum read via pessimistic lock: " + sum);
        });

        // 创建并启动乐观读线程
        Thread optimisticReader = new Thread(() -> {
            int optimisticSum = 0;
            for (int i = 0; i < 1000; i++) {
                optimisticSum += counter.optimisticRead();
            }
            System.out.println("Sum read via optimistic lock: " + optimisticSum);
        });

        // 启动所有线程
        writer.start();
        reader.start();
        optimisticReader.start();

        // 等待所有线程完成
        writer.join();
        reader.join();
        optimisticReader.join();

        // 打印最终计数器的值
        System.out.println("Final counter value: " + counter.read());
    }
}

结果：
Sum read via pessimistic lock: 999000
Sum read via optimistic lock: 990000
Final counter value: 1000

```

### Demo 修改版本（为了查看计算情况）

####  Counter 计算类

```java
@Slf4j
public class Counter {
    private int count;
    private final StampedLock lock = new StampedLock();

    public void increment() {
        long stamp = lock.writeLock();
        try {
            count++;
            log.info("加过了，count:{}，睡一秒",count);

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } finally {
            lock.unlockWrite(stamp);
        }
    }

    public int read() {
        long stamp = lock.readLock();
        try {
            return count;
        } finally {
            lock.unlockRead(stamp);
        }
    }

    public int optimisticRead() {
        long stamp = lock.tryOptimisticRead();
        int currentCount = count;

        // 检查在读取过程中是否有写操作
        if (!lock.validate(stamp)) {
            // 如果写锁已被获取，则升级为悲观读锁
            stamp = lock.readLock();
            try {
                currentCount = count;
            } finally {
                lock.unlockRead(stamp);
            }
        }
        return currentCount;
    }

}

```

#### 使用类

CounterTest
```java
@Slf4j
public class CounterTest {
    public static void main(String[] args) throws InterruptedException {
        final Counter counter = new Counter();

        // 创建并启动写线程
        Thread writer = new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                counter.increment();
            }
        });

        // 创建并启动读线程
        Thread reader = new Thread(() -> {
            int sum = 0;
            for (int i = 0; i < 10; i++) {
                int read = counter.read();
                int oldsum = sum;
                sum += read;
                log.info("悲观读：{}+{}={},睡2s",oldsum,read,sum);
                try {
                    Thread.sleep(200);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

            }
            System.out.println("Sum read via pessimistic lock: " + sum);
        });

        // 创建并启动乐观读线程
        Thread optimisticReader = new Thread(() -> {
            int optimisticSum = 0;
            for (int i = 0; i < 10; i++) {
                optimisticSum += counter.optimisticRead();
            }
            System.out.println("Sum read via optimistic lock: " + optimisticSum);
        });

        // 启动所有线程
        writer.start();
        reader.start();
        optimisticReader.start();

        // 等待所有线程完成
        writer.join();
        reader.join();
        optimisticReader.join();

        // 打印最终计数器的值
        System.out.println("Final counter value: " + counter.read());
    }

}

```
