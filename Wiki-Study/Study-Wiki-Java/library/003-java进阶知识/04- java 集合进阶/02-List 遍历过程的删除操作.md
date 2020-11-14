# List 遍历删除操作


## for 循环 边遍历边删除 正序 ，倒序 的问题


List集合在遍历过程中的删除：[1,1,2,3,4,5]
for循环正续会漏掉一个1

```java


        for(int i=0;i<list.size();i++){

            if(list.get(i).equals(1)){

                list.remove(i);

            }

        }
```

for循环倒序可以删除所有1

```java
 for(int i=list.size()-1;i>=0;i--){

            if(list.get(i).equals(1)){

                list.remove(i);

            }

        }
```

迭代器和foreach遍历时删除都会报错：java.util.ConcurrentModificationException；

foreach就是通过Iterable接口在序列中进行移动

```java

        Iterator iterator = list.iterator();

        while (iterator.hasNext()) {

            int temp = (int) iterator.next();

            if (temp == 1) {

                list.remove(temp);

            }

        }


        for (Object object : list) {

            if (list.get(0).equals(1)) {

                list.remove(0);

            }

        }

```


因此，不能在对一个List进行遍历的时候 将其中的元素删除掉

解决办法是,你可以先将要删除的元素用另一个list装起来,等遍历结束再remove掉

可以这样写

> 1 笨方法:

```java
List delList = new ArrayList();//用来装需要删除的元素

        for(Information ia:list)

            if(ia.getId()==k){

                n++;

                delList.add(ia);

            }

        list.removeAll(delList);//遍历完成后执行删除
```

> 2 迭代器遍历，迭代器删除


```java
Iterator<Student> it=studentList.iterator();
while(it.hasNext()){
    if("小明".equals(it.next().getName())){
        it.remove();
    }
}
```



```
* 总结 ： 
集合遍历过程中需要删除元素

* for循环方式， for循环
    正序遍历则会出现漏元素，不行！
    倒序遍历删除元素，可行！

* 迭代器遍历
    迭代器中用集合的remove方法删除，不行！
    迭代器中用迭代器的remove ，可行！

* for、foreach 增强中集合删除元素，都不可行！
```
