# mybatis 字段返回值都为 null

## 添加如下配置即可：

```
mybatis:
  configuration:
    map-underscore-to-camel-case: true
```

## 或者sql中 指定 as 后面的字段名 需要等于实体类中的字段



