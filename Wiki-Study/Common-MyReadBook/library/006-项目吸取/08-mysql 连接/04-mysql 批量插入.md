# mysql 批量插入数据

## 1- mysql 批量插入

### 1-1 mysql 总结

```


```


## 1-2 mysql 批量插入，博主

* 博主地址：https://blog.csdn.net/ws379374000/article/details/80222627

```
private String url = "jdbc:mysql://localhost:3306/test01?rewriteBatchedStatements=true";
    private String user = "root";
    private String password = "123456";
    @Test
    public void Test(){
        Connection conn = null;
        PreparedStatement pstm =null;
        ResultSet rt = null;
        try {
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection(url, user, password);        
            String sql = "INSERT INTO userinfo(uid,uname,uphone,uaddress) VALUES(?,CONCAT('姓名',?),?,?)";
            pstm = conn.prepareStatement(sql);
            conn.setAutoCommit(false);
            Long startTime = System.currentTimeMillis();
            Random rand = new Random();
            int a,b,c,d;
            for (int i = 1; i <= 100000; i++) {
                    pstm.setInt(1, i);
                    pstm.setInt(2, i);
                    a = rand.nextInt(10);
                    b = rand.nextInt(10);
                    c = rand.nextInt(10);
                    d = rand.nextInt(10);
                    pstm.setString(3, "188"+a+"88"+b+c+"66"+d);
                    pstm.setString(4, "xxxxxxxxxx_"+"188"+a+"88"+b+c+"66"+d);
                    pstm.addBatch();
            }
            pstm.executeBatch();
            conn.commit();
            Long endTime = System.currentTimeMillis();
            System.out.println("OK,用时：" + (endTime - startTime));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e);
        }finally{
            if(pstm!=null){
                try {
                    pstm.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                    throw new RuntimeException(e);
                }
            }
            if(conn!=null){
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                    throw new RuntimeException(e);
                }
            }
        }
}

```
