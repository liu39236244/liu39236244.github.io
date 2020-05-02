# String 字符串操作总结

## Split

### Split（"",-1）

此方法中-1 参数表示，如果字符串后面都是分隔符符的话，继续进行分割。如果不指定改参数那么字符串遇到后面的都是分隔符的话就不会进行切分

split 在jdk 1.7 中的 方法官方介绍,如下：
public String[] split(String regex, int limit)Splits this string around matches of the given regular expression.


```
The array returned by this method contains each substring of this string that is terminated by another substring that matches the given expression or is terminated by the end of the string. The substrings in the array are in the order in which they occur in this string. If the expression does not match any part of the input then the resulting array has just one element, namely this string.

The limit parameter controls the number of times the pattern is applied and therefore affects the length of the resulting array. If the limit n is greater than zero then the pattern will be applied at most n - 1 times, the array's length will be no greater than n, and the array's last entry will contain all input beyond the last matched delimiter. If n is non-positive then the pattern will be applied as many times as possible and the array can have any length. If n is zero then the pattern will be applied as many times as possible, the array can have any length, and trailing empty strings will be discarded.
此方法返回的数组包含该字符串的每个子字符串，该子字符串由另一个匹配给定表达式的子字符串终止，或者在字符串的末尾终止。数组中的子字符串按照它们在这个字符串中出现的顺序排列。如果表达式不匹配输入的任何部分，那么结果数组只有一个元素，即这个字符串。
limit参数控制应用模式的次数，因此会影响结果数组的长度。如果限制n大于0，那么模式将被应用最多n - 1次，数组的长度将不大于n，并且数组的最后一个条目将包含超过最后匹配的分隔符的所有输入。如果n是非正的，那么模式将被尽可能多地应用，并且数组可以有任何长度。如果n为0，那么模式将被尽可能多地应用，数组可以有任意长度，拖尾空字符串将被丢弃。
```
