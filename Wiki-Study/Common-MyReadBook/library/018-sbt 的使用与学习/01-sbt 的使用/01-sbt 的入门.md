# sbt 的认识

## 1- sbt 的认识

### 1 入门总结：

* [sbt官网](https://www.scala-sbt.org/)

* [sbt入门](https://www.scala-sbt.org/0.13/docs/zh-cn/Getting-Started.html)

* sbt msi win安装地址：https://www.scala-sbt.org/download.html
* idea 配置sbt ：https://www.cnblogs.com/30go/p/7909630.htmlaa
官网的原话：

sbt uses a small number of concepts（概念） to support flexible and powerful build definitions. There are not that many concepts, but sbt is not exactly like other build systems and there are details you will stumble on if you haven’t read the documentation.

sbt是类似ANT、MAVEN的构建工具，全称为Simple build tool，是Scala事实上的标准构建工具。

主要特性：

原生支持编译Scala代码和与诸多Scala测试框架进行交互；
使用Scala编写的DSL（领域特定语言）构建描述
使用Ivy作为库管理工具
持续编译、测试和部署
整合scala解释器快速迭代和调试
支持Java与Scala混合的项目

### 2 sbt目录设置

* 1 sbt 配置
```sbt
lazy val root = (project in file("."))
  .settings(
    name := "hello",
    version := "1.0",
    scalaVersion := "2.12.2"
  )
```

* 2 指定sbt版本

```
你可以通过创建 hello/project/build.properties 文件强制指定一个版本的 sbt。在这个文件里，编写如下内容来强制使用 0.13.16：

sbt.version=0.13.16
sbt 在不同的 release 版本中是 99% 兼容的。但是在 project/build.properties 文件中设置 sbt 的版本仍然能避免一些潜在的混淆。
```

如果你准备将你的项目打包成一个 jar 包，在 build.sbt 中至少要写上 name 和 version。

* 3-sbt目录结构


```
src/
  main/
    resources/
       <files to include in main jar here>
    scala/
       <main Scala sources>
    java/
       <main Java sources>
  test/
    resources
       <files to include in test jar here>
    scala/
       <test Scala sources>
    java/
       <test Java sources>
```
### 3 sbt 批处理命令

* 简单命令
```
sbt clean compile "testOnly TestA TestB"
```
在这个例子中，testOnly 有两个参数 TestA 和 TestB。这个命令会按顺序执行（clean， compile， 然后 testOnly）。

* 持续测试，

```
持续构建和测试
为了加快编辑-编译-测试循环，你可以让 sbt 在你保存源文件时自动重新编译或者跑测试。 在命令前面加上前缀 ~ 后，每当有一个或多个源文件发生变化时就会自动运行该命令。例如，在交互模式下尝试：

~ compile
```


* 3.2 sbt 命令参数


```
clean	删除所有生成的文件 （在 target 目录下）。
compile	编译源文件（在 src/main/scala 和 src/main/java 目录下）。
test	编译和运行所有测试。
console	进入到一个包含所有编译的文件和所有依赖的 classpath 的 Scala 解析器。输入 :quit， Ctrl+D （Unix），或者 Ctrl+Z （Windows） 返回到 sbt。
run <参数>*	在和 sbt 所处的同一个虚拟机上执行项目的 main class。
package	将 src/main/resources 下的文件和 src/main/scala 以及 src/main/java 中编译出来的 class 文件打包成一个 jar 文件。
help <命令>	显示指定的命令的详细帮助信息。如果没有指定命令，会显示所有命令的简介。
reload	重新加载构建定义（build.sbt， project/*.scala， project/*.sbt 这些文件中定义的内容)。在修改了构建定义文件之后需要重新加载。
```
* 3.3 命令历史记录


```

!	显示历史记录命令帮助。
!!	重新执行前一条命令。
!:	显示所有之前的命令。
!:n	显示之前的最后 n 条命令。
!n	执行 !: 命令显示的结果中下标为 n 的命令。
!-n	执行从该命令往前数第 n 条命令。
!string	执行最近执行过的以 string 打头的命令。
!?string	执行最近执行过的包含 string 的命令。
```

### 4-sbt的构建定义：
三种风格：


```
多工程 .sbt 构建定义
bare .sbt 构建定义
.scala 构建定义

```

* sbt例子

```
如何在 build.sbt 中定义设置
build.sbt 定义了一个 Project，它持有一个名为settings的scala表达式列表。

下面是一个例子：

lazy val commonSettings = Seq(
  organization := "com.example",
  version := "0.1.0",
  scalaVersion := "2.12.2"
)

lazy val root = (project in file("."))
  .settings(
    commonSettings,
    name := "hello"
  )
```


### 1-1 入门博主总结

博主地址：
```
https://www.cnblogs.com/codingexperience/p/5372617.html

```
