# jquery js 中的循环遍历


## js的 forEach ,jquery 中的 each


```java
　　对于遍历数组的元素，js和jquery都有类似的方法，js用的是forEach而jquery用的是each，简单举例;

var arr = new Array(["b", 2, "a", 4],["c",3,"d",6]);
arr.forEach(function(item){
    alert(item);  //b, 2, a, 4和c,3,d,6

});
　　如果forEach里的回调函数只有一个参数则代表该集合里的元素;

 

复制代码
var arr = new Array(["b", 2, "a", 4],["c",3,"d",6]);
arr.forEach(function(item, i){
    alert(item+"-"+i);  //b, 2, a, 4-1和c,3,d,6-2;
　　item.forEach(function(items, j){
　　　　alert(items+"---------"+j); //b------0;2-------1;a----2;4------3;    c-----0;3-----1;d----2;6----3
　　});
});
复制代码
 　如果forEach里有两个参数，则第一个参数为该集合里的元素，第二个参数为集合的索引;

 

　　在jquery里则不同;

var arr = new Array(["b", 2, "a", 4],["c",3,"d",6]);
$.each(arr, function(item){
    alert(item);  //0;1
});
 如果回调函数里只有一个参数时，则为集合的索引;

 

复制代码
var arr = new Array(["b", 2, "a", 4],["c",3,"d",6]);
$.each(arr, function(i, item){
    alert(item+"-"+i);  //b, 2, a, 4-1和c,3,d,6-2;
　  $.each(item, function(j, items){
　　　　alert(items+"---------"+j); //b------0;2-------1;a----2;4------3;    c-----0;3-----1;d----2;6----3
　　});
});
复制代码
　　如果有两个参数，则第一个为索引，第二个该集合里的元素;
```

