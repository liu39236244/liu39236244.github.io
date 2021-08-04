# Mapper 中使用总结


## 批量进行插入操作（oracel）

```xml
按理来说 正常语句如下，但是oracel 批量插入不一样
<insert id="insertControlMenuList" parameterType="java.util.List">
      insert into lzf_rental_item_detailsl
      (<include refid="Base_Column_List"/>)
      values
      <foreach collection="userControlMenuList" item="item" index= "index" separator =",">
        (
        #{item.id,jdbcType=CHAR},
        #{item.userId,jdbcType=CHAR},
        #{item.menuId,jdbcType=CHAR},
        #{item.sort,jdbcType=DECIMAL},
        #{item.createTime,jdbcType=TIMESTAMP},
        <if test="item.lastUpdateTime != null and item.lastUpdateTime!=''">
          #{item.lastUpdateTime,jdbcType=TIMESTAMP}
        </if>
        )
      </foreach>

    </insert>

对于foreach标签的解释参考了网上的资料，具体如下：
foreach的主要用在构建in条件中，它可以在SQL语句中进行迭代一个集合。foreach元素的属性主要有 item，index，collection，open，separator，close。item表示集合中每一个元素进行迭代时的别名，index指 定一个名字，用于表示在迭代过程中，每次迭代到的位置，open表示该语句以什么开始，separator表示在每次进行迭代之间以什么符号作为分隔 符，close表示以什么结束，在使用foreach的时候最关键的也是最容易出错的就是collection属性，该属性是必须指定的，但是在不同情况 下，该属性的值是不一样的，主要有一下3种情况：

1.如果传入的是单参数且参数类型是一个List的时候，collection属性值为list
2.如果传入的是单参数且参数类型是一个array数组的时候，collection的属性值为array
3.如果传入的参数是多个的时候，我们就需要把它们封装成一个Map了，当然单参数也可以封装成map
关于foreach的具体例子在这里就先不举，以后有机会可以把每一种情况都举一个例子列出来。

注意oracel的一次性插入：

复制代码
insert all into JK_TB_DATE (fbmmc,fgzjh,fsbmc,fsbxh,fsbbh,db_shuifenyi,db_pihao,db_wuliaobianma)
                values ('检测督查科','102','水分测试仪','SDWE-BZDHX-15','hx001','1#水分仪','11','')
           into JK_TB_DATE (fbmmc,fgzjh,fsbmc,fsbxh,fsbbh,db_shuifenyi,db_pihao,db_wuliaobianma)
                values ('检测督查科','102','水分测试仪','SDWE-BZDHX-10','hx002','2#水分仪','22','')
           into JK_TB_DATE (fbmmc,fgzjh,fsbmc,fsbxh,fsbbh,db_shuifenyi,db_pihao,db_wuliaobianma)
                values ('检测督查科','102','水分测试仪','SDWE-BZDHX-25','hx003','3#水分仪','33','')
           select 1 from dual
复制代码
需要注意的是，要使用insert all into来插入。

语句的最后要加一条select 1 from dual语句。

INSERT  ALL 
INTO USER_DEFINED_MENU ( ID, USER_ID, MENU_ID, SORT )
VALUES ('12223','f123','f123',2)
INTO USER_DEFINED_MENU ( ID, USER_ID, MENU_ID, SORT )
values ('1aa3','f123asad','f12asd3',3)
select 1 from dual
	

```

### oracel批量插入


```java
    void insertControlMenuList(@Param("userControlMenuList") List<UserDefinedMenu> userControlMenuList);
```

```xml
<mapper namespace="com.graphsafe.ehs.mapper.UserDefinedMenuMapper">
  <resultMap id="BaseResultMap" type="com.graphsafe.api.model.user.po.UserDefinedMenu">
    <!--
      WARNING - @mbg.generated
    -->
    <id column="ID" jdbcType="CHAR" property="id" />
    <result column="USER_ID" jdbcType="CHAR" property="userId" />
    <result column="MENU_ID" jdbcType="CHAR" property="menuId" />
    <result column="SORT" jdbcType="DECIMAL" property="sort" />
    <result column="CREATE_TIME" jdbcType="TIMESTAMP" property="createTime" />
    <result column="LAST_UPDATE_TIME" jdbcType="TIMESTAMP" property="lastUpdateTime" />
  </resultMap>
  <sql id="Base_Column_List">
    <!--
      WARNING - @mbg.generated
    -->
    ID, USER_ID, MENU_ID, SORT,CREATE_TIME,LAST_UPDATE_TIME
  </sql>
  <sql id="Base_Column_List_NoUpdate">
    <!--
      WARNING - @mbg.generated
      注意中间 into table_name values() into table_name values()  之间不能有逗号之类的，否则包select 关键字没有
    -->
    ID, USER_ID, MENU_ID, SORT,CREATE_TIME
  </sql>
    <insert id="insertControlMenuList" parameterType="java.util.List">
      INSERT  ALL
      <foreach collection="userControlMenuList" item="item" index= "index" >
        INTO USER_DEFINED_MENU (<include refid="Base_Column_List_NoUpdate"/>)
        VALUES(
        #{item.id,jdbcType=CHAR},
        #{item.userId,jdbcType=CHAR},
        #{item.menuId,jdbcType=CHAR},
        #{item.sort,jdbcType=DECIMAL},
        #{item.createTime,jdbcType=TIMESTAMP}
        )
      </foreach>
      SELECT 1 FROM DUAL
    </insert>
</mapper>
```


### 修改带有level 的树形数据并且修改部分数据子父级，以后执行的更新sql


* mysql数据表

```sql
UPDATE se_depart  SET LEVEL = ( SELECT LEVEL + 1 FROM se_depart D2 WHERE D2.id = se_depart.parent_id AND se_depart.status= 1 AND D2.status= 1 ) 
WHERE
	se_depart.parent_id != '-1'
	AND se_depart.status= 1
```


* oracel 数据表

```sql

  <update id="formartDic">
      UPDATE USER_SYSTEM_DICTIONARY
      SET "LEVEL" = 1
      WHERE PARENT_CODE IS NULL
  </update>


  <!--对所有字典进行重新排序-->
  <update id="resortDic">
     UPDATE USER_SYSTEM_DICTIONARY D1
    SET "LEVEL" = (SELECT "LEVEL" + 1 FROM USER_SYSTEM_DICTIONARY D2 WHERE D2.DICTIONARY_CODE = D1.PARENT_CODE AND D1.IS_DELETE='0' AND D2.IS_DELETE='0')
    WHERE D1.PARENT_CODE IS NOT NULL AND D1.IS_DELETE='0'
  </update>

```



## _parameters 使用


在用自动生成工具生成的mybatis代码中，总是能看到这样的情况，如下：

```xml

<select id="selectByExample" resultMap="BaseResultMap" parameterType="com.juhehl.kapu.pojo.TbCardExample" >  
    select  
    <if test="distinct" >  
      distinct  
    </if>  
    <include refid="Base_Column_List" />  
    from tb_card  
    <if test="_parameter != null" >  
      <include refid="Example_Where_Clause" />  
    </if>  
    <if test="orderByClause != null" >  
      order by ${orderByClause}  
    </if>  
  </select>  

```

可以看到有个<if test="_parameter != null" >，如果只有一个参数，那么_parameter 就代表该参数，如果有多个参数，那么_parameter 可以get(0)得到第一个参数。



* 1.简单数据类型,此时#{id,jdbcType=INTEGER}中id可以取任意名字如#{a,jdbcType=INTEGER},如果需要if test则一定使用<if test="_parameter != null">,此处一定使用_parameter != null而不是id != null

```xml


<select id="selectByPrimaryKey" resultMap="BaseResultMap" parameterType="Java.lang.Integer" >
 select 
 <include refid="Base_Column_List" />
 from base.tb_user
<if test="_parameter != null">
 where id = #{id,jdbcType=INTEGER}
</if>
</select>
```


*  其他

```sql

测试user对象<if test="_parameter != null">,测试user对象属性<if test="name != null">或者<if test="#{name} != null">
int insert(User user);
<insert id="insert" parameterType="User" useGeneratedKeys="true" keyProperty="id">
insert into tb_user (name, sex) values (#{name,jdbcType=CHAR}, #{sex,jdbcType=CHAR})

 3. 二个对象数据类型
List<User> select(User user,Page page),此时if test一定要<if test='_parameter.get("0").name != null'>(通过parameter.get(0)得到第一个参数即user);where语句where name = #{0.name,jdbcType=CHAR}(通过0.name确保第一个参数user的name属性值)

不用0,1也可以取名List<User> select(@param(user)User user,@param(page)Page page)


 4. 集合类型,此时collection="list"会默认找到参数的那个集合idlist(collection="list"这是默认写法,入参为数组Integer[] idarr,则用collection="array")
User selectUserInList(List<Interger> idlist);
<select id="selectUserInList" resultType="User">
SELECT * FROM USER  WHERE ID in
 <foreach item="item" index="index" collection="list" open="(" separator="," close=")">
#{item}
 </foreach>
</select>

 5. 对象类型中的集合属性,此时collection="oredCriteria"会找到入参example这个非集合对象的oredCriteria属性,此属性是一个集合
List<User> selectByExample(UserExample example);
<where>
<foreach collection="oredCriteria" item="criteria" separator="or" >
<if test="criteria.valid" >


 6. map类型(分页查询教师信息)
public List<Teacher> findTeacherByPage(Map<String, Object> map); 
Map<String, Object> params = new HashMap<String, Object>(); 
//以name字段升序排序，params.put("sort", "name"); params.put("dir", "asc");
//查询结果从第0条开始，查询2条记录 params.put("start", 0);  params.put("limit", 2);  
//查询职称为教授或副教授的教师  params.put("title", "%教授"); 
此时入参map的key相当于一个object的属性名,value相当于属性值
<select id="findTeacherByPage"resultMap="supervisorResultMap" parameterType="java.util.Map">
select * from teacher where title like #{title}           
        order by ${sort} ${dir} limit #{start},#{limit} 
</select> 

 7.批量插入
<insert id="addRoleModule" parameterType="java.util.List">
INSERT INTO T_P_ROLE_MODULE (ROLE_ID, MODULE_ID)
<foreach collection="list" item="item" index="index" separator=" UNION ALL "> 
SELECT #{item.roleId}, #{item.moduleId} FROM DUAL
</foreach>
</insert>

  8.MyBatis+MySQL 返回插入的主键ID
在mapper中指定keyProperty属性，示例如下：
我们在insert中指定了keyProperty="userId"和useGeneratedKeys="true",其中userId代表插入的User对象的主键属性。
System.out.println("插入前主键为："+user.getUserId());
userDao.insertAndGetId(user);//插入操作
System.out.println("插入前主键为："+user.getUserId());  

    <insert id="insertAndGetId" useGeneratedKeys="true" keyProperty="userId" parameterType="com.chenzhou.mybatis.User">  
 insert into user(userName,password,comment) values(#{userName},#{password},#{comment})  
    </insert>

```




## 不为空添加条件判断


```xml
<if test="lockTime != null ">
                <choose>
                    <when test="lockTime == 1 ">
                        LOCK_TIME = sysdate,
                    </when>
                    <otherwise>
                        LOCK_TIME = lockTime,
                    </otherwise>
                </choose>
            </if>
```


## 时间日、月、时间范围 SQL mapper 写法

```xml
<select id="getHistoryRecordByEquipments"
            resultType="com.graphsafe.xsn.model.humiture.vo.HumitureEquipmentDataVo">

        SELECT
        #{organizationName} as organizationName,
        #{devname} as devname,
        #{name} as name,
        #{nodeTypeName} as nodeTypeName,
        t1.ID id,
        t1.NODE_ID nodeId,
        t1.DEVID devid,
        t1.DEVCODE devcode,
        t1.HUMIDITY humidity,
        t1.TEMPERATURE temperature,
        t1.VOLTAGE voltage,
        t1.CREATE_TIME createTime,
        t1.HUMIDITY_WARNING humidityWarning,
        t1.TEMPERATURE_WARNING temperatureWarning,
        t1.VOLTAGE_WARNING voltageWarning,
        t1.STATUS status
        FROM
        ${tableName} t1

        <where>
            <if test="temperatureWarning != null and temperatureWarning !=''">
                AND t1.TEMPERATURE_WARNING= #{temperatureWarning}
            </if>
            <if test="humidityWarning != null and humidityWarning !=''">
                AND t1.HUMIDITY_WARNING= #{humidityWarning}
            </if>
            <if test="devId != null and devId != ''">
                AND t1.DEVID = #{devId}
            </if>
            <if test="nodeId != null and nodeId != ''">
                AND t1.NODE_ID = #{nodeId}
            </if>
            <if test="dateType != null and dateType == 'datePicker'.toString()">
                AND CONVERT(varchar(10), t1.CREATE_TIME, 23) = #{paramTime}
            </if>
            <if test="dateType != null and dateType == 'monthPicker'.toString()">
                AND LEFT(CONVERT(varchar(20),t1.CREATE_TIME,23),7) = #{paramTime}
            </if>
            <if test="dateType != null and dateType == 'userPicker'.toString()">
               AND t1.CREATE_TIME  >=  #{startTime} AND t1.CREATE_TIME <= #{endTime}
            </if>
        </where>
        ORDER BY t1.CREATE_TIME ${order}


    </select>
```