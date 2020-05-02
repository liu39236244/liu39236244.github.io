# Hbase 工具类总结


# Hbase.java

## Hbase.java 工具类

```Java
package cn.netcommander.rasengine.utils;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

import com.alibaba.fastjson.JSONObject;
import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.*;
import org.apache.hadoop.hbase.client.Admin;
import org.apache.hadoop.hbase.client.Connection;
import org.apache.hadoop.hbase.client.ConnectionFactory;
import org.apache.hadoop.hbase.client.Delete;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.Put;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.client.Table;
import org.apache.hadoop.hbase.util.Bytes;

public class HBaseUtils implements Serializable {

	private static final long serialVersionUID = 1L;

	public static Configuration conf = HBaseConfiguration.create();

    //创建Connection是重量级操作。 Connection是线程安全的，因此，多个客户端线程可以共享一个Connection。
    //一个客户端程序共享一个单独的Connection，每一个线程获取自己的Table实例。不建议缓存或者池化（pooling）Table、Admin
    public static Connection conn = null;

    private static final String clusterID = "mycluster";

    static {
        Properties p = PropertiesUtils.getProperties("conf/db.properties");

        String zkQuorum = p.getProperty(HConstants.ZOOKEEPER_QUORUM, "localhost");
        String zkClientPort = p.getProperty(HConstants.ZOOKEEPER_CLIENT_PORT, "2181");
        conf.set(HConstants.ZOOKEEPER_QUORUM, zkQuorum);
        conf.set(HConstants.ZOOKEEPER_CLIENT_PORT, zkClientPort);

        //远程客户端连接集群需指定hadoop配置
        conf.set("fs.defaultFS", "hdfs://" + clusterID);
        conf.set("dfs.nameservices", clusterID);
        conf.set("dfs.ha.namenodes." + clusterID, "nn1,nn2");
        conf.set("dfs.namenode.rpc-address." + clusterID + ".nn1", "ip.20.60:8020");
        conf.set("dfs.namenode.rpc-address." + clusterID + ".nn2", "ip.20.61:8020");
        conf.set("dfs.client.failover.proxy.provider." + clusterID, "org.apache.hadoop.hdfs.server.namenode.ha.ConfiguredFailoverProxyProvider");

    }


    //初始化HBase连接
    public static Connection getConnection() {
        try {
            if (conn == null || conn.isClosed()) {
                synchronized (HBaseUtils.class) {
                    if (conn == null || conn.isClosed()) {
                        conn = ConnectionFactory.createConnection(conf);
                    }
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return conn;
    }

    //关闭连接
    //Connection是重量级操作,关闭建议在程序末尾调用
    public static void closeConnection() {
        try {
            if (null != conn) {
                conn.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    /**
     * 创建表
     *
     * @param tableName   表名
     * @param familyNames 列族名数组
     * @throws IOException
     */
    public static void createTable(String tableName, String[] familyNames) throws IOException {
        Admin admin = getConnection().getAdmin();
        TableName tn = TableName.valueOf(tableName);
        if (admin.tableExists(tn)) {
            System.out.println("table is exists!");
        } else {
            HTableDescriptor hTableDescriptor = new HTableDescriptor(tn);
            for (String familyName : familyNames) {
                HColumnDescriptor hColumnDescriptor = new HColumnDescriptor(familyName);
                hTableDescriptor.addFamily(hColumnDescriptor);
            }
            admin.createTable(hTableDescriptor);
        }
        admin.close();
    }

    /**
     * 删除表
     *
     * @param tableName 表名
     * @throws IOException
     */
    public static void deleteTable(String tableName) throws IOException {
        Admin admin = getConnection().getAdmin();
        TableName tn = TableName.valueOf(tableName);
        if (admin.tableExists(tn)) {
            admin.disableTable(tn);
            admin.deleteTable(tn);
        }
        admin.close();
    }

    //查看已有表
    public static void listTables() throws IOException {
        Admin admin = getConnection().getAdmin();
        HTableDescriptor hTableDescriptors[] = admin.listTables();
        for (HTableDescriptor hTableDescriptor : hTableDescriptors) {
            System.out.println(hTableDescriptor.getNameAsString());
        }
        admin.close();
    }

    //插入数据
    public static void insertRow(String tableName, String row, String colFamily, String col, String val) throws IOException {
        Table table = getConnection().getTable(TableName.valueOf(tableName));
        Put put = new Put(Bytes.toBytes(row));
        put.addColumn(Bytes.toBytes(colFamily), Bytes.toBytes(col), Bytes.toBytes(val));
        table.put(put);

        //批量插入
       /* List<Put> putList = new ArrayList<Put>();
        putList.add(put);
        table.put(putList);*/
        table.close();
    }

    //删除数据
    public static void deleteRow(String tableName, String rowkey, String colFamily, String col) throws IOException {
        Table table = getConnection().getTable(TableName.valueOf(tableName));
        Delete delete = new Delete(Bytes.toBytes(rowkey));
        //删除指定列族
        //delete.addFamily(Bytes.toBytes(colFamily));
        //删除指定列
        // delete.addColumn(Bytes.toBytes(colFamily),Bytes.toBytes(col));
        table.delete(delete);

        //批量删除
       /* List<Delete> deleteList = new ArrayList<Delete>();
        deleteList.add(delete);
        table.delete(deleteList);*/
        table.close();
    }

    //根据rowkey查找数据
    public static void getData(String tableName, String rowkey, String colFamily, String col) throws IOException {
        Table table = getConnection().getTable(TableName.valueOf(tableName));
        Get get = new Get(Bytes.toBytes(rowkey));
        //.setMaxVersions(3)//默认获取版本数为1个;
        //获取指定列族数据
        //get.addFamily(Bytes.toBytes(colFamily));
        //获取指定列数据
        get.addColumn(Bytes.toBytes(colFamily), Bytes.toBytes(col));
        Result result = table.get(get);
        showCell(result);

        table.close();
    }

    //格式化输出
    public static void showCell(Result result) {
        Cell[] cells = result.rawCells();
        for (Cell cell : cells) {
            System.out.println("RowKey:" + new String(CellUtil.cloneRow(cell)) + " ");
            System.out.println("TimeTamp:" + cell.getTimestamp() + " ");
            System.out.println("Family:" + new String(CellUtil.cloneFamily(cell)) + " ");
            System.out.println("Qualifier:" + new String(CellUtil.cloneQualifier(cell)) + " ");
            System.out.println("value:" + new String(CellUtil.cloneValue(cell)) + " ");
        }
    }

    //批量查找数据
    public static void scanData(String tableName, String startRow, String stopRow) throws IOException {
        Table table = getConnection().getTable(TableName.valueOf(tableName));
        Scan scan = new Scan();
        scan.setStartRow(Bytes.toBytes(startRow));
//        scan.setStopRow(Bytes.toBytes(stopRow));
        ResultScanner resultScanner = table.getScanner(scan);
        for (Result result : resultScanner) {
            System.out.println("============================");
            showCell(result);
        }
        resultScanner.close();
        table.close();
    }


    /**
     * 跟据表名获取表的json字符串数据集合
     *
     * @return 短信发送规则数据集
     * @throws IOException
     */
    public static List<String> getHBaseJsonData(String tableName) throws IOException {
        List<String> list = new ArrayList<String>();
        Connection conn = HBaseUtils.getConnection();
        Table table = conn.getTable(TableName.valueOf(tableName));
        Scan scan = new Scan();
        ResultScanner resultScanner = table.getScanner(scan);
        JSONObject json = new JSONObject(4);
        for (Result result : resultScanner) {
            json.clear();
            json.put("rowKey", Bytes.toString(result.getRow()));
            Cell[] cells = result.rawCells();
            for (Cell cell : cells) {
                String family = Bytes.toString(CellUtil.cloneFamily(cell));
                String qualifier = Bytes.toString(CellUtil.cloneQualifier(cell));
                String value = Bytes.toString(CellUtil.cloneValue(cell));
                json.put(family + ":" + qualifier, value);
            }
            list.add(json.toJSONString());
        }
        table.close();
        return list;
    }

    /**
     * 获取数据
     *
     * @return 短信发送规则数据集
     * @throws IOException
     */
    public static List<String> scanData(String tableName, String startRow, String stopRow, String[] families, String[][] qualifiers) throws IOException {
        List<String> list = new ArrayList<String>();
        Table table = getConnection().getTable(TableName.valueOf(tableName));
        Scan scan = new Scan();
        scan.setStartRow(Bytes.toBytes(startRow));
        scan.setStopRow(Bytes.toBytes(stopRow));
        if (families != null) {
            for (int i = 0; i < families.length; i++) {
                for (int j = 0; j < qualifiers[i].length; j++) {
                    scan.addColumn(Bytes.toBytes(families[i]), Bytes.toBytes(qualifiers[i][j]));
                }
            }
        }
        ResultScanner resultScanner = table.getScanner(scan);
        StringBuilder stringBuilder = new StringBuilder();
        for (Result result : resultScanner) {
            stringBuilder.delete(0, stringBuilder.length());
            stringBuilder.append(Bytes.toString(result.getRow()));
            if (families != null) {
                for (int i = 0; i < families.length; i++) {
                    for (int j = 0; j < qualifiers[i].length; j++) {
                        stringBuilder.append("|").append(
                                Bytes.toString(result.getValue(
                                        Bytes.toBytes(families[i]), Bytes.toBytes(qualifiers[i][j])
                                        )
                                )
                        );
                    }
                }
            }
            list.add(stringBuilder.toString());
        }
        table.close();
        return list;
    }
}

```



# hbase 工具类测试

## 插入部分数据
```Java

public class AlertUserDataMake {
    public static void main(String[] args) throws IOException {
        Connection conn = HBaseUtils.getConnection();

        long start = System.currentTimeMillis();
        HBaseUtils.deleteTable("alertUserInfo");
        HBaseUtils.createTable("alertUserInfo", new String[]{"info"});
        String rowKey = "000007_6FBDA0F77EEF7A7D19622059F9387E74";
        Table table = conn.getTable(TableName.valueOf("alertUserInfo"));
        List<Put> putList = new ArrayList<Put>();
        putList.add(
                new Put(Bytes.toBytes(rowKey))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("province"), Bytes.toBytes("贵州"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("city"), Bytes.toBytes("六盘水"))
        );
        table.put(putList);
        long end = System.currentTimeMillis();
        System.out.println(end - start);
    }
}


```
## 插入大量数据
```java

```批量插入demo
public class AlertHBaseMake {
    public static void main(String[] args) throws IOException {
        Connection conn = HBaseUtils.getConnection();

        long start = System.currentTimeMillis();
        HBaseUtils.deleteTable("alertInfo");
        HBaseUtils.createTable("alertInfo", new String[]{"info"});
        String minute1 = DateTimeUtils.getTimeByAddMinute(0);
        String minute2 = DateTimeUtils.getTimeByAddMinute(1);
        Table table = conn.getTable(TableName.valueOf("alertInfo") );
        List<Put> putList = new ArrayList<Put>();
        putList.add(
                new Put(Bytes.toBytes(minute1))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("taskcode"), Bytes.toBytes("000001"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("cir_lng"), Bytes.toBytes("105.965478"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("cir_lat"), Bytes.toBytes("25.994262"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("r"), Bytes.toBytes("20"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("start_time"), Bytes.toBytes("2017-06-16 00:00"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("end_time"), Bytes.toBytes("2017-06-17 00:00"))
        );
        putList.add(
                new Put(Bytes.toBytes(minute2))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("taskcode"), Bytes.toBytes("000002"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("cir_lng"), Bytes.toBytes("105.965478"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("cir_lat"), Bytes.toBytes("25.994262"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("r"), Bytes.toBytes("20"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("start_time"), Bytes.toBytes("2017-06-16 00:00"))
                        .addColumn(Bytes.toBytes("info"), Bytes.toBytes("end_time"), Bytes.toBytes("2017-06-17 00:00"))
        );
        table.put(putList);
        long end = System.currentTimeMillis();
        System.out.println(end - start);
    }
}
```
