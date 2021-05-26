# mybatis中自增字段

## 总结

```xml
<!--添加订单到order-->
    <insert id="insert" parameterType="com.hxj.pojo.Orderx">
        <selectKey resultType="java.lang.Integer" order="AFTER" keyProperty="id">
            select LAST_INSERT_ID()
        </selectKey>
        insert into orderx(userid,allprice,ordertime,address)
        values(#{userid},#{allprice},#{ordertime},#{address})
    </insert>

```

将对象传入当前方法插入之后然后调用对象的id 即可