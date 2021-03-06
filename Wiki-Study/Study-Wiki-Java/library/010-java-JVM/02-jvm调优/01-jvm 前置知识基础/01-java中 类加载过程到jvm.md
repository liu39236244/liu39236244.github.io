# 描述类的装载过程及各个步骤主要工作？


## 类的加载过程：

```

加载->链接 （验证；准备；解析）-> 初始化

1 加载
2 链接：主要是链接这个过程，验证主要是为了验证环境，比如当前的编写是否符合当前jdk版本或者等
3 初始化 
    初始化详细步骤： 
        为类的静态变量赋值，然后执行类的初始化static静态语句
    1. 如果类没有被加载和链接就先进行加载和链接
    2. 如果有父类且父类没有被初始化就先初始化直接父类
    3. 有静态代码块 或者静态语句 ，就限制性静态代码块，然后在按顺序执行静态代码语句，最后执行构造

    

```

class初始化的时机：

    1. 创建类的实例，

    1.用new语句创建对象，这是最常用的创建对象的方式。

    2.运用反射手段，调用Java.lang.Class或者java.lang.reflect.Constructor类的newInstance()实例方法。

    3.调用对象的clone()方法。

    4.运用反序列化手段，调用java.io.ObjectInputStream对象的readObject()方法.

    2. 访问类中某个静态变量，或者对其赋值
    3. 主动调用类的静态方法
    4. Class.forName（"类名"）
    5. 完成子类初始化，也会完成对本类初始化（不包括接口，接口为什么例外呢？）
    6. 该类是程序引导入口（main或者test入口）

##  简述类加载器的双亲委派原则及双亲委派原则意义？


```
1 双亲委派原则：

    * 1.1 其实就是让用户编译好的class文件加载之前先加载jvm所需要的基础类文件； bootstrap ClassLoader 加载 jre/lib/rt.jar 、 java.lang 等对应的class，且这种class一定是 BootstrapClassLoader 去加载的也是保证了安全

    * 1.2 Extension CLassLoader 去加载三方扩展使用的class ，jre/lib/ext/*.jar 等，

    * 1.3 最后在Application CLassLoader去加载 开发的class ，

    原理就是先寻找最顶层加载器去加载， 如果无法加载，则往下走一层的加载器加载，如果依然无法加载则一直下去直到 ClassNotFoundException错误；

2 意义

    * 2.1 避免了类的重复加载
    * 2.2 保护程序安全，防止核心java语言环境被破坏

```

3 简述运行时数据区主要的内容以及各个部分存储内容和主要作用？

```
 


1.方法区  ： 
    所有线程共享的区域，随着虚拟机消失而消失；
    方法区无法得到足够空间的话 就会oom； 
    jdk 1.8 之前 就是叫做永久代 ，1.8之后 方法区 metaspace 方法区也是属于堆的一部分 里面的东西几乎不变的与之相反的就是堆里面的 
    
    * 运行时常量池:是在方法区里面的一部分 


2.堆
    java 线程共享堆的空间，
    共享内存的分代模型：
    老年代
    新生代
   

3 虚拟机栈

    先进后出 ； java 的线程运行状态，由当前虚拟机栈保存，虚拟机栈保存的就是栈帧，一个方法就是一个栈帧，调用一个方法，就会向当栈中压入一个栈帧；main-> A.b() -> A.c(); 线程完了 栈也完了；
4 本地方法栈
    本地线程执行？？ 
    本地方法 JNI（java native interface） 技术调用本地方法？用c运行
5 程序计数器
    程序下一个指令的地址，保存当前线程中执行的位置，虚拟机当前执行的二进制地址
    线程走一步，记录一下。跟线程是同生共死的



```            


## jvm 的一生



* 作业 jvm 对象的一声

![](assets/010/02/01/01-1616900048849.png)


* 栈式指令集架构 vs 寄存器指令集架构  优劣分析

栈式指令级架构（JVM）

1. 指令大部分是零地址指令，期执行过程完全依赖于操作数栈的数据（一般栈顶）
2. 由于是零地址指令，生成的指令空间占用更少
3. 不受限于武力的硬件资源，可以执行强，更好的实现跨平台行；性能不如寄存器指集架构

寄存器指令集架构（davlik）

1. 指令采用一地址指令，而地址指令，三地址指令，其执行过程依赖于硬件的寄存器
2. 指令空间占用更多。但是完成的功能可以更复杂，相同做工时间更少
3. 性能更优，基于寄存器执行更为高效
4. 指令集依赖硬件资源，可移植性较大限制； 一般用于安卓等开发

* 更详细地址：

https://blog.csdn.net/pq258280920/article/details/25877265 
https://www.cnblogs.com/snow-man/p/10617230.html 
