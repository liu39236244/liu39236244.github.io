# Promise 方法解决




## 总结

### Promise 功能使用介绍

[ES6---new Promise()使用方法](https://blog.csdn.net/qq_40792800/article/details/105860758?spm=1001.2101.3001.6650.1&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-105860758-blog-127206265.235%5Ev29%5Epc_relevant_default_base3&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7ERate-1-105860758-blog-127206265.235%5Ev29%5Epc_relevant_default_base3&utm_relevant_index=2)




### Promise实现

```js
function2(){
  // 你的逻辑代码 
  return Promise.resolve(/* 这里是需要返回的数据*/)
}
 
function3(){
  // 你的逻辑代码 
  return Promise.resolve(/* 这里是需要返回的数据*/)
}
 
// 调用
function1(){
  this.function2().then(val => { 
    this.function3();
  });
}
```



## 参考

*  Promise.resolve : https://www.jb51.net/article/146265.htm


* promise 方式解决异步：

https://www.jianshu.com/p/631f9406c4e0 


* 1 promise 方式



```js
// promise.js
const fs = require("fs");
const read = function(fileName){
    return new Promise((resolve,reject)=>{
        fs.readFile(fileName,(err,data)=>{
            if (err) {
                reject(err);
            } else{
                resolve(data);
            }
        });
    });
};
read('1.txt').then(res=>{
    console.log(res.toString());
    return read('2.txt');  // 返回新的数据，然后输出
}).then(res => {
    console.log(res.toString());
    return read('3.txt');
}).then(res => {
    console.log(res.toString());
});
```


* generator 函数


```js

// generator.js
const fs = require("fs");
const read = function(fileName){
    return new Promise((resolve,reject)=>{
        fs.readFile(fileName,(err,data)=>{
            if (err) {
                reject(err);
            } else{
                resolve(data);
            }
        });
    });
};
function * show(){
    yield read('1.txt');
    yield read('2.txt');
    yield read('3.txt');
}
const s = show();
s.next().value.then(res => {
    console.log(res.toString());
    return s.next().value;
}).then(res => {
    console.log(res.toString());
    return s.next().value;
}).then(res => {
    console.log(res.toString());
});
```

* async 读取

```js
const fs = require("fs");
const read = function(fileName){
    return new Promise((resolve,reject)=>{
        fs.readFile(fileName,(err,data)=>{
            if (err) {
                reject(err);
            } else{
                resolve(data);
            }
        });
    });
};
async function readByAsync(){
    let a1 = await read('1.txt');
    let a2 = await read('2.txt');
    let a3 = await read('3.txt');
    console.log(a1.toString());
    console.log(a2.toString());
    console.log(a3.toString());
}
readByAsync();
```

