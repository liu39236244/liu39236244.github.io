# oracle 时间条件 mybatis 中xml写法


## 1 直接写大于小于，用cdata 包裹起来


```xml
 <select id="getAirAlarmList" resultMap="BaseResultMapDto">
        select
        <include refid="Base_Column_List"/>
        from AIR_STATION_ALARM
        where 1=1
        <if test="stationMn != null and stationMn != '' ">
            STATION_MN = #{stationMn,jdbcType=VARCHAR},
        </if>
        <if test="id != null and id !=''">
            and ID = #{id,jdbcType=CHAR}
        </if>
        <if test="stationName != null and stationName !='' ">
            and STATION_NAME LIKE CONCAT('%',CONCAT(stationName,'%'))
        </if>
        <if test="startTime != null">
            and <![CDATA[CREATE_TIME>= #{startTime}]]>
        </if>
        <if test="endTime != null">
            and <![CDATA[CREATE_TIME<= #{endTime}]]>
        </if>
        <if test="airType != null and airType !='' ">
            and AIR_TYPE = #{airType,jdbcType=VARCHAR}
        </if>
        <if test="isHandle != null  ">
            and IS_HANDLE = #{isHandle,jdbcType=INTEGER}
        </if>

        order by CREATE_TIME desc
    </select>
```

## 大小写在<if > 中如果加了判断则可以直接大小写

to_char(这种的方式) format:格式化


TO_CHAR(a.STR_SMS_TIME,'yyyy-MM-dd HH24:mi:ss')
TO_CHAR(a.STR_SMS_TIME,'yyyy-MM-dd')
如果MM 大小写有问题，可能会提示无效的月份问题
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
                AND to_char( CREATE_TIME, #{format}) >= #{startTime}
            </if>
            <if test="startTime!=null and startTime!=''">
                AND to_char( CREATE_TIME, #{format}) <= #{endTime}
            </if>
        </where>
        ) t group by  CREATE_TIME, AIR_TYPE


    </select>
```

to_date ，至于 yyyy-MM-dd的测试；抽时间挨个做测试

```xml
   <if test="sdate != null  and edate != null and sdate != '' and edate != ''">
            and to_date(to_char(FW.WARNING_TIME,'yyyy-mm-dd'),'yyyy-mm-dd') &gt;= to_date(#{sdate},'yyyy-mm-dd')
            and to_date(to_char(FW.WARNING_TIME,'yyyy-mm-dd'),'yyyy-mm-dd') &lt;= to_date(#{edate},'yyyy-mm-dd')
   </if>

     <if test="endDate != null and endDate != ''">
                and to_date(to_char(a.CREATE_TIME,'yyyy-mm-dd hh:mi:ss'),'yyyy-mm-dd hh:mi:ss') &lt;=
                to_date(#{endDate},'yyyy-mm-dd hh:mi:ss')
     </if>
```