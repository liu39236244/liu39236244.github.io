# EasyExcel 导出单元格合并功能


## 前端调用

```js
// 选择完时间之后的回调函数,后端需要放开登录验证
            exportHistory(params) {

                if (!params.dateTime) {
                    params.dateTime = this.common.beforeDateFmt(0, null, 1);
                }
                // 时间条件的判断，如果时间格式有误则
                // 导出
                window.location.href =
                    humitureEquipment.exportExcelUrl + "/exportEquipHistoryData?" +
                    "organizationName=" + (this.listQuery.queryParamsLike["organizationName"] ? this.listQuery.queryParamsLike["organizationName"] : "")
                    + '&devname=' + (this.listQuery.queryParamsLike["devname"] ? this.listQuery.queryParamsLike["devname"] : "")
                    + '&name=' + (this.listQuery.queryParamsLike["name"] ? this.listQuery.queryParamsLike["name"] : "")
                    + '&humidityWarning=' + (this.listQuery.queryParamsEqual["humidityWarning"] ? this.listQuery.queryParamsEqual["humidityWarning"] : "")
                    + '&temperatureWarning=' + (this.listQuery.queryParamsEqual["temperatureWarning"] ? this.listQuery.queryParamsEqual["temperatureWarning"] : "")
                    + '&status=' + (this.listQuery.queryParamsEqual["status"] ? this.listQuery.queryParamsEqual["status"] : "")
                    + '&enable=' + (this.listQuery.queryParamsEqual["enable"] ? this.listQuery.queryParamsEqual["enable"] : "")
                    + '&orgDepotType=' + (this.listQuery.queryParamsEqual["orgDepotType"] ? this.listQuery.queryParamsEqual["orgDepotType"] : "")
                    + '&dateType=' + (params.dateType ? params.dateType : "")
                    + '&dateTime=' + (params.dateTime ? params.dateTime : "")
                    + '&startTime=' + (params.startTime ? params.startTime : "")
                    + '&endTime=' + (params.endTime ? params.endTime : "")


            },
```

## 后端写法

```java
 @GetMapping(value = "/exportEquipHistoryData")
    @Override
    public void exportEquipHistoryData(HumitureEquipment equipment,HttpServletResponse response) {

        BaseExampleDto dto = new BaseExampleDto();
        dto.getQueryParamsLike().put("organizationName", equipment.getOrganizationName());
        dto.getQueryParamsLike().put("devname", equipment.getDevname());
        dto.getQueryParamsLike().put("name", equipment.getName());
        // 状态参数
        dto.getQueryParamsEqual().put("status", equipment.getStatus());
        dto.getQueryParamsEqual().put("humidityWarning", equipment.getHumidityWarning());
        dto.getQueryParamsEqual().put("temperatureWarning", equipment.getTemperatureWarning());
        dto.getQueryParamsEqual().put("orgDepotType", equipment.getOrgDepotType());
        dto.getQueryParamsEqual().put("enable", "1");

        // 添加区别参数，getByExample 三处用到了，其中pc端的设备监测 就需要添加一个 platform ='PC' 的参数
        dto.getQueryParamsEqual().put("platform", "PC");
        // 添加排序条件
        MyOrder orgNameOrder = new MyOrder();
        orgNameOrder.setField("organizationName");
        orgNameOrder.setOrder("ASC");

        MyOrder devIdOrder = new MyOrder();
        devIdOrder.setField("devId");
        devIdOrder.setOrder("ASC");

        MyOrder nodeIdOrder = new MyOrder();
        nodeIdOrder.setField("nodeId");
        nodeIdOrder.setOrder("ASC");

        dto.getSortParamsList().add(orgNameOrder);
        dto.getSortParamsList().add(devIdOrder);
        dto.getSortParamsList().add(nodeIdOrder);

        List<HumitureEquipment> rows = this.getByExample(dto).getData().getRows();

        // 查询出来所有equipment的数据，填充每个equipment 对应的历史数据
        List<HumitureEquipmentDataVo> exportRows = humitureEquipmentDataService.getHistoryRecordByEquipments(rows,equipment);

        // 查询出来对应的设备
        humitureEquipmentService.exportEquipHistoryData(exportRows, response);

    }
```


### 关键代码

Controller 
```java
 @Override
    public void exportEquipHistoryData(List<HumitureEquipmentDataVo> exportRows, HttpServletResponse response) {
        try {
//            // 将数据转化为导出对象
            int index = 1;
            List<EquipmentHistoryExcel> resultExel = new ArrayList<>();

            for (HumitureEquipmentDataVo equipDataVo : exportRows) {
                EquipmentHistoryExcel excel = new EquipmentHistoryExcel();
                BeanUtils.copyProperties(equipDataVo, excel);

                // 填充对应字典-中文数据
                this.handleEquipHistoryVoDicData(equipDataVo, excel);
                excel.setIndex(index++ + "");
                resultExel.add(excel);
            }
            response.setContentType("application/vnd.ms-excel");
            response.setCharacterEncoding("utf-8");
            // 这里URLEncoder.encode可以防止中文乱码
            String fileName = URLEncoder.encode("设备历史数据数据", "UTF-8");
            response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");

            // 设定合并列
            //需要合并的列
            int[] mergeColumeIndex = {0, 1, 2, 3, 4};

            // 从那一列开始合并
            int mergeRowIndex = 0;
            EasyExcel
                    .write(response.getOutputStream(), EquipmentHistoryExcel.class)
                    .sheet("data")
                    .registerWriteHandler(new ExcelFillCellMergeStrategy(mergeRowIndex, mergeColumeIndex))
                    .doWrite(resultExel);
        } catch (Exception ex) {
            ex.printStackTrace();
            log.error(ex.getMessage());
        }
    }


// ExcelFillCellMergeStrategy
// 这个自定义类需要自己创建


```

* 合并自定义类

```java
public class ExcelFillCellMergeStrategy implements CellWriteHandler {

    // 需要合并那些列下标
    private int[] mergeColumnIndex;
    // 从哪一行开始进行合并
    private int mergeRowIndex;

    public ExcelFillCellMergeStrategy() {
    }

    public ExcelFillCellMergeStrategy(int mergeRowIndex, int[] mergeColumnIndex) {
        this.mergeRowIndex = mergeRowIndex;
        this.mergeColumnIndex = mergeColumnIndex;
    }

    @Override
    public void beforeCellCreate(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Row row, Head head, Integer columnIndex, Integer relativeRowIndex, Boolean isHead) {

    }

    @Override
    public void afterCellCreate(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, Cell cell, Head head, Integer relativeRowIndex, Boolean isHead) {

    }

    @Override
    public void afterCellDispose(WriteSheetHolder writeSheetHolder, WriteTableHolder writeTableHolder, List<CellData> list, Cell cell, Head head, Integer integer, Boolean aBoolean) {
        int curRowIndex = cell.getRowIndex();
        int curColIndex = cell.getColumnIndex();
        if (curRowIndex > mergeRowIndex) {
            for (int i = 0; i < mergeColumnIndex.length; i++) {
                if (curColIndex == mergeColumnIndex[i]) {
                    mergeWithPrevRow(writeSheetHolder, cell, curRowIndex, curColIndex);
                    break;
                }
            }
        }
    }

    /**
     * 当前单元格向上合并
     *
     * @param writeSheetHolder  这种有问题，当数据有为空
     列就会很频繁报错
     * @param cell             当前单元格
     * @param curRowIndex      当前行
     * @param curColIndex      当前列
     */
//    private void mergeWithPrevRow(WriteSheetHolder writeSheetHolder, Cell cell, int curRowIndex, int curColIndex) {
//        Object curData = cell.getCellTypeEnum() == CellType.STRING ? cell.getStringCellValue() : cell.getNumericCellValue();
//        Cell preCell = cell.getSheet().getRow(curRowIndex - 1).getCell(curColIndex);
//        Object preData = preCell.getCellTypeEnum() == CellType.STRING ? preCell.getStringCellValue() : preCell.getNumericCellValue();
//        // 将当前单元格数据与上一个单元格数据比较
//        Boolean dataBool = preData.equals(curData);
//        //此处需要注意：因为我是按照序号确定是否需要合并的，所以获取每一行第一列数据和上一行第一列数据进行比较，如果相等合并
//        Boolean bool = cell.getRow().getCell(0).getNumericCellValue() == cell.getSheet().getRow(curRowIndex - 1).getCell(0).getNumericCellValue();
//        if (dataBool && bool) {
//            Sheet sheet = writeSheetHolder.getSheet();
//            List<CellRangeAddress> mergeRegions = sheet.getMergedRegions();
//            boolean isMerged = false;
//            for (int i = 0; i < mergeRegions.size() && !isMerged; i++) {
//                CellRangeAddress cellRangeAddr = mergeRegions.get(i);
//                // 若上一个单元格已经被合并，则先移出原有的合并单元，再重新添加合并单元
//                if (cellRangeAddr.isInRange(curRowIndex - 1, curColIndex)) {
//                    sheet.removeMergedRegion(i);
//                    cellRangeAddr.setLastRow(curRowIndex);
//                    sheet.addMergedRegion(cellRangeAddr);
//                    isMerged = true;
//                }
//            }
//            // 若上一个单元格未被合并，则新增合并单元
//            if (!isMerged) {
//                CellRangeAddress cellRangeAddress = new CellRangeAddress(curRowIndex - 1, curRowIndex, curColIndex, curColIndex);
//                sheet.addMergedRegion(cellRangeAddress);
//            }
//        }
//    }

    private void mergeWithPrevRow(WriteSheetHolder writeSheetHolder, Cell cell, int curRowIndex, int curColIndex) {
        //获取当前行的当前列的数据和上一行的当前列列数据，通过上一行数据是否相同进行合并
        Object curData = cell.getCellTypeEnum() == CellType.STRING ? cell.getStringCellValue() :
                cell.getNumericCellValue();
        Cell preCell = cell.getSheet().getRow(curRowIndex - 1).getCell(curColIndex);
        Object preData = preCell.getCellTypeEnum() == CellType.STRING ? preCell.getStringCellValue() :
                preCell.getNumericCellValue();
        // 比较当前行的第一列的单元格与上一行是否相同，相同合并当前单元格与上一行
        //
        if (curData.equals(preData)) {
            Sheet sheet = writeSheetHolder.getSheet();
            List<CellRangeAddress> mergeRegions = sheet.getMergedRegions();
            boolean isMerged = false;
            for (int i = 0; i < mergeRegions.size() && !isMerged; i++) {
                CellRangeAddress cellRangeAddr = mergeRegions.get(i);
                // 若上一个单元格已经被合并，则先移出原有的合并单元，再重新添加合并单元
                if (cellRangeAddr.isInRange(curRowIndex - 1, curColIndex)) {
                    sheet.removeMergedRegion(i);
                    cellRangeAddr.setLastRow(curRowIndex);
                    sheet.addMergedRegion(cellRangeAddr);
                    isMerged = true;
                }
            }
            // 若上一个单元格未被合并，则新增合并单元
            if (!isMerged) {
                CellRangeAddress cellRangeAddress = new CellRangeAddress(curRowIndex - 1, curRowIndex, curColIndex,
                        curColIndex);
                sheet.addMergedRegion(cellRangeAddress);
            }
        }
    }
}
```