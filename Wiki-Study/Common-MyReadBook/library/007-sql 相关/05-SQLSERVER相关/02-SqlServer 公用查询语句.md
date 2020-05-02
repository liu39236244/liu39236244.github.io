# SqlServer 公用查询记录

## 编码相关

### 查看当前库使用到的编码


```sql
查询语句：SELECT  COLLATIONPROPERTY('Chinese_PRC_Stroke_CI_AI_KS_WS', 'CodePage')；

查询结果： 
936 简体中文GBK ：双字节，无论中英文都是占两个字节
950 繁体中文BIG5 
437 美国/加拿大英语 
932 日文 
949 韩文 
866 俄文 
65001 unicode UFT-8
```


## 权限相关


## 时间函数相关


### 时间转换  convert 

[w3cschool convert SQLserver 函数地址](https://www.w3school.com.cn/sql/func_convert.asp)

[convert使用案例博主1](https://blog.csdn.net/lyelyelye/article/details/78799313)




### 对时间进行加减年月份 -dateadd()函数

[w3cschool dateadd SQLserver 函数地址](https://www.w3school.com.cn/sql/func_dateadd.asp)


> 总结


```sql
dateadd(yyyy, -5 ,#{investigatedate,jdbcType=TIMESTAMP}))
```


## 统计函数

### count

[w2cschool count SQLserver 函数地址](https://www.w3school.com.cn/sql/sql_func_count.asp)

> count() 的用法的效率比较


```
sqlserver数据库 count(1),count(*),count(列名) 的执行区别

count(*)包括了所有的列，相当于行数，在统计结果的时候，不会忽略列值为NULL

count(1)包括了忽略所有列，用1代表代码行，在统计结果的时候，不会忽略列值为NULL

count(列名)只包括列名那一列，在统计结果的时候，会忽略列值为空（这里的空不是只空字符串或者0，而是表示null）的计数，即某个字段值为NULL时，不统计

执行效率比较：

列名为主键，count(列名)比count(1)快

列名不为主键，count(1)比count(列名)快

如果表有多个列并且没有主键，则 count（1） 的执行效率优于 count（*）

如果有主键，则 select count（主键）的执行效率是最优的

如果表只有一个字段，则 select count（）最优。
```


