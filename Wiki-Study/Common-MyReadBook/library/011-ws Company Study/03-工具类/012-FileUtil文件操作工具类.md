# 文件操作工具类


## 文件操作工具类我的


## other 其他的

### Fileutils1

```java
package test;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FileOperation {
  /**
   *  生成文件
   *  @param fileName
   */
  public static boolean createFile(File fileName){
    if(!fileName.exists()){  
      try {
        fileName.createNewFile();
      } catch (Exception e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }
    }
    return true;
  }

  /**
   * @description 读文件
   * @throws IOException
   */
  public static String readTxtFile(File fileName) throws IOException{
    String result = null;
    FileReader fileReader = null;
    BufferedReader bufferedReader = null;
    fileReader = new FileReader(fileName);
    bufferedReader = new BufferedReader(fileReader);

    String read = null;
    int count = 0;
    while((read = bufferedReader.readLine()) != null){
      result = result + count + read + "\r\n";
      count++;
    }

    if(bufferedReader != null){
      bufferedReader.close();
    }

    if(fileReader != null){
        fileReader.close();
    }

    System.out.println("¶ÁÈ¡ÎÄ¼þµÄÄÚÈÝÊÇ£º " + "\r\n" + result);
    return result;
  }

  /**
   * @description 写文件
   * @param args
   * @throws UnsupportedEncodingException
   * @throws IOException
   */
  public static boolean writeTxtFile(String content,File fileName) throws UnsupportedEncodingException, IOException{
    FileOutputStream o = null;
    o = new FileOutputStream(fileName);
    o.write(content.getBytes("UTF-8"));
    o.close();
    return true;
  }

  /**
   * @description 单元测试
   * @throws IOException
   */
  public static void main(String[] args) throws IOException {
    File file = new File("d:/hello.txt");
    Date date = new Date();
    SimpleDateFormat day = new SimpleDateFormat("yyyyMMddHHmmss");
    String dateName = day.format(date);
    File copyFile = new File("d:/" + dateName + ".txt");
    String content = readTxtFile(file);
    createFile(copyFile);
    writeTxtFile(content,copyFile);
  }


  FileReader fileReader=new FileReader(filename);
  BufferedReader br = new BufferedReader(fileReader);
  StringBuilder sb=new StringBuilder();
  String str;
  while ((str=br.readLine())!=null){
      sb.append(str);
  }
  br.close();
  fileReader.close();
  return sb.toString();
}
```
