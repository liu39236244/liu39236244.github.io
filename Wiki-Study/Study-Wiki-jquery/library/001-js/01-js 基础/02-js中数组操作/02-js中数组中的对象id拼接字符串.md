# js数组中对象拼接字符串



## 案例

```js
代码部分：

var obj=[
    {id:1,name:'张三'},
    {id:2,name:'李四'},
    {id:3,name:'王五'},
    {id:4,name:'赵六'},
];

var str="";

str=obj.map(function(elem,index){
    return elem.id;
}).join(",");
console.log(str);

str="";
for(let i=0,j=obj.length;i<j;i++){
    str+=obj[i].id+",";
}
str=str.substring(0,str.length-1);
console.log(str);
```