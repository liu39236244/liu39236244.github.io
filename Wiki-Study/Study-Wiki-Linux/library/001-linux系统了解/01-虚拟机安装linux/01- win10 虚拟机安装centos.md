# win 10 虚拟机配置centos 




## 问题记录 ，hyper-v 跟vmware 是冲突的，两者只能存在其中一个，所以 



```
关闭服务：
   bcdedit /set hypervisorlaunchtype off

重启，运行vm即可。

    若想恢复Hyper-v服务启动：

bcdedit / set hypervisorlaunchtype auto

```
* 这里暂时不做文章