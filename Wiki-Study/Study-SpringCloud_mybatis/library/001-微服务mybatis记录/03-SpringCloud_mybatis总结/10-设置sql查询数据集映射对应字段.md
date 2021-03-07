# 设置mybatis 映射对应sql查询出的数据集：

## 如果数据库字段是下划线形式  aaa_bbb_cc 这种的 

那么yml配置文件中可以设置：
mybatis:
  mapper-locations: classpath:mapper/*.xml
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    map-underscore-to-camel-case: true    #转换驼峰标识




```xml
 <select id="getAllUserIds" resultType="com.xzjy.api.model.edu.po.EduTestUser">
     select id as user_id, realname as user_name from se_user
       
    </select>
  
```


## 如果返回数据集是需要跟java 实体对象字字段一致

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.xzjy.api.model.edu

```xml
 <select id="getAllUserIds" resultType="com.xzjy.api.model.edu.po.EduTestUser">
        select id as userId, realname as userName from se_user
       
    </select>
  
```

## 两者配置同时存在(则功能都会有【驼峰以及与java 实体对应都可以】)

```yml
mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.xzjy.api.model.edu
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
    map-underscore-to-camel-case: true    #转换驼峰标识
```