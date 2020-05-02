# Java 中配置Path/classpath 环境变量作用


## 自身总结

## 博主总结

(1)PATH环境变量的作用


在安装JDK程序之后，在安装目录下的bin目录中会提供一些开发Java程序时必备的工具程序。


对于Java的初学者，建议在命令符模式下使用这些工具程序编译运行Java程序。在Windows 2000/XP操作系统的“开始”菜单中选择“运行”菜单项，输入“cmd”命令来打开命令符模式。


在命令符模式下输入javac命令时，会提示错误信息。


出现上述错误的原因是操作系统在当前目录下找不到javac.exe工具程序，因此需要告诉操作系统应该到哪些目录下尝试寻找，设置PATH环境变量的目的就是为操作系统指定寻找工具程序的目录。


设置PATH变量后，需要重新打开命令符模式才能使设置生效，此时执行javac命令获得成功。


当用户在命令符模式输入javac命令时，操作系统会尝试在指定的PATH变量中寻找指定的工具程序，由于PATH变量中设置了JDK的bin目录的路径，因此操作系统就可以根据这个信息来找到javae.exe工具程序。


提示：在使用javac命令编译Java程序时，如果遏到“javac不是内部或外部命令，也不是可运行的程序或批处理文件”错误提示，其原因就是PATH环境变量未设置或设置错误。


(2)CLASSPATH环境变量的作用


Java执行环境本身就是一个平台，用于运行已编译完成的Java程序(即class字节码文件)。


如果设置PATH变量是为了让操作系统找到指定的工具程序，那么设置CLASSPATH变量的目的就是让Java执行环境找到指定的Java程序对应的class文件以及程序中引用的其他class文件。


JDK在默认情况下会到当前工作目录下(变量值用“.”表示)以及JDK的lib目录下寻找所需的class文件，因此如果Java程序放在这两个目录中，即使不设置CLASSPATH变量执行环境也可以找得到。但是如果Java程序放在其他目录下，运行时则需要设置CLASSPATH变量。


总之，设置CLASSPATH的目的在于通知Java执行环境在哪些目录下可以找到所耍执行的JaVa程序。


一般在安装JDK后，需要设置PATH和CLASSPATH环境变量。如果不设置会对以后使用造成一定的影响。


在此不仅介绍了如何设置两个环境变量，还介绍了PATH和CLASSPATH环境变量的作用。

假设JDK安装路径：
E:\Program Files\Java\jdk1.6.0_05
以下的变量可以设置成用户变量，业可以设置成系统变量。他们的区别只是使用权限的问题而已。

第一种方法：
建立两个变量：
变量名：PATH
变量值：E:\Program Files\Java\jdk1.6.0_05\bin
变量名：CLASSPATH
变量值：.;E:\Program Files\Java\jdk1.6.0_05\lib\tools.jar;E:\Program Files\Java\jdk1.6.0_05\jre\lib\dt.jar
【注意开头是句号加分好】

第二种方法：
建立三个环境变量
变量名：JAVA_HOME
变量值：E:\Program Files\Java\jdk1.6.0_05   注：JDK安装路径
变量名：PATH
变量值：%JAVA_HOME%\bin
变量名：CLASSPATH
变量值：.;%JAVA_HOME%\lib\tools.jar;%JAVA_HOME%\jre\lib\dt.jar
【注意开头是句号加分好】
