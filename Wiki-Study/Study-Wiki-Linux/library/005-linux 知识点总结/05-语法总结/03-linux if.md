# if 语句

## if的使用


if语句

```shell
if list then  
    do something here
elif list then
    do another thing here
else
   do something else here ＃必须有命令执行不然不能有else
fi   
```

EX1:

    #!/bin/sh

    SYSTEM=`uname -s` #获取操作系统类型，我本地是linux
    if [[ $SYSTEM = "Linux" ]] ; then #如果是linux的话打印linux字符串,字符串的判断需要[[  ]]不然有警告
    echo "Linux"
    elif [[ $SYSTEM = "FreeBSD" ]] ; then #条件前后一定要有空格
    echo "FreeBSD"
    elif [[ $SYSTEM = "Solaris" ]] ; then
    echo "Solaris" #字符串的赋值一定不能有空格
    else
    echo "What?"
    fi


基本上和其他脚本语言一样。没有太大区别。不过值得注意的是。[]里面的条件判断。

1 字符串判断

str1 = str2　　　　　　当两个串有相同内容、长度时为真
str1 != str2　　　　　 当串str1和str2不等时为真
-n str1　　　　　　　 当串的长度大于0时为真(串非空)
-z str1　　　　　　　 当串的长度为0时为真(空串)
str1　　　　　　　　   当串str1为非空时为真

2 数字的判断

int1 -eq int2　　　　两数相等为真
int1 -ne int2　　　　两数不等为真
int1 -gt int2　　　　int1大于int2为真
int1 -ge int2　　　　int1大于等于int2为真
int1 -lt int2　　　　int1小于int2为真
int1 -le int2　　　　int1小于等于int2为真

3 文件的判断

-r file　　　　　用户可读为真
-w file　　　　　用户可写为真
-x file　　　　　用户可执行为真
-f file　　　　　文件为正规文件为真
-d file　　　　　文件为目录为真
-c file　　　　　文件为字符特殊文件为真
-b file　　　　　文件为块特殊文件为真
-s file　　　　　文件大小非0时为真
-t file　　　　　当文件描述符(默认为1)指定的设备为终端时为真

4 复杂逻辑判断

-a 　 　　　　　 与
-o　　　　　　　 或

!　　　　　　　　非

5 shell中进行断点

exec echo debug
