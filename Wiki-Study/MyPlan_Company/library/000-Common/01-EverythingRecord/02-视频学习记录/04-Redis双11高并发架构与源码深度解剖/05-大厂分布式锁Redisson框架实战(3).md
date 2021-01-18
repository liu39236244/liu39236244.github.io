# 大厂分布式锁Redisson框架实战

视频地址：https://ke.qq.com/user/index/index.html#/plan/cid=2738425&term_id=103295405


## 主从架构 

redis 集群情况下，如果主机创建了 一个key ，但是同步到 从机的时候主机挂了，这个时候启动从机那么也会有值丢失。
怎么办呢 ，可以用zookeeper ，但是zookeeper 并发性不如redis  (一般这种情况很少，而且就算有很多公司其实也都不会太在意这个问题。但如果真的想解决，那就 zookeeper 或者 redlock )

redis /zookeeper 满足cap 情况是不一样的

redis 满足 ap
zookeeper 满足 cp


[这里可以参考百度解释](https://baike.baidu.com/item/CAP%E5%8E%9F%E5%88%99/5712863?fr=aladdin)
CAP原则又称CAP定理，指的是在一个分布式系统中，一致性（Consistency）、可用性（Availability）、分区容错性（Partition tolerance）。CAP 原则指的是，这三个要素最多只能同时实现两点，不可能三者兼顾。

所以这里就有了一个新的组件  redlock (但是此软件问题也比较琐碎，)

![](assets/000/01/02/04/05-1610761909428.png)

简单实现代码：

![](assets/000/01/02/04/05-1610762184075.png)


## ok 那么问题来了，高并发分布式锁如何实现？

这里提到了 concurrentHashMap