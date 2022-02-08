# easyExcel 直接注解返回excel 


## 参考

原文：https://blog.csdn.net/weixin_39928648/article/details/112433795



## 使用

引入pom

```xml
        <dependency>
            <groupId>com.gaoice</groupId>
            <artifactId>easyexcel-spring-boot-starter</artifactId>
            <version>1.0</version>
        </dependency>

```


```java
@RequestMapping("/downloadExcel")
    @ResponseExcel(fileName="Java知识日历20201101测试",sheetName = "同一班的同学名册",columnNames= {"学生姓名","学号","年龄"},classFieldNames = { "name","stuNo","age" })
    public List list() {
        return getStudents();
    }

```