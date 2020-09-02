# Java 集合基本操作


## java List 基本初始化 


```java
List<String> test = new ArrayList<String>();
test.add("aaa");
test.add("bbb");
test.add("ccc");
System.out.println(test.size());
 
List<String> test1 = Arrays.asList("xxx","yyy","zzz");
//test1.add("aaa");//wrong  java.lang.UnsupportedOperationException
//test1.add("bbb");//wrong  java.lang.UnsupportedOperationException
//test1.add("ccc");//wrong  java.lang.UnsupportedOperationException
System.out.println(test1.size());
 
List<String> test2 =new ArrayList<String>(Arrays.asList("xxx","yyy","zzz"));
test2.add("aaa");
test2.add("bbb");
test2.add("ccc");
System.out.println(test2.size());
 
List<String> test3 = new ArrayList<String>(){
	{  
	add("aaa");  
	add("bbb");  
	add("ccc");  
	}
}; 
 
List<Integer> list1 = new ArrayList<Integer>(Arrays.asList(12,34,45,56,78));
List<Integer> list2 = Arrays.asList(12,34,45,56,78);
匿名内部类的一个实例初始值设定项 （也称为一种"双大括号初始化"）
List<Integer> list3 = new ArrayList<Integer>(){
 {add(12);add(34);add(45);add(56);add(78);}  
};
```
