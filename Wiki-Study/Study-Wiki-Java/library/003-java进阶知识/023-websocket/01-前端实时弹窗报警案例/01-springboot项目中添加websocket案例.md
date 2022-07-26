# springboot项目中添加websocket案例


## 需求

功能需求就是要在大屏上面能够实时弹窗报警消息表中数据；或者报警列表中有一个上墙功能，点击以后在大屏中也能够弹窗展示出来；

定时肯定是能做，不过浪费服务器资源，且有延迟；所以要求用websocket来做。


## 前端


### prefixUrl.js

```js
// WebSocket地址 -综合服务管理大屏

// 设备预警-websocket-userName: deviceWarnSocketName
const deviceWarnSocket = "deviceWarnSocketName"

// WebSocket地址
// todo 打包前改地址

// .env VUE_APP_WS_URL = ws://10.0.12.66:25001/gatewaytmg
export const ws_device_warn_url = process.env.VUE_APP_WS_URL + '/devops/websocket/'+deviceWarnSocket
// export const ws_device_warn_url = 'ws://117.14.55.74:25001/gatewaytmg' + '/devops/websocket/'+deviceWarnSocket
```

### webSocket.js

```js
/**
 * @author shenyabo
 * @description 设备报警webSocket API
 */
import http from '@/utils/httpRequest.js'
import { exchangeParams } from '@/utils'
import * as prefixUrl from "../prefixUrl";


 // 模块路径
 const url = prefixUrl.gp_devops + '/websocket';


// WebSocket地址 -综合服务管理大屏

// 设备预警-websocket-userName: deviceWarnSocketName
const deviceWarnSocket = "/deviceWarnSocketName"

export const ws_device_warn_url = url + deviceWarnSocket;

 // 预警上墙
 export const push = (params) => http.get(url + '/push', exchangeParams(params));
```

### WebSocket.vue 


```html
/**
 * @author shenyabo
 * @description 设备报警webSocket API
 */
import http from '@/utils/httpRequest.js'
import { exchangeParams } from '@/utils'
import * as prefixUrl from "../prefixUrl";


 // 模块路径
 const url = prefixUrl.gp_devops + '/websocket';


// WebSocket地址 -综合服务管理大屏

// 设备预警-websocket-userName: deviceWarnSocketName
const deviceWarnSocket = "/deviceWarnSocketName"

export const ws_device_warn_url = url + deviceWarnSocket;

 // 预警上墙
 export const push = (params) => http.get(url + '/push', exchangeParams(params));
```

### 前端使用 

在需要弹窗的vue页面引入 WebSocket.vue  页面


```js
// eventData  websocket 接收到后端消息会触发deviceWarnWebSocketEventData  方法，在deviceWarnWebSocketEventData  方法中写处理逻辑


     <webSocket @eventData="deviceWarnWebSocketEventData"></webSocket>

     import webSocket from "@/components/webSocket/WebSocket.vue";

      // 控制websocket 设备报警弹窗 显隐
      controlDialog(flag) {

          this.deviceWebsocketDialogVisible = flag;
      },
      deviceWarnWebSocketEventData(data) {
          // console.log("websocket有一条报警信息id",data)

          // 根据id 查询出来设备报警信息列表，进行弹窗展示
          devEmergencyInformation.getById({id:data}).then((res)=>{

              if(res.code==1){
                  this.deviceWebsocketDialogVisible=true
                  this.$nextTick(()=>{
                      // 向子组件中添加实体对象
                      this.$refs.deviceWarn.addWebsocketDeviceObj(res.data)
                  })
              }else{
                  // 根据id未查到报警消息
              }
          })
      },
```


## 后端

### IgnoreUrl.java


```java

        // 综合管理服务大屏 websocket 接口放行
        urlMap.put("/gatewaygcwz/devops/websocket/deviceWarnSocketName", "websocket放行");
        urlMap.put("/devops/websocket/deviceWarnSocketName", "websocket放行");
```


### pom.xml

```xml

        <!--websocket -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-websocket</artifactId>
        </dependency>
```

### WebSocketController.java


```java
package com.graphsafe.devops.websocket.controller;

import com.graphsafe.api.msg.RestMessage;
import com.graphsafe.devops.constant.WebSocketConstant;
import com.graphsafe.devops.websocket.service.WebSocketService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @description: WebSocketController
 * @author: HXf
 * @create: 2022-01-05 09:31
 **/
@RestController
@RequestMapping("/websocket")
public class WebSocketController {
    /**
    * @Author: huxiaofei
    * @date: Create in 2022-01-05 11:28
    * @Description: websocket发送消息。topicName：为订阅路径后缀，topicContent：为发送内容
    */
    @GetMapping("/push")
    public RestMessage pushone(@RequestParam(value = "topicName",required = false) String topicName, @RequestParam("topicContent") String topicContent)
    {
        if(StringUtils.isEmpty(topicName)){
            //默认设备预警
            topicName = WebSocketConstant.DEVICE_WARN_SOCKET_NAME;
        }
        WebSocketService.sendMessage(topicName,topicContent);
        return new RestMessage<>();
    }
}

```

### WebMvcConfiguration.java

拦截器中记得放行websocket地址

```java
@Configuration
public class WebMvcConfiguration implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry
                .addInterceptor(userInfoInterceptor())
                .addPathPatterns("/**")
                .excludePathPatterns(
                        "/error",
                        "/v2/api-docs",
                        "/swagger-resources/configuration/ui",
                        "/swagger-resources",
                        "/swagger-resources/configuration/security",
                        "/webjars/springfox-swagger-ui/**",
                        "/swagger-ui.html",
                        "/websocket/**"
                );
    }


    @Bean
    public UserInfoInterceptor userInfoInterceptor(){
        return new UserInfoInterceptor();
    }

```


### WebSocketConstant.java

```java
package com.graphsafe.devops.constant;

/**
 * @ClassName:
 * @Author: shenyabo
 * @date:  2022/6/24 14:52
 * @Description: websocket 对应常量
 * @Version: 1.0
 */
public class WebSocketConstant {
    // 设备预警通知-设备预警 socket 路径
    public static final String DEVICE_WARN_SOCKET_NAME = "deviceWarnSocketName";
}

```
### WebSocketClient实体

```java
package com.graphsafe.devops.websocket.model;

import lombok.Data;

import javax.websocket.Session;


@Data
public class WebSocketClient {
    // 与某个客户端的连接会话，需要通过它来给客户端发送数据
    private Session session;

    //连接的uri
    private String uri;


}

```

### 配置类

```java
package com.graphsafe.devops.websocket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;


@Configuration
public class WebSocketConfig {
    @Bean
    public ServerEndpointExporter serverEndpointExporter(){
        return  new ServerEndpointExporter();
    }
}

```


### WebSocketService.java

```java
package com.graphsafe.devops.websocket.service;


import com.graphsafe.devops.service.DevEmergencyInformationService;
import com.graphsafe.devops.websocket.model.WebSocketClient;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;


@ServerEndpoint(value = "/websocket/{userName}")
@Component
@Slf4j
public class WebSocketService {


    //静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。
    private static int onlineCount = 0;
    //concurrent包的线程安全Set，用来存放每个客户端对应的WebSocketServer对象。
    private static ConcurrentHashMap<String, WebSocketClient> webSocketMap = new ConcurrentHashMap<>();


    /**与某个客户端的连接会话，需要通过它来给客户端发送数据*/
    private Session session;
    /**接收userName*/
    private String userName="";

    @Autowired
    DevEmergencyInformationService devEmergencyInformationService;

    /**
     * 连接建立成功调用的方法*/
    @OnOpen
    public void onOpen(Session session, @PathParam("userName") String userName) {
        if(!webSocketMap.containsKey(userName))
        {
            addOnlineCount(); // 在线数 +1
        }
        this.session = session;
        this.userName= userName;
        WebSocketClient client = new WebSocketClient();
        client.setSession(session);
        client.setUri(session.getRequestURI().toString());
        // webSocketMap.put(userName+UUID.randomUUID().toString(), client);
        webSocketMap.put(userName, client);

        log.info("----------------------------------------------------------------------------");
        log.info("用户连接:"+userName+",当前在线人数为:" + getOnlineCount());
//        try {
//            sendMessage("来自后台的反馈：连接成功");
//        } catch (IOException e) {
//            log.error("用户:"+userName+",网络异常!!!!!!");
//        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose() {
        if(webSocketMap.containsKey(userName)){
            webSocketMap.remove(userName);
            if(webSocketMap.size()>0)
            {
                //从set中删除
                subOnlineCount();
            }
        }
        log.info("----------------------------------------------------------------------------");
        log.info(userName+"用户退出,当前在线人数为:" + getOnlineCount());
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param message 客户端发送过来的消息*/
    @OnMessage
    public void onMessage(String message, Session session) {
        log.info("收到用户消息:"+userName+",报文:"+message);
        //可以群发消息
        //消息保存到数据库、redis
        if(StringUtils.isNotBlank(message)){

        }
    }

    /**
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        log.error("用户错误:"+this.userName+",原因:"+error.getMessage());
        error.printStackTrace();
    }

    /**
     * 连接服务器成功后主动推送
     */
    public void sendMessage(String message) throws IOException {
        synchronized (session){
            this.session.getBasicRemote().sendText(message);
        }
    }

    /**
     * 向指定客户端发送消息
     * @param userName
     * @param message: 设备报警暂时message为数据id
     */
    public static void sendMessage(String userName,String message){
        try {
            // for (Map.Entry<String, WebSocketClient> entry : webSocketMap.entrySet()) {
            //     Session session = entry.getValue().getSession();
            //     if(session.isOpen()){
            //         session.getBasicRemote().sendText(message);
            //     }else {
            //         webSocketMap.remove(entry.getKey());
            //         subOnlineCount();
            //     }
            //
            // }
           WebSocketClient webSocketClient = webSocketMap.get(userName);
           //根据userName 查出来id 对应的实体对象转为json字符串返回给前端
           if(webSocketClient!=null){
               webSocketClient.getSession().getBasicRemote().sendText(message);
           }
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }
    }


    public static synchronized int getOnlineCount() {
        return onlineCount;
    }

    public static synchronized void addOnlineCount() {
        WebSocketService.onlineCount++;
    }

    public static synchronized void subOnlineCount() {
        WebSocketService.onlineCount--;
    }

    public static void setOnlineCount(int onlineCount) {
        WebSocketService.onlineCount = onlineCount;
    }


    public static ConcurrentHashMap<String, WebSocketClient> getWebSocketMap() {
        return webSocketMap;
    }

    public static void setWebSocketMap(ConcurrentHashMap<String, WebSocketClient> webSocketMap) {
        WebSocketService.webSocketMap = webSocketMap;
    }

    public Session getSession() {
        return session;
    }

    public void setSession(Session session) {
        this.session = session;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

}

```


### 使用地方

```java
// 依赖包如下
import org.apache.ibatis.transaction.TransactionException;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.TransactionStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.DefaultTransactionDefinition;


    @Override
    public String addSelective(DevEmergencyInformation devEmergencyInformation) {

        String id = "";
        //手动开启第一个事务
        // 发起一个新事务
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);//新发起一个事务
        TransactionStatus transactionStatusCleanData = dataSourceTransactionManager.getTransaction(def);// 获得事务状态
        try {
            id=super.addSelective(devEmergencyInformation);
            //手动提交事务，防止发送websocket 前端无法根据id查到对应数据，导致空弹窗
            dataSourceTransactionManager.commit(transactionStatusCleanData);
        } catch (TransactionException e) {
            e.printStackTrace();
            //手动回滚事务
            dataSourceTransactionManager.rollback(transactionStatusCleanData);
        }
        // 添加设备预警数据的同时，将大屏的websocket 中发送弹窗数据一条,
        try {
            WebSocketService.sendMessage("deviceWarnSocketName", id);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error("addSelective-添加设备预警-websocket向浏览器发送消息弹窗报错", ex);
        }
        return id;

    }

```


