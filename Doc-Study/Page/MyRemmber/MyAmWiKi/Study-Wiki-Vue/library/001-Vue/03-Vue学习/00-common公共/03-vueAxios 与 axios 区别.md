# vue axios 与axios 区别 总结



# 总结



# 博主

## 博主1

[地址](https://www.jianshu.com/p/d65e4d67884a)


# this.axios this.$axios axios 区别：

## 总结


## 说明

```
首先搞明白在Vue。this指向Vue实例对象，包含了当前的数据和从原型链上继承的方法。
axios是ajax封装的库，用于异步请求接口数据，和Vue没什么关联，但是多用于Vue全家桶中。


给axios起什么名字是开发者自己的事情，你甚至可以随便取名，因此三个写法如果都是用于引用axios库的话效果一模一样。


如果绑定在this上使用那意味着是从Vue的原型链上继承的方法，因此axios被绑定在Vue的原型对象上。这个方法的好处是只要可以访问Vue实例即可获得axios的引用。
如果不带this axios说明是当前作用域的一个变量 需要在当前作用域能触及的开头let axios = require('axios')
```