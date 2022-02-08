# EasyExcel先上传到mongodb在下载


## 案例代码

缺点：同一份文件生成两份；mongodb 有多余脏文件、服务器上也会生成的文件也会一直存在
优点: 适用于 项目只能使用post ，且甲方有规定上传到指定的文件服务器这种



```js
//导出Excel
export const exportExcel = (params) => http.post(url + '/exportCarExcel', exchangeData(params));

```


```java
 @PostMapping(value = "/exportCarExcel", produces = "application/json;charset=UTF-8")
    public RestMessage<String> exportCarExcel(@RequestBody BaseExampleDto baseExampleDto, HttpServletRequest request){
        List<TransportCarExportExcel> list = new ArrayList<>();
        // 不分页
        baseExampleDto.setLimit(null);
        baseExampleDto.setPage(null);
        List<CpsTransportCar> rows = this.getByExample(baseExampleDto).getData().getRows();
        for (int i = 0;i < rows.size();i++) {
            TransportCarExportExcel exportExcel = new TransportCarExportExcel();
            BeanUtils.copyProperties(rows.get(i), exportExcel);
        
            exportExcel.setIndex(i+1);
      
            exportExcel.setCarCode(rows.get(i).getCarCode());

            list.add(exportExcel);
        }
        String fileName = "../fileStorage/临时文件.xlsx";
        EasyExcel.write(fileName, TransportCarExportExcel.class)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy()).sheet("sheet页面")
                .doWrite(list);
        File file = new File(fileName);
        //针对post请求，先上传到文件存储系统，返回前端再下载
        String backId = mongoDbUtil.uploadExcelBackId(file, request);
        return new RestMessage<>(backId);
    }
```