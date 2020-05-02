# filter 在js 中的使用


## filter 介绍

* [博主](https://www.cnblogs.com/qiu2841/p/8961017.html)

filter()方法使用指定的函数测试所有元素，并创建一个包含所有通过测试的元素的新数组。
filter()基本语法：
       arr.filter(callback[, thisArg])

 　　filter()参数介绍：
   　　 参数名    说明
   　　 callback   用来测试数组的每个元素的函数。调用时使用参数 (element, index, array)
    　　返回true表示保留该元素（通过测试），false则不保留。
    　　thisArg    可选。执行 callback 时的用于 this 的值。

　　filter()用法说明：

　　　　filter 为数组中的每个元素调用一次 callback 函数，并利用所有使得 callback 返回 true 或 等价于 true 的值 的元素创建一个新数组。
　　　　callback 只会在已经赋值的索引上被调用，对于那些已经被删除或者从未被赋值的索引不会被调用。那些没有通过 callback 测试的元素会被跳过，不会被包含在新数组中。

　　　　callback 被调用时传入三个参数：

　　　　元素的值
　　　　元素的索引
　　　　被遍历的数组
　　　　如果为 filter 提供一个 thisArg 参数，则它会被作为 callback 被调用时的 this 值。否则，callback 的this 值在非严格模式下将是全局对象，严格模式下为 undefined。

　　　　filter 不会改变原数组。

　　　　filter 遍历的元素范围在第一次调用 callback 之前就已经确定了。在调用 filter 之后被添加到数组中的元素不会被 filter 遍历到。
　　　　如果已经存在的元素被改变了，则他们传入 callback 的值是 filter 遍历到它们那一刻的值。被删除或从来未被赋值的元素不会被遍历到。

示例：
/*
filter()实例：筛选排除掉所有的小值​

下例使用 filter 创建了一个新数组，该数组的元素由原数组中值大于 10 的元素组成。

*/

function isBigEnough(element) {
return element >= 10;
}
var filtered = [12, 5, 8, 130, 44].filter(isBigEnough);

console.log(filtered);//[ 12, 130, 44 ]

 

 

/*
　　filter()兼容旧环境
　　filter 被添加到 ECMA-262 标准第 5 版中，因此在某些实现环境中不被支持。可以把下面的代码插入到脚本的开头来解决此问题，
　　该代码允许在那些没有原生支持 filter 的实现环境中使用它。该算法是 ECMA-262 第 5 版中指定的算法
*/

Array.prototype.filter = Array.prototype.filter || function(func) {
var arr = this;
var r = [];
for (var i = 0; i < arr.length; i++) {
if (func(arr[i],i,arr)) {
r.push(arr[i]);
}
}
return r;
}

## 总结


## 博主记录

### 介绍

