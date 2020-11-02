# oracle 函数

## Oracle Decode 函数使用

DECODE 中的if-then-else逻辑
在逻辑编程中，经常用到If – Then –Else 进行逻辑判断。在DECODE的语法中，实际上就是这样的逻辑处理过程。它的语法如下：
DECODE(value, if1, then1, if2,then2, if3,then3, . . . else )
Value 代表某个表的任何类型的任意列或一个通过计算所得的任何结果。当每个value值被测试，如果value的值为if1，Decode 函数的结果是then1；如果value等于if2，Decode函数结果是then2；等等。事实上，可以给出多个if/then 配对。如果value结果不等于给出的任何配对时，Decode 结果就返回else 。
需要注意的是，这里的if、then及else 都可以是函数或计算表达式。
含义解释：
DECODE(条件,值1,翻译值1,值2,翻译值2,...值n,翻译值n,缺省值)
该函数的含义如下：
IF 条件=值1 THEN
RETURN(翻译值1)
ELSIF 条件=值2 THEN
RETURN(翻译值2)
......
ELSIF 条件=值n THEN
RETURN(翻译值n)

ELSE
RETURN(缺省值)
END IF