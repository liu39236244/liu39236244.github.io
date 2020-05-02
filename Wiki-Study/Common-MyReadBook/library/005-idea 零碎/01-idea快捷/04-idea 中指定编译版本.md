# idea 中pom 指定编译版本

## 1-1 pom中添加插件指定编译版本

> 1- 防止添加mudle 之后 自动换成1.5

```xml
<!-- 指定Target bytecode version  为1.7 防止因为添加了modle 变成1.5-->
<plugin>
   <groupId>org.apache.maven.plugins</groupId>
   <artifactId>maven-compiler-plugin</artifactId>
   <version>3.3</version>
   <configuration>
       <source>1.7</source>
       <target>1.7</target>
   </configuration>
</plugin>

```
