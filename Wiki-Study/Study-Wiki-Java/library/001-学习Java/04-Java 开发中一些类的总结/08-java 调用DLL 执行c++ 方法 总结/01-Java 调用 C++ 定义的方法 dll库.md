# Java 调用Dll 执行c++ 重定义的方法


## 总结


* 这几天 需求是java 调用C++ ，识别一个图片，有输入输出参数，并且有返回值！ 在这做一个记录


### C++ 程序

* 在此之前 有一个问题 ，c++ 那边要我一个.h 文件 ，但是一直执行提示找不到对应的class 文件 ，但是已经通过javac 编译了。最后解决方案：

```shell
# 进入终端的 项目 src 目录下 执行命令 javah； --classpath 后面加上包的根路径， -jni  后面就是 自己类路径，.java 不需要写后缀；就能生成对应的.h 文件了
D:\shenyabo-work\idea_working_space\MyStudy_WorkSpace\mystudy\service\src> javah
-classpath D:\shenyabo-work\idea_working_space\MyStudy_WorkSpace\mystudy\service
\src\main\java -jni com.yabo.other.C_Use.DLL_Library.ForDll
```


```c++

```

### java 程序

#### api
> [首先jnaapi](https://blog.csdn.net/allenwells/article/details/46850455)

* 参考博主[地址](https://www.cnblogs.com/new-life/p/9345840.html)



* 1 java调用dll动态库的方法，总的有三种：JNI、JNA、JNative。其中JNA调用DLL是最方便的。

![](assets/001/04/08/01-1566284169986.png)


java使用 JNI来调用dll动态库的调用，工作量略大，一般情况下开发人员会选用JNA或JNative。

使用JNative调用DLL除了要引入jar包外还需要额外引入一个dll文件，而JNA只需要引入jar即可使用。


* 我的使用步骤 

* 1 先引入包，我用的是maven  ，开发工具idea  ，win7 系统 。

```xml
        <dependency>
            <groupId>com.sun.jna</groupId>
            <artifactId>jna</artifactId>
            <version>3.0.9</version>
        </dependency>
```


* 2 定义 dll  中对应的函数 ，以及 接口 


```java
import com.sun.jna.Library;
import com.sun.jna.Pointer;

public interface JNATestDll2 extends Library {
    public boolean StrEnTest(String image_Path, String outputPath, String modeWeights, String modelConfiguration, String classFile, Pointer pointer);
}

```

* 3 测试类 


```java
// 

public class test {
    public static JNATestDll2 jnaTestDll2;
    static{
        jnaTestDll2 = (JNATestDll2) Native.loadLibrary("C:\\Users\\Administrator\\Desktop\\暂时\\DllForJava", JNATestDll2.class);
    }
    public static void main(String[] args) {
        String modelConfiguration = "C:\\Users\\Administrator\\Desktop\\暂时\\yolov3-voc.cfg";
        String modelWeights = "C:\\Users\\Administrator\\Desktop\\暂时\\yolov3-voc_10000.weights";
        String classFile = "C:\\Users\\Administrator\\Desktop\\暂时\\coco_beng.names";
        String img_path = "C:\\Users\\Administrator\\Desktop\\暂时\\733.jpg";
        String outputPath = "C:\\Users\\Administrator\\Desktop\\暂时\\out\\result.jpg";
        Pointer pointer = new Memory(256);
        // StrEnTest 这个是c++ 中的 函数，输入参数 自己测试的时候 可以写一个简单的 c++ 函数， pointer 是指针类，用于接收c++ 写入 //// pointer 的值，作为返回值， pointer.getString(0) 就是获取 Pointer中 peer  内存地址对应的 值。
        boolean result = jnaTestDll2.StrEnTest(img_path, outputPath, modelWeights, modelConfiguration, classFile, pointer);
        System.out.println(result);
        System.out.println(pointer.getString(0));
    }

}

```

* 总结 ： 如果直接在 接口中 声明 调用dll 接口对象的话 ，打印出来pointer.getString 中有中文的话会获取比实际值要长的数据。

 如下 调用方法： 在获取pointer.getString(0) 获取中文的时候 ，会莫名其妙打印出一堆 路径；但是能调用一些方法，但是不推荐，只是知道有这么个方式会有问题

> 错误方法示范

 ```Java

import com.sun.jna.Library;
import com.sun.jna.Native;
import com.sun.jna.Pointer;

public interface JNATestDll extends Library {
    JNATestDll instanceDll = (JNATestDll) Native.loadLibrary("C:\\Users\\Administrator\\Desktop\\暂时\\DllForJava", JNATestDll.class);
    public boolean StrEnTest(String image_Path, String outputPath, String modeWeights, String modelConfiguration, String classFile, Pointer pointer);
    public static void main(String[] args) {
    }
}

```


 * 调用

```Java

import com.sun.jna.Memory;
import com.sun.jna.Pointer;
public class test {
    public static void main(String[] args) {
        String modelConfiguration = "C:\\Users\\Administrator\\Desktop\\暂时\\yolov3-voc.cfg";
        String modelWeights = "C:\\Users\\Administrator\\Desktop\\暂时\\yolov3-voc_10000.weights";
        String classFile = "C:\\Users\\Administrator\\Desktop\\暂时\\coco_beng.names";
        String img_path = "C:\\Users\\Administrator\\Desktop\\暂时\\733.jpg";
        String outputPath = "C:\\Users\\Administrator\\Desktop\\暂时\\out\\result.jpg";
        Pointer pointer = new Memory(256);
        boolean result = JNATestDll.instanceDll.StrEnTest(img_path, outputPath, modelWeights, modelConfiguration, classFile, pointer);
        System.out.println(result);
        System.out.println(pointer.getString(0));
        // 一下 忽略，是bug 的时候 的别的写法
//        for (int i = 0, sum = 256; i < sum; i++) {
//            System.out.print((char) pointer.getByteArray(0, 256)[i]);
//        }
    }

}
```

以上这种方式 会有问题

---