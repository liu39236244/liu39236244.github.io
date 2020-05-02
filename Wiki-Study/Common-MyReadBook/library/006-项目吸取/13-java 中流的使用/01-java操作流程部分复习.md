# 这里记录git44 部分复习内容

## treSet 两种保证排序且保证唯一两种方式


```Java
/*

 * TreeSet：能够对元素按照某种规则进行排序。

 * 排序有两种方式

 * A:自然排序

 * B:比较器排序

 *

 * TreeSet集合的特点：排序和唯一

  第一种：真正的比较是依赖于元素的compareTo()方法，而这个方法是定义在 Comparable里面的。

 *所以，你要想重写该方法，就必须实现 Comparable接口。这个接口表示的就是自然排序。

 * 通过观察TreeSet的add()方法，我们知道最终要看TreeMap的put()方法。



第二种：定义一个类，实现Comparator接口，重写compare方法，进行比较



 */


import java.util.Comparator;

import java.util.TreeSet;



//给自定义的类使用比较器 比较器

class ComWithPerson1 implements Comparator{

     @Override

     public int compare(Object o1, Object o2) {

           // TODO Auto-generated method stub

           if(!(o1 instanceof Person1)){

                 throw new ClassCastException();

           }

           if(!(o2 instanceof Person1)){

                 throw new ClassCastException();

           }

           Person1 p1=(Person1)o1;

           Person1 p2=(Person1)o2;

           int num=p1.getAge()-p2.getAge();

           /*int num2=num==0?p1.getName().length()-p2.getName().length():num;

           int num3=num2==0?p1.getName().compareTo(p2.getName()):num2;*/



           return num==0?p1.getName().compareTo(p2.getName()):num;

     }

}



public class Demo3 {

     public static void main(String[] args) {

           ComWithPerson1 comWithPerson1=new ComWithPerson1();

           TreeSet tSet=new TreeSet(comWithPerson1);

           tSet.add(new Person1(12,"范冰冰"));

           tSet.add(new Person1(122,"小冰冰"));

           tSet.add(new Person1(12,"做冰冰"));

           tSet.add(new Person1(12,"范冰冰"));

           tSet.add(new Person1(2,"姗姗"));

           System.out.println(tSet);


     }

}

class Person1 implements Comparable{

     private int age;

     private String name;

     public Person1() {

           super();

           // TODO Auto-generated constructor stub

     }

     public Person1(int age, String name) {

           super();

           this.age = age;

           this.name = name;

     }

     public int getAge() {

           return age;

     }

     public void setAge(int age) {

           this.age = age;

     }

     public String getName() {

           return name;

     }

     public void setName(String name) {

           this.name = name;

     }

     @Override



     //通过重写compareTo方法，达到去重的目的

     public int compareTo(Object o) {

           // TODO Auto-generated method stub

           if(!(o instanceof Person1)){

                 throw new ClassCastException();

           }

           Person1 p=(Person1)o;

           int num=this.getAge()-p.getAge();

           //int num2=(this.getAge()-p.getAge()==0)?:"";

           return num==0?this.getName().compareTo(p.getName()):num;

     }

     @Override

     public String toString() {

           return "Person [age=" + age + ", name=" + name + "]";

     }





}

```

## Java 自定义异常类的两种方式

### 异常定义

```Java
1.自定义一个异常类、分别继承自Exception  与RunTimeException

/*

* java不可能对所有的情况都考虑到，所以，在实际的开发中，我们可能需要自己定义异常。

* 而我们自己随意的写一个类，是不能作为异常类来看的，要想你的类是一个异常类，就必须继承自Exception或者RuntimeException

*

* 两种方式：

* A:继承Exception

* B:继承RuntimeException

*/

//下面这个是继承编译时异常

public class MyException extends Exception {

           public MyException() {

           }



           public MyException(String message) {

                       super(message);

           }

}

//下面这个是继承自运行时间异常

// public class MyException extends RuntimeException {

//

// }



2.定义一个student类定义一个方法抛出自定义的异常



public class Teacher {

           public void check(int score) throws MyException {

                       if (score > 100 || score < 0) {

                                   throw new MyException("分数必须在0-100之间");

                       } else {

                                   System.out.println("分数没有问题");

                       }

           }

           // 针对MyException继承自RuntimeException 这里不需要上面那样throws MyException

           // public void check(int score) {

           // if (score > 100 || score < 0) {

           // throw new MyException();

           // } else {

           // System.out.println("分数没有问题");

           // }

           // }

}

```

### 异常注意

```Java
/*

 * 异常注意事项:

 * A:子类重写父类方法时，子类的方法必须抛出相同的异常或父类异常的子类。(父亲坏了,儿子不能比父亲更坏)

 * B:如果父类抛出了多个异常,子类重写父类时,只能抛出相同的异常或者是他的子集,子类不能抛出父类没有的异常

 * C:如果被重写的方法没有异常抛出,那么子类的方法绝对不可以抛出异常,如果子类方法内有异常发生,那么子类只能try,不能throws

 *        @Override//重写

            public void show() throws ArithmeticException {



            }

 */
```

### IO的操作

#### File创建文件

```Java
import java.io.File;

import java.io.IOException;



/*

 *创建功能：

 *public boolean createNewFile():创建文件 如果存在这样的文件，就不创建了

 *public boolean mkdir():创建文件夹 如果存在这样的文件夹，就不创建了

 *public boolean mkdirs():创建文件夹,如果父文件夹不存在，会帮你创建出来

 *

 *骑白马的不一定是王子，可能是班长。

 *注意：你到底要创建文件还是文件夹，你最清楚，方法不要调错了。

 */
```

#### javaFile 的重命名方法

```Java
/*

 * 重命名功能:public boolean renameTo(File dest)

 *                    如果路径名相同，就是改名。

 *                    如果路径名不同，就是改名并剪切。

 *

 * 路径以盘符开始：绝对路径 c:\\a.txt

 * 路径不以盘符开始：相对路径         a.txt

 */

```

#### File 的删除功能

```Java
/*

 * 删除功能:public boolean delete()

 *

 * 注意：

 *                    A:如果你创建文件或者文件夹忘了写盘符路径，那么，默认在项目路径下。

 *                    B:Java中的删除不走回收站。

 *                    C:要删除一个文件夹，请注意该文件夹内不能包含文件或者文件夹

 */
```

#### File判断功能

```Java

* 判断功能:

* public boolean isDirectory():判断是否是目录

* public boolean isFile():判断是否是文件

* public boolean exists():判断是否存在

* public boolean canRead():判断是否可读

* public boolean canWrite():判断是否可写

* public boolean isHidden():判断是否隐藏
```

#### File获取功能

```Java
/*import java.io.File;

 * 获取功能：

 * public String[] list():获取指定目录下的所有文件或者文件夹的名称数组

 * public File[] listFiles():获取指定目录下的所有文件或者文件夹的File数组

 */

public class FileDemo {

            public static void main(String[] args) {

                        // 指定一个目录

                        File file = new File("e:\\");



                        // public String[] list():获取指定目录下的所有文件或者文件夹的名称数组

                        String[] strArray = file.list();

                        for (String s : strArray) {

                                    System.out.println(s);

                        }

                        System.out.println("------------");



                        // public File[] listFiles():获取指定目录下的所有文件或者文件夹的File数组

                        File[] fileArray = file.listFiles();

                        for (File f : fileArray) {

                                    System.out.println(f.getName());

                        }

            }

}


```

#### 文件的判断

* 1-判断是否有.jpg 开头的

```Java
import java.io.File;

/*

 * 判断E盘目录下是否有后缀名为.jpg的文件，如果有，就输出此文件名称

 *

 * 分析：

 *                    A:封装e判断目录

 *                    B:获取该目录下所有文件或者文件夹的File数组

 *                    C:遍历该File数组，得到每一个File对象，然后判断

 *                    D:是否是文件

 *                                是：继续判断是否以.jpg结尾

 *                                            是：就输出该文件名称

 *                                            否：不搭理它

 *                                否：不搭理它

 */

public class FileDemo {

            public static void main(String[] args) {

                        // 封装e判断目录

                        File file = new File("e:\\");



                        // 获取该目录下所有文件或者文件夹的File数组

                        File[] fileArray = file.listFiles();



                        // 遍历该File数组，得到每一个File对象，然后判断

                        for (File f : fileArray) {

                                    // 是否是文件

                                    if (f.isFile()) {

                                                // 继续判断是否以.jpg结尾

                                                if (f.getName().endsWith(".jpg")) {

                                                            // 就输出该文件名称

                                                            System.out.println(f.getName());

                                                }

                                    }

                        }

            }

}
```

* 2- 过滤器版本判断是否有jpg开头的文件

```Java
import java.io.File;

import java.io.FilenameFilter;



/*

 * 判断E盘目录下是否有后缀名为.jpg的文件，如果有，就输出此文件名称

 * A:先获取所有的，然后遍历的时候，依次判断，如果满足条件就输出。

 * B:获取的时候就已经是满足条件的了，然后输出即可。

 *

 * 要想实现这个效果，就必须学习一个接口：文件名称过滤器

 * public String[] list(FilenameFilter filter)

 * public File[] listFiles(FilenameFilter filter)

 */

public class FileDemo2 {

            public static void main(String[] args) {

                        // 封装e判断目录

                        File file = new File("e:\\");



                        // 获取该目录下所有文件或者文件夹的String数组

                        // public String[] list(FilenameFilter filter)

                        String[] strArray = file.list(new FilenameFilter() {

                                    @Override

                                    public boolean accept(File dir, String name) {

                                                // return false;

                                                // return true;

                                                // 通过这个测试，我们就知道了，到底把这个文件或者文件夹的名称加不加到数组中，取决于这里的返回值是true还是false

                                                // 所以，这个的true或者false应该是我们通过某种判断得到的

                                                // System.out.println(dir + "---" + name);

                                                // File file = new File(dir, name);

                                                // // System.out.println(file);

                                                // boolean flag = file.isFile();

                                                // boolean flag2 = name.endsWith(".jpg");

                                                // return flag && flag2;

//下面是一句话写出

                                                return new File(dir, name).isFile() && name.endsWith(".jpg");

                                    }

                        });



                        // 遍历

                        for (String s : strArray) {

                                    System.out.println(s);

                        }

            }

}

```
* 3- 修改文件名字

```Java

import java.io.File;



/*

 * 需求：把E:\评书\三国演义下面的视频名称修改为

 *                    00?_介绍.avi

 *

 * 思路：

 *                    A:封装目录

 *                    B:获取该目录下所有的文件的File数组

 *                    C:遍历该File数组，得到每一个File对象

 *                    D:拼接一个新的名称，然后重命名即可。

 */

public class FileDemo {

            public static void main(String[] args) {

                        // 封装目录

                        File srcFolder = new File("E:\\评书\\三国演义");



                        // 获取该目录下所有的文件的File数组

                        File[] fileArray = srcFolder.listFiles();



                        // 遍历该File数组，得到每一个File对象

                        for (File file : fileArray) {

                                    // System.out.println(file);

                                    // E:\评书\三国演义\三国演义_001_[评书网-今天很高兴,明天就IO了]_桃园三结义.avi

                                    // 改后：E:\评书\三国演义\001_桃园三结义.avi

                                    String name = file.getName(); // 三国演义_001_[评书网-今天很高兴,明天就IO了]_桃园三结义.avi



                                    int index = name.indexOf("_");

                                    String numberString = name.substring(index + 1, index + 4);

                                    // System.out.println(numberString);



                                    // int startIndex = name.lastIndexOf('_');

                                    // int endIndex = name.lastIndexOf('.');

                                    // String nameString = name.substring(startIndex + 1, endIndex);

                                    // System.out.println(nameString);

                                    int endIndex = name.lastIndexOf('_');

                                    String nameString = name.substring(endIndex);



                                    String newName = numberString.concat(nameString); // 001_桃园三结义.avi

                                    // System.out.println(newName);



                                    File newFile = new File(srcFolder, newName); // E:\\评书\\三国演义\\001_桃园三结义.avi



                                    // 重命名即可

                                    file.renameTo(newFile);

                        }

            }

}


```

* 4- 递归输出一个文件夹里面的所有java文件

```Java

import java.io.File;



/*

 * 需求：请大家把E:\JavaSE目录下所有的java结尾的文件的绝对路径给输出在控制台。

 *

 * 分析：

 *                    A:封装目录

 *                    B:获取该目录下所有的文件或者文件夹的File数组

 *                    C:遍历该File数组，得到每一个File对象

 *                    D:判断该File对象是否是文件夹

 *                                是：回到B

 *                                否：继续判断是否以.java结尾

 *                                            是：就输出该文件的绝对路径

 *                                            否：不搭理它

 */

public class FilePathDemo {

            public static void main(String[] args) {

                        // 封装目录

                        File srcFolder = new File("E:\\JavaSE");



                        // 递归功能实现

                        getAllJavaFilePaths(srcFolder);

            }



            private static void getAllJavaFilePaths(File srcFolder) {

                        // 获取该目录下所有的文件或者文件夹的File数组

                        File[] fileArray = srcFolder.listFiles();



                        // 遍历该File数组，得到每一个File对象

                        for (File file : fileArray) {

                                    // 判断该File对象是否是文件夹

                                    if (file.isDirectory()) {

                                                getAllJavaFilePaths(file);

                                    } else {

                                                // 继续判断是否以.java结尾

                                                if (file.getName().endsWith(".java")) {

                                                            // 就输出该文件的绝对路径

                                                            System.out.println(file.getAbsolutePath());

                                                }

                                    }

                        }

            }

}



```

#### io操作

```Java

FileInputStream、FileOutputStream、
int by=0
(len=fi.read())!=-1
{fo.write(by)}
依次读取数组

byte[] bys=new byte[1024] //或周二1024的倍数
int len=0
(len=fi.read(bys))!=-1
{fo.write(bys,0,len)}

/**
* 高效字节流读取
*/
// 高效字节流一次读写一个字节数组：

           public static void method4(String srcString, String destString)

                                   throws IOException {

                       BufferedInputStream bis = new BufferedInputStream(new FileInputStream(

                                               srcString));

                       BufferedOutputStream bos = new BufferedOutputStream(

                                               new FileOutputStream(destString));



                       byte[] bys = new byte[1024];

                       int len = 0;

                       while ((len = bis.read(bys)) != -1) {

                                   bos.write(bys, 0, len);

                       }



                       bos.close();

                       bis.close();

           }



           // 高效字节流一次读写一个字节：

           public static void method3(String srcString, String destString)

                                   throws IOException {

                       BufferedInputStream bis = new BufferedInputStream(new FileInputStream(

                                               srcString));

                       BufferedOutputStream bos = new BufferedOutputStream(

                                               new FileOutputStream(destString));



                       int by = 0;

                       while ((by = bis.read()) != -1) {

                                   bos.write(by);



                       }



                       bos.close();

                       bis.close();

           }

```


* 转换流

* [InputStreamReader(new FileInputStream())]
* [OutputStreamWriter(new FileOutputStream())]

字符串与字节流的转换

```java
import java.io.FileOutputStream;

import java.io.IOException;

import java.io.OutputStreamWriter;



/*

 * OutputStreamWriter(OutputStream out):根据默认编码把字节流的数据转换为字符流

 * OutputStreamWriter(OutputStream out,String charsetName):根据指定编码把字节流数据转换为字符流

 * 把字节流转换为字符流。

 * 字符流 = 字节流 +编码表。

 */

public class OutputStreamWriterDemo {

            public static void main(String[] args) throws IOException {

                        // 创建对象

                        // OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(

                        // "osw.txt")); // 默认GBK

                        // OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(

                        // "osw.txt"), "GBK"); // 指定GBK

                        OutputStreamWriter osw = new OutputStreamWriter(new FileOutputStream(

                                                "osw.txt"), "UTF-8"); // 指定UTF-8

                        // 写数据

                        osw.write("中国");



                        // 释放资源

                        osw.close();

            }

}


```




#### 转化流




介绍：记录

```Java
 InputStreamReader(FileInputStream()) 的使用;
/*

 *  throws IOException //注意抛出异常

 * InputStreamReader(InputStream is):用默认的编码读取数据

 * InputStreamReader(InputStream is,String charsetName):用指定的编码读取数据

 * InputStreamReader isr = new InputStreamReader(new FileInputStream(

                                                "osw.txt"), "UTF-8");

                        // 读取数据

                        // 一次读取一个字符

                        int ch = 0;

                        while ((ch = isr.read()) != -1) {

                                    System.out.print((char) ch);

                        }

 */


```


####  IO流的子类简化FileWriter与FileReader  

```
介绍用法如下：如

/*

 * import java.io.FileReader;

 * import java.io.FileWriter;

 * import java.io.IOException;

 *

 * 由于我们常见的操作都是使用本地默认编码，所以，不用指定编码。

 * 而转换流的名称有点长，所以，Java就提供了其子类供我们使用。

 * OutputStreamWriter = FileOutputStream + 编码表(GBK)

 * FileWriter = FileOutputStream + 编码表(GBK)

 *

 * InputStreamReader = FileInputStream + 编码表(GBK)

 * FileReader = FileInputStream + 编码表(GBK)

 *

 /*

 * 需求：把当前项目目录下的a.txt内容复制到当前项目目录下的b.txt中

 *

 * 数据源：

 *                    a.txt -- 读取数据 -- 字符转换流 -- InputStreamReader -- FileReader

 * 目的地：

 *                    b.txt -- 写出数据 -- 字符转换流 -- OutputStreamWriter -- FileWriter

 *                    FileWriter fw = new FileWriter("b.txt",true);

 */

```

#### FileReader FileWriter 的缓冲流BufferWriter /BufferReader



/*

* 字符流为了高效读写，也提供了对应的字符缓冲流。

* BufferedWriter:字符缓冲输出流

* BufferedReader:字符缓冲输入流

*

* BufferedWriter:字符缓冲输出流

* 将文本写入字符输出流，缓冲各个字符，从而提供单个字符、数组和字符串的高效写入。

* 可以指定缓冲区的大小，或者接受默认的大小。在大多数情况下，默认值就足够大了。

*/

public class BufferedWriterDemo {

           public static void main(String[] args) throws IOException {

                       // BufferedWriter(Writer out)

                       // BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(

                       // new FileOutputStream("bw.txt")));



                       BufferedWriter bw = new BufferedWriter(new FileWriter("bw.txt"));

                       bw.write("hello");

                       bw.write("world");

                       bw.write("java");

                       bw.flush();



                       bw.close();

           }

}


#### BufferReader 使用

```Java
mport java.io.BufferedReader;

import java.io.FileReader;

import java.io.IOException;



/*

 * BufferedReader

 * 从字符输入流中读取文本，缓冲各个字符，从而实现字符、数组和行的高效读取。

 * 可以指定缓冲区的大小，或者可使用默认的大小。大多数情况下，默认值就足够大了。

 *

 * BufferedReader(Reader in)

 */

public class BufferedReaderDemo {

            public static void main(String[] args) throws IOException {

                        // 创建字符缓冲输入流对象

                        BufferedReader br = new BufferedReader(new FileReader("bw.txt"));



                        // 方式1

                        // int ch = 0;

                        // while ((ch = br.read()) != -1) {

                        // System.out.print((char) ch);

                        // }



                        // 方式2

                        char[] chs = new char[1024];

                        int len = 0;

                        while ((len = br.read(chs)) != -1) {

                                    System.out.print(new String(chs, 0, len));

                        }



                        // 释放资源

                        br.close();

            }

}
```

* BufferWriter 的使用

```
简介：如
/*

 * 字符缓冲流的特殊方法：

 * BufferedWriter:

 *                    public void newLine():根据系统来决定换行符

 * BufferedReader:

 *                    public String readLine()：一次读取一行数据

 *                    包含该行内容的字符串，不包含任何行终止符，如果已到达流末尾，则返回 null

 */

一个复制文本案例：如public class CopyFileDemo2 {

            public static void main(String[] args) throws IOException {

                        // 封装数据源

                        BufferedReader br = new BufferedReader(new FileReader("a.txt"));

                        // 封装目的地

                        BufferedWriter bw = new BufferedWriter(new FileWriter("b.txt"));



                        // 读写数据

                        String line = null;

                        while ((line = br.readLine()) != null) {

                                    bw.write(line);

                                    bw.newLine();

                                    bw.flush();

                        }



                        // 释放资源

                        bw.close();

                        br.close();

            }

}


```

### 复制文本的五种方案

```Java
介绍：代码如

import java.io.BufferedReader;

import java.io.BufferedWriter;

import java.io.FileReader;

import java.io.FileWriter;

import java.io.IOException;

public class BufferCopyDemo_02 {

            public static void main(String[] args) throws IOException{

                        String srcString="OutputStreamWriterDemo.java";

                        String destString="b.txt";

                        method_01(srcString,destString);//方法1所用时间32毫秒

                        method_02(srcString,destString);//方法2所用时间2毫秒

                        method_03(srcString,destString);//方法3所用时间6毫秒

                        method_04(srcString,destString);//方法4所用时间2毫秒

                        method_05(srcString,destString);//方法5所用时间14毫秒

            }



            private static void method_05(String srcString, String destString)throws IOException {

                        long a=System.currentTimeMillis();

                        // TODO Auto-generated method stub

                        BufferedWriter bw=new BufferedWriter(new FileWriter(destString));

                        BufferedReader br=new BufferedReader(new FileReader(srcString));



                        String line=null;

                        while((line=br.readLine())!=null){

                                    bw.write(line);

                                    bw.newLine();

                                    bw.flush();

                        }

                        bw.close();

                        br.close();

                        long b=System.currentTimeMillis();

                        System.out.println("方法5所用时间"+(b-a)+"毫秒");

            }



            private static void method_04(String srcString, String destString)throws IOException {

                        long a=System.currentTimeMillis();

                        BufferedWriter bw=new BufferedWriter(new FileWriter(destString));

                        BufferedReader br=new BufferedReader(new FileReader(srcString));

                        char [] chs=new char[1024];

                        int len=0;

                        while((len=br.read(chs))!=-1){

                                    bw.write(chs,0,len);



                        }

                        bw.close();

                        br.close();

                        long b=System.currentTimeMillis();

                        System.out.println("方法4所用时间"+(b-a)+"毫秒");



            }



            private static void method_03(String srcString, String destString) throws IOException{



                        long a=System.currentTimeMillis();

                        BufferedWriter bw=new BufferedWriter(new FileWriter(destString));

                        BufferedReader br=new BufferedReader(new FileReader(srcString));



                        int ch=0;

                        while((ch=br.read())!=-1){

                                    bw.write(ch);

                                    //bw.flush();

                        }

                        bw.close();

                        br.close();

                        long b=System.currentTimeMillis();

                        System.out.println("方法3所用时间"+(b-a)+"毫秒");// TODO Auto-generated method stub



            }



            private static void method_02(String srcString, String destString)throws IOException {

                        long a=System.currentTimeMillis();

                        // TODO Auto-generated method stub

                        FileWriter fw=new FileWriter(destString);

                        FileReader fr=new FileReader(srcString);

                        char [] chs=new char[1024];

                        int len=0;

                        while((len=fr.read(chs))!=-1){

                                    fw.write(chs,0,len);



                        }

                        fw.close();

                        fr.close();

                        long b=System.currentTimeMillis();

                        System.out.println("方法2所用时间"+(b-a)+"毫秒");// TODO Auto-generated method stub





            }



            private static void method_01(String srcString, String destString) throws IOException {

                        long a=System.currentTimeMillis();

                        // TODO Auto-generated method stub

                        FileWriter fw=new FileWriter(destString);

                        FileReader fr=new FileReader(srcString);



                        int ch;

                        while((ch=fr.read())!=-1){

                                    fw.write(ch);

                        }

                        fw.close();

                        fr.close();

                        long b=System.currentTimeMillis();

                        System.out.println("方法1所用时间"+(b-a)+"毫秒");// TODO Auto-generated method stub





            }



}
```

### 复制图片五种方案

```Java
案例代码：如下

import java.io.BufferedInputStream;

import java.io.BufferedOutputStream;

import java.io.File;

import java.io.FileInputStream;

import java.io.FileOutputStream;

import java.io.IOException;



/*

 * 复制图片

 *

 * 分析：

 *                    复制数据，如果我们知道用记事本打开并能够读懂，就用字符流，否则用字节流。

 *                    通过该原理，我们知道我们应该采用字节流。

 *                    而字节流有4种方式，所以做这个题目我们有4种方式。推荐掌握第4种。

 *

 * 数据源：

 *                    c:\\a.jpg -- FileInputStream -- BufferedInputStream

 * 目的地：

 *                    d:\\b.jpg -- FileOutputStream -- BufferedOutputStream

 */

public class CopyImageDemo {

            public static void main(String[] args) throws IOException {

                        // 使用字符串作为路径

                        // String srcString = "c:\\a.jpg";

                        // String destString = "d:\\b.jpg";

                        // 使用File对象做为参数

                        File srcFile = new File("c:\\a.jpg");

                        File destFile = new File("d:\\b.jpg");



                        // method1(srcFile, destFile);

                        // method2(srcFile, destFile);

                        // method3(srcFile, destFile);

                        method4(srcFile, destFile);

            }



            // 字节缓冲流一次读写一个字节数组

            private static void method4(File srcFile, File destFile) throws IOException {

                        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(

                                                srcFile));

                        BufferedOutputStream bos = new BufferedOutputStream(

                                                new FileOutputStream(destFile));



                        byte[] bys = new byte[1024];

                        int len = 0;

                        while ((len = bis.read(bys)) != -1) {

                                    bos.write(bys, 0, len);

                        }



                        bos.close();

                        bis.close();

            }



            // 字节缓冲流一次读写一个字节

            private static void method3(File srcFile, File destFile) throws IOException {

                        BufferedInputStream bis = new BufferedInputStream(new FileInputStream(

                                                srcFile));

                        BufferedOutputStream bos = new BufferedOutputStream(

                                                new FileOutputStream(destFile));

                        int by = 0;

                        while ((by = bis.read()) != -1) {

                                    bos.write(by);

                        }

                        bos.close();

                        bis.close();

            }



            // 基本字节流一次读写一个字节数组

            private static void method2(File srcFile, File destFile) throws IOException {

                        FileInputStream fis = new FileInputStream(srcFile);

                        FileOutputStream fos = new FileOutputStream(destFile);



                        byte[] bys = new byte[1024];

                        int len = 0;

                        while ((len = fis.read(bys)) != -1) {

                                    fos.write(bys, 0, len);

                        }



                        fos.close();

                        fis.close();

            }



            // 基本字节流一次读写一个字节

            private static void method1(File srcFile, File destFile) throws IOException {

                        FileInputStream fis = new FileInputStream(srcFile);

                        FileOutputStream fos = new FileOutputStream(destFile);



                        int by = 0;

                        while ((by = fis.read()) != -1) {

                                    fos.write(by);

                        }



                        fos.close();

                        fis.close();

            }

}
```
### 字节缓冲流使复制文本

```Java
// 字节缓冲流一次读写一个字节数组

private static void method4(File srcFile, File destFile) throws IOException {

            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(

                                    srcFile));

            BufferedOutputStream bos = new BufferedOutputStream(

                                    new FileOutputStream(destFile));

            byte[] bys = new byte[1024];

            int len = 0;

            while ((len = bis.read(bys)) != -1) {

                        bos.write(bys, 0, len);

            }

            bos.close();

            bis.close();

}
```
### 字节打印流

```Java
import java.io.IOException;

import java.io.PrintWriter;



/*

 * 打印流

 * 字节流打印流          PrintStream

 * 字符打印流 PrintWriter

 *

 * 打印流的特点：

 *                    A:只有写数据的，没有读取数据。只能操作目的地，不能操作数据源。

 *                    B:可以操作任意类型的数据。

 *                    C:如果启动了自动刷新，能够自动刷新。

 *                    D:该流是可以直接操作文本文件的。

 *                                哪些流对象是可以直接操作文本文件的呢?

 *                                FileInputStream

 *                                FileOutputStream

 *                                FileReader

 *                                FileWriter

 *                                PrintStream

 *                                PrintWriter

 *                                看API,查流对象的构造方法，如果同时有File类型和String类型的参数，一般来说就是可以直接操作文件的。

 *

 *                                流：

 *                                            基本流：就是能够直接读写文件的

 *                                            高级流：在基本流基础上提供了一些其他的功能

 */

public class PrintWriterDemo {

            public static void main(String[] args) throws IOException {

                        // 作为Writer的子类使用

                        PrintWriter pw = new PrintWriter("pw.txt");



                        pw.write("hello");

                        pw.write("world");

                        pw.write("java");



                        pw.close();

            }

}

案例2



import java.io.FileWriter;

import java.io.IOException;

import java.io.PrintWriter;



/*

 * 1:可以操作任意类型的数据。

 *                    print()

 *                    println()

 * 2:启动自动刷新

 *                    PrintWriter pw = new PrintWriter(new FileWriter("pw2.txt"), true);

 *                    还是应该调用println()的方法才可以

 *                    这个时候不仅仅自动刷新了，还实现了数据的换行。

 *

 *                    println()

 *                     其实等价于于：

 *                     bw.write();

 *                     bw.newLine();               

 *                     bw.flush();

 */

public class PrintWriterDemo2 {

            public static void main(String[] args) throws IOException {

                        // 创建打印流对象

                        // PrintWriter pw = new PrintWriter("pw2.txt");

                        PrintWriter pw = new PrintWriter(new FileWriter("pw2.txt"), true);



                        // write()是搞不定的，怎么办呢?

                        // 我们就应该看看它的新方法

                        // pw.print(true);

                        // pw.print(100);

                        // pw.print("hello");



                        pw.println("hello");

                        pw.println(true);

                        pw.println(100);



                        pw.close();

            }

}


打印流实现文本文件复制



代码：如下



import java.io.BufferedReader;

import java.io.BufferedWriter;

import java.io.FileReader;

import java.io.FileWriter;

import java.io.IOException;

import java.io.PrintWriter;



/*

 * 需求：DataStreamDemo.java复制到Copy.java中

 * 数据源：

 *                    DataStreamDemo.java -- 读取数据 -- FileReader -- BufferedReader

 * 目的地：

 *                    Copy.java -- 写出数据 -- FileWriter -- BufferedWriter -- PrintWriter

 */

public class CopyFileDemo {

            public static void main(String[] args) throws IOException {

                        // 以前的版本

                        // 封装数据源

                        // BufferedReader br = new BufferedReader(new FileReader(

                        // "DataStreamDemo.java"));

                        // // 封装目的地

                        // BufferedWriter bw = new BufferedWriter(new FileWriter("Copy.java"));

                        //

                        // String line = null;

                        // while ((line = br.readLine()) != null) {

                        // bw.write(line);

                        // bw.newLine();

                        // bw.flush();

                        // }

                        //

                        // bw.close();

                        // br.close();



                        // 打印流的改进版

                        // 封装数据源

                        BufferedReader br = new BufferedReader(new FileReader(

                                                "DataStreamDemo.java"));

                        // 封装目的地

                        PrintWriter pw = new PrintWriter(new FileWriter("Copy.java"), true);



                        String line = null;

                        while((line=br.readLine())!=null){

                                    pw.println(line);

                        }



                        pw.close();

                        br.close();

            }

}
```

### 序列化反序列化

```Java
public class Person implements Serializable {

            private static final long serialVersionUID = -2071565876962058344L;



            private String name;



            // private int age;



            private transient int age;



            // int age;



            public Person() {

                        super();

            }



            public Person(String name, int age) {

                        super();

                        this.name = name;

                        this.age = age;

            }



            public String getName() {

                        return name;

            }



            public void setName(String name) {

                        this.name = name;

            }



            public int getAge() {

                        return age;

            }



            public void setAge(int age) {

                        this.age = age;

            }



            @Override

            public String toString() {

                        return "Person [name=" + name + ", age=" + age + "]";

            }

}



ObjectStreamDemo  对上面进行测试



import java.io.FileInputStream;

import java.io.FileOutputStream;

import java.io.IOException;

import java.io.ObjectInputStream;

import java.io.ObjectOutputStream;



/*

 * 序列化流：把对象按照流一样的方式存入文本文件或者在网络中传输。对象 -- 流数据(ObjectOutputStream)

 * 反序列化流:把文本文件中的流对象数据或者网络中的流对象数据还原成对象。流数据 -- 对象(ObjectInputStream)

 */

public class ObjectStreamDemo {

            public static void main(String[] args) throws IOException,

                                    ClassNotFoundException {

                        // 由于我们要对对象进行序列化，所以我们先自定义一个类

                        // 序列化数据其实就是把对象写到文本文件

                        // write();



                        read();

            }



            private static void read() throws IOException, ClassNotFoundException {

                        // 创建反序列化对象

                        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(

                                                "oos.txt"));



                        // 还原对象

                        Object obj = ois.readObject();



                        // 释放资源

                        ois.close();



                        // 输出对象

                        System.out.println(obj);

            }



            private static void write() throws IOException {

                        // 创建序列化流对象

                        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(

                                                "oos.txt"));



                        // 创建对象

                        Person p = new Person("林青霞", 27);



                        // public final void writeObject(Object obj)

                        oos.writeObject(p);



                        // 释放资源

                        oos.close();

            }

}



```
### properties 的功能

```Java
import java.io.FileReader;

import java.io.FileWriter;

import java.io.IOException;

import java.io.Reader;

import java.io.Writer;

import java.util.Properties;



/*

 * 这里的集合必须是Properties集合：

 * public void load(Reader reader):把文件中的数据读取到集合中

 * public void store(Writer writer,String comments):把集合中的数据存储到文件

 *

 * 单机版游戏：

 *                    进度保存和加载。

 *                    三国群英传，三国志，仙剑奇侠传...

 *

 *                    吕布=1

 *                    方天画戟=1

 */

public class PropertiesDemo3 {

            public static void main(String[] args) throws IOException {

                        // myLoad();



                        myStore();

            }



            private static void myStore() throws IOException {

                        // 创建集合对象

                        Properties prop = new Properties();



                        prop.setProperty("林青霞", "27");

                        prop.setProperty("武鑫", "30");

                        prop.setProperty("刘晓曲", "18");



                        //public void store(Writer writer,String comments):把集合中的数据存储到文件

                        Writer w = new FileWriter("name.txt");

                        prop.store(w, "helloworld");

                        w.close();

            }



            private static void myLoad() throws IOException {

                        Properties prop = new Properties();



                        // public void load(Reader reader):把文件中的数据读取到集合中

                        // 注意：这个文件的数据必须是键值对形式

                        Reader r = new FileReader("prop.txt");

                        prop.load(r);

                        r.close();



                        System.out.println("prop:" + prop);

            }

}
```



### NIO的使用

```Java
介绍：如下



import java.io.IOException;

import java.nio.charset.Charset;

import java.nio.file.Files;

import java.nio.file.Paths;

import java.util.ArrayList;



/*

 * nio包在JDK4出现，提供了IO流的操作效率。但是目前还不是大范围的使用。

 * 有空的话了解下，有问题再问我。

 *

 * JDK7的之后的nio：

 * Path:路径

 * Paths:有一个静态方法返回一个路径

 *                    public static Path get(URI uri)

 * Files:提供了静态方法供我们使用

 *                    public static long copy(Path source,OutputStream out):复制文件

 *                    public static Path write(Path path,Iterable<? extends CharSequence> lines,Charset cs,OpenOption... options)

 */

public class NIODemo {

            public static void main(String[] args) throws IOException {

                        // public static long copy(Path source,OutputStream out)

                        // Files.copy(Paths.get("ByteArrayStreamDemo.java"), new

                        // FileOutputStream(

                        // "Copy.java"));



                        ArrayList<String> array = new ArrayList<String>();

                        array.add("hello");

                        array.add("world");

                        array.add("java");

                        Files.write(Paths.get("array.txt"), array, Charset.forName("GBK"));

            }

}
```
### IO流总结

```Java
1:递归(理解)

            (1)方法定义中调用方法本身的现象

                        举例：老和尚给小和尚讲故事，我们学编程

            (2)递归的注意事项；

                        A:要有出口，否则就是死递归

                        B:次数不能过多，否则内存溢出

                        C:构造方法不能递归使用

            (3)递归的案例：

                        A:递归求阶乘

                        B:兔子问题

                        C:递归输出指定目录下所有指定后缀名的文件绝对路径

                        D:递归删除带内容的目录(小心使用)



2:IO流(掌握)

            (1)IO用于在设备间进行数据传输的操作

            (2)分类：

                        A:流向

                                    输入流            读取数据

                                    输出流            写出数据

                        B:数据类型

                                    字节流           

                                                            字节输入流

                                                            字节输出流

                                    字符流

                                                            字符输入流

                                                            字符输出流

                        注意：

                                    a:如果我们没有明确说明按照什么分，默认按照数据类型分。

                                    b:除非文件用windows自带的记事本打开我们能够读懂，才采用字符流，否则建议使用字节流。

            (3)FileOutputStream写出数据

                        A:操作步骤

                                    a:创建字节输出流对象

                                    b:调用write()方法

                                    c:释放资源



                        B:代码体现：

                                    FileOutputStream fos = new FileOutputStream("fos.txt");



                                    fos.write("hello".getBytes());



                                    fos.close();



                        C:要注意的问题?

                                    a:创建字节输出流对象做了几件事情?

                                    b:为什么要close()?

                                    c:如何实现数据的换行?

                                    d:如何实现数据的追加写入?

            (4)FileInputStream读取数据

                        A:操作步骤

                                    a:创建字节输入流对象

                                    b:调用read()方法

                                    c:释放资源



                        B:代码体现：

                                    FileInputStream fis = new FileInputStream("fos.txt");



                                    //方式1

                                    int by = 0;

                                    while((by=fis.read())!=-1) {

                                                System.out.print((char)by);

                                    }



                                    //方式2

                                    byte[] bys = new byte[1024];

                                    int len = 0;

                                    while((len=fis.read(bys))!=-1) {

                                                System.out.print(new String(bys,0,len));

                                    }



                                    fis.close();

            (5)案例：2种实现

                        A:复制文本文件

                        B:复制图片

                        C:复制视频

            (6)字节缓冲区流

                        A:BufferedOutputStream

                        B:BufferedInputStream

            (7)案例：4种实现

                        A:复制文本文件

                        B:复制图片

                        C:复制视频



3字符流

            IO流分类

                        字节流：

                                    InputStream

                                                FileInputStream

                                                BufferedInputStream

                                    OutputStream

                                                FileOutputStream

                                                BufferedOutputStream



                        字符流：

                                    Reader

                                                FileReader

                                                BufferedReader

                                    Writer

                                                FileWriter

                                                BufferedWriter
```
## 判断文件编码格式
UTF-8 编码前三个字节：其前3个字节的值就是-17、-69、-65
unicode编码前两个字节：-1 -2
Unicode big endian ：-2 -1
ANSI：其他

### 判断文本文档编码格式

```Java
public static String getFileEncode(String fileName) {
		String charSet = null;
		FileInputStream fileIS;
		try {
			fileIS = new FileInputStream(fileName);
			byte[] bf = new byte[3];
			fileIS.read(bf);
			fileIS.close();
			if (bf[0] == -17 && bf[1] == -69 && bf[2] == -65) {
				charSet = "UTF-8";
			} else if ((bf[0] == -1 && bf[1] == -2)) {
				charSet = "Unicode";
			} else if ((bf[0] == -2 && bf[1] == -1)) {
				charSet = "Unicode big endian";
			} else {
				charSet = "ANSI";
			}
		} catch (Exception e2) {
			logger.error("", e2);
		}

		return charSet;
	}

```


## java 中缓冲流读写组合


### 读文件

```java
 String s = "";
 int count = 1;
BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(path)));

while ((s = reader.readLine()) != null) {//逐行读取文件内容，不读取换行符和末尾的空格
                if (count == 2) {
                    String str = s.trim();
                    String[] strs = str.split(" ");
                    for (int i = 0; i < strs.length; i++) {
                        if (sn == 31*41) {
                            break;
                        }
                        double value = Double.parseDouble(strs[i]);
                        if (i == 0) {
                            minValue = value;
                            maxValue = value;
                        } else {
                            if (value < minValue) {
                                minValue = value;
                            }
                            if (value > maxValue) {
                                maxValue = value;
                            }
                        }
                        pressure[sn][0] = coordWorld[sn][0];
                        pressure[sn][1] = coordWorld[sn][1];
                        pressure[sn][2] = value;
                        sn++;
                    }
                    break;
                }
                count++;
            }
            reader.close();
```

## java 使用 字节流 递归创建 图片或者文本；

```Java
public static void copyAllFiles(File files, File fileCopy) throws Exception {
    try {
        //判断是否是文件
        if (files.isDirectory()) {
            // 如果不存在，创建文件夹
            if (!fileCopy.exists()) {
                fileCopy.mkdir();
            }
            // 将文件夹下的文件存入文件数组
            String[] fs = files.list();
            for (String f : fs) {
                //创建文件夹下的子目录
                File srcFile = new File(files, f);
                File destFile = new File(fileCopy, f);
                // 将文件进行下一层循环
                copyAllFiles(srcFile, destFile);
            }
        } else {

            // 创建文件输入的字节流用于读取文件内容，源文件
            FileInputStream fis = new FileInputStream(files);
            // 创建文件输出的字节流，用于将读取到的问件内容写到另一个磁盘文件中，目标文件
            FileOutputStream os = new FileOutputStream(fileCopy);
            // 创建字符串，用于缓冲
            int len = -1;
            byte[] b = new byte[1024];
            while (true) {
                // 从文件输入流中读取数据。每执行一次,数据读到字节数组b中
                len = fis.read(b); // 这里读一个数组,写的话就需要指定 len 了 
                if (len == -1) {
                    break;
                }
                os.write(b,0,len); // 注意：这里 wrie，不能读b.length, 最后一行b 可能不满足1024,所以这里一定要 0,len
            }
            fis.close();
            os.close();
        }

    } catch (IOException e) {
        System.out.println(e);
        e.printStackTrace();
    }

}
```