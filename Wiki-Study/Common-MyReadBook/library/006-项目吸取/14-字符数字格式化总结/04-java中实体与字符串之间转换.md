# 04-java中实体与字符串之间转换

## @Data 注解 tostring 转换的简单实体字符串如何解析

```java
    /**
     * @Author: shenyabo
     * @Date: Create in 2023/11/20 13:53
     * @Description: 解析redis 中 字符串为tostring 的数据 ：BridgeMonitorRealDataRedis(probeId=3821, originalValue=13.14, valueUpdateTime=null, calculatedValue=13.14, calculatedValueUpdateTime=Mon Nov 20 10:50:01 CST 2023, createTime=null, lastUpdateTime=Mon Nov 20 10:50:01 CST 2023)
     * @Params: [input]
     * @Return: com.graphsafe.api.model.bridge.po.redis.BridgeMonitorRealDataRedis
     */
    // 解析方法
    public BridgeMonitorRealDataRedis parse(String input) {

        // 此处假设输入的字符串格式是固定的，可以根据实际情况调整
        String[] tokens = input.split("[,=()]");

        Integer probeId = new Integer(tokens[2].trim());
        BigDecimal originalValue = new BigDecimal(tokens[4].trim());

        Date valueUpdateTime = parseDate(tokens[6].trim());
        BigDecimal calculatedValue = new BigDecimal(tokens[8].trim());

        Date calculatedValueUpdateTime = parseDate(tokens[10].trim());
        Date createTime = parseDate(tokens[12].trim());
        Date lastUpdateTime = parseDate(tokens[14].trim());

        return new BridgeMonitorRealDataRedis(probeId, originalValue, valueUpdateTime,
                calculatedValue, calculatedValueUpdateTime, createTime, lastUpdateTime);
    }
```