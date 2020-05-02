# mysql 与mybatis 的字符转换

## 总结
### 符号

```sql
小于号：

<![CDATA[<]]>
<![CDATA[<=]]>

大于号

<![CDATA[>]]>
<![CDATA[>=]]>




```

### 案例

> * 判断一条数据是否超期并且查询阶段更改数据状态


```sql
select id,name,
 IF((hd.deadline  <![CDATA[ <= ]]> (select NOW())  &amp;&amp;  hd.state = '1' ),'5',hd.state) state,
  from hd 
```




## 博主

### 字符串转换

> [路径](https://blog.csdn.net/u010452388/article/details/80831083)
