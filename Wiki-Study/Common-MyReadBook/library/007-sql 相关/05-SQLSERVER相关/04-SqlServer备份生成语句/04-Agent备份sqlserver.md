#  Agent备份sqlserver

参考：https://blog.csdn.net/weixin_33709364/article/details/90155715

正文
SQL Server Agent的重点是计划（Schedule）和作业（Job），我们创建作业，然后将作业添加到某一个计划中去，让Agent自动帮我们运行即可。比如我们这里需要实现自动备份数据库的功能。我们新建一个备份数据库的作业，然后将这个作业添加到一个每天晚上11点执行的计划中去，最后把这个计划交个Agent就可以了。

创建作业并将作业添加到计划：
 

在“对象资源管理器”中，连接到 SQL Server 数据库引擎实例，再展开该实例。
展开“SQL Server 代理”，展开“作业”，右键单击要计划的作业，并单击“新建作业”。
输入作业名称：Job-BackupDatabase
在“步骤Setps”框中，单击“插入”，填写步骤名称：step-backdatabase。类型选择:TSQL，脚本如下所示：
DECLARE @strPath NVARCHAR(200)
set @strPath = convert(NVARCHAR(19),getdate(),120)
set @strPath = REPLACE(@strPath, ':' , '.')
set @strPath = 'D:\bak\' + @strPath + '.bak'
BACKUP DATABASE [TSQL2012] TO DISK = @strPath WITH NOINIT , NOUNLOAD , NOSKIP , STATS = 10, NOFORMAT


这样就完成了作业的创建。
注意：此处的D:\bak\是我的路径名称，可以自定义。还有就是这个路径必须得事先创建好，不然执行作业会报错。我们这里需要备份的数据库是TSQL2012，可以根据自己需要备份的数据库来更改。
右键作业Job-BackupDatabase，选择“属性”，在“计划Schedules”标签点击“新建New”，填写计划名称：Schedule-BackupDatabase，对于“计划类型”，选择置重复执行的计划，并完成对话框上的“频率”、“每天频率”和“持续时间”。
完成上述工作以后就就相当于新建了一个计划：Schedule-BackupDatabase，并将作业：Job-BackupDatabase附加到这个计划中去。
如果要测试作业是否正常执行，可以右键选中作业，然后选择“start job at step”。当然也可以通过Agent来测试是否成功。

参考文献1中有详细的截图。