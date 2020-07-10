# echarts 数据格式


```java

BaseExampleDto dto = new BaseExampleDto();
Map resultMap = new HashMap();
List<BaseEnterprise> baseEnterprises = baseEnterpriseService.getByExample(dto).getRows();
List<String> nameList = new ArrayList<>();
List valueList = new ArrayList();
for (BaseEnterprise baseEnterprise:baseEnterprises){
    nameList.add(baseEnterprise.getName());
    dto.getQueryParamsEqual().put("qyId",baseEnterprise.getId());
    valueList.add(baseEnterpriseEhsService.getByExample(dto).getRows().get(0).getEhsFullTimeNum());
}
resultMap.put("xAxis",nameList);
resultMap.put("series",valueList);
return new RestMessage<>(resultMap);
```

* 前端

```html
   <EChartsBar :charts="ehsqGridChart"
                :chartData="ehsqGridChartData"></EChartsBar>

```

```js

ehsqGridChart: "ehsqGridChart", //EHSQ专职人员数量ID
ehsqGridChartData: {}, //EHSQ专职人员数量数据

 getEhsqGridChart() {//加载后台数据
      //假数据
      this.common.get("ehs/qy/baseInfo/getChartEhsData").then(res => {
        let { xAxis, series } = res;
        this.ehsqGridChartData = {
          title: "EHSQ专职人员数量",
          xData: xAxis,
          SData: series
        };
      });
    },



```