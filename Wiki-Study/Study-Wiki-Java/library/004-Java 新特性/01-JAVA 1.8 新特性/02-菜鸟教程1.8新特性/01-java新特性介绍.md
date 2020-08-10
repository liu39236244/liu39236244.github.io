# Java 1.8 新特性菜鸟教程

更多的新特性可以参阅官网：[What's New in JDK 8](http://www.oracle.com/technetwork/java/javase/8-whats-new-2157071.html)

Java 8 新特性

Java 8 (又称为 jdk 1.8) 是 Java 语言开发的一个主要版本。 Oracle 公司于 2014 年 3 
月 18 日发布 Java 8 ，它支持函数式编程，新的 JavaScript 引擎，新的日期 API，新的Stream API 等。


## 新特性

```
Java8 新增了非常多的特性，我们主要讨论以下几个：

Lambda 表达式 − Lambda 允许把函数作为一个方法的参数（函数作为参数传递到方法中）。

方法引用 − 方法引用提供了非常有用的语法，可以直接引用已有Java类或对象（实例）的方法或构造器。与lambda联合使用，方法引用可以使语言的构造更紧凑简洁，减少冗余代码。

默认方法 − 默认方法就是一个在接口里面有了一个实现的方法。

新工具 − 新的编译工具，如：Nashorn引擎 jjs、 类依赖分析器jdeps。

Stream API −新添加的Stream API（java.util.stream） 把真正的函数式编程风格引入到Java中。

Date Time API − 加强对日期与时间的处理。

Optional 类 − Optional 类已经成为 Java 8 类库的一部分，用来解决空指针异常。

Nashorn, JavaScript 引擎 − Java 8提供了一个新的Nashorn javascript引擎，它允许我们在JVM上运行特定的javascript应用。
```


```sh
$ java -version
java version "1.8.0_31"
Java(TM) SE Runtime Environment (build 1.8.0_31-b13)
Java HotSpot(TM) 64-Bit Server VM (build 25.31-b07, mixed mode)
```

## 编程风格

```java
import java.util.Collections;
import java.util.List;
import java.util.ArrayList;
import java.util.Comparator;
 
public class Java8Tester {
   public static void main(String args[]){
   
      List<String> names1 = new ArrayList<String>();
      names1.add("Google ");
      names1.add("Runoob ");
      names1.add("Taobao ");
      names1.add("Baidu ");
      names1.add("Sina ");
        
      List<String> names2 = new ArrayList<String>();
      names2.add("Google ");
      names2.add("Runoob ");
      names2.add("Taobao ");
      names2.add("Baidu ");
      names2.add("Sina ");
        
      Java8Tester tester = new Java8Tester();
      System.out.println("使用 Java 7 语法: ");
        
      tester.sortUsingJava7(names1);
      System.out.println(names1);
      System.out.println("使用 Java 8 语法: ");
        
      tester.sortUsingJava8(names2);
      System.out.println(names2);
   }
   
   // 使用 java 7 排序
   private void sortUsingJava7(List<String> names){   
      Collections.sort(names, new Comparator<String>() {
         @Override
         public int compare(String s1, String s2) {
            return s1.compareTo(s2);
         }
      });
   }
   
   // 使用 java 8 排序
   private void sortUsingJava8(List<String> names){
      Collections.sort(names, (s1, s2) -> s1.compareTo(s2));
   }
}

```

```
$ javac Java8Tester.java
$ java Java8Tester
使用 Java 7 语法: 
[Baidu , Google , Runoob , Sina , Taobao ]
使用 Java 8 语法: 
[Baidu , Google , Runoob , Sina , Taobao ]
```