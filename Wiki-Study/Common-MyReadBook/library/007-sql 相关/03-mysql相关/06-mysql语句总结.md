# mysql 语句总结


## 1-alert insert 语句

```sql
alter table T1
add Sentrance datetime null


alter table T1
drop column Sentrance


alter table T1
add Sentrance datetime not null default ('2000-9-1')

alter table T1
alter column Sentrance smalldatetime null

alter table T1
drop constraint DF__T1__Sentrance__2F10007B

alter table T1
add constraint DF_T1_Sentra default('1980-1-1') for Sentrance

alter table T1
alter column c1 char(10) not null

alter table T1
add constraint PK_T1 primary key (c1)

alter table T1
drop constraint DF_T1_Sentra

alter table T1
drop column Sentrance

drop table t1

create table t1
(c1 int identity(101,2) primary key,
 c2 char(10)

)

set identity_insert t1 on

insert into t1(c1,c2)
values(1011,'dffdfgsd')

insert  student
values('5555','erer','男','1990-4-5','计算机')

insert student(studentID ,studentName )
values('567','err')

insert student (studentID,sex)
values('33333','女')

insert student (studentID ,studentName ,speciality )
values('999','ererer','计算机')

insert into t2
values('345345t')

insert into stuInfo0
select studentID ,studentName,sex
from student

insert t2
values('tyt00')
set identity_insert t1 off
set identity_insert t2 on

insert t2(c1,c2)
values('8899','tyt00')

```

## 2-chap8-Tsql

```sql
declare @i int, @j int
select @i=1
set @j=2
select @i+@j

select ABS(-3.1),SIGN(-3.1),FLOOR(3.5),
RAND()

declare @i char(10),@j varchar(10)
set @i='a'
set @j='a'
select datalength(@i),datalength(@j)

select studentName,LEFT(studentname,1),
RIGHT (studentName,LEN(studentName)-1),
SUBSTRING(studentName,2,3)
from student

declare @i int
set @i=1

while @i<=LEN('China')
begin
	select substring('China',@i ,1),ASCII (substring('China',@i ,1))
	set @i=@i+1
end

declare @sum int,@csum char(10)
set @sum=5050
print @sum
select @csum =CONVERT (char(10),@sum)
print '1+2+^......+100='+@csum

select GETDATE(),DATEADD(year,2,getdate())

```
## 3-create table

```sql
create table student
(
 studentID char(10) primary key,
 studentName varchar(10) not null,
 sex char(2) check(sex='男' or sex ='女') ,
 birth datetime,
 speciality varchar(30) default('软件学院'),
 credithour tinyint not null   
)

create table course
(
 courseID char(8) not null primary key,
 courseName varchar(20) not null,
 totalperiod tinyint ,
 weekperiod tinyint   
)



create table grade
(
 stuID char(10) not null foreign key references student(studentID) ,
 courseID char(8) not null,
 grade tinyint null ,
 constraint ck_grade_grade check(grade>=0 and grade<=100) ,
 constraint PK_Grade primary key (stuID, courseID),  
 constraint FK_Grade_Course foreign key(courseID) references course(courseID)
)

create table student2
(
 studentID char(10) constraint PK_Stu2 primary key,
 studentName varchar(10) not null,
 ID char(18) not null unique,
 sex char(2) constraint CK_Stu_sex2 check(sex='男' or sex ='女') ,
 birth datetime,
 speciality varchar(30) default('软件学院'),
 credithour tinyint not null   
)

sp_rename 'student2','stu2'
sp_rename 'stu2.studentID','stuID','column'
```

## 4-function、cursor(游标)

```sql

create function get_avg(@courseID char(10))
returns int
begin
	declare @avg int
	select @avg=avg(grade) from grade
	where courseID=@courseID
	return @avg
end

select GETDATE ()
select dbo.get_avg()

declare @avg1 int
exec @avg1=dbo.get_avg
select @avg1


drop function dbo.get_avg
select GETDATE()
select dbo.get_avg('1')

declare @avg1 int
exec @avg1=dbo.get_avg '2'
select
 case
	when @avg1 >=90  then '优秀'
	when @avg1 >=80 and @avg1<90 then '良好'
	when @avg1 >=70 and @avg1<80 then '中等'
end 等级制成绩

select Sno,Sname,Ssex=
case Ssex
	when  0 Then '女'
	when 1 Then '男'
end
from student

create function get_avg2
(@courseName varchar(20)='计算机基础')
returns int
begin
	declare @avg int
	select @avg=avg(grade)
	from grade join course on grade.courseId=course.courseID
	where courseName=@courseName
	return @avg
end

select dbo.get_avg2('')

declare @a int
exec @a=dbo.get_avg2
select @a

create function get_max3
(@a int,@b int,@c int)
returns int
begin
	declare @max int
	set @max=@a
	if @b>=@a and @b>=@c
	 Set @max=@b
	else if @c>=@a and @c>=@b
	set @max=@c
	return @max
end

select dbo.get_max3(50,20,65)

declare @max int
exec @max=dbo.get_max3 50,65,20
select @max


declare stu_cur1 cursor
for
select * from student
where speciality='计算机'

open stu_cur1
select @@CURSOR_ROWS

DECLARE stu_cur3 CURSOR
scroll
FOR
SELECT studentID,studentname,birthday
FROM student
WHERE speciality='计算机'
open stu_cur3
select @@cursor_rows '行数'
```

## 5- group order

```sql
select COUNT(*) 学生人数
from student

select COUNT (distinct studentID ) from Grade

select COUNT (*) from student
where speciality ='计算机'

select AVG(grade) from Grade
where courseID='1'

select MAX(grade) ,MIN(grade)
from Grade
where courseID ='1'

SELECT distinct STUDENTid FROM Grade  G1
where (select AVG(grade) from Grade g2
             where G1.studentID =g2.studentID  )>80


 select speciality , COUNT(studentID)  
from student  
group by speciality


select courseID,AVG(grade),COUNT(studentID)
from Grade
group by courseID

select studentID,AVG(grade) from Grade
group by studentID
having AVG(grade)>85

select speciality ,sex , COUNT(studentID)
from student
group by sex  ,speciality with cube


select  studentID,COUNT(courseID) from Grade
group by studentID
having COUNT(courseID) >3


select  studentID,COUNT(courseID) from Grade
where grade >80

group by studentID
having COUNT(courseID) >=2

select * from student
where speciality ='计算机'
order by birthday

select top (2) with ties studentID,Grade
from Grade
where courseID ='2'
order by grade desc




```

## 6-having、order

```sql
select studentID,COUNT(courseID)
from Grade
group by studentID
having COUNT (courseID)>=4

select studentID, AVG(grade)
from Grade
group by studentID
having AVG(grade)>80

select studentID from Grade
where grade>80
group by studentID
having COUNT(courseID)>=2

select * from student
order by speciality

select * from student
where speciality ='计算机'
order by birthday

select studentID,Grade
from Grade
where courseID='2'
order by grade desc

select top(1) with ties studentID, AVG(grade)
from Grade
group by studentID
order by AVG(grade) desc


select studentName,sex,grade  from
student inner join Grade
on student.studentID=grade .studentID

select * from
student inner join Grade
on student.studentID=grade .studentID
where grade >80

select student.studentID , studentName,coursename,grade  from
student inner join Grade
on student.studentID=grade .studentID
inner join  Course
on grade.courseID =course.courseID


--错误用法
select  studentName,coursename,grade  from
student inner join Grade inner join Course on   

select grade.studentID , studentName,AVG(grade)
from student inner join Grade on
student.studentID=grade .studentID
group by grade .studentID,  studentName
having AVG(grade)>80

```

## 7-index 索引

```sql
create unique nonclustered index IX_Cname
on course(courseName)

create unique clustered index IX_SID_CID
on grade(studentID,courseID)


CREATE UNIQUE INDEX IX_SNAME
ON student(studentName)


USE CJGL
GO
CREATE TABLE Test
(C1 int,
C2 nchar(50));

GO
CREATE UNIQUE INDEX AK_Index ON Test (C1)
    WITH (IGNORE_DUP_KEY = OFF);

GO
INSERT INTO Test VALUES (1, 'zhangsan');
INSERT INTO Test VALUES (1, 'lisi');
INSERT INTO Test VALUES (2, 'lisi');

GO
DROP TABLE Test;
GO



CREATE UNIQUE INDEX stu_ix1
ON stu_info(SId)
WITH (IGNORE_DUP_KEY = On);

insert into stu_info
select studentID ,studentName from student

delete stu_info

create unique clustered index IX_SID_CID
on grade(studentID,courseID)
with drop_existing

alter index IX_Sname on student disable
alter index IX_Cname on course disable

alter index all on student rebuild
alter index IX_Sname on student reorganize


sp_rename 'student.IX_Sname','IX_Name','index'

drop index iX_name on student
drop index student.ix_name
```

## 8-join

```
select *
from student  cross join Course

select * from
student  inner join Grade
on student.studentID =grade .studentID
where grade >80

select *
from student s inner join Grade g
on s.studentID =g.studentID  inner join
Course c on g.courseID =c.courseID
where coursename='计算机基础' and grade >70


select s.studentID,AVG(grade)
from student s inner join Grade g
on s.studentID =g.studentID
where speciality ='计算机'
group by s.studentID
having  AVG(grade)>85

select s.studentID, studentName
from student s inner join Grade g
on s.studentID =g.studentID
where courseID='1' and grade>80

select s.studentID, studentName
from student s,Grade g
where s.studentID =g.studentID and
courseID='1' and grade>80



select s.studentId ,studentname,coursename,Grade
from student s join Grade g on s.studentID =g.studentID
join Course c on g.courseID =c.courseID
where coursename='计算机基础' and grade>80


select g1.studentID ,g1.courseID ,g1.grade ,
g2.studentID ,g2.courseID ,g2.grade
from Grade g1 inner join Grade g2
on g1.studentID <>g2.studentID and
g1.courseID <>g2.courseID and
g1.grade =g2.grade
where g1.studentID >g2.studentID


select * from Grade right outer join student
on  student .studentID =grade .studentID
```
## 9-like group

```
select studentID,studentName,sex
from student
where studentName not like '王%'

select *
from Teacher
where teacherName like '_敏%'

select studentID,studentName,sex
from student
where studentName like '王_'

select studentID,studentName,sex
from student
where studentID like '3_'

select * from Course  
where coursename like 'DB<_%' escape '<'


select studentName ,YEAR(getdate())-YEAR(birthday),speciality
from student
where YEAR(getdate())-YEAR(birthday) between 21 and 23

select studentName ,YEAR(getdate())-YEAR(birthday),speciality
from student
where YEAR(getdate())-YEAR(birthday) in (21,22,23)

select * from student
where speciality in ('计算机','通信工程','','')

select * from student
where speciality='计算机' or speciality ='通信工程'

select speciality, COUNT(*)
from student
group by speciality

select COUNT (distinct studentID)
from Grade

select COUNT (studentID) from student
where speciality ='计算机'

select AVG (grade) from Grade
where courseID ='1'

select MAX (grade),MIN(grade) from Grade
where courseID ='4'

select distinct studentID from Grade  g1
where (select AVG(grade) from Grade
			where g1.studentID =studentID)>80

select distinct studentID from Grade
group by studentID
having AVG(grade)>80



select courseID,AVG(grade), COUNT(studentID) from Grade
group by courseID 		

select studentID,AVG(grade) from Grade
group by studentID 	

select speciality,sex,COUNT (studentID) from student
group by speciality , sex

```

## 10-select 子句

```sql
select @@VERSION   --查询系统全局变量

declare @i int		
set @i=10
select @i				--局部变量

select GETDATE()  --获取系统日期

select PI() as 圆周率常数,正弦值=SIN(pi()),COS(pi()) 余弦值

select *
from student

select studentID,studentName,birthday
from student

select studentName, YEAR( GETDATE())-YEAR(birthday) as 年龄
from student

select distinct studentID from Grade


select studentID, studentName, studentName+studentID
from student

select studentID,studentName from student
where speciality! ='计算机'

select studentName ,YEAR(getdate())-YEAR(birthday) as age
from student as S
where s.sex='女' or
YEAR(getdate())-YEAR(birthday)>20


select studentID from grade
where grade is null
```

## 11-subquery-any-exists

```
select studentName, YEAR(getdate())-YEAR(birthday)
	,speciality
	from student
	where speciality <>'计算机' and
	 YEAR(getdate())-YEAR(birthday)<any
	(select YEAR(getdate())-YEAR(birthday)
	from student
	where speciality ='计算机')

	select studentName,courseName,grade
	from Grade inner join student on grade .studentID =student .studentID
	inner join Course on course.courseID =grade.courseID
	where grade.courseID  =any
			(select courseID from Grade
			where studentID =
				(select studentID from student
				where studentName='李燕'))

select studentName from student
where 		studentID in		
				(select studentID from Grade
				where courseID='1')

select studentName from student
where 	exists
		(select * from Grade
			where student.studentID=grade .studentID
			and courseID='1')		

select studentName from student
where 	not exists
		(select * from Grade
			where student.studentID=grade .studentID
			and courseID='1')


select studentName
from student
where not exists
		(select * from Course
		 where not exists
			(select * from Grade
			 where grade.studentID =student.studentID
			and grade.courseID =Course.courseID  ))

	select * from student
	where speciality ='计算机'
	except
	 select * from student
	where speciality ='数学'
```

## 12-T-SQL +function

```sql
--变量声明与使用
declare @a char(50);
declare @b varchar(50);

select @a ='aaa'
set @b ='bbbbbb'
select @a+@b


declare @i char(5);
set @i=1;
select * from student
where studentID=@i

--CASE WHEN……THEN ……语句的使用
select studentID,courseID,
case Grade
		when 90 then '优秀'
		when Grade >=80 and Grade <90 then '良好'
		when Grade >=70 and Grade <80 then '中等'
		when Grade >=60 and Grade <70 then '及格'
		when  Grade <60 then '不及格'
		else  '不确定'		
end as 成绩
from Grade

--CASE WHEN……THEN ……语句的使用
select sno,sname ,sex=
case
	when ssex=0 then '女'
	when ssex=1 then '男'
end
from Student

---查询字符串'China'中每个字符及字符的ASCII值
declare @i int
set @i=1;
declare @c varchar(20)
set @c='China'

while @i<=LEN(@c)
	begin
		select substring(@c,@i,1),ASCII(substring('China',@i,1))
		set @i=@i+1
	end

--姓与名分别显示(不考虑复姓的情况）
select substring(studentName,1,1) 姓, substring(studentName,2,2) 名
from student
或者
select left(studentName,1),right(studentName,len(studentName)-1)
from student


--获取指定课程的平均成绩
create function get_avg_course (@c char(8))
returns int
as
begin
	declare @avg int
	select @avg=avg(grade) from grade
	where courseId=@c
	return @avg
end

select dbo.get_avg_course('4')

--求任意给定三个整数的最大值
create function get_max(@a int,@b int,@c int)
returns int
as
begin
	declare @max int
	set @max=@a
	if @b>@a and @b>=@c
		set @max=@b
	else
		if @c>@a and @c>=@b
			set @max=@c
	return @max
end

select dbo.get_max (90,90,50)

exec dbo.get_max @a=90,@b=47,@c=50
```


## 13-update

```sql
update grade set grade=grade-5


update Grade set grade=70
where studentID ='1' and courseID ='2'

update Grade set grade=70
where studentID='1'

delete  Grade
where studentID='1'

```

## 14-view

```sql
create view vw_jsjstu
as
select * from student
where speciality ='计算机'

insert into vw_jsjstu
values('1111','qwqw','男',null,'软件学院',4,null,null,null )


create view vw_cs_stu
as
select * from student
where speciality ='计算机'
with check option

insert into vw_cs_stu
values('2222','qwqw','男',null,'计算机',4,null,null,null )
create view vw_stu_gra1
as
select s.studentID,studentName,courseID,Grade
from student  s inner join Grade g on s.studentID=g.studentID
where speciality ='计算机'

create view vw_stu_gra85
as
select * from vw_stu_gra1
where Grade>85

select *from vw_stu_gra85

alter view vw_stu_gra1(姓名,课程号,成绩)
as
select studentName,courseID,Grade
from student  s inner join Grade g on s.studentID=g.studentID
where speciality ='计算机'


select studentName ,studentID from vw_cs_stu
where YEAR(getdate()) -YEAR(birthday)<21

insert into vw_cs_stu
(studentID,studentName,birthday,speciality,credithour)
values('1015','白浩','1990-5-25','计算机',4)

update vw_cs_stu
set speciality='通信工程'
where studentID='1015'

drop view vw_cs_stu
```

## 15-where 子句

```
select GETDATE() = 系统日期

select studentID,studentName
from student

select studentName,year(GETDATE())-YEAR(birthday ) as age
from student

select distinct studentID
from Grade

select studentID ,courseID,Grade*1.1
from Grade

select 'a'+'rtrt' +'werewr'

select studentID,studentName
from student
where speciality !='计算机'

select * from student
where year(GETDATE())-YEAR(birthday )>20

select studentName,year(GETDATE())-YEAR(birthday ) as age
from student
where sex='男' or year(GETDATE())-YEAR(birthday )>20

select * from Grade
where grade is not  null

select * from student
where studentName not like '王%'

select * from Teacher
where teacherName like '_敏%'

select * from student
where studentName like '王_'

select * from Course
where coursename like 'DB\_\%' escape '\'


select studentName,YEAR(getdate())-YEAR(birthday),speciality
from student
where YEAR(getdate())-YEAR(birthday) not in (19,20,21)
select studentName,YEAR(getdate())-YEAR(birthday),speciality
from student
where birthday >='1992-1-1' and birthday<='1994-12-31'

select * from student
where YEAR(birthday ) not in ('1990')

select * from student
where speciality in ('计算机','通信工程')


```


## 例题


```
?	查询学生姓名，在一列中显示学生姓氏，另一列中返回学生名。
select SUBSTRING (studentname ,1,1) 姓, substring (studentname ,2,2) 名
from student
select left  (studentname ,1) 姓 ,RIGHT (studentname ,LEN (studentname )-1) 名
from student
?	显示字符串“China”中每个字符的ASCII值和字符。
declare @i int
declare @c varchar (20)
set @c='china '
set @i=1

while @i <=LEN (@c)
begin
select SUBSTRING (@c,@i,1), ascii (substring ('china ',@i,1))
set @i=@i+1
end
?	产生10个0~3之间的随机数。
declare @i  smallint
set @i =1
while @i<=10
begin
select ROUND (rand ()*4,0) random_number
set @i=@i+1
end

?	计算1+2+3+……+100的和，并使用PRINT显示计算结果。
declare @i int
declare @sum int
set @i =1
set @sum  =0
while @i  <100
begin
   set @sum   =@i +@sum  
   set @i =@i+1

end
print @sum
?	查询100天和2年后的日期。

select DATEADD (dd,100,getdate ())
select DATEADD (YY,2,GETDATE ())

?	创建一个函数，计算全体学生某门课程的平均成绩。

create function get_avg_course (@c char(8))
returns int
as
begin
	declare @avg int
	select @avg=avg(grade) from grade
	where courseId=@c
	return @avg
end
select dbo.get_avg_course ('4')


?	创建一个函数，计算计算机基础课程的平均成绩。
create function get_avg_kc (@a varchar (20))
returns int
as
begin
declare @i int
select   @i=AVG(grade) from Grade inner join Course
on grade .courseID =Course .courseID
where coursename =@a
return @i
end
select dbo.get_avg_kc  ('数据结构')
?	创建一个函数，计算某个学生选课的平均成绩。
create function (@i int )


```
