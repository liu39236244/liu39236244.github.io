# reentrantLock  与  reentrantreadwritelock


## 一、功能特性

ReentrantLock：提供了与synchronized类似的互斥锁功能，可以确保在同一时间只有一个线程能够进入被锁保护的代码块。
ReentrantReadWriteLock：实现了读写锁分离，允许多个线程同时读取共享资源（只要没有线程在写），而在写操作时需要独占访问。这对于读多写少的场景可以提高并发性能。

## 二、锁的类型


```
ReentrantLock：是一种排他锁（互斥锁），同一时间只能被一个线程持有。
ReentrantReadWriteLock：包含两种类型的锁，读锁和写锁。多个线程可以同时持有读锁，而写锁是排他的。
```

##  三、性能表现

```
在读操作远远多于写操作的场景下，ReentrantReadWriteLock可能会比ReentrantLock性能更好，因为它允许多个线程同时读取，减少了线程等待的时间。
但如果读写操作比较均衡或者写操作比较频繁，ReentrantReadWriteLock由于其复杂性可能并不会带来性能优势，甚至可能比ReentrantLock性能更差。
```

## 四、使用场景

```
ReentrantLock：适用于简单的同步场景，或者需要中断等待锁、尝试获取锁等高级功能的场景。
ReentrantReadWriteLock：适用于读多写少的场景，例如缓存系统、数据库连接池等，其中读操作频繁且不希望读操作被写操作频繁阻塞。
```