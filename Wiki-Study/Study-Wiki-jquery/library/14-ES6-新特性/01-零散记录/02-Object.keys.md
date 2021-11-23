# Object.keys

一、语法

Object.keys(obj)

参数：要返回其枚举自身属性的对象

返回值：一个表示给定对象的所有可枚举属性的字符串数组


二、处理对象，返回可枚举的属性数组

let person = {name:"张三",age:25,address:"深圳",getName:function(){}}

Object.keys(person) // ["name", "age", "address","getName"]


![](assets/14/01/02-1637566706377.png)


三、处理数组，返回索引值数组

let arr = [1,2,3,4,5,6]

Object.keys(arr) // ["0", "1", "2", "3", "4", "5"]

![](assets/14/01/02-1637566717860.png)


四、处理字符串，返回索引值数组

let str = "saasd字符串"

Object.keys(str) // ["0", "1", "2", "3", "4", "5", "6", "7"]

![](assets/14/01/02-1637566733502.png)

五、常用技巧

let person = {name:"张三",age:25,address:"深圳",getName:function(){}}

Object.keys(person).map((key)=>{

　　person[key] // 获取到属性对应的值，做一些处理

}) 

六、Object.values()和Object.keys()是相反的操作，把一个对象的值转换为数组