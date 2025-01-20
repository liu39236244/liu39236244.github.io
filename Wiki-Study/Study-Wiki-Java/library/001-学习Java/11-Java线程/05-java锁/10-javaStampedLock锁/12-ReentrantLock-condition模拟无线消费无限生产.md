# 

## 代码


```
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

/**
 * @author : shenyabo
 * @date : Created in 2024-10-25 14:25
 * @description :
 * @modified By :
 * @version: : v1.0
 */
public class ProductWarehouse {
    private int productCount;
    private final ReentrantLock lock;
    private final Condition notEmpty;
    private final Condition notFull;

    public ProductWarehouse(int capacity) {
        productCount = 0;
        lock = new ReentrantLock();
        notEmpty = lock.newCondition();
        notFull = lock.newCondition();
    }

    public void produce() {
        while (true) {
            lock.lock();
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
                lock.unlock();
            }
        }
    }

    public void consume() {
        while (true) {
            lock.lock();
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
                lock.unlock();
            }
        }
    }

    public static void main(String[] args) {
        ProductWarehouse warehouse = new ProductWarehouse(100);

        // 创建多个生产者线程
        for (int i = 0; i < 101; i++) {
            new Thread(warehouse::produce).start();
        }

        // 创建多个消费者线程
        for (int i = 0; i < 102; i++) {
            new Thread(warehouse::consume).start();
        }
    }
}


```