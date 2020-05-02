# PropertiesUtils 工具类

# PropertiesUtils 工具类

```Java
package cn.netcommander.rasengine.utils;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 *
 */
public class PropertiesUtils {

    /**
     * 获取属性对象
     * @param resourceName 资源名称
     * @return 属性对象
     */
    public static Properties getProperties(String resourceName) {
        Properties properties=new Properties();
        try {
            InputStream inputStream = PropertiesUtils.class.getClassLoader().getResourceAsStream(resourceName);
            properties.load(inputStream);
            inputStream.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return properties;
    }
}

```
