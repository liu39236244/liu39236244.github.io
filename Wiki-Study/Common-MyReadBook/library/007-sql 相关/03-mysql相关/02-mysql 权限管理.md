# mysql 权限管理

## 1-可用

### lock unlock 的使用

* 1-语法
```
LOCK TABLES tbl_name[[AS] alias] lock_type [, tbl_name [[AS] alias] lock_type] ...

lock_type:READ[LOCAL]| [LOW_PRIORITY] WRITE

UNLOCK TABLES
```

### 1-mysql 设定某一张表为只读

```
create databases read_only;
create table student (
	id varchar(10),
	name varchar(50),
	age int
);
select *from student;
insert into student values("1","小明1",1);
insert into student values("2","小明3",2);
insert into student values("3","小明4",3);
insert into student values("4","小明5",4);

锁定一张表
lock table t_depart_info read;
insert into student values("5","小明6",6);
- 再继续插入数据就会报错，但是能select
mysql> insert into student values("5","小明6",6);
ERROR 1099 (HY000): Table 'student' was locked with a READ lock and can't be updated
unlock tables;
# 插入就能成功了
insert into student values("5","小明6",6);

```
### 1-mysql 设定某一张表为只读


## 用户权限

### 博主
> 1-[用户对表的权限的控制](https://www.cnblogs.com/Richardzhu/p/3318595.html)
> 2-[用户权限](https://blog.csdn.net/misakaqunianxiatian/article/details/48523797)
> 3-[读写权限（可用1）](https://blog.csdn.net/caomiao2006/article/details/52080451)
