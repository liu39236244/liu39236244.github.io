# mybatis foreach 的用法

## mybatis foreach 总结

### 参考博主：

> [参考1](https://blog.csdn.net/Mr_YeShaoFei/article/details/93637571)



* foreach 简单使用


```java
 List<String> getOrganizationIdsByRoleIds(@Param("roleIds") List<String> roleIds);
```


```sql 



  <select id="getOrganizationIdsByRoleIds" resultType="java.lang.String">
        SELECT ORGANIZATION_ID
        FROM USER_SYSTEM_ROLE_ORGANIZATION
        WHERE 1 = 1
        <if test="null != roleIds and roleIds.size() > 0">
            AND ROLE_ID IN
            <foreach collection="roleIds" item="roleId" open="(" close=")" separator=",">
                #{roleId}
            </foreach>
        </if>
    </select>

```