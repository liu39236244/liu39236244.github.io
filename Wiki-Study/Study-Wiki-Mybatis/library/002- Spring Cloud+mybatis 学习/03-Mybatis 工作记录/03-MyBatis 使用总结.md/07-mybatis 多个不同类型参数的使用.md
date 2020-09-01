# 假如一个mapper 的语句中 需要传递多个参数，而且类型还不一样

## 总结


多个参数使用@param注解指定参数名字，在mapper中 #{名字} 即可，如果 参数是实体类，想要获取某个属性可以 #{名字.属性}

* 如下图

第一个参数是实体类，第二个参数是String 字符串

![](assets/002/03/03/07-1598512041508.png)

 如果直接写:

 station_id =#{stationId,jdbcType=VARCHAR} 
 是无法获取 sysPollutant中的 stationId 属性值的，需要 

 ```xml
 update ${tableName}
 set station_id=#{sysPollutant.stationId}
 where 1=1 
 ....
 ```
这样写即可，map 的话也是一样的，直接写key 的名字
