# idea 配置sbt

```
Idea配置sbt(window环境)
近开发spark项目使用到scala语言，这里介绍如何在idea上使用sbt来编译项目。

开发环境：windows

1. 下载sbt

http://www.scala-sbt.org/download.html

我使用的是zip包，下载后解压到d:\tool\目录

2.添加配置

2.1 打开D:\tool\sbt\conf\sbtconfig.txt，在最后添加下面几行配置，注意指定的目录和文件

-Dsbt.ivy.home=D:/tool/sbt/.ivy2
-Dsbt.global.base=D:/tool/sbt/.sbt
-Dsbt.repository.config=D:/tool/sbt/conf/repo.properties
 第一行sbt.ivy.home指定了本地自定义的repository路径（如果不设置就是默认的用户目录C:\Users\Administrator\.ivy2）

2.2 在D:/tool/sbt/conf/目录下新建repo.properties文件，填写下面内容，指定镜像站的地址：

复制代码
[repositories]
  local
  comp-maven: http://repo.data.1verge.net/nexus/content/groups/public/
  store_cn: http://maven.oschina.net/content/groups/public/
  store_mir: http://mirrors.ibiblio.org/maven2/
  store_0: http://maven.net.cn/content/groups/public/
  store_1: http://repo.typesafe.com/typesafe/ivy-releases/
  store_2: http://repo2.maven.org/maven2/
复制代码
2.3 在环境变量PATH中添加D:\sbt\tool\bin

3.Idea中设置

3.1 在idea中确保正确安装了scala插件

3.2 文件 -> 其他设置 -> 默认设置中如下设置



VM parameters:

复制代码
-XX:MaxPermSize=512M
-Dsbt.log.format=true
-Dsbt.global.base=D:/tool/sbt/.sbt
-Dsbt.ivy.home=D:/tool/sbt/.ivy2
-Dsbt.boot.directory=D:/tool/.sbt/boot/
-Dsbt.repository.config=D:/tool/sbt/conf/repo.properties
```
