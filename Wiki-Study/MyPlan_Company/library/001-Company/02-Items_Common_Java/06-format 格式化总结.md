# format 格式化工具


# decimail format

## decimal 使用

原文地址：https://blog.csdn.net/kjfcpua/article/details/4240486

* decimal
```
DecimalFormat的主要功能：

DecimalFormat 是 NumberFormat 的一个具体子类，用于格式化十进制数字。该类设计有各种功能，使其能够分析和格式化任意语言环境中的数，包括对西方语言、阿拉伯语和印度语数字的支持。它还支持不同类型的数，包括整数 (123)、定点数 (123.4)、科学记数法表示的数 (1.23E4)、百分数 (12%) 和金额 ($123)。所有这些内容都可以本地化。

DecimalFormat 包含一个模式 和一组符号



符号含义：

 0      一个数字

 #      一个数字，不包括 0

 .      小数的分隔符的占位符

 ,      分组分隔符的占位符

 ;      分隔格式。

 -      缺省负数前缀。

 %      乘以 100 和作为百分比显示

 ?      乘以 1000 和作为千进制货币符显示；用货币符号代替；如果双写，用

         国际货币符号代替。如果出现在一个模式中，用货币十进制分隔符代

         替十进制分隔符。

 X      前缀或后缀中使用的任何其它字符，用来引用前缀或后缀中的特殊字符。





例子：

DecimalFormat df1 = new DecimalFormat("0.0");

        DecimalFormat df2 = new DecimalFormat("#.#");

        DecimalFormat df3 = new DecimalFormat("000.000");

        DecimalFormat df4 = new DecimalFormat("###.###");



        System.out.println(df1.format(12.34));

        System.out.println(df2.format(12.34));

        System.out.println(df3.format(12.34));

        System.out.println(df4.format(12.34));

结果：

12.3

12.3

012.340

12.34





DecimalFormat format = new DecimalFormat("###,####.000");

       System.out.println(format.format(111111123456.1227222));



       Locale.setDefault(Locale.US);

       DecimalFormat usFormat = new DecimalFormat("###,###.000");

       System.out.println(usFormat.format(111111123456.1227222));



       DecimalFormat addPattenFormat = new DecimalFormat();

       addPattenFormat.applyPattern("##,###.000");

                                         System.out.println(addPattenFormat.format(111111123456.1227));



       DecimalFormat zhiFormat = new DecimalFormat();

       zhiFormat.applyPattern("0.000E0000");

       System.out.println(zhiFormat.format(10000));

       System.out.println(zhiFormat.format(12345678.345));



       DecimalFormat percentFormat = new DecimalFormat();

       percentFormat.applyPattern("#0.000%");

       System.out.println(percentFormat.format(0.3052222));





       结果

       1111,1112,3456.123

111,111,123,456.123

111,111,123,456.123

1.000E0004

1.235E0007

30.522%





如果使用具有多个分组字符的模式，则最后一个分隔符和整数结尾之间的间隔才是使用的分组大小。所以 "#,##,###,####" == "######,####" == "##,####,####"。

```
