# redis 连接使用类


## 1-pool获取连接方式1

* 类对象：RedisConnection
```java
package cn.netcommander.klcm.common.dao;

import com.sun.org.apache.xml.internal.serializer.utils.Utils;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import redis.clients.jedis.*;
import redis.clients.jedis.exceptions.JedisDataException;

import java.util.HashSet;
import java.util.Set;


public class RedisConnection {

    private static Jedis jedis;//非切片额客户端连接
    private static JedisCluster jediscluster ;//非切片额客户端连接

    public static Utils createFactory() throws Exception{  
        return new Utils();  
    }


    public static Jedis getJedis() {
    	try {
			if (jedis == null) {
			    init();
			}
		} catch (JedisDataException e) {
			e.printStackTrace();
		}
		return jedis;
    }

    public static JedisCluster getJedisCluster() {
    	try {
    		if (jediscluster == null) {
    			init();
    		}
    	} catch (JedisDataException e) {
    		e.printStackTrace();
    	}
    	return jediscluster;
    }

    /**
     * 初始化非切片池
     */
    private static void init()
    {
    	if (jedis != null) {
            try {
            	jedis.close();
            } catch (Exception e) {
                e.printStackTrace();
            }

            jedis = null;
        }
//
//        JedisPoolConfig j=new JedisPoolConfig();
//        j.setMaxIdle(1000);
//        j.setMaxWaitMillis(10000);
//        JedisPool jedisPool=new JedisPool(j,"127.0.0.1",6379);
//        jedis=jedisPool.getResource();


//    	HostAndPort hostAndPort = new HostAndPort(SysData.jc.getRedis_url(),SysData.jc.getRedis_username());
//    	jediscluster = new JedisCluster(hostAndPort);
//    	jedis.auth(SysData.jc.getRedis_password());

    	//集群地址群
    	String uri="10.201.250.9:7000,10.201.250.9:7001,10.201.250.10:7002,10.201.250.10:7003," +
    			"10.201.250.11:7004,10.201.250.11:7005";
        /*String uri="192.168.20.60:7000,192.168.20.60:7001,192.168.20.60:7002," +
                "192.168.20.61:7003,192.168.20.61:7004,192.168.20.61:7005";*/
    	 String[] serverArray = uri.split(",");
         Set<HostAndPort> nodes = new HashSet<HostAndPort>();

         for (String ipPort : serverArray) {
             String[] ipPortPair = ipPort.split(":");
             nodes.add(new HostAndPort(ipPortPair[0].trim(), Integer.valueOf(ipPortPair[1].trim())));
         }
         //redis-cli -h 10.201.250.9 -c -p 7000 --raw
         //注意：这里超时时间不要太短，他会有超时重试机制。而且其他像httpclient、dubbo等RPC框架也要注意这点
//         jediscluster = new JedisCluster(nodes, 1000, 1000, 1, "redis集群密码", new GenericObjectPoolConfig());
         jediscluster = new JedisCluster(nodes, 100000, 100000, 1, new GenericObjectPoolConfig());
    }

}
```
## 2- 使用


```java
 private  JedisCluster jedis = RedisConnection.getJedisCluster();

 jedis = RedisConnection.getJedisCluster();
jedis.del("sq_klhz_hour"); // 参数为key


public TreeSet<String> keys(String pattern){
       TreeSet<String> keys = new TreeSet<String>();
       Map<String, JedisPool> clusterNodes = jedis.getClusterNodes();
       for(String k : clusterNodes.keySet()){
           JedisPool jp = clusterNodes.get(k);
           Jedis connection = jp.getResource();
           try {
               keys.addAll(connection.keys(pattern));
           } catch(Exception e){
               e.printStackTrace();
           } finally{
               connection.close();//用完一定要close这个链接！！！
           }
       }
       System.out.println("Keys gotten!");
       return keys;
   }


   JedisCluster jedis = RedisConnection.getJedisCluster();
		try {

			conn = ConnectionPool.getConnection();

			st = conn.createStatement();

			rs = st.executeQuery(sql);

			String re_tablie = table.replace("min", "hour");
			while(rs.next()){
				JSONObject result = new JSONObject();
				String klhz = rs.getString("KLHZ");
				String snhz = rs.getString("SNHZ");
				String swhz = rs.getString("SWHZ");
				String times = rs.getString("TIME");

				result.put("KLHZ", klhz);
				result.put("SNHZ", snhz);
				result.put("SWHZ", swhz);
				result.put("TIME", times);

				jedis.lpush(re_tablie, result.toString());

			}

			System.out.println(re_tablie);
			System.out.println(jedis.lrange(re_tablie,1,5));




		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}finally{
			try {
				rs.close();
				st.close();
				conn.close();
			} catch (SQLException e) {
				e.printStackTrace();
			}
		}

	}
	
```
