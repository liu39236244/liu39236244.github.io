# StringBuffer 使用


## 1-介绍：StringBUffer


## 2- 总结

### 2-1 StringBuffer 的清空

* 1- 总结

```
sbi.setLength(0) ；效率最高
```

### 2-2 博主总结

* 1- 博主地址 ：https://blog.csdn.net/l2tp1012/article/details/37975831

#### 1 循环中清空
```
在循环中使用sb = new StringBuffer("");来清空sb中的信息。
```

#### 2- 提供的另外方法

```java
private static void testStringBufferclear() {
        StringBuffer sbf = new  StringBuffer("wwwwww");
        StringBuffer sbi = new  StringBuffer("wwwwww");
        long s1 = System.currentTimeMillis();
        for (int i = 0; i < 500000; i++) {
         sbi.setLength(0);
        }
        long s11 = System.currentTimeMillis();
        System.out.println("StringBuffer-setLength:" + (s11 - s1));

        s1 = System.currentTimeMillis();
        for (int i = 0; i < 500000; i++) {
         sbf.delete(0, sbf.length());
        }
        s11 = System.currentTimeMillis();
        System.out.println("StringBuffer--delete:" + (s11 - s1));
        s1 = System.currentTimeMillis();
        for (int i = 0; i < 500000; i++) {
         sbf = new StringBuffer("");
        }
        s11 = System.currentTimeMillis();
        System.out.println("StringBuffer--new StringBuffer:" + (s11 - s1));
       }


结果：

StringBuffer-setLength:63
StringBuffer--delete:109
StringBuffer--new StringBuffer:78

```
#### 3- 结论：

```
要通过使用sbi.setLength(0);来清空StringBuffer对象中的内容效率最高。
```


# StringBuffer other
