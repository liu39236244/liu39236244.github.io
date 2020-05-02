# linux 添加swap 分区

*  of 命令
of: 参数地址随便写，of指定的是一个文件，注意 这个文件不能touch 命令创建文件，其实touch是可以但是以后touch创建的文件越来越大可能最终导致系统直接崩（意思是目录用mkdir创建，文件的话执行dd 这一行命令），其实of 就是创建一个大小为指定大小的文件，不会越来越大（这里是4个G ）
count:命令的意思是给swap 分多少存储空间，4096000 这里是4个G ，
*  mkswap
把第一步创建的swap文件转换为 swap

*  mkswap -f

将第二部创建的swap文件格式化成系统能识别的

*  swapon/swapoff 挂载/取消挂载 到服务器上

>>如果不想让此设置生效，直接 swapoff /shenyabo/MySoftware/centos-swap/swap ，然后rm -f 这个swap文件

*
```
dd if=/dev/zero of=/shenyabo/MySoftware/centos-swap/swap bs=1024 count=4096000
mkswap  /shenyabo/MySoftware/centos-swap/swap
mkswap -f  /shenyabo/MySoftware/centos-swap/swap
swapon  /shenyabo/MySoftware/centos-swap/swap
```

# 扩展

## 多增加
注意如果觉得一个不够用，可以在创建一个swap ，新的文件在哪都行，然后挂在一下就行 了

## 命令合并

mkswap  与 mkswap -f 这两个命令可以合成一个，边初始化，边格式化
