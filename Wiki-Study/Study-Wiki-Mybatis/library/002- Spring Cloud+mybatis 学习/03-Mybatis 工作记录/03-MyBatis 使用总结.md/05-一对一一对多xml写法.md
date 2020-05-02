# 一对一一对多的写法


## 总结


## 博主

### 博主1


[原文地址：](https://blog.csdn.net/qq_33561055/article/details/78861131)

* 摘抄原文

![](assets/002/03/03/05-1575096092866.png)

* 2 创建实体bean
Teacher.java:

```java

import java.util.List;
 
/**
 * TODO
 * @version 创建时间：2017年12月21日 上午9:02:45
 */
public class Teacher {
 
	private Integer id;
	private String name;
	private String className;
	private List<Student> students;
 
	public List<Student> getStudents() {
		return students;
	}
 
	public void setStudents(List<Student> students) {
		this.students = students;
	}
 
	public Integer getId() {
		return id;
	}
 
	public void setId(Integer id) {
		this.id = id;
	}
 
	public String getName() {
		return name;
	}
 
	public void setName(String name) {
		this.name = name;
	}
 
	public String getClassName() {
		return className;
	}
 
	public void setClassName(String className) {
		this.className = className;
	}
 
}

```

* 3学生实体类


```java

/**
 * TODO
 * 
 * @author 作者 E-mail:2332999366@qq.com
 * @version 创建时间：2017年12月21日 上午9:01:17
 */
public class Student {
 
	private Integer id;
	private String name;
	private Integer teacherId;
	private String className;
	private Teacher teacher;
	
 
	public Teacher getTeacher() {
		return teacher;
	}
 
	public void setTeacher(Teacher teacher) {
		this.teacher = teacher;
	}
 
	public Integer getId() {
		return id;
	}
 
	public void setId(Integer id) {
		this.id = id;
	}
 
	public String getName() {
		return name;
	}
 
	public void setName(String name) {
		this.name = name;
	}
 
	public Integer getTeacherId() {
		return teacherId;
	}
 
	public void setTeacherId(Integer teacherId) {
		this.teacherId = teacherId;
	}
 
	public String getClassName() {
		return className;
	}
 
	public void setClassName(String className) {
		this.className = className;
	}
 
	@Override
	public String toString() {
		return "{id:"+this.id+",name:"+this.name+",className:"+this.className+",teacherId:"+this.teacherId+"}";
	}
} 

```