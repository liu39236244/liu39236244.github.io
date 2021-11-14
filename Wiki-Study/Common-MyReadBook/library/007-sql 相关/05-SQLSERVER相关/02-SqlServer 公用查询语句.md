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

### 对时间进行对比函数 


DATEDIFF(d,getdate(),credential_enddate)

使用如下 SELECT 语句：

SELECT DATEDIFF(day,'2008-12-29','2008-12-30') AS DiffDate
结果：

DiffDate
1


例子 2
使用如下 SELECT 语句：

SELECT DATEDIFF(day,'2008-12-30','2008-12-29') AS DiffDate
结果：

DiffDate
-1


```xml
<!-- 查询所有用户信息 -->
    <select id="listAll" resultMap="BaseResultMap1" parameterType="com.sjzx.api.model.user.dto.SeUserDto">
        select
        <include refid="Base_Column_List"/>,
        (select name from tb_dic_item where id=a.job_title) as jobTitleName,
        (select name from tb_dic_item where id=a.level) as levelName,
        (select name from tb_dic_item where id=a.current_state) as currentStateName,
        (select name from tb_dic_item where id=a.administrative_code) as administrativeCodeName,
        (select name from tb_dic_item where id=a.province) as provinceName,
        case
        when (CONVERT(varchar(10),getdate(),121) &gt; CONVERT(varchar(10),credential_enddate,121)) then 0
        when (DATEDIFF(d,getdate(),credential_enddate) &lt; 30) then 1
        when (CONVERT(varchar(10),getdate(),121) &lt;= CONVERT(varchar(10),credential_enddate,121)) then 2
        end as certState
        from se_user a
        <where>
            <include refid="common_if_zj"/>
        </where>
        order by a.state asc,a.createtime desc
    </select>
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




## 排序

### order by null 排序问题

> 1.SQL server排序时如何将NULL排在最后面

```sql
select UserInfoID,User_No,User_Names 
from UserInfo 
order by case when User_NO is null then 1 else 0 end asc,User_NO asc 
```



## 锁表查询


```sql
查看被锁表：

select   request_session_id   spid,OBJECT_NAME(resource_associated_entity_id) tableName  
from   sys.dm_tran_locks where resource_type='OBJECT'

spid   锁表进程
tableName   被锁表名

解锁：

declare @spid  int
Set @spid  = 57 --锁表进程
declare @sql varchar(1000)
set @sql='kill '+cast(@spid  as varchar)
exec(@sql)


-- 57 替换为对应的进程id执行即可
 
```