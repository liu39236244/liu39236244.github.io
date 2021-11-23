# Map 的排序




## HashMap 1.8新特性进行排序

```java
package com.drew.test;

import java.util.List;
import java.util.Map;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;

/**
 * @author zero 2019/04/08
 */
public class Java8future {

    public static void main(String[] args) {
        Map<String, Integer> map = ImmutableMap.of("0", 3, "1", 8, "0.29", 7, "1.67", 3);
        System.out.println("原始的map：" + map);
        System.out.println("根据map的key降序：" + sortByKey(map, true));
        System.out.println("根据map的key升序：" + sortByKey(map, false));
        System.out.println("根据map的value降序：" + sortByValue(map, true));
        System.out.println("根据map的value升序：" + sortByValue(map, false));
    }

    /**
     * 根据map的key排序
     * 
     * @param map 待排序的map
     * @param isDesc 是否降序，true：降序，false：升序
     * @return 排序好的map
     * @author zero 2019/04/08
     */
    public static <K extends Comparable<? super K>, V> Map<K, V> sortByKey(Map<K, V> map, boolean isDesc) {
        Map<K, V> result = Maps.newLinkedHashMap();
        if (isDesc) {
            map.entrySet().stream().sorted(Map.Entry.<K, V>comparingByKey().reversed())
                .forEachOrdered(e -> result.put(e.getKey(), e.getValue()));
        } else {
            map.entrySet().stream().sorted(Map.Entry.<K, V>comparingByKey())
                .forEachOrdered(e -> result.put(e.getKey(), e.getValue()));
        }
        return result;
    }

    /**
     * 根据map的value排序
     * 
     * @param map 待排序的map
     * @param isDesc 是否降序，true：降序，false：升序
     * @return 排序好的map
     * @author zero 2019/04/08
     */
    public static <K, V extends Comparable<? super V>> Map<K, V> sortByValue(Map<K, V> map, boolean isDesc) {
        Map<K, V> result = Maps.newLinkedHashMap();
        if (isDesc) {            
            map.entrySet().stream().sorted(Map.Entry.<K, V>comparingByValue().reversed())
            .forEachOrdered(e -> result.put(e.getKey(), e.getValue()));
        } else {            
            map.entrySet().stream().sorted(Map.Entry.<K, V>comparingByValue())
            .forEachOrdered(e -> result.put(e.getKey(), e.getValue()));
        }
        return result;
    }
}

```


## TreeMap 


### TreeMap 对key value 进行非1.8新特性排序方法

TreeMap默认按key进行升序排序，下面我们将对key和value进行降序排列。


```java



1. key进行降序排序
Map<String,String> map = new TreeMap<String,String>(new Comparator<String>(){ 
   public int compare(String obj1,String obj2){ 
    //降序排序 
    return obj2.compareTo(obj1); 
   } 
}); 
map.put("month", "The month"); 
map.put("bread", "The bread"); 
map.put("attack", "The attack"); 
Set<String> keySet = map.keySet(); 
Iterator<String> iter = keySet.iterator(); 
while(iter.hasNext()){ 
    String key = iter.next(); 
    System.out.println(key+":"+map.get(key)); 
}


```

2. value进行降序排列
```java


List<Map.Entry<String,String>> mappingList = null; 
Map<String,String> map = new TreeMap<String,String>(); 
map.put("aaaa", "month"); 
map.put("bbbb", "bread"); 
map.put("ccccc", "attack"); 
//通过ArrayList构造函数把map.entrySet()转换成list 
mappingList = new ArrayList<Map.Entry<String,String>>(map.entrySet()); 
//通过比较器实现比较排序 
Collections.sort(mappingList, new Comparator<Map.Entry<String,String>>(){ 
  public int compare(Map.Entry<String,String> mapping1,Map.Entry<String,String> mapping2){  
      return mapping1.getValue().compareTo(mapping2.getValue()); 
  }
});
for(Map.Entry<String,String> mapping:mappingList){  
    System.out.println(mapping.getKey()+":"+mapping.getValue()); 
}
```



### treeMap 1.8新特性；初始化排序器逆序key排序


```java
    @Test
    public void treeMapTest(){

        TreeMap<String, String> testMap = new TreeMap<>((t1,t2)->{
            return t2.compareTo(t1);
        });

        testMap.put("2", "二");
        testMap.put("4", "四");
        testMap.put("1", "一");
        testMap.put("3", "三");
        testMap.put("8", "八");
        // {8=八, 4=四, 3=三, 2=二, 1=一}
        System.out.println(testMap.toString());
        // 8
        System.out.println(testMap.firstKey());
    }
```


### 其他方式排序器实现


```java
TreeMap自定义排序有两种方式：

1, 在Student类中实现Comparable，重写compareTo方法
2,在构造函数中new Comparator,匿名内部类，重写compare 方法
以下是第二种具体实现代码逻辑：

import java.util.Comparator;
import java.util.TreeMap;

public class TreeMapDemo {
    /**
     * 需要对 key 和 value 排序时使用
     * 底层使用红黑二叉树
     */
    public static void main(String[] args) {
        // 内部类重写 compare 对 key排序
        TreeMap<Integer, Student> treeMap = new TreeMap<>(new Comparator<Integer>() {
            @Override
            public int compare(Integer o1, Integer o2) {
                // -1 升序 1 降序
                if (o1 < o2) {
                    return 1;
                }
                if (o1 > o2) {
                    return -1;
                }
                return 0;
            }
        });
        Student student = new Student(3, "s");
        Student student2 = new Student(5, "s");
        treeMap.put(3, student);
        treeMap.put(5, student2);
        for (Object o : treeMap.entrySet()) {
            System.out.println(o);
        }

        //内部类重写 compare 对 类排序
        TreeMap<Student, String> map = new TreeMap<>(new Comparator<Student>() {
            @Override
            public int compare(Student s1, Student s2) {
                if (s1.age<s2.age){
                    return 1;
                }
                if (s1.age>s2.age){
                    return -1;
                }
                return 0;
            }
        });
        map.put(student, "3");
        map.put(student2, "5");
        for (Object o : map.entrySet()) {
            System.out.println(o);
        }
    }

    public static class Student {
        //成员变量
        private int age;
        private String name;

        public Student(int age, String name) {
            this.age = age;
            this.name = name;
        }

        public int getAge() {
            return age;
        }

        public void setAge(int age) {
            this.age = age;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        @Override
        public String toString() {
            return "Student{" +
                    "age=" + age +
                    ", name='" + name + '\'' +
                    '}';
        }
    }
}


```



## treeMap HashMap 案例对比

最开始使用HashMap 进行做的；加了排序；后来使用treemap

### 功能大概就是获取一个目录下的所有文件；进行倒序排序；然后去掉最新的一个文件；把剩余的所有都给删了；



```java


 public void deleteOldDataBackFile() {
        log.info(DateUtils.dateTimeNow(DateUtils.YYYY_MM_DD_HH_MM_SS) + "清空数据库备份---------------start");
        List<SqlDataBackConfig> sqlDataBackConfigList = sqlBackUpRestore.getSqlDataBackConfigList();
        // 获取服务器上存储备份sql的路径
        String databaseSqlFilePath = sqlDataBackConfigList.size() > 0 ? sqlDataBackConfigList.get(0).getSaveFilePath() : "";
        HashMap<String, String> stringStringHashMap = new HashMap<>();
        FileUtils.readFilesNameMap(databaseSqlFilePath, stringStringHashMap);
        if (stringStringHashMap.size() > 0) {
            HashMap<String, String> ordered = new HashMap<>();
            // 根据key 降序排序
            ArrayList<String> fileName = new ArrayList<>();
            stringStringHashMap.entrySet().stream().sorted(Map.Entry.<String, String>comparingByKey().reversed())
                    .forEachOrdered(e -> {
                        fileName.add(e.getKey());
                        ordered.put(e.getKey(), e.getValue());
                    });
            // 倒序排序以后取出来第一个文件名；作为保留备份文件不进行删除
            String remove = ordered.remove(fileName.get(0));
            int i = 0;
            for (Map.Entry<String, String> stringStringEntry : ordered.entrySet()) {
                log.info("准备清空文件" + stringStringEntry.getKey());
                boolean delete = FileUtils.delete(stringStringEntry.getValue());
                if (delete) {
                    log.info("清空成功！");
                    i++;
                } else {
                    log.info("清空失败！");
                }
            }
            log.info("清空数据库备份文件数量: " + i);
            log.info("保留文件: " + remove);
        } else {
            log.info("清空数据库备份-目标目录没有对应任何文件！！");
        }
        log.info(DateUtils.dateTimeNow(DateUtils.YYYY_MM_DD_HH_MM_SS) + "清空数据库备份--------------end");

    }
```


### treeMap 做法

```java
@Scheduled(cron = "0 20 1 * * 1")
    public void deleteOldDataBackFile() {
        log.info(DateUtils.dateTimeNow(DateUtils.YYYY_MM_DD_HH_MM_SS) + "清空数据库备份---------------start");
        List<SqlDataBackConfig> sqlDataBackConfigList = sqlBackUpRestore.getSqlDataBackConfigList();
        // 获取服务器上存储备份sql的路径
        String databaseSqlFilePath = sqlDataBackConfigList.size() > 0 ? sqlDataBackConfigList.get(0).getSaveFilePath() : "";
        TreeMap<String, String> fileNameTreeMap = new TreeMap<>((t1,t2)->{
            return t2.compareTo(t1);
        });
        FileUtils.readFilesNameMap(databaseSqlFilePath, fileNameTreeMap);
        if (fileNameTreeMap.size() > 0) {
            // 倒序排序以后取出来第一个文件名；作为保留备份文件不进行删除
            String remove = fileNameTreeMap.remove(fileNameTreeMap.firstKey());
            int i = 0;
            for (Map.Entry<String, String> stringStringEntry : fileNameTreeMap.entrySet()) {
                log.info("准备清空文件" + stringStringEntry.getKey());
                boolean delete = FileUtils.delete(stringStringEntry.getValue());
                if (delete) {
                    log.info("清空成功！");
                    i++;
                } else {
                    log.info("清空失败！");
                }
            }
            log.info("清空数据库备份文件数量: " + i);
            log.info("保留文件: " + remove);
        } else {
            log.info("清空数据库备份-目标目录没有对应任何文件！！");
        }
        log.info(DateUtils.dateTimeNow(DateUtils.YYYY_MM_DD_HH_MM_SS) + "清空数据库备份--------------end");

    }
```