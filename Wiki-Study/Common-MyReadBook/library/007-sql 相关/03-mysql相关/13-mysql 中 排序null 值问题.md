# oracel mysql null 排序问题

## 总结


## 参考


> 参考1 ：https://blog.csdn.net/wenqiangluyao/article/details/94432665

实现排序，并将null记录放在前面或者最后，
oracle直接使用 nulls first 、nulls last即可，
mysql实现的话，以下两种方式都可以
方式一

nulls first:


```sql
order by IF(ISNULL(field),0,1);  
```

nulls last:

```sql
order by IF(ISNULL(field),1,0); 
```

方式二
nulls first:

```sql
order by NOT ISNULL(field); 
```

nulls last:

```sql
order by ISNULL(field); 
```
1
另外，上面方式非null记录是没有进行排序的，直接在后面加上该字段即可实现，即：


```sql
order by ISNULL(field), field ASC|DESC;
```



```sql
order by IF(ISNULL(field),1,0),field ASC|DESC; 
```