# mysql 日期时间的转化


## 1-总结
### 1 可以直接进行比较

```sql
SELECT YDRQ,QXMC,LNG,LAT,YDLC,YDSC
FROM nc_lk.qx_lkxq_min
where QXMC
in ('观山湖','钟山') and YDRQ BETWEEN'2018-08-02' and '2018-08-05'


MySQL中，如何查询两个日期之间的记录，日期所在字段的类型为datetime（0000-00-00 00:00:00）
-- 小于号小于号

where createDate<'2003-5-31' and createDate>'2003-2-30';

-- between
where createDate between'2010-08-01'  and  '2010-08-19'

```






## 2- 博主

### 2-1
* 日期转换函数、时间转换函数
原文地址：https://blog.csdn.net/XULIANGJUNSILU1/article/details/6260217

```
MySQL 日期转换函数、时间转换函数

1. MySQL （时间、秒）转换函数：time_to_sec(time), sec_to_time(seconds)

select time_to_sec('01:00:05');  -- 3605
select sec_to_time(3605);        -- '01:00:05'

2. MySQL （日期、天数）转换函数：to_days(date), from_days(days)

select to_days('0000-00-00');  -- 0
select to_days('2008-08-08');  -- 733627

select from_days(0);           -- '0000-00-00'
select from_days(733627);      -- '2008-08-08'

3. MySQL Str to Date （字符串转换为日期）函数：str_to_date(str, format)

select str_to_date('08/09/2008', '%m/%d/%Y');                   -- 2008-08-09
select str_to_date('08/09/08'   , '%m/%d/%y');                   -- 2008-08-09
select str_to_date('08.09.2008', '%m.%d.%Y');                   -- 2008-08-09
select str_to_date('08:09:30', '%h:%i:%s');                     -- 08:09:30
select str_to_date('08.09.2008 08:09:30', '%m.%d.%Y %h:%i:%s'); -- 2008-08-09 08:09:30

可以看到，str_to_date(str,format) 转换函数，可以把一些杂乱无章的字符串转换为日期格式。另外，它也可以转换为时间。“format” 可以参看 MySQL 手册。

4. MySQL Date/Time to Str（日期/时间转换为字符串）函数：date_format(date,format), time_format(time,format)

mysql> select date_format('2008-08-08 22:23:00', '%W %M %Y');

+------------------------------------------------+
| date_format('2008-08-08 22:23:00', '%W %M %Y') |
+------------------------------------------------+
| Friday August 2008                             |
+------------------------------------------------+

mysql> select date_format('2008-08-08 22:23:01', '%Y%m%d%H%i%s');

+----------------------------------------------------+
| date_format('2008-08-08 22:23:01', '%Y%m%d%H%i%s') |
+----------------------------------------------------+
| 20080808222301                                     |
+----------------------------------------------------+

mysql> select time_format('22:23:01', '%H.%i.%s');

+-------------------------------------+
| time_format('22:23:01', '%H.%i.%s') |
+-------------------------------------+
| 22.23.01                            |
+-------------------------------------+

MySQL 日期、时间转换函数：date_format(date,format), time_format(time,format) 能够把一个日期/时间转换成各种各样的字符串格式。它是 str_to_date(str,format) 函数的 一个逆转换。
```

### 2-2 mysql 日期函数使用

原文地址：https://www.cnblogs.com/lykbk/p/sdsdssdsqwewewew.html

