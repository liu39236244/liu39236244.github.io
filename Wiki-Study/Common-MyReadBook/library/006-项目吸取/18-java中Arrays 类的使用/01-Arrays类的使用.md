# 1.Java中Arrays对象的使用


# 1-java 中Arrays 使用总结

## Arrays 常用方法：

### 1-1 填充数组 将指定的元素放在指定的数组中
原文链接：https://blog.csdn.net/strong_yu/article/details/53316797

```
fill( int[] a, int val)
fill(int[] a,int fromIndex,int toIndex,int val)  将val插入到a数组的指定范围内
以int型数组为例,fill( int[] a, int val)  表示val将填充a数组的每一个元素

```

```java
public static void main(String[] args) {
    int[] a = new int[10];
    Arrays.fill(a,15);
    for(int i=0;i<a.length;i++){
      System.out.print(a[i]);
    }
}

结果：
15 15 15 15 15 15 15 15 15 15

```

### 1-2 copy 复制数组
用System.arrayCopy() 函数


```java
public static void main(String[] args) {
      int[] i = new int[7];
      int[] j= new int[10];
      Arrays.fill(i, 47);
      Arrays.fill(j,49);
      System.out.println("i="+Arrays.toString(i));
      System.out.println("j="+Arrays.toString(j));
      System.arraycopy(i, 0, j, 0, i.length);
      System.out.println("j="+Arrays.toString(j));
      //引用类型
      Integer[] u= new Integer[10];
      Integer[] v= new Integer[5];
      //添加值
      Arrays.fill(u, new Integer(47));
      Arrays.fill(v, new Integer(49));
      System.out.println("u="+Arrays.toString(u));
      System.out.println("v="+Arrays.toString(v));
      System.arraycopy(v, 0, u, u.length/2, v.length);
      System.out.println("u="+Arrays.toString(u));
      System.out.println("v="+Arrays.toString(v));
      System.out.println("u="+Arrays.toString(u));
}
```



# 2- Arrays 使用博主

## 2-1 Arrays 的简单实用

```

```
