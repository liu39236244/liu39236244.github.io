# StringUtils 工具类

# StringUtils 工具类

```Java
package cn.netcommander.rasengine.utils;

import java.util.HashMap;
import java.util.Map;

/**
 * 字符串工具类
 *
 * @author Administrator
 */
public class StringUtils {
    /**
     * 补全num位数字
     *
     * @param str 字符串
     * @return
     */
    public static String fullFill(int num, String str) {
        if (str.length() == num) {
            return str;
        } else {
            int fulNum = num - str.length();
            String tmpStr = "";
            for (int i = 0; i < fulNum; i++) {
                tmpStr += "0";
            }
            return tmpStr + str;
        }
    }


    /**
     * 从拼接的字符串中提取字段
     *
     * @param str       字符串
     * @param delimiter 分隔符
     * @param field     字段
     * @return 字段值 默认返回""
     * name=zhangsan|age=18
     */
    public static String getFieldFromConcatString(String str, String delimiter, String field) {
        String[] fields = str.split(delimiter);
        for (String concatField : fields) {
            // searchKeywords=|clickCategoryIds=1,2,3
            if (concatField.split("=").length == 2) {
                String fieldName = concatField.split("=")[0];
                String fieldValue = concatField.split("=")[1];
                if (fieldName.equals(field)) {
                    return fieldValue;
                }
            }
        }
        return "";
    }

    public static void main(String[] args) {
        System.out.println(getFieldFromConcatString("1496895046219|latf:info=25.994262|lngf:info=105.965478|msgcode:info=006|taskcode:info=003001001","|", "info:taskcode"));
        System.out.println(setFieldInConcatString("name=xuruyun,age=55", ",", "name", "bochen"));
    }

    /**
     * 从拼接的字符串中给字段设置值
     *
     * @param str           字符串
     * @param delimiter     分隔符
     * @param field         字段名
     * @param newFieldValue 新的field值
     * @return 字段值
     * name=zhangsan123
     * age=18
     * name=zhangsan|age=18
     */
    public static String setFieldInConcatString(String str, String delimiter, String field, String newFieldValue) {

        // searchKeywords=iphone7|clickCategoryIds=1,2,3

        String[] fields = str.split(delimiter);

        for (int i = 0; i < fields.length; i++) {
            String fieldName = fields[i].split("=")[0];
            if (fieldName.equals(field)) {
                String concatField = fieldName + "=" + newFieldValue;
                fields[i] = concatField;
                break;
            }
        }

        StringBuilder buffer = new StringBuilder("");
        for (int i = 0; i < fields.length; i++) {
            buffer.append(fields[i]);
            if (i < fields.length - 1) {
                buffer.append("|");
            }
        }

        return buffer.toString();
    }

    /**
     * age=19
     * name=jack
     *
     * @param str       字符串
     * @param delimiter name=zhangsan|age=18
     * @return 键值对
     */
    public static Map<String, String> getKeyValuesFromConcatString(String str, String delimiter) {
        Map<String, String> map = new HashMap<String, String>();
        try {
            String[] fields = str.split(delimiter);
            for (String concatField : fields) {
                // searchKeywords=|clickCategoryIds=1,2,3
                if (concatField.split("=").length == 2) {
                    String fieldName = concatField.split("=")[0];
                    String fieldValue = concatField.split("=")[1];
                    map.put(fieldName, fieldValue);
                }
            }
            return map;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}


```

# String 额外用法

```Java
tmp = String.format("%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s|%s",
        							task, msg_code, content, cir_lng, cir_lat, r, start_time, end_time, choose, sport,
									road, td_list, event_lng, event_lat);
```
