# mysql 存储大文本记录


## 1- mysql 存储大文本

### 1-1 存储大文本

```
1. TEXT
TEXT有4有类型：

TINYTEXT 256bytes
TEXT 64kb
MEDIUMTEXT 16Mb
LONGTEXT 4GB
使用注解
@Lob
@Basic(fetch=FetchType.LAZY)
@Column(columnDefinition="TEXT",nullable=true)
public String getContent() {
    return Content;
}

```

### 1-2 存储二进制

```
2. BLOB
TINYBLOB
BLOB、
MEDIUMBLOB
LONGBLOB
blob 保存的是二进制数据，利用这个特性，可以把图片存储到数据库里面。text只能存储文本。

使用注解
@Lob
@Basic(fetch=FetchType.LAZY)
@Column(columnDefinition="BLOB",nullable=true)
public String getContent() {
    return Content;
}

```


#### 1-2 存储大小说明

原文地址：https://blog.csdn.net/u012885438/article/details/70171738
|类型  | 大小|
| :------------- | :------------- |
|TINYTEXT|256 bytes|
|TEXT|65,535 bytes|~64kb|
|MEDIUMTEXT| 16,777,215 bytes|~16MB|
|LONGTEXT|4,294,967,295 bytes|~4GB

```
CHAR(n) 固定长度，最多 255 个字符
VARCHAR(n) 可变长度，MySQL 4.1 及以前最大 255 字符，MySQL 5 之后最大 65535 字节
TINYTEXT 可变长度，最多 255 个字符
TEXT 可变长度，最多 65535 个字符
MEDIUMTEXT 可变长度，最多 16777215（2^24 - 1）个字符
LONGTEXT 可变长度，最多 4294967295（2^32 - 1）（4G）个字符
```
ntext:
可变长度 Unicode 数据的最大长度为 2^30 - 1 (1,073,741,823) 个字符。存储大小是所输入字符个数的两倍（以字节为单位）。ntext 在 SQL-92 中的同义词是 national text。
text:
服务器代码页中的可变长度非 Unicode 数据的最大长度为 2^31-1 (2,147,483,647) 个字符。当服务器代码页使用双字节字符时，存储量仍是 2,147,483,647 字节。存储大小可能小于 2,147,483,647 字节（取决于字符串）。




# 2-mysql 存储大文本博主总结

## 2-1 存储大文本：

### 原文地址：https://blog.csdn.net/u014738387/article/details/50099161/
### 两种mysql存储大数据格式：https://blog.csdn.net/wfg18801733667/article/details/55222909
## 详细的存储打文本大小说明：https://blog.csdn.net/u012885438/article/details/70171738
