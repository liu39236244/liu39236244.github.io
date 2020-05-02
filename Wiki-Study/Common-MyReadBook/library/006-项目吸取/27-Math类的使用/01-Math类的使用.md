# Math 类的使用

## Math 的常用方法

### math.ceil math.floor  math.surround


```
1.Math.round()：根据“round”的字面意思“附近、周围”，可以猜测该函数是求一个附近的整数，看下面几个例子就明白。

小数点后第一位<5
正数：Math.round(11.46)=11
负数：Math.round(-11.46)=-11

小数点后第一位>5
正数：Math.round(11.68)=12
负数：Math.round(-11.68)=-12

小数点后第一位=5
正数：Math.round(11.5)=12
负数：Math.round(-11.5)=-11
总结：（小数点后第一位）大于五全部加，等于五正数加，小于五全不加。


2.Math.ceil()：根据“ceil”的字面意思“天花板”去理解；
例如：
Math.ceil(11.46)=Math.ceil(11.68)=Math.ceil(11.5)=12
Math.ceil(-11.46)=Math.ceil(-11.68)=Math.ceil(-11.5)=-11

3.Math.floor()：根据“floor”的字面意思“地板”去理解；
例如：
Math.floor(11.46)=Math.floor(11.68)=Math.floor(11.5)=11
Math.floor(-11.46)=Math.floor(-11.68)=Math.floor(-11.5)=-12

```


##
