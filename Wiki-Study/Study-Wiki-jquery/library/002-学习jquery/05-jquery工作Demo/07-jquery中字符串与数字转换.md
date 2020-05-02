# jquery 中字符串与数字的转换


## jquery 中字符串与数字转换


```
其实在jquery里把字符串转换为数字，用的还是js，因为jquery本身就是用js封装编写的。

比如我们在用jquery里的ajax来更新文章的阅读次数或人气的时候，就需要用到字符串转换为数字的功能了，

先来看看JS里把字符串转换为数字的函数命令：

1：parseInt(string) ： 这个函数的功能是从string的开头开始解析，返回一个整数，说起来比较笼统，下面来看几个实例，大家就明白了：

parseInt("1234blue"); //returns 1234
parseInt("123"); //returns 123
parseInt("22.5"); //returns 22
parseInt("blue"); //returns NaN
 
//另外parseInt()方法还有基模式，就是可以把二进制、八进制、十六进制或其他任何进制的字符串转换成整数。基是由parseInt()方法的第二个参数指定的，示例如下：
parseInt("AF", 16); //returns 175
parseInt("10", 2); //returns 2
parseInt("10", 8); //returns 8
parseInt("10", 10); //returns 10
 
如果十进制数包含前导0，那么最好采用基数10，这样才不会意外地得到八进制的值。例如：
parseInt("010"); //returns 8
parseInt("010", 8); //returns 8
parseInt("010", 10); //returns 10
2:parseFloat()：这个函数与parseInt()方法的处理方式相似。
使用parseFloat()方法的另一不同之处在于，字符串必须以十进制形式表示浮点数，parseFloat()没有基模式。


parseFloat("1234blue"); //returns 1234.0
parseFloat("0xA"); //returns NaN
parseFloat("22.5"); //returns 22.5
parseFloat("22.34.5"); //returns 22.34
parseFloat("0908"); //returns 908
parseFloat("blue"); //returns NaN
3：Number()：强制类型转换，与parseInt()和parseFloat()方法的处理方式相似，只是它转换的是整个值，而不是部分值。

Number(false) 0
Number(true) 1
Number(undefined) NaN
Number(null) 0
Number( "5.5 ") 5.5
Number( "56 ") 56
Number( "5.6.7 ") NaN
Number(new Object()) NaN
Number(100) 100   
 

 

在此有一个求和的js

 

Javascript
<!DOCTYPE html>
<html>
 <head>
  <title> 事件</title>  
  <script type="text/javascript">
   function count(){
    var res=0;
    //获取第一个输入框的值
    var firnum = parseInt(document.getElementById("txt1").value);   
	//获取第二个输入框的值
    var secnum = parseInt(document.getElementById("txt2").value);
	//获取选择框的值
    var sel = document.getElementById("select").value;
	//获取通过下拉框来选择的值来改变加减乘除的运算法则
    switch(sel)
        {
        case '+':
            res = firnum + secnum;
            break;
        case '-':
            res = firnum - secnum;
            break;
        case '*':
            res = firnum * secnum;
            break;
        case '/':
            res = firnum / secnum;
            break;
        }    
    //设置结果输入框的值 
    document.getElementById("fruit").value = res;
   }
  </script> 
 </head> 
 <body>
   <input type='text' id='txt1' /> 
   <select id='select'>
		<option value='+'>+</option>
		<option value="-">-</option>
		<option value="*">*</option>
		<option value="/">/</option>
   </select>
   <input type='text' id='txt2' /> 
   <input type='button' value=' = ' onClick = "count()" /> <!--通过 = 按钮来调用创建的函数，得到结果--> 
   <input type='text' id='fruit' />   
 </body>
</html>

```


## jquery中数字保留两位小数


```
//保留两位小数
function intToFloat(val){
	return new Number(val).toFixed(2);
}

```
