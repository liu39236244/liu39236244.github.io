# Get 请求问题

## 


## 后端接受get 请求传参 使用实体

原文：
[SpringBoot用实体接收Get请求传递过来的多个参数（绝对可用）](https://blog.csdn.net/qq_19734597/article/details/88897710)


### 1 不带有任何注解

一、Controller层不带任何注解接收参数
第一种方法是最简单的，严重怀疑以前怎么没有用，谁知道呢。。不过这次是真的管用了，最简单的方式就是Controller接口入参不加任何注解！！！SpringBoot自动做了处理。代码如下：

```java
/**
 * @author zhangzhixiang
 * @since v1.0.0
 */
@RestController
@RequestMapping(path = "/ui/institution")
public class InstitutionManagementController {
 
    @GetMapping(value = "/pageQueryForAssign")
    public void pageQueryInstitutionsForAssign(InstitutionQueryDTO queryDTO) {
 
    }
}

```

其实重点就是InstitutionQueryDTO旁边没有任何注解，这样前端正常传Get参数就好，前端传参格式示例如下：

```

    http://ip/ui/institution/pageQueryForAssign?name='xxx'&sex='男'
```

这里的name和sex是InstitutionQueryDTO实体中的属性，SpringBoot会帮我们自动填充到实体中。



### 2 通过ModelAttribute 传

二、Controller层通过@ModelAttribute接收参数
这个写法是在网上阅读文章找到的，这种方法我也记录一下。


```java

/**
 * @author zhangzhixiang
 * @since v1.0.0
 */
@RestController
@RequestMapping(path = "/ui/institution")
public class InstitutionManagementController {
 
    @GetMapping(value = "/test")
    public void test(@ModelAttribute InstitutionQueryDTO queryDTO){
 
    }

}
```

这里的重点是@ModelAttribute注解，他也会将前端传过来的参数填充到业务实体中，前端传参格式与方法一相同。

多个参数的画估计不行。博主走过的坑