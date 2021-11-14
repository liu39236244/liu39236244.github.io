# java 获取文件流遇到的问题

## 线下获取项目中的静态文件中的图片 

### 报错

```
: 生成竖版证书报错
2021-09-08 14:02:32.690 ERROR 3108 --- [nio-6014-exec-6] c.s.m.controller.MongodbController       : Can't read input file!
2021-09-08 14:02:37.643  INFO 3108 --- [nio-6014-exec-5] c.s.m.controller.MongodbController       : 生成竖版证书报错

```

### 文件所在位置：


![](assets/003/10/01-1631083488305.png)

* 绘出证书背景图片(错误代码) *
Image srcImage = ImageIO.read(new File(this.getClass().getResource("/static/images/certificate01.png").getPath()));

// 正确代码（注意static 前面不能加 / ，斜杠）
Image srcImageChapter = ImageIO.read((this.getClass().getClassLoader().getResourceAsStream("static/images/certificate01.png")));