# Redis主从架构锁失效问题及Redlock详解

## 所以针对上一节分布式锁解决redis 高并发下双写不一致问题的最终极方案是什么？ 读写锁

读写锁，读写锁读写锁。


> 1 读锁代码


![](assets/000/01/02/04/07-1610787699638.png)


> 2 写锁代码块
![](assets/000/01/02/04/07-1610787770458.png)


底层执行redis 脚本都是lua 脚本的 (lua 脚本执行是原子操作，不用担心多个语句原子一致问题)

读锁与读锁之间不会互斥，但是 写锁与 读、写 锁都会互斥； 


*注意，如果写也多那么这里用到读写锁就跟分布式锁没什么区别了，那么应该怎么办呢？*
