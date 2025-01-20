# 03、Netty 基础 之 NIO之Buffer

原文地址：https://ddkk.com/zhuanlan/server/netty/4/3.html

# 一、Buffer基本介绍


## 1、 缓冲区（Buffer）；

缓冲区本质上是一个可以读写数据的内存块，可以理解成是一个容器对象（数组）。该对象提供了一组方法，可以更轻松的使用内存块。缓冲区对象内置了一些机制，能够跟踪和记录缓冲区的状态变化情况。Channel提供从文件、网络读取数据的渠道，但是读取或写入的数据都必须经由Buffer。

![](assets/000/01/100/01/000/003/03-1730277946391.png)


# 二、Buffer类

1、 Buffer类定义了所有的缓冲区都具有四个属性来提供关于其包含的数据元素的信息；

```
Capacity：容量，即可以容纳的最大数据量，在缓冲区创建时被设定并且不能改变。
Limit：表示缓冲区的当前终点，不能对缓冲区超过极限的位置进行读写操作。且极限是可以修改的。
Position：位置，下一个要被读或写的元素的索引，每次读写缓冲区数据时都会改变该值，为下次读写做准备。
Mark：标记，调用mark()来设置mark=position，再调用reset()可以让position恢复到标记的位置。
```


2、相关代码

```java
 // Invariants: mark <= position <= limit <= capacity
    private int mark = -1;
    private int position = 0;
    private int limit;
    private int capacity;

```


3、 Buffer的子类；


在NIO中，Buffer是一个顶层父类，它是一个抽象类。

![](assets/000/01/100/01/000/003/03-1730278213684.png)

IntBuffer也有相应的子类：


![](assets/000/01/100/01/000/003/03-1730278227092.png)


4、 Buffer简单使用；


```java
package netty.nio;

import java.nio.IntBuffer;

public class BasicBuffer {
	public static void main(String[] args) {
		//举例说明buffer的使用（简单说明）
		
		//创建一个Buffer，大小为5，即可以存放5个int
		IntBuffer intBuffer = IntBuffer.allocate(5);
		
		//向Buffer存放数据
		//intBuffer.capacity：buffer的容量
		for (int i=0; i < intBuffer.capacity(); i++) {
			intBuffer.put(i * 2);
		}
		
		//如何从buffer读取数据
		//将buffer转换，读写切换
		intBuffer.flip();
		
		
		while(intBuffer.hasRemaining()) {  //是否有未读数据
			System.out.println(intBuffer.get());  //通过buffer的index获取数据
		}
	}
}
```

debug中可以看到：




![](assets/000/01/100/01/000/003/03-1730278341382.png)




5、 读写切换；


```java

   public final Buffer flip() {
        limit = position;
        position = 0;
        mark = -1;
        return this;
    }
```


6、 Buffer类相关方法一览；


1、JDK1.4时，引入的api

```java
public final int capacity()：返回此缓冲区的容量
public final int position()：返回此缓冲区的位置
public final Buffer position(int newPosition)：设置此缓冲区的位置
public final int limit()：返回此缓冲区的限制
public final Buffer limit(int newLimit)：设置此缓冲区的限制
public final Buffer mark()：在此缓冲区的位置设置标记
public final Buffer reset()：将此缓冲区的位置重置为以前标记的位置
public final Buffer clear()：清除此缓冲区，即将各个标记恢复到初始状态，但是数据并没有真正擦除
public final Buffer flip()：反转此缓冲区
public final Buffer rewind()：重绕此缓冲区
public final int remaining()：返回当前位置与限制之间的元素数
public final boolean hasRemaining()：告知在当前位置和限制之间是否有元素
public abstract boolean isReadOnly()：告知此缓冲区是否为只读缓冲区
```

2、JDK1.6时，引入的api

```java
public abstract boolean hasArray()：告知此缓冲区是否具有可访问的底层实现数组
public abstract Object array()：返回此缓冲区的底层实现数组
public abstract int arrayOffset()：返回此缓冲区底层实现数组中第一个缓冲区元素的偏移量
public abstract boolean isDirect()：告知此缓冲区是否为直接缓冲区
```




# 三、ByteBuffer类

从前面可以看出对于Java中的基本数据类型（boolean除外），都有一个Buffer类型与之相对应，最常用的自然是ByteBuffer类（二进制数据）。


## 1、 该类的主要方法；

## 1、缓冲区创建相关api

```java
public static ByteBuffer allocateDirect(int capacity)：创建直接缓冲区
public static ByteBuffer allocate(int capacity)：设置缓冲区的初始容量
public static ByteBuffer wrap(byte[] array)：把一个数组放到缓冲区中使用
public static ByteBuffer wrap(byte[] array, int offset, int length)：构造初始化位置offset和上界length的缓冲区
```

## 2、缓冲区存取相关api

```java
public abstract byte get()：从当前位置position上get，get之后，position会自动+1
public abstract byte get(int index)：从绝对位置get
public abstract ByteBuffer put(byte b)：从当前位置上put，put之后，position会自动+1
public abstract ByteBuffer put(int index, byte b)：从绝对位置上put
```


# 四、关于Buffer的注意事项


## 1、 ByteBuffer支持类型化的put和get，put放入的是什么数据类型，get就应该使用相应的数据类型来取出，否则可能有BufferUnderflowException异常；

## NIOByteBufferPutGet.java



```java

package netty.buffer;

import java.nio.ByteBuffer;

public class NIOByteBufferPutGet {
	public static void main(String[] args) {
		//创建一个Buffer
		ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
		
		//类型化方式放入数据
		byteBuffer.putInt(10);
		byteBuffer.putLong(9L);
		byteBuffer.putChar('上');
		byteBuffer.putShort((short)1);
		
		//取出
		byteBuffer.flip();
		
		System.out.println(byteBuffer.getInt());
		System.out.println(byteBuffer.getLong());
		System.out.println(byteBuffer.getChar());
		System.out.println(byteBuffer.getLong());  //抛异常
	}
}
```



```java
Exception in thread "main" java.nio.BufferUnderflowException
	at java.nio.Buffer.nextGetIndex(Buffer.java:532)
	at java.nio.HeapByteBuffer.getLong(HeapByteBuffer.java:417)
	at netty.buffer.NIOByteBufferPutGet.main(NIOByteBufferPutGet.java:22)
```


## 2、 可以将一个普通的Buffer转成只读Buffer；

ReadOnlyBuffer.java


```java
package netty.buffer;

import java.nio.ByteBuffer;

public class ReadOnlyBuffer {
	public static void main(String[] args) {
		//创建一个Buffer
		ByteBuffer byteBuffer = ByteBuffer.allocate(1024);
		
		for(int i=0; i<1024; i++) {
			byteBuffer.put((byte)i);
		}
		
		//切换
		byteBuffer.flip();
		
		//得到一个只读的buffer
		ByteBuffer readOnlyBuffer = byteBuffer.asReadOnlyBuffer();
		System.out.println(readOnlyBuffer.getClass());
		
		//读取
		while (readOnlyBuffer.hasRemaining()) {
			System.out.println(readOnlyBuffer.get());
		}
		
		//写入
		readOnlyBuffer.put((byte)1);  //抛异常
		
	}
}

Exception in thread "main" java.nio.ReadOnlyBufferException
	at java.nio.HeapByteBufferR.put(HeapByteBufferR.java:175)
	at netty.buffer.ReadOnlyBuffer.main(ReadOnlyBuffer.java:27)

```


## 3、 NIO还提供了MappedByteBuffer，可以让文件直接在内存（堆外的内存）中进行修改，操作系统不需要拷贝一次，而如何同步到文件由NIO来完成；

![](assets/000/01/100/01/000/003/03-1730279561584.png)


MappedByteBufferTest.java


```java
package netty.buffer;

import java.io.RandomAccessFile;
import java.nio.MappedByteBuffer;
import java.nio.channels.FileChannel;

public class MappedByteBufferTest {
	public static void main(String[] args) throws Exception {
		
		//修改文件
		RandomAccessFile randomAccessFile = new RandomAccessFile("d:\\file01.txt", "rw");
		//获取对应的通道
		FileChannel fileChannel = randomAccessFile.getChannel();
		
		/**
		 * MapMode mode：使用的模式
		 * long position：可以直接修改的起始位置
		 * long size：是映射到内存的大小（最多可以映射多少大小），即将文件file01.txt的多少个字节映射到内存
		 * 可以直接修改的范围就是0-5（不包含5）
		 * 实际类型是DirectByteBuffer
		 */
		MappedByteBuffer mappedByteBuffer = fileChannel.map(FileChannel.MapMode.READ_WRITE, 0, 5);
		mappedByteBuffer.put(0, (byte) 'H');
		mappedByteBuffer.put(3, (byte) '9');
		
		//关闭文件
		randomAccessFile.close();
		
	}
}



```

效果


```java
原内容：hello，你好
修改后：Hel9o，你好
```






## 4、 前面我们讲的读写操作，都是通过一个Buffer完成的，NIO还支持通过多个Buffer（即Buffer数组）完成读写操作，即Scattering和Gatering；

Scattering（分散）：将数据写入到buffer时，可以采用buffer数组，依次写入。
Gathering（聚集）：从buffer读取数据时，可以采用buffer数组，依次读。


ScatteringAndGateringTest.java


```java
package netty.buffer;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;

import java.util.Arrays;

public class ScatteringAndGateringTest {
	public static void main(String[] args) throws Exception {
		//使用ServerSocketChannel和SocketChannel
		ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
		//创建server的address
		InetSocketAddress inetSocketAddress = new InetSocketAddress(7000);
		//绑定端口到socket，并启动
		serverSocketChannel.socket().bind(inetSocketAddress);
		
		//创建buffer数组
		ByteBuffer[] byteBuffers = new ByteBuffer[2];
		byteBuffers[0] = ByteBuffer.allocate(5); //第一个分配5个字节
		byteBuffers[1] = ByteBuffer.allocate(3); //第二个分配3个字节
		
		//等待客户端连接telnet
		SocketChannel socketChannel = serverSocketChannel.accept();
		
		//假定从客户端接收8个字节
		int messageLength = 8;
		
		//循环的读取
		while (true) {
			//统计读了多少个字节
			int byteRead = 0;
			
			while (byteRead < messageLength) {
				long l = socketChannel.read(byteBuffers); //返回读取到的个数，会自动处理数组
				byteRead += l; //累计读取到的字节数
				System.out.println("byteRead=" + byteRead);
				//使用流打印，看看当前的buffer的position和limit
				Arrays.asList(byteBuffers).stream().map(buffer -> "position=" + buffer.position()
				+ ", limit=" + buffer.limit()).forEach(System.out::println);
			}
			
			//将所有的buffer进行flip
			//Arrays.asList(byteBuffers).stream().map(buffer -> buffer.flip());
			Arrays.asList(byteBuffers).stream().forEach(buffer -> buffer.flip()); //注意stream().map遍历不会改变原来的值
			
			//将数据读出显示到客户端
			long byteWrite = 0;
			while (byteWrite < messageLength) {
				long l = socketChannel.write(byteBuffers);
				byteWrite += l;
			}
			
			//将所有的buffer进行clear
			Arrays.asList(byteBuffers).stream().forEach(buffer -> buffer.clear());
			
			System.out.println("byteRead=" + byteRead + ", byteWrite=" + byteWrite 
					+ ", messageLength=" + messageLength);
			
		}
	}
}
```