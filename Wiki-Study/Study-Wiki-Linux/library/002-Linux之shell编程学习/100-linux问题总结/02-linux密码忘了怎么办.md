# centos 密码忘了 


* 原文：https://blog.csdn.net/weixin_41078837/article/details/80539986

##  虚拟机 centos7 密码忘了 

>1 自己电脑有虚拟机啊 ，但是时间长了密码都忘了 ，按照 网上e 编辑模式，但是进去之后passwd 没有命令，又搜了说yum安装passwd 什么的，后来发现了一个博客，挺不错 ，一次成！


### 破解密码

第1步：开机后在内核上按“e”。截图如下

![](assets/002/100/02-1615043730330.png)

按e以后会进入内核启动页面，如下图

![](assets/002/100/02-1615043739818.png)

第2步：在linux16这行的后面输入“rd.break console=tty0”然后按“ctrl+x“如下图

![](assets/002/100/02-1615043770937.png)


第3步：按完ctry+x 后进入到了系统的紧急求援模式，如下图：

![](assets/002/100/02-1615043780328.png)


第4步：依次输入以下命令：

    #mount –o remount,rw /sysroot

    #chroot /sysroot

    #passwd                    修改root密码

    #touch /.autorelabel

如下图：


![](assets/002/100/02-1615043798508.png)



然后输入命令：

#exit

#exit

输完以后，系统会重启，输入我们刚才配置的密码就行，如下图：

![](assets/002/100/02-1615043819960.png)

