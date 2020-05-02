# mysql 中导入csv文档

## mysql 导入csv文档
* 原文连接：https://blog.csdn.net/yuqiongran/article/details/52235789

### 前提

```
每个csv文件第一行为字段名
创建的数据库字段名同csv文件的字段名
```

### 倒入一个csv文件

```
mysql --local-infile -uusename -ppassword databasename -e "LOAD DATA LOCAL INFILE '1.csv' INTO TABLE tablename FIELDS TERMINATED BY ',' LINES TERMINATED BY '\r\n'"
```
>(‘,’ 和 ‘\r\n’ 是根据你的csv 文件决定的 第一个是 字段分割的标志，第二个是行分割的标志)
（–local-infile: 没有这个会报错【ERROR 1148 (42000) at line 1: The used command is not allowed with this MySQL version】）

### 批量导入csv文件

```
for file in ./*.csv;do mv $file tablename.csv;mysqlimport --local --fields-terminated-by="," -uusename -ppassword databasename tablename.csv;rm tablename.csv;done
```
>原博主是删除了修改名字并且导入mysql的csv文件了，这里使用需要注意脚本中的rm 删除csv文件，
