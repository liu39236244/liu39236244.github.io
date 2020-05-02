# mybatis 使用错误总结


## 前端 时间类型传值 400 报错：

> 错误再现

```
JSON parse error: Cannot deserialize value of type `java.util.Date` from String "2019-08-23 15:48:31": not a valid representation (error: Failed to parse Date value '2019-08-23 15:48:31':
```

> 错误是 点击表单提交按钮 ，但是 不走后台control 的断点方法 里面 ，原因就是表单中有时间格式的字符串，但是后端转化为 对应bean 对应的属性的时候 ，转换失败！所以参考晚上解决了。

原文地址：https://blog.csdn.net/w719566673/article/details/83381625

1 方案
```
1.在实体Date类型的字段上使用@JsonFormat注解格式化日期
@JsonFormat(locale="zh", timezone="GMT+8", pattern="yyyy-MM-dd HH:mm:ss")
```

如下图：

![](assets/001/05/01-1566634648683.png)


 2.通过下面方式取消timestamps形式 （没有测试）

```js

objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
```

3.方法

```js
如果项目中使用json解析框架为fastjson框架，则可使用如下解决方法：
在实体字段上使用@JsonFormat注解格式化日期

@JsonFormat(shape=JsonFormat.Shape.STRING, pattern="yyyy-MM-dd HH:mm:ss")
```

## control 映射路径问题
## 多个control  使用同一个路径


> 多个control 映射一个路径，会提示无法

cant map controlName method ，

解决方案：只需要把control 中的 路径设置不一样就行 了