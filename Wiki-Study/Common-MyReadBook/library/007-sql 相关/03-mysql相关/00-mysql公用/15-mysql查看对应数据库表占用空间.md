# mysql 查看表空间


```sql
SELECT table_name, data_length + index_length AS len, table_rows,
 
     CONCAT(ROUND((data_length + index_length)/1024/1024,2),'MB') AS datas
 
FROM information_schema.tables
 
WHERE table_schema = 'zl_gcwz'
 
ORDER BY len DESC;

```