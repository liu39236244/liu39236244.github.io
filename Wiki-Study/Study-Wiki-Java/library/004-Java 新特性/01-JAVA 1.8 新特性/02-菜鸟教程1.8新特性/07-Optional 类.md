# java 8 Optional 类


Optional 类是一个可以为null的容器对象。如果值存在则isPresent()方法会返回true，调用get()方法会返回该对象。

Optional 是个容器：它可以保存类型T的值，或者仅仅保存null。Optional提供很多有用的方法，这样我们就不用显式进行空值检测。

Optional 类的引入很好的解决空指针异常。

类声明
以下是一个 java.util.Optional<T> 类的声明：

```java
public final class Optional<T>
extends Object
```

<table class="reference">
<tbody><tr>
<th style="width:10%;">序号</th>
<th>方法 &amp; 描述</th>
</tr>
<tr>
<td>1</td>
<td><b>static &lt;T&gt; Optional&lt;T&gt; empty()</b>
<p>返回空的 Optional 实例。</p></td>
</tr>
<tr>
<td>2</td>
<td><b>boolean equals(Object obj)</b>
<p>判断其他对象是否等于 Optional。</p></td>
</tr>
<tr>
<td>3</td>
<td><b>Optional&lt;T&gt; filter(Predicate&lt;? super &lt;T&gt; predicate)</b>
<p>如果值存在，并且这个值匹配给定的 predicate，返回一个Optional用以描述这个值，否则返回一个空的Optional。</p></td>
</tr>
<tr>
<td>4</td>
<td><b>&lt;U&gt; Optional&lt;U&gt; flatMap(Function&lt;? super T,Optional&lt;U&gt;&gt; mapper)</b>
<p>如果值存在，返回基于Optional包含的映射方法的值，否则返回一个空的Optional</p></td>
</tr>
<tr>
<td>5</td>
<td><b>T get()</b>
<p>如果在这个Optional中包含这个值，返回值，否则抛出异常：NoSuchElementException</p></td>
</tr>
<tr>
<td>6</td>
<td><b>int hashCode()</b>
<p>返回存在值的哈希码，如果值不存在 返回 0。</p></td>
</tr>
<tr>
<td>7</td>
<td><b>void ifPresent(Consumer&lt;? super T&gt; consumer)</b>
<p>如果值存在则使用该值调用 consumer , 否则不做任何事情。</p></td>
</tr>
<tr>
<td>8</td>
<td><b>boolean isPresent()</b>
<p>如果值存在则方法会返回true，否则返回 false。</p></td>
</tr>
<tr>
<td>9</td>
<td><b>&lt;U&gt;Optional&lt;U&gt; map(Function&lt;? super T,? extends U&gt; mapper)</b>
<p>
如果有值，则对其执行调用映射函数得到返回值。如果返回值不为 null，则创建包含映射返回值的Optional作为map方法返回值，否则返回空Optional。</p></td>
</tr>
<tr>
<td>10</td>
<td><b>static &lt;T&gt; Optional&lt;T&gt; of(T value)</b>
<p>返回一个指定非null值的Optional。</p></td>
</tr>
<tr>
<td>11</td>
<td><b>static &lt;T&gt; Optional&lt;T&gt; ofNullable(T value)</b>
<p>如果为非空，返回 Optional 描述的指定值，否则返回空的 Optional。</p></td>
</tr>
<tr>
<td>12</td>
<td><b>T orElse(T other)</b>
<p>如果存在该值，返回值， 否则返回 other。</p></td>
</tr>
<tr>
<td>13</td>
<td><b>T orElseGet(Supplier&lt;? extends T&gt; other)</b>
<p>如果存在该值，返回值， 否则触发 other，并返回  other 调用的结果。</p></td>
</tr>
<tr>
<td>14</td>
<td><b>&lt;X extends Throwable&gt; T orElseThrow(Supplier&lt;? extends X&gt; exceptionSupplier)</b><p></p>
<p>如果存在该值，返回包含的值，否则抛出由 Supplier 继承的异常</p></td>
</tr>
<tr>
<td>15</td>
<td><b>String toString()</b>
<p>返回一个Optional的非空字符串，用来调试</p></td>
</tr>
</tbody></table>


注意： 这些方法是从 java.lang.Object 类继承来的。


Optional 实例
我们可以通过以下实例来更好的了解 Optional 类的使用：

```java
import java.util.Optional;
 
public class Java8Tester {
   public static void main(String args[]){
   
      Java8Tester java8Tester = new Java8Tester();
      Integer value1 = null;
      Integer value2 = new Integer(10);
        
      // Optional.ofNullable - 允许传递为 null 参数
      Optional<Integer> a = Optional.ofNullable(value1);
        
      // Optional.of - 如果传递的参数是 null，抛出异常 NullPointerException
      Optional<Integer> b = Optional.of(value2);
      System.out.println(java8Tester.sum(a,b));
   }
    
   public Integer sum(Optional<Integer> a, Optional<Integer> b){
       
      // Optional.isPresent - 判断值是否存在
        
      System.out.println("第一个参数值存在: " + a.isPresent());
      System.out.println("第二个参数值存在: " + b.isPresent());
        
      // Optional.orElse - 如果值存在，返回它，否则返回默认值
      Integer value1 = a.orElse(new Integer(0));
        
      //Optional.get - 获取值，值需要存在
      Integer value2 = b.get();
      return value1 + value2;
   }
}
```


执行以上脚本，输出结果为：

```
$ javac Java8Tester.java 
$ java Java8Tester
第一个参数值存在: false
第二个参数值存在: true
10
```