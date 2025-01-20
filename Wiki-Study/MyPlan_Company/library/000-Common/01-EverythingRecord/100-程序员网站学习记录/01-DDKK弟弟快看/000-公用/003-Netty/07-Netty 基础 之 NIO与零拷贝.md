# 一、零拷贝基本介绍


1、 零拷贝是网络编程的关键，很多性能优化都离不开；

2、 在Java程序中，常用的零拷贝有mmap（内存映射）和sendFile在OS里，他们是怎样的一个设计？；

3、 NIO中如何使用零拷贝；

# 二、传统IO数据读写


## 1、 Java传统IO和网络编程的一段代码；

    File file = new File("test.txt");
    RandomAccessFile raf = new RandomAccessFile(file, "rw");
    byte[] arr = new byte[(int)file.length()];
    //把文件数据读入到字节数组中
    raf.read(arr);
    Socket socket = new ServerSocket(8080).accept();
    socket.getOutputStream().write(arr);

## 2、 DMA；

    direct memory access，直接内存拷贝（不使用CPU）

    传统IO：
    Hard drive -> kernal buffer -> user buffer -> socket buffer -> protocol engine
    经过了4次拷贝，3次切换。

## 3、 mmap优化；

mmap通过内存映射，将文件映射到内核缓冲区，同时，用户空间可以共享内核空间的数据。这样在进行网络传输时，就可以减少内核空间到用户空间的拷贝次数。

## 4、 sendFile优化；

Linux2.1版本提供了sendFile函数，其基本原理如下：数据根本不经过用户态，直接从内核缓冲区进入到Socket Buffer，同时，由于和用户态完全无关，就减少了一次上下文切换。

## 5、 我们说的零拷贝是从操作系统的角度看的，是没有cpu拷贝；



# 三、零拷贝再次理解

1、 我们说零拷贝，是从操作系统的角度来说的因为内核缓冲区之间，没有数据是重复的（只有kernelbuffer有一份数据）；

2、 零拷贝不仅仅带来更少的数据复制，还能带来其他的性能优势，例如更少的上下文切换，更少的CPU缓存伪共享以及无CPU校验和计算；



# 四、mmap和sendFile的区别

1、 mmap适合小数据量读写，sendFile适合大文件传输；

2、 mmap需要4次上下文切换，3次数据拷贝；sendFile需要3次上下文切换，最少2次数据拷贝；

3、 sendFile可以利用DMA方式，减少CPU拷贝，mmap则不能（必须从内核拷贝到socket缓冲区）；



# 五、NIO零拷贝案例

    1、 使用传统的IO方法传递一个大文件；
    2、 使用NIO零拷贝方式传递（transferTo）一个大文件；
    3、 看看两种传递方式耗时时间分别是多少；
    4、 传统IO；



## OldIOServer.java


```java
package netty.zerocopy;

import java.io.DataInputStream;
import java.net.ServerSocket;
import java.net.Socket;

public class OldIOServer {
	public static void main(String[] args) throws Exception {
		ServerSocket serverSocket = new ServerSocket(7001);
		
		while(true) {
			Socket socket = serverSocket.accept();
			DataInputStream dataInputStream = new DataInputStream(socket.getInputStream());
			
			try {
				byte[] byteArray = new byte[4096];
				
				while(true) {
					int readCount = dataInputStream.read(byteArray, 0, byteArray.length);
					
					if (-1 == readCount) {
						break;
					}
				}
				
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
		
	}
}
```




## OldIOClient.java



```java
package netty.zerocopy;

import java.io.DataOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;
import java.net.Socket;

public class OldIOClient {
	public static void main(String[] args) throws Exception {
		Socket socket = new Socket("localhost", 7001);
		String fileName = "d:\\aaa.zip";
		InputStream inputStream = new FileInputStream(fileName);
		
		DataOutputStream dataOutputStream = new DataOutputStream(socket.getOutputStream());
		
		byte[] buffer = new byte[4096];
		long readCount;
		long total = 0;
		
		long startTime = System.currentTimeMillis();
		
		while((readCount = inputStream.read(buffer)) >= 0) {
			total += readCount;
			dataOutputStream.write(buffer);
		}
		
		System.out.println("发送总字节数：" + total + "，耗时：" + (System.currentTimeMillis() - startTime));
		
		inputStream.close();
		socket.close();
		
	}
}
```

## 5、 零拷贝； NewIOServer.java





```java
package netty.zerocopy;

import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;

public class NewIOServer {
	public static void main(String[] args) throws Exception {
		SocketAddress socketAddress = new InetSocketAddress(7001);
		
		ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
		
		ServerSocket serverSocket = serverSocketChannel.socket();
		
		serverSocket.bind(socketAddress);
		
		//创建buffer
		ByteBuffer byteBuffer = ByteBuffer.allocate(4096);
		
		while(true) {
			SocketChannel socketChannel = serverSocketChannel.accept();
			
			int readCount = 0;
			
			while(readCount != -1) {
				try {
					//从socketChannel读取数据到byteBuffer
					readCount = socketChannel.read(byteBuffer);
					
				} catch (Exception ex) {
					ex.printStackTrace();
				}
				
				//将buffer倒带
				byteBuffer.rewind();
			}
		}
	}
}
```



## NewIOClient.java


```java
package netty.zerocopy;

import java.io.FileInputStream;
import java.net.InetSocketAddress;
import java.nio.channels.FileChannel;
import java.nio.channels.SocketChannel;

public class NewIOClient {
	public static void main(String[] args) throws Exception {
		SocketChannel socketChannel = SocketChannel.open();
		socketChannel.connect(new InetSocketAddress("localhost", 7001));
		String fileName = "d:\\aaa.zip";
		//得到一个文件的channel
		FileChannel fileChannel = new FileInputStream(fileName).getChannel();
		//准备发送
		long startTime = System.currentTimeMillis();
		
		//在linux下一个transferTo方法可以完成传输
		//在windows下，一次调用transferTo只能发送8MB的文件，就需要分段传输文件，而且要注意传输时的位置
		//transferTo底层使用到零拷贝
		
		long start = 0; //起始位置
		long size = fileChannel.size(); //文件大小
		long transCount = 0; //传输了多少
		long sum = 0;
		
		while (true) {
			transCount = fileChannel.transferTo(start, size, socketChannel);
			sum += transCount;
			if (transCount < size) {
				start += transCount;
				size -= transCount;
			} else {
				break;
			}
		}
		
		//long transCount = fileChannel.transferTo(0, fileChannel.size(), socketChannel);
		System.out.println("发送总字节数：" + sum + "，耗时：" + (System.currentTimeMillis() - startTime));
		
		//关闭
		fileChannel.close();
		socketChannel.close();
	}
}
```


## 6、 耗时；


    传统IO耗时：
    发送总字节数：51182677，耗时：245
    零拷贝耗时：
    发送总字节数：51182677，耗时：42