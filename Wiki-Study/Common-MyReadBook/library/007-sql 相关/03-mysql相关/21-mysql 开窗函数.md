# mysql 开窗函数 在mybatis 中的使用


## 根据探头分组，时间倒序、取出排名前n条数据

### 1 返回值按照map<key,Map<String,Object>> 形式


```java

    /**
     * @Author: shenyabo
     * @Date: Create in 2024/9/11 9:12
     * @Description: 根据表名、探头检测类别、类型、检测内容code、监测点code集合 条件查询出对应测点对应表(对应桥、对应天)时间倒序最新的一条数据
     * @Params: [probeAnalysisSearchDataDto]
     * @Return: java.util.List<com.graphsafe.api.model.analysis.po.ProbeAnalysis>
     */
    @MapKey("point_unique_code")
    Map<Long,ProbeAnalysis> getAnalysisDataByParams(ProbeAnalysisSearchRealDataDto probeAnalysisSearchDataDto);

    mapper.xml


    <select id="getAnalysisDataByParams" resultType="java.util.Map">

        SELECT analysis.*
        FROM (
        SELECT *,
        ROW_NUMBER() OVER (PARTITION BY point_unique_code ORDER BY create_time DESC) AS rn
        FROM ${tableName}
        <where>
            <if test="monitorCategory != null and monitorCategory != ''">
                and monitor_category = #{monitorCategory}
            </if>
            <if test="monitorTypeCode != null and monitorTypeCode != ''">
                and monitor_type_code = #{monitorTypeCode}
            </if>
            <if test="monitorContentCode != null and monitorContentCode != ''">
                and monitor_content_code = #{monitorContentCode}
            </if>
            <if test="pointUniqueCodes != null and pointUniqueCodes.size > 0 ">
                and point_unique_code in
                <foreach collection="pointUniqueCodes" item="item" index="index" separator="," open="(" close=")">
                    #{item}
                </foreach>
            </if>
        </where>
        ) analysis
        WHERE analysis.rn = 1;
    </select>
```


### 1 返回值按照list 数组

```java
    /**
     * @Author: shenyabo
     * @Date: Create in 2024/9/11 9:12
     * @Description: 根据表名、探头检测类别、类型、检测内容code、监测点code集合 条件查询出对应测点对应表(对应桥、对应天)时间倒序最新的一条数据
     * @Params: [probeAnalysisSearchDataDto]
     * @Return: java.util.List<com.graphsafe.api.model.analysis.po.ProbeAnalysis>
     */

    List<ProbeAnalysis> getAnalysisDataByParams(ProbeAnalysisSearchRealDataDto probeAnalysisSearchDataDto);


    mapper.xml
    
    <select id="getAnalysisDataByParams" resultType="com.graphsafe.api.model.analysis.po.ProbeAnalysis">
        SELECT analysis.*
        FROM (
        SELECT *,
        ROW_NUMBER() OVER (PARTITION BY point_unique_code ORDER BY create_time DESC) AS rn
        FROM ${tableName}
        <where>
            <if test="monitorCategory != null and monitorCategory != ''">
                and monitor_category = #{monitorCategory}
            </if>
            <if test="monitorTypeCode != null and monitorTypeCode != ''">
                and monitor_type_code = #{monitorTypeCode}
            </if>
            <if test="monitorContentCode != null and monitorContentCode != ''">
                and monitor_content_code = #{monitorContentCode}
            </if>
            <if test="pointUniqueCodes != null and pointUniqueCodes.size > 0 ">
                and point_unique_code in
                <foreach collection="pointUniqueCodes" item="item" index="index" separator="," open="(" close=")">
                    #{item}
                </foreach>
            </if>
        </where>
        ) analysis
        WHERE analysis.rn = 1;
    </select>



```


### 3 不适用开窗函数 比如 mysql5.7.20 

```xml
<select id="getAnalysisDataByParams" resultType="com.graphsafe.api.model.analysis.po.ProbeAnalysis">
        SELECT analysis.*
        FROM (
        SELECT *,
        ROW_NUMBER() OVER (PARTITION BY point_unique_code ORDER BY create_time DESC) AS rn
        FROM ${tableName}
        <where>
            <if test="monitorCategory != null and monitorCategory != ''">
                and monitor_category = #{monitorCategory}
            </if>
            <if test="monitorTypeCode != null and monitorTypeCode != ''">
                and monitor_type_code = #{monitorTypeCode}
            </if>
            <if test="monitorContentCode != null and monitorContentCode != ''">
                and monitor_content_code = #{monitorContentCode}
            </if>
            <if test="pointUniqueCodes != null and pointUniqueCodes.size > 0 ">
                and point_unique_code in
                <foreach collection="pointUniqueCodes" item="item" index="index" separator="," open="(" close=")">
                    #{item}
                </foreach>
            </if>
        </where>
        ) analysis
        WHERE analysis.rn = 1;


        -- 下面是另一种写法

        SELECT
        *
        FROM
        (
        SELECT
        t.*,
        @group_rank :=
        IF
        ( @current_probe_code = point_unique_code, @group_rank + 1, 1 ) AS ranking,
        @current_probe_code := point_unique_code
        FROM
        ${tableName} t,
        ( SELECT @current_probe_code := NULL, @group_rank := 0 ) vars
        <where>
            <if test="monitorCategory != null and monitorCategory != ''">
                and t.monitor_category = #{monitorCategory}
            </if>
            <if test="monitorTypeCode != null and monitorTypeCode != ''">
                and t.monitor_type_code = #{monitorTypeCode}
            </if>
            <if test="monitorContentCode != null and monitorContentCode != ''">
                and t.monitor_content_code = #{monitorContentCode}
            </if>
            <if test="pointUniqueCodes != null and pointUniqueCodes.size > 0 ">
                and t.point_unique_code in
                <foreach collection="pointUniqueCodes" item="item" index="index" separator="," open="(" close=")">
                    #{item}
                </foreach>
            </if>
        </where>
        ORDER BY
        point_unique_code,
        create_time DESC
        ) alldata
        WHERE
        alldata.ranking = 1

    </select>
```