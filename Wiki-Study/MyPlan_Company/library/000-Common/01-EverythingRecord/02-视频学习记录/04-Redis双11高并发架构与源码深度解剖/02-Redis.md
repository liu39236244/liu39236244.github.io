# 课程笔记

## 课程内容介绍

![](assets/000/01/02/04/02-1610627511365.png)


## 第六节课

### redis 底层 做了什么

打开redis 客户端 

set abc 666

redis 底层其实对abc做了redis自己的hash ，然后存入自己的hash表（数组+链表）中

> 1 使用redis生成id问题

这里有个问题，自增id问题，如果仅仅用redis 这么宝贵的资源生成id ，太浪费资源了。所以可以每一次生成多个id ，比如1-100 ，然后放到内存中，用完再去redis中生成； 如果升到一半宕机了，也没问题，顶多浪费一部分id

>  2 利用redis 模拟栈的存入方式的场景

微博、等一些需要时间排序的，后发的消息先显示。此时就可以用redis


![](assets/000/01/02/04/02-1610628563841.png)


###  set数据解耦股 的使用

![](assets/000/01/02/04/02-1610628881061.png)

> 1 抽奖 


![](assets/000/01/02/04/02-1610628917091.png)


> 2 点赞列表

![](assets/000/01/02/04/02-1610629172641.png)

sadd 


> 3 相同好友可见点赞功能

![](assets/000/01/02/04/02-1610629603511.png)

* 交集，并集，差集

![](assets/000/01/02/04/02-1610629682303.png)


### zset

![](assets/000/01/02/04/02-1610630854192.png)



> 1. zset 场景



![](assets/000/01/02/04/02-1610631199841.png)

跳表

![](assets/000/01/02/04/02-1610631282451.png)


![](assets/000/01/02/04/02-1610631416884.png)

![](assets/000/01/02/04/02-1610631571840.png)


默认zset 用的压缩列表，那么什么时候底层是跳表？


![](assets/000/01/02/04/02-1610631709802.png)


![](assets/000/01/02/04/02-1610631812001.png)