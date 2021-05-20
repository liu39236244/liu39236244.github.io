# win下java 使用cmd 命令形式备份mysql


## json配置文件，然后备份指定数据库


```json
[
  {
    "ifBack": true,
    "ip": "ip",
    "port": "3306",
    "user": "username",
    "password": "pwd",
    "dbname": "数据库名",
    "savefile-windows": "E:\\路径\\路径",
    "savefile-linux": "/home/**/**",
    "dbtype": "MySql",
    "ignoredTable": [""]
  },
  {
    "ifBack": true,
    "ip": "ip",
    "port": "3306",
    "user": "username",
    "password": "pwd",
    "dbname": "数据库名",
    "savefile-windows": "E:\\路径\\路径",
    "savefile-linux": "/home/**/**",
    "dbtype": "MySql",
    "ignoredTable": [""]
  }
]





```


```java

//   InputStream is=new ClassPathResource("databackupInfo.json").getInputStream();
//   dataBackupJsonArray = readJsonFile(is);


//  JSONObject jsonObject = dataBackupJsonArray.getJSONObject(i);

private String bakUpDatabaseInWinMySql(JSONObject jsonObject) {
        InputStream in=null;
        Process process=null;
        try {
            //1.拼接备份cmd命令字符串,如果备份存储路径不存在则创建   文件名为数据库名_时间戳
            SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
            String savefileReal="";
            File fIle = new File(jsonObject.getString("savefile"));
            if(!fIle.exists()){
                fIle.mkdirs();
            }
            StringBuffer cmd = new StringBuffer("cmd /c mysqldump -h ");
            cmd.append(jsonObject.getString("ip")+" -P ");
            cmd.append(jsonObject.getString("port")+" -u");
            cmd.append(jsonObject.getString("user")+" -p");
            cmd.append(jsonObject.getString("password")+" ");
            cmd.append(jsonObject.getString("dbname")+" ");
            if(!StringUtils.isEmpty(jsonObject.getString("ignoredTable"))){
                String[] ignoredTables = jsonObject.getString("ignoredTable").split(",");
                for(String ignoredTable:ignoredTables){
                    cmd.append(" --ignore-table="+jsonObject.getString("dbname")+"."+ignoredTable+" ");
                }
            }
            cmd.append (" > ");
            savefileReal=jsonObject.getString("savefile")+"\\"+jsonObject.getString("dbname")+"_"+sdf.format(new Date()) +".sql";
            cmd.append(savefileReal);
            //2.执行cmd
            //执行备份命令
              process = Runtime.getRuntime().exec(cmd.toString());
              in = process.getInputStream();
            while (in.read() != -1) {
                System.out.println(in.read());
            }
            return savefileReal;
        }catch (Exception e){
           e.printStackTrace();
            return "";
        }finally {
           try{
               if(in!=null){
                   in.close();
               }
               if(process!=null){
                   process.waitFor();
               }
           }catch (Exception e){
               e.printStackTrace();
           }
        }
    }
```