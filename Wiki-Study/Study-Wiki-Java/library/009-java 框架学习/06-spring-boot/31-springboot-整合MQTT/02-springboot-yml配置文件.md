# springboot-yml配置文件


# 1 pom 、 yml 配置文件

```xml
        <!--mqtt-->
        <!--        MqttAsyncClient  使用这个-->
        <dependency>
            <groupId>org.eclipse.paho</groupId>
            <artifactId>org.eclipse.paho.client.mqttv3</artifactId>
            <version>1.2.5</version>
        </dependency>
```

```yml
custome:
  # mq 配置
  mqtt:
    # 边坡 mq 链接地址
    mqtt-bian-po:
      url: tcp://IP1:1883  # MQTT 代理地址和端口
      client-id: 每个链接自定义一个# 客户端 ID
      username: 账号1  # （可选）用户名
      password: 密码1 （可选）密码
      # topics
      topics:
        # 存储设备状态mq devStatus/{桥梁/隧道/边坡 id}  如 ： devStatus/61000
        dev-status: devStatus/#
        # 平台下发消息到设备 devControl/{桥梁/隧道/边坡 id}/
        dev-control-prefix: devControl/#
        # 设备发送消息到mq devResponse/{桥梁/隧道/边坡 id}
        dev-response: devResponse/#
    # 长大桥平台 下发指令的设备mq
    mqtt-bridge:
      # 外网
      url: tcp://IP2:1883  # MQTT 代理地址和端口
      client-id: 每个链接自定义一个 # 客户端 ID# 客户端 ID
      username: 账号# （可选）用户名
      password: 密码 （可选）密码
      # topics
      topics:
        # 存储设备状态mq devStatus/{桥梁/隧道/边坡 id}  如 ： devStatus/61000
        dev-status: devStatus/#
        # 平台下发消息到设备 devControl/{桥梁/隧道/边坡 id}/
        dev-control-prefix: devControl/#
        # 设备发送消息到mq devResponse/{桥梁/隧道/边坡 id}
        dev-response: devResponse/#

```

# 2 config 初始化mqtt使用 mqttAsyncClient

```java
package com.jksk.emergencymanage.config;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author : shenyabo
 * @date : Created in 2025-03-09 22:33
 * @description : 初始化边坡 mqtt
 * @modified By :
 * @version: : v1.0
 */
@Configuration
@Slf4j
@Data
public class MqttConfig {


    /**
     * 边坡mq
     */
    @Value("${custom.mqtt.mqtt-bian-po.url}")
    private String bianPoMqttUrl;

    @Value("${custom.mqtt.mqtt-bian-po.client-id}")
    private String bianPoClientId;

    @Value("${custom.mqtt.mqtt-bian-po.username:}")
    private String bianPoUsername;

    @Value("${custom.mqtt.mqtt-bian-po.password:}")
    private String bianPoPassword;

    @Value("${custom.mqtt.mqtt-bian-po.topics.dev-control-prefix}")
    private String bianPoDevControl;


    /**
     * 桥梁mq
     */
    @Value("${custom.mqtt.mqtt-bridge.url}")
    private String bridgeMqttUrl;

    @Value("${custom.mqtt.mqtt-bridge.client-id}")
    private String bridgeClientId;

    @Value("${custom.mqtt.mqtt-bridge.username:}")
    private String bridgeUsername;

    @Value("${custom.mqtt.mqtt-bridge.password:}")
    private String bridgePassword;

    @Value("${custom.mqtt.mqtt-bridge.topics.dev-control-prefix}")
    private String bridgeDevControl;


    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/23/周日 0:22
     * @Description: 初始化边坡
     * @Params: []
     * @Return: org.eclipse.paho.client.mqttv3.MqttAsyncClient
     */
    @Bean
    public MqttAsyncClient mqttAsyncClientBianPo() throws MqttException {

        MqttAsyncClient client = new MqttAsyncClient(bianPoMqttUrl, bianPoClientId);
        MqttConnectOptions options = new MqttConnectOptions();

        options.setAutomaticReconnect(true);

        options.setCleanSession(true);
        options.setConnectionTimeout(30); // 超时时间（秒）
        options.setUserName(bianPoUsername);
        options.setPassword(bianPoPassword.toCharArray());

        // client.connect(options).waitForCompletion();


        try {

            // 建立连接
            client.connect(options, null, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    log.info("边坡MQTT 连接成功");
                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    log.error("边坡MQTT 连接失败: {}", exception.getMessage());
                }
            });
        } catch (Exception ex) {
            log.error("边坡 mq 初始化链接报错！", ex);
        }
        return client;

    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/23/周日 0:22
     * @Description: 初始化桥梁
     * @Params: []
     * @Return: org.eclipse.paho.client.mqttv3.MqttAsyncClient
     */
    @Bean
    public MqttAsyncClient mqttAsyncClientBridge() throws MqttException {

        MqttAsyncClient client = new MqttAsyncClient(bridgeMqttUrl, bridgeClientId);
        MqttConnectOptions options = new MqttConnectOptions();

        // 控制是否自动重连
        options.setAutomaticReconnect(false);
        options.setCleanSession(true);
        options.setConnectionTimeout(30); // 超时时间（秒）
        options.setUserName(bridgeUsername);
        options.setPassword(bridgePassword.toCharArray());

        // client.connect(options).waitForCompletion();


        try {

            // 建立连接
            // 建立连接
            client.connect(options, null, new IMqttActionListener() {
                @Override
                public void onSuccess(IMqttToken asyncActionToken) {
                    log.info("桥梁MQTT 连接成功");
                }

                @Override
                public void onFailure(IMqttToken asyncActionToken, Throwable exception) {
                    log.error("桥梁MQTT 连接失败:{} ", exception.getMessage());
                }
            });
        } catch (Exception ex) {
            log.error("桥梁MQTT 初始化链接报错！", ex);
        }
        return client;


    }
}
```

# 3 定义发送接收消息对象

```java
package com.jksk.emergencymanage.service.mqWay2.slideSlope;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * @author : shenyabo
 * @date : Created in 2025-03-09 22:33
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Service
@Slf4j
public class MqttSideSlopeService {
    @Resource(name="mqttAsyncClientBianPo")
    private MqttAsyncClient mqttAsyncClientBianPo;

    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/20/周四 0:19
     * @Description: mq 发送数据
     * @Params: [topic, message, qos]
     * @Return: void
     */
    public void publishMessage(String topic, String message, Integer qos) {

        MqttMessage mqttMessage = new MqttMessage(message.getBytes());
        // QoS 1
        mqttMessage.setQos(qos == null ? 1 : qos);
        try {
            mqttAsyncClientBianPo.publish(topic, mqttMessage);
        } catch (MqttException e) {
            log.error("MqttService-MqttAsyncClient-边坡 发布 topic: {} , message:{} , qos :{} 失败！ 报错：", topic, message, qos, e);
        }
        log.info("MqttService-MqttAsyncClient-边坡 发布 topic: {} , message:{} , qos :{} 成功", topic, message, qos);
        // mqttAsyncClient.publish(topic, message.getBytes(), 0, false);
    }
}
```

# 4 初始化对应的链接

```java
package com.jksk.emergencymanage.service.mqWay2.slideSlope;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttAsyncClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @author : shenyabo
 * @date : Created in 2025-03-09 22:36
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Component
@Slf4j
public class MqttSideSlopeReceiver {

    @Resource(name="mqttAsyncClientBianPo")
    private MqttAsyncClient mqttAsyncClientBianPo;

    public void initCallBack() {
        mqttAsyncClientBianPo.setCallback(new MqttCallback() {
            @Override
            public void deliveryComplete(IMqttDeliveryToken token) {
                // 消息成功到达 Broker
                log.info("边坡MQ-消息发送成功，主题:{} " ,token.getTopics()[0]);
            }

            @Override
            public void connectionLost(Throwable cause) {
                // 处理连接丢失
                log.error("边坡MQ-MqttService-MqttAsyncClient 丢失链接", cause);
            }

            @Override
            public void messageArrived(String topic, MqttMessage message) {
                // 处理收到的消息
                // 收不到消息；有问题
                log.info("边坡MQ-MqttService-MqttAsyncClient ： Received message: {} from topic: {}",message.getPayload(), topic);
            }
        });
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/20/周四 0:22
     * @Description: mq 订阅数据，收到数据逻辑处理
     * @Params: [subTopic, qos]
     * @Return: void
     */
    // 订阅主题
    public void subscribe(String subTopic, Integer qos) throws Exception {
        // mqttAsyncClient.subscribe(topic, 1); // QoS 1

        mqttAsyncClientBianPo.subscribe(subTopic, qos == null ? 1 : qos, (topic, message) -> {
            // Process incoming messages
            String msg = new String(message.getPayload());
            log.info("边坡MQ-MqttService-MqttAsyncClient ： Received MQTT topic :{}  message: {}", topic, msg);
        });
    }
}
```

# 5 接收端client Listen处理器

```java
package com.jksk.emergencymanage.service.mqWay2.bridge.listener;

import com.alibaba.fastjson2.JSONObject;
import com.jksk.emergencymanage.intelligence_board.po.IntelligenceBoardParam;
import com.jksk.emergencymanage.intelligence_board.service.NovaControlService;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttMessageListener;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author : shenyabo
 * @date : Created in 2025-03-23 14:00
 * @description : 桥梁mq 接收数据处理逻辑
 * @modified By :
 * @version: : v1.0
 */
@Component
@Slf4j
public class BridgeMqListener implements IMqttMessageListener {

    @Autowired
    NovaControlService novaControlService;

    @Override
    public void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {
        String msg = new String(mqttMessage.getPayload());
        log.info("桥梁MQ-MqttService-MqttAsyncClient ： Received MQTT topic :{}  message: {}", topic, msg);

        /**
         * 拿到 下发指令topic ， devControl/桥梁id ， 拿到对应的 指令 进行消息下发
         */

        /**
         * todo 参数转换
         */
        JSONObject messageJson = JSONObject.parse(msg);
        String controlParamsStr = messageJson.get("controlParams").toString();
        if(controlParamsStr.isEmpty()){
            log.info("controlParams为空");
            return;
        }
        IntelligenceBoardParam intelligenceBoardParam = JSONObject.parseObject(controlParamsStr, IntelligenceBoardParam.class);

        // {
        //     "devId": "Taurus-XH2",
        //         "controlParams": {
        //             "deviceType": 2,
        //             "deviceName":"Taurus-XH2",
        //             "x": 25,
        //             "y": 20,
        //             "width": 320,
        //             "height": 160,
        //             "font": "2",
        //             "textSize": 56,
        //             "fontStyle": 1,
        //             "textColor": "1",
        //             "backGroundColor": "0",
        //             "text": "字 字 字 字     字 字 字 字",
        //             "wordSpace": 100
        // },
        //     "msgId": "772d20eb-193f-4131-b3cf-b27734b12fd3",
        //         "operation": 1
        // }

        switch(intelligenceBoardParam.getDeviceType()  ){
            case 1 : {
                // 爆闪灯
                break;
            }
            case 2 : {
                // 情报板
                novaControlService.sendAllNovaDeviceMessage(intelligenceBoardParam);
                break;
            }
            case 3 : {
                // 护栏灯
                break;

            }
            default: {
                log.info("桥梁MQ-MqttService-MqttAsyncClient未知的设备类型 ： Received MQTT topic :{}  message: {}", topic, msg);
            }
        }


    }
}

```


# 6 初始化


```java
@Component
@Slf4j
public class StartupRunner implements CommandLineRunner {

    /**
     * mq 第一种 初始化
     */
    @Autowired
    public MqttClientWayMqttService mqttClientWayMqttService;

    /**
     * mq 第2种 初始化
     */

    // 边坡
    @Autowired
    private MqttSideSlopeReceiver mqttSideSlopeReceiver;



    @Autowired
    MqttConfig mqttConfig;


    @Autowired
    private MqttBridgeReceiver mqttBridgeReceiver;

    @Override
    public void run(String... args) throws Exception {


        // 初始化mq 订阅
        initMqTTSub();


        /**
         * 情报板
         */
        initQingBaoBan();

        log.info("================================================== springboot init 完毕!!==================================");

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/23 13:09
     * @Description: 初始化mq 订阅
     * @Params: []
     * @Return: void
     */
    private void initMqTTSub() {

        /**
         * mq 方式2  订阅边坡mq
         */

        mqttSideSlopeReceiver.initCallBack();
        // 订阅主题
        try {
            mqttSideSlopeReceiver.subscribe(mqttConfig.getBianPoDevControl(), 1);
        } catch (Exception e) {
            log.error("边坡-情报板订阅MQ 【{}】失败:", mqttConfig.getBianPoDevControl(), e);
            // mq 订阅消息失败
        }

        // mqttReceiver.subscribe("/test/1", 1);
        // mqttReceiver.subscribe("/test/2", 1);
        // mqttService.publishMessage("/test/2", "publishMessage",2);


        /**
         * mq 方式2  订阅桥梁mq
         */

        mqttBridgeReceiver.initCallBack();
        // 订阅主题
        try {
            mqttBridgeReceiver.subscribe(mqttConfig.getBridgeDevControl(), 1);
        } catch (Exception e) {
            log.error("桥梁-情报板订阅MQ 【{}】失败:", mqttConfig.getBridgeDevControl(), e);
            // mq 订阅消息失败
        }

        // mqttReceiver.subscribe("/test/1", 1);
        // mqttReceiver.subscribe("/test/2", 1);
        // mqttService.publishMessage("/test/2", "publishMessage",2);
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/20/周四 21:19
     * @Description:
     * @Params: []
     * @Return: void
     */
    public void initBaoShanDeng() {

        /**
         * netty 服务 用单独的线程，否则这里会阻塞程序的往下执行
         */


        /**
         * netty
         */
        new Thread(() -> {
            // netty
            try {
                nettyTcpServer.start();
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        }).start();

        /**
         * mq 方式1 , 能收到所有topic
         */
        // mqttClientWayMqttService.connect();


        log.info("init netty 完毕");
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/20/周四 21:19
     * @Description: 情报板
     * @Params: []
     * @Return: void
     */
    public void initQingBaoBan() {


        /**
         * 情报板-作为服务端
         */
        novaControlService.initNova(intelligenceBoardConfig.getIp(), intelligenceBoardConfig.getPort());

        /**
         * 情报板-作为客户端
         */

        novaControlClient.printServerConfigs();

        log.info("情报板 init 完毕");
    }

}
```
