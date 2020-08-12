# mysql 分组拼接会截取数据问题


## 分组拼接问题




```sql
        SELECT count(id)              type_count,
               enterprise_type,
               GROUP_CONCAT(nanotube) nanotubes
        FROM (
                 SELECT enter1.id,
                        (CASE WHEN enterprise_type IS NULL THEN "" ELSE enterprise_type END) enterprise_type,
                        (CASE WHEN nanotube_status IS NULL THEN "" ELSE nanotube_status END) nanotube
                 FROM cim_enterprise_basic_info enter1
                 WHERE is_delete = 0
             ) result1
        GROUP BY result1.enterprise_type
```

> 会出现以下问题，本来 3 这个状态应该拼接 52001 的，但是分组统计导致字符串截，导致根据,分割的数组成了 512 条，


![](assets/007/03/19/01-1597223978150.png)


* 根据企业类别，企业的纳管状态统计企业已纳管未纳管的统计




```sql


        SELECT
            count( id ) type_count,
            enterprise_type,
            nanotube
        FROM
            (
                SELECT
                    enter1.id,
                    ( CASE WHEN enterprise_type IS NULL THEN "" ELSE enterprise_type END ) enterprise_type,
                    ( CASE WHEN nanotube_status IS NULL THEN "" ELSE nanotube_status END ) nanotube
                FROM
                    cim_enterprise_basic_info enter1
                WHERE
                    is_delete = 0
            ) result1
        GROUP BY
            result1.enterprise_type,
            result1.nanotube
```


![](assets/007/03/19/01-1597223935105.png)