-- 导出为 CSV 文件。
INSERT INTO FILES(
'path' = 'file:///home/ubuntu/csvfile/',
'format' = 'csv',
'csv.column_separator' = ',',
'csv.row_delimitor' = '\n'
)
SELECT * FROM sales_records;

-- 导出为 Parquet 文件，并将 Parquet 版本设置为 1.0。
INSERT INTO FILES(
'path' = 'file:///home/ubuntu/parquetfile/',
'format' = 'parquet',
'parquet.version' = '1.0'
)
SELECT * FROM sales_records;

INSERT INTO FILES(
'path' = 'file:///mnt/starrocks_win_backup/parquetfile/36/2024-09/',
'format' = 'parquet',
'parquet.version' = '1.0'
)
SELECT * FROM sales_records;
