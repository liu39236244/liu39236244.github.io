# springcloud 中controller 下载服务器上文件案例


## 项目记录案例

```java
package com.graphsafe.xsn.controller.base;

import org.apache.commons.io.FileUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.IOException;


@Controller
@RequestMapping("/download")
public class DownloadController {

    // 直接前端调用此接口，二维码的方式也是将扫描二维码访问对应服务地址即可
    @RequestMapping("/app")
    public ResponseEntity<byte[]> apkDownloads(HttpServletRequest request, HttpServletResponse response) throws IOException {
        //String downLoadPathEXE = "D:\\deploye\\mnxsn.apk";  // doenLoadPath是文件路径(一般指服务器上的磁盘位置)
        String downLoadPathEXE =  "/**/mnxsn.apk";  // doenLoadPath是文件路径(一般指服务器上的磁盘位置)
        File fileExe = new File(downLoadPathEXE);
        if (fileExe.exists()){
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", fileExe.getName());
            return new ResponseEntity<>(FileUtils.readFileToByteArray(fileExe),headers, HttpStatus.OK);
        } else {
            System.out.println("文件不存在,请重试...");
            return null;
        }
    }
}

```