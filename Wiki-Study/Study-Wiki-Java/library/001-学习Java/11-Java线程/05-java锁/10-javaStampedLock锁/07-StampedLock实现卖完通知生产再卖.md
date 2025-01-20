## StampedLock实现卖完通知生产再卖


## 改变之后代码如下：

在这个版本中，引入了一个ReentrantLock和Condition来实现当没票时通知生产票的功能。当售票时发现没票，会通知生产票的线程，生产票的线程会等待直到没票了再进行生产。

```java
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class TicketSellingSystem {
    private final AtomicInteger ticketsLeft;
    private final StampedLock lock = new StampedLock();
    private final ReentrantLock productionLock = new ReentrantLock();
    private final Condition noTicketsCondition = productionLock.newCondition();

    public TicketSellingSystem(int initialTickets) {
        ticketsLeft = new AtomicInteger(initialTickets);
    }

    public boolean sellTicket() {
        while (true) {
            long stamp = lock.writeLock();
            try {
                if (ticketsLeft.get() > 0) {
                    ticketsLeft.decrementAndGet();
                    return true;
                } else {
                    // 没票了，通知生产票
                    productionLock.lock();
                    try {
                        noTicketsCondition.signal();
                    } finally {
                        productionLock.unlock();
                    }
                    return false;
                }
            } finally {
                lock.unlockWrite(stamp);
            }
        }
    }

    public void produceTickets(int count) {
        productionLock.lock();
        try {
            while (ticketsLeft.get() > 0) {
                // 如果还有票，等待直到没票了再生产
                noTicketsCondition.await();
            }
            ticketsLeft.addAndGet(count);
            System.out.println("Produced " + count + " tickets. Tickets left: " + ticketsLeft.get());
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            productionLock.unlock();
        }
    }

    public int getTicketsLeft() {
        long stamp = lock.tryOptimisticRead();
        int currentTickets = ticketsLeft.get();
        if (!lock.validate(stamp)) {
            stamp = lock.readLock();
            try {
                currentTickets = ticketsLeft.get();
            } finally {
                lock.unlockRead(stamp);
            }
        }
        return currentTickets;
    }
}

public class Main {
    public static void main(String[] args) {
        TicketSellingSystem ticketSystem = new TicketSellingSystem(10);
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                if (ticketSystem.sellTicket()) {
                    System.out.println("Sold a ticket. Tickets left: " + ticketSystem.getTicketsLeft());
                } else {
                    System.out.println("No tickets available.");
                }
            }).start();
        }

        // 模拟生产票
        new Thread(() -> {
            try {
                Thread.sleep(5000);
                ticketSystem.produceTickets(5);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }).start();
    }
}
```


