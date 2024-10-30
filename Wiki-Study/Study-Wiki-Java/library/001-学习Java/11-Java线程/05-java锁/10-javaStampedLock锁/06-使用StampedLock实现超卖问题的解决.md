##  stampedLock 锁




## 以下是使用StampedLock（一种支持乐观读锁和悲观锁的锁实现）解决超卖问题的示例代码：



```java
@Slf4j
public class TicketSellingSystem {
    // 记录当前票数
    private final AtomicInteger ticketsLeft;
    private final StampedLock lock = new StampedLock();

    public TicketSellingSystem(int initialTickets) {
        ticketsLeft = new AtomicInteger(initialTickets);
    }
    /**
     * @Author: shenyabo
     * @Date: Create in 2024/10/17 10:34
     * @Description: 卖票方法；  如果票有剩余，则返回true ，且同时将票 -1
     * @Params: []
     * @Return: boolean
     */
    public boolean sellTicket() {

        long stamp = lock.writeLock();
        try {
            if (ticketsLeft.get() > 0) {
                /**
                 * 将值-1
                 */
                log.info("原本{}张， 卖{}张，还剩下{}", ticketsLeft.get(), 1, ticketsLeft.decrementAndGet());
                return true;
            }
            return false;
        } finally {
            lock.unlockWrite(stamp);
        }
    }
    /**
     * @Author: shenyabo
     * @Date: Create in 2024/10/17 10:33
     * @Description:  获取剩余票数
     * @Params: []
     * @Return: int
     */
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

    public static void main(String[] args) {
        TicketSellingSystem ticketSystem = new TicketSellingSystem(10);
        for (int i = 0; i < 15; i++) {
            new Thread(() -> {
                if (ticketSystem.sellTicket()) {
                    System.out.println("Sold a ticket. Tickets left: " + ticketSystem.getTicketsLeft());
                } else {
                    System.out.println("No tickets available.");
                }
            }).start();
        }
    }
}


结果：


2024-10-17 11:21:42 [Thread-1] INFO  TicketSellingSystem
 - 原本10张， 卖1张，还剩下9
2024-10-17 11:21:42 [Thread-13] INFO  TicketSellingSystem
 - 原本9张， 卖1张，还剩下8
Sold a ticket. Tickets left: 8
2024-10-17 11:21:42 [Thread-9] INFO  TicketSellingSystem
 - 原本8张， 卖1张，还剩下7
Sold a ticket. Tickets left: 7
2024-10-17 11:21:42 [Thread-5] INFO  TicketSellingSystem
 - 原本7张， 卖1张，还剩下6
Sold a ticket. Tickets left: 6
2024-10-17 11:21:42 [Thread-12] INFO  TicketSellingSystem
 - 原本6张， 卖1张，还剩下5
Sold a ticket. Tickets left: 5
2024-10-17 11:21:42 [Thread-6] INFO  TicketSellingSystem
 - 原本5张， 卖1张，还剩下4
Sold a ticket. Tickets left: 4
2024-10-17 11:21:42 [Thread-8] INFO  TicketSellingSystem
 - 原本4张， 卖1张，还剩下3
Sold a ticket. Tickets left: 3
2024-10-17 11:21:42 [Thread-0] INFO  TicketSellingSystem
 - 原本3张， 卖1张，还剩下2
Sold a ticket. Tickets left: 2
2024-10-17 11:21:42 [Thread-7] INFO  TicketSellingSystem
 - 原本2张， 卖1张，还剩下1
Sold a ticket. Tickets left: 1
2024-10-17 11:21:42 [Thread-2] INFO  TicketSellingSystem
 - 原本1张， 卖1张，还剩下0
Sold a ticket. Tickets left: 0
No tickets available.
No tickets available.
Sold a ticket. Tickets left: 0
No tickets available.
No tickets available.
No tickets available.


```





## 如何实现票不够的时候重新生成票然后在卖呢


