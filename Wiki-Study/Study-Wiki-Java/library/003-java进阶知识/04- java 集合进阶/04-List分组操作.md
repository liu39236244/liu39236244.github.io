# java中List分组


## 将一个list 分成n组 

[原文地址](https://www.yisu.com/zixun/218678.html)

```java
/**
     * 将一个list均分成n个list,主要通过偏移量来实现的
     * @param source
     * @return
     */
    public static <T> List<List<T>> averageAssign(List<T> source,int n){
        List<List<T>> result=new ArrayList<List<T>>();
        int remaider=source.size()%n; //(先计算出余数)
        int number=source.size()/n; //然后是商
        int offset=0;//偏移量
        for(int i=0;i<n;i++){
            List<T> value=null;
            if(remaider>0){
                value=source.subList(i*number+offset, (i+1)*number+offset+1);
                remaider--;
                offset++;
            }else{
                value=source.subList(i*number+offset, (i+1)*number+offset);
            }
            result.add(value);
        }
        return result;
    }
```

使用

```java
 public static void main(String[] args) {
        List<Integer> integers=new ArrayList<>();
        integers.add(1);
        integers.add(2);
        integers.add(3);
        integers.add(4);
        integers.add(5);
        List<List<Integer>> lists=averageAssign(integers, 2);
        System.out.println(lists);
    }

```

## 将一个list 每组按照 n 个元素

### 第一种三方包

1、使用google guava对List进行分割
需要引入google guava依赖，引入后可以使用，简单方便但是需要引入额外依赖


com.google.guava
guava
23.0
拆分调用

List list = new ArrayList();
//拆分list
list <List> partition = Lists.partition(list , 200);

```java
public static void main(String[] args) {
  List<String> list = Lists.newArrayList();
  int size = 1099;
  for (int i = 0; i < size; i++) {
    list.add("hello-" + i);
  }
  // 切割大集合到指定的长度：11
  List<List<String>> rsList = Lists.partition(list, 11);
  int i = 0;
  for (List<String> obj : rsList) {
    System.out.println(String.format("row:%s -> size:%s,data:%s", ++i, obj.size(), obj));
  }
}
```


### 第二种

```java

/**
 * 按指定大小，分隔集合，将集合按规定个数分为n个部分
 *
 * @param
 *
 * @param list
 * @param len
 * @return
 */
public  List<List> splitList(List list, int len) {

    if (list == null || list.isEmpty() || len < 1) {
        return Collections.emptyList();
    }

    List <List > result = new ArrayList<List>();

    int size = list.size();
    int count = (size + len - 1) / len;

    for (int i = 0; i < count; i++) {
        List subList = list.subList(i * len, ((i + 1) * len > size ? size : len * (i + 1)));
        result.add(subList);
    }

    return result;
}
```
### 第三种

```java
  /*
   * List分割
   */
  public static List<List<String>> groupList(List<String> list) {
    List<List<String>> listGroup = new ArrayList<List<String>>();
    int listSize = list.size();
    //子集合的长度
    int toIndex = 2;
    for (int i = 0; i < list.size(); i += 2) {
      if (i + 2 > listSize) {
        toIndex = listSize - i;
      }
      List<String> newList = list.subList(i, i + toIndex);
      listGroup.add(newList);
    }
    return listGroup;
  }
 
public static void main(String[] args) {
    List<String> list = new ArrayList<>();
    list.add("1");
    list.add("2");
    list.add("3");
    list.add("4");
    list.add("5");
    list.add("6");
    list.add("7");
    List<List<String>> lists = groupList(list);
    System.out.println("list:" + list.toString());
    System.out.println(lists);
}
```


![](assets/003/04/04-1661327377338.png)

### 第三种

```java
 /**
   * 拆分集合
   * 
   * @param <T> 泛型对象
   * @param resList 需要拆分的集合
   * @param subListLength 每个子集合的元素个数
   * @return 返回拆分后的各个集合组成的列表
   * 代码里面用到了guava和common的结合工具类
   **/
  public static <T> List<List<T>> split(List<T> resList, int subListLength) {
    if (CollectionUtils.isEmpty(resList) || subListLength <= 0) {
      return Lists.newArrayList();
    }
    List<List<T>> ret = Lists.newArrayList();
    int size = resList.size();
    if (size <= subListLength) {
      // 数据量不足 subListLength 指定的大小
      ret.add(resList);
    } else {
      int pre = size / subListLength;
      int last = size % subListLength;
      // 前面pre个集合，每个大小都是 subListLength 个元素
      for (int i = 0; i < pre; i++) {
        List<T> itemList = Lists.newArrayList();
        for (int j = 0; j < subListLength; j++) {
          itemList.add(resList.get(i * subListLength + j));
        }
        ret.add(itemList);
      }
      // last的进行处理
      if (last > 0) {
        List<T> itemList = Lists.newArrayList();
        for (int i = 0; i < last; i++) {
          itemList.add(resList.get(pre * subListLength + i));
        }
        ret.add(itemList);
      }
    }
    return ret;
  }
 
// 运行代码
public static void main(String[] args) {
  List<String> list = Lists.newArrayList();
  int size = 1099;
  for (int i = 0; i < size; i++) {
    list.add("hello-" + i);
  }
 
  List<List<String>> temps = split(list, 6);
  int j = 0;
  for (List<String> obj : temps) {
    System.out.println(String.format("row:%s -> size:%s,data:%s", ++j, obj.size(), obj));
  }
}

```