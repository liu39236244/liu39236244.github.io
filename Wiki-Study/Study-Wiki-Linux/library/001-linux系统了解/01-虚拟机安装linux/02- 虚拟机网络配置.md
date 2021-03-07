# 虚拟机配置


## nat 模式设置虚拟机网络

* 由于网络知识学得不怎么样，导致有一次怎么都弄不好虚拟机的网络。 原因就是 网关都是设置的.2  就我不设置.2 非要设置.1 ，导致的结果是 虚拟机ping不同 baidu ，且主机我xshell 也连不上虚拟机 ； （引以为戒 啊！！）


## 首先 是三种 网络模式的说明 


### VMware虚拟机三种网络模式详解与配置

https://blog.csdn.net/zhang33565417/article/details/97779579

## 其次，这里记录nat 模式下我的设置



### 首先，如果主机电脑的  虚拟机的网卡

安装虚拟机 之后，电脑上会有对应的 Vmnet1/ Vmnet8 的两张虚拟网卡。 1 是针对仅主机模式  8 那个是 nat 模式对应的网卡

![](assets/001/01/02-1615122306209.png)

> 1 设置虚拟机的网络设置为 nat 

![](assets/001/01/02-1615122408439.png)

![](assets/001/01/02-1615122425479.png)

### 设置虚拟机的使用的网络模式 为 nat ，并且设置 子网ip 以及子网掩码 

> 1. 我这里因为之前用过虚拟机 ，搭建过 hadoop ，所以 当时设置的是 这个ip ，时隔一年多，我如果不想动虚拟机网卡配置，我这里正常重新装的Vmware 可能就是别的网址，这里 虚拟机 的ip 之前静态ip 为：192.168.153.128  ，

所以这子网ip 设置  ：192.168.153.0 
子网掩码：255.255.255.0

![](assets/001/01/02-1615122497309.png)


![](assets/001/01/02-1615122757849.png)


DHCP:设置，就是设置你的虚拟机的ip 的范围

![](assets/001/01/02-1615122794719.png)

> 2 至此虚拟机设置完毕，


### 虚拟机网卡设置

网卡设置：

查看网卡 命令 

    vi /etc/sysconfig/network-scripts.ifcfg-ens33 

重启网卡 ：

    /etc/init.d/network restart 
        或者
    service network restart

![](assets/000/01/02/10/03/00/01-1615118664973.png)

![](assets/000/01/02/10/03/00/01-1615118676001.png)



```
TYPE=Ethernet
BOOTPROTO=static
DEFROUTE=yes
PEERDNS=yes
PEERROUTES=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_PEERDNS=yes
IPV6_PEERROUTES=yes
IPV6_FAILURE_FATAL=no
NAME=ens33
ONBOOT=yes
IPADDR0=192.168.153.128
PREFIXO0=24
GATEWAY0=192.168.153.2
DNS1=8.8.8.8
DNS2=8.8.4.4
DNS3=119.29.29.29
```

![](assets/001/01/02-1615123043469.png)



