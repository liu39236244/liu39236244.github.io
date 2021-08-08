# Excel 导入

## 工具类

```java
public class ImportExcelUtil {
    /**
     * 读取出filePath中的所有数据信息
     * @param filePath excel文件的绝对路径
     *
     */

    /**
     * @Description //TODO 读取excel数据到map集合，key为行号，value为本行每列拼接内容。
     * @Date 11:43 2019/4/23
     * @Param [filePath]
     * @return java.util.Map<java.lang.Integer, java.lang.String>
     **/
    public static Map<Integer, String> getDataFromExcel(MultipartFile filePath) {

        //判断是否为excel类型文件
        if (!filePath.getOriginalFilename().endsWith(".xls") && !filePath.getOriginalFilename().endsWith(".xlsx")) {
            throw new IllegalArgumentException("文件不是excel类型");
        }
        InputStream fis = null;
        Workbook wookbook = null;

        try {
            //获取一个绝对地址的流
            fis = filePath.getInputStream();
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            //2003版本的excel，用.xls结尾
            wookbook = new HSSFWorkbook(fis);//得到工作簿

        } catch (Exception ex) {
            //ex.printStackTrace();
            try {
                //这里需要重新获取流对象，因为前面的异常导致了流的关闭—————————————————————————————加了这一行
                fis = filePath.getInputStream();
                //2007版本及更高的excel，用.xlsx结尾

                wookbook = new XSSFWorkbook(fis);//得到工作簿
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        //得到一个工作表
        Sheet sheet = wookbook.getSheetAt(0);
        //获得数据的总行数
        int totalRowNum = sheet.getLastRowNum();

        if (0 == totalRowNum) {
            throw new IllegalArgumentException("Excel内没有数据！");
        }
        //读取表格数据
        StringBuilder str = new StringBuilder();
        Map<Integer, String> content = new HashMap<Integer, String>();
        //模板文件默认前两行为表名和表头，正式数据从第三行开始
        Row row = sheet.getRow(1);
        Row rowStart = sheet.getRow(0);
        if(row == null){
            row = sheet.getRow(2);
        }
        int rowNum = sheet.getLastRowNum();
        int colNum = row.getLastCellNum();
        if(rowStart != null)//读取做大列数，以表首为准
            colNum = Math.max(colNum, rowStart.getLastCellNum());
        for (int i = 1; i <= rowNum; i++) {
            str = new StringBuilder();
            row = sheet.getRow(i);
            if(row!=null){
                int j = 0;
                while (j < colNum) {
                    if (getCellFormatValue(row.getCell(j)) != null && !"".equals(getCellFormatValue(row.getCell(j)))) {
                        //避免时间格式产生混乱,不再使用"/"与"-",使用#&分开
                        str.append(getCellFormatValue(row.getCell(j)) + "#&");
                    } else {
                        str.append(" " + "#&");
                    }

                    j++;
                }
                content.put(i, str.substring(0, str.length() - 2).toString());
            }
        }
        closeQuietly(fis);
        return content;
    }

    public static void closeQuietly(Closeable closeable) {
        try {
            if (closeable != null) closeable.close();
        } catch (IOException ioe) {
            // ignore
        }
    }

    public static String getCellFormatValue(Cell cell) {
        String cellvalue = "";
        if (cell != null) {
            // 判断当前Cell的Type
            switch (cell.getCellType()) {
                // 如果当前Cell的Type为NUMERIC
                case HSSFCell.CELL_TYPE_BOOLEAN:
                    cellvalue = String.valueOf(cell.getBooleanCellValue());
                    break;
                case HSSFCell.CELL_TYPE_BLANK:
                    cellvalue = "";
                    break;
                case HSSFCell.CELL_TYPE_NUMERIC:
                case HSSFCell.CELL_TYPE_FORMULA: {
                    // 判断当前的cell是否为Date
                    if (HSSFDateUtil.isCellDateFormatted(cell)) {
                        // 如果是Date类型则，默认yyyy-mm-dd
                        Date date = cell.getDateCellValue();
                        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
                        cellvalue = sdf.format(date);
                    }
                    // 如果是纯数字
                    else {
                        // 取得当前Cell的数值
                        DecimalFormat df = new DecimalFormat("#.#########");
                        cellvalue = df.format(cell.getNumericCellValue()).toString();
                    }
                    break;
                }
                // 如果当前Cell的Type为STRIN
                case HSSFCell.CELL_TYPE_STRING:
                    // 取得当前的Cell字符串
                    cellvalue = cell.getRichStringCellValue().getString();
                    break;
                // 默认的Cell值
                default:
                    cellvalue = " ";
            }
        } else {
            cellvalue = "";
        }
        return cellvalue;

    }


    /**
     * 一对多导入(例：接触职业病危害人员信息)
     * @return
     */
    public static Map<String,Map<Integer, String>> getOneToManyDataFromExcel(MultipartFile filePath) {

        //判断是否为excel类型文件
        if (!filePath.getOriginalFilename().endsWith(".xls") && !filePath.getOriginalFilename().endsWith(".xlsx")) {
            throw new IllegalArgumentException("文件不是excel类型");
        }
        InputStream fis = null;
        Workbook wookbook = null;

        try {
            //获取一个绝对地址的流
            fis = filePath.getInputStream();
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            //2003版本的excel，用.xls结尾
            wookbook = new HSSFWorkbook(fis);//得到工作簿

        } catch (Exception ex) {
            //ex.printStackTrace();
            try {
                //这里需要重新获取流对象，因为前面的异常导致了流的关闭—————————————————————————————加了这一行
                fis = filePath.getInputStream();
                //2007版本及更高的excel，用.xlsx结尾

                wookbook = new XSSFWorkbook(fis);//得到工作簿
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        Map<String,Map<Integer, String>> map=new HashMap<>();
        for (int  n= 0; n< wookbook.getNumberOfSheets(); n++) {//获取Sheet表个数
            //得到一个工作表
            Sheet sheet = wookbook.getSheetAt(n);
            //获得数据的总行数
            int totalRowNum = sheet.getLastRowNum();

            if (0 == totalRowNum) {
                throw new IllegalArgumentException("Excel内没有数据！");
            }
            //读取表格数据
            StringBuilder str = new StringBuilder();
            Map<Integer, String> content = new HashMap<Integer, String>();
            //模板文件默认前两行为表名和表头，正式数据从第三行开始
            Row row = sheet.getRow(1);
            int rowNum = sheet.getLastRowNum();
            int colNum = row.getLastCellNum();
            for (int i = 1; i <= rowNum; i++) {
                str = new StringBuilder();
                row = sheet.getRow(i);
                if(row!=null){
                    int j = 0;
                    while (j < colNum) {
                        if (getCellFormatValue(row.getCell(j)) != null && !"".equals(getCellFormatValue(row.getCell(j)))) {
                            //避免时间格式产生混乱,不再使用"/"与"-",使用#&分开
                            str.append(getCellFormatValue(row.getCell(j)) + "#&");
                        } else {
                            str.append(" " + "#&");
                        }

                        j++;
                    }
                    content.put(i, str.substring(0, str.length() - 2).toString());
                }
            }
            if(n==0){
                map.put("zhubiao",content);
            }else{
                map.put("zibiao"+n,content);
            }
        }

        closeQuietly(fis);
        return map;
    }
}

```