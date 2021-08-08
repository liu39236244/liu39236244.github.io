# Linux防火墙相关的


## centos7 中防火墙

### 介绍

### 我的总结


### 防火墙

```
#停止firewall
systemctl stop firewalld

#禁止firewall开机启动
systemctl disable firewalld
```

### 开启端口查看端口

参考：https://blog.csdn.net/realjh/article/details/82048492


```
（1）查看对外开放的端口状态
查询已开放的端口 netstat -anp
查询指定端口是否已开 firewall-cmd --query-port=666/tcp
提示 yes，表示开启；no表示未开启。

（2）查看防火墙状态
查看防火墙状态 systemctl status firewalld
开启防火墙 systemctl start firewalld  
关闭防火墙 systemctl stop firewalld
开启防火墙 service firewalld start 
若遇到无法开启
先用：systemctl unmask firewalld.service 
然后：systemctl start firewalld.service

（3）对外开发端口
查看想开的端口是否已开：
firewall-cmd --query-port=6379/tcp


添加指定需要开放的端口：
firewall-cmd --add-port=123/tcp --permanent
重载入添加的端口：
firewall-cmd --reload
查询指定端口是否开启成功：
firewall-cmd --query-port=123/tcp

移除指定端口：
firewall-cmd --permanent --remove-port=123/tcp


安装iptables-services ：
yum install iptables-services 
进入下面目录进行修改：
/etc/sysconfig/iptables
```
### ssh链接问题

```
已经开启 22 端口但无法连接
刚买的 vps ，默认 ssh 端口是 29488， 使用以下方式连接
ssh -p 29488 root@x.x.x.x
觉得加端口有点麻烦， 希望使用默认的 22 端口。
于是开启防火墙， 添加 22 端口， 重启防火墙， 然后 ssh root@x.x.x.x 失败， 说我 22 端口没打开。
几经折腾， 原因在于:
ssh 是客户端， sshd 是服务端， 应先看 sshd 监听着多少端口。
所以解决方式是再去修改 sshd 监听的端口为 22 ， 然后重启 sshd ， 搞定。

回目录
centos 7 解决方法
firewall-cmd --zone=public --add-port=22/tcp --permanent # 添加端口
firewall-cmd --reload # 重启防火墙
vi /etc/ssh/sshd_config # 修改端口为 Port 22

/usr/sbin/sshd restart # 重启 sshd
systemctl restart sshd // 
```


### 修改ssh默认端口

https://blog.csdn.net/best_luxi/article/details/109340746   
```

```

