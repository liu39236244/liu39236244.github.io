# springboot-基础版整合MQTT

# 1 基础整合mqtt 

## 1.1 引入依赖

```yml
       <!--mqtt-->
        <!--        MqttAsyncClient  使用这个-->
        <dependency>
            <groupId>org.eclipse.paho</groupId>
            <artifactId>org.eclipse.paho.client.mqttv3</artifactId>
            <version>1.2.5</version>
        </dependency>
```


## 1.2 通过mqttClient 创建mqtt链接

```java
package com.jksk.emergencymanage.service.mqWay1;

/**
 * @author : shenyabo
 * @date : Created in 2025-03-07 0:21
 * @description :
 * @modified By :
 * @version: : v1.0
 */

import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.stereotype.Component;

/**
 * Service for handling MQTT connections and messages.
 */
@Component
@Slf4j
public class MqttClientWayMqttService {
    private final String mqttBrokerUrl = "tcp://外网IP:1883";
    private final String username = "";
    private final String pwd = "";
    private MqttClient client;

    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/20/周四 0:35
     * @Description: 初始化mqtt
     * @Params: []
     * @Return: void
     */
    public void connect() throws MqttException {

        client = new MqttClient(mqttBrokerUrl, MqttClient.generateClientId());
        MqttConnectOptions options = new MqttConnectOptions();
        options.setCleanSession(true);
        options.setUserName(username);
        options.setPassword(pwd.toCharArray());
        client.connect(options);
        log.info("MqttClientWayMqttService: 链接mqtt 成功");

        // 能收到所有topic
        client.subscribe("/#", (topic, message) -> {
            // Process incoming messages
            String msg = new String(message.getPayload());
            System.out.println("MqttClientWayMqttService: Received MQTT message: " + msg);
        });
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2025/3/9/周日 18:08
     * @Description: 服务器将收到的消息发送到服务端 topic
     * @Params: [message]
     * @Return: void
     */
    public void sendMessage(String message) {
        String topic = "devResponse/61000";
        // todo 这里可以不用发消息就给服务端，发送消息给服务端mq 就是在传输在线 ，或者离线的情况才需要给mq 发送在线离线消息
        try {
            log.info("MqttClientWayMqttService: 发送消息到mq:{}", topic);

            client.publish(topic, message.getBytes(), 1, false);
        } catch (MqttException e) {
            e.printStackTrace();
            log.error("MqttClientWayMqttService： 发送消息，报错：", e);

        }
    }
}
```