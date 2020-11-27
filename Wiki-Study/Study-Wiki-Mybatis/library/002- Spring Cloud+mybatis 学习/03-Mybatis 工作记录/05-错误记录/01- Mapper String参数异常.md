# Mapper String参数异常

## Mybatis异常There is no getter for property named 'XXX' in 'class java.lang.String'

* 参考：https://www.cnblogs.com/orac/p/6726323.html

Mybatis版本:mybatis-3.0.6.jar

1.当入参为 string类型时 (包括java.lang.String.) 

我们使用#{xxx}引入参数.会抛异常There is no getter for property named 'XXX' in 'class java.lang.String'





```xml
<select id="getBookingCount" resultType="int" parameterType="string">

select count(*) from TB_EMPC_BOOKING_ORDER T

where (t.state = '1' or t.state = '2')

and t.appointmenttime = #{state}

</select>
```

2.解决方法一:把#{xxx}修改为 #{_parameter} 即可 


```xml
<select id="getBookingCount" resultType="int" parameterType="string">

select count(*) from TB_EMPC_BOOKING_ORDER T

where (t.state = '1' or t.state = '2')

and t.appointmenttime = #{_parameter}

</select>
```


3.解决方法二:可以在方法中提前定义:

```java
public int  methodName(@Param(value="state") String state ){

　　...

}
```


4.原因:Mybatis默认采用OGNL解析参数，所以会自动采用对象树的形式取 string.xxx 值，如果没在在方法中定义,则会抛异常报错。


## 如果指定了param 判空时候仍然提示没有String的获取参数值的错误



问题：

```xml
<select id="" resultMap="resultMapPlate" parameterType="java.lang.String"> 
               <if test="com != null"> 
                 and com = #{com,jdbcType=VARCHAR}
              </if>
                and open='chat'
         </select>
```

解决：将<if test="com != null"> 换为<if test="_parameter != null">

## 问题三

我是加了@Param("searchName") 注解 也不能用参数名字判空   （ <if test="com != null">） 这种写法，后来我去看之前人写的Param 引入的包，gan，包都引错了，我真的是服了


```

之前人写的mapper 引入的是 fegin.Param ，所以我这里用的时候一直提示报错，坑人
<!-- import org.apache.ibatis.annotations.Param; -->
 List<Map> getFilingQyName(@Param("searchName")  String searchName);
 
```