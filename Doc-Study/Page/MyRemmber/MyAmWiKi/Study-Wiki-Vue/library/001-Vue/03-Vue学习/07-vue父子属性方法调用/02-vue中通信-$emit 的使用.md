# vue 中emit 的使用


# $emit 总结


3.通过$emit 实现通信

上面两种示例(prop/ref 两种方式)主要都是父组件向子组件通信，而通过$emit 实现子组件向父组件通信。
对于$emit官网上也是解释得也不太清楚

vm.$emit( event, arg )

$emit 绑定一个自定义事件event，当这个这个语句被执行到的时候，就会将参数arg传递给父组件，父组件通过@event监听并接收参数。

```html
<template>
 <div>
 <h1>{{title}}</h1>
 <child @getMessage="showMsg"></child>
 </div>
</template>

<script>
 import Child from '../components/child.vue'
 export default {
 components: {Child},
 data(){
  return{
  title:''
  }
 },
 methods:{
  showMsg(title){
  this.title=title;
  }
 }
 }
</script>
<template>
 <h3>我是子组件！</h3>
</template>
<script>
 export default {
 mounted: function () {
  this.$emit('getMessage', '我是父组件！')
 }
 }
</script>
```

# $emit 博主总结

## 博主记录

* 1

[详细简介实例,prop,$emit,$ref](https://www.jb51.net/article/140581.htm)

```
组件间如何通信，也就成为了vue中重点知识了。这篇文章将会通过props、$ref和 $emit 这几个知识点，来讲解如何实现父子组件间通信。
```


[组件嵌套以及事件](https://www.jianshu.com/p/ad22c84a8a87)