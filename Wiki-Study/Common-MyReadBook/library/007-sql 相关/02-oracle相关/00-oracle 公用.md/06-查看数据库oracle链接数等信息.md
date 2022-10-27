# oracle查看数据库资源情况

,查看oracle数据库的连接数以及用户占用资源
原文：https://blog.csdn.net/weixin_42315701/article/details/116342206

1、查询oracle的连接数

select count(*) from v$session;

2、查询oracle的并发连接数

select count(*) from v$session where status='ACTIVE';

3、查看不同用户的连接数

select username,count(username) from v$session where username is not null group by username;

4、查看所有用户：

select * from all_users;

5、查看用户或角色系统权限(直接赋值给用户或角色的系统权限)：

select * from dba_sys_privs;

select * from user_sys_privs;

6、查看角色(只能查看登陆用户拥有的角色)所包含的权限

select * from role_sys_privs;

7、查看用户对象权限：

select * from dba_tab_privs;

select * from all_tab_privs;

select * from user_tab_privs;

8、查看所有角色：

select * from dba_roles;

9、查看用户或角色所拥有的角色：

select * from dba_role_privs;

select * from user_role_privs;

10、查看哪些用户有sysdba或sysoper系统权限(查询时需要相应权限)

select * from V$PWFILE_USERS;

select count(*) from v$process --当前的连接数

select value from v$parameter where name = ‘processes’ --数据库允许的最大连接数

修改最大连接数:

alter system set processes = 300 scope = spfile;

重启数据库:

shutdown immediate;

startup;

–查看当前有哪些用户正在使用数据


## 查看当前连接数

1、查看当前的数据库连接数

 select count(*) from v$process ;    --当前的数据库连接数

2、数据库允许的最大连接数

 select value from v$parameter where name ='processes';  --数据库允许的最大连接数

3、修改数据库最大连接数
 alter system set processes = 300 scope = spfile;  --修改最大连接数:

4、关闭/重启数据库
 shutdown immediate; --关闭数据库
 startup; --重启数据库

5、查看当前有哪些用户正在使用数据

select osuser, a.username, cpu_time/executions/1000000||'s', b.sql_text, machine
from v$session a, v$sqlarea b
where a.sql_address =b.address 
order by cpu_time/executions desc;  --查看当前有哪些用户正在使用数据

6、 --当前的session连接数

select count(*) from v$session  --当前的session连接数

7、当前并发连接数

 select count(*) from v$session where status='ACTIVE';　--并发连接数

v$process：

这个视图提供的信息，都是oracle服务进程的信息，没有客户端程序相关的信息
服务进程分两类，一是后台的，一是dedicate/shared server
pid, serial#     这是oracle分配的PID
spid                这才是操作系统的pid
program         这是服务进程对应的操作系统进程名


v$session：

这个视图主要提供的是一个数据库connect的信息，
主要是client端的信息，比如以下字段：
machine   在哪台机器上
terminal  使用什么终端
osuser    操作系统用户是谁
program   通过什么客户端程序，比如TOAD
process   操作系统分配给TOAD的进程号
logon_time  在什么时间
username    以什么oracle的帐号登录
command     执行了什么类型的SQL命令
sql_hash_value  SQL语句信息

有一些是server端的信息：
paddr   即v$process中的server进程的addr
server  服务器是dedicate/shared

原文链接：https://blog.csdn.net/baidu_27474941/article/details/100134406