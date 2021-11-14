# List 转 Map 使用


## List转 map 使用

背景
在最近的工作开发之中，慢慢习惯了很多Java8中的Stream的用法，很方便而且也可以并行的去执行这个流，这边去写一下昨天遇到的一个list转map的场景。
list转map在Java8中stream的应用
常用方式

>1. 利用Collectors.toMap方法进行转换

其中第一个参数就是可以，第二个参数就是value的值。


* 1 list <Object>  转为 Map<Obejct,Object>
```java


public Map<Long, String> getIdNameMap(List<Account> accounts) {
return accounts.stream().collect(Collectors.toMap(Account::getId, Account::getUsername));
}


* List<Map<Object,Object>> 转为 Map<Obejct,Object>
// 这里如果集合对象中数据为Map 的写法

ArrayList<Map<String, Object>> kkBaseinfoList = (ArrayList<Map<String, Object>>) data.get("rows");

Map<String, String> kkMap = kkBaseinfoList.stream().collect(Collectors.toMap(k -> k.get("kkname").toString(), v -> v.get("createTime").toString()));

```



> 2.收集对象实体本身

- 在开发过程中我们也需要有时候对自己的list中的实体按照其中的一个字段进行分组（比如 id ->List），这时候要设置map的value值是实体本身。

account -> account是一个返回本身的lambda表达式，其实还可以使用Function接口中的一个默认方法 Function.identity()，这个方法返回自身对象，更加简洁

```java
public Map<Long, Account> getIdAccountMap(List<Account> accounts) {
return accounts.stream().collect(Collectors.toMap(Account::getId, account -> account));
}


```



> 3. 重复key的情况。

在list转为map时，作为key的值有可能重复，这时候流的处理会抛出个异常：Java.lang.IllegalStateException:Duplicate key。这时候就要在toMap方法中指定当key冲突时key的选择。(这里是选择第二个key覆盖第一个key)

```java

public Map<String, Account> getNameAccountMap(List<Account> accounts) {
return accounts.stream().collect(Collectors.toMap(Account::getUsername, Function.identity(), (key1, key2) -> key2));

}

```

> 4. Stream.generate 




流generate(Supplier s)返回无限顺序无序流，其中每个元素由提供的供应商生成。这适用于生成恒定流，随机元素流等。

用法:

```java
static <T> Stream<T> generate(Supplier<T> s)

// Where, Stream is an interface and T
// is the type of stream elements.
// s is the Supplier of generated 
// elements and the return value is
// a new infinite sequential
// unordered Stream.
// 示例1:生成随机整数流。


// Java code for Stream.generate() 
// to generate an infinite sequential 
// unordered stream 
import java.util.*; 
import java.util.stream.Stream; 
  
class GFG { 
      
    // Driver code 
    public static void main(String[] args) { 
      
    // using Stream.generate() method  
    // to generate 5 random Integer values 
    
    Stream.generate(new Random()::nextInt) 
    .limit(5).forEach(System.out::println);  


    // 或者
    Stream<Integer> stream = Stream.generate(() -> new Random().nextInt(10));
    stream.forEach(e -> System.out.println(e)); 
    } 
}
```
输出：

```java
697197501
50139200
321540264
1042847655
-770409472
```


示例2:生成随机Double的流。

```java
// Java code for Stream.generate() 
// to generate an infinite sequential 
// unordered stream 
import java.util.*; 
import java.util.stream.Stream; 
  
class GFG { 
      
    // Driver code 
    public static void main(String[] args) { 
      
    // using Stream.generate() method  
    // to generate 8 random Double values 
    Stream.generate(new Random()::nextDouble) 
    .limit(8).forEach(System.out::println);  
    } 
}
```


输出：

```java
0.5390254520295368
0.8477297185718798
0.23703352435894398
0.09156832989674057
0.9671295321757734
0.9989670394813547
0.8909416330715489
0.08177639888829968
```


> 5. 用groupingBy 或者 partitioningBy进行分组




根据一个字段或者属性分组也可以直接用groupingBy方法，很方便。


* PersonSupplier是一个返回Person对象的方法

```java


Map<Integer, List<Person>> personGroups = Stream.generate(new PersonSupplier()).
                limit(100).
                collect(Collectors.groupingBy(Person::getAge));
        Iterator it = personGroups.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<Integer, List<Person>> persons = (Map.Entry) it.next();
            System.out.println("Age " + persons.getKey() + " = " + persons.getValue().size());
        }

        // partitioningBy可以理解为特殊的groupingBy，key值为true和false，当然此时方法中的参数为一个判断语句（用于判断的函数式接口）
        Map<Boolean, List<Person>> children = Stream.generate(new PersonSupplier()).
                limit(100).
                collect(Collectors.partitioningBy(p -> p.getAge() < 18));
        System.out.println("Children number: " + children.get(true).size());
        System.out.println("Adult number: " + children.get(false).size());




    public void testStream() {
        JSONObject ecsInstanceList = productInstance.getEcsInstanceList();
        JSONArray ecsArr = ecsInstanceList.getJSONObject("data").getJSONArray("result");

        Map<String, Object> collect = ecsArr.stream().collect(Collectors.toMap(i -> {
            JSONObject a = (JSONObject) i;
            String k = a.getString("instanceId");
            return k;
        }, Function.identity()));
        System.out.println(collect);
    }

```