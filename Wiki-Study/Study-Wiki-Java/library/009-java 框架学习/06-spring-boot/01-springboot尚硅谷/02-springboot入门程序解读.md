# Springboot启动流程


## Hello World探究

### 1pom文件

#### 1、父项目

```xml
 <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.9.RELEASE</version>
 </parent>
```

他的父项目是

```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring‐boot‐dependencies</artifactId>
    <version>1.5.9.RELEASE</version>
    <relativePath>../../spring‐boot‐dependencies</relativePath>
</parent>
```

他来真正管理Spring Boot应用里面的所有依赖版本；

Spring Boot的版本仲裁中心；

以后我们导入依赖默认是不需要写版本；（没有在dependencies里面管理的依赖自然需要声明版本号）


### 2、启动器


```xml
  <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
  </dependency>
```

```
spring-boot-starter-web：
spring-boot-starter：spring-boot场景启动器；帮我们导入了web模块正常运行所依赖的组件；
Spring Boot将所有的功能场景都抽取出来，做成一个个的starters（启动器），只需要在项目里面引入这些starter
相关场景的所有依赖都会导入进来。要用什么功能就导入什么场景的启动器
```


默认依赖包位置：


![](assets/009/06/01/02-1649575873759.png)

### 3、主程序类，主入口类

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


/**
 *  @SpringBootApplication 来标注一个主程序类，说明这是一个Spring Boot应用
 */
@SpringBootApplication
public class HelloWorldMainApplication {

    public static void main(String[] args) {

        // Spring应用启动起来
        SpringApplication.run(HelloWorldMainApplication.class,args);
    }
}

```

@SpringBootApplication: Spring Boot应用标注在某个类上说明这个类是SpringBoot的主配置类，SpringBoot

就应该运行这个类的main方法来启动SpringBoot应用；


```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication {}
```

@SpringBootConfiguration:Spring Boot的配置类；

标注在某个类上，表示这是一个Spring Boot的配置类；

@Configuration:配置类上来标注这个注解；这个是spring 的注解

配置类 ----- 配置文件；配置类也是容器中的一个组件；@Component

@EnableAutoConfiguration：开启自动配置功能；

以前我们需要配置的东西，Spring Boot帮我们自动配置；@EnableAutoConfiguration告诉SpringBoot开启自

动配置功能；这样自动配置才能生效；

```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({EnableAutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
    String ENABLED_OVERRIDE_PROPERTY = "spring.boot.enableautoconfiguration";

    Class<?>[] exclude() default {};

    String[] excludeName() default {};
}
```

@AutoConfigurationPackage：自动配置包

@Import(AutoConfigurationPackages.Registrar.class)：

Spring的底层注解@Import，给容器中导入一个组件；导入的组件由

AutoConfigurationPackages.Registrar.class；

**将主配置类（@SpringBootApplication标注的类）的所在包及下面所有子包里面的所有组件扫描到Spring容器；**

#### @Import(EnableAutoConfigurationImportSelector.class)；

给容器中导入组件？

EnableAutoConfigurationImportSelector：导入哪些组件的选择器；

将所有需要导入的组件以全类名的方式返回；这些组件就会被添加到容器中；

会给容器中导入非常多的自动配置类（xxxAutoConfiguration）；就是给容器中导入这个场景需要的所有组件，

并配置好这些组件；

![](assets/009/06/01/02-1654499196529.png)


* 如下找一个springboot下的一个包，

![](assets/009/06/01/02-1654499631006.png)

#### @AutoConfigurationPackage注解 

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package org.springframework.boot.autoconfigure;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.autoconfigure.AutoConfigurationPackages.Registrar;
import org.springframework.context.annotation.Import;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@Import({Registrar.class})
public @interface AutoConfigurationPackage {
}

```

对应的  @Import({Registrar.class}) 中的  Registrar 点进去。

![](assets/009/06/01/02-1654498311418.png)


![](assets/009/06/01/02-1649576879605.png)


![](assets/009/06/01/02-1649577287646.png)

以 debug形式启动，断点，查到springbootapplication注解信息；

![](assets/009/06/01/02-1654498527358.png)!

得到注解所在包：

![](assets/009/06/01/02-1654498591442.png)

有了自动配置类，免去了我们手动编写配置注入功能组件等的工作；

SpringFactoriesLoader.loadFactoryNames(EnableAutoConfiguration.class,classLoader)；

**Spring Boot在启动的时候从类路径下的META-INF/spring.factories中获取EnableAutoConfiguration指定的值，将这些值作为自动配置类导入到容器中，自动配置类就生效，帮我们进行自动配置工作；以前我们需要自己配置的东西，自动配置类都帮我们；**

J2EE的整体整合解决方案和自动配置都在spring-boot-autoconfigure-1.5.9.RELEASE.jar；

专题注解讲解可以查看：Spring注解版（谷粒学院）


#### 所以之前spring 使用的都不会说省略，只不过是springboot帮我们做了

![](assets/009/06/01/02-1654500126327.png)


## 使用Spring Initializer快速创建Spring Boot项目


### 1、IDEA：使用 Spring Initializer快速创建项目

IDE都支持使用Spring的项目创建向导快速创建一个Spring Boot项目；

选择我们需要的模块；向导会联网创建Spring Boot项目；

默认生成的Spring Boot项目；

    主程序已经生成好了，我们只需要我们自己的逻辑

    resources文件夹中目录结构
        static：保存所有的静态资源； js css images；
        templates：保存所有的模板页面；（Spring Boot默认jar包使用嵌入式的Tomcat，默认不支持JSP页
        面）；可以使用模板引擎（freemarker、thymeleaf）；
        application.properties：Spring Boot应用的配置文件；可以修改一些默认设置；



### idea 创建springboot项目

** 注意得连上网

![](assets/009/06/01/02-1649578270594.png)

![](assets/009/06/01/02-1649578301148.png)


![](assets/009/06/01/02-1649578350074.png)


![](assets/009/06/01/02-1649578431564.png)

![](assets/009/06/01/02-1649578446386.png) 


![](assets/009/06/01/02-1649578500010.png)

这里有个单元测试依赖，这里知道就行了

![](assets/009/06/01/02-1649578557065.png)

### 编写一个helloworld

![](assets/009/06/01/02-1649578757010.png)

### 2、STS使用 Spring Starter Project快速创建项目




继续学: 08 使用向导快速创建springboot应用 https://www.bilibili.com/video/BV1xW411g7mD?p=8&spm_id_from=pageDriver

