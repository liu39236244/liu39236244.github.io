# spark javaAPI RDD 总结

## 1-spark RDD 类型汇总


## 2-spark RDD 操作

### 2-1 spark RDD 操作
* 1-collect
> 说明返回java类型的List
```java
final List<Tuple2<String, String>> collect = othproCount.collect();
final List<T> collect = othproCount.collect(); // T 可以使多种类型

```

* 2-collectAsMap
```Java
final Map<String, String> stringStringMap = pro_map.collectAsMap();
final Map<K,V> stringStringMap = pro_map.collectAsMap(); // 可以使多种类型
```
