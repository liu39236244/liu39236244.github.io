# 01- linux java服务分析

## 博客记录

[linux 分析java 内存占用过高](https://www.cnblogs.com/wu-wu/p/11923250.html)

[Linux中JAVA服务器内存占用高(分析解决方法)，导出堆占用情况 分析 hprof文件](https://blog.csdn.net/winy_lm/article/details/115228962)

## java linux 进程分析



### top jmap  分析堆栈




1  top 查找对应java 程序pid  或者 jps -l 查看


-- 程序内存高dump文件(文件名称必须以 .hprof 后缀结尾)  进程号
jmap -dump:format=b,file=/root/dd1.hprof 452615