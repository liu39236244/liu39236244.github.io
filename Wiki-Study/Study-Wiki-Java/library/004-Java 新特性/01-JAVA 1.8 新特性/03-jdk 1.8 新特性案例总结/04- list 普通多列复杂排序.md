# list 使用1.8新特性进行自定义对象多列复杂排序


## 自然排序，三列


* 原博主：https://blog.csdn.net/kang_jie/article/details/106627814?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.add_param_isCf&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.add_param_isCf


```java
@Data
public class User {

    private String name;
    private Integer age;
    private Integer gameLevel;

    public User(String name, Integer age, Integer gameLevel) {
        this.name = name;
        this.age = age;
        this.gameLevel = gameLevel;
    }

    public static void main(String[] args) {
        List<User> users = new ArrayList<>();
        users.add(new User("a", 25, 8));
        users.add(new User("c", 25, 4));
        users.add(new User("b", 25, 4));
        users.add(new User("a", 23, 7));
        users.add(new User("d", 25, 4));
        users.add(new User("a", 25, 6));
        users.add(new User("b", 25, 4));
        users.add(new User("a", 30, 4));
        users.add(new User("a", 25, 4));

        System.out.println("===========================================>排序前：");
        users.forEach(user -> {
            System.out.println(user);
        });

        
        // java8 复杂排序--先name，再age，再gameLevel，全部默认升序
        users.sort(Comparator.comparing(User::getName)
                .thenComparing(User::getAge)
                .thenComparing(User::getGameLevel));
        System.out.println("===========================================>排序后：默认全部升序");
        users.forEach(user -> {
            System.out.println(user);
        });

        // java8 复杂排序--先name升序，再age降序，再gameLevel升序
        users.sort(Comparator.comparing(User::getName)
                .thenComparing(User::getAge, Comparator.reverseOrder())		// Comparator.reverseOrder() 对上一个排序规则进行反序
                .thenComparing(User::getGameLevel, Comparator.reverseOrder()));
        System.out.println("===========================================>先name升序，再age降序，再gameLevel升序");
        users.forEach(user -> {
            System.out.println(user);
        });
    }
```


![](assets/004/01/03/04-1605160218142.png)


## 自定义对象时间排序2 

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