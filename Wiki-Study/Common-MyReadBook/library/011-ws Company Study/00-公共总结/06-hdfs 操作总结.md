# hdfs java api 操作总结

## 获取集群数据

```
是可以直接写路径地址的:
JavaRDD<String> msgLists = SparkInitMgr.jssc.sparkContext().wholeTextFiles("hdfs://hacluster/路径/20180226*",250) // 最小分区是250 各分分区

```


## 文件的写入hdfs

```Java
// target 的文件路径
String target = remotepath + fileName.substring(0, fileName.length()-4) + ".tmp";
			logger.warn("target " + target);

			Configuration config = new Configuration();
			fs = FileSystem.newInstance(URI.create(target), config);
			os = fs.create(new Path(target)); //打开创建目标文件

			osWeiter = new OutputStreamWriter(os, charsetName);
			bw = new BufferedWriter(osWeiter);
			int num = 0;

			for (Tuple2<String, String> tuple2: results) {
				String line = tuple2._1+"|"+tuple2._2 + SpliterFlag.NEWLINEFLAG;  //  \n 为换行符
				bw.write(line);
				num++;
				if (num >= 500) {
					bw.flush();
					num = 0;
				}
			}
			bw.flush();

      关闭资源顺序

      bw != null) {
      				try {
      					bw.close();
      					bw = null;
      				} catch (IOException e) {
      					e.printStackTrace();
      				}
      			}
      			if (osWeiter != null) {
      				try {
      					osWeiter.close();
      					osWeiter = null;
      				} catch (IOException e) {
      					e.printStackTrace();
      				}
      			}
      			if (os != null) {
      				try {
      					os.close();
      					os = null;
      				} catch (IOException e) {
      					e.printStackTrace();
      				}
      			}

      			if (fs != null) {
      				try {
      					fs.close();
      					fs = null;
      				} catch (IOException e) {
      					e.printStackTrace();
      				}
      			}
```
