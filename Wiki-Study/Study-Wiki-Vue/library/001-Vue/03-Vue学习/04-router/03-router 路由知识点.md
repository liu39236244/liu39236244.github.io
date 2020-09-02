# router 路由知识点总结


## router 路由传值 params  query 区别以及使用


> 总结

* params

1 params 传递类似于java 接口中的post 请求，参数被封装到对象中，不在地址栏中显示，但是如果清空缓存或者刷新页面就会消失；



2 params 传参必须设置跳转push 参数中 name :"页面路由"，页面路由在路由配置页面进行配置，如

* 传参页面

```js

{
    path:"路径",
    name: '名称',// 一般路径名称写成一样的
    component: () => import('../components/vue文件中间路径/文件'),
},
```

* 接受参数页面


```js

// 接受菜单页面传入的参数
      mountedOrActivated() {
        console.log("菜单传入的参数",this.$route)
        if(Object.keys(this.$route.query).length){
          console.log("菜单传入的参数",this.$route.query["terminalCode"])
        }
      },
```

* query 

1 query 中的参数类似于 java 中 get 请求 ，参数会被明文展示到地址栏，但是好处是刷新页面参数也能依然存在。
2 query 中跳转页面通过name 、path 都可以传参

> 1 案例

A 页面跳转页面

```js
this.$router.push({name:"DBTMNJWX",query:{terminalCode:key},params:{terminalCode:key}});
```

B 接收参数页面


```js
  if(Object.keys(this.$route.query).length){
    
     this.courseTaskObj.KCRWB_JWXSBID = this.$route.query.terminalId
 }
 if(Object.keys(this.$route.query).params){
    
     this.courseTaskObj.KCRWB_JWXSBID = this.$route.query.terminalId
 }
```