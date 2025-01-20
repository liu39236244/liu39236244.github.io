# stampedLock 用到乐观、悲观读锁的Demo


StampedLock 写一个 Demo,要用到乐观读锁 、悲观读锁 以及他们的互相转换， 写锁也要用到，并描述场景

场景：

以下是一个使用StampedLock的示例，包括乐观读锁、悲观读锁以及写锁的使用场景：
假设有一个共享的资源，多个线程可能同时读取它，偶尔也会有线程写入它。




```java
import java.util.concurrent.locks.StampedLock;

class SharedResource {
    private int data;
    private final StampedLock stampedLock = new StampedLock();

    public int readData() {
        // 尝试获取乐观读锁
        long stamp = stampedLock.tryOptimisticRead();
        int localData = data;
        // 检查是否有写操作发生在获取乐观读锁之后
        if (!stampedLock.validate(stamp)) {
            // 有写操作，升级为悲观读锁
            stamp = stampedLock.readLock();
            try {
                localData = data;
            } finally {
                stampedLock.unlockRead(stamp);
            }
        }
        return localData;
    }

    public void writeData(int newData) {
        long stamp = stampedLock.writeLock();
        try {
            data = newData;
        } finally {
            stampedLock.unlockWrite(stamp);
        }
    }
}

public class StampedLockDemo {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();

        // 读线程
        for (int i = 0; i < 5; i++) {
            new Thread(() -> {
                int data = resource.readData();
                System.out.println("Read data: " + data);
            }).start();
        }

        // 写线程
        new Thread(() -> {
            resource.writeData(42);
            System.out.println("Wrote new data: 42");
        }).start();
    }
}

```

## 解释

```
在这个示例中：
readData方法首先尝试获取乐观读锁。如果在获取乐观读锁后没有写操作发生，就直接使用读取到的值。如果有写操作发生了，就升级为悲观读锁以确保读取到正确的值。
writeData方法使用写锁来修改共享数据。
这种场景适用于需要高效读取共享资源，同时偶尔进行写入操作的情况。乐观读锁在大多数情况下可以快速读取数据，而悲观读锁和写锁则在需要确保数据一致性的时候使用。
```

