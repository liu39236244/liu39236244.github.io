# win10 的hyper-v 设置centos 联网

## 内部交换机类型；桥接方式连接创建的虚拟机(个人发现是有问题的，重启以后宿主主机连不上网)


### 1 创建一个交换机

![](assets/001/01/03-1629709441564.png)

### 设置win10 主机上刚才创建的交换机与 主机之前的网卡 共同选中；右键创建桥接

![](assets/001/01/03-1629709533532.png)

随后会有一个网桥，公司如果用的是固定ip方式，那么就把这个网桥改下设置；ip以及网关都是之前主机上网的设置；设置完毕之后；


![](image/03-win10_hyper-v设置虚拟机/1629709546805.png)



### 设置虚拟机的ip 并重启(这个貌似有问题，先别用)

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

### 问题所在

## 创建外部链接；然后设置ip即可

上面是头一天看博客上用网桥方式设置的，虽然可以shell 连上 ，且能虚拟机上网 ，但是第二天重启电脑发现宿主主机连不上网了。问了管理员发现也没有禁用ip之类的；于是我又开始上网搜。无意间看到一个博主下面评论的说 hpyer-v 比 vm-ware 方便不知道多少，直接创建一个外部链接就行了。

后来就有了 创建外部链接；先不要应用；先保存确定；然后去网络管理那边吧新建的外部虚拟交换机那个网卡设置一下ip即可；

* 1 如图
* 
![](assets/001/01/03-1629769328052.png)

* 2
* 
![](assets/001/01/03-1629769436067.png)



## 设置内部链接(这个才管用了)

原文地址：https://blog.csdn.net/rai369963/article/details/83450947


win10下使用hyper-v在本机安装linux虚拟机后，网络访问上有如下两点需求：

（1）无论物理机的网络环境怎么变化，都需要保持虚拟机的IP地址不变，保证我本机使用xshell等终端访问始终用同一个IP地址，或者在安装了其他软件后，访问虚拟机的IP地址保持不变。

（2）物理机可访问虚拟机，虚拟机是否可访问网络都行。重点保证本机可访问虚拟机，以及虚拟机之间能互相访问。

1、为了实现第一点，需给虚拟机设置一个固定的网段以及静态IP，这里使用192.168.137.X的网段，如下以centos7操作系统为例子，实现静态IP的设置：

cd /etc/sysconfig/network-scripts
vi ifcfg-eth0


我觉得 虚拟网卡的ip 为 137.1 这个是关键。不能动，虚拟机里面的ip 设置为你想要的ip即可

```
BOOTPROTO=static
DEVICE=eth0
ONBOOT=yes
IPADDR=192.168.137.200
GATEWAY=192.168.137.1
DNS1=192.168.137.1
NETMASK=255.255.255.0
```

重启网络服务，使设置生效：
systemctl restart network

2、Hyper-V上面的虚拟网络设置

打开Hyper-V上的虚拟机交换机管理器：

![](assets/001/01/03-1629873386538.png)


右键选中需要设置的虚拟机的设置选项，弹出如下框，选择刚才新建的Centos-7的虚拟交换机，点击确定，之后便可重启虚拟机使之生效：

![](assets/001/01/03-1629873431249.png)


![](assets/001/01/03-1629873460601.png)


3、下面就是查看一下刚才添加的虚拟交换机，在物理主机上就是一个虚拟网卡；这里的虚拟网卡的ip 不要去动它，就让他是137.1 就让他是137.1  就让他是137.1 （我刚开始一直把这个虚拟网卡ip设置为虚拟机的ip ，让他们保持一致导致我一直设置失败！！！！）


![](assets/001/01/03-1629873563558.png)

![](assets/001/01/03-1629873618777.png)

4、 设置网络


![](assets/001/01/03-1629873639463.png)

![](assets/001/01/03-1629873654465.png)

![](assets/001/01/03-1629873749627.png)

物理主机能ping 通 虚拟机！ 然后用链接软件链接，就ok了

![](assets/001/01/03-1629873811207.png)