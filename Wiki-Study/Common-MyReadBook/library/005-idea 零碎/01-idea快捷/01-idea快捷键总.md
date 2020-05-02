# 这里总结了用过的idea的快捷键
# idea总快捷键


# 快捷键杂乱
```
Ctrl+v粘贴
Ctrl+z回退，或者u回退
Ctrl+Shift+F12 关闭工具窗口,最大化编辑界面.
    Shift+F12 调出默认布局. 每次启动 IDEA 以后, 调整好窗口布局, 尤其是工具窗口布局,
              然后使用菜单 Window,Store Current Layout as Default, 设为默认布局.
    Ctrl+E 调出最近使用的文件和工具窗口列表.
    Ctrl+N 按类名查找文件, 为了让打开的文件与资源窗口同步, 勾选 Autoscroll from Source.
    Ctrl+W 语法词选择, 利用这种方法可以快速选择对象, 重点是进行接下来的操作.
    Ctrl+Alt+V 引入新变量
    Ctrl+Shift+J 连接行
    Ctrl+X 剪切行
    Ctrl+D 复制行
    Ctrl+Q 调出 API 帮助信息
    Ctrl+B 调出定义
    Ctrl+U 调出使用 (自定义 Find Usage)
    Alt+Insert 自动生成代码
    Ctrl+Shift+B 包围 (自定义 surround)
    Ctrl+Shift+Enter 补全当前语句
    Ctrl+/ 行注释
    Ctrl+Shift+/ 块注释
    Ctrl+F12 调出类的结构, 方便快速跳转
    Alt+Shift+Insert 列选择
    Ctrl+Shift+F9 编译当前文件
    Ctrl+K 检查文件版本更新, 前提是配置了 SVN 或 Git 版本控制软件

```
## idea 新人必回的

```
>IDEA 14 15 常用的快捷键操作  

1. 打开调用链  
Alt+F6  
Ctrl + Alt + H  
Ctrl + H 继承  
ctrl+q : 显示类的结构以及文本信息,APi帮助信息
ctrl+Y ：删除当前行

2. 实现接口类的方法  
Ctrl + I  
Ctrl + o ：覆盖基类的方法

3. 快速进入实现类  
Ctrl + alt + B，Ctrl + shift + B  
快速进入父类  
Ctrl + U
Ctrl+shift+alt+u:查看当前类的组织架构
4. 格式化  
Ctrl + Alt + L  
Ctrl + Alt +Shift ：同时选中多列-》
  alt+选取：选取多列
  alt+shift:也可以选中多文本，同时双击鼠标左键能够直接选中单词
    拓展：ctrl+alt+shift+左箭头/右箭头 ：还可以在方法参数中修改参数的位置，不需要复制粘贴了，很实用
* 查看一个类的结构图
》也可以对一个包进行操作，则显示包下面的所有类UML 视图
ctrl+alt+shift+U : 另外打开新窗口展示当前类的结构，继承哪些类实现那些接口等都可以
ctrl+alt+u :显示在当前窗口试图一个类的结构    
5. 快速生成get set  
Alt + Insert  

6. syso  
sout + Tab  

7. 调试  
下一行 F8   
步入 F7  
跳出 F9  

8. 编译  
编译当前类 ctrl + shift + F9  
编译所有类 ctrl + F9  

9. 最大化窗口  
shift + esc  
ctrl + shift+ f12  

10. 自动返回值  
crrl + alr + v  

11. 注释缩进  


12.  
CTRL+SHIFT+F7 高亮显示多个关键字  

13. 重构  
shift + f6  

14.查找类  
Ctrl + N  

15.查找方法  
Ctrl + Shift + Alt + N  

16.打开近期的类  
Ctrl + E  

17 ：idea 中连接mysql
* 0. shift+esc: 隐藏dataset 窗口
* 1. 连接mysql ，编写sql语句验证：ctrl+enter:执行语句
* 2.ctrl+d：比较数据源
* 3.表格修改：选择表按F4 ：修改表结构
* 4. ctrl+q : 也可以对数据库对象进行访问
    * 4.1 两次 ctrl+q: 可以对行列进行转置互换
* 5. ctrl+shift+空格：可以在idea中连接数据库写sql语句提醒
* 6. ddl的sql语句文件可以直接拖拽到dataset 窗口上面，执行
* 7. ctrl+shift+10 :直接打开sql语句书写窗口，ctrl+enter：直接执行sql语句

18：窗体快捷键

alt+f12 ：掉出终端

19：选择

alt+shift ：同时选中多块代码块
```

## idea中数据库连接使用的快捷方式


```
 (Ctrl+Shift+空格)  sql 语句的智能填充；
 ctrl+alt+u ： 表设计打开表格
```


# 快捷键使用过的

## ctrl+

ctrl+w :代码段扩选
ctrl+E:打开近期使用过的 ，跟ctrl+shift+tab差不多
ctrl+F9  ：编译当前类  、ctrl + shift + F9 编译所有类 ，注意有的时候会编译不通过，这个时候需要rebude project 。


## ctrl+shift
ctrl+shift+F7  : 高亮显示选中 F3 下一个Shift +F3 上一个
ctrl + shift + F9 ：编译当前类  ctrl+F9 编译所有类
ctrl+shift+F10 执行程序
ctrl+shift+F12 最大化编程面板
ctrl+alt+F10 - 打开aven-package 打包
ctrl+F12 显示类结构,
ctrl+shift+f ：find -> ctrl+shift+f 全局查询

ctrl+shift+R：全局替换

书签工具：
地址：https://www.w3cschool.cn/intellij_idea_doc/intellij_idea_doc-i2mx2epl.html

ctrl+shift+F11 ：添加书签，在favorite 中能查看
不能用的话就是用（我的idea 2019 可能快捷键不一样）,
2019 的快捷键：
F11 就直接添加了
ctrl+F11 ：直接带有标签添加书签，
查看书签就是使用shift+F11 :查看已有的书签



## alt
alt+F1 很有用， 包括结构，快速寻找类在那个包，显示在文件中等
alt+F7 打开一个方法在那个类被调用了 ，与此对应crl+alt+h ，
  ```
    区别
      ctrl+alt+h的功能的英文名意思是"调用层次"，alt+f7的功能的英文名意思是"找到使用的地方"。

    其实都有"找到使用的地方"的功能，区别是alt+f7的结果是由大到小的层次，结果的树形结构是模块->包->类->方法->行

    而ctrl+alt+h的搜索结果的结构是目标方法->调用目标方法的方法a->调用a的方法b……这样的结构
  ```
alt+1 打开project面板
alt+2 打开favorite面板，记录书签啥的
alt+3 重构记录面板
alt+4 控制台输出，2019版本快捷键是 alt+5
alt+6 打开终端terminal ：
alt+7 打开类结构案板,比如一个类有哪些方法等
al+9 ：svn 的面板控制



* ctrl+alt+

```
crrl + alr + v  :自动返回数据类型
ctrl+ lat +h :找到方法试用地方
ctrl+alt+u: 类结构视图 在win窗口显示
```


## shift
shift+6 重构

shift+鼠标滑轮 水平拖动页面
shift双击，查询全局文件

## ctrl+shift

ctrl+shift+tab ：打开好多面板 ，maven ，终端

ctrl+shift+enter: 使用代码完成时,您可以接受当前突出显示在弹出的列表中选择按Ctrl + Shift + Enter, IntelliJ IDEA将不只是插入选中的字符串,但也尽力将当前代码构造语法正确(平衡括号,添加缺失的牙套和分号,等等)。

## ctrl+shift+Alt

* ctrl+shift+Alt ：查找方法
  ```
  相似的：ctrl+N （类）、 ctrl+shift+n （查找文件） 、
  ```

* Ctrl+Shift+Alt+U : 查看当前类的组织架构

## 搜索相关

```
ctrl+shift+r :类文件搜索，输入类定位到类文件
ctrl+shift+n :除了可以搜索类文件，也能搜索其他匹配的文件
ctrl+h:查看类的继承关系
Ctrl+Alt+B查看子类方法实现
  Ctrl+B可以查看父类或父方法定义，但是不如ctrl+鼠标左键方便。但是在这里，Ctrl+B或ctrl+鼠标左键只能看见Map接口的抽象方法put的定义，不是我们想要的，这时候Ctrl+Alt+B就可以查看HashMap的put方法。
alt+F7:查看类在哪里用过
ctrl+f/ctrl+shift+f
  相当于eclipse的ctrl+H，速度优势更加明显。其中Ctrl+F是在本页查找，Ctrl+Shift+F是全局查找
shift+shift ：查找任何东西
  shift+shift非常强大，可搜索类、资源、配置项、方法等，还能搜索路径。其中搜索路径非常实用，例如你写了一个功能叫hello，在java，js，css，jsp中都有hello的文件夹，那我们可以搜索"hello/"找到路径中包含hello的文件夹。
```

## try catch 代码块

```
快捷键：
选定代码块，快捷键： Ctrl+Alt+T.

或者：
先写个 try/catch 的模板 alt + t + l 保存模板，用的时候是 ctrl + j 调用模板名字就可以了。
IDEA 全称IntelliJ IDEA，是java语言开发的集成环境，IntelliJ在业界被公认为最好的java开发工具之一，尤其在智能代码助手、代码自动提示、重构、J2EE支持、Ant、JUnit、CVS整合、代码审查、 创新的GUI设计等方面的功能可以说是超常的。IDEA是JetBrains公司的产品，这家公司总部位于捷克共和国的首都布拉格，开发人员以严谨著称的东欧程序员为主。

```

# 2-idea 自动生成注释

## 2-1 自动生成注释
原文地址：https://blog.csdn.net/qq_37485700/article/details/78845802
```

```


# 3- idea小技巧总结

idea 中可以看到每一行的svn 提交信息的读操作，在文件旁边右键，选择annotate

![](assets/005/01/01-1563775752222.png)![](assets/005/01/01-1563775752222.png)

再点击就会出现当时的更新内容

![](assets/005/01/01-1563775901864.png)


# 4-快速健代码


```java
   String [] array1,array2;
        // 输入itar ，回车 自动补全代码
        for (int i = 0; i < array1.length; i++) {
            String s = array1[i];
            
        }
```


vi /etc/sysconfig/network-scripts/ifcfg-ens33 