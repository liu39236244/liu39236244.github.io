# 



insert语句


```sql
public class GenInsertSql {
    private static Connection conn =null;
    private static Statement sm=null;
    private static String schema="dbo";//模式名
    private static String select="SELECT * FROM";//查询sql（针对一个表的时候，可以将*换成相应的列名）
    private static String where="WHERE 1=1 ";//where子句（慎用，最好针对一个表的时候用，注意修改createSQL方法）
    private static String insert="INSERT INTO";//插入sql
    private static String values="VALUES";//values关键字
    private static List <String> insertList=new ArrayList <String>();//全局insertsql文件的数据
    //存储路径
    private static String sqlfilePath ="D:/platform/new/backinsertsql/";//绝对路径，还未到最后一层
    private static String xmname = "xxx";// 哪个项目
    private static Boolean isOneFile = false;     //是否写到一个文件中取，如果为true，将写到filePath中，否则写到singleFilePath+表名中
    private static String filePath = sqlfilePath+xmname+"/1.txt";  
    private static String singleFilePath = sqlfilePath+xmname;
    //备份哪些表
    private static String [] table={"BA_CK_KCPD","SA_RY_GROUP"};//table数组 ，后期可以修改成list
    // 数据库连
    private static final String URL = "jdbc:jtds:sqlserver://11.11.11.11:1433;databaseName=xxx";
    private static final String NAME = "sa";
    private static final String PASS = "111111";
    private static final String DRIVER = "net.sourceforge.jtds.jdbc.Driver";
    
    /**
    * 导出数据库表
    * @param args
    * @throws SQLException
    */
    //所有sql写到一个文件中
    private static void createFile() {
          File file= new File( filePath );
            if (!file.exists()){
              try {
                 file.createNewFile();
              } catch (IOException e) {
                 System. out .println( " 创建文件名失败！！ " );
                  e.printStackTrace();
              }
            }
            FileWriter fw= null ;
            BufferedWriter bw= null ;
            try {
              fw = new FileWriter(file);
              bw = new BufferedWriter(fw);
              if ( insertList .size()>0){
                for ( int i=0;i< insertList .size();i++){
                  bw.append( insertList .get(i));
                  bw.append( "\n" );
                  }
              }
            } catch (IOException e) {
                e.printStackTrace();
              } finally {
                try {
                  bw.close();
                  fw.close();
                } catch (IOException e) {
                  e.printStackTrace();
              }
            }
        }
    //sql分别写到对应表名的文件中
    private static void createFile(String filename,List <String> insertSqls) {
        File file= new File( singleFilePath+"/"+filename+".txt" );
          if (!file.exists()){
            try {
               file.createNewFile();
            } catch (IOException e) {
               System. out .println( " 创建文件名失败！！ " );
                e.printStackTrace();
            }
          }
          FileWriter fw= null ;
          BufferedWriter bw= null ;
          try {
            fw = new FileWriter(file);
            bw = new BufferedWriter(fw);
            if ( insertSqls .size()>0){
              for ( int i=0;i< insertSqls .size();i++){
                bw.append( insertSqls .get(i));
                bw.append( "\n" );
                }
            }
            insertList.clear();
          } catch (IOException e) {
              e.printStackTrace();
            } finally {
              try {
                bw.close();
                fw.close();
              } catch (IOException e) {
                e.printStackTrace();
            }
          }
      }
    /**
    * 拼装查询语句
    * @return 返回select 集合
    */
    private static List<String> createSQL() {
        List<String> listSQL= new ArrayList<String>();
        for ( int i=0;i< table . length ;i++){
            StringBuffer sb= new StringBuffer();
            sb.append( select ).append( " " ).append( schema ).append( "." ).append( table [i])   ; // .append( " " ).append(where)
            listSQL.add(sb.toString());
        }
        return listSQL;
    }
    
    /**
    * 连接数据库创建statement 对象
    * @param driver
    * @param url
    * @param UserName
    * @param Password
    */
    public static void connectSQL(String driver,String url,String UserName,String Password){
        try {
          Class. forName (driver).newInstance();
          conn = DriverManager. getConnection (url, UserName, Password);
          sm=conn .createStatement();
        } catch (Exception e){
         e.printStackTrace();
        }
      }
    
    /**
    * 执行sql 并返回插入sql
    * @param conn
    * @param sm
    * @param listSQL
    * @throws SQLException
    */
    @SuppressWarnings({ "unused", "rawtypes" })
    public static void executeSQL(Connection conn,Statement sm,List listSQL)throws SQLException{
        List<String> insertSQL= new ArrayList<String>();
        ResultSet rs= null ;
        try {
          rs = getColumnNameAndColumeValue (sm, listSQL, rs);
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            rs.close();
            sm.close();
            conn.close();
        }
      }
    
    /**
    * 获取列名和列值
    * @param sm
    * @param listSQL
    * @param rs
    * @return
    * @throws SQLException
    */
    @SuppressWarnings("rawtypes")
    private static ResultSet getColumnNameAndColumeValue(Statement sm,List listSQL, ResultSet rs) throws SQLException {
        for (int j = 0; j < listSQL.size(); j++) {
            String sql = String.valueOf(listSQL.get(j));
            rs = sm.executeQuery(sql);
            ResultSetMetaData rsmd = rs.getMetaData();
            int columnCount = rsmd.getColumnCount();
            while (rs.next()) {
                StringBuffer ColumnName = new StringBuffer();
                StringBuffer ColumnValue = new StringBuffer();
                for (int i = 1; i <= columnCount; i++) {
                    String value = rs.getString(i);
                    if (i == columnCount) {
                        ColumnName.append(rsmd.getColumnName(i));
                        if (Types.CHAR == rsmd.getColumnType(i) || Types.VARCHAR == rsmd.getColumnType(i)
                                || Types.LONGVARCHAR == rsmd.getColumnType(i)) {
                            if (value == null) {
                                ColumnValue.append("null");
                            } else {
                                ColumnValue.append("'").append(value).append("'");
                            }
                        } else if (Types.SMALLINT == rsmd.getColumnType(i) || Types.INTEGER == rsmd.getColumnType(i)
                                || Types.BIGINT == rsmd.getColumnType(i) || Types.FLOAT == rsmd.getColumnType(i)
                                || Types.DOUBLE == rsmd.getColumnType(i) || Types.NUMERIC == rsmd.getColumnType(i)
                                || Types.DECIMAL == rsmd.getColumnType(i)) {
                            if (value == null) {
                                ColumnValue.append("null");
                            } else {
                                ColumnValue.append(value);
                            }
                        } else if (Types.DATE == rsmd.getColumnType(i) || Types.TIME == rsmd.getColumnType(i)
                                || Types.TIMESTAMP == rsmd.getColumnType(i)) {
                            if (value == null) {
                                ColumnValue.append("null");
                            } else {
                            //    ColumnValue.append("timestamp'").append(value).append("'");  //对于mysql可能需要timestamp，未测试
                                ColumnValue.append("'").append(value).append("'");  //对于sqlserver来说去掉timestamp
                            }
                        } else {
                            if (value == null) {
                                ColumnValue.append("null");
                            } else {
                                ColumnValue.append(value);
                            }
                        }
                    } else {
                        ColumnName.append(rsmd.getColumnName(i) + ",");
                        if (Types.CHAR == rsmd.getColumnType(i) || Types.VARCHAR == rsmd.getColumnType(i)
                                || Types.LONGVARCHAR == rsmd.getColumnType(i)) {
                            if (value == null) {
                                ColumnValue.append("null,");
                            } else {
                                ColumnValue.append("'").append(value).append("',");
                            }
                        } else if (Types.SMALLINT == rsmd.getColumnType(i) || Types.INTEGER == rsmd.getColumnType(i)
                                || Types.BIGINT == rsmd.getColumnType(i) || Types.FLOAT == rsmd.getColumnType(i)
                                || Types.DOUBLE == rsmd.getColumnType(i) || Types.NUMERIC == rsmd.getColumnType(i)
                                || Types.DECIMAL == rsmd.getColumnType(i)) {
                            if (value == null) {
                                ColumnValue.append("null,");
                            } else {
                                ColumnValue.append(value).append(",");
                            }
                        } else if (Types.DATE == rsmd.getColumnType(i) || Types.TIME == rsmd.getColumnType(i)
                                || Types.TIMESTAMP == rsmd.getColumnType(i)) {
                            if (value == null) {
                                ColumnValue.append("null,");
                            } else {
//                              ColumnValue.append("timestamp'").append(value).append("',");  //对于mysql可能需要timestamp，未测试
                                ColumnValue.append("'").append(value).append("',");  //对于sqlserver来说去掉timestamp
                            }
                        } else {
                            if (value == null) {
                                ColumnValue.append("null,");
                            } else {
                                ColumnValue.append(value).append(",");
                            }
                        }
                    }
                }
                insertSQL( ColumnName, ColumnValue,j,rs.isLast());//j表示当前正在处理的表的顺序
            }
        }
        return rs;
    }
    
    /**
    * 拼装insertsql 放到全局list 里面
    * @param ColumnName
    * @param ColumnValue
    */
    private static void insertSQL(StringBuffer ColumnName,StringBuffer ColumnValue,int order,Boolean isLast) {
        StringBuffer insertSQL= new StringBuffer();
        insertSQL.append( insert ).append( " " ).append( schema ).append( "." )
        .append( table [order]).append( " (" ).append(ColumnName.toString())
        .append( ") " ).append( values ).append( " (" ).append(ColumnValue.toString()).append( ");" );
        
        if(isOneFile){
            insertList .add(insertSQL.toString());
            if(order ==table.length -1 ) createFile();   //最后一个表完成时，创建文件
        }else {
            insertList .add(insertSQL.toString());
            if(isLast){
                createFile(table [order],insertList);
            }
        }
    }
    //入口
    public static void executeSelectSQLFile() throws Exception {
        List<String> listSQL= new ArrayList<String>();
        connectSQL ( DRIVER , URL , NAME ,PASS ); // 连接数据库
        listSQL= createSQL (); // 创建查询语句
        executeSQL ( conn , sm,listSQL); // 执行sql 并拼装
        
        System.out.println("^^^^^^^^^^^^^^^^^^^^^^创建完毕！");
    }

    public static void main(String[] args) throws Exception {
        executeSelectSQLFile();
    }

}
```