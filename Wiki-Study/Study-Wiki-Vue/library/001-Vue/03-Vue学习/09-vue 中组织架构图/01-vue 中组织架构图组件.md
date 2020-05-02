# 组织架构图 vue2-org-tree

```

npm install --save-dev less less-loader
npm install --save-dev vue2-org-tree

```

途中报错：
* 第一个：npm install --save-dev less less-loader
报警告：
npm WARN ajv-keywords@2.1.1 requires a peer of ajv@^5.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN less-loader@6.0.0 requires a peer of webpack@^4.0.0 || ^5.0.0 but none is installed. You must install peer dependencies yourself.


* 尝试先安装
1 . npm WARN ajv-keywords@2.1.1 requires a peer of ajv@^5.0.0 but none is installed.

npm install ajv@^5.0.0

最终解决方案
```
其中版本为：

vue: 2.5.2
view-design: 4.2.0

less: 3.11.1
less-loader: 6.0.0

在网络上找了半天都没有有关这个的错误，倒是看到了几个有关 sass 的问题，说是版本不对


解决
首先修改版本号
我将版本改为如下:

less: 3.9.0
less-loader: 5.0.0

![](assets/001/03/09/01-1587976912813.png)


![](assets/001/03/09/01-1587976943865.png)

增加 javascriptEnabled

如上图，在对应位置加上: javascriptEnabled: true 即可。
我使用的是 @vue/cli3 创建的 webpack 项目，所以上述文件是在 build/utils.js

```





在main.js中引入并使用

import Vue2OrgTree from 'vue2-org-tree' 
Vue.use(Vue2OrgTree);


@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\webpack-dev-server\bin\webpack-dev-server.js" %*
) ELSE (
  @SETLOCAL
  @SET PATHEXT=%PATHEXT:;.JS;=;%
  node  --max-old-space-size=4096 "%~dp0\..\webpack-dev-server\bin\webpack-dev-server.js" %*
)


### 案例：

https://blog.csdn.net/weixin_38187317/article/details/86524258