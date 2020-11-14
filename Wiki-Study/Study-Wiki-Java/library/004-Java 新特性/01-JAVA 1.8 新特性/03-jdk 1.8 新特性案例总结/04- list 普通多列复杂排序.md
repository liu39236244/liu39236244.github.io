# list 使用1.8新特性进行自定义对象多列复杂排序


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