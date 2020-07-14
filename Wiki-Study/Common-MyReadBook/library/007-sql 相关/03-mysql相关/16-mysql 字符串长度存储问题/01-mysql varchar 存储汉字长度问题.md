# mysql 存储长度问题


## 总结

* 参考地址：https://blog.csdn.net/m0_37482190/article/details/90551273

* 4.0 的mysql 

其实varchar类型可以存储多少个汉字，多少个数字，是要具体看我们的mysql版本。

如下：
4.0版本以下，比如 varchar(100)，指的是100字节，如果存放UTF8汉字时，只能存33个（每个汉字3字节）

5.0版本以上，比如varchar(100)，指的是100字符，无论存放的是数字、字母还是UTF8汉字（每个汉字3字节），都可以存放100个。

通过查看，我使用的是5.0版本以上 的数据库，所以说一个varchar长度对应一个汉字或者一个数字



```sql

新建表：

CREATE TABLE varchar_test (

`id` int(11) NOT NULL ,

`string` varchar(20)

) ENGINE=InnoDB

DEFAULT CHARACTER SET=utf8COLLATE=utf8_general_ci

插入表：

INSERT INTO varchar_test (id, string)

VALUES (1, '一二三四五六七八九十');

 

INSERT INTO varchar_test (id, string)

VALUES (2, '一二三四五六七八九十一二三四五六七八九十');

 

INSERT INTO varchar_test (id, string)

VALUES (3, '12345678901234567890');

测试结果：

1：一二三四五六七八九十

2：一二三四五六七八九十一二三四五六七八九十

3：12345678901234567890

如果插入字符超过21个，则报错

INSERT INTO varchar_test (id, string)

VALUES (3, '123456789012345678901');

[Err] 1406 - Data too long for column'string' at row 1

```

## 博客总结


博客原文地址1:https://blog.csdn.net/yaoyutian/article/details/80244101