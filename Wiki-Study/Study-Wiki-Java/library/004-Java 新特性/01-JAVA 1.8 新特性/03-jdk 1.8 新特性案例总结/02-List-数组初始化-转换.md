# 数组初始化

##  数组初始化

原文地址：https://blog.csdn.net/weixin_38106322/article/details/105983210

```
先创建出List再做赋值操作，如下：
 List<Integer> list = new ArrayList<>();
        list.add(1);
        list.add(2);
        list.add(3);

使用Arrays.asList方法，如下：
 List<Integer> list = Arrays.asList(1, 2, 3);

导入Guava依赖包，使用Google Guava工具集Lists方法，如下：
  List<Integer> list = Lists.newArrayList(1, 2, 3);

使用Stream，不过要求JDK版本在8以上，如下：
List<Integer> list = Stream.of(1, 2, 3).collect(Collectors.toList());

使用Lists，不过要求JDK版本在9以上，如下：
List<Integer> list = Lists.of(1,2,3);
```


## List 的转换


### List 对象只取出来单个id


```java
  //原始数据id集合
 List<String> oldIdList = oldList.stream().map(HumitureAlarmRule::getId).collect(Collectors.toList());
```