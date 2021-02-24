# 四舍五入取整


## java 中四舍五入

```
JAVA取整以及四舍五入
下面来介绍将小数值舍入为整数的几个方法：Math.ceil()、Math.floor()和Math.round()。 这三个方法分别遵循下列舍入规则：
Math.ceil()执行向上舍入，即它总是将数值向上舍入为最接近的整数；
Math.floor()执行向下舍入，即它总是将数值向下舍入为最接近的整数；

Math.round()执行标准舍入，即它总是将数值四舍五入为最接近的整数(这也是我们在数学课上学到的舍入规则)。

Math.ceil(25.9) //26

Math.ceil(25.5) //26

Math.ceil(25.1) //26

Math.ceil(25.0)
//25

Math.round(25.9) //26

Math.round(25.5) //26

Math.round(25.1) //25

Math.floor(25.9) //25

Math.floor(25.5) //25

Math.floor(25.1) //25

```


* bigdecimal 取整

```java
import java.math.BigDecimal; //引入这个包

public class Test {
 public static void main(String[] args) {

  double i = 3.856;

  // 舍掉小数取整
  System.out.println("舍掉小数取整:Math.floor(3.856)=" + (int) Math.floor(i));

  // 四舍五入取整
  System.out.println("四舍五入取整:(3.856)="
    + new BigDecimal(i).setScale(0, BigDecimal.ROUND_HALF_UP));

  // 四舍五入保留两位小数
  System.out.println("四舍五入取整:(3.856)="
    + new BigDecimal(i).setScale(2, BigDecimal.ROUND_HALF_UP));

  // 凑整，取上限
  System.out.println("凑整:Math.ceil(3.856)=" + (int) Math.ceil(i));

  // 舍掉小数取整
  System.out.println("舍掉小数取整:Math.floor(-3.856)=" + (int) Math.floor(-i));
  // 四舍五入取整
  System.out.println("四舍五入取整:(-3.856)="
    + new BigDecimal(-i).setScale(0, BigDecimal.ROUND_HALF_UP));

  // 四舍五入保留两位小数
  System.out.println("四舍五入取整:(-3.856)="
    + new BigDecimal(-i).setScale(2, BigDecimal.ROUND_HALF_UP));

  // 凑整，取上限
  System.out.println("凑整(-3.856)=" + (int) Math.ceil(-i));
 }

}

```




## js中四舍五入


```java
js只保留整数，向上取整，四舍五入，向下取整等函数
1.丢弃小数部分,保留整数部分
parseInt(5/2)

2.向上取整,有小数就整数部分加1

Math.ceil(5/2)

3,四舍五入.

Math.round(5/2)

4,向下取整

Math.floor(5/2)

Math 对象的方法
方法 描述
abs(x) 返回数的绝对值
acos(x) 返回数的反余弦值
asin(x) 返回数的反正弦值
atan(x) 以介于 -PI/2 与 PI/2 弧度之间的数值来返回 x 的反正切值
atan2(y,x) 返回从 x 轴到点 (x,y) 的角度（介于 -PI/2 与 PI/2 弧度之间）
ceil(x) 对一个数进行上舍入。
cos(x) 返回数的余弦
exp(x) 返回 e 的指数。
floor(x) 对一个数进行下舍入。
log(x) 返回数的自然对数（底为e）
max(x,y) 返回 x 和 y 中的最高值
min(x,y) 返回 x 和 y 中的最低值
pow(x,y) 返回 x 的 y 次幂
random() 返回 0 ~ 1 之间的随机数
round(x) 把一个数四舍五入为最接近的整数
sin(x) 返回数的正弦
sqrt(x) 返回数的平方根
tan(x) 返回一个角的正切
toSource() 代表对象的源代码
valueOf() 返回一个 Math 对象的原始值
 

js 四舍五入函数 toFixed（），里面的参数 就是保留小数的位数。
```