# hibernate查询、连接池、二级缓存


回忆 ：

```
Hibernate第三天：
1. 对象状态
2. session缓存
3. lazy懒加载
4. 映射
	一对一对映射
	组件/继承映射


```

> 2 本章目标：

```
目标：
	一、hibernate查询
	二、hibernate对连接池的支持
	三、二级缓存
	四、Hibernate与Struts小案例（项目中session的管理方式）（struts 漏洞 基本不用了 ）

```

## 查询概述


1)	Get/load主键查询
2)	对象导航查询
3)	HQL查询，  Hibernate Query language  hibernate 提供的面向对象的查询语言。
4)	Criteria 查询，   完全面向对象的查询（Query By Criteria  ,QBC）
5)	SQLQuery， 本地SQL查询
缺点：不能跨数据库平台： 如果该了数据库，sql语句有肯能要改
使用场景： 对于复杂sql，hql实现不了的情况，可以使用本地sql查询。


### HQL查询


```java
public class App {
	
	private static SessionFactory sf;
	static {
		sf = new Configuration()
			.configure()
			.addClass(Dept.class)   
			.addClass(Employee.class)   // 测试时候使用
			.buildSessionFactory();
	}

	/*
	 * 1)	Get/load主键查询
		2)	对象导航查询
		3)	HQL查询，  Hibernate Query language  hibernate 提供的面向对象的查询语言。
		4)	Criteria 查询，   完全面向对象的查询（Query By Criteria  ,QBC）
		5)	SQLQuery， 本地SQL查询

	 */
	@Test
	public void all() {
		
		Session session = sf.openSession();
		session.beginTransaction();
		
		//1) 主键查询
//		Dept dept =  (Dept) session.get(Dept.class, 12);
//		Dept dept =  (Dept) session.load(Dept.class, 12);
		
		//2) 对象导航查询
//		Dept dept =  (Dept) session.get(Dept.class, 12);
//		System.out.println(dept.getDeptName());
//		System.out.println(dept.getEmps());
		
		// 3)	HQL查询
		// 注意：使用hql查询的时候 auto-import="true" 要设置true，
		//  如果是false，写hql的时候，要指定类的全名
//		Query q = session.createQuery("from Dept");
//		System.out.println(q.list());
		
		// a. 查询全部列
//		Query q = session.createQuery("from Dept");  //OK
//		Query q = session.createQuery("select * from Dept");  //NOK, 错误，不支持*
//		Query q = session.createQuery("select d from Dept d");  // OK
//		System.out.println(q.list());

		// b. 查询指定的列  【返回对象数据Object[] 】
//		Query q = session.createQuery("select d.deptId,d.deptName from Dept d");  
//		System.out.println(q.list());
		
		// c. 查询指定的列, 自动封装为对象  【必须要提供带参数构造器】
//		Query q = session.createQuery("select new Dept(d.deptId,d.deptName) from Dept d");  
//		System.out.println(q.list());
		
		// d. 条件查询: 一个条件/多个条件and or/between and/模糊查询
		// 条件查询： 占位符
//		Query q = session.createQuery("from Dept d where deptName=?");
//		q.setString(0, "财务部");
//		q.setParameter(0, "财务部");
//		System.out.println(q.list());
		
		// 条件查询： 命名参数
//		Query q = session.createQuery("from Dept d where deptId=:myId or deptName=:name");
//		q.setParameter("myId", 12);
//		q.setParameter("name", "财务部");
//		System.out.println(q.list());
		
		// 范围
//		Query q = session.createQuery("from Dept d where deptId between ? and ?");
//		q.setParameter(0, 1);
//		q.setParameter(1, 20);
//		System.out.println(q.list());
		
		// 模糊
//		Query q = session.createQuery("from Dept d where deptName like ?");
//		q.setString(0, "%部%");
//		System.out.println(q.list());
		

		// e. 聚合函数统计
//		Query q = session.createQuery("select count(*) from Dept");
//		Long num = (Long) q.uniqueResult();
//		System.out.println(num);
		
		// f. 分组查询
		//-- 统计t_employee表中，每个部门的人数
		//数据库写法：SELECT dept_id,COUNT(*) FROM t_employee GROUP BY dept_id;
		// HQL写法
//		Query q = session.createQuery("select e.dept, count(*) from Employee e group by e.dept");
//		System.out.println(q.list());
		
	
		
		
		session.getTransaction().commit();
		session.close();
	}
	
	// g. 连接查询
	@Test
	public void join() {
		
		Session session = sf.openSession();
		session.beginTransaction();
		
		//1) 内连接   【映射已经配置好了关系，关联的时候，直接写对象的属性即可】
//		Query q = session.createQuery("from Dept d inner join d.emps");
		
		//2) 左外连接
//		Query q = session.createQuery("from Dept d left join d.emps");

		//3) 右外连接
		Query q = session.createQuery("from Employee e right join e.dept");
		q.list();
		
		session.getTransaction().commit();
		session.close();
	}
	
	// g. 连接查询 - 迫切连接
	@Test
	public void fetch() {
		
		Session session = sf.openSession();
		session.beginTransaction();
		
		//1) 迫切内连接    【使用fetch, 会把右表的数据，填充到左表对象中！】
//		Query q = session.createQuery("from Dept d inner join fetch d.emps");
//		q.list();
		
		//2) 迫切左外连接
		Query q = session.createQuery("from Dept d left join fetch d.emps");
		q.list();
		
		session.getTransaction().commit();
		session.close();
	}
	
	// HQL查询优化
	@Test
	public void hql_other() {
		Session session = sf.openSession();
		session.beginTransaction();
		// HQL写死
//		Query q = session.createQuery("from Dept d where deptId < 10 ");
		
		// HQL 放到映射文件中
		Query q = session.getNamedQuery("getAllDept");
		q.setParameter(0, 10);
		System.out.println(q.list());
		
		session.getTransaction().commit();
		session.close();
	}
}


```

### Criteria 查询


```java
//4)	Criteria 查询，
	@Test
	public void criteria() {
		
		Session session = sf.openSession();
		session.beginTransaction();
		
		Criteria criteria = session.createCriteria(Employee.class);
		// 构建条件
		criteria.add(Restrictions.eq("empId", 12));
//		criteria.add(Restrictions.idEq(12));  // 主键查询
		
		System.out.println(criteria.list());
		
		
		session.getTransaction().commit();
		session.close();
	}

```


### SQLQuery， 本地SQL查询

```java
// 5)	SQLQuery， 本地SQL查询
	// 不能跨数据库平台： 如果该了数据库，sql语句有肯能要改。
	@Test
	public void sql() {
		
		Session session = sf.openSession();
		session.beginTransaction();
		
		SQLQuery q = session.createSQLQuery("SELECT * FROM t_Dept limit 5;")
			.addEntity(Dept.class);  // 也可以自动封装
		System.out.println(q.list());
		
		session.getTransaction().commit();
		session.close();
	}

```

###  2. 分页查询

分页SQL：
	先查询总记录数，再分页查询。



```java
// 分页查询
	@Test
	public void all() {
		
		Session session = sf.openSession();
		session.beginTransaction();
		
		 Query q = session.createQuery("from Employee");
		 
		 // 从记录数
		 ScrollableResults scroll = q.scroll();  // 得到滚动的结果集
		 scroll.last();							//  滚动到最后一行
		 int totalCount = scroll.getRowNumber() + 1;// 得到滚到的记录数，即总记录数
		 
		 // 设置分页参数
		 q.setFirstResult(0);
		 q.setMaxResults(3);
		 
		 // 查询
		 System.out.println(q.list());
		 System.out.println("总记录数：" + totalCount);
		
		session.getTransaction().commit();
		session.close();
	}

```



## hibernate对连接池的支持

连接池，
	作用： 管理连接；提升连接的利用效率！
	常用的连接池： C3P0连接池

Hibernate 自带的也有一个连接池，且对C3P0连接池也有支持！

Hbm 自带连接池：
	只维护一个连接，比较简陋。
	可以查看hibernate.properties文件查看连接池详细配置:


```
#################################
### Hibernate Connection Pool ###     
#################################

hibernate.connection.pool_size 1        【Hbm 自带连接池： 只有一个连接】



###########################
### C3P0 Connection Pool###		   【Hbm对C3P0连接池支持】
###########################

#hibernate.c3p0.max_size 2				最大连接数
#hibernate.c3p0.min_size 2				最小连接数
#hibernate.c3p0.timeout 5000           超时时间
#hibernate.c3p0.max_statements 100     最大执行的命令的个数
#hibernate.c3p0.idle_test_period 3000    空闲测试时间
#hibernate.c3p0.acquire_increment 2     连接不够用的时候， 每次增加的连接数
#hibernate.c3p0.validate false


【Hbm对C3P0连接池支持，  核心类】
 告诉hib使用的是哪一个连接池技术。
#hibernate.connection.provider_class org.hibernate.connection.C3P0ConnectionProvider

```

### Hibernate.cfg.xml 中增加连接池相关配置：

```xml
<!-- 【连接池配置】 -->
		<!-- 配置连接驱动管理类 -->
		<property name="hibernate.connection.provider_class">org.hibernate.connection.C3P0ConnectionProvider</property>
		<!-- 配置连接池参数信息 -->
		<property name="hibernate.c3p0.min_size">2</property>
		<property name="hibernate.c3p0.max_size">4</property>
		<property name="hibernate.c3p0.timeout">5000</property>
		<property name="hibernate.c3p0.max_statements">10</property>
		<property name="hibernate.c3p0.idle_test_period">30000</property>
		<property name="hibernate.c3p0.acquire_increment">2</property>

```
