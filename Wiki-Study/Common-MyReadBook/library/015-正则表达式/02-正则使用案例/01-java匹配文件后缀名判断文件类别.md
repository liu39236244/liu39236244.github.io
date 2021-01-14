# java 匹配文件后缀


```java
    fileInfo.setName( mongodbFile.getFileName() );
    fileInfo.setAttachType(mongodbFile.getFileName().substring(mongodbFile.getFileName().indexOf(".")));
    String regPic = ".+(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$";
    String regVid = ".+(.rm|.rmvb|.mpeg1-4|.mov|.mtv|.dat|.wmv|.avi|.3gp|.dmv|.flv|.mp3|.mp4|.audio|.amr)$";
    String regWord = ".+(.txt|.doc|.pdf|.html|.htm|.xls|.xlsx)$";
    if (Pattern.compile( regPic ).matcher( fileInfo.getAttachType().toLowerCase() ).find()) {
        // 图片
        fileInfo.setType( 0 );
    } else if (Pattern.compile( regVid ).matcher( fileInfo.getAttachType().toLowerCase() ).find()) {
        // 视频
        fileInfo.setType( 1 );
    } else if (Pattern.compile( regWord ).matcher( fileInfo.getAttachType().toLowerCase() ).find()) {
        // 文档
        fileInfo.setType( 2 );
    }
```