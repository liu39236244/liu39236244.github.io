# 《shell 编程从入门到精通》的笔记


## 选夫婿

linux 内核不知道如何运行shell脚本（exec.sh），但是shell知道，通过 #!bin/bash 选择标准的shell程序
```
#!bin/bash 标准shell程序
#!usr/bin/python python脚本
```
如果不确定解释程序在哪，可以使用命令 hwere

```
whereis bash

```

### 自删除脚本

![自删除脚本](assets/002/20180509-213639fb.png)  


### Shell 命令种类

![Shell命令种类](assets/002/20180509-cc9cce53.png)  

三种：内建、shell函数、外部命令

```
内建：shell 程序本身包含的
shell函数：以shell组成的程序代码，可以向其他命令一样被引用
外部命令：独立于shell的可执行程序

```
shell进程父子关系：

![shell进程父子关系](assets/002/20180509-fa0049e5.png)  

注意点
```
使用source 执行脚本，不会创建子进程，而是在父进程中直接使用

```

### shell 变量

* shell 变量注意点
```
shell 变量以字母或者下划线开头，没有长度限制。
linux中的变量都是字符串，而且值的长度也没有限制
linux中的变量虽然是字符串，但是只要值是数字类型，就可以进行运算：
    add_1=1
    add_2=2
    echo $(($add_1+$add_2))
```

>shell变量赋值

```
变量名=值

注意：
  等号两边不能有任何空格，获取值:$变量名。当赋值内容有空格则加上引号就ok


```

#### 变量不加 $符号的情况

* 变量被声明，赋值的时候
* 变量被 unset
* 变量呗export

#### 单、双引号引用的变量的区别

''单引号是全引用，也成强引用。变量替换会被禁止
"" 双引号，弱引用

![这个是案例单双引号的引用](assets/002/20180509-c2961215.png)  


#### shell中变量可以为null，但是未初始化的变量引用运算

![变量运算](assets/002/20180509-c0a2618f.png)  


#### 变量的类型

* 局部变量与全局变量（环境变量是全局变量）

局部变量范围：局部代码块，或者函数中。但必须以local 声明，就算在代码块中，也是全局的
全局变量：全局范围内可见，不加任何修饰


#### echo输出

![echo输出](assets/002/20180509-afc76035.png)  

* echo 支持的转移字符

![echo 支持的转移字符](assets/002/20180509-09c21549.png)  

* export功能，将变量通知到脚本的本地环境变量，如果一个脚本将要设置一个环境变量，name如下：

![脚本设置环境变量](assets/002/20180509-63280f06.png)  

![下半部分](assets/002/20180509-e67d4a1d.png)  


* 启动文件包含别名与环境变量

![启动文件](assets/002/20180509-7263b90d.png)  

* bash 启动文件登出文件表

![](assets/002/20180509-fa98b6fd.png)  


* env命令 临时改变环境变量值，export 与env指定的环境变量区别：

![](assets/002/20180509-896a57d7.png)  

![](assets/002/20180509-47324fcd.png)  


##### 命令 unset

* 从当前shell中删除函数或者变量
unset 删除函数与环境变量案例

![unset删除变量，与函数](assets/002/20180509-d2f9d81d.png)  


* env与unset 区别表

![env操作](assets/002/20180509-328b78d3.png)  

![unset 操作](assets/002/20180509-2eb5a8f3.png)  

ene 与set 的注意
![env与set 的注意](assets/002/20180509-23ac2791.png)  


##### shell 中常用的环境变

![shell 常见环境变量](assets/002/20180509-39a761ee.png)  


##### path 环境变量的一些解释

![](assets/002/20180509-43d8c0df.png)  


#####  linux shell 是解释型语言

翻译的方式有两种。 编译型语言、解释型语言

区别：
```
翻译的时间不同
效率不同，编译型快，解释型慢
```

* linux中许多外部命令是编译型语言，文件格式二进制
* linux shell 确实解释型


* 两者差异

![编译、解释](assets/002/20180509-87bc5a32.png)  

* python其实也是有 编译的byteconde，但是不是强制的

![优势如下](assets/002/20180509-ecf57bac.png)  

![优势2](assets/002/20180509-cab200d0.png)  



## 第二章shell基本

* 编写一个shell 脚本，编写一个函数，函数列出来参数个数与参数列表，并且在shell脚本中调用函数传入参数

```Shell
#!bin/bash

testFunc(){
 echo "$# 个参数"
 echo "参数列表"
 echo "$@"
}

testFunc $@
```

* shell 编程中的参数

![shell 中的参数](assets/002/20180510-bd580c6d.png)
![shell参数注意选项](assets/002/20180510-afb3c955.png)  



### io 流

* cat

输入 // 手动输入
输入 // 自动输出

* cat a.txt

* cat a.txt > b.text
* cat a.txt >> b.txt 追加
* cat < a.txt > b.txt  // 读取 a.txt 写入到 b.txt


### 管道

commit1 |commit2 ,吧commmit1 的标准输出，与commit2的标准输入相连

```
[root@lzkj01 Shell_02]# head  -10 ./Function_Write.txt | grep "echo"
 echo "$# 个参数"
 echo "参数列表"
 echo "$@"

```

* 管道使用注意事项：

![管道](assets/002/20180510-bafcfdc5.png)  


* 标准文件输入、输出、错误。习惯描述符分别是  0 1  2  ，每个进程最多64个（0-63） 文件描述器。

profix 定义

![profix定义文件描述符](assets/002/20180510-666fa9bc.png)  

* dev null 的应用

![dev null 的应用](assets/002/20180510-91ad406c.png)  
![解释](assets/002/20180510-024d6518.png)  

* 0< 是代表标准输出，&> 代表标准错误

> 删除cookie的应用

![dev/null 删除cookie、的应用](assets/002/20180511-1d513045.png)  
![注意点](assets/002/20180511-e661b4c3.png)  


### dev/zero
类似于 dev/null 、dev/zero 是一个伪文件。产生  一个null 流不是ascill 类型。其他类型的输出写入他的话内容便会消失，从中读取一连串的null 的话 也会非常困难，虽然可以使用od 或者一个16进制的编译器进行。dev/zero 主要就是创建一个指定长度并且初始化内容为空的文件，一般都用做临时交换文件
案例代码：

```Shell
#!bin/bash
# 创建一个交换文件
ROOT_UID=0
E_WRONG_USER=
FILE=/swap
BLOCKSIZE=1024
MINBLOCKS=40
SUCCESS=0

# 设定脚本必须root 用户运行

if [ "$UID" -ne "$ROOT_UID" ]
then
echo "--------" ; echo "你必须是root用户运行" ;echo "-------";
exit "$E_WRONG_USER"
fi

# 给block快设置大小

blocks={1 :- $MINBLOCKS} # 如果脚本传入的第一个参数不为空，赋值给blocks 。否则吧$MINBLOCKS 赋值给blocks

if [ "$blocks" -lt "$BLOCKSIZE" ]
then
blocks=$MINBLOCKS
fi

echo ;
echo "创建 $FILE 文件,文件大小 $blocks(KB)"


# dd if=/dev/zero of=$FILE bs=$BLOCKSIZE count=$blocks # 用0填充文件

#mkswap $FILE $blocks
# swapon $FILE
mkdir $FILE
echo "Swap file created and cctived "
exit "$SUCCESS"
```



### dev/tty

描述案例：

![dev/tty 描述](assets/002/20180511-c17ef0d0.png)  

代码案例：
```Shell
#!bin/bash
printf "请输入密码"
echo ;
stty -echo
read password < /dev/tty
printf "请再输入一次"
echo ;
read password_2 < /dev/tty

stty echo
~           
```

###　历史上的三种grep　

![grep三种](assets/002/20180511-f053927b.png)  

grep命令　表格使用

![grep　表格](assets/002/20180511-bee348ee.png)  

## Unix 哲学

虽然win 占有大量份额，但是服务器还是unix 有优势，unix认为文件不应该和应用程序绑定：

![假设有意义的读取声音，另外添加插件](assets/002/20180514-b7067729.png)  






### 本节讲述linux后缀命名规范、五种文件类型

win中后缀名对应相应的文件，linux unix 后缀没有太大的影响，主要还是文件的属性，但是还是很有必要了解，并且对我们日常使用有帮助的。linux中的后缀只是说明文件与那个软件关联，不能说明一定能执行，这方面来说后缀名没有太大意义。

* 这里linux文件类型：普通文件、目录、字符设备文件、块设备文件、符号链接文件

```
如：ls lh
```

文件类型：
- 文件
d 文件夹（目录）
    mkdir/cp/rmdir
c 字符设备，或者块设备文件，比如moden等串口设备：如：dev/tty（c,字符设备文件，moden、串口等） 、dev/hdal(b,块设备文件，硬盘光驱等)
s 套接口文件 ：mysql启动，生成var/lib/mysql/mysql.sock 文件
l 符号链接文件
  ln -s 源文件  目标路径

### unix 准则 KISS ，keep it simple stupid！

Doug Mcilroy unix 管道发明人说过
* 让每个程序就做好一件事。新任务重新开始，不要原程序中加入新功能。
* 假定每个程序输出都会赐恒为零一个程序输入，哪怕程序是未知的。
* 输出中不要有无关的信息干扰。避免使用严格的分栏格式，二进制禁止输入，不要坚持使用交互式输入
* 对拙劣代码果断扔掉重写。几星期之内尽可能早的设计和编译的软件投入试用
* 工欲善其事，必先利其器

>哲学：  一个程序一件事，并做好；程序能协作；程序能处理文本流，已经是通用的接口了

* c 语言大师五条原则：

![五条原则](assets/002/20180514-05c2ff7b.png)  


## 第三章 再识变量

3.1 再识变量

变量类型区分的话，语言分为4类

![分为四类语言，按照变量分类的话](assets/002/20180514-975fd71e.png)  
案例：
```Shell

```

总结：
提到shell 中的各种操作，变量似乎被作为各种类型进行处理，假象这是，shell中一切变量都是字符串类型的。
并且shell是弱类型语言，有好处也有坏处，编程灵活但是养成糟糕编程习惯

### shell 中的三种变量

```
用户变量、位置变量、环境变量。
用户变量：编程中用的最多，位置变量在对参数判断和命令返回值判断是会用。环境变量使程序运行的时候需要设置。


```

#### 用户变量

* shell编程中定义的变量。分全局、局部变量。默认是shell变量为全局变量，local 定义局部变量

```
valname=value
注意：等号两边必须没有空格，unset 删除变量，正常不会这么做。如果unset ，shell遇到未定义的变量会返回错误，但是默认返回空字符串
```

linux shell 特殊字符

![linux shell特殊字符上](assets/002/20180514-8c2148f6.png)  
![linux shell特殊字符下](assets/002/20180514-84f8f25f.png)  


转移符相关例子，强引用，弱引用

![引用解释](assets/002/20180514-94becf9e.png)  


#### 强引用，弱引用


```
"" ：双引号，弱引用，里面可以使用 $变量名，引用变量
'':单引号，强引用，引号里面的原样输出

```

#### 3 变量与法真面目

```
$varname 实际上是 ${varname}简写。
1. 未知参数超过九个，第十个参数需要：${10},而不是$10
2. 如果ID后加上一个下划线，name shell试图带上下划线作为变量名:
例如：
echo $UID_ ，shell试图UID_作为变量名，变量命名规范中：可以一个字母或下划线符号开始，后面可以跟上任意长度的字母、数字、下划线。
所以可以 这么写：${UID}_

```

#### 字符串操作符

用途：

![字符串操作符用途](assets/002/20180514-03319927.png)  

![替换运算符](assets/002/20180514-5bd2f9dd.png)  

>上述冒号是可选的，如果有冒号，代表的意思是存在且非空，如果不加上冒号，则仅仅判断变量是否存在


#### 模式匹配

常用作切割路径名称：列入文件名后缀，和路径前缀

![模式匹配运算符](assets/002/20180514-625e1dc5.png)  

案例
```
echo ${PATH}

可以吧里面的：冒号换成换行符，打出环境变量容易观看

echo -e ${PATH//:/'\n'}
也可以使用sed

echo ${PATH} | sed 's/:/\n/g'


* 安例：提取符号前后字符

line='arg=123'
echo ${line%\=*}  # 注意这里=号前面的转移符可要可不要，亲测都可以用
结果：arg
echo ${line#*=}
结果:123


* 案例：获取字符串个数

line="123abc"
echo "这line 中有 ${#line}个字符"
```

#### 命令替换

```
`` 反引号，将命令的输出作为表达式
`pwd`


```

案例：
```
#!bin/bash
line=`pwd`
echo "$line"
```


#### 位置变量

直接引用参数 $0-$9 ，在此范围之外的需要 ${n}

获取文件名案例：
```
书本案例是： echo "${path#/#/*/}"
但是有问题。所以用了下面的
```

```Shell
#!bin/bash
function path_fun(){
 path=$1
 echo "文件名 ${path##/*/}"
 echo "去后缀名${path%%.*}"
 filename="获取文件名 ${path##/*/}"
 filename=${filename%%.*}
 echo "文件名 $filename"
}

path="/abc/def/a.txt.bc"
#echo ${path#}
path_fun $path

结果：
文件名 a.txt.bc
去后缀名/abc/def/a
文件名 获取文件名 a
```

* 特殊变量用的多的 ：$n,$#,$0,$?
这里给出了部分博主博客：

[博主1](https://blog.csdn.net/u011341352/article/details/53215180)
解释：
```
$n:第几个参数，准确应该是${n}
$# :脚本中参数的个数，获取传入了多少个参数
#0：脚本名称
#?: 上一条命令结束值,0成功，1失败
此外：
变量  含义  
$0      当前脚本的文件名  
$n      传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是$1，第二个参数是$2。  
$#      传递给脚本或函数的参数个数。  
$*      传递给脚本或函数的所有参数。  
$@      传递给脚本或函数的所有参数。被双引号(" ")包含时，与 $* 稍有不同，下面将会讲到。  
$?      上个命令的退出状态，或函数的返回值。一般情况下，大部分命令执行成功会返回 0，失败返回 1。  
$$      当前Shell进程ID。对于 Shell 脚本，就是这些脚本所在的进程ID。  


$* 和 $@ 的区别  
$* 和 $@ 都表示传递给函数或脚本的所有参数，不被双引号(" ")包含时，都以"$1" "$2" … "$n" 的形式输出所有参数。  
但是当它们被双引号(" ")包含时，"$*" 会将所有的参数作为一个整体，以"$1 $2 … $n"的形式输出所有参数；"$@" 会将各个参数分开，以"$1" "$2" … "$n" 的形式输出所有参数。  


```
# [#* #@ 差异：]
shell案例：

```Shell
#!/bin/bash  
echo "\$*=" $*  
echo "\"\$*\"=" "$*"  
echo "\$@=" $@  
echo "\"\$@\"=" "$@"  
echo "print each param from \$*"  
for var in $*  
do  
    echo "$var"  
done  
echo "print each param from \$@"  
for var in $@  
do  
    echo "$var"  
done  
echo "print each param from \"\$*\""  
for var in "$*"  
do  
    echo "$var"  
done  
echo "print each param from \"\$@\""  
for var in "$@"  
do  
    echo "$var"  
done  

执行 ./test.sh "a" "b" "c" "d"，看到下面的结果：  
$*=  a b c d  
"$*"= a b c d  
$@=  a b c d  
"$@"= a b c d  
print each param from $*  
a  
b  
c  
d  
print each param from $@  
a  
b  
c  
d  
print each param from "$*"  
a b c d  
print each param from "$@"  
a  
b  
c  
d  
说明：双引号包含时，"$*"的参数被当做一个整体，而"$@"还是遍历每一个参数  
```

#### grep 查找字符案例

![grep 查找字符案例](assets/002/20180515-2ae61bc3.png)  

```
其中：grep $1 $2 ;
在第 $2 中查找 $1 字符串
```
* shift 删除参数列表中的参数。也就是 执行了shift $1 将会被删除，$2 后面的参数将会依次顶上来，默认删除一个，加上参数可以指定删除参数个数

shift 案例

```
#!bin/bash

function grep_fun(){
  content="abc"
  while [ -e $1 ] ;
  do
   cat $1
   n=1
   if [ grep $1 $content ] then;
       echo "参数中有abc中的个字母，删除第${n}各参数"
       n=n+1
       shift
   elif
      echo "没有找到abc中的字母，不删除"
   fi    
  done
}

grep_fun

```




















1
