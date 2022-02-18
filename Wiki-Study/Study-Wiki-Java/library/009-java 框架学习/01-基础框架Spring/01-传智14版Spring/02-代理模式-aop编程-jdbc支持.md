# 代理模式 、aop编程 -jdbc 支持

## spring 模块的复习

```
共性问题：
	1. 服务器启动报错，什么原因？
		* jar包缺少、jar包冲突
			1) 先检查项目中是否缺少jar包引用
			2) 服务器: 检查jar包有没有发布到服务器下；
				用户库jar包，需要手动发布到tomcat. (每次新建项目)
			3) 重新发布项目

		* 配置文件错误
			(web.xml / struts.xml /bean.xml /hibernate.xml / *.hbm.xml)
			明确的提示

		* 端口占用

		* webapps项目过多
			当前项目没有问题，有可能是其他项目出错，这样启动也会报错！但这个错误不是当前错误报的，所以不影响当前项目运行.

		注意：
			一般开发中，一个tomcat下只有一个项目。
		
	2. 一般启动报错： ClassNotFoundException异常
		少jar包。

	3. 访问404，什么原因？
		1）客户端路径写错，或跳转错误。
		2）启动报错
			Web项目中，启动后一定要看下，是否报错。


	4. 点击某个功能报错。
		后台代码错误：
			 找到页面，点击哪个操作，提交到哪个地址
			--》后台在提交地址的第一行打断点


Spring提供了一站式解决方案：
	1） Spring Core  spring的核心功能： IOC容器, 解决对象创建及依赖关系
	2） Spring Web  Spring对web模块的支持。
						-à 可以与struts整合,让struts的action创建交给spring
					    -à spring mvc模式
	3） Spring DAO  Spring 对jdbc操作的支持  【JdbcTemplate模板工具类】
	4） Spring ORM  spring对orm的支持： 
						à 既可以与hibernate整合，【session】
						à 也可以使用spring的对hibernate操作的封装
	5）Spring AOP  切面编程
	6）SpringEE   spring 对javaEE其他模块的支持

```



## 本模块目标

```
目标：
	1） 代理模式
		静态代理
		动态代理
		Cglib代理
	2）手动实现AOP编程 【代理模式】
	3）AOP编程
		 * 注解方式实现
		 * XMl配置方式实现
	4） Spring DAO  
		Spring对jdbc操作的支持

```


##  代理模式


###  概述


 代理（Proxy）是一种设计模式， 提供了对目标对象另外的访问方式；即通过代理访问目标对象。 这样好处： 可以在目标对象实现的基础上，增强额外的功能操作。(扩展目标对象的功能)。

举例：明星（邓紫棋）---经纪人<-------用户  

	    目标           （代理）


![](assets/009/01/01/02-1643880271469.png)


代理模式的关键点： 代理对象与目标对象。


###  静态代理

```
静态代理，
	1） 代理对象，要实现与目标对象一样的接口；
	2） 举例:
			保存用户(模拟)
				Dao  ,  直接保存
				DaoProxy, 给保存方法添加事务处理



总结静态代理：
	1）可以做到在不修改目标对象的功能前提下，对目标对象功能扩展。
	2）缺点：
		--》  因为代理对象，需要与目标对象实现一样的接口。所以会有很多代理类，类太多。
		--》  一旦接口增加方法，目标对象与代理对象都要维护。

解决：
	代理工厂？  可以使用动态代理。

```

#### 示例；

> 1 目标对象 

接口对象

IUserDao.java

```java




package cn.itcast.b_dynamic;

// 接口
public interface IUserDao {

	void save();
	
}

```



UserDao.java


```java
package cn.itcast.a_static;

/**
 * 目标对象
 */
public class UserDao implements IUserDao{

	@Override
	public void save() {
		System.out.println("-----已经保存数据！！！------");
	}

}

```

> 2 代理对象 

UserDaoProxy.java

```java
package cn.itcast.a_static;

/**
 * 代理对象(静态代理)
 * 	   代理对象，要实现与目标对象一样的接口
 *
 */
public class UserDaoProxy implements IUserDao{

	// 接收保存目标对象
	private IUserDao target;
	public UserDaoProxy(IUserDao target) {
		this.target = target;
	}
	
	@Override
	public void save() {
		System.out.println("开始事务...");
		
		target.save(); 			// 执行目标对象的方法
		
		System.out.println("提交事务...");
	}
	
	
	
}


```

> 4 调用


```java
package cn.itcast.a_static;

public class App {

	public static void main(String[] args) {
		// 目标对象
		IUserDao target = new UserDao();
		
		// 代理
		IUserDao proxy = new UserDaoProxy(target);
		proxy.save();  // 执行的是，代理的方法
	}
}

```

> 4 我的理解


感觉没有实质意义，就是多写了一个类；注入目标对象；实现同一个方法就是为了开发规范；并不是说静态代理代理对象一定要实现某个接口的某个方法，必须让代理类实现接口重写一个一模一样名字的方法其实就是为了规范；



### 动态代理

动态代理，
	1）代理对象，不需要实现接口；
	2）代理对象的生成，是利用JDKAPI， 动态的在内存中构建代理对象(需要我们指定创建 代理对象/目标对象 实现的接口的类型；);
	3)  动态代理， JDK代理， 接口代理；

JDK中生成代理对象的API：
|-- Proxy
	static Object newProxyInstance(
ClassLoader loader,       指定当前目标对象使用类加载器
 Class<?>[] interfaces,     目标对象实现的接口的类型
InvocationHandler h       事件处理器
)  


动态代理总结：
	代理对象不需要实现接口，但是目标对象一定要实现接口；否则不能用动态代理！
	(class  $Proxy0  implements IuserDao)



思考：
	有一个目标对象，想要功能扩展，但目标对象没有实现接口，怎样功能扩展？
	Class  UserDao{}
	// 子类的方式
	Class subclass  extends  UserDao{}
	
	以子类的方式实现(cglib代理)



#### 案例 


> 1 接口  IUserDao.java 


```java
package cn.itcast.b_dynamic;

// 接口
public interface IUserDao {

	void save();
	
}

```


> 2 目标对象

UserDao.java

```java
package cn.itcast.b_dynamic;

/**
 * 目标对象
 *
 */
public class UserDao implements IUserDao{

	@Override
	public void save() {
		System.out.println("-----已经保存数据！！！------");
	}

}


```

> 3 动态代理工厂类

ProxyFactory.java

```java
package cn.itcast.b_dynamic;

import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;

/**
 * 给所有的dao创建代理对象【动态代理】
 * 
 * 代理对象，不需要实现接口
 *
 */
public class ProxyFactory {

	// 维护一个目标对象
	private Object target;
	public ProxyFactory(Object target){
		this.target = target;
	}
	
	// 给目标对象，生成代理对象  
	public Object getProxyInstance() {
		return Proxy.newProxyInstance(
				target.getClass().getClassLoader(), 
				target.getClass().getInterfaces(),
				new InvocationHandler() {
					@Override
					public Object invoke(Object proxy, Method method, Object[] args)
							throws Throwable {
						System.out.println("开启事务");
						
						// 执行目标对象方法, 这里如果方法只想给特定方法添加事务，那么判断method的名字即可
						Object returnValue = method.invoke(target, args);
						
						System.out.println("提交事务");
						return returnValue;
					}
				});
	}
}

```

> 4 调用


App.java

```java
package cn.itcast.b_dynamic;

public class App {

	public static void main(String[] args) {
		// 目标对象
		IUserDao target = new UserDao();
		// 【原始的类型 class cn.itcast.b_dynamic.UserDao】
		System.out.println(target.getClass());
		
		// 给目标对象，创建代理对象
		IUserDao proxy = (IUserDao) new ProxyFactory(target).getProxyInstance();
		// class $Proxy0   内存中动态生成的代理对象
		System.out.println(proxy.getClass());
		
		// 执行方法   【代理对象】
		proxy.save();
	}
}

```



 ### cglib代理


```
Cglib代理，也叫做子类代理。在内存中构建一个子类对象从而实现对目标对象功能的扩展。

	JDK的动态代理有一个限制，就是使用动态代理的对象必须实现一个或多个接口。如果想代理没有实现接口的类，就可以使用CGLIB实现。 
	  CGLIB是一个强大的高性能的代码生成包，它可以在运行期扩展Java类与实现Java接口。它广泛的被许多AOP的框架使用，例如Spring AOP和dynaop，为他们提供方法的interception（拦截）。 
	 CGLIB包的底层是通过使用一个小而快的字节码处理框架ASM，来转换字节码并生成新的类。不鼓励直接使用ASM，因为它要求你必须对JVM内部结构包括class文件的格式和指令集都很熟悉。


Cglib子类代理：
	1) 需要引入cglib – jar文件， 但是spring的核心包中已经包括了cglib功能，所以直接引入spring-core-3.2.5.jar即可。
	2）引入功能包后，就可以在内存中动态构建子类
	3）代理的类不能为final， 否则报错。
	4） 目标对象的方法如果为final/static, 那么就不会被拦截，即不会执行目标对象额外的业务方法。

	
在Spring的AOP编程中，
	如果加入容器的目标对象有实现接口，用JDK代理；
	如果目标对象没有实现接口，用Cglib代理；
```



#### 案例


> 1 目标对象

UserDao.java

```java
package cn.itcast.c_cglib;

/**
 * 目标对象
 *
 */
public class UserDao {

	public void save() {
		System.out.println("-----已经保存数据！！！------");
	}

}


```

> 2 cglib 代理类

ProxyFactory.java

```java
package cn.itcast.c_cglib;

import java.lang.reflect.Method;

import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;

/**
 * Cglib子类代理工厂
 * (对UserDao 在内存中动态构建一个子类对象)
 *
 */
public class ProxyFactory implements MethodInterceptor{
	
	// 维护目标对象
	private Object target;
	public ProxyFactory(Object target){
		this.target = target;
	}
	
	// 给目标对象创建代理对象
	public Object getProxyInstance(){
		//1. 工具类
		Enhancer en = new Enhancer();
		//2. 设置父类
		en.setSuperclass(target.getClass());
		//3. 设置回调函数
		en.setCallback(this);
		//4. 创建子类(代理对象)
		return en.create();
	}
	

	@Override
	public Object intercept(Object obj, Method method, Object[] args,
			MethodProxy proxy) throws Throwable {
		
		System.out.println("开始事务.....");
		
		// 执行目标对象的方法
		Object returnValue = method.invoke(target, args);
		
		System.out.println("提交事务.....");
		
		return returnValue;
	}

}


```

> 3 使用


```java
package cn.itcast.c_cglib;

public class App {

	public static void main(String[] args) {
		// 目标对象
		UserDao target = new UserDao();
		// class cn.itcast.c_cglib.UserDao
		System.out.println(target.getClass());
		
		// 代理对象
		UserDao proxy = (UserDao) new ProxyFactory(target).getProxyInstance();
		// UserDao子类：class cn.itcast.c_cglib.UserDao$$EnhancerByCGLIB$$25d4aeab
		System.out.println(proxy.getClass());
		
		// 执行代理对象的方法
		proxy.save();
	}
}



```



### 我这里补充一下正向代理反向代理(于本章节无关)


代理其实就是一个中介，A和B本来可以直连，中间插入一个C，C就是中介。
刚开始的时候，代理多数是帮助内网client访问外网server用的
后来出现了反向代理，"反向"这个词在这儿的意思其实是指方向相反，即代理将来自外网客户端的请求转发到内网服务器，从外到内

####  二 正向代理

正向代理类似一个跳板机，代理访问外部资源

比如我们国内访问谷歌，直接访问访问不到，我们可以通过一个正向代理服务器，请求发到代理服，代理服务器能够访问谷歌，这样由代理去谷歌取到返回数据，再返回给我们，这样我们就能访问谷歌了

![](assets/009/01/01/02-1643881156177.png)

正向代理的用途：

　　（1）访问原来无法访问的资源，如google

       （2） 可以做缓存，加速访问资源

　　（3）对客户端访问授权，上网进行认证

　　（4）代理可以记录用户访问记录（上网行为管理），对外隐藏用户信息


#### 三 反向代理


反向代理（Reverse Proxy）实际运行方式是指以代理服务器来接受internet上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给internet上请求连接的客户端，此时代理服务器对外就表现为一个服务器


![](assets/009/01/01/02-1643881176391.png)


反向代理的作用：
（1）保证内网的安全，阻止web攻击，大型网站，通常将反向代理作为公网访问地址，Web服务器是内网

（2）负载均衡，通过反向代理服务器来优化网站的负载

四 总结
正向代理即是客户端代理, 代理客户端, 服务端不知道实际发起请求的客户端.


反向代理即是服务端代理, 代理服务端, 客户端不知道实际提供服务的服务端


![](assets/009/01/01/02-1643881208683.png)


![](assets/009/01/01/02-1643881219431.png)


正向代理中，proxy和client同属一个LAN，对server透明；
反向代理中，proxy和server同属一个LAN，对client透明。
实际上proxy在两种代理中做的事都是代为收发请求和响应，不过从结构上来看正好左右互换了下，所以把后出现的那种代理方式叫成了反向代理

总结：
正向代理: 买票的黄牛

反向代理: 租房的代理

[这里的原文博客地址贴上](https://www.cnblogs.com/taostaryu/p/10547132.html)


## 手动实现aop编程

AOP 面向切面的编程，

	AOP可以实现“业务代码”与“关注点代码”分离

```java


// 保存一个用户
public void add(User user) { 
		Session session = null; 
		Transaction trans = null; 
		try { 
			session = HibernateSessionFactoryUtils.getSession();   // 【关注点代码】
			trans = session.beginTransaction();    // 【关注点代码】
			 
			session.save(user);     // 核心业务代码
			 
			trans.commit();     //…【关注点代码】

		} catch (Exception e) {     
			e.printStackTrace(); 
			if(trans != null){ 
				trans.rollback();   //..【关注点代码】

			} 
		} finally{ 
			HibernateSessionFactoryUtils.closeSession(session);   ////..【关注点代码】

		} 
   } 

```

分析总结：
	关注点代码，就是指重复执行的代码。
	业务代码与关注点代码分离，好处？
	   -- 关注点代码写一次即可；
		-开发者只需要关注核心业务；
		-运行时期，执行核心业务代码时候动态植入关注点代码； 【代理】


### 如何分离？


	过程式/对象式/代理模式分离


## aop编程


### 3.1 概述

```
Aop，  aspect object programming  面向切面编程
	功能： 让关注点代码与业务代码分离！
关注点,
	重复代码就叫做关注点；
切面，
	 关注点形成的类，就叫切面(类)！
	 面向切面编程，就是指 对很多功能都有的重复的代码抽取，再在运行的时候往业务方法上动态植入“切面类代码”。
切入点，
	执行目标对象方法，动态植入切面代码。
	可以通过切入点表达式，指定拦截哪些类的哪些方法； 给指定的类在运行的时候植入切面类代码。

```
 

 ###  3.2 注解方式实现AOP编程

```
步骤：
1） 先引入aop相关jar文件    	（aspectj  aop优秀组件）					
	spring-aop-3.2.5.RELEASE.jar   【spring3.2源码】
aopalliance.jar				  【spring2.5源码/lib/aopalliance】
aspectjweaver.jar			  【spring2.5源码/lib/aspectj】或【aspectj-1.8.2\lib】
aspectjrt.jar				  【spring2.5源码/lib/aspectj】或【aspectj-1.8.2\lib】

注意： 用到spring2.5版本的jar文件，如果用jdk1.7可能会有问题。
		需要升级aspectj组件，即使用aspectj-1.8.2版本中提供jar文件提供。


2） bean.xml中引入aop名称空间


3） 开启aop注解

4) 使用注解
@Aspect							指定一个类为切面类		
@Pointcut("execution(* cn.itcast.e_aop_anno.*.*(..))")  指定切入点表达式

@Before("pointCut_()")				前置通知: 目标方法之前执行
@After("pointCut_()")					后置通知：目标方法之后执行（始终执行）
@AfterReturning("pointCut_()")		    返回后通知： 执行方法结束前执行(异常不执行)
@AfterThrowing("pointCut_()")			异常通知:  出现异常时候执行
@Around("pointCut_()")				环绕通知： 环绕目标方法执行

```

#### 实现案例1 

```
1. IUserDao.java
// 接口
public interface IUserDao {
	void save();
}

2. UserDao.java
/**
 * 目标对象
 * @author Jie.Yuan
 *
 */
@Component   // 加入容器
public class UserDao implements IUserDao{

	@Override
	public void save() {
		System.out.println("-----核心业务：保存！！！------"); 
	}
}

3. Aop.java  切面类

@Component
@Aspect  // 指定当前类为切面类
public class Aop {

	// 指定切入点表单式： 拦截哪些方法； 即为哪些类生成代理对象
	
	@Pointcut("execution(* cn.itcast.e_aop_anno.*.*(..))")
	public void pointCut_(){
	}
	
	// 前置通知 : 在执行目标方法之前执行
	@Before("pointCut_()")
	public void begin(){
		System.out.println("开始事务/异常");
	}
	
	// 后置/最终通知：在执行目标方法之后执行  【无论是否出现异常最终都会执行】
	@After("pointCut_()")
	public void after(){
		System.out.println("提交事务/关闭");
	}
	
	// 返回后通知： 在调用目标方法结束后执行 【出现异常不执行】
	@AfterReturning("pointCut_()")
	public void afterReturning() {
		System.out.println("afterReturning()");
	}
	
	// 异常通知： 当目标方法执行异常时候执行此关注点代码
	@AfterThrowing("pointCut_()")
	public void afterThrowing(){
		System.out.println("afterThrowing()");
	}
	
	// 环绕通知：环绕目标方式执行
	@Around("pointCut_()")
	public void around(ProceedingJoinPoint pjp) throws Throwable{
		System.out.println("环绕前....");
		pjp.proceed();  // 执行目标方法
		System.out.println("环绕后....");
	}
	
}
4. bean.xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
	
	<!-- 开启注解扫描 -->
	<context:component-scan base-package="cn.itcast.e_aop_anno"></context:component-scan>
	
	<!-- 开启aop注解方式 -->
	<aop:aspectj-autoproxy></aop:aspectj-autoproxy>
</beans>   

```



### 3.3 XML方式实现AOP编程


```

Xml实现aop编程：
	1） 引入jar文件  【aop 相关jar， 4个】
	2） 引入aop名称空间
	3）aop 配置
		* 配置切面类 （重复执行代码形成的类）
		* aop配置
			拦截哪些方法 / 拦截到方法后应用通知代码


<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
	
	<!-- dao 实例 -->
	<bean id="userDao" class="cn.itcast.f_aop_xml.UserDao"></bean>
	<bean id="orderDao" class="cn.itcast.f_aop_xml.OrderDao"></bean>
	
	<!-- 切面类 -->
	<bean id="aop" class="cn.itcast.f_aop_xml.Aop"></bean>
	
	<!-- Aop配置 -->
	<aop:config>
		<!-- 定义一个切入点表达式： 拦截哪些方法 -->
		<aop:pointcut expression="execution(* cn.itcast.f_aop_xml.*.*(..))" id="pt"/>
		<!-- 切面 -->
		<aop:aspect ref="aop">
			<!-- 环绕通知 -->
			<aop:around method="around" pointcut-ref="pt"/>
			<!-- 前置通知： 在目标方法调用前执行 -->
			<aop:before method="begin" pointcut-ref="pt"/>
			<!-- 后置通知： -->
			<aop:after method="after" pointcut-ref="pt"/>
			<!-- 返回后通知 -->
			<aop:after-returning method="afterReturning" pointcut-ref="pt"/>
			<!-- 异常通知 -->
			<aop:after-throwing method="afterThrowing" pointcut-ref="pt"/>
			
		</aop:aspect>
	</aop:config>
</beans>  


```


### 3.4 切入点表达式

切入点表达式, 
	可以对指定的“方法”进行拦截；  从而给指定的方法所在的类生层代理对象。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
	
	<!-- dao 实例 -->
	<bean id="userDao" class="cn.itcast.g_pointcut.UserDao"></bean>
	<bean id="orderDao" class="cn.itcast.g_pointcut.OrderDao"></bean>
	
	<!-- 切面类 -->
	<bean id="aop" class="cn.itcast.g_pointcut.Aop"></bean>
	
	<!-- Aop配置 -->
	<aop:config>
		
		<!-- 定义一个切入点表达式： 拦截哪些方法 -->
		<!--<aop:pointcut expression="execution(* cn.itcast.g_pointcut.*.*(..))" id="pt"/>-->
		
		<!-- 【拦截所有public方法】 -->
		<!--<aop:pointcut expression="execution(public * *(..))" id="pt"/>-->
		
		<!-- 【拦截所有save开头的方法 】 -->
		<!--<aop:pointcut expression="execution(* save*(..))" id="pt"/>-->
		
		<!-- 【拦截指定类的指定方法, 拦截时候一定要定位到方法】 -->
		<!--<aop:pointcut expression="execution(public * cn.itcast.g_pointcut.OrderDao.save(..))" id="pt"/>-->
		
		<!-- 【拦截指定类的所有方法】 -->
		<!--<aop:pointcut expression="execution(* cn.itcast.g_pointcut.UserDao.*(..))" id="pt"/>-->
		
		<!-- 【拦截指定包，以及其自包下所有类的所有方法，也可以 execution(* cn..*(..))】 为了规范所以写成 cn..*.*(..) -->
		<!--<aop:pointcut expression="execution(* cn..*.*(..))" id="pt"/>-->
		
		<!-- 【多个表达式】 -->
		<!--<aop:pointcut expression="execution(* cn.itcast.g_pointcut.UserDao.save()) || execution(* cn.itcast.g_pointcut.OrderDao.save())" id="pt"/>-->
		<!--<aop:pointcut expression="execution(* cn.itcast.g_pointcut.UserDao.save()) or execution(* cn.itcast.g_pointcut.OrderDao.save())" id="pt"/>-->
		<!-- 下面2个且关系的，没有意义 -->
		<!--<aop:pointcut expression="execution(* cn.itcast.g_pointcut.UserDao.save()) &amp;&amp; execution(* cn.itcast.g_pointcut.OrderDao.save())" id="pt"/>-->
		<!--<aop:pointcut expression="execution(* cn.itcast.g_pointcut.UserDao.save()) and execution(* cn.itcast.g_pointcut.OrderDao.save())" id="pt"/>-->
		
		<!-- 【取非值】 -->
		<!--<aop:pointcut expression="!execution(* cn.itcast.g_pointcut.OrderDao.save())" id="pt"/>-->
		<aop:pointcut expression=" not execution(* cn.itcast.g_pointcut.OrderDao.save())" id="pt"/>
		
		<!-- 切面 -->
		<aop:aspect ref="aop">
			<!-- 环绕通知 -->
			<aop:around method="around" pointcut-ref="pt"/>
		</aop:aspect>
	</aop:config>
</beans>    

```

### 4. Spring对jdbc支持

使用步骤：
	1）引入jar文件
spring-jdbc-3.2.5.RELEASE.jar
spring-tx-3.2.5.RELEASE.jar
	2） 优化


#### 4.1 c3p0 参数详解
```
<c3p0-config>
  <default-config>
 <!--当连接池中的连接耗尽的时候c3p0一次同时获取的连接数。Default: 3 -->
 <property name="acquireIncrement">3</property>
 
 <!--定义在从数据库获取新连接失败后重复尝试的次数。Default: 30 -->
 <property name="acquireRetryAttempts">30</property>
 
 <!--两次连接中间隔时间，单位毫秒。Default: 1000 -->
 <property name="acquireRetryDelay">1000</property>
 
 <!--连接关闭时默认将所有未提交的操作回滚。Default: false -->
 <property name="autoCommitOnClose">false</property>
 
 <!--c3p0将建一张名为Test的空表，并使用其自带的查询语句进行测试。如果定义了这个参数那么
  属性preferredTestQuery将被忽略。你不能在这张Test表上进行任何操作，它将只供c3p0测试
  使用。Default: null-->
 <property name="automaticTestTable">Test</property>
 
 <!--获取连接失败将会引起所有等待连接池来获取连接的线程抛出异常。但是数据源仍有效
  保留，并在下次调用getConnection()的时候继续尝试获取连接。如果设为true，那么在尝试
  获取连接失败后该数据源将申明已断开并永久关闭。Default: false-->
 <property name="breakAfterAcquireFailure">false</property>
 
 <!--当连接池用完时客户端调用getConnection()后等待获取新连接的时间，超时后将抛出
  SQLException,如设为0则无限期等待。单位毫秒。Default: 0 --> 
 <property name="checkoutTimeout">100</property>
 
 <!--通过实现ConnectionTester或QueryConnectionTester的类来测试连接。类名需制定全路径。
  Default: com.mchange.v2.c3p0.impl.DefaultConnectionTester-->
 <property name="connectionTesterClassName"></property>
 
 <!--指定c3p0 libraries的路径，如果（通常都是这样）在本地即可获得那么无需设置，默认null即可
  Default: null-->
 <property name="factoryClassLocation">null</property>
 
 <!--Strongly disrecommended. Setting this to true may lead to subtle and bizarre bugs. 
  （文档原文）作者强烈建议不使用的一个属性--> 
 <property name="forceIgnoreUnresolvedTransactions">false</property>
 
 <!--每60秒检查所有连接池中的空闲连接。Default: 0 --> 
 <property name="idleConnectionTestPeriod">60</property>
 
 <!--初始化时获取三个连接，取值应在minPoolSize与maxPoolSize之间。Default: 3 --> 
 <property name="initialPoolSize">3</property>
 
 <!--最大空闲时间,60秒内未使用则连接被丢弃。若为0则永不丢弃。Default: 0 -->
 <property name="maxIdleTime">60</property>
 
 <!--连接池中保留的最大连接数。Default: 15 -->
 <property name="maxPoolSize">15</property>
 
 <!--JDBC的标准参数，用以控制数据源内加载的PreparedStatements数量。但由于预缓存的statements
  属于单个connection而不是整个连接池。所以设置这个参数需要考虑到多方面的因素。
  如果maxStatements与maxStatementsPerConnection均为0，则缓存被关闭。Default: 0-->
 <property name="maxStatements">100</property>
 
 <!--maxStatementsPerConnection定义了连接池内单个连接所拥有的最大缓存statements数。Default: 0  -->
 <property name="maxStatementsPerConnection"></property>
 
 <!--c3p0是异步操作的，缓慢的JDBC操作通过帮助进程完成。扩展这些操作可以有效的提升性能
  通过多线程实现多个操作同时被执行。Default: 3--> 
 <property name="numHelperThreads">3</property>
 
 <!--当用户调用getConnection()时使root用户成为去获取连接的用户。主要用于连接池连接非c3p0
  的数据源时。Default: null--> 
 <property name="overrideDefaultUser">root</property>
 
 <!--与overrideDefaultUser参数对应使用的一个参数。Default: null-->
 <property name="overrideDefaultPassword">password</property>
 
 <!--密码。Default: null--> 
 <property name="password"></property>
 
 <!--定义所有连接测试都执行的测试语句。在使用连接测试的情况下这个一显著提高测试速度。注意：
  测试的表必须在初始数据源的时候就存在。Default: null-->
 <property name="preferredTestQuery">select id from test where id=1</property>
 
 <!--用户修改系统配置参数执行前最多等待300秒。Default: 300 --> 
 <property name="propertyCycle">300</property>
 
 <!--因性能消耗大请只在需要的时候使用它。如果设为true那么在每个connection提交的
  时候都将校验其有效性。建议使用idleConnectionTestPeriod或automaticTestTable
  等方法来提升连接测试的性能。Default: false -->
 <property name="testConnectionOnCheckout">false</property>
 
 <!--如果设为true那么在取得连接的同时将校验连接的有效性。Default: false -->
 <property name="testConnectionOnCheckin">true</property>
 
 <!--用户名。Default: null-->
 <property name="user">root</property>
 
 <!--早期的c3p0版本对JDBC接口采用动态反射代理。在早期版本用途广泛的情况下这个参数
  允许用户恢复到动态反射代理以解决不稳定的故障。最新的非反射代理更快并且已经开始
  广泛的被使用，所以这个参数未必有用。现在原先的动态反射与新的非反射代理同时受到
  支持，但今后可能的版本可能不支持动态反射代理。Default: false-->
 <property name="usesTraditionalReflectiveProxies">false</property>

    <property name="automaticTestTable">con_test</property>
    <property name="checkoutTimeout">30000</property>
    <property name="idleConnectionTestPeriod">30</property>
    <property name="initialPoolSize">10</property>
    <property name="maxIdleTime">30</property>
    <property name="maxPoolSize">25</property>
    <property name="minPoolSize">10</property>
    <property name="maxStatements">0</property>
    <user-overrides user="swaldman">
    </user-overrides>
  </default-config>
  <named-config name="dumbTestConfig">
    <property name="maxStatements">200</property>
    <user-overrides user="poop">
      <property name="maxStatements">300</property>
    </user-overrides>
   </named-config>
</c3p0-config>


```



#### 案例

spring 使用jdbc 进行基本的增删改查案例



> 1 bean.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:p="http://www.springframework.org/schema/p"
    xmlns:context="http://www.springframework.org/schema/context"
    xmlns:aop="http://www.springframework.org/schema/aop"
    xsi:schemaLocation="
        http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd">
	
	<!-- 1. 数据源对象: C3P0连接池 -->
	<bean id="dataSource" class="com.mchange.v2.c3p0.ComboPooledDataSource">
		<property name="driverClass" value="com.mysql.jdbc.Driver"></property>
		<property name="jdbcUrl" value="jdbc:mysql:///hib_demo"></property>
		<property name="user" value="root"></property>
		<property name="password" value="root"></property>
		<property name="initialPoolSize" value="3"></property>
		<property name="maxPoolSize" value="10"></property>
		<property name="maxStatements" value="100"></property>
		<property name="acquireIncrement" value="2"></property>
	</bean>
	
	<!-- 2. 创建JdbcTemplate对象 -->
	<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
		<property name="dataSource" ref="dataSource"></property>
	</bean>
	
	<!-- dao 实例 -->
	<bean id="userDao" class="cn.itcast.h_jdbc.UserDao">
		<property name="jdbcTemplate" ref="jdbcTemplate"></property>
	</bean>
</beans>      

  
```


> 2 先贴上最终调用app类代码

App.java
```java
package cn.itcast.h_jdbc;

import org.junit.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App {

	// 容器对象
	ApplicationContext ac = new ClassPathXmlApplicationContext("cn/itcast/h_jdbc/bean.xml");
	
	@Test
	public void testApp() throws Exception {
		UserDao ud = (UserDao) ac.getBean("userDao");
//		ud.save();
		System.out.println(ud.findById(9));
		System.out.println(ud.getAll());
	}
}

```


> 3 Dept.java

```java
package cn.itcast.h_jdbc;

public class Dept {

	private int deptId;
	private String deptName;
	public int getDeptId() {
		return deptId;
	}
	public void setDeptId(int deptId) {
		this.deptId = deptId;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	
}

```


> 4 最初的代码

UserDao01.java

```java
package cn.itcast.h_jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

public class UserDao01 {

	
	/*
	 *  保存方法
	 *  需求优化的地方：
	 *  	1. 连接管理
	 *  	2. jdbc操作重复代码封装
	 */
	public void save() {
		try {
			String sql = "insert into t_dept(deptName) values('test');";
			Connection con = null;
			Statement stmt = null;
			Class.forName("com.mysql.jdbc.Driver");
			// 连接对象
			con = DriverManager.getConnection("jdbc:mysql:///hib_demo", "root", "root");
			// 执行命令对象
			stmt =  con.createStatement();
			// 执行
			stmt.execute(sql);
			
			// 关闭
			stmt.close();
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

```


> 4 datasource 注入后的代码

UserDao02.java

```java
package cn.itcast.h_jdbc;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

import javax.sql.DataSource;

public class UserDao02 {
	
	// IOC容器注入
	private DataSource dataSource;
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	
	public void save() {
		try {
			String sql = "insert into t_dept(deptName) values('test');";
			Connection con = null;
			Statement stmt = null;
			// 连接对象
			con = dataSource.getConnection();
			// 执行命令对象
			stmt =  con.createStatement();
			// 执行
			stmt.execute(sql);
			
			// 关闭
			stmt.close();
			con.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}


```


> 5 最终注入 jdbcTemplate 对象


UserDao.java 本案例最终版，xml配置也是按照这个来的

```java
package cn.itcast.h_jdbc;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.jdbc.core.RowMapper;

public class UserDao {
	
	// IOC容器注入
//	private DataSource dataSource;
//	public void setDataSource(DataSource dataSource) {
//		this.dataSource = dataSource;
//	}
	
	private JdbcTemplate jdbcTemplate;
	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	
	public void save() {
		String sql = "insert into t_dept(deptName) values('test');";
		jdbcTemplate.update(sql);
	}
	
	public Dept findById(int id) {
		String sql = "select * from t_dept where deptId=?";
		List<Dept> list = jdbcTemplate.query(sql,new MyResult(), id);
		return (list!=null && list.size()>0) ? list.get(0) : null;
	}
	
	public List<Dept> getAll() {
		String sql = "select * from t_dept";
		List<Dept> list = jdbcTemplate.query(sql, new MyResult());
		return list;
	}
	
	
	
	
	class MyResult implements RowMapper<Dept>{

		// 如何封装一行记录
		@Override
		public Dept mapRow(ResultSet rs, int index) throws SQLException {
			Dept dept = new Dept();
			dept.setDeptId(rs.getInt("deptId"));
			dept.setDeptName(rs.getString("deptName"));
			return dept;
		}
		
	}
}








```