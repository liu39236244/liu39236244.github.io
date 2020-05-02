# java 集合操作问题



# java 遍历修改删除数据


## iterator 与listiterator  修改

```
Iterator和ListIterator区别

我们在使用List,Set的时候，为了实现对其数据的遍历，我们经常使用到了Iterator(迭代器)。使用迭代器，你不需要干涉其遍历的过程，只需要每次取出一个你想要的数据进行处理就可以了。

但是在使用的时候也是有不同的。List和Set都有iterator()来取得其迭代器。对List来说，你也可以通过listIterator()取得其迭代器，两种迭代器在有些时候是不能通用的， 
Iterator和ListIterator主要区别在以下方面：

ListIterator有add()方法，可以向List中添加对象，而Iterator不能

ListIterator和Iterator都有hasNext()和next()方法，可以实现顺序向后遍历，但是ListIterator有hasPrevious()和previous()方法，可以实现逆向（顺序向前）遍历。Iterator就不可以。

ListIterator可以定位当前的索引位置，nextIndex()和previousIndex()可以实现。Iterator没有此功能。

都可实现删除对象，但是ListIterator可以实现对象的修改，set()方法可以实现。Iierator仅能遍历，不能修改。

因为ListIterator的这些功能，可以实现对LinkedList等List数据结构的操作。其实，数组对象也可以用迭代器来实现。

```

```java
 public static void sop(Object obj){
        System.out.println(obj);
    }
    public static void main(String[] args){
        ArrayList a1 = new ArrayList();
        a1.add("java01");
        a1.add("java02");
        a1.add("java03");
        sop(a1);
        ListIterator li = a1.listIterator();
        while(li.hasNext()){
            Object obj = li.next();

            if(obj.equals("java01")){
                li.set("java009");
            }
        }
        sop(a1);
    }

// 输出

[java01, java02, java03]
[java009, java02, java03]

```




