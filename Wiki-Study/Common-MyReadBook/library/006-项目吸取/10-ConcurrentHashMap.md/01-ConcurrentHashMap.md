# ConcurrenthashMap

# 1-基础

## 1-1介绍


## 1-2优缺点




## 1-3对比


# 2-代码测试


## 2-1简单测试

### 测试containskey

```java
public static void testMapContainskey(){
    Map<String, String> test = new ConcurrentHashMap<String,String>();
    test.put("123", "456");
    test.put("123", "456");
    System.out.println("12 包含"+(test.containsKey("12")?true:false)); //false
    System.out.println("123 包含"+(test.containsKey("123")?true:false)); //true
    System.out.println("个数"+test.size()); //1
}

```
