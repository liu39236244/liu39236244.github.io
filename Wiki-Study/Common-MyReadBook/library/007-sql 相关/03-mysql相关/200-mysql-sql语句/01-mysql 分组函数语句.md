# mysql 分组语句



## 分组sql 



![](assets/007/03/200/01-1614682664641.png)

题目2 ：


![](assets/007/03/200/01-1614682863178.png)


![](assets/007/03/200/01-1614682868185.png)

![](assets/007/03/200/01-1614682873583.png)


```sql
-- 查询一班得分在80分以上的学生
select student_class sc left join   student s on sc.s_id = s.s_id 
left join class c on sc.c_id = c._id 
where c.c_name='一班' and s.score > 80



-- 查询所有班级的名称和所有班级中女生人数和女生的平均分

select c.c_name as '班级',count(s.s_id) as '女生人数',avg(s.score) as '平均分' from student_class sc left join class c on sc.c_id =  c.c_id 
left join student s on sc.s_id = s.s_id 
where s.sex ='F'
GROUP BY sc.c_id 

```

* 题目三 、

![](assets/007/03/200/01-1614682805314.png)

![](assets/007/03/200/01-1614682835155.png)