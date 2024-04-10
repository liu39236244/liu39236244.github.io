# redis 分布式锁


需求：redis 线上使用了集群的redis ,对同一个key 有高并发，为了保证数据一致性 ，总结项目中他人的案例

## 案例1 七座桥 redission 使用分布式锁

听说是这个版本不匹配会有一些问题，这个版本是根据springboot2.3.12 确定的 redission 3.15.5 

### 依赖

```yml
        <!-- redisson 实现分布式锁 其已经引入了redis依赖，该版本和spring boot  2.3.12.RELEASE版本对应-->
        <dependency>
            <groupId>org.redisson</groupId>
            <artifactId>redisson-spring-boot-starter</artifactId>
            <version>3.15.5</version>
        </dependency>



```



### redis 配置

```java
package com.graphsafe.message.config.redis;


import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.redisson.api.RedissonClient;
import org.redisson.spring.data.connection.RedissonConnectionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

/**
 * @Description: redis配置类，本工具类的redisTemplate使用redisson的连接工厂实现
 * @Author: cy
 * @Date: 2024-01-18 10:10:03
 */
@Configuration
public class RedisConfig2 {
    /**
     * 本服务使用redis集群，在 Redis 集群中，每个节点都只存储部分数据，因此无法像单机模式下那样使用 select 命令切换整个连接的数据库。
     * 注：
     * 1、使用redisson作为redis的集成组件，redisson客户端会根据key的哈希值将数据发送到正确的节点和库中。无需手动指定要连接的库，Redisson会自动处理。
     * 2、可以在键中添加数据库索引前缀来实现类似的功能。
     *    例如，将所有的键都加上 db0: 前缀表示使用 0 号数据库，将所有的键都加上 db1: 前缀表示使用 1 号数据库
     */

    @Autowired
    private RedissonClient redissonClient;

    @Bean(name = "redisTemplate")
    public RedisTemplate<String, Object> myRedisTemplate() {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(redissonConnectionFactory());
        // 定义Jackson2JsonRedisSerializer序列化对象
        Jackson2JsonRedisSerializer<Object> jacksonSeial = new Jackson2JsonRedisSerializer<>(Object.class);
        ObjectMapper om = new ObjectMapper();
        // 指定要序列化的域，field,get和set,以及修饰符范围，ANY是都有包括private和public
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        // 指定序列化输入的类型，类必须是非final修饰的，final修饰的类，比如String,Integer等会报异常
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jacksonSeial.setObjectMapper(om);
        StringRedisSerializer stringSerial = new StringRedisSerializer();
        // redis key 序列化方式使用stringSerial
        template.setKeySerializer(stringSerial);
        // redis value 序列化方式使用jackson
        template.setValueSerializer(jacksonSeial);
        // redis hash key 序列化方式使用stringSerial
        template.setHashKeySerializer(stringSerial);
        // redis hash value 序列化方式使用jackson
        template.setHashValueSerializer(jacksonSeial);
        template.afterPropertiesSet();
        return template;
    }

    private RedisConnectionFactory redissonConnectionFactory() {
        return new RedissonConnectionFactory(redissonClient);
    }

}


### 使用案例

```java

    // 此方法 是一次性执行的，等于执行这个方法不会高并发，所以这里 @Async 注解 ，用在这里感觉跟方法中创建的线程池 用法上有冲突(我感觉)
    @Override
    @Async
    public void initBridgeProbeDataToRedis() {
        /**
         * 实现逻辑：
         * 1、查询所有探头信息表所有数据，根据桥梁id分组。
         * 2、以桥梁id + 监测类型id + 监测项id为key，探头信息为value，探头的顺序为Score存储至redis zSet。这里选择11号库
         * 3、因为前端桥梁探头信息发生变动后会通知redis，所以这里只做初始化，全局更新时进行基础数据同步。 初始化是需要加分布式锁，确保只有当前逻辑在操作相关redis key
         * 4、dataWarn服务根据数据是否超限，更新探头的超限报警状态。同时更新探头的在线状态。
         * 5、离线状态由bridge也就是本服务定时任务查询该redis zSet进行判断处理。
         */

        // 创建一个可重用固定线程数的线程池,此处定为23 （我感觉这个地方线程池使用的有点问题）
        ExecutorService executorService = Executors.newFixedThreadPool(23);

        BaseExampleDto baseExampleDto = new BaseExampleDto();
        baseExampleDto.setLimit(null);
        baseExampleDto.setPage(null);
        List<BridgeMonitorTypeItem> bridgeMonitorTypeItemList = bridgeMonitorTypeItemService.getByExample(baseExampleDto).getRows();

        for (BridgeMonitorTypeItem bridgeMonitorTypeItem : bridgeMonitorTypeItemList) {
            // 实现并启动线程
            executorService.execute(new Runnable() {
                @Override
                public void run() {
                    Integer bridgeId = bridgeMonitorTypeItem.getBridgeId();
                    Integer monitorTypeId = bridgeMonitorTypeItem.getMonitorTypeId();
                    Integer monitorItemId = bridgeMonitorTypeItem.getMonitorItemId();
                    List<BridgeProbeStatusDto> probeStatusDtoList = bridgeDeviceSensorProbeService.getListByBridgeIdItemId(bridgeId,monitorTypeId,monitorItemId).getData();
                    String lockKey = RedisPrefixConstant.BRIDGE_PROBE_STATUS + bridgeId + "_" + monitorTypeId + "_" + monitorItemId;
                    RReadWriteLock rwLock = redissonClient.getReadWriteLock(lockKey);
                    Lock writeLock = rwLock.writeLock();
                    writeLock.lock();
                    try{
                   
                        //先删除所有
                        redisUtils.delByKey(lockKey,11);
                        for (int i = 0; i < probeStatusDtoList.size(); i++) {
                            //选择11号库进行存储，用每个探头在集合中的顺序作为其Score值
                            BridgeProbeStatusDto bridgeProbeStatusDto = probeStatusDtoList.get(i);
                            bridgeProbeStatusDto.setLatestTime(new Date());
                            redisUtils.zAddOne(11, lockKey, JSONUtil.toJsonStr(bridgeProbeStatusDto),(double) i);
                        }
                    }catch (Exception e){
                        log.error("初始化探头状态时异常:{}", e.getMessage());
                    }finally {
                        writeLock.unlock();
                    }
                }
            });
        }
        //关闭线程池
        executorService.shutdown();
    }
```