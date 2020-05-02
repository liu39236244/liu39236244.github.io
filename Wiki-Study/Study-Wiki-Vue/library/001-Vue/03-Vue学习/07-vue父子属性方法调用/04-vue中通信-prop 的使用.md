# vue 中prop 的使用


# 中prop 介绍

## 我的 

1.通过prop实现通信

子组件的props选项能够接收来自父组件数据。没错，仅仅只能接收，props是单向绑定的，即只能父组件向子组件传递，不能反向。而传递的方式也分为两种：

（1）静态传递

子组件通过props选项来声明一个自定义的属性，然后父组件就可以在嵌套标签的时候，通过这个属性往子组件传递数据了。


```html
 <!-- 父组件 -->

<template>
 <div>
 <h1>我是父组件！</h1>
 <child message="我是子组件一！"></child> //通过自定义属性传递数据
 </div>
</template>

<script>
import Child from '../components/child.vue'
export default {
 components: {Child},
}
</script>

 <!-- 子组件 -->

<template>
 <h3>{{message}}</h3>
</template>
<script>
 export default {
 props: ['message'] //声明一个自定义的属性
 }
</script>


```

（2）动态传递

我们已经知道了可以像上面那样给 props 传入一个静态的值，但是我们更多的情况需要动态的数据。这时候就可以用 v-bind 来实现。通过v-bind绑定props的自定义的属性，传递去过的就不是静态的字符串了，它可以是一个表达式、布尔值、对象等等任何类型的值。


```html
<!-- 父组件 -->

<template>
 <div>
 <h1>我是父组件！</h1>
 <child message="我是子组件一！"></child>

 <!-- 这是一个 JavaScript 表达式而不是一个字符串。-->
 <child v-bind:message="a+b"></child>

 <!-- 用一个变量进行动态赋值。-->
 <child v-bind:message="msg"></child>
 </div>
</template>

<script>
import Child from '../components/child.vue'
export default {
 components: {Child},
 data() {
 return {
  a:'我是子组件二！',
  b:112233,
  msg: '我是子组件三！'+ Math.random()
 }
 }
}
</script>
 <!-- 子组件 -->

<template>
 <h3>{{message}}</h3>
</template>
<script>
 export default {
 props: ['message']
 }
</script>
```

## 总结的



# 中prop 博主总结

## 博主记录

* 1

[详细简介实例,prop,$emit,$ref](https://www.jb51.net/article/140581.htm)

