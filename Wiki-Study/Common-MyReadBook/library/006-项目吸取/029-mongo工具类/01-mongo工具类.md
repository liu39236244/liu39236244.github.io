# mongo工具类


## 工具类1

```java
package com.graphsafe.xsn.utils;

import com.graphsafe.xsn.model.base.dto.MongodbFile;
import com.mongodb.client.gridfs.GridFSBuckets;
import com.mongodb.client.gridfs.model.GridFSFile;
import org.apache.tomcat.util.http.fileupload.IOUtils;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.gridfs.GridFsResource;
import org.springframework.data.mongodb.gridfs.GridFsTemplate;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * @description: mogodb的工具类
 * @author: HXf
 * @create: 2018-12-11 13:37
 **/
@Component
public class MongoDbUtil {

    @Autowired
    private GridFsTemplate gridFsTemplate;
    @Resource
    private MongoDbFactory mongoDbFactory;



    /**
     * @Description:上传文件到mongodb返回文件id
     * @Param: [file]
     * @return: java.lang.String
     **/
    public  String  uploadFileBackId(MultipartFile file, HttpServletRequest request){
        try {
            ObjectId store = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), request.getContentType());
            return store.toString();
        } catch (IOException e) {
            System.out.println("获取文件输入流错误。。。。。");
            e.printStackTrace();
            return null;
        }
    }

    /**
     * @Description:上传文件到mongodb返回文件
     * @Param: [file]
     * @return: java.lang.String
     **/
    public GridFSFile uploadFileBackFile(MultipartFile file, HttpServletRequest request){
        try {
            ObjectId store = gridFsTemplate.store(file.getInputStream(), file.getOriginalFilename(), request.getContentType());
            Query query = Query.query(Criteria.where("_id").is(store.toString()));
            // 查询单个文件
            GridFSFile gfsfile = gridFsTemplate.findOne(query);
            return gfsfile;
        } catch (IOException e) {
            System.out.println("获取文件输入流错误。。。。。");
            e.printStackTrace();
            return null;
        }
    }

    /**
    * @Description: 根据mongodb中文件id下载文件
    * @Param: [response, request, fileId]
    * @return: void
    */
    public  void downloadFile(HttpServletResponse response, HttpServletRequest request, String fileId){
        try {
            Query query = Query.query(Criteria.where("_id").is(fileId));
            // 查询单个文件
            GridFSFile gfsfile = gridFsTemplate.findOne(query);
            if (gfsfile == null) {
                return;
            }
            GridFsResource gridFsResource = new GridFsResource(gfsfile,GridFSBuckets.create(mongoDbFactory.getDb()).openDownloadStream(gfsfile.getObjectId()));
            String fileName = gfsfile.getFilename().replace(",", "");
            //处理中文文件名乱码
            if (request.getHeader("User-Agent").toUpperCase().contains("MSIE") ||
                    request.getHeader("User-Agent").toUpperCase().contains("TRIDENT")
                    || request.getHeader("User-Agent").toUpperCase().contains("EDGE")) {
                fileName = java.net.URLEncoder.encode(fileName, "UTF-8");
            } else {
                //非IE浏览器的处理：
                fileName = new String(fileName.getBytes("UTF-8"), "ISO8859-1");
            }
            // 通知浏览器进行文件下载
            response.setHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");
            IOUtils.copy(gridFsResource.getInputStream(),response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    /**
     * @Description: 根据mongodb中文件id获取文件的导出流数据，不让浏览器显示下载提示
     */
    public  void getDownloadOutputStream(HttpServletResponse response, String fileId){
        try {
            Query query = Query.query(Criteria.where("_id").is(fileId));
            // 查询单个文件
            GridFSFile gfsfile = gridFsTemplate.findOne(query);
            if (gfsfile == null) {
                return;
            }
            GridFsResource gridFsResource=new GridFsResource(gfsfile,GridFSBuckets.create(mongoDbFactory.getDb()).openDownloadStream(gfsfile.getObjectId()));
            IOUtils.copy(gridFsResource.getInputStream(),response.getOutputStream());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public  void deleteByFileId(String fileId){
        Query query = Query.query(Criteria.where("_id").is(fileId));
        GridFSFile gfsfile = gridFsTemplate.findOne(query);
        if (gfsfile == null) {
            return;
        }
        gridFsTemplate.delete(query);
    }

    /**
    * @Description: 根据文件id查询文件信息
    */
    public MongodbFile getMongodFileInfoById(String fileId){
        Query query = Query.query(Criteria.where("_id").is(fileId));
        GridFSFile gfsfile = gridFsTemplate.findOne(query);
        if(gfsfile!=null){
            String fileName = gfsfile.getFilename();
            if(fileName.contains(".")){
                String type = fileName.substring(fileName.lastIndexOf("."),fileName.length());
                return new MongodbFile(fileId,fileName,gfsfile.getLength(),gfsfile.getUploadDate(),type);
            }
        }
        return null;
    }


    public String uploadFileBackFileId(InputStream inputStream, String fileName) {
        ObjectId objectId = gridFsTemplate.store(inputStream, fileName);
        return objectId.toString();
    }


    //上传excel
    public  String  uploadExcelBackId(File file, HttpServletRequest request){
        try {
            InputStream inputStream  = new FileInputStream(file);
            ObjectId store = gridFsTemplate.store(inputStream, file.getName(), request.getContentType());
            return store.toString();
        } catch (IOException e) {
            System.out.println("获取文件输入流错误。。。。。");
            e.printStackTrace();
            return null;
        }
    }
}



```
