# 各种数据库注册驱动：

# 1-各数据库连接驱动
## 1-ORACLE:

```
s"jdbc:oracle:thin:@//${db_host}:${db_port}/${db_database}"
```

## 2-mysql 相关：

```
final String DriverClass = "com.mysql.jdbc.Driver";
final String url = "jdbc:mysql://localhost:3306/";

jdbc:mysql://ip:3306/数据库名?characterEncoding=UTF-8
jdbc:mysql://ip:3306/数据库名?characterEncoding=UTF-8&useSSL=false&autoReconnect=true&failOverReadOnly=false&serverTimezone=Asia/Shanghai
```


### 逆向工程配置

```
jdbc.driverLocation=E:\\shenyabo-work\\maven-repo\\mysql\\mysql-connector-java\\5.1.38\\mysql-connector-java-5.1.38.jar
jdbc.driverClass=com.mysql.jdbc.Driver
jdbc.connectionURL=jdbc:mysql://10.0.2.83:3306/tmg_base?characterEncoding=UTF-8
jdbc.userId=tmg_base
jdbc.password=tmg_base
```

## 3 sqlserver驱动url

```
driver-class: com.microsoft.sqlserver.jdbc.SQLServerDriver
url: jdbc:sqlserver://ip:1433;DatabaseName=数据库名
```

### 逆向工程配置sqlserver

```
jdbc.driverLocation=E:\\shenyabo-work\\maven-repo\\com\\microsoft\\sqlserver\\mssql-jdbc\\6.4.0.jre8\\mssql-jdbc-6.4.0.jre8.jar
jdbc.driverClass=com.microsoft.sqlserver.jdbc.SQLServerDriver
jdbc.connectionURL=jdbc:sqlserver://10.0.2.83:1433;DatabaseName=XSN
jdbc.userId=sa
jdbc.password=sa@2020
```

### pom文件

```xml
<properties>
   <sqlServer.version>6.4.0.jre8</sqlServer.version>
</properties>
<dependencies>
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <version>${sqlServer.version}</version>
    <scope>runtime</scope>
</dependency>
</dependencies>
```