# mysql 驱动配置

## yml配置

```yml
spring:
  application:
    name: xz-user
  datasource:
#    driver-class: com.mysql.cj.jdbc.Driver
#    url: jdbc:mysql://localhost:3306/xzpxjy?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=Asia/Shanghai
    username: xzpxjy
    password: xzpxjy
    url: jdbc:mysql://10.0.2.83:3306/xzpxjy?characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT
    driver-class: com.mysql.cj.jdbc.Driver
    type: com.alibaba.druid.pool.DruidDataSource
```

## 逆向工程配置

```
#jdbc.driverClass=com.mysql.jdbc.Driver
#jdbc.connectionURL=jdbc:mysql://10.0.2.83:3306/xzpxjy?useUnicode=true&characterEncoding=utf-8
#jdbc.driverLocation=D:\\shenyabo-work\\maven-repo\\mysql\\mysql-connector-java\\5.1.35\\mysql-connector-java-5.1.35.jar

jdbc.driverLocation=D:\\shenyabo-work\\xuzhoujar\\mysql\\mysql-connector-java\\6.0.6\\mysql-connector-java-6.0.6.jar
jdbc.driverClass=com.mysql.cj.jdbc.Driver
jdbc.connectionURL=jdbc:mysql://10.0.2.83:3306/xzpxjy?characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=GMT
jdbc.userId=xzpxjy
jdbc.password=xzpxjy

```


