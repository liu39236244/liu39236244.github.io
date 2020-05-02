# linx 查看系统参数

## linux 查看硬件

* 查看cpu个数、核数、逻辑cpu 个数可用语句

```
# 总核数 = 物理CPU个数 X 每颗物理CPU的核数
# 总逻辑CPU数 = 物理CPU个数 X 每颗物理CPU的核数 X 超线程数

# 查看物理CPU个数
cat /proc/cpuinfo| grep "physical id"| sort| uniq| wc -l


# 查看每个物理CPU中core的个数(即核数)
cat /proc/cpuinfo| grep "cpu cores"| uniq

# 查看逻辑CPU的个数
cat /proc/cpuinfo| grep "processor"| wc -l
复制代码
 查看CPU信息（型号）
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c



查看内 存信息
# cat /proc/meminfo

# 查看cpu 型号

[root@boyashen ~]# lscpu | grep "Model name"
Model name:            Virtual CPU a7769a6388d5
```

* 查看内存文件等

```
1. 查看内存使用：
more /proc/meminfo
# 查内存
free -h
# 查磁盘
df -h

# 查看文件夹大小：
du -sh 查看文件夹大小；
# 查看ip
ifconfig -a

# 查看主机ip映射
hostname
主机名

# 修改hosts
vim /etc/hosts


打开/proc目录查看系统硬件配置。

用命令查看里面的文件，代码如下：

cat /proc/cpuinfo 查看cpu信息；

processor 查看flags超线程；

lspci 查看主板信息；

free –m 查内存；

fidsk -l 查硬盘空间；

df -h 查硬盘；

du -sh 查看文件夹大小；

top 查看内存、进程、负载；

uptime 查运行时间、负载情况。
```

* 查看系统配置


```
# 查看系统位数：
[root@boyashen ~]# getconf LONG_BIT
64

# 
```

##  Linux 查看mysql 配置

[博主地址](/usr/bin/mysql --verbose --help | grep -A 1 'Default options')

* which mysql
* /usr/bin/mysql --verbose --help | grep -A 1 'Default options'


# linux查看系统内存使用情况


https://baijiahao.baidu.com/s?id=1629314709439937376&wfr=spider&for=pc