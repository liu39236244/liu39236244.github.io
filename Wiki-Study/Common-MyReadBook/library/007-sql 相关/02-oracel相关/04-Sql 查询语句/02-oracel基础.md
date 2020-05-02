# oracel 对应零碎总结

## oracel 创建命名空间

* [博主地址](http://blog.itpub.net/31408204/viewspace-2148383/)


Oracle安装完后，其中有一个缺省的数据库，除了这个缺省的数据库外，我们还可以创建自己的数据库。

    对于初学者来说，为了避免麻烦，可以用'Database Configuration Assistant'向导来创建数据库。

创建完数据库后，并不能立即在数据库中建表，必须先创建该数据库的用户，并且为该用户指定表空间。

关系：一个大的数据中分为几个表空间，创建几个用户然后指定对应的表空间并授权，这样用户就独立操作自己的资源了，每每用户登录进入后，在自己的表空间中新建表啊等等对象，互不干扰。

    下面是创建数据库用户的具体过程：



1.假如现在已经建好名为'NewDB'的数据库

此时在D:appAdministratororadata目录下已经存在NewDB目录（注意：我的Oracle11g安装在D盘下，若你的Oracle安装在别的目录，那么你新建的数据库目录就在*:appAdministratororadata目录下）。



2.创建用户之前要创建"临时表空间"，若不创建则默认的临时表空间为temp。

SQL> CREATE TEMPORARY TABLESPACE DB_TEMP

         TEMPFILE 'D:appAdministratororadataNewDBDB_TEMP.DBF'

         SIZE 32M

         AUTOEXTEND ON

         NEXT 32M MASIZE UNLIMITED

         EXTENT MANAGEMENT LOCAL;



3.创建用户之前先要创建数据表空间，若没有创建则默认永久性表空间是system。

SQL> CREATE TABLESPACE DB_DATA

         LOGGING

         DATAFILE 'D:appAdministratororadataNewDBDB_DATA.DBF'

         SIZE 32M

         AUTOEXTEND ON

         NEXT 32M MAXSIZE UNLIMITED

         EXTENT MANAGEMENT LOCAL;

其中'DB_DATA'和'DB_TEMP'是你自定义的数据表空间名称和临时表空间名称，可以任意取名；'D:appAdministratororadataNewDBDB_DATA.DBF'是数据文件的存放位置，'DB_DATA.DBF'文件名也是任意取；'size 32M'是指定该数据文件的大小，也就是表空间的大小。



4.现在建好了名为'DB_DATA'的表空间，下面就可以创建用户了：

SQL> CREATE USER NEWUSER IDENTIFIED BY BD123

         ACCOUNT UNLOCK

         DEFAULT TABLESPACE DB_DATA

         TEMPORARY TABLESPACE DB_TEMP;

默认表空间'DEFAULT TABLESPACE'使用上面创建的表空间名：DB_DATA。

临时表空间'TEMPORARY TABLESPACE'使用上面创建的临时表空间名:DB_TEMP。



5.接着授权给新建的用户：

SQL> GRANT CONNECT,RESOURCE TO NEWUSER;  --表示把 connect,resource权限授予news用户

SQL> GRANT DBA TO NEWUSER;  --表示把 dba权限授予给NEWUSER用户

    授权成功。

    OK! 数据库用户创建完成，现在你就可以使用该用户创建数据表了！



总结：创建用户一般分四步：

第一步：创建临时表空间

第二步：创建数据表空间

第三步：创建用户并制定表空间

第四步：给用户授予权限


## 触发器的创建与使用案例

[原博主](https://blog.csdn.net/jessonlv/article/details/6714734)


ORACLE中的序列和触发器

序列：

序列(SEQUENCE)是序列号生成器，可以为表中的行自动生成序列号，产生一组等间隔的数值(类型为数字)。其主要的用途是生成表的主键值，可以在插入语句中引用，也可以通过查询检查当前值，或使序列增至下一个值。

创建序列需要CREATE SEQUENCE系统权限。序列的创建语法如下：

```
CREATE SEQUENCE 序列名
[INCREMENT BY n]
[START WITH n]
[{MAXVALUE/ MINVALUE n|NOMAXVALUE}]
[{CYCLE|NOCYCLE}]
[{CACHE n|NOCACHE}];
INCREMENT BY 用于定义序列的步长，如果省略，则默认为1，如果出现负值，则代表序列的值是按照此步长递减的。

```

START WITH 定义序列的初始值(即产生的第一个值)，默认为1。

MAXVALUE 定义序列生成器能产生的最大值。选项NOMAXVALUE是默认选项，代表没有最大值定义，这时对于递增序列，系统能够产生的最大值是10的27次方;对于递减序列，最大值是-1。

MINVALUE定义序列生成器能产生的最小值。选项NOMAXVALUE是默认选项，代表没有最小值定义，这时对于递减序列，系统能够产生的最小值是?10的26次方;对于递增序列，最小值是1。

CYCLE和NOCYCLE 表示当序列生成器的值达到限制值后是否循环。CYCLE代表循环，NOCYCLE代表不循环。如果循环，则当递增序列达到最大值时，循环到最小值;对于递减序列达到最小值时，循环到最大值。如果不循环，达到限制值后，继续产生新值就会发生错误。

CACHE(缓冲)定义存放序列的内存块的大小，默认为20。NOCACHE表示不对序列进行内存缓冲。对序列进行内存缓冲，可以改善序列的性能。

删除序列的语法是：

```
DROP SEQUENCE 序列名;

```
其中：

删除序列的人应该是序列的创建者或拥有DROP ANY SEQUENCE系统权限的用户。序列一旦删除就不能被引用了。

序列的某些部分也可以在使用中进行修改，但不能修改SATRT WITH选项。对序列的修改只影响随后产生的序号，已经产生的序号不变。修改序列的语法如下：

创建和删除序列

例1：创建序列：

```
CREATE SEQUENCE ABC INCREMENT BY 1 START WITH 10 MAXVALUE 9999999 NOCYCLE NOCACHE;

```

执行结果

序列已创建。

步骤2：删除序列：

DROP SEQUENCE ABC;

执行结果：

序列已丢弃。

说明：以上创建的序列名为ABC，是递增序列，增量为1，初始值为10。该序列不循环，不使用内存。没有定义最小值，默认最小值为1，最大值为9 999 999。



###【案例一】

题目：
--触发器：
--添加员工信息,流水号作为自动编号(通过序列生成),
--并且判断如果工资小于0,则改为0;如果大于10000,则改为10000。

```sql

CREATE TABLE emp2(
e_id NUMBER,
e_no NUMBER,
e_name VARCHAR2(20),
e_sal NUMBER
);

SELECT * FROM emp2;

CREATE SEQUENCE seq_trg_id;

INSERT INTO emp2(e_id,e_no,e_name,e_sal) VALUES(seq_trg_id.nextval,7788,'章子',1000000000000);
INSERT INTO emp2(e_id,e_no,e_name,e_sal) VALUES(seq_trg_id.nextval,7788,'章子怡',-10);

CREATE OR REPLACE TRIGGER trg_add_emp_info
  BEFORE INSERT
  ON emp2
  FOR EACH ROW
  DECLARE
    -- local variables here
  BEGIN
    SELECT seq_trg_id.NEXTVAL INTO :NEW.e_id FROM dual;
    IF  :NEW.e_sal < 0 THEN
       :NEW.e_sal := 0;
    ELSIF  :NEW.e_sal > 10000 THEN
       :NEW.e_sal := 10000;
    END IF;
  END;

```

【 案例二】

题目：

--扩充练习：
--为emp建立触发器,将删除的记录放到emp3表中(autoid,deptno,empno,ename,del_rq-删除日期)
--测试代码

```sql
CREATE TABLE emp3(
autoid NUMBER PRIMARY KEY,
deptno NUMBER,
empno NUMBER,
ename VARCHAR2(20),
del_rq DATE
);

CREATE SEQUENCE seq_trg_del_autoid;

INSERT INTO emp
  (empno, ename, deptno)
VALUES
  (114, '阿娇', 10);
 COMMIT;

 SELECT * FROM emp;

 DELETE emp WHERE empno = 114;
 SELECT * FROM emp3;

 答案：

CREATE OR REPLACE TRIGGER trg_del_emp_info
  BEFORE DELETE
  ON emp2
  FOR EACH ROW
  DECLARE
    -- local variables here
  BEGIN
    INSERT INTO emp3(autoid,deptno,empno,ename,del_rq)
          VALUES(seq_trg_del_autoid.NEXTVAL,:OLD.deptno,:OLD.empno,:OLD.ename,sysdate);
  END;

```




## next
