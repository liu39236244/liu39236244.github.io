# nodejs NPM常用命令


# npm常用命令

```

npm install moduleNames：安装Node模块。
安装完毕后会产生一个node_modules目录，其目录下就是安装的各个node模块。
npm view moduleNames：查看node模块的package.json文件夹。
注意事项：如果想要查看package.json文件夹下某个标签的内容，可以使用$npm view moduleName labelName。

npm list：查看当前目录下已安装的node包。
注意事项：Node模块搜索是从代码执行的当前目录开始的，搜索结果取决于当前使用的目录中的node_modules下的内容。$ npm list parseable=true可以目录的形式来展现当前安装的所有node包。

npm help：查看帮助命令。

npm view moudleName dependencies：查看包的依赖关系。

npm view moduleName repository.url：查看包的源文件地址。

npm view moduleName engines：查看包所依赖的Node的版本。

npm help folders：查看npm使用的所有文件夹。

npm rebuild moduleName：用于更改包内容后进行重建。

npm outdated：检查包是否已经过时，此命令会列出所有已经过时的包，可以及时进行包的更新。

npm update moduleName：更新node模块。

npm uninstall moudleName：卸载node模块。

一个npm包是包含了package.json的文件夹，package.json描述了这个文件夹的结构。访问npm的json文件夹的方法如下：
$ npm help json 此命令会以默认的方式打开一个网页，如果更改了默认打开程序则可能不会以网页的形式打开。
发布一个npm包的时候，需要检验某个包名是否已存在
$ npm search packageName。

npm init：会引导你创建一个package.json文件，包括名称、版本、作者这些信息等。

npm root：查看当前包的安装路径；npm root -g：查看全局的包的安装路径。
```