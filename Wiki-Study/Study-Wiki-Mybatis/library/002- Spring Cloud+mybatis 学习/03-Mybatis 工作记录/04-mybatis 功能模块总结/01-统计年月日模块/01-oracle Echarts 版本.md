# oracle echarts 统计年月日

## 这里以我做过的大气年月日报警为案例

### 前端

```
```



## 后端

```java
public Map getAirAlarmCountByCarCode(int timeType, String stationMN) {
        Map<String, Object> returnMap = new HashMap<>();
        String[] commonArray = null;
        String commonFormatStr = null;
        int queryTime = 7;
        if(0 == timeType){
            //查询7年的数据
            queryTime= 7;
            String formatStr = "yyyy";
            String[] yearArray = new String[queryTime];
            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            SimpleDateFormat slf = new SimpleDateFormat(formatStr);
            //拆线呢钱7年的年份
            for (int i=0;i<queryTime;i++) {
                yearArray[queryTime-i-1] = slf.format(c.getTime());
                c.add(Calendar.YEAR,-1);
            }
            commonArray = yearArray;
            commonFormatStr = formatStr;
        }else if(1 == timeType){
            //查询12个月的数据
            queryTime = 12;
            String formatStr = "yyyy-MM";
            String[] monthArray = new String[queryTime];
            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            SimpleDateFormat slf = new SimpleDateFormat(formatStr);
            //获取前12个月的年月
            for (int i=0;i<queryTime;i++) {
                monthArray[queryTime-i-1] = slf.format(c.getTime());
                c.add(Calendar.MONTH,-1);
            }
            commonArray = monthArray;
            commonFormatStr = formatStr;
        }else if(2 == timeType){
            //查询七天的数据
            queryTime = 7;
            String formatStr = "yyyy-MM-dd";
            String[] weekArray = new String[queryTime];
            Calendar c = Calendar.getInstance();
            c.setTime(new Date());
            SimpleDateFormat slf = new SimpleDateFormat(formatStr);
            //获取前七天的年月日
            for (int i=0;i<queryTime;i++) {
                weekArray[queryTime-i-1] = slf.format(c.getTime());
                c.add(Calendar.DAY_OF_YEAR,-1);
            }
            commonArray = weekArray;
            commonFormatStr = formatStr;
        }
        int [] airStationCountArray = new int[queryTime]; //空气站
        int [] exhaustCountArray = new int[queryTime];     //排口
        int [] sumArray = new int[queryTime];                 //合计
        List<Map> airCount = airStationAlarmMapper.getAirAlarmCountByCarCode(stationMN, commonFormatStr, commonArray[0], commonArray[commonArray.length - 1]);
        for (int i=0;i<commonArray.length;i++) {
            int sum = 0;
            for (Map warn : airCount) {
                int count = ((BigDecimal)warn.get("COUNT")).intValue();
                if(commonArray[i].equals(warn.get("CREATE_TIME"))){
                    sum += count;
                }
                // 1 空气站 2 排口
                if(commonArray[i].equals(warn.get("CREATE_TIME")) && "1".equals(warn.get("AIR_TYPE"))){
                    airStationCountArray[i] += count;
                    continue;
                }else if(commonArray[i].equals(warn.get("CREATE_TIME")) && "2".equals(warn.get("AIR_TYPE"))){
                    exhaustCountArray[i] += count;
                    continue;
                }
            }
            sumArray[i] = sum;
        }
        String []nameArray = {"空气站","排口","总数"};
        returnMap.put("timeArray", commonArray);
        returnMap.put("nameArray", nameArray);
        returnMap.put("airStationCountArray", airStationCountArray);
        returnMap.put("exhaustCountArray", exhaustCountArray);
        returnMap.put("sumArray", sumArray);

        return returnMap;
    }
```


* mapper 接口
```java
    List<Map> getAirAlarmCountByCarCode(@Param("stationMn") String stationMn,@Param("format") String format,
                                        @Param("startTime")String startTime, @Param("endTime")String endTime);


```


* mapper 的xml 语句

```xml
<select id="getAirAlarmCountByCarCode" resultType="java.util.Map">
        select t.* ,count(1) as count from (
        SELECT
        AIR_TYPE ,
        to_char( CREATE_TIME, #{format}) as CREATE_TIME
        FROM
        AIR_STATION_ALARM
        <where>
            <if test="stationMn!=null and stationMn!=''">
                AND STATION_MN = #{stationMn}
            </if>
            <if test="startTime!=null and startTime!=''">
                AND to_char( CREATE_TIME, #{format}) &gt;= #{startTime}
            </if>
            <if test="startTime!=null and startTime!=''">
                AND to_char( CREATE_TIME, #{format}) &lt;= #{endTime}
            </if>
        </where>
        ) t group by  CREATE_TIME, AIR_TYPE


    </select>
```

* 比如：


```sql
 select t.* ,count(1) as count from (
        SELECT
        AIR_TYPE ,
        to_char( CREATE_TIME, 'yyyy-MM-dd') as CREATE_TIME
        FROM
        AIR_STATION_ALARM
				where  1=1
				AND to_char( CREATE_TIME, 'yyyy-MM-dd') >= '2020-10-03'
			    AND to_char( CREATE_TIME, 'yyyy-MM-dd') <= '2020-10-10'
        ) t group by  CREATE_TIME, AIR_TYPE
				
				
```

结果：

```
AIR_TYPE CREATE_TIME COUNT
2	2020-10-08	63
2	2020-10-05	12
2	2020-10-06	2
2	2020-10-04	1
2	2020-10-07	42
2	2020-10-09	20
2	2020-10-03	14
```