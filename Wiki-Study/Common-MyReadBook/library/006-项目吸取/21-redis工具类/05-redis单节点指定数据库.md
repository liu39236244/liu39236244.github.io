# 


## redis单节点指定数据库工具类


### redis 配置

```java
package com.graphsafe.message.config.redis;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;


/**
* @author : shenyabo
* @date : Created in 2023-09-26 18:29
* @description : redis 配置
* @modified By :
* @version: : v1.0
*/

@Configuration
public class RedisAutoConfiguration {

   @Autowired
   private LettuceConnectionFactory factoryAppoint;


   @Bean(name = "myRedisTemplate")
   public RedisTemplate<String, Object> myRedisTemplate(RedisConnectionFactory factory) {
       RedisTemplate<String, Object> template = new RedisTemplate<>();
       // 配置连接工厂
       template.setConnectionFactory(factory);
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

   /**
    * @Author: shenyabo
    * @Date: Create in 2023/10/17 14:15
    * @Description: 指定redis库的template
    * @Params: []
    * @Return: org.springframework.data.redis.core.RedisTemplate<java.lang.String,java.lang.Object>
    */
   @Bean(name = "myAppointRedisTemplate")
   public RedisTemplate<String, Object> myAppointRedisTemplate() {
       factoryAppoint.setShareNativeConnection(false);
       // 创建RedisTemplate<String, Object>对象
       RedisTemplate<String, Object> template = new RedisTemplate<>();
       // 配置连接工厂
       template.setConnectionFactory(factoryAppoint);
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
}



```

### 工具类

```java
package com.graphsafe.bridge.Utils.redis;

import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.redis.connection.DefaultStringRedisConnection;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author : shenyabo
 * @date : Created in 2023-09-26 17:57
 * @description : redis 工具类
 * @modified By :
 * @version: : v1.0
 */
@Slf4j
@Component
public class RedisUtils {

    @Resource(name = "myRedisTemplate")
    private RedisTemplate<String, Object> myRedisTemplate;

    @Resource(name = "myAppointRedisTemplate")
    private RedisTemplate<String, Object> myAppointRedisTemplate;


    // 存储redis 创建过的数据库链接；防止重复生成
    private Map<Integer, StringRedisConnection> redisConnectionDbMap = new ConcurrentHashMap<>();


    /**
     * @Author: shenyabo
     * @Date: Create in 2023/9/28 10:09
     * @Description: 根据key读取Object 对象数据
     * @Params: [key]
     * @Return: java.lang.Object
     */
    public Object getObjectByKey(String key) {

        if (StringUtils.isEmpty(key)) {
            return null;
        }
        try {

            return myRedisTemplate.opsForValue().get(key);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2023/9/28 10:09
     * @Description: 写入object
     * @Params: [key, value]
     * @Return: boolean
     */
    public boolean setObjectByKey(String key, Object value) {

        if (StringUtils.isEmpty(key)) {
            return false;
        }
        try {
            myRedisTemplate.opsForValue().set(key, value);
            // log.info("存入redis成功，key：{}，value：{}", key, value);
            return true;
        } catch (Exception e) {
            log.error("存入redis失败，key：{}，value：{}", key, value);
            e.printStackTrace();
        }
        return false;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/9/26 18:12
     * @Description: 根据key 获取redis 中的map
     * @Params: [key]
     * @Return: java.util.Map<java.lang.Object, java.lang.Object>
     */
    public Map<Object, Object> getMapDataByKey(String key) {
        if (StringUtils.isEmpty(key)) {
            return null;
        }
        try {
            return myRedisTemplate.opsForHash().entries(key);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;


    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/9/26 18:16
     * @Description: 存入到redis 对应map 数据
     * @Params: [key, mapData]
     * @Return: boolean
     */

    public boolean setMapDataByKey(String key, Map<? extends Object, ? extends Object> mapData) {

        if (StringUtils.isEmpty(key)) {
            return false;
        }
        try {
            //把map集合保存到redis中
            myRedisTemplate.opsForHash().putAll(key, mapData);
            // log.info("存入redis成功，key：{}，value：{}", key, mapData);
            return true;
        } catch (Exception e) {
            // log.error("存入redis失败，key：{}，value：{}", key, mapData);
            e.printStackTrace();
        }
        return false;

    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/11/3 14:37
     * @Description: 将list 存入redis ， flag_json = true 将会将list 转为 json字符串；   flag_json = false 将会作为list 存入redis
     * @Params: [key, list, db, flag_json, timeOut]
     * @Return: boolean
     */
    public  boolean  setList(final String key, List<String> list, int db, boolean flag_json, Long timeOut) {

        boolean result = false;
        try {

            // 先根据db 查找是否已经有对应链接，如果有则拿已有的

            StringRedisConnection stringRedisConnection = redisConnectionDbMap.get(db);
            if(stringRedisConnection == null){
                RedisConnection connection = myAppointRedisTemplate.getConnectionFactory().getConnection();
                stringRedisConnection = new DefaultStringRedisConnection(connection);
                stringRedisConnection.select(db);
                // 将链接缓存起来
                redisConnectionDbMap.put(db, stringRedisConnection);
                log.info("redis 需要使用数据库编号为：{} 的数据库，内存中不存在链接，创建...",db);
            }


            if(flag_json){
                stringRedisConnection.set(key, JSONObject.toJSONString(list));
            }else{
                stringRedisConnection.lPush(key, list.toArray(new String[list.size()]));

            }
            if(timeOut != null && timeOut != 0){
                stringRedisConnection.expire(key, timeOut);
            }
            // redisConnection.close();
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/26 14:25
     * @Description: 缓存到指定redis数据库 value
     * @Params: [key, value, db, flag_json 【是否将value值转为json，为对象时flag_json必须为true】, timeOut【时效（秒）   永久传null】]
     * @Return: boolean
     */
    public boolean set(String key, Object value, int db, boolean flag_json, Long timeOut) {

        boolean result = false;
        try {

            // 先根据db 查找是否已经有对应链接，如果有则拿已有的
            StringRedisConnection stringRedisConnection = getRedisConnection(db);
            if (flag_json) {
                stringRedisConnection.set(key, JSONObject.toJSONString(value));
            } else {
                stringRedisConnection.set(key, value.toString());
            }
            if (timeOut != null && timeOut != 0) {
                stringRedisConnection.expire(key, timeOut);
            }
            // redisConnection.close();
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/25 14:02
     * @Description: 存储到指定数据库 map数据，但是map 只能是 <string,string>
     * @Params: [key, mapValue, db, timeOut]
     * @Return: boolean
     */

    public boolean setHash(String key, Map<String, String> mapValue, int db, Long timeOut) {

        boolean result = false;
        try {
            // 先根据db 查找是否已经有对应链接，如果有则拿已有的
            StringRedisConnection stringRedisConnection = getRedisConnection(db);
            stringRedisConnection.hMSet(key, mapValue);
            if (timeOut != null && timeOut != 0) {
                stringRedisConnection.expire(key, timeOut);
            }
            // redisConnection.close();
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/26 14:19
     * @Description: 根据指定 key 的hash  以及 rowKey 更新 redis db数据库中的hash 某一条数据改为value
     * @Params: [key, rowKey, value, db, timeOut]
     * @Return: boolean
     */
    public boolean setHashByKeyrowKey(String key, String rowKey, String value, int db, Long timeOut) {

        boolean result = false;
        try {
            // 先根据db 查找是否已经有对应链接，如果有则拿已有的
            StringRedisConnection stringRedisConnection = getRedisConnection(db);
            stringRedisConnection.hSet(key, rowKey, value);
            log.info("redis- 更新 key：{} rowKey:{}，value:{} 成功！", key, rowKey, value, db);
            if (timeOut != null && timeOut != 0) {
                stringRedisConnection.expire(key, timeOut);
            }
            // redisConnection.close();
            result = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/26 14:25
     * @Description: 读取指定db的缓存
     * @Params: [key, db]
     * @Return: java.lang.Object
     */
    public Object get(String key, int db) {

        Object result = null;
        try {

            StringRedisConnection stringRedisConnection = getRedisConnection(db);
            result = stringRedisConnection.get(key);

            // 因为考虑到链接频率高这里不进行关闭
            // stringRedisConnection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/25 14:08
     * @Description: 获取指定redis 数据库的 hash数据返回map
     * @Params: [key, db]
     * @Return: java.lang.Object
     */
    public Map<String, String> getHash(String key, int db) {

        Map<String, String> hashMap = null;
        try {
            // 先根据db 查找是否已经有对应链接，如果有则拿已有的

            StringRedisConnection stringRedisConnection = getRedisConnection(db);
            hashMap = stringRedisConnection.hGetAll(key);
            // 单独设置hash 的某个key的值
            // stringRedisConnection.hSet();
            // 单独获取某个hash 的某个key 的value
            // stringRedisConnection.hGet();

            // 因为考虑到链接频率高这里不进行关闭
            // stringRedisConnection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return hashMap;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/26 14:09
     * @Description: 根据指定redis数据库 获取 对应 key 的hash 的 rowkey 对应的value
     * @Params: [key, db]
     * @Return: java.lang.String
     */

    public String getHashByKeyRowKeyAndDb(String hashKey, String rowKey, int db) {

        String result = null;
        try {
            // 先根据db 查找是否已经有对应链接，如果有则拿已有的

            StringRedisConnection stringRedisConnection = getRedisConnection(db);

            // 单独设置hash 的某个key的值
            // stringRedisConnection.hSet();
            // 单独获取某个hash 的某个key 的value
            result = stringRedisConnection.hGet(hashKey, rowKey);

            // 因为考虑到链接频率高这里不进行关闭
            // stringRedisConnection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }


    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/26 14:24
     * @Description: 删除指定db 数据库下的指定key
     * @Params: [key, db]
     * @Return: void
     */
    public void remove(String key, int db) {

        try {

            StringRedisConnection stringRedisConnection = getRedisConnection(db);
            if (stringRedisConnection.exists(key)) {
                stringRedisConnection.del(key);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/11/3 14:40
     * @Description: 获取redis 中list 对应db库中 ，对应范围的数据;
     * @Params: [key, db, startIndex, endIndex]
     * @Return: java.util.List<java.lang.String>
     */
    public  List<String> getList(final String key,int db,int startIndex,int endIndex) {

        List<String> result = new ArrayList<>();
        try {
            // 先根据db 查找是否已经有对应链接，如果有则拿已有的
            StringRedisConnection stringRedisConnection = redisConnectionDbMap.get(db);
            if(stringRedisConnection == null || stringRedisConnection.isClosed()){
                RedisConnection connection = myAppointRedisTemplate.getConnectionFactory().getConnection();
                stringRedisConnection = new DefaultStringRedisConnection(connection);
                stringRedisConnection.select(db);
                // 将链接缓存起来
                redisConnectionDbMap.put(db, stringRedisConnection);
                log.info("redis-获取List， 获取指定库数据，redis 需要使用数据库编号为：{} 的数据库，内存中不存在链接，创建...",db);
            }

            result=stringRedisConnection.lRange(key, startIndex, endIndex);

            // 因为考虑到链接频率高这里不进行关闭
            // stringRedisConnection.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

    /**
     * @Author: shenyabo
     * @Date: Create in 2023/10/26 14:21
     * @Description: 根据db 获取指定redis 数据库 对应的数据库连接操作对象
     * @Params: [db]
     * @Return: org.springframework.data.redis.connection.StringRedisConnection
     */
    private StringRedisConnection getRedisConnection(int db) {

        StringRedisConnection stringRedisConnection = redisConnectionDbMap.get(db);
        if (stringRedisConnection == null) {
            RedisConnection connection = myAppointRedisTemplate.getConnectionFactory().getConnection();
            stringRedisConnection = new DefaultStringRedisConnection(connection);

            stringRedisConnection.select(db);
            // 将链接缓存起来
            redisConnectionDbMap.put(db, stringRedisConnection);
            log.info("redis-存储hash ， 需要使用数据库编号为：{} 的数据库，内存中不存在链接，创建...", db);

        }
        return stringRedisConnection;
    }


}
```