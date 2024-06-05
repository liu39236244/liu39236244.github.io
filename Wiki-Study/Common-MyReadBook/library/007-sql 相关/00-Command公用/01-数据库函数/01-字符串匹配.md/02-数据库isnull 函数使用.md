# isnull数据库函数使用

##  SQL中 isnull（）用法总结


```
SQL Server中的isnull()函数：

   isnull(value1,value2)

        1、value1与value2的数据类型必须一致。

        2、如果value1的值不为null，结果返回value1。

        3、如果value1为null，结果返回vaule2的值。vaule2是你设定的值。

 如果在select中就是isnull可以判断是否是null，如果是给个默认值，isnull("字段名"，"设定默认的数据")

      例如：select isnull(分数,0) from xuesheng where name='凡九龙'  在表xuesheng中，字段分数如果为空，结果输出0。如果不为空，输出字段分数的值。

在  sql server中字段为空的写法，select name  from A where name is null/is not null  。而不是name=null、name=' '。
 

 MySQL：

1.isnull(exper) 判断exper是否为空，是则返回1，否则返回0

2.ifnull(exper1,exper2)判断exper1是否为空，是则用exper2代替

3.nullif(exper1,exper2)如果expr1= expr2 成立，那么返回值为NULL，否则返回值为  expr1。
 

Oracle：

1、nvl(value1,value2)  

这个函数的意思是如果value1的值为null,那么函数返回value2的值  ,如果value1不为空,那么就返回value1的值。

需要注意的是value1和value2要保持字段类型相同。

2、nvl2(value1,value2,value3)  

这个函数的意思是如果value1的值为null 函数返回value3   否则函数返回value2   也就是说函数永远不会返回value1

注意的是参数value2 value3可以是除了LONG类型之外的任意数据类型。

3、NULLIF函数的格式如下：

NULLIF(expr1,expr2)，含义是：如果第一个参数的值等于第二个参数的值则返回空，否则返回第一个值。

```