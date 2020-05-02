# 使用 maven-shade-plugin 解决spark jar包冲突


## maven-shade-plugin 使用

原文地址：https://blog.csdn.net/qq_35799003/article/details/70226547
### 部分摘录

```
执行mvn package，生成两个jar文件，一个是原始的original-shade.test-1.0-SNAPSHOT.jar，一个是可执行的shade.test-1.0-SNAPSHOT.jar。
执行java -jar shade.test-1.0-SNAPSHOT.jar，效果如下：
```



## 使用maven-shade-plugin插件解决spark依赖冲突问题
原文：https://blog.csdn.net/qq_25827845/article/details/54973182

```
依赖冲突：NoSuchMethodError,ClassNotFoundException
      当用户应用于Spark本身依赖同一个库时可能会发生依赖冲突，导致程序奔溃。依赖冲突表现为在运行中出现NoSuchMethodError或者ClassNotFoundException的异常或者其他与类加载相关的JVM异常。

此时，若能确定classpath中存在这个包，则错误是因为classpath中存在2个不同版本的jar包了，比如常见的log4j，你在classpath中添加了log4j.jar，而spark的lib目录中也有log4j.jar，而且这2个jar包版本不一致的话，就会出现依赖冲突问题。



解决办法有2种：
（1）修改你的应用，使其使用的依赖库的版本与Spark所使用的相同。
（2）使用称为shading的方式打包你的应用。使用maven-shade-plugin插件进行高级配置来支持这种打包方式。shading可以让你以另一种命名空间保留冲突的包，并自动重写应用的代码使得它们使用重命名后的版本。这种技术有些简单粗暴，不过对于解决运行时依赖冲突的问题非常有效。



关于maven-shade-plugin插件的详细介绍请参阅：http://www.jianshu.com/p/7a0e20b30401#

maven-shade-plugin插件的官方介绍：http://maven.apache.org/plugins/maven-shade-plugin/index.html



Java 工程经常会遇到第三方Jar 包冲突，使用 maven-shade-plugin 解决 jar 或类的多版本冲突。 maven-shade-plugin 在打包时，可以将项目中依赖的 jar 包中的一些类文件打包到项目构建生成的 jar 包中，在打包的时候把类重命名。

举例如下：

下面的配置将org.codehaus.plexus.util jar 包重命名为org.shaded.plexus.util。


```

配置如下

```xml

<build>
    <plugins>
      <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-shade-plugin</artifactId>
        <version>2.4.3</version>
        <executions>
          <execution>
            <phase>package</phase>
            <goals>
              <goal>shade</goal>
            </goals>
            <configuration>
              <relocations>
                <relocation>
                  <pattern>org.codehaus.plexus.util</pattern>
                  <shadedPattern>org.shaded.plexus.util</shadedPattern>
                  <excludes>
                    <exclude>org.codehaus.plexus.util.xml.Xpp3Dom</exclude>
                    <exclude>org.codehaus.plexus.util.xml.pull.*</exclude>
                  </excludes>
                </relocation>
              </relocations>
            </configuration>
          </execution>
        </executions>
      </plugin>
</plugins>


```

## 2- maven-plugins 插件打jar包

* 原文地址：http://liugang594.iteye.com/blog/2093082

总结：
引入
```xml
<build>  
    <plugins>  
        <plugin>  
            <groupId>org.apache.maven.plugins</groupId>  
            <artifactId>maven-dependency-plugin</artifactId>  
            <version>2.8</version>  
        </plugin>  
    </plugins>  
</build>  
```
copy 与 unpack
copy 是把包复制过去，unpack 则是直接解压

---
### 2-1 没有住清单属性

```xml
<plugin>
<groupId>org.apache.maven.plugins</groupId>
<artifactId>maven-jar-plugin</artifactId>  
            <version>2.6</version>  
            <configuration>  
                <archive>  
                    <manifest>  
                        <addClasspath>true</addClasspath>  
                        <classpathPrefix>lib/</classpathPrefix>  
                        <mainClass>com.gacl.maven.Hello</mainClass>  <!-- 包含main方法主类的全路径 -->
                    </manifest>  
                </archive>  
            </configuration>
</plugin>
```


### 2-2 案例
* 简单maven 打包,

```xml

<properties>
   <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
</properties>

<dependencies>
   <dependency>
       <groupId>junit</groupId>
       <artifactId>junit</artifactId>
       <version>3.8.1</version>
       <scope>test</scope>
   </dependency>
</dependencies>
<build>
 <plugins>
   <plugin>
       <groupId>org.apache.maven.plugins</groupId>
       <artifactId>maven-shade-plugin</artifactId>
       <version>1.2.1</version>
       <executions>
           <execution>
               <phase>package</phase>
               <goals>
                       <goal>shade</goal>
               </goals>
                   <configuration>
                       <transformers>
                           <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                               <mainClass>com.mkyong.App</mainClass>
                           </transformer>
                       </transformers>
                   </configuration>
           </execution>
       </executions>
    </plugin>
 </plugins>
</build>
</project>
```
