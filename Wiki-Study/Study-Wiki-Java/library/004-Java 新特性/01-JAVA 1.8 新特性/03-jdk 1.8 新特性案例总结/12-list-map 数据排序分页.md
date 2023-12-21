# 


## 案例

```java
 private List<Map<String, String>> handleProbeRealDataPageAndSort(List<Map<String, String>> pageInfoList, BridgeScensorWarningRuleDto dto) {
        for (Map<String, String> probeIDNameMap : pageInfoList) {
            // probe_name  id   ruleUnit
            // 查到探头id 填充
            String probeId = String.valueOf(probeIDNameMap.get("probeId"));
            // 这里获取探头对应的实时数据实体
            BridgeMonitorRealDataRedis curProbeRedisPo = commonDataUtil.getProbePoValueByProbeIdFromRedis(probeId);

            if (curProbeRedisPo != null) {
                if (curProbeRedisPo.getCalculatedValue() != null) {
                    probeIDNameMap.put("thisTimeValue", curProbeRedisPo.getCalculatedValue().toString());

                } else {
                    probeIDNameMap.put("thisTimeValue", "/");
                }
                if (curProbeRedisPo.getCalculatedValueUpdateTime() != null) {
                    probeIDNameMap.put("thisTimeValueUpdateTime", DateTimeUtils.date2Str(curProbeRedisPo.getCalculatedValueUpdateTime(), DateTimeUtils.yyyy_MM_DD_HH_mm_ss_SSS));

                } else {

                    probeIDNameMap.put("thisTimeValueUpdateTime", "/");
                }

            } else {
                probeIDNameMap.put("thisTimeValue", "/");
                probeIDNameMap.put("thisTimeValueUpdateTime", "/");
            }
        }


        // 根据 thisTimeValueUpdateTime进行倒序排序,时间一样则超限值 从大到小排序
        Collections.sort(pageInfoList, (map1, map2) -> {
            String updateTime1 = map1.get("thisTimeValueUpdateTime");
            String updateTime2= map2.get("thisTimeValueUpdateTime");
            // 将 createTime 转换为对应的时间格式进行比较
            // 这里假设 createTime 是符合日期格式的字符串
            // 如果不是，你需要根据实际情况进行转换
            // 例如使用 SimpleDateFormat 进行日期字符串转换
            int result = 0;
            result = updateTime2.compareTo(updateTime1);
            if(result == 0){
                String overLimitValueStr1 = map1.get("OverLimitValue");
                String overLimitValueStr2 = map2.get("OverLimitValue");
                if(!overLimitValueStr1.equals("/") && !overLimitValueStr2.equals("/")){
                    // 根据预警值大小排序
                    BigDecimal overLimitValue1 = new BigDecimal(overLimitValueStr1);
                    BigDecimal overLimitValue2 = new BigDecimal(overLimitValueStr2);

                    // 降序
                    result = overLimitValue2.compareTo(overLimitValue1);
                    // 升序
                    // result = overLimitValue1.compareTo(overLimitValue2);
                }
            }
            return result;
        });


        // 排序后进行分页

        // 假设dataList中有一些数据

        int pageSize = dto.getLimit(); // 每页数据条数
        int totalSize = pageInfoList.size(); // 总数据条数
        int totalPages = (int) Math.ceil((double) totalSize / pageSize); // 总页数

        int currentPage = dto.getPage(); // 当前页码

        // 获取当前页的数据
        int fromIndex = (currentPage - 1) * pageSize;
        int toIndex = Math.min(fromIndex + pageSize, totalSize);
        List<Map<String, String>> result = pageInfoList.subList(fromIndex, toIndex);
        return result;
    }
}
```