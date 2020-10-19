
# oracel 查询；


```sql
SELECT 'man' || 'jia' || 'hua' FROM DUAL;

select concat('man',concat('jia','jia2')) from dual;
select concat('man',concat('jia',concat('jia2','jia3'))) from dual;
```

# oracel mybatis xml 使用

## like 模糊查询

```

使用oracle自带 || 拼凑的方式
<if test="userName!=null and userName!=''">
   AND u.USER_NAME like '%' || #{userName} || '%'
</if>

使用MyBatis的$符号的方式
<if test="userName!=null and userName!=''">
   AND u.USER_NAME like '%${userName}%'
</if>

总结：实测两种方式均可。推荐orcale自带 || 拼凑符号方式。因为MyBatis的$符号有sql注入风险

```

```sql

AND a.name LIKE '%' || #{queryParamsLike.resourceName} || '%'

```


## 大于小于

* sql 语句

```sql
SELECT
	main.id mid,
	main.ATTRIBUTION_ORG_ID attributionOrgId,
	main.ATTRIBUTION_ORG_NAME attributionOrgName,
	main.WORK_ORG_TYPE workOrgType ,
	main.WORK_ORG_ID workOrgId,
	main.WORK_ORG_NAME workOrgName,
	main.WORK_NAME workName,
	main.WORK_LOCATION workLocation,
	main.PLANNED_START_TIME plannedStartTime,
	main.PLANNED_END_TIME plannedEndTime,
	main.WORK_STATE workState
	
FROM
	HAZARDOUS_MAIN main
where 1=1
	and main.PLANNED_START_TIME >= to_date('2019-11-04 10:58:23','yyyy-mm-dd,hh24:mi:ss')
	and main.PLANNED_END_TIME <= to_date('2019-11-07 10:58:23','yyyy-mm-dd,hh24:mi:ss')
	and main.WORK_ORG_ID = '1234'
	and main.WORK_NAME like '%作业名字%'
	and main.WORK_LOCATION like '%作业地点%'
	and main.WORK_LEVEL = 3

```

```xml
  <select id="getHazardousMainsBySerachDto"
            resultMap="BaseResultMapVo">
      SELECT
        main.id mid,
        main.ATTRIBUTION_ORG_ID attributionOrgId,
        main.ATTRIBUTION_ORG_NAME attributionOrgName,
        main.WORK_ORG_TYPE workOrgType ,
        main.WORK_ORG_ID workOrgId,
        main.WORK_ORG_NAME workOrgName,
        main.WORK_NAME workName,
        main.WORK_LOCATION workLocation,
        main.PLANNED_START_TIME plannedStartTime,
        main.PLANNED_END_TIME plannedEndTime,
        main.WORK_STATE workState
      FROM
        HAZARDOUS_MAIN main
        where 1=1
      <if test="hazardousMain !=null and  hazardousMain.workOrgId != null and hazardousMain.workOrgId != ''">
        AND main.WORK_ORG_ID = #{hazardousMain.workOrgId,jdbcType=CHAR}
      </if>
      <if test="hazardousMain !=null and  hazardousMain.workName != null and hazardousMain.workName != ''">
        AND main.WORK_NAME like '%'|| #{hazardousMain.workName,jdbcType=VARCHAR} || '%'
      </if>
      <if test="hazardousMain !=null and  hazardousMain.workLocation != null and hazardousMain.workLocation != ''">
        AND main.WORK_LOCATION like '%'|| #{hazardousMain.workLocation,jdbcType=VARCHAR} || '%'
      </if>
      <if test="hazardousMain !=null and  hazardousMain.workLevel != null ">
        AND main.WORK_LEVEL = #{hazardousMain.workLevel,jdbcType=DECIMAL}
      </if>
      <if test="hazardousMain !=null and  hazardousMain.plannedStartTime != null ">
        AND main.PLANNED_START_TIME  &gt;= #{hazardousMain.plannedStartTime,jdbcType=TIMESTAMP}
      </if>
      <if test="hazardousMain!=null and  hazardousMain.plannedEndTime != null ">
        AND main.PLANNED_END_TIME   &lt;=  #{hazardousMain.plannedEndTime,jdbcType=TIMESTAMP}
      </if>
    </select>
```