# sqlserver 关联修改



## 根据查询出来的值修改其他表的值



```sql
UPDATE a set a.ProcessStatus = 'C', a.ProcessTime = getdate(), a.ExecDate = b.ExecDate
FROM transport AS a ,vi_Surgery AS b
WHERE  a.IdHospSurgery = b.IdHospSurgery AND b.ExecDate IS NOT NULL
AND b.ExecDate <> '1900-01-01 00:00:00.000' AND a.ProcessStatus = 'P'

```

```sql

-- 需求， 一个检查表对应有一个检查内容子表，子表新加了一个sort 字段，但是想分组给每一组加上sort 排序， 于是就用此方法

-- 根据一个查询结果修改另一个数据表的值
update 
c1
set c1.sort = c2.sort 
from 
security_check_content as c1,
(
SELECT
	id check_content_id,
	check_content,
	security_check_id,
	ROW_NUMBER ( ) OVER ( partition BY security_check_id ORDER BY create_time DESC ) AS sort 
FROM
	security_check_content
) as c2  
where c1.id = c2.check_content_id

```
