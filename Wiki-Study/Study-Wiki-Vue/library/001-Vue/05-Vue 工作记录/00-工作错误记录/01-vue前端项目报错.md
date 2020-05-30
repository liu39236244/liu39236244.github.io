# vue 前端项目报错

## 1 vue 启动编译都没问题，但是白屏

* 通过查看console 报错，看到错误消息


```
vue项目vee_validate报错（__WEBPACK_IMPORTED_MODULE_2_vee_validate__.a.addLocale is not a function ）解决方法
```
报错总结：

```
1.先卸载 npm uninstall vee-validate

2.装回旧版本 npm install vee-validate@2.0.0-rc.25
```


## ajv 问题


```
D:\shenyabo-work\idea_working_space\2019ZLSH\zlswspace>npm install
npm WARN ajv-keywords@2.1.1 requires a peer of ajv@^5.0.0 but none is installed. You must install peer dependencies yourself.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@2.1.3 (node_modules\chokidar\node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@2.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.13 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.13: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

```

* 解决命令

> npm install ajv@^5.0.0 


## 镜像地址问题：

npm install ajv@^5.0.0  报错 

![](assets/001/05/00/01-1590561748178.png)

* 应该是我设置过npm 的镜像为淘宝镜像，但是好像说 代理，所以设置代理为null 便可以正常安装 

> 执行命令：npm config set proxy null


![](assets/001/05/00/01-1590561994931.png)



## vue项目vue内存溢出：



* 找到对应 node_modules/.bin/

找到对应文件 ，添加对应配置

![](assets/001/05/00/01-1590564749664.png)

```
node  --max-old-space-size=4096 "%~dp0\..\webpack-dev-server\bin\webpack-dev-server.js" %*
```

![](assets/001/05/00/01-1590564815945.png)