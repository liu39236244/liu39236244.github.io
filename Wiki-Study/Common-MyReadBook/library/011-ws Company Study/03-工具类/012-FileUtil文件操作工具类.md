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



## 文件操作工具类



```java
package com.graphsafe.xsn;

import com.suobei.xinzhiying.base.result.ResponseMap;
import com.suobei.xinzhiying.base.utils.aliyun.AliOssUtils;
import com.suobei.xinzhiying.base.utils.commons.CommonUtils;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.ReadableByteChannel;
import java.util.ArrayList;
import java.util.List;

public class FileUtils {

    /*判断文件是否存在*/
    public static boolean isExists(String filePath) {
        File file = new File(filePath);
        return file.exists();
    }

    /*判断是否是文件夹*/
    public static boolean isDir(String path) {
        File file = new File(path);
        if(file.exists()){
            return file.isDirectory();
        }else{
            return false;
        }
    }

    /**
     * 文件或者目录重命名
     * @param oldFilePath 旧文件路径
     * @param newName 新的文件名,可以是单个文件名和绝对路径
     * @return
     */
    public static boolean renameTo(String oldFilePath, String newName) {
        try {
            File oldFile = new File(oldFilePath);
            //若文件存在
            if(oldFile.exists()){
                //判断是全路径还是文件名
                if (newName.indexOf("/") < 0 && newName.indexOf("\\") < 0){
                    //单文件名，判断是windows还是Linux系统
                    String absolutePath = oldFile.getAbsolutePath();
                    if(newName.indexOf("/") > 0){
                        //Linux系统
                        newName = absolutePath.substring(0, absolutePath.lastIndexOf("/") + 1)  + newName;
                    }else{
                        newName = absolutePath.substring(0, absolutePath.lastIndexOf("\\") + 1)  + newName;
                    }
                }
                File file = new File(newName);
                //判断重命名后的文件是否存在
                if(file.exists()){
                    System.out.println("该文件已存在,不能重命名");
                }else{
                    //不存在，重命名
                    return oldFile.renameTo(file);
                }
            }else {
                System.out.println("原该文件不存在,不能重命名");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }


    /*文件拷贝操作*/
    public static void copy(String sourceFile, String targetFile) {
        File source = new File(sourceFile);
        File target = new File(targetFile);
        target.getParentFile().mkdirs();
        FileInputStream fis = null;
        FileOutputStream fos = null;
        FileChannel in = null;
        FileChannel out = null;
        try {
            fis = new FileInputStream(source);
            fos = new FileOutputStream(target);
            in = fis.getChannel();//得到对应的文件通道
            out = fos.getChannel();//得到对应的文件通道
            in.transferTo(0, in.size(), out);//连接两个通道，并且从in通道读取，然后写入out通道
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (out != null){
                    out.close();
                }
                if (in != null){
                    in.close();
                }
                if (fos != null){
                    fos.close();
                }
                if (fis != null){
                    fis.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    /*读取Text文件操作*/
    public static String readText(String filePath) {
        String lines = "";
        try {
            FileReader fileReader = new FileReader(filePath);
            BufferedReader bufferedReader = new BufferedReader(fileReader);
            String line = null;
            while ((line = bufferedReader.readLine()) != null) {
                lines += line + "\n";
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return lines;
    }

    /*写入Text文件操作*/
    public static void writeText(String filePath, String content,boolean isAppend) {
        FileOutputStream outputStream = null;
        OutputStreamWriter outputStreamWriter = null;
        BufferedWriter bufferedWriter = null;
        try {
            outputStream = new FileOutputStream(filePath,isAppend);
            outputStreamWriter = new OutputStreamWriter(outputStream);
            bufferedWriter = new BufferedWriter(outputStreamWriter);
            bufferedWriter.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try{
                if(bufferedWriter != null){
                    bufferedWriter.close();
                }
                if (outputStreamWriter != null){
                    outputStreamWriter.close();
                }
                if (outputStream != null){
                    outputStream.close();
                }
            }catch(Exception e){
                e.printStackTrace();
            }
        }
    }

    /**
     * 汪敏 2017-12-06
     * oss通用单张图片上传
     * @param picture 大文本对象数组
     * @param filePath 文件保存路径
     * @return
     */
    public static ResponseMap upload(MultipartFile picture, String filePath) {
        ResponseMap responseMap = ResponseMap.getInstance();
        List<String> imageUrlList = new ArrayList<>();
        try{
            if (picture.getSize() > 0){
                String originalFilename = picture.getOriginalFilename(); //获取图片原来名称
                String filePathName = filePath + CommonUtils.uuid() + "."+ FilenameUtils.getExtension(originalFilename); //真实的图片保存相对路径
                boolean isOK = AliOssUtils.saveFileObject(filePathName,picture.getInputStream());//将图片上传到oss服务器
                if(isOK){
                    imageUrlList.add(filePathName);
                    responseMap.ok("上传成功");
                }else{
                    return responseMap.error("上传失败");
                }
            }
            responseMap.put(ResponseMap.IMAGE_URL_LIST,imageUrlList);
        }catch(Exception e){
            e.printStackTrace();
        }
        return responseMap;
    }

    /**
     * 汪敏 2017-12-06
     * oss通用图片批量上传
     * @param picture 大文本对象数组
     * @param ossFilePath 文件保存oss路径,不要域名
     * @return
     */
    public static ResponseMap upload(MultipartFile[] picture, String ossFilePath) {
        ResponseMap responseMap = ResponseMap.getInstance();
        List<String> imageUrlList = new ArrayList<>();
        try{
            for (MultipartFile pic : picture) {
                if (pic.getSize() > 0){
                    String originalFilename = pic.getOriginalFilename(); //获取图片原来名称
                    String filePathName = ossFilePath + CommonUtils.uuid() + "."+ FilenameUtils.getExtension(originalFilename); //真实的图片保存相对路径
                    boolean isOK = AliOssUtils.saveFileObject(filePathName,pic.getInputStream());//将图片上传到oss服务器
                    //boolean isOK = AliOssUtils.breakPointUpload(filePathName,pic);//将图片上传到oss服务器
                    if(isOK){
                        imageUrlList.add(filePathName);
                        responseMap.put(ResponseMap.MESSAGE,"上传成功");
                    }else{
                        return responseMap.error("上传失败");
                    }
                }
            }
            responseMap.put(ResponseMap.IMAGE_URL_LIST,imageUrlList);
        }catch(Exception e){
            e.printStackTrace();
        }
        return responseMap;
    }

    /**
     * 将本地文件上传到oss系统
     * @param localFilePath 本地文件目录路径
     * @param ossFilePath oss目录路径
     * @return
     */
    public static ResponseMap upload(String localFilePath, String ossFilePath) {
        ResponseMap responseMap = ResponseMap.getInstance();
        try{
            File[] files = fileSort(localFilePath);
            List<String> imageUrlList = AliOssUtils.saveFileBatch(ossFilePath,files);//将图片上传到oss服务器
            System.out.println("图片上传oss完成");
            responseMap.put(ResponseMap.IMAGE_URL_LIST,imageUrlList);
        }catch(Exception e){
            e.printStackTrace();
            responseMap.error("上传失败");
        }
        return responseMap;
    }



    /**
     * 汪敏 2017-12-20
     * 服务器通用图片批量上传
     * @param picture 大文本对象数组
     * @param mp4TempDir 文件保存全路径
     * @return
     */
    public static boolean uploadLocal(MultipartFile[] picture, String mp4TempDir) {
        boolean bool = false;
        try{
            for (int i = 0; i < picture.length; i++) {
                if (picture[i].getSize() > 0){
                    String originalFilename = picture[i].getOriginalFilename(); //获取图片原来名称
                    String filePathName = mp4TempDir + i + "."+ FilenameUtils.getExtension(originalFilename); //真实的图片保存相对路径
                    picture[i].transferTo(new File(filePathName));
                }
            }
            bool = true;
            System.out.println("图片上传到服务器完成");
        }catch(Exception e){
            e.printStackTrace();
        }
        return bool;
    }

    /**
     * 通过上一层目录和目录名得到最后的目录层次
     * @param previousDir 上一层目录
     * @param dirName 当前目录名
     * @return
     */
    public static String getSaveDir(String previousDir, String dirName) {
        if (StringUtils.isNotBlank(previousDir)){
            dirName = previousDir + "/" + dirName + "/";
        }else {
            dirName = dirName + "/";
        }
        return dirName;
    }

    /**
     * 如果目录不存在，就创建文件
     * @param dirPath
     * @return
     */
    public static String mkdirs(String dirPath) {
        try{
            File file = new File(dirPath);
            if(!file.exists()){
                file.mkdirs();
            }
        }catch(Exception e){
            e.printStackTrace();
        }
        return dirPath;
    }


    /**
     * 在Linux系统中读取文件时将文件排序
     * @param filePath
     * @return
     */
    public static File[] fileSort(String filePath){
        File[] files = new File(filePath).listFiles();
        int filesLength = files.length;
        String nextFix = FilenameUtils.getExtension(files[0].getName());
        File[] fileNames = new File[filesLength];
        for (int i = 0; i < filesLength; i++) {
            for (int j = 0; j < filesLength; j++) {
                String absolutePath = files[j].getAbsolutePath();
                if (absolutePath.endsWith("/" + i + "." + nextFix) || absolutePath.endsWith("\\" + i + "." + nextFix)){
                    fileNames[i] = new File(absolutePath);
                    break;
                }
            }
        }
        return fileNames;
    }


    /**
     * 普通文件下载，文件在服务器里面
     * @param request
     * @param response
     */
    public static void download(HttpServletRequest request, HttpServletResponse response) {
        try{
            //设置文件下载时，文件流的格式
            String realPath = request.getServletContext().getRealPath("/");
            realPath = realPath + "index.jsp";
            System.out.println("下载地址="+realPath);
            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(realPath));
            BufferedOutputStream bos =  new BufferedOutputStream(response.getOutputStream());
            //下面这个变量保存的是要下载的文件拼接之后的完整路径
            String downName = realPath.substring(realPath.lastIndexOf("/") + 1);
            System.out.println("下载文件名="+downName);
            response.setHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode(downName,"utf-8"));
            byte[] buff = new byte[2048];
            int bytesRead;
            while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
                bos.write(buff, 0, bytesRead);
            }
            try {
                bis.close();
                bos.close();
            }catch (Exception e){
                e.printStackTrace();;
            }
        }catch(Exception e){
            e.printStackTrace();
            System.out.println("下载出错");
        }
    }

    /**
     * 普通文件下载，文件路径固定
     * @param targetFile 下载的文件路径
     * @param response
     */
    public static void download(String targetFile, HttpServletResponse response) {
        try{
            System.out.println("下载文件路径="+targetFile);
            //设置文件下载时，文件流的格式
            BufferedInputStream bis = new BufferedInputStream(new FileInputStream(targetFile));
            BufferedOutputStream bos =  new BufferedOutputStream(response.getOutputStream());
            //下面这个变量保存的是要下载的文件拼接之后的完整路径
            String downName = targetFile.substring(targetFile.lastIndexOf("/") + 1);
            System.out.println("下载文件名="+downName);
            response.setHeader("Content-Disposition","attachment;filename="+ URLEncoder.encode(downName,"utf-8"));
            byte[] buff = new byte[2048];
            int bytesRead;
            while (-1 != (bytesRead = bis.read(buff, 0, buff.length))) {
                bos.write(buff, 0, bytesRead);
            }
            try {
                bis.close();
                bos.close();
            }catch (Exception e){
                e.printStackTrace();;
            }
        }catch(Exception e){
            e.printStackTrace();
            System.out.println("下载出错");
        }
    }

    /**
     * 下载网络文件
     * @param targetFile
     * @param response
     */
    public static void downloadUrl(String targetFile, HttpServletResponse response) {
        try{
            URL website = new URL(targetFile);
            ReadableByteChannel rbc = Channels.newChannel(website.openStream());
            FileOutputStream fos = new FileOutputStream("D:/img/1.zip");//例如：test.txt
            fos.getChannel().transferFrom(rbc, 0, Long.MAX_VALUE);
            fos.close();
        }catch(Exception e){
            e.printStackTrace();
            System.out.println("下载出错");
        }
    }

      /**
      * 删除文件
      * @param fileName
      * @return
      */

      public static boolean delete (String fileName){
          try{
              File sourceFile = new File(fileName);
              if(sourceFile.isDirectory()){
                  for (File listFile : sourceFile.listFiles()) {
                      delete(listFile.getAbsolutePath());
                  }
              }
              return sourceFile.delete();
          }catch(Exception e){
              e.printStackTrace();
          }
          return false;
      }
}

```