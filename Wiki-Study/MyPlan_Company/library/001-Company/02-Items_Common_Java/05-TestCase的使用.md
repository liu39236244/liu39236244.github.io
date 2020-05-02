# TestCase的使用



## 1-介绍
Unit是一个开源的Java单元测试框架，由 Erich Gamma 和 Kent Beck 开发完成。

JUnit主要用来帮助开发人员进行Java的单元测试，其设计非常小巧，但功能却非常强大。

下面是JUnit一些特性的总结：

— 提供的API可以让开发人员写出测试结果明确的可重用单元测试用例。

— 提供了多种方式来显示测试结果，而且可以扩展。

— 提供了单元测试批量运行的功能，而且可以和Ant很容易地整合。

— 对不同性质的被测对象，如Class,JSP,Servlet等，JUnit有不同的测试方法。

## 2-优势

### 2-1 为什么要使用junit
原文地址：

```java
以前，开发人员写一个方法，如下代码所示：

//******* AddAndSub.java**************

public Class AddAndSub {

    public static int add(int m, int n) {

        int num = m + n;

        return num;

    }

    public static int sub(int m, int n) {

        int num = m - n;

        return num;

    }

}

如果要对AddAndSub类的add和sub方法进行测试，通常要在main里编写相应的测试方法，如下代码所示：

//******* MathComputer.java**************

public Class AddAndSub {

    public static int add(int m, int n) {

        int num = m + n;

        return num;

    }

    public static int sub(int m, int n) {

        int num = m - n;

        return num;

    }

    public static void main(String args[]) {

        if (add (4, 6) == 10)) {

            System.out.println(“Test Ok”);

        } else {

            System.out.println(“Test Fail”);

        }

        if (sub (6, 4) ==2)) {

            System.out.println(“Test Ok”);

        } else {

            System.out.println(“Test Fail”);

        }

    }

}

从上面的测试可以看出，业务代码和测试代码放在一起，对于复杂的业务逻辑，一方面代码量会非常庞大，另一方面测试代码会显得比较凌乱，而JUnit就能改变这样的状况，它提供了更好的方法来进行单元测试。使用JUnit来测试前面代码的示例如下：

//******* TestAddAndSub.java**************

import junit.framework.TestCase;

public Class TestAddAndSub  extends TestCase {

    public void testadd() {

        //断言计算结果与10是否相等

        assertEquals(10, AddAndSub.add(4, 6));

    }

    public void testsub() {

        //断言计算结果与2是否相等

        assertEquals(2, AddAndSub.sub(6, 4));

    }

    public static void main(String args[]){

         junit.textui.TestRunner.run(TestAddAndSub .class);    }

}
```

## 3-使用总结




## 4- 博客总结

### 4-1 博主1 TestCast使用

原文地址：https://blog.csdn.net/kswy521/article/details/3976393
```
```
