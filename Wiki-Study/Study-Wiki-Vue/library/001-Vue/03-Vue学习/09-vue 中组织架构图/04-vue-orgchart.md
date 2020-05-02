# vue 可导出图片的组织机构图


## 可导出图片的架构图



vue-orgchart: 可编辑，可导出 JSON 的树形组织图
教程地址：https://spiritree.github.io/vue-orgchart/#/zh-cn/quickstart

* 不能正常出现图

```
npm WARN rollback Rolling back node-pre-gyp@0.10.3 failed (this is probably harmless): EPERM: operation not permitted, rmdir 'D:\shenyabo-work\idea_working_space\2019ZLSH\zlswspace\node_modules\fsevents'
npm WARN ajv-keywords@3.4.0 requires a peer of ajv@^6.9.1 but none is installed. You must install peer dependencies yourself.
npm WARN ajv-keywords@3.4.0 requires a peer of ajv@^6.9.1 but none is installed. You must install peer dependencies yourself.
npm WARN ajv-keywords@3.4.0 requires a peer of ajv@^6.9.1 but none is installed. You must install peer dependencies yourself.
npm WARN ajv-keywords@3.4.0 requires a peer of ajv@^6.9.1 but none is installed. You must install peer dependencies yourself.
npm WARN optional SKIPPING OPTIONAL DEPENDENCY: fsevents@1.2.7 (node_modules\fsevents):
npm WARN notsup SKIPPING OPTIONAL DEPENDENCY: Unsupported platform for fsevents@1.2.7: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"x64"})

```
于是更新了： ajv ，便可以了 

运行报错：npm i ajv




参考博客：https://segmentfault.com/a/1190000012384998

博客：https://blog.csdn.net/qq_40594137/article/details/80910040