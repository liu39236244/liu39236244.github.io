# mybatis 使用map 接数据集



## 总结



## 参考


### map 两种方式

```java
一  返回一条记录的map

1. mapper.xml 中 resultType="map" 

<select id="getEmpByIdReturnMap" resultType="map">
         select * from employee where id=#{id}
</select>

2. 接口中 

//key就是列名，值就是对应的值
public Map<String, Object> getEmpByIdReturnMap(Integer id);

 

二 返回 多条数据的 map

1. mapper 

<select id="getEmpByLastNameLikeReturnMap" resultType="employee">
         select * from employee where last_name like #{lastName}
 </select>

2. 接口

//Map<Integer,Employee>:键是这条记录的主键，值是记录封装后的javaBean
//@MapKey:告诉mybatis封装这个map的时候使用哪个属性作为map的key
@MapKey("id")
public Map<Integer, Employee> getEmpByLastNameLikeReturnMap(String lastName);

```