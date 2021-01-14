# js中JSON处理


## 总结

参考博客：JS字符串转换为JSON的四种方法笔记
1、jQuery插件支持的转换方式： 


示例：

 $.parseJSON( jsonstr ); //jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象 

2、浏览器支持的转换方式(Firefox，chrome，opera，safari，ie)等浏览器：



示例：注意此方式也可以作为深拷贝进行页面之间的传值使用；

JSON.parse(jsonstr); //可以将json字符串转换成json对象 

JSON.stringify(jsonobj); //可以将json对象转换成json对符串 


注：ie8(兼容模式),ie7和ie6没有JSON对象，推荐采用JSON官方的方式，引入json.js。 

3、Javascript支持的转换方式： 

eval('(' + jsonstr + ')'); //可以将json字符串转换成json对象,注意需要在json字符外包裹一对小括号 

 注：ie8(兼容模式),ie7和ie6也可以使用eval()将字符串转为JSON对象，但不推荐这些方式，这种方式不安全eval会执行json串中的表达式。 


4、JSON官方的转换方式： 


http://www.json.org/提供了一个json.js,这样ie8(兼容模式),ie7和ie6就可以支持JSON对象以及其stringify()和parse()方法； 

可以在https://github.com/douglascrockford/JSON-js上获取到这个js，一般现在用json2.js。