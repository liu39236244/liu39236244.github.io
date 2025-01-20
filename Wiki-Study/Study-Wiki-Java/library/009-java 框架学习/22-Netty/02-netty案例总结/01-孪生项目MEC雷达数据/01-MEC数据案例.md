# 孪生项目MEC雷达数据



## 说明


此demo 是 mec 雷达数据的一个解析， java 这边是需要写一个socket 的客户端去连接  对方给出的一个 socket 服务端去接受数据，我们需要接过来。

遇到的问题：
首先我用的是netty 的客户端，因为最开始用socket 最开始接收数据有问题（应该是 截数据这块 单挑数据接取有问题，直接是接的字节流）, 用 socket 工具接受数据就是 16进制的 55 AA 55 BB 这种16进制字符串。

本案例中记录了 模拟netty服务端 、 客户端 


## 案例记录


### 依赖导入

netty pom依赖引入

```xml
        <!--netty-->
        <dependency>
            <groupId>io.netty</groupId>
            <artifactId>netty-all</artifactId>
            <version>4.1.77.Final</version>
        </dependency>
```



### 自定义配置文件

```yml
mycustomer:
  socket:
    # mec 雷达数据 链接的 socket 服务ip、以及端口
    netty:
      #netty 服务端 空读多少s 则断开与客户端对应连接
      service:
        ip: localhost
        port: 9002
        empty-read-time: -1
      client:
        ip: localhost
        port: 9002
        # 客户端空读多少秒空写就 执行 userEventTriggered 发送心跳包给服务器
        empty-read-time: 10
        # 客户端写向服务端多少秒空写就 执行 userEventTriggered 发送心跳包给服务器
        empty-write-time: 10
        # 客户端被服务端断开连接以后多少秒重链
        reconnect-time: 10
  # 异步线程池配置
  async:
    executor:
      netty-client-handle-threadPool:
        # 配置核心线程数
        core_pool_size: 4
        # 配置最大线程数
        max_pool_size: 8
        # 配置队列大小
        queue_capacity: 2000
        # 空闲线程 保持时间 ：秒
        keep_alive_seconds: 60
        # 超时等待秒数
        set_awaitTermination_seconds: 180
        # 配置线程池中的线程的名称前缀
        name:
          prefix: netty-client-handle-thread-
          
```



### netty 服务端


#### NettyMecService.java

```java
package com.graphsafe.cadxlk.utils.netty.server;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.bytes.ByteArrayDecoder;
import io.netty.handler.codec.bytes.ByteArrayEncoder;
import io.netty.handler.codec.string.StringDecoder;
import io.netty.handler.codec.string.StringEncoder;
import io.netty.handler.timeout.IdleStateHandler;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import java.io.UnsupportedEncodingException;
import java.net.InetSocketAddress;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ForkJoinPool;

/**
 * @author : shenyabo
 * @date : Created in 2024-06-22 10:26
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Slf4j
@Component
@Data
public class NettyMecService {


    @Value("${mycustomer.socket.netty.service.port}")
    private Integer port;

    @Value("${mycustomer.socket.netty.service.empty-read-time}")
    private Integer nettyServiceEmptyReadTime = 30;


    private static final EventLoopGroup bossGroup = new NioEventLoopGroup(1);
    private static final EventLoopGroup workerGroup = new NioEventLoopGroup();

    @Resource
    private NettyMecServiceHandler nettyV2xServiceHandler;

    // 保存已连接客户端的Channel
    public final Map<String, Channel> clientChannels = new HashMap<>();


    /**
     * 自定义服务端 发送消息
     */
    private ChannelFuture serviceChannelFuture = null;
    private final ThreadLocal<Channel> mChannel = new ThreadLocal<>();

    public void startServer(int port) {
        try {
            ServerBootstrap sbs = new ServerBootstrap()
                    .group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .localAddress(new InetSocketAddress(port))
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        protected void initChannel(SocketChannel ch) throws Exception {
//                            ch.pipeline().addLast("framer", new DelimiterBasedFrameDecoder(8192, Delimiters.lineDelimiter()));
//                             ch.pipeline().addLast("decoder", new StringDecoder());
//                             ch.pipeline().addLast("encoder", new StringEncoder());
                            // 添加字符串编码器和解码器
                            ch.pipeline().addLast(new StringEncoder(), new StringDecoder());
                            // 添加二进制字节数组编码器和解码器
                            ch.pipeline().addLast(new ByteArrayEncoder(), new ByteArrayDecoder());
                            // 设置读空闲超时为 nettyServiceEmptyReadTime 秒,nettyServiceEmptyReadTime 秒空读就断开与客户端的连接
                            ch.pipeline().addLast(new IdleStateHandler(nettyServiceEmptyReadTime, 0, 0));
                            ch.pipeline().addLast(nettyV2xServiceHandler);
                            ChannelId socketChannelId = ch.id();

                            clientChannels.put(socketChannelId + "", ch);
                            log.info("新客户端连接上了 ，id :{}", socketChannelId);
                            clearExpireSocket();
                            ch.writeAndFlush("服务器接收到您的连接，您的socket channel  id ，请记住为:" + socketChannelId);

                        }

                    }).option(ChannelOption.SO_BACKLOG, 128)
                    .childOption(ChannelOption.SO_KEEPALIVE, true);
            // 绑定端口，开始接收进来的连接
            serviceChannelFuture = sbs.bind(port).addListener(future -> {
                log.info(String.format("服务器启动成功，并监听端口：%s ", port));
            });


        } catch (Exception e) {
            log.error("启动 netty 服务器端出现异常", e);
        } finally {
            // 关闭EventLoopGroup，释放资源
            // try {
            //     workerGroup.shutdownGracefully().sync();
            // } catch (InterruptedException e) {
            //     e.printStackTrace();
            // }
            // try {
            //     bossGroup.shutdownGracefully().sync();
            // } catch (InterruptedException e) {
            //     e.printStackTrace();
            // }
            // log.info("服务器关闭");
        }
    }

    // 服务器端启动，并绑定 特定 端口
    // @PostConstruct
    public void init() {
        ForkJoinPool.commonPool().submit(() -> startServer(port));
    }

    /**
     * 客户端通过 Channel 对象向服务器端发送数据
     *
     * @param data     文本数据
     * @param socketId
     */
    public void serviceSend(String data, String socketId) {
        try {
            // 如果socketid 为空 则给全部客户端都发送消息
            if (StringUtils.isEmpty(socketId)) {
                clientChannels.forEach((k, v) -> {
                    if (v.isActive()) {
                        log.info("---------------------------------发送给 socketId:{},消息:{}", k, data);
                        v.writeAndFlush(data);
                    } else {
                        log.error("发送给:【{}】的socket 已关闭", v.id());
                    }
                });
            } else {
                Channel channel = clientChannels.get(socketId);
                if (channel != null) {
                    channel.writeAndFlush(data);
                } else {
                    log.info("发送给客户端：【{}】 不存在对应客户端channel ", socketId);
                }
            }


        } catch (Exception e) {
            log.error(this.getClass().getName().concat(".send has error"), e);
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/24 11:02
     * @Description: socket 服务端发送二进制数据给客户端
     * @Params: [data, socketId]
     * @Return: void
     */
    public void serviceSendBinToClient(String data, String socketId) {

        try {

            // 记录本次需要发送的socket 客户端
            List<Channel> channels = new ArrayList<>();

            // 如果socketid 为空 则给全部客户端都发送消息
            if (StringUtils.isEmpty(socketId)) {
                clientChannels.forEach((k, v) -> {
                    channels.add(v);
                });
            } else {
                Channel channel = clientChannels.get(socketId);
                channels.add(channel);
            }

            // 给对应的channel 发送消息

            for (Channel channel : channels) {
                log.info("----------serviceSendBinToClient--------发送给 socketId:{},消息:{}", channel.id(), data);

                // // 准备要发送的二进制数据
                // ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                // DataOutputStream dataOutputStream = new DataOutputStream(byteArrayOutputStream);
                //
                // // 例如，发送一个整数和一个字符串
                // int num = 123;
                // String str = "Hello, Client!";
                //
                // // try {
                // //     dataOutputStream.writeInt(num);
                // // } catch (IOException e) {
                // //     e.printStackTrace();
                // // }
                // try {
                //     dataOutputStream.writeUTF(data);
                // } catch (IOException e) {
                //     e.printStackTrace();
                // }
                //
                // // 获取二进制数据
                // byte[] binaryData = byteArrayOutputStream.toByteArray();

                byte[] bytes = null;
                try {
                    bytes = data.getBytes("UTF-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

                // 发送二进制数据
                channel.writeAndFlush(bytes);
                // channel.writeAndFlush(channel.alloc().buffer().writeBytes(bytes));
            }

        } catch (Exception e) {
            log.error(this.getClass().getName().concat(".send has error"), e);
        }
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/28 9:22
     * @Description: 测试发送二进制字节数组
     * @Params: [data, socketId]
     * @Return: void
     */
    public void serviceSendFixBinDataToClient(String socketId){


        // 记录本次需要发送的socket 客户端
        List<Channel> channels = new ArrayList<>();

        // 如果socketid 为空 则给全部客户端都发送消息
        if (StringUtils.isEmpty(socketId)) {
            clientChannels.forEach((k, v) -> {
                channels.add(v);
            });
        } else {
            Channel channel = clientChannels.get(socketId);
            channels.add(channel);
        }

        // 给对应的channel 发送消息

        for (Channel channel : channels) {
            log.info("----------serviceSendFixBinDataToClient--------发送给 socketId:{},固定二进制数组", channel.id());


            byte[] array = {
                    (byte) 0x55, (byte) 0xAA, (byte) 0x55, (byte) 0xBB, (byte) 0x00, (byte) 0xB0, (byte) 0x01, (byte) 0x5F,
                    (byte) 0x72, (byte) 0x61, (byte) 0x64, (byte) 0x61, (byte) 0x72, (byte) 0x5F, (byte) 0x30, (byte) 0x30,
                    (byte) 0x33, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                    (byte) 0x00, (byte) 0x00, (byte) 0x15, (byte) 0x03, (byte) 0x0A, (byte) 0x0E, (byte) 0x1E, (byte) 0x31,
                    (byte) 0x03, (byte) 0x21, (byte) 0x03, (byte) 0xCC, (byte) 0x0B, (byte) 0x01, (byte) 0x14, (byte) 0x0F,
                    (byte) 0x0F, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0x00, (byte) 0x2A, (byte) 0xFE, (byte) 0xA2,
                    (byte) 0x1E, (byte) 0xD2, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
                    (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x47, (byte) 0x84,
                    (byte) 0xE7, (byte) 0xE3, (byte) 0x12, (byte) 0x34, (byte) 0x51, (byte) 0x8A, (byte) 0x03, (byte) 0xF4,
                    (byte) 0xFF, (byte) 0x05, (byte) 0x32, (byte) 0x14, (byte) 0x0F, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF,
                    (byte) 0x0C, (byte) 0xCD, (byte) 0xF9, (byte) 0x7A, (byte) 0x11, (byte) 0x76, (byte) 0x02, (byte) 0x9E,
                    (byte) 0xFE, (byte) 0xB6, (byte) 0xF5, (byte) 0x80, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x5A,
                    (byte) 0x00, (byte) 0x00, (byte) 0x47, (byte) 0x84, (byte) 0xEE, (byte) 0x46, (byte) 0x12, (byte) 0x34,
                    (byte) 0x5D, (byte) 0x2B, (byte) 0x03, (byte) 0xEF, (byte) 0xFF, (byte) 0x05, (byte) 0x32, (byte) 0x14,
                    (byte) 0x0F, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, (byte) 0x0A, (byte) 0xD4, (byte) 0x05, (byte) 0x5A,
                    (byte) 0x11, (byte) 0x76, (byte) 0x02, (byte) 0x3A, (byte) 0x00, (byte) 0xFA, (byte) 0x08, (byte) 0xC0,
                    (byte) 0x00, (byte) 0x00, (byte) 0xFF, (byte) 0xA6, (byte) 0x01, (byte) 0x18, (byte) 0x47, (byte) 0x84,
                    (byte) 0xE1, (byte) 0xEC, (byte) 0x12, (byte) 0x34, (byte) 0x5D, (byte) 0xF4, (byte) 0x03, (byte) 0xF0,
                    (byte) 0xFF, (byte) 0x05, (byte) 0x32, (byte) 0x14, (byte) 0x0F, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF,
                    (byte) 0x0B, (byte) 0x31, (byte) 0x00, (byte) 0xDC, (byte) 0x11, (byte) 0x08, (byte) 0x02, (byte) 0x30,
                    (byte) 0xFF, (byte) 0x9C, (byte) 0xF8, (byte) 0x01, (byte) 0x00, (byte) 0x32, (byte) 0xFD, (byte) 0xD0,
                    (byte) 0x00, (byte) 0x00, (byte) 0x47, (byte) 0x84, (byte) 0xE6, (byte) 0xA1, (byte) 0x12, (byte) 0x34,
                    (byte) 0x5E, (byte) 0x0A, (byte) 0x55, (byte) 0xCC, (byte) 0x55, (byte) 0xDD, (byte) 0x55, (byte) 0xAA,
                    (byte) 0x55, (byte) 0xBB, (byte) 0x00, (byte) 0xB0, (byte) 0x01, (byte) 0xED
            };

            channel.writeAndFlush(array);
            // channel.writeAndFlush(channel.alloc().buffer().writeBytes(array));


            /**
             * 其余写法
             */
            // if (channel != null) {
            //
            //     // 准备要发送的二进制数据
            //     ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            //     DataOutputStream dataOutputStream = new DataOutputStream(byteArrayOutputStream);
            //
            //
            //     // try {
            //     //     dataOutputStream.writeInt(num);
            //     // } catch (IOException e) {
            //     //     e.printStackTrace();
            //     // }
            //     try {
            //         dataOutputStream.writeUTF(data);
            //     } catch (IOException e) {
            //         e.printStackTrace();
            //     }
            //
            //     // 获取二进制数据
            //     byte[] binaryData = byteArrayOutputStream.toByteArray();
            //
            //     // 发送二进制数据
            //     channel.writeAndFlush(binaryData);
            //
            // } else {
            //     log.info("发送给客户端：【{}】 不存在对应客户端channel ", socketId);
            // }


        }

    }


    @PreDestroy
    public void destroy()  {
        // 优雅关闭 bossGroup 和 workerGroup
        if (bossGroup!= null) {
            try {
                bossGroup.shutdownGracefully().sync();
            } catch (InterruptedException e) {
                log.error("Netty 服务端 bossGroup.shutdownGracefully() 关闭异常 ",e);
            }
        }
        if (workerGroup!= null) {
            try {
                workerGroup.shutdownGracefully().sync();
            } catch (InterruptedException e) {

                log.error("Netty 服务端 workerGroup.shutdownGracefully() 关闭异常 ",e);
            }
        }
        log.info("Netty 服务端已关闭");
    }

    // // 字符串编码器
    // class StringEncoder extends MessageToByteEncoder<String> {
    //     @Override
    //     protected void encode(ChannelHandlerContext ctx, String msg, ByteBuf out) throws Exception {
    //         out.writeBytes(msg.getBytes());
    //     }
    // }
    //
    // // 字符串解码器
    // class StringDecoder extends ByteToMessageDecoder {
    //     @Override
    //     protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
    //         int length = in.readableBytes();
    //         byte[] bytes = new byte[length];
    //         in.readBytes(bytes);
    //         out.add(new String(bytes));
    //     }
    // }

    // // 二进制字节数组编码器
    // class ByteArrayEncoder extends MessageToByteEncoder<byte[]> {
    //     @Override
    //     protected void encode(ChannelHandlerContext ctx, byte[] msg, ByteBuf out) throws Exception {
    //         out.writeBytes(msg);
    //     }
    // }
    //
    // // 二进制字节数组解码器
    // class ByteArrayDecoder extends ByteToMessageDecoder {
    //     @Override
    //     protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
    //         int length = in.readableBytes();
    //         byte[] bytes = new byte[length];
    //         in.readBytes(bytes);
    //         out.add(bytes);
    //     }
    //
    // }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/24 17:57
     * @Description: 每当有新的链接过来就回去清空无效的socket
     * @Params: []
     * @Return: void
     */
    public void clearExpireSocket() {
        List<String> removekeys = new ArrayList<>();
        if (clientChannels.size() > 0) {
            clientChannels.forEach((k, v) -> {
                v.isActive();
                v.isOpen();
                v.isWritable();
                log.info("v.id():{}, isWritable():{} ,v.isActive():{},v.isOpen():{} , ", v.id(), v.isWritable(), v.isOpen(), v.isActive());
                if (!v.isOpen()) {
                    removekeys.add(k);
                }
            });

            if (!CollectionUtils.isEmpty(removekeys)) {
                log.info("新连接产生，删除过期的socket个数:{}个", removekeys.size());
                // 删掉无用的socket 链接
                for (String removekey : removekeys) {
                    clientChannels.remove(removekey);
                }
            } else {
                log.info("新连接产生，无过期的socket连接");
            }


            log.info("最新socket 客户端个数:{}", clientChannels.size());
            clientChannels.forEach((k, v) -> {
                log.info("==================================key :{} ,value: {}", k, v);
            });

        }

    }


}

```

#### 处理类 NettyMecServiceHandler


```java
package com.graphsafe.cadxlk.utils.netty.server;

import io.netty.channel.Channel;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.timeout.IdleState;
import io.netty.handler.timeout.IdleStateEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.net.SocketAddress;

/**
 * @author : shenyabo
 * @date : Created in 2024-06-22 10:37
 * @description : v2x 服务端数据处理handler
 * @modified By :
 * @version: : v1.0
 */
@Component
@ChannelHandler.Sharable
@Slf4j
public class NettyMecServiceHandler extends ChannelInboundHandlerAdapter {

    @Value("${mycustomer.socket.netty.service.empty-read-time}")
    private Integer nettyServiceEmptyReadTime = 30;


    // 服务器端读取到 客户端发送过来的数据，然后通过 Channel 回写数据
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        Channel newChannel = ctx.channel();
        SocketAddress socketAddress = newChannel.remoteAddress();

        if (msg instanceof String) {
            log.info("↑服务器收到从客户端:{} 发送过来的 《字符串》数据：{}",socketAddress,msg.toString());
        } else if (msg instanceof byte[]) {
            log.info("↑服务器收到从客户端:{} 发送过来的 《二进制字节数组》数据：{}",socketAddress,new String((byte[]) msg));
        }
        // 回传消息给客户端
        ctx.writeAndFlush(msg);
        // ctx.channel().writeAndFlush(String.format("服务器响应:%s", msg));
    }



    // 捕获到异常的处理
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/25 16:11
     * @Description: 多久服务器 读对应客户端没数据 就断开与其链接
     * @Params: [ctx, evt]
     * @Return: void
     */

    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) {

        if (evt instanceof IdleStateEvent) {
            IdleStateEvent e = (IdleStateEvent) evt;
            if (e.state() == IdleState.READER_IDLE) {
                log.info("服务端断开对应 {}s 内没收到客户端 :{}的消息， 将断开客户端链接 ",nettyServiceEmptyReadTime,ctx.channel().id());
                // 如果读空闲超时，关闭连接
                ctx.close();
                // 写心跳包
                // ctx.channel().writeAndFlush("service heartbeat");
            }
            else if (e.state() == IdleState.WRITER_IDLE) {
                // 写心跳包
                // ctx.channel().writeAndFlush("heartbeat");
            } else if (e.state() == IdleState.ALL_IDLE) {

            }
        }
    }
}

```


### netty 客户端 

#### NettyMecClient


```java

package com.graphsafe.cadxlk.utils.netty.client;


import com.graphsafe.cadxlk.utils.netty.server.NettyMecService;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.*;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;
import io.netty.handler.codec.bytes.ByteArrayDecoder;
import io.netty.handler.codec.bytes.ByteArrayEncoder;
import io.netty.handler.timeout.IdleStateHandler;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.annotation.PreDestroy;
import javax.annotation.Resource;
import java.net.InetSocketAddress;
import java.util.concurrent.ForkJoinPool;
import java.util.concurrent.TimeUnit;

/**
 * @author : shenyabo
 * @date : Created in 2024-06-22 10:43
 * @description : MEC 毫米波雷达 数据 就是用此客户端接受的数据处理的
 * @modified By :
 * @version: : v1.0
 */
@Slf4j
@Component
public class NettyMecClient {


    @Value("${mycustomer.socket.netty.client.port}")
    private Integer connectNettyPort;

    @Value("${mycustomer.socket.netty.client.ip}")
    private String connectNettyIp;


    @Value("${mycustomer.socket.netty.client.empty-read-time}")
    private Integer nettyClientEmptyReadTime = 10;

    @Value("${mycustomer.socket.netty.client.empty-write-time}")
    private Integer nettyClientEmptyWriteTime = 10;


    private EventLoopGroup group = new NioEventLoopGroup(4);
    ;
    private ChannelFuture mChannelFuture = null;
    private final ThreadLocal<Channel> mChannel = new ThreadLocal<>();

    Bootstrap b = new Bootstrap();
    @Resource
    private NettyMecClientHandler nettyV2xClientHandler;

    @Autowired
    private NettyMecService nettyV2xService;

    public void startClient(String host, Integer port) {

        if (host == null) {
            host = connectNettyIp;
        }
        if (port == null) {
            port = connectNettyPort;
        }
        // Configure the client.
        try {
            // int nThreads = Runtime.getRuntime().availableProcessors();
            // // 计算密集型的设置线程数是低于 服务器cpu核数
            // if ( nThreads >= 2 ){
            //     nThreads = nThreads - 1;
            // }
            // group = new NioEventLoopGroup(nThreads);
            b.group(group)
                    .channel(NioSocketChannel.class)
                    .remoteAddress(new InetSocketAddress(host, port))
                    .option(ChannelOption.TCP_NODELAY, true)
                    .handler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) throws Exception {
                            ChannelPipeline p = ch.pipeline();
                            // p.addLast("decoder", new StringDecoder());
                            // p.addLast("encoder", new StringEncoder());
                            // 添加字符串编码器和解码器
                            // p.addLast(new StringEncoder(), new StringDecoder());
                            // 添加二进制字节数组编码器和解码器
                            p.addLast(new ByteArrayEncoder(), new ByteArrayDecoder());
                            // 客户端多少s 空读 操作 就 userEventTriggered 走这个逻辑，目前往服务器发送心跳维持链接
                            p.addLast(new IdleStateHandler(nettyClientEmptyReadTime, 0, 0, TimeUnit.SECONDS), nettyV2xClientHandler);


                        }
                    });
            this.connect();


        } catch (Exception e) {
            log.error("启动 netty 客户端出现异常", e);
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/24 17:24
     * @Description: 进行客户端的链接
     * @Params: []
     * @Return: void
     */
    public void connect() {

        try {
            //直到连接返回，才会继续后面的执行，否则阻塞当前线程
            mChannelFuture = b.connect(new InetSocketAddress(connectNettyIp, connectNettyPort)).addListener(future -> {
                if (future.isSuccess()) {
                    log.info("连接服务端成功");

                } else {
                    log.info("连接服务端失败，准备重连");
                }
            }).sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 每当有新的链接过来以后，就会去做一次判断map 中是否有过期的 链接
        nettyV2xService.clearExpireSocket();

        // 直到channel关闭，才会继续后面的执行，否则阻塞当前线程
        try {
            mChannelFuture.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();

        }
        log.info("mChannelFuture：{} 管道关闭", mChannelFuture.channel().id());

        // mChannelFuture = b.connect(host, port).addListener(future -> {
        //     log.info("客户端启动成功，并监听端口:{},future:{}", port, future.toString());
        // });


    }


    /**
     * 客户端通过 Channel 对象向服务器端发送数据
     *
     * @param data 文本数据
     */
    public void clientSend(String data) {
        try {
            if (mChannel.get() == null) {
                mChannel.set(mChannelFuture.channel());
            }
            mChannel.get().writeAndFlush(data);
        } catch (Exception e) {
            log.error(this.getClass().getName().concat(".send has error"), e);
        }
    }

    // 客户端启动，并连上服务器端
    // @PostConstruct
    public void init() {
        ForkJoinPool.commonPool().submit(() -> startClient(null, null));
    }

    @PreDestroy
    public void destroy() {
        Channel channel = mChannelFuture.channel();
        if (channel != null && channel.isOpen()) {
            try {
                channel.close().sync();
            } catch (InterruptedException e) {
                log.error("Netty 客户端   channel.close() 关闭异常 ", e);

            }
        }
        if (group != null) {
            try {
                group.shutdownGracefully().sync();
            } catch (InterruptedException e) {
                log.error("Netty 客户端 group.shutdownGracefully 关闭异常 ", e);
            }
        }
        log.info("Nettty 客户端destory 结束");
    }


    // // 字符串编码器（与服务端相同）
    // class StringEncoder extends MessageToByteEncoder<String> {
    //     @Override
    //     protected void encode(ChannelHandlerContext ctx, String msg, ByteBuf out) throws Exception {
    //         out.writeBytes(msg.getBytes());
    //     }
    // }
    //
    // // 字符串解码器（与服务端相同）
    // class StringDecoder extends ByteToMessageDecoder {
    //     @Override
    //     protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
    //         int length = in.readableBytes();
    //         byte[] bytes = new byte[length];
    //         in.readBytes(bytes);
    //         out.add(new String(bytes));
    //     }
    // }
    //
    // // 二进制字节数组编码器（与服务端相同）
    // class ByteArrayEncoder extends MessageToByteEncoder<byte[]> {
    //     @Override
    //     protected void encode(ChannelHandlerContext ctx, byte[] msg, ByteBuf out) throws Exception {
    //         out.writeBytes(msg);
    //     }
    // }
    //
    // // 二进制字节数组解码器（与服务端相同）
    // class ByteArrayDecoder extends ByteToMessageDecoder {
    //     @Override
    //     protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
    //         int length = in.readableBytes();
    //         byte[] bytes = new byte[length];
    //         in.readBytes(bytes);
    //         out.add(bytes);
    //     }
    // }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/28 16:57
     * @Description: 处理字节数组 , 客户端 只添加字节解析器 与 本处理器，字节数组相关的数据能进到这里
     * @Params:
     * @Return:
     */
    class BinaryDataHandler extends SimpleChannelInboundHandler<byte[]> {

        @Override
        protected void channelRead0(ChannelHandlerContext ctx, byte[] msg) throws Exception {
            // 在此处处理接收到的二进制字节数组
            System.out.println("Received binary data: " + new String(msg));
        }
    }

}
```

#### NettyMecClientHandler



```java
package com.graphsafe.cadxlk.utils.netty.client;

import com.graphsafe.cadxlk.module.mec.MecAllAnalysisPo;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.ChannelInboundHandlerAdapter;
import io.netty.handler.timeout.IdleState;
import io.netty.handler.timeout.IdleStateEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

/**
 * @author : shenyabo
 * @date : Created in 2024-06-22 10:45
 * @description : NettyV2xClientHandler 客户端处理消息
 * @modified By :
 * @version: : v1.0
 */

@Component
@ChannelHandler.Sharable
@Slf4j
public class NettyMecClientHandler extends ChannelInboundHandlerAdapter {


    @Value("${mycustomer.socket.netty.client.reconnect-time}")
    private Integer nettyClientReconnectTime = 10;

    @Value("${mycustomer.socket.netty.client.empty-read-time}")
    private Integer nettyClientEmptyReadTime = 10;


    @Autowired
    private NettyMecClient nettyV2xClient;


    @Autowired
    private AsyncNettyClientHandle asyncNettyClientHandle;

    // 服务器端读取到 客户端发送过来的数据，然后通过 Channel 回写数据
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) {
        MecAllAnalysisPo mecAllAnalysisPo = asyncNettyClientHandle.nettyHandle(ctx, msg);
        // ctx.channel().writeAndFlush(String.format("server write:%s", msg));
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/24 17:28
     * @Description: 当被服务器超时断开链接以后  触发重连机制
     * @Params: [ctx]
     * @Return: void
     */
    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {

        // 在这里处理服务器断开连接的情况
        log.info("与服务端断开连接，{} 秒后重连",nettyClientReconnectTime);
        ctx.channel().eventLoop().schedule(() -> {
            try {
                nettyV2xClient.connect();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }, nettyClientReconnectTime, TimeUnit.MILLISECONDS);
    }


    // 捕获到异常的处理
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        cause.printStackTrace();
        ctx.close();
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/28 18:23
     * @Description: 客户端对应的读写的超时 对应的 操作
     * @Params: [ctx, evt]
     * @Return: void
     */
    @Override
    public void userEventTriggered(ChannelHandlerContext ctx, Object evt) {

        if (evt instanceof IdleStateEvent) {
            IdleStateEvent e = (IdleStateEvent) evt;
            if (e.state() == IdleState.READER_IDLE) {
                log.info("客户端 :{},  {}s 内没收到服务端的消息， 将发送心跳包给服务端",ctx.channel().id(),nettyClientEmptyReadTime);
                // 如果读空闲超时，关闭连接
                // ctx.close();
                // 写心跳包
                ctx.channel().writeAndFlush("client heartbeat");
            }
            else if (e.state() == IdleState.WRITER_IDLE) {
                // 写心跳包
                // ctx.channel().writeAndFlush("heartbeat");
            } else if (e.state() == IdleState.ALL_IDLE) {

            }
        }

    }


}
```


#### 额外的异步处理 类 AsyncNettyClientHandle



```java

package com.graphsafe.cadxlk.utils.netty.client;

import com.alibaba.fastjson.JSONObject;
import com.graphsafe.cadxlk.config.mycustomer.MyKafkaTopicProps;
import com.graphsafe.cadxlk.constant.CommonConstant;
import com.graphsafe.cadxlk.module.mec.MecAllAnalysisPo;
import com.graphsafe.cadxlk.module.mec.RealTimeTrafficFlow;
import com.graphsafe.cadxlk.module.mec.TrafficFlowPerSecond;
import com.graphsafe.cadxlk.utils.DataCheckUtil;
import com.graphsafe.cadxlk.utils.DateTimeUtils;
import com.graphsafe.cadxlk.utils.NumberUtils;
import com.graphsafe.cadxlk.utils.kafkautils.KafkaProducer;
import io.netty.channel.ChannelHandlerContext;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import java.net.SocketAddress;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static com.graphsafe.cadxlk.constant.CommonConstant.selfCarlatlongDecimal;

/**
 * @author : shenyabo
 * @date : Created in 2024-06-27 11:06
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Component
@Slf4j
public class AsyncNettyClientHandle {


    // @Autowired
    // private ThreadPoolTaskExecutor nettyClientHandleThreadPoolExecutor;

    @Autowired
    MyKafkaTopicProps myKafkaTopicProps;


    @Autowired
    KafkaProducer kafkaProducer;

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/27 11:13
     * @Description: 异步处理netty 客户端 消息，并姜处理后的消息发送到kafka
     * @Params: [ctx, msg]
     * @Return: com.graphsafe.cadxlk.module.mec.MecAllAnalysisPo
     */
     // 线程池
    @Async("nettyClientHandleThreadPoolExecutor")
    public MecAllAnalysisPo nettyHandle(ChannelHandlerContext ctx, Object msg) {
        // ThreadPoolExecutor executor = nettyClientHandleThreadPoolExecutor.getThreadPoolExecutor();
        // int size = executor.getQueue().size();
        // log.info("客户端 解析到新数据，解析线程:{}  目前 nettyClientHandleThreadPoolExecutor 队列中任务数量:[{}]", Thread.currentThread().getName(), executor.getQueue().size());


        // socket 服务端的传过来需要进行解析的数据
        String handleStr = "";

        // SocketAddress socketAddress = ctx.channel().remoteAddress();

        if (msg instanceof String) {
            handleStr = msg.toString();
            // log.info("客户端读取到从服务端:{} 发送过来的 《字符串》数据：{}", socketAddress, handleStr);
            // 处理 mec 数据
        } else if (msg instanceof byte[]) {
            // handleStr = new String((byte[]) msg);
            // 这里需要将字节数组转为 16进制字符串
            handleStr = DataCheckUtil.ByteToHex((byte[]) msg);

            // 55aa55bb 这种的挨着的
            // log.info("客户端读取到从服务端:{} 发送过来的 《二进制字节数组》数据转为16进制字符串为：{}", socketAddress, handleStr);

        }

        // 处理str 数据

        // 如果按照正常逻辑到这里 因该是16进制 字符串
        return this.nettyHandleStr(handleStr);
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/27 14:39
     * @Description: 将 client 解析过来的 str 16进制字符串进行 解析成对应实体
     * @Params: [nettyClientStr]
     * @Return: com.graphsafe.cadxlk.module.mec.MecAllAnalysisPo
     */
    public MecAllAnalysisPo nettyHandleStr(String nettyClientStr) {

        MecAllAnalysisPo result = new MecAllAnalysisPo();


        /**
         * 将 字节数组转为的 string 字符串 进行处理
         * 55aa55bb******  ->  55 AA 55 BB
         * 1. 转为大写
         * 2. 两个字符为一组 中间加空格
         * 3. 进行粘包脏值剔除
         * 4. 校验完整性
         * 5. 进行主字段解析
         * 判断  55 AA 55 BB 、 55 CC 55 DD 所在位置进行字符串截取
         */

        // log.info("数据处理前:{}", nettyClientStr);

        nettyClientStr = nettyClientStr.toUpperCase();

        // log.info("转为大写:{}", nettyClientStr);


        //正则表达式 每两个字符串后加上空格  到这里的string为: 55aa55bb 挨着的，需要两个字符为一组
        String regex = "(.{2})";
        nettyClientStr = nettyClientStr.replaceAll(regex, "$1 ");
        // log.info("Netty 两字符一组 加完空格：{}", nettyClientStr);


        /**
         * 1 粘包处理（看线上数据貌似没有存在粘包 数据 但是这里 留一个粘包操作）  操作返回就是一条完整德 55 AA 55 BB 数据
         */
        String nettyClientStrstickyHandle = stickyPackageHandle(nettyClientStr);

        // 为空则说明粘包处理有问题
        if (nettyClientStrstickyHandle != null) {
            /**
             * 2 通过 55 AA 55 BB   -   55 CC 55 DD  进行 校验和验证
             * 第四项 校验和  与  5-7 项之间的数据进行校验
             * 返回true 说明数据校验成功
             */

            // 临时给定一个值（测试使用）
            // nettyClientStrstickyHandle = "55 AA 55 BB 00 44 01 3D 32 32 43 30 37 33 34 30 00 00 00 00 00 00 00 00 00 00 00 00 18 07 03 09 23 16 00 94 00 D5 1F 02 32 14 0F FF FF FF 00 01 FF A6 50 82 FF CE 03 16 0B 21 00 00 FF A6 00 00 47 86 8B A2 11 E1 EB 52 55 CC 55 DD ";

            Boolean checksumFlag = checksumVerification(nettyClientStrstickyHandle);

            // 通过校验和验证 进行数据逐字段解析
            if (checksumFlag) {
                // 进行数据解析
                Map<String, Object> validity = analysisData(nettyClientStrstickyHandle, result);
                if ((Boolean) validity.get("result")) {
                    // log.info("解析mec 数据成功");
                }
            }
        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/7/3 14:07
     * @Description: 对mec 雷达 毫米波雷达数据的 转成的  16进制 字符串进行粘包处理
     * @Params: [nettyClientStr]
     * @Return: java.lang.String
     */

    private String stickyPackageHandle(String nettyClientStr) {


        String resultstr = null;
        /**
         * 处理粘包问题，截取完整的数据包，剔除不完整的数据包
         * 1. 处理思路  以  55 AA 55 BB 开头  55 CC 55 DD 结尾的数据且  中间没有 55 AA 55 BB 则说明是一条完整的数据
         */

        // 记录出现了几次  55 AA 55 BB
        int count = 0;
        Pattern pattern = Pattern.compile(CommonConstant.mecStarTagStr);
        Matcher matcher = pattern.matcher(nettyClientStr);
        while (matcher.find()) {
            count++;
        }

        if (count == 1 && nettyClientStr.startsWith(CommonConstant.mecStarTagStr) && nettyClientStr.endsWith(CommonConstant.mecEndTagStr)) {
            resultstr = nettyClientStr;
            // log.info("socket 直接就是完整一条数据:{}", nettyClientStr);

        } else {
            // log.info("socket 带有粘包问题的数据:{}", nettyClientStr);


            /**
             * 1. 从第一个  55 AA 55 BB  到 第一个   55 CC 55 DD 之间 作为一条数据取出
             String mecStarTagStr = "55 AA 55 BB";
             String mecEndTagStr = "55 CC 55 DD";


             */

            /***
             * 取出来粘包中的完整第一条数据
             *
             * 例如 ：   String str = "some text 55 AA 55 BB middle text 55 CC 55 DD other text";
             */

            // 构建正则表达式
            // String regex = "55 AA 55 BB([^55 CC 55 DD]*)55 CC 55 DD";
            String regex = "55 AA 55 BB.*?55 CC 55 DD";
            Pattern pattern2 = Pattern.compile(regex);
            Matcher matcher2 = pattern2.matcher(nettyClientStr);
            if (matcher2.find()) {
                String one55Data = matcher2.group();
                // log.info("处理粘包 :{} 操作取出来第一条完整数据:{}", regex, one55Data);
                resultstr = one55Data;
            } else {
                // log.info("处理粘包 :{} 未能匹配到完整一条数据 :{}", regex, nettyClientStr);
            }
        }

        return resultstr;
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/7/3 14:58
     * @Description: 验证  mec 55 AA 数据校验值
     * @Params: [nettyClientStrstickyHandle]
     * @Return: java.lang.Boolean
     */
    private Boolean checksumVerification(String nettyClientStrstickyHandle) {

        // 默认不通过
        Boolean flag = false;

        String[] split = nettyClientStrstickyHandle.split(CommonConstant.blankSpace);
        /**
         * 55 AA 55 BB 00 44 01 3D 32 32 43 30 37 33 34 30 00 00 00 00 00 00 00 00 00 00 00 00 18 07 03 09 23 16 00
         * 94 00 D5 1F 02 32 14 0F FF FF FF 00 01 FF A6 50 82 FF CE 03 16 0B 21 00 00 FF A6 00 00 47 86 8B A2 11 E1 EB 52 55 CC 55 DD
         */

        // 校验和 是 第四项数据 数组第八
        String nettyStrBlank = split[7];
        // 将校验和的 16进制字符串转为10进制数据作为最后的一个校验和
        int checkSum = Integer.parseInt(nettyStrBlank, 16);

        /**
         * 5-7 累加
         *
         * 下标
         * 8 - (split.length - 5)
         */

        int calculatedSum = 0;
        for (int i = 8; i <= (split.length - 5); i++) {
            calculatedSum += Integer.parseInt(split[i], 16);
        }
        //取低八位
        int lastTwoDigits = calculatedSum & 0xFF;

        // //将整数lastTwoDigits 转换为对应的十六进制字符串
        // String finalSum = Integer.toHexString(lastTwoDigits);
        // //将校验和转换为整数
        // int num1 = Integer.parseInt(finalSum, 16);


        // 16进制转为十进制

        if (checkSum == lastTwoDigits) {
            flag = true;
            log.info("校验 55 AA 数据 nettyClientStrstickyHandle 校验通过√:{}", nettyClientStrstickyHandle);
        } else {
            flag = false;
            log.info("校验 55 AA 数据 nettyClientStrstickyHandle 校验失败❌:{}", nettyClientStrstickyHandle);
        }


        return flag;


    }

    /**
     * @return
     * @Author: shenyabo
     * @Date: Create in 2024/6/28 14:03
     * @Description: 根据netty 客户端接收到的16 进制字符串 进行 验证
     * @Params: [nettyClientStr, 结果对象存储容器 ]
     * 返回： {result:true/false,msg:"验证成功/验证失败（失败原因）"}
     * @Return: java.util.Map<java.lang.String, java.lang.Object>
     */
    private Map<String, Object> analysisData(String nettyClientStr, MecAllAnalysisPo mecAllAnalysisPo) {
        String[] analysisSplit = nettyClientStr.split(CommonConstant.blankSpace);

        // 将字符串进行解析 mec 数据
        // 55 AA 55 BB 01 40 01 0F 32 32 36 33 33 31 36 38 00 00 00 00 00 00 00 00 00 00 00 00 17 07 11 10 15 38 01 C1 0B 37 21 02 32 14 0F FF FF FF 04 2B FF 2E D3 40 00 32 07 E4 1C 6A 00 00 00 B4 00 00 47 D0 D5 56 11 F3 94 56 0B 38 20 02 32 14 0F FF FF FF 04 38 FD F8 D1 B0 00 5A 08 B6 1F 62 00 00 00 00 00 00 47 D0 D4 1E 11 F3 95 C4 0B 39 20 02 32 14 0F FF FF FF 04 02 FD EE B1 D0 FF 7E 08 0C 1D 06 00 00 FE E8 00 00 47 D0 B4 46 11 F3 9D 99 0B 3A 1F 02 32 14 0F FF FF FF 04 21 FC 72 88 86 00 0A 08 0C 1C F8 00 00 00 00 00 00 47 D0 8B 6F 11 F3 A8 FB 0B 3B 21 02 32 14 0F FF FF FF 04 26 FE 84 73 F0 00 00 07 76 1A DC 00 00 00 00 00 00 47 D0 76 47 11 F3 AC 39 0B 3E 20 02 32 14 0F FF FF FF 04 27 FD 6C 39 DA 00 1E 08 20 1D 40 00 00 00 B4 FF A6 47 D0 3C 8B 11 F3 BB 61 0B 3F 20 02 32 14 0F FF FF FF 04 18 FD 58 1E DC FF F6 09 10 20 A0 00 00 00 00 00 5A 47 D0 21 97 11 F3 C2 0C 0B 3D 21 02 32 14 0F FF FF FF 04 24 FF C4 8A CA 00 00 09 24 20 E7 00 00 FF A6 00 00 47 D0 8C C2 11 F3 A5 8E 55 CC 55 DD
        // 32 32 36 33 33 31 36 38 00 00 00 00 00 00 00 00 00 00 00 00 17 07 11 10 15 38 01 C1 0B 37 21 02 32 14 0F FF FF FF 04 2B FF 2E D3 40 00 32 07 E4 1C 6A 00 00 00 B4 00 00 47 D0 D5 56 11 F3 94 56 0B 38 20 02 32 14 0F FF FF FF 04 38 FD F8 D1 B0 00 5A 08 B6 1F 62 00 00 00 00 00 00 47 D0 D4 1E 11 F3 95 C4 0B 39 20 02 32 14 0F FF FF FF 04 02 FD EE B1 D0 FF 7E 08 0C 1D 06 00 00 FE E8 00 00 47 D0 B4 46 11 F3 9D 99 0B 3A 1F 02 32 14 0F FF FF FF 04 21 FC 72 88 86 00 0A 08 0C 1C F8 00 00 00 00 00 00 47 D0 8B 6F 11 F3 A8 FB 0B 3B 21 02 32 14 0F FF FF FF 04 26 FE 84 73 F0 00 00 07 76 1A DC 00 00 00 00 00 00 47 D0 76 47 11 F3 AC 39 0B 3E 20 02 32 14 0F FF FF FF 04 27 FD 6C 39 DA 00 1E 08 20 1D 40 00 00 00 B4 FF A6 47 D0 3C 8B 11 F3 BB 61 0B 3F 20 02 32 14 0F FF FF FF 04 18 FD 58 1E DC FF F6 09 10 20 A0 00 00 00 00 00 5A 47 D0 21 97 11 F3 C2 0C 0B 3D 21 02 32 14 0F FF FF FF 04 24 FF C4 8A CA 00 00 09 24 20 E7 00 00 FF A6 00 00 47 D0 8C C2 11 F3 A5 8E 55 CC 55 DD
        /**
         * 55 AA 55 BB
         * 01 40
         * 01
         * 0F
         *
         * 32 32 36 33 33 31 36 38 00 00 00 00 00 00 00 00 00 00 00 00
         *
         */
        /**
         * 按照 小端解析存储
         * 1 【0-3】包头 (4 字节)： 55 AA 55 BB
         *   解析： 55AA55BB
         *      将16进制字符串直接转 10进制  =  1437226427
         *
         * 2 【4-5】数据长度(2字节  2~7 的字节总长度)： 01 40
         *   解析： 0140
         *      将16进制字符串直接转 10进制  = 320
         * 3 【6】数据帧类型(1字节)： 01
         *   解析： 01
         *      将16进制字符串直接转 10进制  = 1
         * 4 【7】校验和 (1字节 ) 5-7 参与校验: 0F
         *   解析： 0F
         *      将16进制字符串直接转 10进制  = 15
         * 5 【8-27】设备编号 (20 字节) : 32 32 36 33 33 31 36 38 00 00 00 00 00 00 00 00 00 00 00 00
         *   取自设备安装参数 设备编号最大 20 个字节，取自设备安装参数中的设备编号。每个字节代表
         *      解析： 32 32 36 33 33 31 36 38 00 00 00 00 00 00 00 00 00 00 00 00
         *          将对应的每个字符对应的asic 值拼接起来 ：22633168
         *      一个字符的 ASIC 码。例如：
         *      设备编号为：0000001
         *      DEV_ID：0x30 0x30 0x30 0x30 0x30 0x30 0x31
         *      0x30 对应ASIC 就是数字0
         *      0x31 对应ASIC 就是数字1
         *      设备编号这里往后累加就是设备编号：
         * 6 【28-35】数据时间戳 8 数据发送的时间（精确到 ms）
         *
         * 7 【36-a】目标数据
         *
         * 8 数据结束标志  55 CC
         */
        Map<String, Object> resultMap = new HashMap<>();
        Boolean analysis = true;
        // 默认
        String analysisMsg = "解析成功";


        /**
         * 数据解析开始
         */

        // 1. 数据类型
        // [6]数据帧类型(1字节)： 01


        // 0x01：ObjectData
        // 0x02：RawTargetData
        // 0x03：TrafficData


        String dataType = analysisSplit[6];
        int dataTypeInt = Integer.parseInt(dataType, 16);

        // 1 数据类型
        mecAllAnalysisPo.setMecType(dataTypeInt);

        // 2 设备编号：
        getDeviceNomberFromAnalysisSplit(analysisSplit, mecAllAnalysisPo);

        // 3 时间
        getDateFromAnalysisSplit(analysisSplit, mecAllAnalysisPo);


        switch (dataTypeInt) {

            case 1: {
                try {
                    // 目标轨迹数据 - 实时车流数据
                    mecAllAnalysisPo.setTopic(myKafkaTopicProps.getMecTopicRealTimeTrafficFlow());
                    realTrafficAnalysis(analysisSplit, mecAllAnalysisPo);
                    // if (mecAllAnalysisPo.getRealTimeTrafficFlow().getTargetList().size() > 0) {
                    //
                    // }

                    // 只有解析出来有数据 才会放到kafka 中
                    kafkaProducer.sendTxtMsgWithNowTimeKey(mecAllAnalysisPo.getTopic(), JSONObject.toJSONString(mecAllAnalysisPo.getRealTimeTrafficFlow()));
                    log.info("1 mec 解析一条实时车流数据：【{}】成功转为对象:{}", nettyClientStr, mecAllAnalysisPo.getRealTimeTrafficFlow().toString());
                } catch (Exception ex) {
                    log.error("1 mec 解析一条实时车流数据：【{}】出错,错误为:", nettyClientStr, ex);
                    analysis = false;
                    analysisMsg = "1 mec 解析一条实时车流数据解析出错：" + ex.getMessage();
                }

                break;
            }
            case 2: {


                try {
                    // 点云数据 - 点云原始数据
                    mecAllAnalysisPo.setTopic(myKafkaTopicProps.getMecTopicCdStationPointcloud());
                    pointCloudAnalysis(analysisSplit, mecAllAnalysisPo);
                    // 暂时原封不动姜55 AA 55 BB 发到kafka上
                    kafkaProducer.sendTxtMsgWithNowTimeKey(mecAllAnalysisPo.getTopic(), nettyClientStr);

                    log.info("2 mec 解析一条点云：【{}】", nettyClientStr);
                } catch (Exception ex) {
                    log.error("2 mec 解析一条点云：【{}】出错,错误为:", nettyClientStr, ex);
                    analysis = false;
                    analysisMsg = "2 mec 解析一条点云出错：" + ex.getMessage();
                }


                break;
            }
            case 3: {


                try {
                    // 交通流量统计数据 - 每秒车流统计
                    mecAllAnalysisPo.setTopic(myKafkaTopicProps.getMecTopicTrafficFlowPerSecond());
                    flowPerSecondAnalysis(analysisSplit, mecAllAnalysisPo);
                    kafkaProducer.sendTxtMsgWithNowTimeKey(mecAllAnalysisPo.getTopic(), JSONObject.toJSONString(mecAllAnalysisPo.getTrafficFlowPerSecond()));


                    log.info("3 mec 解析一条每秒车流数据：【{}】成功转为对象:{}", nettyClientStr, mecAllAnalysisPo.getTrafficFlowPerSecond().toString());
                } catch (Exception ex) {
                    log.error("3 mec 解析一条实时车流数据：【{}】出错,错误为:", nettyClientStr, ex);
                    analysis = false;
                    analysisMsg = "3 mec 解析一条实时车流数据解析出错：" + ex.getMessage();
                }

                break;
            }
            default: {
                log.info("mec 数据类型 转为 10进制 出现 预期之外数据类型");
            }

        }


        resultMap.put("result", analysis);
        resultMap.put("msg", analysisMsg);
        resultMap.put("nettyValidityMsg", mecAllAnalysisPo);


        return resultMap;
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/7/3 17:11
     * @Description: 解析设备编号  8-27  对应asci 表的值
     * @Params: [analysisSplit, mecAllAnalysisPo]
     * @Return: void
     */
    private void getDeviceNomberFromAnalysisSplit(String[] analysisSplit, MecAllAnalysisPo mecAllAnalysisPo) {

        StringBuffer sb = new StringBuffer();
        for (int i = 8; i <= 27; i++) {
            // 16进制的字符串，
            String deviceUnmberSingle = analysisSplit[i];

            int decimal = Integer.parseInt(deviceUnmberSingle, 16);
            char character = (char) decimal;
            sb.append(character);
        }
        String deviceStar = sb.toString();
        // 这里需要将后面所有的0 都给删掉
        String deviceNo = deviceStar.replaceAll("0+$", "");
        mecAllAnalysisPo.setDeviceNumber(deviceNo);
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/7/3 17:29
     * @Description:
     * @Params: [analysisSplit, mecAllAnalysisPo]
     * @Return: void
     */

    private void getDateFromAnalysisSplit(String[] analysisSplit, MecAllAnalysisPo mecAllAnalysisPo) {

        // 序号  Byte1 Byte2 Byte3 Byte4 Byte5 Byte6 Byte7 Byte8
        // 功能   year month  day   hour  min    sec      ms
        // year
        int year = 2000 + Integer.parseInt(analysisSplit[28], 16);
        int month = Integer.parseInt(analysisSplit[29], 16);
        int day = Integer.parseInt(analysisSplit[30], 16);
        int hour = Integer.parseInt(analysisSplit[31], 16);
        int min = Integer.parseInt(analysisSplit[32], 16);
        int sec = Integer.parseInt(analysisSplit[33], 16);
        int ms = Integer.parseInt(analysisSplit[34] + analysisSplit[35], 16);


        mecAllAnalysisPo.setLocalDateTime(LocalDateTime.of(year, month, day, hour, min, sec, ms * 1000000));


    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2024/7/3 16:37
     * @Description: 目标轨迹数据 - 实时车流数据 解析 【36- a 】目标数据
     * @Params: [analysisSplit, mecAllAnalysisPo]
     * @Return: void
     */
    private void realTrafficAnalysis(String[] analysisSplit, MecAllAnalysisPo mecAllAnalysisPo) {

        /**
         * 在第七项中 从 analysisSplit 36 开始 到后面 ； 每个对象的值 36 个字节  ，最多 256 个 对象
         */
        RealTimeTrafficFlow realTimeTrafficFlow = new RealTimeTrafficFlow();


        mecAllAnalysisPo.setRealTimeTrafficFlow(realTimeTrafficFlow);
        // 1 todo_后续可能会补 数据帧号
        // String frameNum16Str = analysisSplit[curObjStart] + analysisSplit[curObjStart + 1];
        // int frameNum = Integer.parseInt(frameNum16Str, 16);
        // 其实不用下面一行代码， 但是这里意思就是 数据帧号 这里 mec 雷达数据那边没有 所以这里显式明确给一个值
        realTimeTrafficFlow.setFrameNum(0);

        // 2 全域上报时间 数据时间戳
        realTimeTrafficFlow.setGlobalTime(DateTimeUtils.date2str(mecAllAnalysisPo.getLocalDateTime(), DateTimeUtils.yyyy_MM_DD_HH_mm_ss_SSS));

        // 参与者数量  参与者集合
        List<RealTimeTrafficFlow.Target> targetList = new ArrayList<>();

        for (int i = 36; i <= analysisSplit.length - 5; i += 36) {
            // 对第n个对象 进行解析
            int curObjStart = i;

            RealTimeTrafficFlow.Target target = new RealTimeTrafficFlow.Target();

            //20240719，沒有數據先暫時去掉，不推送到kafka中
            // RealTimeTrafficFlow.EventInfo event = new RealTimeTrafficFlow.EventInfo();
            //             // target.setEventInfo(event);


            /**
             * 解析 mec 数据
             */
            /**
             * i+ (2-1) =  36+1
             *  1 目标编号 US 2 循环 ID 分配 取值：0~65535
             *  对应 三维需要的
             *  frameNum	TRUE	Int	数据帧号
             */
            String targetNum16Str = analysisSplit[curObjStart] + analysisSplit[curObjStart + 1];
            int targetNum = Integer.parseInt(targetNum16Str, 16);

            /**
             * 2 目标所属车道号 (36 + 2 )
             *
             */

            String laneStr = analysisSplit[curObjStart + 2];
            int lane = Integer.parseInt(laneStr, 16);

            /**
             * 3 车辆类型  (36 + 3)
             */
            String carTypeStr = analysisSplit[curObjStart + 3];
            int carType = Integer.parseInt(carTypeStr, 16);


            /**
             * 4 目标长度 1 (36 + 4)
             *
             * 车辆车身长度，单位 m
             * 表示范围（0~25.5m）数值 0 表示无效数据
             * 保留 1 位小数，分辨率为 0.1m
             */
            String targetlengthStr = analysisSplit[curObjStart + 4];
            int carTypei = Integer.parseInt(targetlengthStr, 16);
            // long tarlengthl = Long.parseLong(targetlengthStr, 16);
            // float tarlengthf = Float.intBitsToFloat((int) tarlengthl);


            /**
             * 5 目标宽度 1(36 + 5)
             */
            String targetWidthStr = analysisSplit[curObjStart + 5];
            int targetWidthi = Integer.parseInt(targetWidthStr, 16);
            // long targetWidthl = Long.parseLong(targetWidthStr, 16);
            // float targetWidthf = Float.intBitsToFloat((int) targetWidthl);


            /**
             *6 目标高度 1 (36 + 6)
             */
            String targetHeightStr = analysisSplit[curObjStart + 6];
            int targetHeighti = Integer.parseInt(targetHeightStr, 16);
            // long targetHeightl = Long.parseLong(targetHeightStr, 16);
            // float targetHeightf = Float.intBitsToFloat((int) targetHeightl);
            /**
             * 7 保留  3   + 789   [xFFFFFF]
             */
            // String saveStr = analysisSplit[curObjStart + 7] + analysisSplit[curObjStart + 8] + analysisSplit[curObjStart + 9];


            /**
             * 8 目标偏航角 1 + 10 11
             * 目标当前在地理上的行驶方向。取值范围
             * 0~3599，表示 0~359.9
             *  正北为 0
             * ，沿着顺时针方向计算。分辨率为
             * 0.1
             */
            String angleStr = analysisSplit[curObjStart + 10] + analysisSplit[curObjStart + 11];
            int angle = Integer.parseInt(angleStr, 16);


            /**
             * 9  x 坐标 + 12 13
             * 目标检测物相对于雷达坐标系的坐标 X，单
             * 位为 m
             * 分辨率为 0.01m
             *
             */

            String xPointStr = analysisSplit[curObjStart + 12] + analysisSplit[curObjStart + 13];
            int xPointi = Integer.parseInt(xPointStr, 16);


            /**
             * 10  y 坐标 + 14 15
             * 目标检测物相对于雷达坐标系的坐标 X，单
             * 位为 m
             * 分辨率为 0.01m
             *
             */

            String yPointStr = analysisSplit[curObjStart + 14] + analysisSplit[curObjStart + 15];
            int yPointi = Integer.parseInt(yPointStr, 16);


            /**
             * 11  x 轴速度   + 16 17
             * 目标检测物相对于雷达坐标系的 X 轴速度，
             * 单位为 m/s
             * 分辨率为 0.01m/s
             */

            String xSpeedStr = analysisSplit[curObjStart + 16] + analysisSplit[curObjStart + 17];
            int xSpeed = Integer.parseInt(xSpeedStr, 16);

            /**
             * 12  y 轴速度   + 18 19
             * 目标检测物相对于雷达坐标系的 Y 轴速度，
             * 单位为 m/s
             * 分辨率为 0.01m/s
             */

            String ySpeedStr = analysisSplit[curObjStart + 18] + analysisSplit[curObjStart + 19];
            int ySpeed = Integer.parseInt(ySpeedStr, 16);

            /**
             * 13  车速度   + 20 21
             * 目标检测物的换算速度，单位 km/h
             * 分辨率为 0.01km/h
             * 远离雷达，值为正；靠近雷达，值为负。
             */

            String carSpeedStr = analysisSplit[curObjStart + 20] + analysisSplit[curObjStart + 21];
            int carSpeed = Integer.parseInt(carSpeedStr, 16);


            /**
             * 14  目标运动方向加速度  + 22 23
             * 目标检测物运动方向的加速度，单位 m/s2
             * 取值范围：（-15,15）
             * 分辨率为 0.01 m/s
             */

            String carDirectionAccelerationStr = analysisSplit[curObjStart + 22] + analysisSplit[curObjStart + 23];
            int carDirectionAcceleration = Integer.parseInt(carDirectionAccelerationStr, 16);


            /**
             * 15  x轴加速度  + 24 25
             *
             *目标检测物相对于雷达坐标系的 X 轴加速
             * 度，单位 m/s2，取值范围：（-15,15）
             * 分辨率为 0.01m/s
             *
             */

            String carXAccelerationStr = analysisSplit[curObjStart + 24] + analysisSplit[curObjStart + 25];
            int carXAcceleration = Integer.parseInt(carXAccelerationStr, 16);


            /**
             * 16  y轴加速度  + 26 27
             *
             *目标检测物相对于雷达坐标系的 Y 轴加速
             *度，单位 m/s2，取值范围：（-15,15）
             */

            String carYAccelerationStr = analysisSplit[curObjStart + 26] + analysisSplit[curObjStart + 27];
            int carYAcceleration = Integer.parseInt(carYAccelerationStr, 16);


            /**
             * 17  目标坐标点经 + 28 29 30 31
             * 目标的坐标点经度定义经度数值，东经为正，
             * 西经为负
             * 范围(-1799999999~1800000001）
             * 单位：1/10 微度的单位，分辨率为 1e-7° units of 1/10 micro degree
             * 提供正负 180 度的范围-1800000000 到
             * 1800000000
             */

            String lonStr = analysisSplit[curObjStart + 28] + analysisSplit[curObjStart + 29]
                    + analysisSplit[curObjStart + 30] + analysisSplit[curObjStart + 31];
            int lon = Integer.parseInt(lonStr, 16);

            /**
             * 18  目标坐标点纬 + 32 33 34 35
             * 目标的坐标点纬度定义纬度数值，北纬为正，
             * 南纬为负。
             * 范围(-900000000~900000001）
             * 单位：1/10 微度的单位，分辨率为 1e-7° units of 1/10 micro degree
             * 提供正负 90
             *
             */

            String latStr = analysisSplit[curObjStart + 32] + analysisSplit[curObjStart + 33]
                    + analysisSplit[curObjStart + 34] + analysisSplit[curObjStart + 35];
            int lat = Integer.parseInt(latStr, 16);


            /**
             * 1 设置 targetlist
             */
            // 参与者全域ID，唯一值；
            // targetlist 全域 id
            target.setId(targetNum);

            // 车辆类型
            target.setCarType(carType);

            // todo 车辆颜色

            // 分辨率1e-7°，东经为正，西经为负
            // target.setLon(lon * 10);

            target.setLon(NumberUtils.intToEnDoubleLatLong(lon, -7, selfCarlatlongDecimal));

            // 分辨率1e-7°，北纬为正，南纬为负
            target.setLat(NumberUtils.intToEnDoubleLatLong(lat, -7, selfCarlatlongDecimal));

            // 速度，单位：Km/h
            target.setSpeed(carSpeed * 0.01);


            // 航向角，单位：°，保留1位小数，车头与正北夹角
            double angled = (double) angle * 0.1;
            target.setAngle(angled);


            // 车道号，沿行车方向从左往右依次为1,2,3,4…,0表示无法确
            target.setLane(lane);
            // 事件信息


            // 2 todo 设置 event 事件 一个没找到对应的值,后期如果mec 数据里面给了 在这里 赋值就行
            // 事件id
            // event.setEventId();
            // 事件类型 -- 参考：附录-事件类型列表
            // 事件已存在时间 例如 60s  60m
            // 事件开始时间
            // 事件纬度
            // 事件经度


            targetList.add(target);

        }

        // 设置targetList
        realTimeTrafficFlow.setTargetList(targetList);
        // 设置参与者数量
        realTimeTrafficFlow.setTargetNum(targetList.size());

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/7/3 16:39
     * @Description: 点云数据 - 点云原始数据
     * @Params: [analysisSplit, mecAllAnalysisPo]
     * @Return: void
     */
    private void pointCloudAnalysis(String[] analysisSplit, MecAllAnalysisPo mecAllAnalysisPo) {
        /**
         * 在第七项中 每个对象的值 8 个字节  ，最多 1024 个 对象
         */
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/7/3 16:39
     * @Description: 交通流量统计数据 - 每秒车流统计
     * @Params: [analysisSplit, mecAllAnalysisPo]
     * @Return: void
     */
    private void flowPerSecondAnalysis(String[] analysisSplit, MecAllAnalysisPo mecAllAnalysisPo) {
        /**
         * 在第七项中 从 36 开始 [36 - a ]每个对象的值 22 个字节  ，最多 64 个 对象
         */


        TrafficFlowPerSecond trafficFlowPerSecond = new TrafficFlowPerSecond();


        // 1 当日车流量  循环累加赋值以后再赋值
        int todayNum = 0;
        // trafficFlowPerSecond.setTodayNum();


        // 2 全域上报时间 数据时间戳
        trafficFlowPerSecond.setTimeStamp(DateTimeUtils.date2str(mecAllAnalysisPo.getLocalDateTime(), DateTimeUtils.yyyy_MM_DD_HH_mm_ss_SSS));

        // 3 todo 瞬时数据帧号 0
        // trafficFlowPerSecond.setEventFrameId();

        // 4  todo laneNum	TRUE	Int	车道数量：针对进口停止线以内区域
        // trafficFlowPerSecond.setLaneNum();
        // 记录解析出来的 车道号， 用于统计车道数量
        List<Integer> lanNumList = new ArrayList<>();


        // 5 参与者数量  参与者集合

        List<TrafficFlowPerSecond.LaneEvent> eventList = new ArrayList<>();
        trafficFlowPerSecond.setEventList(eventList);

        for (int i = 36; i <= analysisSplit.length - 5; i += 22) {
            TrafficFlowPerSecond.LaneEvent event = new TrafficFlowPerSecond.LaneEvent();


            /**
             * 1先解析数据字段
             */


            /**
             * [36 , 36+1]
             * 1.1 统计周期
             * 最小单位：1 分钟。
             * 取值：1、5、10，分别表示统计周期为 1 分
             * 钟、5 分钟和 10 分钟。
             * 雷达上报时需要在整点上报。
             * 例如：
             * 1、周期为 5 分钟时，在 5 分，10 分，15 分...... 时上报。
             * 2、周期为 10 分钟时，在 10 分、20 分，30
             * 分......时上
             */
            String cycleStr = analysisSplit[36] + analysisSplit[36 + 1];
            int cycle = Integer.parseInt(cycleStr, 16);

            /**
             *
             * [36+2 , 36+3]
             * 1.2 所属车道
             * 监测位置位于用户设定的具体车道号
             * 雷达监控具体车道编号：
             * 单车道代码规则：上行 01，下行 03。
             * 2 车道以上公路代码规则：
             * 上行（靠近雷达）从内（内侧车道）至外（外
             * 侧车道）11、12、13……连续编号，
             * 下行（远离雷达）从内（内侧车道）至外（外
             * 侧车道）31、32、33……连续编号。
             * 车道号排列规则，先上行，后下行，同一行
             * 驶方向，先内侧车道，后外侧车道。
             * 环岛车道编号，从内至外 51、52、53……连
             * 续编号
             * 第 10 页
             * 渠化车道编号，从内至外 71、72、73……连
             * 续编号
             * 出口车道编号，从内至外 91、92、93……连
             * 续编号
             * 目标不在车道内，为 0xFF。
             * 无效值为 0x00。
             */

            String laneStr = analysisSplit[36 + 2] + analysisSplit[36 + 3];
            int lane = Integer.parseInt(cycleStr, 16);


            /**
             * [36+4 , 36+5]
             * 1.3 监测位置
             * 监测点到停车线的距离
             * 宽度默认所在车道宽度
             *
             */

            String monitorPointStr = analysisSplit[36 + 4] + analysisSplit[36 + 5];
            int monitorPoint = Integer.parseInt(monitorPointStr, 16);


            /**
             * [36+6 , 36+7]
             * 1.4  小车流量
             * 单位：辆
             * 车长＜6m 为小车
             * 统计周期内通过监测位置的小车总数
             */

            String smallCarSumStr = analysisSplit[36 + 6] + analysisSplit[36 + 7];
            int smallCarSum = Integer.parseInt(smallCarSumStr, 16);

            /**
             * [36+8 , 36+9]
             * 1.5  大车流量
             * 单位：辆
             * 6m≤车长＜10m 为大车
             * 统计周期内通过监测位置的大车总数
             */

            String largeCarSumStr = analysisSplit[36 + 8] + analysisSplit[36 + 9];
            int largeCarSum = Integer.parseInt(largeCarSumStr, 16);


            /**
             * [36+10 , 36+11]
             * 1.6   超大车流量
             * 单位：辆
             * 车长≥10m 为超大车
             * 统计周期内通过监测位置的大车总数
             */


            String superLargeCarSumStr = analysisSplit[36 + 10] + analysisSplit[36 + 11];
            int superLargeCarSum = Integer.parseInt(superLargeCarSumStr, 16);


            /**
             * [36+12 , 36+13]
             * 1.7  总流量
             * 单位：辆
             * 总流量=小车流量+大车流量+超大车流量
             * 统计周期内通过监测位置所有车辆总数
             */


            String allSumStr = analysisSplit[36 + 12] + analysisSplit[36 + 13];
            int allSum = Integer.parseInt(allSumStr, 16);


            /**
             * [36+14 , 36+15]
             *  1.8  平均车速
             * 分辨率 0.1 千米/小时
             * 统计周期内通过监测断面所有车辆速度的平
             * 均值
             * 统计周期内没有车辆通过，上报 0x00
             */


            String aveSpeedStr = analysisSplit[36 + 14] + analysisSplit[36 + 15];
            int aveSpeed = Integer.parseInt(aveSpeedStr, 16);


            /**
             * [36+16 , 36+17]
             *  1.9  车头时距
             * 单位：0.1 秒/辆
             * 定义：在同一车道中，连续行驶的两辆车头
             * 通过检测断面的时间间隔
             * 统计周期内监测断面车头时距的平均值
             * PS：统计周期内没有车辆通过，上报数值为
             * 统计周期秒数
             *
             */
            String headWayStr = analysisSplit[36 + 16] + analysisSplit[36 + 17];
            int headWay = Integer.parseInt(headWayStr, 16);


            /**
             * [36+18 , 36+19]
             *  1.10 虚拟线圈时间占有率占有率
             * 百分比，分辨率 0.1
             * 虚拟线圈：监测位置前后各扩 1m，形成一个
             * 长方形区域（2m×车道宽度）
             * 时间占有率：统计周期内虚拟线圈被车辆压
             * 占的总时间比统计周期
             */

            String virtualCoilTimeOccupancyRateStr = analysisSplit[36 + 18] + analysisSplit[36 + 19];
            int virtualCoilTimeOccupancyRate = Integer.parseInt(virtualCoilTimeOccupancyRateStr, 16);


            /**
             * [36+20 , 36+21]
             *  1.11 最大排队长度
             * 分辨率 0.1 米
             * 排队长度：从停车线到排队车辆队尾的长度
             * 最大排队长度：统计周期内该车道最大的排
             * 队长度
             */
            String maximumQueueLengthStr = analysisSplit[36 + 20] + analysisSplit[36 + 21];
            int maximumQueueLength = Integer.parseInt(maximumQueueLengthStr, 16);

            /**
             * 2 赋值对象
             */

            // 车道号,查看附录
            event.setLaneNo(lane);

            // 车道类型 查看附录
            // 车道车流方向
            // 车道限速

            // 平均速度
            event.setLaneSpeedAvg(aveSpeed);

            // 排队长度 cm  todo 只有周期最大排队长度，要这个值吗?


            // 排队长度等级
            // 1较短 2较长 3很长


            // 进口停止线以内车头间距

            // 进口停止线以内空间占有率

            // 机动车车辆数

            // 非机动车车辆数

            // 小客车车流量
            // 例：30

            // 大货车、卡车流量
            // 例：30

            // 中货车车流量
            // 例：30

            // 小货车车流量
            // 例：30

            // 大巴车车流量
            // 例：30

            // 中巴车车流量
            // 例：30

            // 非机动车流量（包括行人，自行车）
            // 例：30

            // 危化品车流量
            // 例：30

            // 总流量 = 机动车数 + 非机动车数
            // 总流量 = carNum+bigTruckNum+midTruckNum+smallTruckNum+bigBusNum+midBusNum+nonTrafficNum+dangerNum
            event.setTotalNum(allSum);


            eventList.add(event);

            /**
             * 外层统计计算  统计今日车流
             */
            todayNum += allSum;

            lanNumList.add(lane);

        }


        trafficFlowPerSecond.setTodayNum(todayNum);
        // 去重并计算车道号
        List<Integer> distinctLanNum = lanNumList.stream().distinct().collect(Collectors.toList());
        trafficFlowPerSecond.setLaneNum(distinctLanNum.size());

    }
}

```


#### 线程池 AllCustomerThreadPool


```java
package com.graphsafe.cadxlk.config.threadpool;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * @author : shenyabo
 * @date : Created in 2024-06-27 10:58
 * @description : 初始化系统使用线程池总类
 * @modified By :
 * @version: : v1.0
 */
@Configuration
@Slf4j
// 开启注解
@EnableAsync
public class AllCustomerThreadPool {
    @Value("${mycustomer.async.executor.netty-client-handle-threadPool.core_pool_size}")
    private int topicListenerCorePoolSize;
    @Value("${mycustomer.async.executor.netty-client-handle-threadPool.max_pool_size}")
    private int topicListenerMaxPoolSize;
    @Value("${mycustomer.async.executor.netty-client-handle-threadPool.queue_capacity}")
    private int topicListenerQueueCapacity;
    @Value("${mycustomer.async.executor.netty-client-handle-threadPool.name.prefix}")
    private String topicListenerNamePrefixSocket;
    @Value("${mycustomer.async.executor.netty-client-handle-threadPool.keep_alive_seconds}")
    private Integer topicListenerKeepAliveSeconds;
    @Value("${mycustomer.async.executor.netty-client-handle-threadPool.set_awaitTermination_seconds}")
    private Integer setAwaitTerminationSeconds;

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/6/27 11:04
     * @Description: 注入springboot ioc 容器 线程池对象
     *
     * @Params: []
     * @Return: java.util.concurrent.Executor
     */
    @Bean(name = "nettyClientHandleThreadPoolExecutor")
    public Executor nettyClientHandleThreadPoolExecutor() {

        log.info("初始化线程池 netty-client-handle-threadPool");
        log.info("Runtime.getRuntime().availableProcessors() 查看服务器核心数{}",Runtime.getRuntime().availableProcessors());

        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        //配置核心线程数
        executor.setCorePoolSize(topicListenerCorePoolSize);
        //配置最大线程数
        executor.setMaxPoolSize(topicListenerMaxPoolSize);
        //配置队列大小
        executor.setQueueCapacity(topicListenerQueueCapacity);
        //配置线程池中的线程的名称前缀
        executor.setThreadNamePrefix(topicListenerNamePrefixSocket);
        // 空闲线程保持多久
        executor.setKeepAliveSeconds(topicListenerKeepAliveSeconds);
        // rejection-policy：当pool已经达到max size的时候，如何处理新任务
        // CALLER_RUNS：不在新线程中执行任务，而是有调用者所在的线程来执行
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.DiscardOldestPolicy());
        //调度器shutdown被调用时等待当前被调度的任务完成
        executor.setWaitForTasksToCompleteOnShutdown(true);
        //等待时长
        executor.setAwaitTerminationSeconds(setAwaitTerminationSeconds);
        //执行初始化
        executor.initialize();


        return executor;
    }

}

```


