# Bigdecimal 进位使用

## 总结

[参考博客：关于【BigDecimal】和Mysql中的decimal](https://blog.csdn.net/chenpp666/article/details/124372731)


## 参考

https://blog.csdn.net/qq_39101581/article/details/78624617


```
1. BigDecimal num1 = new BigDecimal(2.225667);//这种写法不允许，会造成精度损失

2. BigDecimal num2 = new BigDecimal(2);//这种写法是可以的

3. BigDecimal num = new BigDecimal("2.225667");//一般都会这样写最好

4. int count = num.scale();

        System.out.println(count);//6 返回的是小数点后位数



好了，下面开始正式介绍知识点啦~~~~~~



1. ROUND_DOWN

BigDecimal b = new BigDecimal("2.225667").setScale(2, BigDecimal.ROUND_DOWN);
System.out.println(b);//2.22 直接去掉多余的位数



2. ROUND_UP

BigDecimal c = new BigDecimal("2.224667").setScale(2, BigDecimal.ROUND_UP);
System.out.println(c);//2.23 跟上面相反，进位处理



3. ROUND_CEILING

天花板（向上），正数进位向上，负数舍位向上

BigDecimal f = new BigDecimal("2.224667").setScale(2, BigDecimal.ROUND_CEILING);
System.out.println(f);//2.23 如果是正数，相当于BigDecimal.ROUND_UP
 
BigDecimal g = new BigDecimal("-2.225667").setScale(2, BigDecimal.ROUND_CEILING);
System.out.println(g);//-2.22 如果是负数，相当于BigDecimal.ROUND_DOWN



4. ROUND_FLOOR

地板（向下），正数舍位向下，负数进位向下

BigDecimal h = new BigDecimal("2.225667").setScale(2, BigDecimal.ROUND_FLOOR);
System.out.println(h);//2.22 如果是正数，相当于BigDecimal.ROUND_DOWN
		
BigDecimal i = new BigDecimal("-2.224667").setScale(2, BigDecimal.ROUND_FLOOR);
System.out.println(i);//-2.23 如果是负数，相当于BigDecimal.ROUND_HALF_UP



5. ROUND_HALF_UP

BigDecimal d = new BigDecimal("2.225").setScale(2, BigDecimal.ROUND_HALF_UP);
System.out.println("ROUND_HALF_UP"+d); //2.23  四舍五入（若舍弃部分>=.5，就进位）



6. ROUND_HALF_DOWN

BigDecimal e = new BigDecimal("2.225").setScale(2, BigDecimal.ROUND_HALF_DOWN);
System.out.println("ROUND_HALF_DOWN"+e);//2.22  四舍五入（若舍弃部分>.5,就进位）



7. ROUND_HALF_EVEN

BigDecimal j = new BigDecimal("2.225").setScale(2, BigDecimal.ROUND_HALF_EVEN);
System.out.println(j);//2.22 如果舍弃部分左边的数字为偶数，则作   ROUND_HALF_DOWN 
		
BigDecimal k = new BigDecimal("2.215").setScale(2, BigDecimal.ROUND_HALF_EVEN);
System.out.println(k);//2.22 如果舍弃部分左边的数字为奇数，则作   ROUND_HALF_UP
		
		
	System.out.println("************************************");
		
	System.out.println("4.05: "+new BigDecimal("4.05").setScale(1, BigDecimal.ROUND_HALF_EVEN));//4.05: 4.0  down
	System.out.println("4.15: "+new BigDecimal("4.15").setScale(1, BigDecimal.ROUND_HALF_EVEN));//4.15: 4.2  up
	System.out.println("4.25: "+new BigDecimal("4.25").setScale(1, BigDecimal.ROUND_HALF_EVEN));//4.25: 4.2  down
	System.out.println("4.35: "+new BigDecimal("4.35").setScale(1, BigDecimal.ROUND_HALF_EVEN));//4.35: 4.4  up
	System.out.println("4.45: "+new BigDecimal("4.45").setScale(1, BigDecimal.ROUND_HALF_EVEN));//4.45: 4.4  down
	System.out.println("4.55: "+new BigDecimal("4.55").setScale(1, BigDecimal.ROUND_HALF_EVEN));//4.55: 4.6  up
	System.out.println("4.65: "+new BigDecimal("4.65").setScale(1, BigDecimal.ROUND_HALF_EVEN));//4.65: 4.6  down
		
	System.out.println("3.05: "+new BigDecimal("3.05").setScale(1, BigDecimal.ROUND_HALF_EVEN));//3.05: 3.0  down
	System.out.println("3.15: "+new BigDecimal("3.15").setScale(1, BigDecimal.ROUND_HALF_EVEN));//3.15: 3.2  up
	System.out.println("3.25: "+new BigDecimal("3.25").setScale(1, BigDecimal.ROUND_HALF_EVEN));//3.25: 3.2  down
	System.out.println("3.35: "+new BigDecimal("3.35").setScale(1, BigDecimal.ROUND_HALF_EVEN));//3.35: 3.4  up
	System.out.println("3.45: "+new BigDecimal("3.45").setScale(1, BigDecimal.ROUND_HALF_EVEN));//3.45: 3.4  down
	System.out.println("3.55: "+new BigDecimal("3.55").setScale(1, BigDecimal.ROUND_HALF_EVEN));//3.55: 3.6  up
	System.out.println("3.65: "+new BigDecimal("3.65").setScale(1, BigDecimal.ROUND_HALF_EVEN));//3.65: 3.6  down



8.ROUND_UNNECESSARY
BigDecimal l = new BigDecimal("2.215").setScale(3, BigDecimal.ROUND_UNNECESSARY);
System.out.println(l);
//断言请求的操作具有精确的结果，因此不需要舍入。
//如果对获得精确结果的操作指定此舍入模式，则抛出ArithmeticException。
```




```
{
	"updateBridge":false,
	"updatedevice":false,
	"updateSensor":false,
	"updateProbe":false,
	"updateProbeFormula":false,
	"probeTypeChild":false,
}
```


