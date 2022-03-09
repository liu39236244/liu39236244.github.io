# 这个有疑问

httpclient 还是会大量生成


## Factory

```java
package com.graphsafe.xsn.utils.http;


import cn.hutool.core.thread.ThreadFactoryBuilder;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.SimpleHttpConnectionManager;
import org.apache.commons.httpclient.params.HttpClientParams;
import org.apache.commons.pool2.BasePooledObjectFactory;
import org.apache.commons.pool2.PooledObject;
import org.apache.commons.pool2.PooledObjectState;
import org.apache.commons.pool2.impl.DefaultPooledObject;
import org.apache.commons.pool2.impl.GenericObjectPool;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.stereotype.Component;

import java.util.Random;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * @author : shenyabo
 * @date : Created in 2022-02-22 13:57
 * @description : 数据库连接池类
 * @modified By :
 * @version: : v1.0
 */
@Slf4j
@Component
public class HttpFactory extends BasePooledObjectFactory<HttpClient> {

    // AtomicInteger是一个提供原子操作的Integer类，通过线程安全的方式操作加减
    public AtomicInteger atomicInteger = new AtomicInteger(0);

    public HttpFactory() {
        System.out.println("init HttpPool....初始化httpClient工厂");
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2022/2/22 14:09
     * @Description: 销毁对象
     * @Params: [pool]
     * @Return: void
     */

    public void destroyObject(GenericObjectPool<HttpClient> pool ) throws Exception {
        HttpClient httpClient = pool.borrowObject();
        httpClient= null;
    }


    /**
     * 在对象池中创建对象
     *
     * @return 自定义对象
     */
    @Override
    public HttpClient create() {
        atomicInteger.getAndAdd(1);
        // 这种的方式池子中使用过的会给断开连接，但是貌似解决不了time_waiter 大量产生的问题；
        return new HttpClient(new HttpClientParams(),new SimpleHttpConnectionManager(true));
        // return new HttpClient();
    }

    /**
     * common-pool2 中创建了 DefaultPooledObject 对象对对象池中对象进行的包装。
     * 将我们自定义的对象放置到这个包装中，工具会统计对象的状态、创建时间、更新时间、返回时间、出借时间、使用时间等等信息进行统计
     *
     * @param httpClient 自定义对象
     * @return 对象池
     */
    @Override
    public PooledObject<HttpClient> wrap(HttpClient httpClient) {
        return new DefaultPooledObject<>(httpClient);
    }

    /**
     * 销毁对象
     * @param httpClient 对象池
     * @throws Exception 异常
     */
    @Override
    public void destroyObject(PooledObject<HttpClient> httpClient) throws Exception {
        super.destroyObject(httpClient);
    }

    /**
     * 校验对象是否可用
     * @param httpClient 对象池
     * @return 对象是否可用结果，boolean
     */
    @Override
    public boolean validateObject(PooledObject<HttpClient> httpClient) {
        // return super.validateObject(httpClient);
        PooledObjectState state = httpClient.getState();
        if(state.equals(PooledObjectState.IDLE)){
            log.info("httpClient:"+httpClient.toString()+"空闲");
            return true;
        }else{
            log.info("httpClient:"+httpClient.toString()+"不可用");
            return false;
        }
    }

    /**
     * 激活钝化的对象系列操作
     * @param httpClient 对象池
     * @throws Exception 异常信息
     */
    @Override
    public void activateObject(PooledObject<HttpClient> httpClient) throws Exception {
        log.info("激活钝化的对象"+httpClient.toString());
        super.activateObject(httpClient);


    }

    /**
     * 钝化未使用的对象
     * @param httpClient 对象池
     * @throws Exception 异常信息
     */
    @Override
    public void passivateObject(PooledObject<HttpClient> httpClient) throws Exception {
        super.passivateObject(httpClient);
        log.info("钝化未使用的对象"+httpClient.toString());
    }




    public static void main(String[] args) {
        // =====================创建线程池=====================

        // ExecutorService excutor = Executors.newFixedThreadPool(10);
        ThreadFactory threadFactory = new ThreadFactoryBuilder().setNamePrefix("demo-pool-%d").build();
        ExecutorService excutor = new ThreadPoolExecutor(
                5,
                5,
                0,
                TimeUnit.MILLISECONDS, new LinkedBlockingQueue<Runnable>(1024), threadFactory, new ThreadPoolExecutor.AbortPolicy());
        // =====================创建对象池=====================


        // 对象池工厂
        HttpFactory httpFactory = new HttpFactory();

        // 对象池配置
        GenericObjectPoolConfig<HttpClient> objectPoolConfig = new GenericObjectPoolConfig<>();
        objectPoolConfig.setMaxTotal(5);
        // 对象池
        GenericObjectPool<HttpClient> personPool = new GenericObjectPool<>(httpFactory, objectPoolConfig);
        // =====================测试对象池=====================
        // 循环100次，从线程池中取多个多线程执行任务，来测试对象池
        for (int i = 0; i <20; i++) {
            excutor.submit(new Thread(() -> {
                log.info("请求池中httClient对象数量"+httpFactory.atomicInteger);
                // 模拟从对象池取出对象，执行任务
                HttpClient httpClient = null;
                try {
                    // 从对象池取出对象
                    httpClient = personPool.borrowObject();
                    // httpClient.wait(5000);
                    int i1 = new Random().nextInt(5);
                    Thread.sleep(1000*i1);
                    log.info("httpClient:"+httpClient.toString()+"执行中... 大概需要秒数: "+i1);
                    // 让对象工作
                    log.info("httpClient:"+httpClient.toString()+"执行结束！！");
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    // 回收对象到对象池
                    if (httpClient != null) {
                        personPool.returnObject(httpClient);
                    }
                    log.info("请求池中httClient对象数量"+httpFactory.atomicInteger);
                }
            }));
        }
    }
}
```

## 测试类


```java
    private static GenericObjectPool<HttpClient> httpClientPool;
    static{
        // 对象池工厂
        HttpFactory httpFactory = new HttpFactory();
    
        // 对象池配置
        GenericObjectPoolConfig<HttpClient> objectPoolConfig = new GenericObjectPoolConfig<>();
        objectPoolConfig.setMaxTotal(3);
        // 对象池
        httpClientPool= new GenericObjectPool<>(httpFactory, objectPoolConfig);
    }

// 获取池中对象

     log.info("从httpClient池中获取httpClient ,当前闲置对象:"+httpClientPool.getNumIdle()+"当前活跃对象数:"+httpClientPool. getNumActive()+";当前阻塞对象"+httpClientPool.getNumWaiters());
    httpClient = httpClientPool.borrowObject();

// 回收到池中

    HttpFactory factory = (HttpFactory) httpClientPool.getFactory();
    log.info("工厂中对象数 factory.atomicInteger"+factory.atomicInteger);
    log.info("工厂中对象数 httpClientPool.getCreatedCount() "+httpClientPool.getCreatedCount());
    
    log.info("【时间】"+ DateUtils.getCurTimeStrByFormat(null) +"HttpClient 回收,回收前池中空闲数量:"+ httpClientPool.getNumIdle() +"；正在使用的请求数量"+httpClientPool.getNumActive());
    // 异常以后将httpclient 放入链接池中
    httpClientPool.returnObject(httpClient);
    log.info("【时间】"+ DateUtils.getCurTimeStrByFormat(null) +"httpClient 回收,回收后池空闲数量:"+ httpClientPool.getNumIdle() +"；正在使用的请求数量"+httpClientPool.getNumActive());

```


## 针对大量的 time_waiter 的还是会大量生成！池化并没起作用


尝试过的解决方案：

### 1 new 的时候给上自动关闭连接


```java

工厂类的create 方法中 

       HttpClient httpClient= new HttpClient(new HttpClientParams(), new SimpleHttpConnectionManager(true));
```


### 第二种 httpConnectionManager 方式

不使用上面的连接池；在new HttpClient 的时候给上一个参数！但是貌似没作用还会大量的time_waiter 

```java
// 读取超时
private final static int SOCKET_TIMEOUT = 10000;
// 连接超时
private final static int CONNECTION_TIMEOUT = 10000;
// 每个HOST的最大连接数量
private final static int MAX_CONN_PRE_HOST = 2;
// 连接池的最大连接数
private final static int MAX_CONN = 5;
// 连接池
private final static HttpConnectionManager httpConnectionManager;

PoolingHttpClientConnectionManager manager = new PoolingHttpClientConnectionManager();

static {
    httpConnectionManager = new MultiThreadedHttpConnectionManager();
    HttpConnectionManagerParams params = httpConnectionManager.getParams();
    params.setConnectionTimeout(CONNECTION_TIMEOUT);
    params.setSoTimeout(SOCKET_TIMEOUT);
    params.setDefaultMaxConnectionsPerHost(MAX_CONN_PRE_HOST);
    params.setMaxTotalConnections(MAX_CONN);
}

```


### 第三种 CloseableHttpClient 设置短链接(有待测试)


#### httpGet设置

```java
 // 获取连接客户端工具
        CloseableHttpClient httpClient = HttpClients.createDefault();



        String entityStr = null;
        CloseableHttpResponse response = null;

        try {
            /*
             * 由于GET请求的参数都是拼装在URL地址后方，所以我们要构建一个URL，带参数
             */
            URIBuilder uriBuilder = new URIBuilder(url);
            // 根据带参数的URI对象构建GET请求对象
            HttpGet httpGet = new HttpGet(uriBuilder.build());

            /*
             * 添加请求头信息
             */
            // 浏览器表示
            httpGet.addHeader("Authorization", authorization);
            // 传输的类型
            httpGet.addHeader("Content-Type", "application/x-www-form-urlencoded");

            // 短连接//由服务端关闭 这一行是关键，
            httpGet.setHeader(HttpHeaders.CONNECTION, "close");

            // 执行请求
            response = httpClient.execute(httpGet);
            // 获得响应的实体对象
            HttpEntity entity = response.getEntity();
            // 使用Apache提供的工具类进行转换成字符串
            entityStr = EntityUtils.toString(entity, "UTF-8");
        } catch (ClientProtocolException e) {
            System.err.println("金华 Http协议出现问题");
            e.printStackTrace();
        } catch (ParseException e) {
            System.err.println("金华 解析错误");
            e.printStackTrace();
        } catch (URISyntaxException e) {
            System.err.println("金华 URI解析异常");
            e.printStackTrace();
        } catch (IOException e) {
            System.err.println("金华 IO异常");
            e.printStackTrace();
        } finally {
            // 释放连接
            if (null != response) {
                try {
                    response.close();
                    httpClient.close();
                } catch (IOException e) {
                    System.err.println("金华 释放连接出错");
                    e.printStackTrace();
                }
            }
        }
```


#### httpPost 尝试

```java
    private static HttpPost httpPostCreate(String url, JSONObject reqVal, String contentType) {
        HttpPost httpPost = new HttpPost(url);
        httpPost.addHeader("Content-Type", contentType);
        httpPost.setEntity(new StringEntity(reqVal.toJSONString(), "utf-8"));
        // 关键代码
        httpPost.setHeader(HttpHeaders.CONNECTION, "close");//由服务端关闭
        return httpPost;
    }

```



