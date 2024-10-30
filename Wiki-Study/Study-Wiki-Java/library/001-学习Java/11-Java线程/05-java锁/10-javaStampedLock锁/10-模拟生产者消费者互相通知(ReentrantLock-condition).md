

# 以下是一个使用ReentrantLock和Condition实现高并发下的自动生产和消费的简单示例。


```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;
 
public class ConditionProducerConsumer {
 
    private int buffer = 0;
    private final ReentrantLock lock = new ReentrantLock();
    private final Condition notFull = lock.newCondition();
    private final Condition notEmpty = lock.newCondition();
 
    public void produce() throws InterruptedException {
        lock.lock();
        try {
            while (buffer >= 10) { // 假设缓冲区大小为10
                System.out.println("缓冲区满，生产者等待...");
                notFull.await();
            }
            buffer++;
            Thread.sleep(1000); // 模拟生产时间
            System.out.println("生产者生产了一个产品，现有产品数量：" + buffer);
            notEmpty.signalAll();
        } finally {
            lock.unlock();
        }
    }
 
    public void consume() throws InterruptedException {
        lock.lock();
        try {
            while (buffer <= 0) {
                System.out.println("缓冲区空，消费者等待...");
                notEmpty.await();
            }
            buffer--;
            Thread.sleep(1000); // 模拟消费时间
            System.out.println("消费者消费了一个产品，现有产品数量：" + buffer);
            notFull.signalAll();
        } finally {
            lock.unlock();
        }
    }
 
    public static void main(String[] args) {
        ConditionProducerConsumer example = new ConditionProducerConsumer();
 
        Runnable producer = () -> {
            try {
                example.produce();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };
 
        Runnable consumer = () -> {
            try {
                example.consume();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        };
 
        // 模拟并发执行
        for (int i = 0; i < 10; i++) {
            new Thread(producer).start();
            new Thread(consumer).start();
        }
    }
}
```
