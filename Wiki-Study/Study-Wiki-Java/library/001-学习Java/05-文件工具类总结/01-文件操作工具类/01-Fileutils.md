# FileUtils文件操作工具类


## FileUtils 


```java
package com.gs.common.util;


import java.io.*;

/**
 * @description: TODO 文件处理通用类
 * @author: wzj
 * @create: 2018/8/22 9:12
 */
public class FileUtils {
    /**
     * 统计文件或文件夹大小（字节）
     * @param path
     * @return
     */
    public static long fileSize(String path){
        long l=0;
        File file=new File(path);
        if(file.isFile()){
            l=file.length();
        }
        else {
            File[] files=file.listFiles();
            if(files!=null){
                for(File file0:files){
                    l+=fileSize(file0.getPath());
                }
            }
        }
        return l;
    }

    /**
     * @param file
     * @return 返回文件MIME类型
     */
    /*public static String getMimeType(File file) {
        Magic parser = new Magic() ;
        String mimeType=null;
        try {
            MagicMatch match = parser.getMagicMatch(file,true);
            if(match!=null){
                mimeType= match.getMimeType();
            }
        } catch (MagicParseException e) {
            e.printStackTrace();
        } catch (MagicMatchNotFoundException e) {
            e.printStackTrace();
        } catch (MagicException e) {
            e.printStackTrace();
        }
//        System.out.println(mimeType) ;
        return mimeType;
    }*/
    /**
     * 写入空白文件内容
     * isCover为true 不覆盖源文件 ,false覆盖源文件
     * @param filePath
     * @param content
     */
    public static void writeFile(String filePath, String content,Boolean isCover) {
        BufferedWriter bw = null;
        try {
            bw = new BufferedWriter(new FileWriter(filePath,isCover));
            bw.write(content);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (bw != null) {
                try {
                    bw.close();
                } catch (IOException e) {
                    bw = null;
                }
            }
        }
    }

    /**
     * 替换文本内容
     * @param filePath 文件位置
     * @param oldStr 起始行
     * @param newStr 新文本
     */
    public static void editFile(String filePath,String oldStr,String newStr){
        String line = null;
        StringBuffer sb = new StringBuffer();
        BufferedReader buf = null;
        BufferedWriter bw = null;
        try{
            buf = new BufferedReader(new FileReader(filePath));
            while ((line=buf.readLine())!=null){
                if(line.startsWith(oldStr)) {
                    sb.append(newStr);
                }else {
                    sb.append(line);
                }
                sb.append(System.getProperty("line.separator"));
            }
            bw = new BufferedWriter(new FileWriter(filePath));
            bw.write(sb.toString());
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            if(buf!=null){
                try {
                    buf.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bw != null) {
                try {
                    bw.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    /**
     * 替换文件某一行 从该行开始直到文本末
     */
    public static void writeToFileLast(String filePath,String oldStr,String newStr){
        String line = null;
        StringBuffer sb = new StringBuffer();
        BufferedReader buf = null;
        BufferedWriter bw = null;
        try{
            buf = new BufferedReader(new FileReader(filePath));
            while ((line=buf.readLine())!=null){
                if(line.startsWith(oldStr)) {
                    sb.append(line);
                    sb.append(newStr);
                    break;
                }else {
                    sb.append(line);
                }
                sb.append(System.getProperty("line.separator"));
            }
            bw = new BufferedWriter(new FileWriter(filePath));
            bw.write(sb.toString());
        }catch (Exception e){
            e.printStackTrace();
        }finally {
            if(buf!=null){
                try {
                    buf.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
            if (bw != null) {
                try {
                    bw.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }


    /**
     * 创建文件并写入内容
     * @param path
     * @throws IOException
     */
    public static void createNewFile(String path,String content) throws IOException {
        File filename = new File(path);
        filename.createNewFile();
        FileUtils.writeFile(path,content,true);

    }

    /**
     * 删除指定文件
     */
    public static void deleteFile(String path) {
        File file = new File(path);
        boolean result = false;
        int tryCount = 0;
        while(!result && tryCount++ <10)
        {
            System.gc();
            result = file.delete();
        }
    }

    /**
     * 递归复制指定文件夹到目标文件夹下
     * @author grh
     * @param files
     * @param fileCopy
     */
    public static void copyAllFiles(File files, File fileCopy)  {
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
                    len = fis.read(b);
                    if (len == -1) {
                        break;
                    }
                    os.write(b,0,len);
                }
                fis.close();
                os.close();
            }

        } catch (IOException e) {
            System.out.println("出现异常");
            e.printStackTrace();
        }

    }

    /**
     *@Author: syb
     *@date: Create in 2019/8/5 14:34
     *@Description: 递归复制文件
     *@Param: [src, targ]
     *@return: void
     */
    static void copyFile(String src, String targ) {

        //复制目录文件
        String srcPath = src;
        String trgPath = targ;
        File file = new File(srcPath);
        try {
            if (file.exists()) {
                File[] files = file.listFiles();
                if (files != null) {
                    for (File file1 : files) {
                        if (file1.isFile()) {
                            org.apache.commons.io.FileUtils.copyFile(file1, new File(trgPath +"\\"+ file1.getName()));
                            //System.out.println("---复制文件"+file1+"-》 " + trgPath + "\\" + file1.getName());
                        } else {
                            String targetPath = trgPath + "\\"+file1.getName();
                            File f = new File(targetPath);
                            if (!f.exists()) {
                                f.mkdir();
                                copyFile(file1.getAbsolutePath(),f.getAbsolutePath());
                               // System.out.println("创建目录"+ f );
                            }
                        }
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }


}


```