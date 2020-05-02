# 计算某个字符出现的第n次下标

# 1- java版本

## 1-1 简单版本
```java
public static int getCharacterPosition(String string){
    //这里是获取"/"符号的位置
    Matcher slashMatcher = Pattern.compile("/").matcher(string);
    int mIdx = 0;
    while(slashMatcher.find()) {
       mIdx++;
       //当"/"符号第三次出现的位置
       if(mIdx == 3){
          break;
       }
    }
    return slashMatcher.start();
 }
```

## 1-2 高配版本

```java
//子字符串modelStr在字符串str中第count次出现时的下标
private int getFromIndex(String str, String modelStr, Integer count) {
	//对子字符串进行匹配
        Matcher slashMatcher = Pattern.compile(modelStr).matcher(str);
	int index = 0;
        //matcher.find();尝试查找与该模式匹配的输入序列的下一个子序列
       while(slashMatcher.find()) {
	    index++;
	    //当modelStr字符第count次出现的位置
	    if(index == count){
	       break;
	    }
	}
        //matcher.start();返回以前匹配的初始索引。
       return slashMatcher.start();
}
```
