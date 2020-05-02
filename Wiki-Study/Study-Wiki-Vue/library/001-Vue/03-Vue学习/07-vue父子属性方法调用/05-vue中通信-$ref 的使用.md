# vue 中 $ref 的使用


# 总结

ref 是被用来给元素或子组件注册引用信息的。引用信息将会注册在父组件的 $refs 对象上。
如果ref用在子组件上，指向的是组件实例，可以理解为对子组件的索引，通过$ref可能获取到在子组件里定义的属性和方法。
如果ref在普通的 DOM 元素上使用，引用指向的就是 DOM 元素，通过$ref可能获取到该DOM 的属性集合，轻松访问到DOM元素，作用与JQ选择器类似。
那如何通过$ref 实现通信？下面我将上面prop实现的功能，用$ref实现一遍：


```html
<!-- 父组件 -->

<template>
 <div>
 <h1>我是父组件！</h1>
 <child ref="msg"></child>
 </div>
</template>

<script>
 import Child from '../components/child.vue'
 export default {
 components: {Child},
 mounted: function () {
  console.log( this.$refs.msg);
  this.$refs.msg.getMessage('我是子组件一！')
 }
 }
</script>

 <!-- 子组件 -->

<template>
 <h3>{{message}}</h3>
</template>
<script>
 export default {
 data(){
  return{
  message:''
  }
 },
 methods:{
  getMessage(m){
  this.message=m;
  }
 }
 }
</script>
```

从上面的代码我们可以发现，通过ref=‘msg'可以将子组件child的实例指给$ref，并且通过.msg.getMessage（）调用到子组件的getMessage方法，将参数传递给子组件。下面是“ console.log( this.$refs.msg);”打印出来的内容，这可以让大家更加了解，究竟通过ref我们获取了什么：

这里再补充一点就是，prop和$ref之间的区别：

prop 着重于数据的传递，它并不能调用子组件里的属性和方法。像创建文章组件时，自定义标题和内容这样的使用场景，最适合使用prop。
$ref 着重于索引，主要用来调用子组件里的属性和方法，其实并不擅长数据传递。而且ref用在dom元素的时候，能使到选择器的作用，这个功能比作为索引更常有用到。


# 博主


# 引用

## 引用过的博主
[脚本之家](https://www.jb51.net/article/140581.htm)

