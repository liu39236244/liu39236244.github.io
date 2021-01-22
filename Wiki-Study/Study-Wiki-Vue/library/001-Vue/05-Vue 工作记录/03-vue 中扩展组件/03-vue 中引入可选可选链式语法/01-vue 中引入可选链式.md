# 

## 总结

* 参考博客：https://blog.csdn.net/qq_41887214/article/details/111825950


```
const firstName = message?.body?.user?.firstName || 'default';
如何在项目中支持可选链？

1.安装依赖（Babel）

npm install @babel/plugin-proposal-optional-chaining
2.添加至项目.babel.config.js文件中：

{
  "plugins": [
    "@babel/plugin-proposal-optional-chaining",
 ]
}
然后你就可以在你的项目里开心的使用链式判断运算符了

友情提示：<template>中暂时还不支持可选链语法
```