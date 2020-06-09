# oracel instr 函数使用



## 我的总结


## 博主总结

> Oracle中的instr()函数 详解及应用:  https://www.cnblogs.com/dshore123/p/7813230.html

### 总结


> 1、instr()函数的格式  （俗称：字符查找函数）
格式一：instr( string1, string2 )    // instr(源字符串, 目标字符串)

格式二：instr( string1, string2 [, start_position [, nth_appearance ] ] )   // instr(源字符串, 目标字符串, 起始位置, 匹配序号)

解析：string2 的值要在string1中查找，是从start_position给出的数值（即：位置）开始在string1检索，检索第nth_appearance（几）次出现string2。

  注：在Oracle/PLSQL中，instr函数返回要截取的字符串在源字符串中的位置。只检索一次，也就是说从字符的开始到字符的结尾就结束。

> 2、实例

* 格式一

```sql

1 select instr('helloworld','l') from dual; --返回结果：3    默认第一次出现“l”的位置
2 select instr('helloworld','lo') from dual; --返回结果：4    即“lo”同时(连续)出现，“l”的位置
3 select instr('helloworld','wo') from dual; --返回结果：6    即“w”开始出现的位置

```
* 格式二

复制代码

```sql
1 select instr('helloworld','l',2,2) from dual;  --返回结果：4    也就是说：在"helloworld"的第2(e)号位置开始，查找第二次出现的“l”的位置
2 select instr('helloworld','l',3,2) from dual;  --返回结果：4    也就是说：在"helloworld"的第3(l)号位置开始，查找第二次出现的“l”的位置
3 select instr('helloworld','l',4,2) from dual;  --返回结果：9    也就是说：在"helloworld"的第4(l)号位置开始，查找第二次出现的“l”的位置
4 select instr('helloworld','l',-1,1) from dual;  --返回结果：9    也就是说：在"helloworld"的倒数第1(d)号位置开始，往回查找第一次出现的“l”的位置
5 select instr('helloworld','l',-2,2) from dual;  --返回结果：4    也就是说：在"helloworld"的倒数第2(l)号位置开始，往回查找第二次出现的“l”的位置
6 select instr('helloworld','l',2,3) from dual;  --返回结果：9    也就是说：在"helloworld"的第2(e)号位置开始，查找第三次出现的“l”的位置
7 select instr('helloworld','l',-2,3) from dual; --返回结果：3    也就是说：在"helloworld"的倒数第2(l)号位置开始，往回查找第三次出现的“l”的位置

```

复制代码
 

注：MySQL中的模糊查询 like 和 Oracle中的 instr() 函数有同样的查询效果； 如下所示：

MySQL： select * from tableName where name like '%helloworld%';
Oracle：select * from tableName where instr(name,'helloworld')>0;  --这两条语句的效果是一样的

![](assets/007/02/02/01-1591602706472.png)


![](assets/007/02/02/01-1591602733769.png)



3、实例截图
1、

![](assets/007/02/02/01-1591602779775.png)


2、

![](assets/007/02/02/01-1591602814150.png)


3、

![](assets/007/02/02/01-1591602824002.png)


4、



![](assets/007/02/02/01-1591602833644.png)

5、


![](assets/007/02/02/01-1591602844693.png)


6、

![](assets/007/02/02/01-1591602880076.png)

7、

![](assets/007/02/02/01-1591602902733.png)

8、

![](assets/007/02/02/01-1591602908913.png)

9、

![](assets/007/02/02/01-1591602922414.png)