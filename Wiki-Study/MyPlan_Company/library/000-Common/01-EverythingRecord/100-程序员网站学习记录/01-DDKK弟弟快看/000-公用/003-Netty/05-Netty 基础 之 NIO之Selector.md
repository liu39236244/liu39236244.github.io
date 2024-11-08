# Netty 基础 之 NIO之Selector


## 一、基本介绍

1、 Java的NIO，用非阻塞的IO方式，可以用一个线程，处理多个的客户端连接，就会使用到Selector（选择器）；

2、 Selector能够检测多个注册的通道上是否有事件发生（注意：多个Channel以事件的方式可以注册到同一个Selector），如果有事件发生，便获取事件然后针对每个事件进行相应的处理这样就可以只用一个单线程去管理多个通道，也就是管理多个连接和请求；


![](assets/000/01/100/01/000/003/05-1730357265052.png)


3、 只有在连接（Channel）真正有读写事件发生时，才会进行读写，就大大地减少了系统开销，并且不必为每个连接都创建一个线程，不用去维护多个线程；

4、 避免了多线程之间的上下文切换导致的开销；

# 二、NIO特点再说明

1、 Netty的IO线程NioEventLoop聚合了Selector（选择器，也叫多路复用器），可以同时并发处理成百上千个客户端连接；

2、 当线程从某客户端Socket通道进行读写数据时，若没有数据可用时，该线程可以进行其他任务；

3、 线程通常将非阻塞IO的空闲时间用于在其他通道上执行IO操作，所以单独的线程可以管理多个输入和输出通道；

4、 由于读写操作都是非阻塞的，这就可以充分提升IO线程的运行效率，避免由于频繁IO阻塞导致的线程挂起；

5、 一个IO线程可以并发处理N个客户端连接和读写操作，这从根本上解决了传统同步阻塞IO一连接一线程模型，架构的性能、弹性伸缩能力和可靠性都得到了极大的提升；



# 三、Selector API介绍

## 1、 Selector类；

### Selector类是一个抽象类，常用方法：

```java
public static Selector open() throws IOException：得到一个选择器对象
public abstract int select(long timeout) throws IOException：监控所有注册的通道，当其中有IO操作可以进行时，将对应的SelectionKey加入到内部集合中并返回，参数用来设置超时时间
public abstract Set selectedKeys()：从内部集合中得到所有的SelectionKey
```


### 2、 继承关系；

![](assets/000/01/100/01/000/003/05-1730357560297.png)

selectedKeys()方法遍历SelectionKey，通过SelectionKey反向得到Channel。SelectionKey就是和Channel关联的。



# 四、Selector注意事项

1、 NIO中的ServerSocketChannel功能类似ServerSocket，SocketChannel功能类似Socket；

2、 selector相关方法说明；

```java
selector.select(); //阻塞
selector.select(1000); //阻塞1000毫秒，在1000毫秒后返回
selector.wakeup(); //唤醒selector
selector.selectNow(); //不阻塞，立马返回
```


# 五、NIO非阻塞网络编程原理分析图

NIO非阻塞网络编程相关的（Selector、SelectionKey、ServerSocketChannel和SocketChannel）关系


![](assets/000/01/100/01/000/003/05-1730518654812.png)


说明： 

1、 当客户端连接时，会通过ServerSocketChannel得到对应的SocketChannel；
2、 将SocketChannel注册到Selector上，一个Selector上可以注册多个SocketChannel；


![](assets/000/01/100/01/000/003/05-1730518749734.png)


3、 注册后返回一个SelectionKey，会和该Selector关联（以集合形式内联在Selector中）；
4、 Selector进行监听，用select()方法，返回有事件发生的通道个数；

5、 事件；

    OP_READ
    OP_WRITE
    OP_CONNECT
    OP_ACCEPT


6、 进一步得到各个SelectionKey（有事件发生的）；
7、 再通过SelectionKey反向获取SocketChannel；
8、 可以通过得到的channel，完成业务处理；


# 六、SelectionKey API


1、 SelectionKey，表示Selector和通道的注册关系；

共四种：

```jaav
intOP_ACCEPT：有新的网络连接可以accept，值为16（1<<4）
intOP_CONNECT：代表连接已经建立，值为8（1<<3）
intOP_READ：代表读操作，值为1（1<<0）
intOP_WRITE：代表写操作，值为4（1<<2）
```

2、 Selector类方法；

```java
public abstract Set keys()：注册的通道数量
public abstract Set selectedKeys()：注册的通道，发生事件的数量
```

3、 SelectionKey类；

```java
public abstract Selector selector()：得到与之关联的Selector对象
public abstract SelectableChannel channel()：得到与之关联的通道
public final Object attachment()：得到与之关联的共享数据
public abstract SelectionKey interestOps(int ops)：设置或改变监听事件
public final boolean isAcceptable()：是否可以accept
public final boolean isReadable()：是否可以读
public final boolean isWritable()：是否可以写
```