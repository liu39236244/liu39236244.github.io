# Integer 问题

```java
 Integer a1 = 100;
        Integer a2 = 100;
        Integer a3 = 130;
        Integer a4 = 130;
        int b1 = 100;
        int b2 = 130;



        System.out.println(a1 == b1); //true
        System.out.println(a2 == b1);//true
        System.out.println("a3:"+a3); // 130
        System.out.println("b2:"+b2); // 130
        System.out.println(a3 == b2); // true
        System.out.println(a3 == a4); // fasle

        Integer i1 = new Integer(10);

        Integer i2 = new Integer(10);

        Integer i3 = Integer.valueOf(10);

        Integer i4 = Integer.valueOf(10);

        Integer i5 = new Integer(130); //直接new

        Integer i6 = Integer.valueOf(130); //从缓存去拿，但是130大于127 所以new 一个

        System.out.println(i1 == i2);  // false

        System.out.println(i2 == i3); // false

        System.out.println(i3 == i4); //true

        System.out.println(i6 == i5); //两次都是new 的  所以是fasle


        new Integer(10); // 每次都会创建一个新对象，Integer.valueOf(10) 则会使用缓存池中的对象。
        
//        所以大对象比较值相等使用 equals 比较

```


* 前端：


```js
      this.eduTestPaperVo.eduTestPlan.excellentScore = (97*0.8).toFixed(0) // 80
      this.eduTestPaperVo.eduTestPlan.passingScore = (97*0.6).toFixed(0) // 60
```