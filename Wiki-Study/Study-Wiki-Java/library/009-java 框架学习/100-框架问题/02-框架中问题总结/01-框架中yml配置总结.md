# yml 配置文件中的总结


## 外置配置变量


```java
    @Value("#{'${bayonet.ids}'.split(',')}")
    private String[] ids;

    @Value("${spring.datasource.username}")
    private String user;
```

```yml
bayonet:
  # 多个以逗号分隔
  ids: ecf2204c-7bb2-4694-aa17-fd2c86525239
```