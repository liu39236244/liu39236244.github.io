# excel 导出流

## 第一 poi 包、配合工具类、get接口、前端 使用  importUrl + window.location.href 导出、 忽略拦截

pom 包
```xml
   <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi</artifactId>
            <version>3.14</version>
        </dependency>

        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>3.14</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml-schemas</artifactId>
            <version>${poi.version}</version>
        </dependency>
```




* ExportExcelUtil.java

```java
package com.xzjy.common.utils;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.HSSFColor;
import org.apache.poi.ss.util.CellRangeAddress;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class ExportExcelUtil {
    // 显示的导出表的标题
    private String title;
    // 导出表的列名
    private String[] firstrowName;
    private String[] rowName;

    private List<Object[]> dataList = new ArrayList<Object[]>();

    HttpServletResponse response;

    public ExportExcelUtil(HttpServletResponse response) {
        this.response = response;
    }

    // 构造方法，传入要导出的数据
    public ExportExcelUtil(String title, String[] rowName, List<Object[]> dataList, HttpServletResponse res) {
        this.dataList = dataList;
        this.rowName = rowName;
        this.title = title;
        this.response = res;
    }
    public ExportExcelUtil(String title,String[] firstrowName, String[] rowName, List<Object[]> dataList, HttpServletResponse res) {
        this.dataList = dataList;
        this.firstrowName=firstrowName;
        this.rowName = rowName;
        this.title = title;
        this.response = res;
    }

    /**
     *
     * @Title: fhexport
     * @Description: TODO(任务下达汇总复合表导出)
     * @throws Exception
     * @retrun void 返回值
     * @author zpf
     * @date 2017年8月2日 下午4:48:47
     * @throws
     */
    public void fhexport() throws Exception {
        HSSFWorkbook workbook = new HSSFWorkbook(); // 创建工作簿对象
        HSSFSheet sheet = workbook.createSheet(title); // 创建工作表

        // 产生表格标题行
        HSSFRow rowm = sheet.createRow(0);
        HSSFCell cellTiltle = rowm.createCell(0);

        // sheet样式定义【getColumnTopStyle()/getStyle()均为自定义方法 - 在下面 - 可扩展】
        HSSFCellStyle columnTopStyle = getColumnTopStyle(workbook);// 获取列头样式对象
        HSSFCellStyle style = getStyle(workbook); // 单元格样式对象

        sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, (rowName.length - 1)));
        cellTiltle.setCellStyle(columnTopStyle);
        cellTiltle.setCellValue(title);

        // 定义所需列数
        int columnNumFirst=firstrowName.length;
        int columnNum = rowName.length;

        HSSFRow rowRowName=sheet.createRow(2); // 在索引2的位置创建行(最顶端的行开始的第二行)
        // 将列头设置到sheet的单元格中
        for (int n = 0; n <=columnNumFirst; n++) {
            HSSFCell cellRowName=null;
            HSSFRichTextString text=null;

            if(n>2){
                cellRowName = rowRowName.createCell((n-1)*2-1); // 创建列头对应个数的单元格
                text = new HSSFRichTextString(firstrowName[n-1]);
                cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
                cellRowName.setCellValue(text); // 设置列头单元格的值
                cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式

                cellRowName = rowRowName.createCell((n-1)*2); // 创建列头对应个数的单元格
                text = new HSSFRichTextString(firstrowName[n-1]);
                cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
                cellRowName.setCellValue(text); // 设置列头单元格的值
                cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
                sheet.addMergedRegion(new CellRangeAddress(2,2,(n-1)*2-1,(n-1)*2));
            }else{
                cellRowName = rowRowName.createCell(n); // 创建列头对应个数的单元格
                if(n<1){
                    text = new HSSFRichTextString("序号");
                }else{
                    text = new HSSFRichTextString(firstrowName[n-1]);
                }
                cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
                cellRowName.setCellValue(text); // 设置列头单元格的值
                cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
            }

        }

        HSSFRow rowRowName2= sheet.createRow(3); // 在索引3的位置创建行(最顶端的行开始的第三行)
        // 将列头设置到sheet的单元格中
        for (int n = 0; n < columnNum; n++) {

            HSSFCell cellRowName = rowRowName2.createCell(n); // 创建列头对应个数的单元格
            cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
            HSSFRichTextString text = new HSSFRichTextString(rowName[n]);
            cellRowName.setCellValue(text); // 设置列头单元格的值
            cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式

            if(n<3){
                sheet.addMergedRegion(new CellRangeAddress(2,3,n,n));
            }
        }

        // 将查询出的数据设置到sheet对应的单元格中
        int r=1,p=0;
        for (int i = 0; i < dataList.size(); i++) {

            Object[] obj = dataList.get(i);// 遍历每个对象
            HSSFRow row = sheet.createRow(i + 4);// 创建所需的行数

            int l=0;
            for (int j = 0; j < obj.length; j++) {
                HSSFCell cell = null; // 设置单元格的数据类型
                if (j == 0) {
                    cell = row.createCell(j, HSSFCell.CELL_TYPE_NUMERIC);
                    if (i%5 != 0||i==0){
                        cell.setCellValue(r);
                    }else{
                        r++;
                        cell.setCellValue(r);
                    }
                    cell.setCellStyle(style); // 设置单元格样式

                } else {
                    cell = row.createCell(j, HSSFCell.CELL_TYPE_STRING);
                    cell.setCellValue(obj[j].toString()); // 设置单元格的值
                    cell.setCellStyle(style); // 设置单元格样式

                    if (i%5 == 0&&i!=0){
                        if(j>2){
                            sheet.addMergedRegion(new CellRangeAddress(p*5 + 8,p*5 + 8,j+l,(j-1)*2));
                            l++;
                        }
                    }

                    if(i==dataList.size()-1){
                        if(j>2){
                            sheet.addMergedRegion(new CellRangeAddress(p*5 + 8,p*5 + 8,j+l,(j-1)*2));
                            l++;
                        }
                    }

                }

            }

            if (i%5 == 0&&i!=0){ p++;}
//				if(i==dataList.size()-1){p++;}

            //合并序号和行业
            sheet.addMergedRegion(new CellRangeAddress(i*5+4,i*5 + 8,0,0));
            sheet.addMergedRegion(new CellRangeAddress(i*5+4,i*5 + 8,1,1));
        }

        // 让列宽随着导出的列长自动适应
        for (int colNum = 0; colNum < columnNum; colNum++) {
            int columnWidth = sheet.getColumnWidth(colNum) / 256;
            for (int rowNum = 0; rowNum < sheet.getLastRowNum(); rowNum++) {
                HSSFRow currentRow;
                // 当前行未被使用过
                if (sheet.getRow(rowNum) == null) {
                    currentRow = sheet.createRow(rowNum);
                } else {
                    currentRow = sheet.getRow(rowNum);
                }
                if (currentRow.getCell(colNum) != null) {
                    HSSFCell currentCell = currentRow.getCell(colNum);
                    currentCell.setCellType(HSSFCell.CELL_TYPE_STRING);
                    String temp = currentCell.getStringCellValue();
                    if(temp!=null&&!"".equals(temp)){
                        int length = currentCell.getStringCellValue().getBytes().length;
                        if (columnWidth < length) {
                            columnWidth = length;
                        }
                    }

                }
            }
            if (colNum == 0) {
                sheet.setColumnWidth(colNum, (columnWidth - 2) * 256);
            } else {
                sheet.setColumnWidth(colNum, (columnWidth + 4) * 256);
            }
        }
//			sheet.addMergedRegion(new CellRangeAddress(2,3,0,0));
//			sheet.addMergedRegion(new CellRangeAddress(2,3,1,1));
//			sheet.addMergedRegion(new CellRangeAddress(2,3,2,2));

        OutputStream sos = response.getOutputStream();
        response.setContentType("application/octet-stream");
        // 获取原文件名
        String fileName = "Excel-" + String.valueOf(System.currentTimeMillis()).substring(4, 13) + ".xls";
        // 设置下载文件名
        response.addHeader("Content-Disposition",
                "attachment; filename=\"" + URLEncoder.encode(fileName, "UTF-8") + "\"");
        // 向客户端输出文件
        workbook.write(sos);
        sos.flush();
        sos.close();

    }

    /*
     * 导出数据，数据中的第一列数据将会作为序号,该方法有问题
     */
    public void export() throws Exception {
        HSSFWorkbook workbook = new HSSFWorkbook(); // 创建工作簿对象
        HSSFSheet sheet = workbook.createSheet(title); // 创建工作表

        // 产生表格标题行
        HSSFRow rowm = sheet.createRow(0);
        HSSFCell cellTiltle = rowm.createCell(0);

        // sheet样式定义【getColumnTopStyle()/getStyle()均为自定义方法 - 在下面 - 可扩展】
        HSSFCellStyle columnTopStyle = getColumnTopStyle(workbook);// 获取列头样式对象
        HSSFCellStyle style = getStyle(workbook); // 单元格样式对象

        sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, (rowName.length - 1)));
        cellTiltle.setCellStyle(columnTopStyle);
        cellTiltle.setCellValue(title);

        // 定义所需列数
        int columnNum = rowName.length;
        HSSFRow rowRowName = sheet.createRow(2); // 在索引2的位置创建行(最顶端的行开始的第二行)

        // 将列头设置到sheet的单元格中
        for (int n = 0; n < columnNum; n++) {
            HSSFCell cellRowName = rowRowName.createCell(n); // 创建列头对应个数的单元格
            cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
            HSSFRichTextString text = new HSSFRichTextString(rowName[n]);
            cellRowName.setCellValue(text); // 设置列头单元格的值
            cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
        }

        // 将查询出的数据设置到sheet对应的单元格中
        for (int i = 0; i < dataList.size(); i++) {

            Object[] obj = dataList.get(i);// 遍历每个对象
            HSSFRow row = sheet.createRow(i + 3);// 创建所需的行数

            for (int j = 0; j < obj.length; j++) {
                HSSFCell cell = null; // 设置单元格的数据类型
                if (j == 0) {
                    cell = row.createCell(j, HSSFCell.CELL_TYPE_NUMERIC);
                    cell.setCellValue(i + 1);
                } else {
                    cell = row.createCell(j, HSSFCell.CELL_TYPE_STRING);
                    cell.setCellValue((null!=obj[j])?obj[j].toString():""); // 设置单元格的值
                }
                cell.setCellStyle(style); // 设置单元格样式
            }
        }
        // 让列宽随着导出的列长自动适应
        for (int colNum = 0; colNum < columnNum; colNum++) {
            int columnWidth = sheet.getColumnWidth(colNum) / 256;
            for (int rowNum = 0; rowNum < sheet.getLastRowNum(); rowNum++) {
                HSSFRow currentRow;
                // 当前行未被使用过
                if (sheet.getRow(rowNum) == null) {
                    currentRow = sheet.createRow(rowNum);
                } else {
                    currentRow = sheet.getRow(rowNum);
                }
                if (currentRow.getCell(colNum) != null) {
                    HSSFCell currentCell = currentRow.getCell(colNum);
                    currentCell.setCellType(HSSFCell.CELL_TYPE_STRING);
                    String temp = currentCell.getStringCellValue();
                    if(temp!=null&&!"".equals(temp)){
                        int length = currentCell.getStringCellValue().getBytes().length;
                        if (columnWidth < length) {
                            columnWidth = length;
                        }
                    }

                }
            }
            if (colNum == 0) {
                sheet.setColumnWidth(colNum, (columnWidth - 2) * 256);
            } else {
                sheet.setColumnWidth(colNum, (columnWidth + 4) * 256);
            }
        }

        OutputStream sos = response.getOutputStream();
        response.setContentType("application/octet-stream");
        // 获取原文件名
        String fileName = "Excel-" + String.valueOf(System.currentTimeMillis()).substring(4, 13) + ".xls";
        // 设置下载文件名
        response.addHeader("Content-Disposition",
                "attachment; filename=\"" + URLEncoder.encode(fileName, "UTF-8") + "\"");
        // 向客户端输出文件
        workbook.write(sos);
        sos.flush();
        sos.close();

    }

    /**
     *
     * @author lrz
     * @param sheetName
     * @param titles	表头
     * @param datas	数据，每行对应map中一条记录，统计项为key，表头对应数据放在value的String[]中。
     * @return	HSSFWorkbook
     * @throws IOException
     */
    public static HSSFWorkbook exportExcel(String sheetName,String[] titles, Map<String,String[]> datas) throws IOException{
        int[] columWidth = new int[titles.length+1];
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet(sheetName);

        // 产生表格标题行
        HSSFRow rowm = sheet.createRow(0);
        HSSFCell cellTiltle = rowm.createCell(0);
        // sheet样式定义【getColumnTopStyle()/getStyle()均为自定义方法 - 在下面 - 可扩展】
        HSSFCellStyle columnTopStyle = getColumnTopStyle(wb);// 获取列头样式对象
        HSSFCellStyle style = getStyle(wb); // 单元格样式对象
        //设置合并前两行和所有列
        sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, (titles.length)));
        cellTiltle.setCellStyle(columnTopStyle);
        cellTiltle.setCellValue(sheetName);
        //设置表头行第一列为空
        HSSFRow row = sheet.createRow(2);
        HSSFCell cell = row.createCell(0);
        cell.setCellValue("");
        cell.setCellStyle(style);
        // 定义所需列数
        int columnNum = titles.length;
        for (int i = 0; i < columnNum; i++) {
            HSSFCell cellRowName = row.createCell(i+1); // 创建列头对应个数的单元格
            cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
            HSSFRichTextString text = new HSSFRichTextString(titles[i]);
            cellRowName.setCellValue(text); // 设置列头单元格的值
            cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
            int length = titles[i].getBytes().length*256;
            sheet.setColumnWidth(i+1, length);
            columWidth[i+1] = length;
        }

        List<String> keys = new LinkedList<String>(datas.keySet());
        for (int i = 0; i < keys.size(); i++) {//map每条记录对应一行
            String key = keys.get(i);//map的key为首列查询内容
            row = sheet.createRow(i + 3);//前两行为标题。第三行为表头
            row.createCell(0).setCellValue(key);
            int length = key.getBytes().length*256;
            if(length>columWidth[0]){
                columWidth[0] = length;
                sheet.setColumnWidth(0, columWidth[0]);
            }

            String[] data = datas.get(key);
            for (int j = 0; j < data.length; j++) {//循环数据并填充单元格
                int length2 = data[j].getBytes().length*300;
                if(length2>columWidth[j+1]){
                    columWidth[j+1] = length2;
                    sheet.setColumnWidth(j+1, columWidth[j+1]);
                }
                cell = row.createCell(j+1);
                cell.setCellValue(data[j]);
                cell.setCellStyle(style); // 设置单元格样式
            }
        }
        return wb;
    }

    /**
     * @Author dzl
     * @Description 生成复数sheet的excel
     * @Param [sheetNames, titless, datas] 各sheet名称集合，各sheet中标题名称集合，各sheet中数据集合
     * @return org.apache.poi.hssf.usermodel.HSSFWorkbook
     **/
    public static HSSFWorkbook exportPluralSheetExcel(List<String> sheetNames,List<String[]> titless, List<List<String[]>> datas) throws IOException{
        HSSFWorkbook wb = new HSSFWorkbook();
        for (int s = 0; s < sheetNames.size(); s++) {
            String sheetName = sheetNames.get(s);
            HSSFSheet sheet = wb.createSheet(sheetName);

            String[] titles = titless.get(s);
            // 产生表格标题行
            int[] columWidth = new int[titles.length];
            HSSFRow rowm = sheet.createRow(0);
            HSSFCell cellTiltle = rowm.createCell(0);
            // sheet样式定义【getColumnTopStyle()/getStyle()均为自定义方法 - 在下面 - 可扩展】
            HSSFCellStyle columnTopStyle = getColumnTopStyle(wb);// 获取列头样式对象
            HSSFCellStyle style = getStyle(wb); // 单元格样式对象
            //设置合并前两行和所有列
            sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, (titles.length-1)));
            cellTiltle.setCellStyle(columnTopStyle);
            cellTiltle.setCellValue(sheetName);
            //设置表头行第一列为空
            HSSFRow row = sheet.createRow(2);
            HSSFCell cell = row.createCell(0);
            cell.setCellValue("");
            cell.setCellStyle(style);
            // 定义所需列数
            int columnNum = titles.length;
            for (int i = 0; i < columnNum; i++) {
                HSSFCell cellRowName = row.createCell(i); // 创建列头对应个数的单元格
                cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
                HSSFRichTextString text = new HSSFRichTextString(titles[i]);
                cellRowName.setCellValue(text); // 设置列头单元格的值
                cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
                int length = titles[i].getBytes().length*256;
                sheet.setColumnWidth(i, length);
                columWidth[i] = length;
            }

            List<String[]> sdata = datas.get(s);
            for (int i = 0; i < sdata.size(); i++) {
                row = sheet.createRow(i + 3);//前两行为标题。第三行为表头
                String[] data = sdata.get(i);
                for (int j = 0; j < data.length; j++) {//循环数据并填充单元格
                    int length2 = data[j].getBytes().length * 300;
                    if (length2 > columWidth[j]) {
                        columWidth[j] = length2;
                        sheet.setColumnWidth(j, columWidth[j]);
                    }
                    cell = row.createCell(j);
                    cell.setCellValue(data[j]);
                    cell.setCellStyle(style); // 设置单元格样式
                }
            }

//            List<String> keys = new LinkedList<String>(datas.keySet());
//            for (int i = 0; i < keys.size(); i++) {//map每条记录对应一行
//                String key = keys.get(i);//map的key为首列查询内容
//                row = sheet.createRow(i + 3);//前两行为标题。第三行为表头
//                row.createCell(0).setCellValue(key);
//                int length = key.getBytes().length*256;
//                if(length>columWidth[0]){
//                    columWidth[0] = length;
//                    sheet.setColumnWidth(0, columWidth[0]);
//                }
//
//                String[] data = datas.get(key);
//                for (int j = 0; j < data.length; j++) {//循环数据并填充单元格
//                    int length2 = data[j].getBytes().length*300;
//                    if(length2>columWidth[j+1]){
//                        columWidth[j+1] = length2;
//                        sheet.setColumnWidth(j+1, columWidth[j+1]);
//                    }
//                    cell = row.createCell(j+1);
//                    cell.setCellValue(data[j]);
//                    cell.setCellStyle(style); // 设置单元格样式
//                }
//            }
        }
        return wb;
    }

    /*
     * 列头单元格样式
     */
    public static HSSFCellStyle getColumnTopStyle(HSSFWorkbook workbook) {

        // 设置字体
        HSSFFont font = workbook.createFont();
        // 设置字体大小
        font.setFontHeightInPoints((short) 11);
        // 字体加粗
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 设置字体名字
        font.setFontName("Courier New");
        // 设置样式;
        HSSFCellStyle style = workbook.createCellStyle();
        // 设置底边框;
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        // 设置底边框颜色;
        style.setBottomBorderColor(HSSFColor.BLACK.index);
        // 设置左边框;
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        // 设置左边框颜色;
        style.setLeftBorderColor(HSSFColor.BLACK.index);
        // 设置右边框;
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        // 设置右边框颜色;
        style.setRightBorderColor(HSSFColor.BLACK.index);
        // 设置顶边框;
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        // 设置顶边框颜色;
        style.setTopBorderColor(HSSFColor.BLACK.index);
        // 在样式用应用设置的字体;
        style.setFont(font);
        // 设置自动换行;
        style.setWrapText(false);
        // 设置水平对齐的样式为居中对齐;
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        // 设置垂直对齐的样式为居中对齐;
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

        return style;

    }

    /*
     * 列数据信息单元格样式
     */
    public static HSSFCellStyle getStyle(HSSFWorkbook workbook) {
        // 设置字体
        HSSFFont font = workbook.createFont();
        // 设置字体大小
        // font.setFontHeightInPoints((short)10);
        // 字体加粗
        // font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 设置字体名字
        font.setFontName("Courier New");
        // 设置样式;
        HSSFCellStyle style = workbook.createCellStyle();
        // 设置底边框;
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        // 设置底边框颜色;
        style.setBottomBorderColor(HSSFColor.BLACK.index);
        // 设置左边框;
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        // 设置左边框颜色;
        style.setLeftBorderColor(HSSFColor.BLACK.index);
        // 设置右边框;
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        // 设置右边框颜色;
        style.setRightBorderColor(HSSFColor.BLACK.index);
        // 设置顶边框;
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        // 设置顶边框颜色;
        style.setTopBorderColor(HSSFColor.BLACK.index);
        // 在样式用应用设置的字体;
        style.setFont(font);
        // 设置自动换行;
        style.setWrapText(false);
        // 设置水平对齐的样式为居中对齐;
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        // 设置垂直对齐的样式为居中对齐;
        style.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);

        return style;

    }

    public static HSSFWorkbook exportExcel(String titleName,String[] columnName, List<Object[]> datas){
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        // 产生表格标题行
        HSSFRow title = sheet.createRow(0);
        HSSFCell cellTitle = title.createCell(0);
        HSSFCellStyle columnTopStyle = getColumnTopStyle(wb);// 获取列头样式对象
        HSSFCellStyle style = getStyle(wb); // 单元格样式对象
        //设置合并前两行和所有列
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, columnName.length));
        cellTitle.setCellStyle(columnTopStyle);
        cellTitle.setCellValue(titleName);
        //设置表头行
        HSSFRow row1 = sheet.createRow(1);
        for(int i=0;i<=columnName.length;++i) {
        	HSSFCell cell = row1.createCell(i);
        	if(i==0) {
        		cell.setCellValue("序号");
        	}else {
        		cell.setCellValue(columnName[i-1]);
        	}        	
            cell.setCellStyle(style);
        }
        //数据填充部分
        for(int i=0;i<datas.size();++i) {
        	 HSSFRow row = sheet.createRow(i+2);
        	 for(int j=0;j<=columnName.length;++j) {
        		 HSSFCell cell = row.createCell(j);
        		 if(j==0) {
             		cell.setCellValue(i+1);
             	 }else {
             		cell.setCellValue(datas.get(i)[j-1]==null?"":datas.get(i)[j-1].toString());
             	 }
        		 cell.setCellStyle(style);
        	 }
        }
        return wb;
    }

    public void exportExcel(String fileName) throws Exception {
        int count;
        int div = dataList.size()%60000;
        if(div>0) {
            count = dataList.size()/60000;
        }else{
            count = dataList.size()/1-1;
        }

        HSSFWorkbook workbook = new HSSFWorkbook(); // 创建工作簿对象
        //如果没数据时也需要有表头
        HSSFSheet sheet = workbook.createSheet(title); // 创建工作表

        // 产生表格标题行
        HSSFRow rowm = sheet.createRow(0);
        HSSFCell cellTiltle = rowm.createCell(0);

        // sheet样式定义【getColumnTopStyle()/getStyle()均为自定义方法 - 在下面 - 可扩展】
        HSSFCellStyle columnTopStyle = getColumnTopStyle(workbook);// 获取列头样式对象
        HSSFCellStyle style = getStyle(workbook); // 单元格样式对象

        sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, (rowName.length - 1)));
        cellTiltle.setCellStyle(columnTopStyle);
        cellTiltle.setCellValue(title);
        // 定义所需列数
        int columnNum = rowName.length;
        HSSFRow rowRowName = sheet.createRow(2); // 在索引2的位置创建行(最顶端的行开始的第二行)
        // 将列头设置到sheet的单元格中
        for (int n = 0; n < columnNum; n++) {
            HSSFCell cellRowName = rowRowName.createCell(n); // 创建列头对应个数的单元格
            cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
            HSSFRichTextString text = new HSSFRichTextString(rowName[n]);
            cellRowName.setCellValue(text); // 设置列头单元格的值
            cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
        }
        //如果超过60000条数据就再新建个sheet页
        for(int m=0; m<=count; m++) {
                if(m>0) {
                    sheet = workbook.createSheet(title + m); // 创建工作表

                    // 产生表格标题行
                    rowm = sheet.createRow(0);
                    cellTiltle = rowm.createCell(0);

                    // sheet样式定义【getColumnTopStyle()/getStyle()均为自定义方法 - 在下面 - 可扩展】
                    columnTopStyle = getColumnTopStyle(workbook);// 获取列头样式对象
                    style = getStyle(workbook); // 单元格样式对象

                    sheet.addMergedRegion(new CellRangeAddress(0, 1, 0, (rowName.length - 1)));
                    cellTiltle.setCellStyle(columnTopStyle);
                    cellTiltle.setCellValue(title);


                    rowRowName = sheet.createRow(2); // 在索引2的位置创建行(最顶端的行开始的第二行)

                    // 将列头设置到sheet的单元格中
                    for (int n = 0; n < columnNum; n++) {
                        HSSFCell cellRowName = rowRowName.createCell(n); // 创建列头对应个数的单元格
                        cellRowName.setCellType(HSSFCell.CELL_TYPE_STRING); // 设置列头单元格的数据类型
                        HSSFRichTextString text = new HSSFRichTextString(rowName[n]);
                        cellRowName.setCellValue(text); // 设置列头单元格的值
                        cellRowName.setCellStyle(columnTopStyle); // 设置列头单元格样式
                    }
                }
            // 将查询出的数据设置到sheet对应的单元格中
            for (int i = m*60000; i < dataList.size()&&i<(m+1)*60000; i++) {
                Object[] obj = dataList.get(i);// 遍历每个对象
                HSSFRow row = sheet.createRow(i + 3-m*60000);// 创建所需的行数

                for (int j = 0; j < obj.length; j++) {
                    HSSFCell cell = null; // 设置单元格的数据类型
                    cell = row.createCell(j, HSSFCell.CELL_TYPE_STRING);
                    if(obj[j] != null)
                        cell.setCellValue(obj[j].toString()); // 设置单元格的值
                    else
                        cell.setCellValue("");
                    cell.setCellStyle(style); // 设置单元格样式
                }
            }
            // 让列宽随着导出的列长自动适应
            for (int colNum = 0; colNum < columnNum; colNum++) {
                int columnWidth = sheet.getColumnWidth(colNum) / 256;
                for (int rowNum = 0; rowNum < sheet.getLastRowNum(); rowNum++) {
                    HSSFRow currentRow;
                    // 当前行未被使用过
                    if (sheet.getRow(rowNum) == null) {
                        currentRow = sheet.createRow(rowNum);
                    } else {
                        currentRow = sheet.getRow(rowNum);
                    }
                    if (currentRow.getCell(colNum) != null) {
                        HSSFCell currentCell = currentRow.getCell(colNum);
                        currentCell.setCellType(HSSFCell.CELL_TYPE_STRING);
                        String temp = currentCell.getStringCellValue();
                        if(temp!=null&&!"".equals(temp)){
                            int length = currentCell.getStringCellValue().getBytes().length;
                            if (columnWidth < length) {
                                columnWidth = length;
                            }
                        }

                    }
                }
                try {
                    if (colNum == 0) {
                        sheet.setColumnWidth(colNum, (columnWidth - 2) * 256);
                    } else {
                        sheet.setColumnWidth(colNum, (columnWidth + 4) * 256);
                    }
                } catch (IllegalArgumentException e) {
                    sheet.setColumnWidth(colNum, 65280);
                }
            }

        }


        OutputStream sos = response.getOutputStream();
        response.setContentType("application/octet-stream");
        // 获取原文件名
        //String fileName = "Excel-" + String.valueOf(System.currentTimeMillis()).substring(4, 13) + ".xls";
        // 设置下载文件名
        response.addHeader("Content-Disposition",
                "attachment; filename=\"" + URLEncoder.encode(fileName, "UTF-8") + "\"");
        // 向客户端输出文件
        workbook.write(sos);
        sos.flush();
        sos.close();
    }

    /**
     * @Description: 导出Excel 包含多张sheet
     * @author wang
     * @param workbook
     * @param sheetNum (sheet的位置，0表示第一个表格中的第一个sheet)
     * @param sheetTitle  （sheet的名称）
     * @param headers    （表格的列标题）
     * @param result   （表格的数据）
     * @throws Exception
     */
    public void exportExcels(HSSFWorkbook workbook, int sheetNum,
                            String sheetTitle, String[] headers, List<List<String>> result) throws Exception {
        // 生成一个表格
        HSSFSheet sheet = workbook.createSheet();
        workbook.setSheetName(sheetNum, sheetTitle);
        // 设置表格默认列宽度为20个字节
        sheet.setDefaultColumnWidth((short) 20);
        // 生成一个样式
        HSSFCellStyle style = workbook.createCellStyle();
        // 设置这些样式
        style.setFillForegroundColor(HSSFColor.PALE_BLUE.index);
        style.setFillPattern(HSSFCellStyle.SOLID_FOREGROUND);
        style.setBorderBottom(HSSFCellStyle.BORDER_THIN);
        style.setBorderLeft(HSSFCellStyle.BORDER_THIN);
        style.setBorderRight(HSSFCellStyle.BORDER_THIN);
        style.setBorderTop(HSSFCellStyle.BORDER_THIN);
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        // 生成一个字体
        HSSFFont font = workbook.createFont();
        font.setColor(HSSFColor.BLACK.index);
        font.setFontHeightInPoints((short) 12);
        font.setBoldweight(HSSFFont.BOLDWEIGHT_BOLD);
        // 把字体应用到当前的样式
        style.setFont(font);

        // 指定当单元格内容显示不下时自动换行
        style.setWrapText(true);

        // 产生表格标题行
        HSSFRow row = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            HSSFCell cell = row.createCell((short) i);

            cell.setCellStyle(style);
            HSSFRichTextString text = new HSSFRichTextString(headers[i]);
            cell.setCellValue(text.toString());
        }
        // 遍历集合数据，产生数据行
        if (result != null) {
            Integer index = 1;
            for (List<String> m : result) {
                row = sheet.createRow(index);
                int cellIndex = 0;
                for (String str : m) {
                    HSSFCell cell = row.createCell((short) cellIndex);
                    if(StringUtils.isNotBlank(str)){
                        cell.setCellValue(str.toString());
                    }else {
                        cell.setCellValue("");
                    }

                    cellIndex++;
                }
                index++;
            }
        }


    }
}

```

* 使用
 注意controller 层返回null
```java
    @GetMapping(value = "/exportExamResult")
    public RestMessage exportExamResult(@RequestParam(value="ids",required=false) String ids,
                                       @RequestParam(value = "userName", required = false) String userName,
                                       @RequestParam(value = "status", required = false) Integer status,
                                       @RequestParam("testId") String testId, HttpServletResponse response,
                                        @RequestParam(value = "planId", required = false) String planId) throws Exception {
        try{
            eduTestUserService.exportExamResult(ids, userName, status, testId, response,planId);
        }catch (Exception e){
            e.printStackTrace();
            return new RestMessage(RespCodeAndMsg.FAIL,"考试成绩导出失败");
        }
        return null;
    }
```


```java
 public void exportExamResult(String ids, String userName, Integer status, String testId, HttpServletResponse response,String planId) {
        try {
            String[] rowName = {"姓名", "单选", "多选", "判断", "填空", "简答", "试卷总分", "得分", "状态", "考试结果"};

            List<Object[]> dataList = new ArrayList<>();
            String[] idList = null;
            if(StringUtils.isNotBlank(ids)){
                idList = ids.split(",");
            }
            List<EduTestUser> list = new ArrayList<>();
            list = eduTestUserMapper.exportExamResult(idList, userName, status, testId,planId);
            Object[] data = null;
            for(EduTestUser eduTestUser:list){
                // 11 -带有企业名
                data = new Object[10];
//                data[0] = eduTestUser.getQyName();
                // 姓名
                if(StringUtils.isNotEmpty(eduTestUser.getUserName())){
                    data[0] = eduTestUser.getUserName();
                }else{
                    data[0] = "";
                }
                if(eduTestUser.getStatus() != null && (1 == eduTestUser.getStatus() || 2 == eduTestUser.getStatus())){
                    // 根据 用户id,试卷id，试题类型查询统计该试卷用户题型的的得分
                    int singleChoiceScore = eduUserPaperMapper.findTypeScore(eduTestUser.getTestId(), eduTestUser.getUserId(), planId, EduExerciseProblemTypeEnum.SINGLE_CHOICE.getCode());
                    data[1] = singleChoiceScore; // 单选题得分
                    int multiChoiceScore = eduUserPaperMapper.findTypeScore(eduTestUser.getTestId(), eduTestUser.getUserId(), planId, EduExerciseProblemTypeEnum.MULTI_CHOICE.getCode());
                    data[2] = multiChoiceScore; // 多选题得分
                    int judgeScore = eduUserPaperMapper.findTypeScore(eduTestUser.getTestId(), eduTestUser.getUserId(), planId, EduExerciseProblemTypeEnum.JUDGE.getCode());
                    data[3] = judgeScore; // 判断题得分
                    int blankScore = eduUserPaperMapper.findTypeScore(eduTestUser.getTestId(), eduTestUser.getUserId(), planId, EduExerciseProblemTypeEnum.BLANK.getCode());
                    data[4] = blankScore; // 填空题得分
                    int shortAnswerScore = eduUserPaperMapper.findTypeScore(eduTestUser.getTestId(), eduTestUser.getUserId(), planId, EduExerciseProblemTypeEnum.SHORT_ANSWER.getCode());
                    data[5] = shortAnswerScore; // 简答题得分
                }else{
                    data[1] = ""; // 单选题得分
                    data[2] = ""; // 多选题得分
                    data[3] = ""; // 判断题得分
                    data[4] = ""; // 填空题得分
                    data[5] = ""; // 简答题得分
                }
                EduTestPaper eduTestPaper = eduTestPaperMapper.selectByPrimaryKey(eduTestUser.getTestId());
                if(eduTestPaper != null && eduTestPaper.getTotalScore() != null){
                    data[6] = eduTestPaper.getTotalScore(); // 试卷总分
                }else{
                    data[6] = "";
                }
                if(eduTestUser.getTestScore() != null){
                    data[7] = eduTestUser.getTestScore();  // 考试得分
                }else{
                    data[7] = "";
                }
                data[8] = eduTestUser.getStatus() == 0 ? "未参加考试" : eduTestUser.getStatus() == 1 ? "未批阅" : eduTestUser.getStatus() == 2 ? "已批阅" : "";
                data[9] = eduTestUser.getExamResult() == 0 ? "缺考" : eduTestUser.getExamResult() == 1 ? "及格" : eduTestUser.getExamResult() == 2 ? "不及格" :  eduTestUser.getExamResult() == 3 ? "补考及格" : "未批阅";
                dataList.add(data);
            }
            ExportExcelUtil export = new ExportExcelUtil("考试结果信息", rowName, dataList, response);
            String fileName = "考试结果信息"+ DateFormatUtils.format(new Date(), "yyyy-MM-dd") +".xls";
            export.exportExcel(fileName);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
```

* 前端调用

也可以直接使用windows.location.href 去调用 get 方式的后台接口

```js
exportExamResult(){
      let ids = this.dataListSelections.map(item => {
        return item.userId
      })
      let importUrl = '/edu/testUser/exportExamResult?ids=' + ids +
            '&userName=' + this.searchForm.userName +
          '&testId=' + this.searchForm.testId +
          '&status=' + this.searchForm.status +
          '&planId=' + (this.searchForm.planId === undefined ? '' : this.searchForm.planId)
				importUrl = encodeURI(importUrl)
      if (ids.length > 0) {
        window.location.href = this.baseUrl  + importUrl
      } else {
        window.location.href = this.baseUrl + importUrl
      }
    }
```


## 第二种 easyExcel + 后端get 接口 +    window.location.href + 过滤拦截 


### 1 pom 依赖包

```
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>easyexcel</artifactId>
            <version>2.1.4</version>
        </dependency>

```

### 2 设定导出model vo类


```java
@Data
public class EquipmentDataExcel {

    @ExcelProperty(value = {"设备数据","序号"},index = 0)
    private String index;

    @ExcelProperty(value = {"设备数据","温度(℃)"},index = 1)
    private String humidity;

    @ExcelProperty(value = {"设备数据","湿度(RH%)"},index = 2)
    private String temperature;

    @ExcelProperty(value = {"设备数据","监测时间"},index = 3)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

}

```

### 3 接口

```java

    // 我的导出这里有个时间转换的参数，需要在同层中的controller中加入这个 initbinder

    @InitBinder
    public void initBinder(WebDataBinder binder) {

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

 @GetMapping(value = "/exportHistoryRecord")
    public void xportHistoryRecordGet(
            @RequestParam(value = "nodeId", required = true) String nodeId,
            @RequestParam(value = "devId", required = true) String devId,
            @RequestParam(value = "createTime", required = false) Date createTime,
                                       HttpServletResponse response) {
        HumitureDataQuery val = new HumitureDataQuery();
        val.setNodeId(nodeId);
        val.setDevId(devId);
        val.setCreateTime(createTime);
        List<HumitureEqipmentDataDto> rows = humitureEquipmentDataService.getHistoryRecord(val).getRows();
        humitureEquipmentDataService.exportHistoryRecord(rows, response);
    }

```

* service 

```java

    public void exportHistoryRecord(List<HumitureEqipmentDataDto> rows, HttpServletResponse response) {
        try {
            // 将数据转化为导出对象
            int index = 1;
            List<EquipmentDataExcel> resultExel = new ArrayList<>();
            for (HumitureEqipmentDataDto rquip : rows) {
                EquipmentDataExcel excel = new EquipmentDataExcel();
                BeanUtils.copyProperties(rquip, excel);
                excel.setIndex(index++ +"");
                resultExel.add(excel);
            }
            response.setContentType("application/vnd.ms-excel");
            response.setCharacterEncoding("utf-8");
            // 这里URLEncoder.encode可以防止中文乱码
            String fileName = URLEncoder.encode(rows.size()>0 ?"设备-"+rows.get(0).getName() :"设备数据-", "UTF-8");
            response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
            EasyExcel.write(response.getOutputStream(), EquipmentDataExcel.class).sheet("data").doWrite(resultExel);
        }catch (Exception ex){
            log.error(ex.getMessage());
        }
    }

```

### 4 拦截器中将接口放行，这里不再给出代码

### 5 前端调用


* 这个时间有值就传，每值就不拼接参数

```js
  window.location.href =humitureEquipmentData.url + "/exportHistoryRecordGet?nodeId="+this.listQuery.nodeId+'&devId='+this.listQuery.devId + (this.listQuery.createTime?'&createTime='+this.listQuery.createTime:"")
```


## 将文件创建到服务器上，上传到对应的mongo中然后返回前段mongodid 方式

### 后端接口


```java
    @PostMapping(value="/templatedownload", produces="application/json;charset=UTF-8")
    @Override
    public RestMessage<String> templatedownload(HttpServletRequest request) {
        List<BasePostExcel> list = new ArrayList<>();
        String fileName = "E:\\岗位管理.xlsx";
        EasyExcel.write(fileName, BasePostExcel.class)
                .registerWriteHandler(new LongestMatchColumnWidthStyleStrategy()).sheet("岗位管理")
                .doWrite(list);
        File file = new File(fileName);
        //针对post请求，先上传到文件存储系统，返回前端再下载
        String backId = mongoDbUtil.uploadExcelBackId(file, request);

        return new RestMessage<>(backId);
    }



 
```

mongo中上传，这里简单放上代码，


```java
   public  String  uploadExcelBackId(File file, HttpServletRequest request){
        try {
            InputStream inputStream  = new FileInputStream(file);
            ObjectId store = gridFsTemplate.store(inputStream, file.getName(), request.getContentType());
            return store.toString();
        } catch (IOException e) {
            System.out.println("获取文件输入流错误。。。。。");
            e.printStackTrace();
            return null;
        }
    }
```


## 第三种 前端post ， 后端返回文件流


### 前端代码

```js

exportExcel() {
        this.exportFlag = true;
        this.$axios.post("/user/seUser/exportExpertList", this.search, {
          responseType: "blob"
        }).then((res) => {
          const blob = res.data;
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = e => {
            const a = document.createElement("a");
            a.download = `导出.xlsx`;
            a.href = e.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            this.exportFlag = false;
          };
        }).catch((e) => {
          this.exportFlag = false;
          this.$notify({
            type: "error",
            message: "请求失败！"
          });
        });
      }
```


### 后端接口

* 使用的是poi

![](assets/003/08/02/01-1622789137708.png)

controller

```java
@ApiOperation(value = "导出", notes = "后台导出人员信息清单")
    @Override
    @PostMapping(value = "/exportExpertList", produces = "application/json;charset=UTF-8")
    public RestMessage exportExpertList( @RequestBody SeUserDto dto, HttpServletResponse response ) {
        try {
            String result = seUserService.exportExpertList( dto, response );
            if (StringUtils.isNotBlank( result )) {
                return new RestMessage( RespCodeAndMsg.FAIL );
            } else {
                return new RestMessage( RespCodeAndMsg.SUCCESS );
            }
        } catch (Exception e) {
            e.printStackTrace();
            return new RestMessage( RespCodeAndMsg.FAIL );
        }
    }
```

service 层

```java



@Override
    public String exportExpertList( SeUserDto dto, HttpServletResponse response ) {
        try {
            String excelName = "信息导出表";
            dto.setPage(null);
            dto.setLimit(null);
            List <SeUserDto> users = this.listAll( dto );
            exportExpertInfo( excelName, users, response );
        } catch (Exception e) {
            e.printStackTrace();
            return "error";
        }
        return null;
    }



private void exportExpertInfo( String excelName, List <SeUserDto> users, HttpServletResponse response ) {
        OutputStream sos = null;
        SXSSFWorkbook wb = new SXSSFWorkbook( 1000 );// 保留1000条数据在内存中
        SXSSFSheet sheet = wb.createSheet();
        // 设置报表头样式
        CellStyle header = ExcelFormatUtil.headSytle( wb );// cell样式
        CellStyle content = ExcelFormatUtil.contentStyle( wb );// 报表体样式
        String[] rowName = {"姓名", "性别", "工作单位", "手机号码", "专家级别", "所学专业", "从事专业", "资格证书", "职务", "职称", "工作状态", "所属省份", "审核状态"};
        int columnNum = rowName.length;
        SXSSFRow row0 = sheet.createRow( 0 ); // 创建列头对应个数的单元格
        for (int n = 0; n < columnNum; n++) {
            SXSSFCell cell = row0.createCell( n );
            cell.setCellValue( rowName[n] ); // 设置列头单元格的值
            cell.setCellStyle( header ); // 设置列头单元格样式
        }
        if (users != null && users.size() > 0) {
            for (int i = 0; i < users.size(); i++) {
                SeUserDto seUserDto = users.get( i );
                SXSSFRow row = sheet.createRow( i + 1 );
                int j = 0;
                SXSSFCell cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getRealName() )) {
                    cell.setCellValue( seUserDto.getRealName() ); // 姓名
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (seUserDto.getSex() != null) {
                    cell.setCellValue( seUserDto.getSex() == 0 ? "男" : "女" ); //  性别
                    cell.setCellStyle( content );
                } else {
                    cell.setCellValue( "" ); //  性别
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getWorkUnit() )) {
                    cell.setCellValue( seUserDto.getWorkUnit() ); //  工作单位
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getPhoneNum() )) {
                    cell.setCellValue( seUserDto.getPhoneNum() ); //  手机号码
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getLevelName() )) {
                    cell.setCellValue( seUserDto.getLevelName() ); //  专家级别
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getLearnMajor() )) {
                    cell.setCellValue( seUserDto.getLearnMajor() ); //  所学专业
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getWorkMajorName() )) {
                    cell.setCellValue( seUserDto.getWorkMajorName() ); //  从事专业
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getAptitudeTypeName() )) {
                    cell.setCellValue( seUserDto.getAptitudeTypeName() ); //  资格证书
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getOffice() )) {
                    cell.setCellValue( seUserDto.getOffice() ); //  职务
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getJobTitleName() )) {
                    cell.setCellValue( seUserDto.getJobTitleName() ); //  职称
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getCurrentStateName() )) {
                    cell.setCellValue( seUserDto.getCurrentStateName() ); //  工作状态
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (StringUtils.isNotEmpty( seUserDto.getProvinceName() )) {
                    cell.setCellValue( seUserDto.getProvinceName() ); //  所属省份
                    cell.setCellStyle( content );
                }

                cell = row.createCell( j++ );
                if (seUserDto.getState() != null) {
                    String stateValue = "";
                    if (seUserDto.getState() == 0) {
                        stateValue = "待审核";
                    } else if (seUserDto.getState() == 1) {
                        stateValue = "审核通过";
                    } else if (seUserDto.getState() == 2) {
                        stateValue = "审核未通过";
                    } else if (seUserDto.getState() == 3) {
                        stateValue = "未提交";
                    }
                    cell.setCellValue( stateValue ); //  审核状态
                    cell.setCellStyle( content );
                }
            }
        }
        try {
            sos = response.getOutputStream();
            response.setContentType( "application/octet-stream" );
            // 设置下载文件名
            response.addHeader( "Content-Disposition", "attachment; filename=\"" + URLEncoder.encode( excelName + ".xlsx", "UTF-8" ) + "\"" );
            // 向客户端输出文件
            wb.write( sos );
            sos.flush();
            sos.close();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                if (sos != null) {
                    sos.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

```

## 第三种

原文：https://blog.csdn.net/yuanwxcsdn/article/details/107287714
