# list 使用1.8新特性进行自定义对象多列复杂排序



## 基础使用

```java
package com.common;
 
import java.util.*;
 
public class ComparatorTest {
    public static void main(String[] args) {
 
        Employee e1 = new Employee("John", 25, 3000, 9922001);
        Employee e2 = new Employee("Ace", 22, 2000, 5924001);
        Employee e3 = new Employee("Keith", 35, 4000, 3924401);
 
        List<Employee> employees = new ArrayList<>();
        employees.add(e1);
        employees.add(e2);
        employees.add(e3);
 
        /**
         *     @SuppressWarnings({"unchecked", "rawtypes"})
         *     default void sort(Comparator<? super E> c) {
         *         Object[] a = this.toArray();
         *         Arrays.sort(a, (Comparator) c);
         *         ListIterator<E> i = this.listIterator();
         *         for (Object e : a) {
         *             i.next();
         *             i.set((E) e);
         *         }
         *     }
         *
         *     sort 对象接收一个 Comparator 函数式接口，可以传入一个lambda表达式
         */
        employees.sort((o1, o2) -> o1.getName().compareTo(o2.getName()));
 
        Collections.sort(employees, (o1, o2) -> o1.getName().compareTo(o2.getName()));
 
        employees.forEach(System.out::println);
 
 
        /**
         * Comparator.comparing 方法的使用
         *
         * comparing 方法接收一个 Function 函数式接口 ，通过一个 lambda 表达式传入
         *
         */
        employees.sort(Comparator.comparing(e -> e.getName()));
 
        /**
         * 该方法引用 Employee::getName 可以代替 lambda表达式
         */
        employees.sort(Comparator.comparing(Employee::getName));
 
    }
}
 
 
/**
 * [Employee(name=John, age=25, salary=3000.0, mobile=9922001),
 * Employee(name=Ace, age=22, salary=2000.0, mobile=5924001),
 * Employee(name=Keith, age=35, salary=4000.0, mobile=3924401)]
 */

 @Data
class Employee {
    String name;
    int age;
    double salary;
    long mobile;
    // constructors, getters & setters

    public Employee(String name, int age, double salary, long mobile) {
        this.name = name;
        this.age = age;
        this.salary = salary;
        this.mobile = mobile;
    }
 
}
```


## 自然排序，三列


* 原博主：https://blog.csdn.net/kang_jie/article/details/106627814?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.add_param_isCf&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.add_param_isCf




```java
package com.szdp.dp_government.config;

import lombok.Data;
import org.springframework.boot.autoconfigure.security.SecurityProperties;


import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author : shenyabo
 * @date : Created in 2020-11-12 15:50
 * @description :
 * @modified By :
 * @version: : v1.0
 */
@Data
public class User {

    private String name;
    private Integer age;
    private Integer gameLevel;
    private Date birthday;
    private Date createTime;

    public User(String name, Integer age, Integer gameLevel, Date birthday, Date createTime) {
        this.name = name;
        this.age = age;
        this.gameLevel = gameLevel;
        this.birthday = birthday;
        this.createTime = createTime;
    }

    public User(String name, Integer age, Integer gameLevel) {
        this.name = name;
        this.age = age;
        this.gameLevel = gameLevel;

    }
    public static void main(String[] args) {
        List<User> users = new ArrayList<>();
        users.add(new User("a", 21, 7,new Date(),new Date()));
        users.add(new User("a", 22, 6,new Date(System.currentTimeMillis() - 1000* 60 *60 *24),new Date()));
        users.add(new User("a", 20, 8,new Date(System.currentTimeMillis() - 1000* 60 *60 *24 * 2 ),new Date(System.currentTimeMillis() + 1000* 60 *60 *24* 3)));
        users.add(new User("b", 23, 9,new Date(System.currentTimeMillis() - 1000* 60 *60 *24 * 2),new Date(System.currentTimeMillis() + 1000* 60 *60 *24)));
        users.add(new User("b", 2, 4,new Date(System.currentTimeMillis() - 1000* 60 *60 *24 * 3),new Date(System.currentTimeMillis() + 1000* 60 *60 *24)));
        users.add(new User("b", 23, 7,new Date(System.currentTimeMillis() - 1000* 60 *60 *24 ),new Date(System.currentTimeMillis() + 1000* 60 *60 *24 * 4)));

        System.out.println("===========================================>排序前：");

        users.forEach(user -> {
            System.out.println(user);
        });


        // java8 复杂排序--先name，再age，再gameLevel，全部默认升序
        users.sort(Comparator.comparing(User::getName)
                .thenComparing((t1, t2) -> {
                    return new Long(t1.getBirthday().getTime() - t2.getBirthday().getTime()).intValue();
                })
        );
        System.out.println("===========================================>排序后：默认 name 升序 ，出生日期降序");


        users.forEach(user -> {
            System.out.println(user);
        });

        /**
         * 注意 如果用集合.sort 排序则可以直接修改list ，如果使用stream().sorted 排序则需要重新赋值List 才行
         */
        // 创建时间降序、然后相同的时间则按照出生时间升序
        users.sort(Comparator.comparing(User::getCreateTime,Comparator.reverseOrder())
                .thenComparing((t1,t2)->{
                    // 升序
                    return new Long(t1.getBirthday().getTime() - t2.getBirthday().getTime()).intValue();
                })
        );
        System.out.println("===========================================>排序后：默认CreateTime 降序 ，birthday 升序");
        users.forEach(user -> {
            System.out.println(user);
        });


        //
        users=users.stream().sorted(Comparator.comparing(User::getCreateTime,Comparator.reverseOrder())
                .thenComparing((t1,t2)->{
                    // 升序
                    return new Long(t1.getBirthday().getTime() - t2.getBirthday().getTime()).intValue();
                })
        ).collect(Collectors.toList());
        System.out.println("===========================================>（流）排序后：默认CreateTime 降序 ，birthday 升序");

        users.forEach(user -> {
            System.out.println(user);
        });


        // java8 复杂排序--先name升序，再age降序，再gameLevel 降序
        users.sort(Comparator.comparing(User::getName)
                .thenComparing(User::getAge, Comparator.reverseOrder())        // Comparator.reverseOrder() 对上一个排序规则进行反序
                .thenComparing(User::getGameLevel, Comparator.reverseOrder())
                .thenComparing(User::getBirthday));
        System.out.println("===========================================>先name升序，再age降序，再gameLevel降序");
        users.forEach(user -> {
            System.out.println(user);
        });
    }
}

```

```
===========================================>排序前：
User(name=a, age=21, gameLevel=7, birthday=Sat Nov 14 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=a, age=22, gameLevel=6, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=a, age=20, gameLevel=8, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Tue Nov 17 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=9, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=b, age=2, gameLevel=4, birthday=Wed Nov 11 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=7, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Wed Nov 18 10:59:14 CST 2020)
===========================================>排序后：默认 name 升序 ，出生日期降序
User(name=a, age=20, gameLevel=8, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Tue Nov 17 10:59:14 CST 2020)
User(name=a, age=22, gameLevel=6, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=a, age=21, gameLevel=7, birthday=Sat Nov 14 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=b, age=2, gameLevel=4, birthday=Wed Nov 11 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=9, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=7, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Wed Nov 18 10:59:14 CST 2020)
===========================================>排序后：默认CreateTime 降序 ，birthday 升序
User(name=b, age=23, gameLevel=7, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Wed Nov 18 10:59:14 CST 2020)
User(name=a, age=20, gameLevel=8, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Tue Nov 17 10:59:14 CST 2020)
User(name=b, age=2, gameLevel=4, birthday=Wed Nov 11 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=9, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=a, age=22, gameLevel=6, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=a, age=21, gameLevel=7, birthday=Sat Nov 14 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
===========================================>（流）排序后：默认CreateTime 降序 ，birthday 升序
User(name=b, age=23, gameLevel=7, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Wed Nov 18 10:59:14 CST 2020)
User(name=a, age=20, gameLevel=8, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Tue Nov 17 10:59:14 CST 2020)
User(name=b, age=2, gameLevel=4, birthday=Wed Nov 11 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=9, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=a, age=22, gameLevel=6, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=a, age=21, gameLevel=7, birthday=Sat Nov 14 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
===========================================>先name升序，再age降序，再gameLevel降序
User(name=a, age=22, gameLevel=6, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=a, age=21, gameLevel=7, birthday=Sat Nov 14 10:59:14 CST 2020, createTime=Sat Nov 14 10:59:14 CST 2020)
User(name=a, age=20, gameLevel=8, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Tue Nov 17 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=9, birthday=Thu Nov 12 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
User(name=b, age=23, gameLevel=7, birthday=Fri Nov 13 10:59:14 CST 2020, createTime=Wed Nov 18 10:59:14 CST 2020)
User(name=b, age=2, gameLevel=4, birthday=Wed Nov 11 10:59:14 CST 2020, createTime=Sun Nov 15 10:59:14 CST 2020)
```


## 自定义对象时间排序2 


> 切记。如果分页的话还是得老老实实用sql 的多级排序，你比如我想要查询每天不同企业出入人员统计，假设总共有11各企业，分页是10条，然后这样只能对已经分页了的数据进行二级排序，假设第二页的那个企业我想要排在第一页，但是呢没有被分页查到怎么办？ 所以 还是会有这个问题的切记

```java
public List<PeopleKkInOutCountDto> getPeopleKkInOutList(PeopleKkInOutCountDto peopleKkInOutCountDto) {

        List<PeopleKkInOutCountDto> peopleKkList = new ArrayList<>();

        if (peopleKkInOutCountDto.getPage() != null && peopleKkInOutCountDto.getLimit() != null) {
            PageHelper.startPage(peopleKkInOutCountDto.getPage(), peopleKkInOutCountDto.getLimit());
            peopleKkList = peopleKkInOutCountMapper.getPeopleKkInOutList(peopleKkInOutCountDto);
            PageInfo<PeopleKkInOutCountDto> pageInfo = new PageInfo<PeopleKkInOutCountDto>(peopleKkList);
            peopleKkList = pageInfo.getList();
            peopleKkInOutCountDto.setCount((int) pageInfo.getTotal());
        } else {
            peopleKkList = peopleKkInOutCountMapper.getPeopleKkInOutList(peopleKkInOutCountDto);
            peopleKkInOutCountDto.setCount(CollectionUtils.isEmpty(peopleKkList) ? 0 : peopleKkList.size());
        }

        // 对列表进行二级排序; 一级：count_time 这个是已经数据库中拍好的，二级排序则按照卡口的创建时间进行排序

//        1. 获取卡口在数据库中的数据（按照创建时间排序），数据库中已经设定好

        Map data = synthsizeFegin.getLockCrossingList(new KkBaseinfoDto()).getData();

        // 获取列表数据
        ArrayList<Map<String, Object>> kkBaseinfoList = (ArrayList<Map<String, Object>>) data.get("rows");

        Map<String, String> kkMap = kkBaseinfoList.stream().collect(Collectors.toMap(k -> k.get("kkname").toString(), v -> v.get("createTime").toString()));

        peopleKkList.stream().map(t -> {
            if (kkMap.get(t.getKkName()) != null) {
                t.setKkCreateTime(DateTimeUtil.strToDateLong(kkMap.get(t.getKkName()), DateTimeUtil.format_yyyy_MM_dd_HH_mm_SS));
            }
            return t;
        }).collect(Collectors.toList());


        peopleKkList.sort(Comparator.comparing(PeopleKkInOutCountDto::getCountTime, Comparator.reverseOrder())
                .thenComparing((t1, t2) -> {
                    return new Long(t1.getKkCreateTime().getTime() - t2.getKkCreateTime().getTime()).intValue();
                }));

        return peopleKkList;

    }
```

## 2 List set Map 的流排序 



原文：[Java8排序stream.sorted()](https://blog.csdn.net/qq_34996727/article/details/94472999)



1.sorted()方法的语法示例。 

1.1sorted()：它使用自然顺序对流的元素进行排序。元素类必须实现Comparable接口。 


```java
// 按自然升序对集合进行排序
list.stream().sorted() .stream().sorted();

// 自然序降序使用Comparator提供reverseOrder()方法
list.stream().sorted(Comparator.reverseOrder()) .stream().sorted(Comparator.reverseOrder());

```



1.2 sorted(Comparator<? super T> comparator):这里我们创建一个Comparator使用lambda表达式的实例。我们可以按升序和降序对流元素进行排序。 

```java
// 使用Comparator来对列表进行自定义升序。 
list.stream().sorted(Comparator.comparing(Student::getAge)) .stream().sorted(Comparator.comparing(Student::getAge));


// 使用Comparator提供reversed()方法来对列表进行自定义降序。 。 

list.stream().sorted(Comparator.comparing(Student::getAge).reversed()) .stream().sorted(Comparator.comparing(Student::getAge).reversed());

```


### 2.2 使用List 排序

> 1 实体类


```java


package com.stream.demo;
 
public class Student implements Comparable<Student> {
	private int id;
	private String name;
	private int age;
 
	public Student(int id, String name, int age) {
		this.id = id;
		this.name = name;
		this.age = age;
	}
 
	public int getId() {
		return id;
	}
 
	public String getName() {
		return name;
	}
 
	public int getAge() {
		return age;
	}
 
	@Override
	public int compareTo(Student ob) {
		return name.compareTo(ob.getName());
	}
 
	@Override
	public boolean equals(final Object obj) {
		if (obj == null) {
			return false;
		}
		final Student std = (Student) obj;
		if (this == std) {
			return true;
		} else {
			return (this.name.equals(std.name) && (this.age == std.age));
		}
	}
 
	@Override
	public int hashCode() {
		int hashno = 7;
		hashno = 13 * hashno + (name == null ? 0 : name.hashCode());
		return hashno;
	}
}

```

*  List 

```java

package com.stream.demo;
 
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
 
public class StreamListDemo {
	public static void main(String[] args) {
		List<Student> list = new ArrayList<>();
		list.add(new Student(1, "Mahesh", 12));
		list.add(new Student(2, "Suresh", 15));
		list.add(new Student(3, "Nilesh", 10));
 
		System.out.println("---Natural Sorting by Name---");
		List<Student> slist = list.stream().sorted().collect(Collectors.toList());
		slist.forEach(e -> System.out.println("Id:" + e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
 
		System.out.println("---Natural Sorting by Name in reverse order---");
		slist = list.stream().sorted(Comparator.reverseOrder()).collect(Collectors.toList());
		slist.forEach(e -> System.out.println("Id:" + e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
 
		System.out.println("---Sorting using Comparator by Age---");
		slist = list.stream().sorted(Comparator.comparing(Student::getAge)).collect(Collectors.toList());
		slist.forEach(e -> System.out.println("Id:" + e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
 
		System.out.println("---Sorting using Comparator by Age with reverse order---");
		slist = list.stream().sorted(Comparator.comparing(Student::getAge).reversed()).collect(Collectors.toList());
		slist.forEach(e -> System.out.println("Id:" + e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
	}
}

```


```

---Natural Sorting by Name---
Id:1, Name: Mahesh, Age:12
Id:3, Name: Nilesh, Age:10
Id:2, Name: Suresh, Age:15
---Natural Sorting by Name in reverse order---
Id:2, Name: Suresh, Age:15
Id:3, Name: Nilesh, Age:10
Id:1, Name: Mahesh, Age:12
---Sorting using Comparator by Age---
Id:3, Name: Nilesh, Age:10
Id:1, Name: Mahesh, Age:12
Id:2, Name: Suresh, Age:15
---Sorting using Comparator by Age with reverse order---
Id:2, Name: Suresh, Age:15
Id:1, Name: Mahesh, Age:12
Id:3, Name: Nilesh, Age:10
```


* 3 Set 


```java
package com.stream.demo;
 
import java.util.Comparator;
import java.util.HashSet;
import java.util.Set;
 
public class StreamSetDemo {
	public static void main(String[] args) {
		Set<Student> set = new HashSet<>();
		set.add(new Student(1, "Mahesh", 12));
		set.add(new Student(2, "Suresh", 15));
		set.add(new Student(3, "Nilesh", 10));
 
		System.out.println("---Natural Sorting by Name---");
		System.out.println("---Natural Sorting by Name---");
		set.stream().sorted().forEach(e -> System.out.println("Id:"
						+ e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
 
		System.out.println("---Natural Sorting by Name in reverse order---");
		set.stream().sorted(Comparator.reverseOrder()).forEach(e -> System.out.println("Id:"
						+ e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
 
		System.out.println("---Sorting using Comparator by Age---");
		set.stream().sorted(Comparator.comparing(Student::getAge))
						.forEach(e -> System.out.println("Id:" + e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
 
		System.out.println("---Sorting using Comparator by Age in reverse order---");
		set.stream().sorted(Comparator.comparing(Student::getAge).reversed())
						.forEach(e -> System.out.println("Id:" + e.getId() + ", Name: " + e.getName() + ", Age:" + e.getAge()));
	}
}
```

* 4 使用 Map 排序

```java

package com.stream.demo;
 
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
 
public class StreamMapDemo {
	public static void main(String[] args) {
		Map<Integer, String> map = new HashMap<>();
		map.put(15, "Mahesh");
		map.put(10, "Suresh");
		map.put(30, "Nilesh");
 
		System.out.println("---Sort by Map Value---");
		map.entrySet().stream().sorted(Comparator.comparing(Map.Entry::getValue))
						.forEach(e -> System.out.println("Key: "+ e.getKey() +", Value: "+ e.getValue()));
 
		System.out.println("---Sort by Map Key---");System.out.println("---Sort by Map Key---");
		map.entrySet().stream().sorted(Comparator.comparing(Map.Entry::getKey))
						.forEach(e -> System.out.println("Key: "+ e.getKey() +", Value: "+ e.getValue()));
	}
}
```


## Null  First / last 排序案例

使用 Comparator.nullsFirst进行排序
当集合中存在null元素时，可以使用针对null友好的比较器，null元素排在集合的最前面

```java

employees.add(null);  //插入一个null元素
Collections.sort(employees, Comparator.nullsFirst(Comparator.comparing(Employee::getName)));
employees.forEach(System.out::println);
Collections.sort(employees, Comparator.nullsLast(Comparator.comparing(Employee::getName)));

```



## 集合排序字符串案例总结


```java
 private static void sortCompire() {
//        List<String> collect = Stream.of("apple", "mango", "banana", "fruit").collect(Collectors.toList());
        List<String> collect = Stream.of("apple", "mango", "aa", "banana", "fruit").collect(Collectors.toList());
        System.out.println("原list-------");
        System.out.println(collect);
        // 字母正序
        System.out.println("Collections 字母正序-------");
        Collections.sort(collect);
        System.out.println(collect);

        System.out.println("Collections 字母逆序-------");
        Collections.sort(collect,Comparator.reverseOrder());
        System.out.println(collect);

        // 字母倒序
        System.out.println("List 字母倒序-------");
        collect.sort((k, v) -> {
            return v.compareTo(k);
        });
        System.out.println(collect);

        System.out.println("List 字母正序-------");
        collect.sort((k, v) -> {
            return k.compareTo(v);
        });
        System.out.println(collect);

        System.out.println("List,Compartor 字母逆序----------");
        collect.sort(Comparator.reverseOrder());
        System.out.println(collect);

        System.out.println("List,Compartor  字母正序----------");
        collect.sort(Comparator.comparing(String::new));

        System.out.println(collect);

    }

```



## hashMap 排序

```java

Map<String, Integer> map = new HashMap<String, Integer>();
map.put("d", 2);
map.put("c", 1);
map.put("b", 1);
map.put("a", 3);
 
List<Map.Entry<String, Integer>> infoIds =
  new ArrayList<Map.Entry<String, Integer>>(map.entrySet());
 
//排序前
for (int i = 0; i < infoIds.size(); i++) {
  String id = infoIds.get(i).toString();
  System.out.println(id);
}
//d 2
//c 1
//b 1
//a 3
 
//排序
Collections.sort(infoIds, new Comparator<Map.Entry<String, Integer>>() { 
  public int compare(Map.Entry<String, Integer> o1, Map.Entry<String, Integer> o2) { 
  //return (o2.getValue() - o1.getValue());
  return (o1.getKey()).toString().compareTo(o2.getKey());
  }
});
 
//排序后
for (int i = 0; i < infoIds.size(); i++) {
  String id = infoIds.get(i).toString();
  System.out.println(id);
}

```