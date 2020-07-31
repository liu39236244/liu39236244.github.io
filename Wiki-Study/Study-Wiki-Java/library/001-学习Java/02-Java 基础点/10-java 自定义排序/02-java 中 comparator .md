# Java Comparator 


## 总结


### 自定义类

定义一个Girl.java类，实现Comparable接口，并且重写compareTo方法：默认比较的是当前Girl类，通过age属性进行比较。
```java
public class Girl implements Comparable<Object> {

	private String name;
	private int age;

	public String getName() {
    	return name;
	}

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Girl(String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Girl [name=" + name + ", age=" + age + "]";
    }

    @Override
    public int compareTo(Object o) {
        Girl g = (Girl)o;
        return this.age - g.getAge();
    }

}

```


```java
public static void main(String[] args) {
        
        List<Girl> list = new ArrayList<>(100);
        Girl girl;
        for (int i=0; i<75; i++) {
            girl = new Girl("girl " + i, i);
            list.add(girl);
        }
        Collections.shuffle(list);
        list.stream().forEach(System.out::println);
        
    }



```



```
Girl [name=girl 9, age=9]
Girl [name=girl 60, age=60]
Girl [name=girl 26, age=26]
Girl [name=girl 55, age=55]
Girl [name=girl 12, age=12]
Girl [name=girl 31, age=31]
Girl [name=girl 49, age=49]
Girl [name=girl 6, age=6]
…

```




```java

public static void main(String[] args) {
        
        List<Girl> list = new ArrayList<>(100);
        Girl girl;
        for (int i=0; i<75; i++) {
            girl = new Girl("girl " + i, i);
            list.add(girl);
        }
        Collections.shuffle(list);
        Collections.sort(list);
        list.stream().forEach(System.out::println);
        
    }

```


```
Girl [name=girl 0, age=0]
Girl [name=girl 1, age=1]
Girl [name=girl 2, age=2]
Girl [name=girl 3, age=3]
Girl [name=girl 4, age=4]
Girl [name=girl 5, age=5]
Girl [name=girl 6, age=6]
Girl [name=girl 7, age=7]
Girl [name=girl 8, age=8]
Girl [name=girl 9, age=9]
Girl [name=girl 10, age=10]
Girl [name=girl 11, age=11]
…




```


> 2 外排序


```java
public class Girl {

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public Girl(String name, int age) {
        super();
        this.name = name;
        this.age = age;
    }

    @Override
    public String toString() {
        return "Girl [name=" + name + ", age=" + age + "]";
    }

}

```

```java
public class GirlComparator implements Comparator<Girl> {

    @Override
    public int compare(Girl g1, Girl g2) {
        return g1.getAge() - g2.getAge();
    }
    
}


```





```
对Comparetor.compare(o1, o2)方法的返回值，如果返回的值小于零，则不交换两个o1和o2的位置；如果返回的值大于零，则交换o1和o2的位置。 注意，不论在compare(o1, o2)中是如何实现的（第一种实现方式是 o1-02, 第二种实现方式是 o2 - o1），都遵循上述原则，即返回值小于零，则交换o1和o2的位置；返回值大于零，则不交换o1和o2的位置。 所以，如果采用第一种实现方式，即 o1 - o2, 那么将是升序排序。因为在原始排序中o1在o2的前边，如果o1小于o2，那么o1 - o2小于零，即返回值是小于零，但是小于零是不会交换o1和o2的位置的，所以o1依然排在o2的前边，是升序；如果o1大于o2，那么o1 - o2大于零，即返回值是大于零，大于零是要交换o1和o2的位置的，所以要改变原始排序中o1和o2的位置，那么依然是升序
```


## 参考博主

comparator 博主1原文: https://blog.csdn.net/liuwg1226/article/details/85268814


comparable （compareTo 自然比较）与 comparator 区别：https://blog.csdn.net/wlh2015/article/details/83959462?utm_medium=distribute.pc_relevant_right.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase&depth_1-utm_source=distribute.pc_relevant_right.none-task-blog-BlogCommendFromMachineLearnPai2-2.nonecase



* comparable 自然排序，内排序能自己跟自己排序，但是如果不满想要自己写自己的排序怎么办呢，就用外排序


3、总结
总结一下，这两种比较器Comparable和Comparator，后者相比前者有如下优点：

个性化比较：如果实现类没有实现Comparable接口，又想对两个类进行比较（或者实现类实现了Comparable接口，但是对compareTo方法内的比较算法不满意），那么可以实现Comparator接口，自定义一个比较器，写比较算法。
解耦：实现Comparable接口的方式比实现Comparator接口的耦合性要强一些，如果要修改比较算法，要修改Comparable接口的实现类，而实现Comparator的类是在外部进行比较的，不需要对实现类有任何修改。从这个角度说，其实有些不太好，尤其在我们将实现类的.class文件打成一个.jar文件提供给开发者使用的时候。

