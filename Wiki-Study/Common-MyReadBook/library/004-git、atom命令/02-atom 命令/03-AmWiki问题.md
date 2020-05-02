# AmWiki 公用文档




## AmWiki 问题汇总


### amWiki 目录级别定义如何制定才不会报错


* 目录级别

```
Spark 目录
  001-目录级别
    01-目录级别
      01-文档级别
```


### amwiki ctrl+shift+v 错误解决方案；提示 toPng不是一个方法如何解决？

* 问题再现
```
At C:\Users\z00197330.CHINA\.atom\packages\amWiki\lib\richPaste.js:109

TypeError: img.toPng is not a function
    at Object._pasteImg (/packages/amWiki/lib/richPaste.js:109:33)
    at Object.paste (/packages/amWiki/lib/richPaste.js:66:22)
    at /packages/amWiki/lib/main.js:168:35)
    at CommandRegistry.handleCommandEvent (~/AppData/Local/atom/app-1.28.0-beta3/resources/app/src/command-registry.js:384:49)
    at KeymapManager.module.exports.KeymapManager.dispatchCommandEvent (~/AppData/Local/atom/app-1.28.0-beta3/resources/app/node_modules/atom-keymap/lib/keymap-manager.js:621:22)
    at KeymapManager.module.exports.KeymapManager.handleKeyboardEvent (~/AppData/Local/atom/app-1.28.0-beta3/resources/app/node_modules/atom-keymap/lib/keymap-manager.js:412:28)
    at WindowEventHandler.handleDocumentKeyEvent (~/AppData/Local/atom/app-1.28.0-beta3/resources/app/src/window-event-handler.js:110:40)


```

* 解决方案

```
找文件：C:\Users\z00197330.CHINA\.atom\packages\amWiki\lib\richPaste.js:109
找到对应的109行，toPng改为toPNG
```
随后重启 atom编辑器,即可


---



# other
