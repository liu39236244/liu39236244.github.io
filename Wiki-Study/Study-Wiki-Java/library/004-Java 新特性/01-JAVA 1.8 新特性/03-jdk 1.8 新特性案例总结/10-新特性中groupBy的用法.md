# 新特性groupby特性用法





##  [原文地址](https://blog.csdn.net/u014231523/article/details/102535902)

其他博主相关文档

[java8中map新增方法详解](https://blog.csdn.net/u014231523/article/details/100624932)

[java8中Stream的使用](https://blog.csdn.net/u014231523/article/details/100636009)

[java8中Collection新增方法详解](https://blog.csdn.net/u014231523/article/details/100636059)

[java8中Collectors的方法使用实例 ](https://blog.csdn.net/u014231523/article/details/100637239)

[java8中常用函数式接口](https://blog.csdn.net/u014231523/article/details/101647679)

[java8中的方法引用和构造函数引用](https://blog.csdn.net/u014231523/article/details/101718491)

[java8中的Collectors.groupingBy用法](https://blog.csdn.net/u014231523/article/details/102535902)

[java8中的Optional用法](https://blog.csdn.net/u014231523/article/details/102649003)

[java8中的日期和时间API](https://blog.csdn.net/u014231523/article/details/102652501)



## 数据准备

Collectors.groupingBy根据一个或多个属性对集合中的项目进行分组

```java
public Product(Long id, Integer num, BigDecimal price, String name, String category) {
	this.id = id;
	this.num = num;
	this.price = price;
	this.name = name;
	this.category = category;
}

Product prod1 = new Product(1L, 1, new BigDecimal("15.5"), "面包", "零食");
Product prod2 = new Product(2L, 2, new BigDecimal("20"), "饼干", "零食");
Product prod3 = new Product(3L, 3, new BigDecimal("30"), "月饼", "零食");
Product prod4 = new Product(4L, 3, new BigDecimal("10"), "青岛啤酒", "啤酒");
Product prod5 = new Product(5L, 10, new BigDecimal("15"), "百威啤酒", "啤酒");
List<Product> prodList = Lists.newArrayList(prod1, prod2, prod3, prod4, prod5);


```

### 普通分组


```java
Map<String, List<Product>> prodMap= prodList.stream().collect(Collectors.groupingBy(Product::getCategory));

//{"啤酒":[{"category":"啤酒","id":4,"name":"青岛啤酒","num":3,"price":10},{"category":"啤酒","id":5,"name":"百威啤酒","num":10,"price":15}],"零食":[{"category":"零食","id":1,"name":"面包","num":1,"price":15.5},{"category":"零食","id":2,"name":"饼干","num":2,"price":20},{"category":"零食","id":3,"name":"月饼","num":3,"price":30}]}


```

### 自定义key分组

```java
Map<String, List<Product>> prodMap = prodList.stream().collect(Collectors.groupingBy(item -> item.getCategory() + "_" + item.getName()));

//{"零食_月饼":[{"category":"零食","id":3,"name":"月饼","num":3,"price":30}],"零食_面包":[{"category":"零食","id":1,"name":"面包","num":1,"price":15.5}],"啤酒_百威啤酒":[{"category":"啤酒","id":5,"name":"百威啤酒","num":10,"price":15}],"啤酒_青岛啤酒":[{"category":"啤酒","id":4,"name":"青岛啤酒","num":3,"price":10}],"零食_饼干":[{"category":"零食","id":2,"name":"饼干","num":2,"price":20}]}


```


### 根据条件；指定自定义key 分组


```java
Map<String, List<Product>> prodMap= prodList.stream().collect(Collectors.groupingBy(item -> {
	if(item.getNum() < 3) {
		return "3";
	}else {
		return "other";
	}
}));

//{"other":[{"category":"零食","id":3,"name":"月饼","num":3,"price":30},{"category":"啤酒","id":4,"name":"青岛啤酒","num":3,"price":10},{"category":"啤酒","id":5,"name":"百威啤酒","num":10,"price":15}],"3":[{"category":"零食","id":1,"name":"面包","num":1,"price":15.5},{"category":"零食","id":2,"name":"饼干","num":2,"price":20}]}


```


### 多级分组

多级分组
要实现多级分组，我们可以使用一个由双参数版本的Collectors.groupingBy工厂方法创 建的收集器，它除了普通的分类函数之外，还可以接受collector类型的第二个参数。那么要进 行二级分组的话，我们可以把一个内层groupingBy传递给外层groupingBy，并定义一个为流 中项目分类的二级标准。


```java
Map<String, Map<String, List<Product>>> prodMap= prodList.stream().collect(Collectors.groupingBy(Product::getCategory, Collectors.groupingBy(item -> {
	if(item.getNum() < 3) {
		return "3";
	}else {
		return "other";
	}
})));

//{"啤酒":{"other":[{"category":"啤酒","id":4,"name":"青岛啤酒","num":3,"price":10},{"category":"啤酒","id":5,"name":"百威啤酒","num":10,"price":15}]},"零食":{"other":[{"category":"零食","id":3,"name":"月饼","num":3,"price":30}],"3":[{"category":"零食","id":1,"name":"面包","num":1,"price":15.5},{"category":"零食","id":2,"name":"饼干","num":2,"price":20}]}}



```


### 分组之后的聚合公式


### 分组以后统计条数
```java
Map<String, Long> prodMap = prodList.stream().collect(Collectors.groupingBy(Product::getCategory, Collectors.counting()));

//{"啤酒":2,"零食":3}

```

### 分组以后累加每个分组的每个对象的某些值

```java
Map<String, Integer> prodMap = prodList.stream().collect(Collectors.groupingBy(Product::getCategory, Collectors.summingInt(Product::getNum)));

//{"啤酒":13,"零食":6}

```

### 分组以后拿出来每个分组中某个值的最大值（把收集器的结果转换为另一种类型）


```java
Map<String, Product> prodMap = prodList.stream().collect(Collectors.groupingBy(Product::getCategory, Collectors.collectingAndThen(Collectors.maxBy(Comparator.comparingInt(Product::getNum)), Optional::get)));

//{"啤酒":{"category":"啤酒","id":5,"name":"百威啤酒","num":10,"price":15},"零食":{"category":"零食","id":3,"name":"月饼","num":3,"price":30}}


```


### 联合其他收集器

分组以后只拿出来某个分组对象的某个属性 (联合其他收集器)

```java
Map<String, Set<String>> prodMap = prodList.stream().collect(Collectors.groupingBy(Product::getCategory, Collectors.mapping(Product::getName, Collectors.toSet())));

//{"啤酒":["青岛啤酒","百威啤酒"],"零食":["面包","饼干","月饼"]}


```
