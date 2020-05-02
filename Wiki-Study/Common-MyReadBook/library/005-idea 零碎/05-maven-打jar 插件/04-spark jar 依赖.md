# spark jar包解决依赖

## spark jar 包依解决三种方案

```
https://blog.csdn.net/wzq294328238/article/details/48054525

```


## sparkcontext 加载jar 包

```
if(jssc == null){
			jssc = new JavaStreamingContext(conf, Durations.seconds(120));
			String userdir = System.getProperty("user.dir");
			// 这里user.dir 记录的是本项目运行的目录，吧本项目运行的jar包都给提上去
			jssc.sparkContext().addJar(userdir+"/lib/streaming-1.0.jar");
		}
```
