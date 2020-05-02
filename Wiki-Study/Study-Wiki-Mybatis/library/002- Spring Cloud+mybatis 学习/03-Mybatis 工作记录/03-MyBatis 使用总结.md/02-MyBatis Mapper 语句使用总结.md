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