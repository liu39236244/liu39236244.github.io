# spark 使用参数所需

## spark读取csv文件
[博主](https://www.cnblogs.com/datablog/p/6127000.html)

```
filepath_or_buffer : str，pathlib。str, pathlib.Path, py._path.local.LocalPath or any object with a read() method (such as a file handle or StringIO)
可以是URL，可用URL类型包括：http, ftp, s3和文件。对于多文件正在准备中
本地文件读取实例：://localhost/path/to/table.csv

sep : str, default ‘,’
指定分隔符。如果不指定参数，则会尝试使用逗号分隔。分隔符长于一个字符并且不是‘\s+’,将使用python的语法分析器。并且忽略数据中的逗号。正则表达式例子：'\r\t'

delimiter : str, default None
定界符，备选分隔符（如果指定该参数，则sep参数失效）

delim_whitespace : boolean, default False.
指定空格(例如’ ‘或者’ ‘)是否作为分隔符使用，等效于设定sep='\s+'。如果这个参数设定为Ture那么delimiter 参数失效。
在新版本0.18.1支持

header : int or list of ints, default ‘infer’
指定行数用来作为列名，数据开始行数。如果文件中没有列名，则默认为0，否则设置为None。如果明确设定header=0 就会替换掉原来存在列名。header参数可以是一个list例如：[0,1,3]，这个list表示将文件中的这些行作为列标题（意味着每一列有多个标题），介于中间的行将被忽略掉（例如本例中的2；本例中的数据1,2,4行将被作为多级标题出现，第3行数据将被丢弃，dataframe的数据从第5行开始。）。
注意：如果skip_blank_lines=True 那么header参数忽略注释行和空行，所以header=0表示第一行数据而不是文件的第一行。

names : array-like, default None
用于结果的列名列表，如果数据文件中没有列标题行，就需要执行header=None。默认列表中不能出现重复，除非设定参数mangle_dupe_cols=True。

index_col : int or sequence or False, default None
用作行索引的列编号或者列名，如果给定一个序列则有多个行索引。
如果文件不规则，行尾有分隔符，则可以设定index_col=False 来是的pandas不适用第一列作为行索引。

usecols : array-like, default None
返回一个数据子集，该列表中的值必须可以对应到文件中的位置（数字可以对应到指定的列）或者是字符传为文件中的列名。例如：usecols有效参数可能是 [0,1,2]或者是 [‘foo’, ‘bar’, ‘baz’]。使用这个参数可以加快加载速度并降低内存消耗。

```
