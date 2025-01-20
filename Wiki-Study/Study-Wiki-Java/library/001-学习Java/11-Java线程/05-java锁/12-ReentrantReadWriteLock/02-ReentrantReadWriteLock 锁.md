# 

ReentrantReadWriteLock 写一个 场景demo


## Demo

```java
import java.util.concurrent.locks.ReentrantReadWriteLock;

class Resource {
    private final ReentrantReadWriteLock lock = new ReentrantReadWriteLock();
    private int value;

    public void readResource() {
        lock.readLock().lock();
        try {
            System.out.println("Reading value: " + value);
        } finally {
            lock.readLock().unlock();
        }
    }

    public void writeResource(int newValue) {
        lock.writeLock().lock();
        try {
            value = newValue;
            System.out.println("Wrote new value: " + value);
        } finally {
            lock.writeLock().unlock();
        }
    }
}

public class ReentrantReadWriteLockDemo {
    public static void main(String[] args) {
        Resource resource = new Resource();

        // 多个读线程
        for (int i = 0; i < 5; i++) {
            new Thread(resource::readResource).start();
        }

        // 写线程
        new Thread(() -> resource.writeResource(42)).start();

        // 更多读线程
        for (int i = 0; i < 5; i++) {
            new Thread(resource::readResource).start();
        }
    }
}
```
