# 

## 总结

* 参考博客：https://blog.csdn.net/qq_41887214/article/details/111825950


> 1 安装之前需要先安装core cli 等核心组件 


1.全局安装 @babel/cli @babel/core

npm install -g @babel/cli  @babel/core
babel -V //7.5.5 (@babel/core 7.5.5)  即安装成功 mac 需➕sud


2.接下来在项目中安装 @babel/core @babel/preset-env

npm install --save-dev @babel/core @babel/preset-env

3.安装 @babel/polyfill

npm install --save @babel/polyfill


@babel/core 是babel 核心的包 包括所有核心的api

@babel/cli 是通过命令转换js的工具

@babel/preset-env  指定转换的环境，配置插件，对哪些语法转换

@babel/polyfill  是对babel本身不支持的一些语法转换的 填充

4.创建babel.config.js 配置转换的环境，仅转换环境不支持的部分

5.创建.babelrc文件 配置presets 和plugins 等，

例如要支持decorator和class转换 

需先下载@babel/plugin-proposal-decorators 和@babel/plugin-proposal-class-properties 在更改.babelrc



//.babelrc 文件内代码
{
    "plugins": [
      ["@babel/plugin-proposal-decorators", { "legacy": true }],
      ["@babel/plugin-proposal-class-properties", {"loose": true}]
    ]
 }



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