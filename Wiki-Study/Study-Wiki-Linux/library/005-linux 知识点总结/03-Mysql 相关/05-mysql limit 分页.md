# sql 中分页查询语句的使用

## mysql limit offset 解释

Mysql limit offset示例

例1，假设数据库表student存在13条数据。


代码示例:
语句1：select * from student limit 9,4
语句2：slect * from student limit 4 offset 9
// 语句1和2均返回表student的第10、11、12、13行  
//语句2中的4表示返回4行，9表示从表的第十行开始
例2，通过limit和offset 或只通过limit可以实现分页功能。
假设 numberperpage 表示每页要显示的条数，pagenumber表示页码，那么 返回第pagenumber页，每页条数为numberperpage的sql语句：


代码示例:
语句3：
```SQL
select * from studnet limit (pagenumber-1)*numberperpage,numberperpage
```
语句4：

```SQL
select * from student limit numberperpage offset (pagenumber-1)*numberperpage
```



## oracel -rownum

* 参考博文：https://www.cnblogs.com/hellokitty1/p/4625895.html
* 另外还有一篇 博文不过查询效率貌似不高：https://blog.csdn.net/sky4160864/article/details/83987415

1. 介绍

当我们在做查询时，经常会遇到如查询限定行数或分页查询的需求，MySQL中可以使用LIMIT子句完成，在MSSQL中可以使用TOP子句完成，那么在Oracle中，我们如何实现呢？

Oracle提供了一个rownum的伪列，它会根据返回记录生成一个序列化的数字。

rownum和rowid都是伪列，但是两者的根本是不同的。rownum是根据SQL查询出的结果给每行分配一个逻辑编号，所以SQL不同也就会导致最终rownum不同；rowid是物理结构上的，在每条记录INSERT到数据库中时，都会有一个唯一的物理记录。

2. 限定查询行数

如果希望限定查询结果集的前几条数据，通过ROWNUM可以轻松实现。

示例：

-- 查找前三条员工的记录
SELECT * FROM employee WHERE rownum <= 3;
3. 分页查询

在数据库应用系统中，我们会经常使用到分页功能，如每页显示5条记录，查询第2页内容该如何查询呢？

SELECT * FROM employee WHERE rownum > 5 AND rownum <= 10;
上面的SQL语句是否能查询出我们想要的结果呢？

当执行该SQL就会发现，显示出来的结果要让你失望了：查不出一条记录，即使表中有20条记录。问题是出在哪呢？

因为rownum是对结果集加的一个伪列（即先查到结果集之后再加上去的一个列），简单的说rownum是对符合条件结果集添加的序列号。它总是从1开始排起的，所以选出的结果中不可能没有1，而有其他大于1的值。

rownum > 5 AND rownum <= 10 查询不到记录，因为如果第一条的 rownum = 1，不满足条件被去掉，第二条的rownum又成了1，继续判断，所以永远没有满足条件的记录。

任何时候想把 rownum = 1 这条记录抛弃是不对的，它在结果集中是不可或缺的，少了rownum=1 就像空中楼阁一般不能存在，所以你的 rownum 条件要包含到 1。

那么，如果想要用 rownum > 5 这种条件的话就要用子查询，把rownum先生成，然后再对生成结果进行查询。

示例：

```sql
SELECT * FROM (
   SELECT e.*, rownum r FROM employee WHERE rownum <= 10
) t WHERE t.r > 5;
```

4. 使用rownum的注意事项

不能对rownum使用>（大于1的数值）、>=（大于1的数值）、=（大于1的数值），否则无结果。
在使用rownum时，只有当Order By的字段是主键时，查询结果才会先排序再计算rownum，但是，对非主键字段（如：name）进行排序时，结果可能就混乱了。出现混乱的原因是：oracle先按物理存储位置（rowid）顺序取出满足rownum条件的记录，即物理位置上的前5条数据，然后在对这些数据按照Order By的字段进行排序，而不是我们所期望的先排序、再取特定记录数。
```SQL
-- 包说明
CREATE OR REPLACE PACKAGE pkg_page IS
   TYPE page_cur_type IS REF CURSOR;
   PROCEDURE get_page_rec(current_page NUMBER, page_size NUMBER, page_rec OUT PAGE_CUR_TYPE);
END pkg_page;

-- 包体
CREATE OR REPLACE PACKAGE BODY pkg_page IS
   -- 分页查询的过程
   PROCEDURE get_page_rec(current_page NUMBER, page_size NUMBER, page_rec OUT PAGE_CUR_TYPE) IS
         lower_bound NUMBER(4); -- 记录下限编号
         upper_bound NUMBER(4); -- 记录上限编号
     BEGIN           
        lower_bound := (current_page - 1) * page_size;
        upper_bound := current_page * page_size;

        OPEN page_rec FOR
           SELECT id, name, birthday, address, did, salary FROM(  
             SELECT t1.*,rownum r FROM
                (SELECT id, name, birthday, address, did, salary FROM employee ORDER BY name) t1
             WHERE rownum <= upper_bound
           ) t
           WHERE t.r > lower_bound;
     END get_page_rec;
END pkg_page;

-- 测试
DECLARE
   page_index NUMBER(4) := 1; -- 页码
   page_size NUMBER(4) := 4; -- 每页显示记录数
   cur_var PKG_PAGE.page_cur_type;
   rec employee%ROWTYPE;
BEGIN
   PKG_PAGE.get_page_rec(page_index, page_size, cur_var);
   LOOP
     FETCH cur_var INTO rec;
     EXIT WHEN cur_var%NOTFOUND;
     DBMS_OUTPUT.PUT_LINE('工号：' || rec.id || '，姓名：' || rec.name || '，工资：' || rec.salary);
   END LOOP;
   CLOSE cur_var;
END;
```



## postgreSQL



## mysql - top
