# shell 里面的注释


### 快注释
```
方法一

: '
被注释的多行内容
'



方法二

:<<eof
被注释的多行内容
eof



方法三

:<<!
被注释的多行内容
!



方法四

 if false ; then
    被注释的多行内容
 fi



不能如下使用：

 if false ; then
    #被注释的多行内容    不能加#
 fi
```
