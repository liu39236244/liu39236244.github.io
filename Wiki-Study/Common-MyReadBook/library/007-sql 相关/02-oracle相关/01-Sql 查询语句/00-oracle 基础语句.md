# oracle 基础语句


## 数据库层级


* 查询oracle 字符集


![](assets/007/02/01/00-1603182435340.png)

```
-- 查字符集

select * from nls_database_parameters where parameter ='NLS_CHARACTERSET';



Oracle一个中文汉字占用几个字节
Oracle 一个中文汉字 占用几个字节，要根据Oracle中字符集编码决定

 
查看oracle server端字符集
 
select userenv('language') from dual;
如果显示如下，一个汉字占用两个字节
SIMPLIFIED CHINESE_CHINA.ZHS16GBK
 
如果显示如下，一个汉字占用三个字节
SIMPLIFIED CHINESE_CHINA.AL32UTF8
 
可以用以下语句查询一个汉字占用的字节长度
select lengthb('你') from dual;

```

## oracle 的分页 

### 最优解

>1 这种事看了许多最容易理解的一种分页

```sql
 select * from (select row_number() over(order by empno) rr,emp.ename from emp)v where rr between 5 and 10

```

>2 这一种你可以看懂，但是表数据过大的时候效率不高

```sql
select * from (select rownum rr,e.* from (select * from emp order by empno)e  where rownum<=10)v where v.rr>=5
```
### 错误

> 3 第三种，也是rownum分页的时候犯错最多的

```sql
-- 错误写法
select * from (select rownum rr,e.* from (select * from emp order by empno)e  where rownum<=10)v where v.rr>=5
```



####  可用

[原文地址：ORACLE中的rownum排序及row_number()排序的区别](https://blog.csdn.net/wangxinde317/article/details/8649933)




```
   我们如果想查得通过empno排序后的分页数据，看几条sql：

      sql1：

          select * from (select rownum rr,emp.* from emp  where rownum<=10 order by empno)v where v.rr>=5  

      sql2：

          select * from (select rownum rr,e.* from (select * from emp order by empno)e  where rownum<=10)v where v.rr>=5

      sql3:

          select * from (select row_number() over(order by empno) rr,emp.ename from emp)v where rr between 5 and 10

       执行后发现都能返回结果集，但是sql1返回的结果集却不是我们想要的。

       将sql1中的子查询提出来看：     

          select rownum rr,emp.* from emp  where rownum<=10 order by empno

       这条语句parse的顺序是先执行from语句，再执行where再执行order by。where rownum<=10执行完后会随机取出10条数据，这10条数据的rownum是1到10，再对这10条数据根据进行排序。这样就不是我们想得到的。

       sql2，sql3执行后返回的结果都是我们想要的。sql2是现在子查询中排完序再进行rownum的筛选。

       总结下,rownum排序和row_number()的区别：使用rownum进行排序的时候是先对结果集加入伪列rownum后再进行排序（如sql1的结果），而row_number()在通过over（）里的排序过后再对每列加上一个数字，从以上三条sql可看出，rownum排序用到了起码三层嵌套执行效率上不如row_number().

```


[Oracle实现limit](https://blog.csdn.net/sy201707/article/details/120939983)

如下我感觉内部查询会查出来很多数据，
```
由于Oracle中的rownum是在取数据的时候产生的序号，所以
SELECT update_time FROM XXX WHERE ROWNUM = 1 ORDER BY update_time DESC; 不会返回根据更新时间倒序后取第一条。
正确的写法是：SELECT * FROM (SELECT update_time FROM XXX ORDER BY update_time DESC) t1 WHERE ROWNUM = 1;

```




内部我也只想按照排序查出来前十条

### 博客写法1 

1.oracle

获取表的前100条数据.

select * from t_stu_copy  where rownum<=100;(从1行开始取100行数据,第一行到第100行数据)

补充:先降序排序再获取第101条到第200条之间的所有记录

select * from t_stu_copy order by stuid desc where rownum between 100 and 200 ;---错误

select * from t_stu_copy where rownum between 100 and 200 order by stuid desc  ;---错误

SELECT * FROM(SELECT ROWNUM AS rowno,t.* FROM t_stu_copy t WHERE ROWNUM <= 200 ORDER BY t.stuid ) a WHERE a.rowno > 100;正确

或者:select  * from t_stu_copy where stuid between 101 and 200;

2.mysql

获取表的前100条数据.

select * from t_stu_copy limit 0,100;(从1行开始取100行数据,第一行到第100行数据)

补充:先降序排序再获取第101条到第200条之间的所有记录

select * from t_stu_copy order by stuid  limit 100,100;(从101行开始取100行数据,第101行到第200行数据)

或者:select  * from t_stu_copy where stuid between 101 and 200;

3.sqlserver

获取表的前100条数据.

select top 100 * from t_stu_copy ;

补充:先降序排序再获取第101条到第200条之间的所有记录(三种方法,不过方法a与b得到的结果是将第101条到第200条倒过来显示罢了)

a. select top 100 * from (select top 200 * from t_stu order by stuid) a order by stuid desc;

b. select top m * into 临时表(或表变量) from tablename order by columnname  set rowcount n select * from 表变量 order by columnname desc.

select top 200 * into xxx from t_stu order by stuid set ROWCOUNT 100 select * from xxx order by stuid desc; xxx表示临时表变量.

c.select * from t_stu where stuid between 101 and 200.


### 博客写法2

 1. 标准的rownum分页查询使用方法：

    select *
      from (select c.*, rownum rn from content c)
     where rn >= 1
       and rn <= 5


    2. 但是如果, 加上order by addtime 排序则数据显示不正确

    select *
      from (select c.*, rownum rn from content c order by addtime)
     where rn >= 1
       and rn <= 5


    解决方法，再加一层查询，则可以解决，

    select *
      from (select rownum rn, t.*
              from (select title, addtime from content order by addtime desc) t)
     where rn >= 1
       and rn <= 5

    如果要考虑到效率的问题，上面的还可以优化成（主要两者区别）

    select *
      from (select rownum rn, t.*
              from (select title, addtime from content order by addtime desc) t
             where rownum <= 10)
     where rn >= 3

## oracle分析函数

[oracle分析函数技术详解（配上开窗函数over()）](https://blog.51cto.com/teayear/5094852)


## oracle开窗函数


### 简介
[Oracle函数之开窗函数](https://blog.csdn.net/weixin_42402597/article/details/125910585)

```
1.聚合开窗

Sum()

Avg()

Min()

Max()

Count()

语法：聚合函数+over (partition by 列名)

2.排序开窗

Row_number()

排序是1234567，不区分并列情况

Rank()

排序是123356，考虑并列情况，但跳过并列

Dense rank()

排序是1233456，考虑并列，不跳过并列

语法：函数+over (partition by 列名 order by 列名)

3.偏移开窗

Lead()

Lag()

语法：lead(列名) 

```


### 开窗函数应用

[原文地址：Oracle应用之开窗函数笔记及应用场景](https://cloud.tencent.com/developer/article/1995219)


> 1 row_number 用法，相同值只会取出来第一条

![](assets/007/02/01/00-1661486110744.png)

>2 rank用法 ，相同数值的序号会写成一样

![](assets/007/02/01/00-1661486067814.png)

>3 dense_rank 用法

![](assets/007/02/01/00-1661486028723.png)