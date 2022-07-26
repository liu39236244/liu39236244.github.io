# oracle关联修改

```
 
oracle 两张表关联修改数据
2021-08-03 10:20:30
mysql

update table1 v join table2 t on v.type = t.type set v.system_of = t.system_of;

oralce

方法一（推荐）：

UPDATE 表2 SET 表2.C = (SELECT B FROM 表1 WHERE 表1.A = 表2.A) WHERE EXISTS (SELECT 1 FROM 表1 WHERE 表1.A = 表2.A);

尤其注意最后的外层where条件尤为重要，是锁定其批量更新数据的范围。

方法二：

MERGE INTO 表2

   USING 表1

    ON (表2.A = 表1.A)                    -- 条件是 A 相同

WHEN MATCHED

THEN

  UPDATE SET 表2.C = 表1.B                   -- 匹配的时候，更新


```


## 关联修改案例

### 历史表根据查询结果修改对应值

场景说明：
TRANS_MATERIAL_COUNT： 是每天都会统计一次当周运输各种物质车辆数、吨数 
但是由于字典表最开始有的字典名称没有加上名字：比如 甲醇 应该是 (1001)甲醇，  所以导致同一周统计到前段会有两种物质，
现需要将两种物质算到一块，然后删掉不带编号的物质。主要用到了 merge ， 以及字符串函数


```sql
-- 1 查询对应需要重新统计的历史记录数

SELECT
	count1.id,
	count2.id id2,
	count1.CZ_XZ,
	count1.material,
	count2.CZ_XZ CZ_XZ2,
	count2.material material2,
	INSTR( count1.material, ')' ) AS index_flag,
	SUBSTR( count1.material, INSTR( count1.material, ')' ) + 1 ) AS material_no_,
	count1.WEIGHT weight1,
	count2.WEIGHT weight2,
	( count1.WEIGHT + count2.weight ) AS all_weight,
	count1.CAR_COUNT car_count1,
	count2.CAR_COUNT car_count2,
	( count1.CAR_COUNT + count2.CAR_COUNT ) AS all_car_count,
	count1.CREATE_TIME,
	count1.update_time,
	count2.CREATE_TIME CREATE_TIME2 
FROM
	TRANS_MATERIAL_COUNT count1
	INNER JOIN TRANS_MATERIAL_COUNT count2 ON count1.CREATE_TIME = count2.CREATE_TIME 
	AND count1.CZ_XZ = count2.CZ_XZ 
WHERE
	SUBSTR( count1.material, INSTR( count1.material, ')' ) + 1 ) = count2.material 
	AND INSTR( count1.material, ')' ) != 0
	
	
-- 历史相加并且修改一下
merge INTO TRANS_MATERIAL_COUNT count using (
	SELECT
		count1.id,
		count2.id id2,
		count1.CZ_XZ,
		count1.material,
		count2.CZ_XZ CZ_XZ2,
		count2.material material2,
		INSTR( count1.material, ')' ) AS index_flag,
		SUBSTR( count1.material, INSTR( count1.material, ')' ) + 1 ) AS material_no_,
		count1.WEIGHT weight1,
		count2.WEIGHT weight2,
		( count1.WEIGHT + count2.weight ) AS all_weight,
		count1.CAR_COUNT car_count1,
		count2.CAR_COUNT car_count2,
		( count1.CAR_COUNT + count2.CAR_COUNT ) AS all_car_count,
		count1.CREATE_TIME,
		count1.update_time,
		count2.CREATE_TIME CREATE_TIME2 
	FROM
		TRANS_MATERIAL_COUNT count1
		INNER JOIN TRANS_MATERIAL_COUNT count2 ON count1.CREATE_TIME = count2.CREATE_TIME 
		AND count1.CZ_XZ = count2.CZ_XZ 
	WHERE
		SUBSTR( count1.material, INSTR( count1.material, ')' ) + 1 ) = count2.material 
		AND INSTR( count1.material, ')' ) != 0 
	) count1 ON ( count.id = count1.id ) 
	WHEN MATCHED THEN
UPDATE 
	SET count.weight = count1.all_weight,
	count.car_count = count1.all_car_count

-- 将历史统计表中对应的给删掉	
	
DELETE 
FROM
	TRANS_MATERIAL_COUNT count_delete 
WHERE
	count_delete.id IN (
	SELECT
		id2 
	FROM
		(
		SELECT
			count1.id,
			count2.id id2,
			count1.CZ_XZ,
			count1.material,
			count2.CZ_XZ CZ_XZ2,
			count2.material material2,
			INSTR( count1.material, ')' ) AS index_flag,
			SUBSTR( count1.material, INSTR( count1.material, ')' ) + 1 ) AS material_no_,
			count1.WEIGHT weight1,
			count2.WEIGHT weight2,
			( count1.WEIGHT + count2.weight ) AS all_weight,
			count1.CAR_COUNT car_count1,
			count2.CAR_COUNT car_count2,
			( count1.CAR_COUNT + count2.CAR_COUNT ) AS all_car_count,
			count1.CREATE_TIME,
			count1.update_time,
			count2.CREATE_TIME CREATE_TIME2 
		FROM
			TRANS_MATERIAL_COUNT count1
			INNER JOIN TRANS_MATERIAL_COUNT count2 ON count1.CREATE_TIME = count2.CREATE_TIME 
			AND count1.CZ_XZ = count2.CZ_XZ 
		WHERE
			SUBSTR( count1.material, INSTR( count1.material, ')' ) + 1 ) = count2.material 
			AND INSTR( count1.material, ')' ) != 0 
		) 
	)
	
```


### 操作预约表

将预约表中预约过不带编号的元素id 替换为 带编号的元素id

```sql
merge INTO ENTER_GARDEN enter using (
	SELECT
	enter.id,
	enter.trans_material,
	dic.id1,
	dic.name1,
	dic.id2,
	dic.name2
FROM
	ENTER_GARDEN enter
	right JOIN (
	SELECT
		item1.id id1,
		item2.id id2,
		item1.name name1,
		item2.name name2,
		SUBSTR( item1.name, INSTR( item1.name, ')' ) + 1 ) no_flag 
	FROM
		TB_DIC_ITEM item1
		INNER JOIN TB_DIC_ITEM item2 ON SUBSTR( item1.name, INSTR( item1.name, ')' ) + 1 ) = item2.name 
	WHERE
		INSTR( item1.name, ')' ) != 0 
	) dic ON enter.TRANS_MATERIAL = dic.id2
	where enter.id is not null
	) enter2 ON ( enter.id = enter2.id ) 
	WHEN MATCHED THEN
UPDATE 
	SET enter.TRANS_MATERIAL = enter2.id1
```


### 操作字典表

```sql
	
	-- 选出来对应的ENTER_GARDEN 表中这些元素id 替换成对应带有编号的元素的id
	
	select item1.id id1, item2.id id2, item1.name name1, item2.name name2 ,    SUBSTR( item1.name, INSTR( item1.name, ')' ) + 1 ) no_flag   from TB_DIC_ITEM item1 
	inner join TB_DIC_ITEM item2 
	on SUBSTR( item1.name, INSTR( item1.name, ')' ) + 1 ) = item2.name 
	where INSTR( item1.name, ')' ) != 0
	
	
	-- 将元素表中不带编号的给删除掉
	
	delete from TB_DIC_ITEM  where id in (
		select item2.id id2 from TB_DIC_ITEM item1 
	inner join TB_DIC_ITEM item2 
	on SUBSTR( item1.name, INSTR( item1.name, ')' ) + 1 ) = item2.name 
	where INSTR( item1.name, ')' ) != 0
	)
```