# linux 中$+符号


# linux $ 所有参数

## 所有参数简述

```
例如，$ 表示当前Shell进程的ID，即pid，看下面的代码：

    $echo $$

运行结果

29949


特殊变量列表

变量
含义

$0
当前脚本的文件名

$n
传递给脚本或函数的参数。n 是一个数字，表示第几个参数。例如，第一个参数是$1，第二个参数是$2。

$#
传递给脚本或函数的参数个数。

$*
传递给脚本或函数的所有参数。

$@
传递给脚本或函数的所有参数。被双引号(" ")包含时，与 $* 稍有不同，下面将会讲到。

$?
上个命令的退出状态，或函数的返回值。注意这如果需要在shell 中使用，那么 需要直接使用
if [ $? = 0 ]
如果赋值给了一个变量可以用-eq
result=$?
if [ $? -eq 0 ]

$$
当前Shell进程ID。对于 Shell 脚本，就是这些脚本所在的进程ID。

$!
执行上一个背景指令的PID(后台运行的最后一个进程的进程ID号)
```

## linux $+符号

$?
代表上一个命令返回的结果：0 代表成功， 2 代表失败
```shell
if [ $? -ne 0 ]
then
#脚本不正常退出
exit 1
fi
```

## $* $@ 的区别

```
$* 和 $@ 的区别
$* 和 $@ 都表示传递给函数或脚本的所有参数，不被双引号(" ")包含时，都以"$1" "$2" … "$n" 的形式输出所有参数。
但是当它们被双引号(" ")包含时，"$*" 会将所有的参数作为一个整体，以"$1 $2 … $n"的形式输出所有参数；"$@" 会将各个参数分开，以"$1" "$2" … "$n" 的形式输出所有参数。
下面的例子可以清楚的看到 $* 和 $@ 的区别：

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

退出状态
$? 可以获取上一个命令的退出状态。所谓退出状态，就是上一个命令执行后的返回结果。
退出状态是一个数字，一般情况下，大部分命令执行成功会返回 0，失败返回 1。
不过，也有一些命令返回其他值，表示不同类型的错误。
下面例子中，命令成功执行：

$./test.sh Zara Ali
File Name : ./test.sh
First Parameter : Zara
Second Parameter : Ali
Quoted Values: Zara Ali
Quoted Values: Zara Ali
Total Number of Parameters : 2
$echo $?
0
$

```
