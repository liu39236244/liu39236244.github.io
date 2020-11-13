# List 转 Map 使用


## List转 map 使用

```java
背景
在最近的工作开发之中，慢慢习惯了很多Java8中的Stream的用法，很方便而且也可以并行的去执行这个流，这边去写一下昨天遇到的一个list转map的场景。
list转map在Java8中stream的应用
常用方式
1.利用Collectors.toMap方法进行转换

public Map<Long, String> getIdNameMap(List<Account> accounts) {
return accounts.stream().collect(Collectors.toMap(Account::getId, Account::getUsername));
}

其中第一个参数就是可以，第二个参数就是value的值。

2.收集对象实体本身
- 在开发过程中我们也需要有时候对自己的list中的实体按照其中的一个字段进行分组（比如 id ->List），这时候要设置map的value值是实体本身。

public Map<Long, Account> getIdAccountMap(List<Account> accounts) {
return accounts.stream().collect(Collectors.toMap(Account::getId, account -> account));
}

account -> account是一个返回本身的lambda表达式，其实还可以使用Function接口中的一个默认方法 Function.identity()，这个方法返回自身对象，更加简洁

重复key的情况。
在list转为map时，作为key的值有可能重复，这时候流的处理会抛出个异常：Java.lang.IllegalStateException:Duplicate key。这时候就要在toMap方法中指定当key冲突时key的选择。(这里是选择第二个key覆盖第一个key)
public Map<String, Account> getNameAccountMap(List<Account> accounts) {
return accounts.stream().collect(Collectors.toMap(Account::getUsername, Function.identity(), (key1, key2) -> key2));
}

用groupingBy 或者 partitioningBy进行分组
根据一个字段或者属性分组也可以直接用groupingBy方法，很方便。
Map<Integer, List<Person>> personGroups = Stream.generate(new PersonSupplier()).
limit(100).
collect(Collectors.groupingBy(Person::getAge));
Iterator it = personGroups.entrySet().iterator();
while (it.hasNext()) {
Map.Entry<Integer, List<Person>> persons = (Map.Entry) it.next();
System.out.println("Age " + persons.getKey() + " = " + persons.getValue().size());
}

partitioningBy可以理解为特殊的groupingBy，key值为true和false，当然此时方法中的参数为一个判断语句（用于判断的函数式接口）
Map<Boolean, List<Person>> children = Stream.generate(new PersonSupplier()).
limit(100).
collect(Collectors.partitioningBy(p -> p.getAge() < 18));
System.out.println("Children number: " + children.get(true).size());
System.out.println("Adult number: " + children.get(false).size());



public void testStream(){
        JSONObject ecsInstanceList = productInstance.getEcsInstanceList();
        JSONArray ecsArr = ecsInstanceList.getJSONObject("data").getJSONArray("result") ;
        
        Map<String, Object> collect = ecsArr.stream().collect(Collectors.toMap(i -> {JSONObject a= (JSONObject)i;String k = a.getString("instanceId");return k;} , Function.identity()));
        System.out.println(collect);
    }

```