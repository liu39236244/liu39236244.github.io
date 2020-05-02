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
```
