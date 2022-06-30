# 01-springboot在请求头中保存值返回前段

## 参考博客

https://blog.csdn.net/qq_42682745/article/details/120640971

## 总结

意思就是默认的请求响应是简单首部（简单版headers），我们想要添加其它的值放入header，就需要Access-Control-Expose-Headers将这个值暴露出来，前端就能拿到

比如我放token进去：

首先我想到的就是，在controller方法中定义HttpServletResponse对象 rs，然后addHerader

```java
login(@RequestBody Map<String,String> map, HttpServletResponse rs){}
// 这一行是关键代码
// rs.addHeader("Access-Control-Expose-Headers","token");
rs.addHeader("token",token);

```



