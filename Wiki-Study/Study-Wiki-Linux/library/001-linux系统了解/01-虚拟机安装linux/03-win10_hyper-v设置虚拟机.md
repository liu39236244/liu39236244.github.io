# win10 的hyper-v 设置centos 联网

## 内部交换机类型；桥接方式连接创建的虚拟机


### 1 创建一个交换机

![](assets/001/01/03-1629709441564.png)

### 设置win10 主机上刚才创建的交换机与 主机之前的网卡 共同选中；右键创建桥接

![](assets/001/01/03-1629709533532.png)

随后会有一个网桥，公司如果用的是固定ip方式，那么就把这个网桥改下设置；ip以及网关都是之前主机上网的设置；设置完毕之后；


![](image/03-win10_hyper-v设置虚拟机/1629709546805.png)



### 设置虚拟机的ip 并重启

命令：vi /etc/sysconfig/network-scripts/ifcfg-eth0


ip: 10.0.12.1 这个网关是与win10 主机在同一个网关；

TYPE=Ethernet
PROXY_METHOD=none
BROWSER_ONLY=no
BOOTPROTO=static
DEFROUTE=yes
IPV4_FAILURE_FATAL=no
IPV6INIT=yes
IPV6_AUTOCONF=yes
IPV6_DEFROUTE=yes
IPV6_FAILURE_FATAL=no
IPV6_ADDR_GEN_MODE=stable-privacy
NAME=eth0
UUID=c3fb69df-744c-4613-b7bb-826392ee6220
DEVICE=eth0
ONBOOT=yes
IPADDR=10.0.12.91
GATEWAY=10.0.12.1
DNS1=202.99.96.68
DNS2=8.8.8.8
DNS3=202.99.104.68

重启网卡：
service network restart


ping 百度：


![](assets/001/01/03-1629709779438.png)

ping 主机：这里不给留图

主机ping 虚拟机：这里也不给留图；可以ping通即可

