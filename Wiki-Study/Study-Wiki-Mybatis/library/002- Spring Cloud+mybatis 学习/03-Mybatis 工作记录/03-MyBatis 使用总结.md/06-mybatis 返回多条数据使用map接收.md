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


### 返回map demo1 统计当天24个小时每个小时的 sum 统计
 

返回的数据就是范围时间内每个小时上下行车辆的一个统计，  0-23  23条数据，用小时作为 key 返回



```java
    @MapKey("hour_index")
    Map<Integer, Map<String, Object>> getHourNumOptimize(@Param("serviceAreaId") String serviceAreaId,
                                                            @Param("beginTime") Date beginTime,
                                                            @Param("endTime") Date endTime);

```

 ```sql
 SELECT
	num_table.hour_index,
	data_table.hour_index hour_index_data,
    CASE
		WHEN data_table.by_dir_1 IS NULL THEN
		0 ELSE data_table.by_dir_1
	END by_dir_1,
    CASE
		WHEN data_table.by_dir_2 IS NULL THEN
		0 ELSE data_table.by_dir_2
	END by_dir_2
	FROM
		(
		SELECT
			0 AS hour_index UNION
		SELECT
			1 UNION
		SELECT
			2 UNION
		SELECT
			3 UNION
		SELECT
			4 UNION
		SELECT
			5 UNION
		SELECT
			6 UNION
		SELECT
			7 UNION
		SELECT
			8 UNION
		SELECT
			9 UNION
		SELECT
			10 UNION
		SELECT
			11 UNION
		SELECT
			12 UNION
		SELECT
			13 UNION
		SELECT
			14 UNION
		SELECT
			15 UNION
		SELECT
			16 UNION
		SELECT
			17 UNION
		SELECT
			18 UNION
		SELECT
			19 UNION
		SELECT
			20 UNION
		SELECT
			21 UNION
		SELECT
			22 UNION
		SELECT
			23
		) num_table
		LEFT JOIN (
		SELECT HOUR
			( zp_time ) AS hour_index,
			SUM( CASE WHEN by_dir = 1 THEN 1 ELSE 0 END ) AS by_dir_1,
			SUM( CASE WHEN by_dir = 2 THEN 1 ELSE 0 END ) AS by_dir_2
		FROM
			gs_bayonet_data
            where fw_id = #{serviceAreaId}
            and types = '1'
            and zp_time between #{beginTime} and #{endTime}
		GROUP BY
			HOUR ( zp_time )
		ORDER BY
		HOUR ( zp_time ) ASC
	) data_table ON num_table.hour_index = data_table.hour_index

 ```