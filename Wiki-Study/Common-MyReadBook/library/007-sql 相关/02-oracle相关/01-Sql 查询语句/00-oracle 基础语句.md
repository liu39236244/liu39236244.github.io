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