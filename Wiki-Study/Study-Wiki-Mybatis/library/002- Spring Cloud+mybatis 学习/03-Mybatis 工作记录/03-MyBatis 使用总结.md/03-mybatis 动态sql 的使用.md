# mybatis 动态sql的使用


## insert 使用动态sql 

* [参考博主：](https://blog.csdn.net/weixin_43171019/article/details/84641583)

```xml
<!-- 插入user方法一 -->
  <insert id="addUser" parameterType="user">
   insert into smbms_user(userCode,userName,userPassword,gender,address,phone) 
    values(#{userCode},#{userName},#{userPassword},#{gender},#{address},#{phone})
  </insert>

```

换做动态sql 

```xml
<!-- 动态sql插入方法二   start -->
  <!-- 对应的插入字段的名字 -->
  <sql id="key">
   <trim suffixOverrides=",">
    <if test="userCode!=null and userCode!=''">
     userCode,
    </if>
    <if test="userName!=null and userName!=''">
     userName,
    </if>
    <if test="userPassword!=null and userPassword!=''">
     userPassword,
    </if>
    <if test="gender!=null and gender!=''">
     gender,
    </if>
    <if test="address!=null and address!=''">
     address,
    </if>
    <if test="phone!=null and phone!=''">
     phone,
    </if>
   </trim>
  </sql>
  
  <!-- 对应的插入字段的值 -->
  <sql id="values">
   <trim suffixOverrides=",">
    <if test="userCode!=null and userCode!=''">
     #{userCode},
    </if>
    <if test="userName!=null and userName!=''">
     #{userName},
    </if>
    <if test="userPassword!=null and userPassword!=''">
     #{userPassword},
    </if>
    <if test="gender!=null and gender!=''">
     #{gender},
    </if>
    <if test="address!=null and address!=''">
     #{address},
    </if>
    <if test="phone!=null and phone!=''">
     #{phone},
    </if>
   </trim>
  </sql>
  <insert id="addUser2" parameterType="user">
   insert into smbms_user(<include refid="key"/>) 
    values(<include refid="values"/>)
  </insert>
    <!-- 动态sql插入方法二  end-->

```