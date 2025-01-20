# 无限生产 消费案例 

## 生产者消费者无限生产

```java

import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.StampedLock;

class ProductWarehouse {
    private int productCount;
    private final StampedLock stampedLock;
    private final Condition notEmpty;
    private final Condition notFull;

    public ProductWarehouse() {
        productCount = 0;
        stampedLock = new StampedLock();
        notEmpty = stampedLock.newCondition();
        notFull = stampedLock.newCondition();
    }

    public void produce() {
        while (true) {
            long stamp = stampedLock.writeLock();
            try {
                while (productCount == 100) { // 假设仓库容量为 100
                    notFull.await();
                }
                productCount++;
                System.out.println("生产者生产了一个产品，当前库存：" + productCount);
                notEmpty.signalAll();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } finally {
                stampedLock.unlockWrite(stamp);
            }
        }
    }

    public void consume() {
        while (true) {
            long stamp = stampedLock.writeLock();
            try {
                while (productCount == 0) {
                    notEmpty.await();
                }
                productCount--;
                System.out.println("消费者消费了一个产品，当前库存：" + productCount);
                notFull.signalAll();
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            } finally {
                stampedLock.unlockWrite(stamp);
            }
        }
    }
    public static void main(String[] args) {
        ProductWarehouse warehouse = new ProductWarehouse();

        // 创建多个生产者线程
        for (int i = 0; i < 5; i++) {
            new Thread(warehouse::produce).start();
        }

        // 创建多个消费者线程
        for (int i = 0; i < 5; i++) {
            new Thread(warehouse::consume).start();
        }
    }
}


```


## 添加逻辑数量小于某些值则启动生产（未测试可能会有问题）

```java
import java.util.LinkedList;
import java.util.Queue;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.StampedLock;

public class ProducerConsumerStampedLock {
    private final Queue<Integer> warehouse = new LinkedList<>();
    private final int warehouseCapacity = 10000;
    private final StampedLock stampedLock = new StampedLock();
    private final Condition notFullCondition;
    private final Condition notEmptyCondition;
    private int producerCount = 0;

    public ProducerConsumerStampedLock() {
        notFullCondition = stampedLock.newCondition();
        notEmptyCondition = stampedLock.newCondition();
    }

    public void produce() {
        long stamp = stampedLock.writeLock();
        try {
            while (warehouse.size() == warehouseCapacity || producerCount >= 10) {
                notFullCondition.await();
            }
            producerCount++;
            warehouse.add(1);
            System.out.println("Produced. Warehouse size: " + warehouse.size() + ", Producer count: " + producerCount);
            if (producerCount < 10) {
                notFullCondition.signalAll();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            producerCount--;
            stampedLock.unlockWrite(stamp);
            notEmptyCondition.signalAll();
        }
    }

    public void consume() {
        long stamp = stampedLock.writeLock();
        try {
            while (warehouse.isEmpty()) {
                notEmptyCondition.await();
            }
            warehouse.poll();
            System.out.println("Consumed. Warehouse size: " + warehouse.size());
            notFullCondition.signalAll();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            stampedLock.unlockWrite(stamp);
        }
    }

    public static void main(String[] args) {
        ProducerConsumerStampedLock pc = new ProducerConsumerStampedLock();

        // 创建多个生产者线程
        for (int i = 0; i < 20; i++) {
            new Thread(pc::produce).start();
        }

        // 创建多个消费者线程
        for (int i = 0; i < 20; i++) {
            new Thread(pc::consume).start();
        }
    }
}

```