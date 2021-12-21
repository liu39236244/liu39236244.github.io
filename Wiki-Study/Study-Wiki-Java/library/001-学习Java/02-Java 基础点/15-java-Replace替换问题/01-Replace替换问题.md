# java replace替换问题

这两者有些人很容易搞混，因此我在这里详细讲述下。

replace的参数是char和CharSequence，即可以支持字符的替换，也支持字符串的替换（CharSequence即字符串序列的意思,说白了也就是字符串）；

replaceAll的参数是regex，即基于规则表达式的替换，比如：可以通过replaceAll("\\d", "*")把一个字符串所有的数字字符都换成星号；

相同点：都是全部替换，即把源字符串中的某一字符或字符串全部换成指定的字符或字符串；

不同点：replaceAll支持正则表达式，因此会对参数进行解析（两个参数均是），如replaceAll("\\d", "*")，而replace则不会，replace("\\d","*")就是替换"\\d"的字符串，而不会解析为正则。

另外还有一个不同点：“\”在java中是一个转义字符，所以需要用两个代表一个。例如System.out.println( "\\" ) ;只打印出一个"\"。但是“\”也是正则表达式中的转义字符，需要用两个代表一个。所以：\\\\被java转换成\\，\\又被正则表达式转换成\，因此用replaceAll替换“\”为"\\"，就要用replaceAll("\\\\","\\\\\\\\")，而replace则replace("\\","\\\\")。

如果只想替换第一次出现的，可以使用replaceFirst()，这个方法也是基于规则表达式的替换，但与replaceAll()不同的是，只替换第一次出现的字符串。

```java
  String a = "我的\n朋友\n叫做\n小明\"";
            System.out.println(a);
            String replace = a.replace("\"", "\\\"");
             replace = replace.replace("\n", "\\n");
            System.out.println(replace);

// 我的
// 朋友
// 叫做
// 小明"
// 我的\n朋友\n叫做\n小明\"
```
