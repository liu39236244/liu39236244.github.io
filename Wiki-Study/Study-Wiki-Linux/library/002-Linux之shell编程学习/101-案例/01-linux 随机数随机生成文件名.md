# 随机数的使用

## 生成随机字符


> 随机字符命令

```sh
[root@lzkj01 2021-03-07-study]# openssl rand -base64 10
aSrQnRseKvZFmA==
[root@lzkj01 2021-03-07-study]# openssl rand -base64 10
zt4105RvTHTTeg==
[root@lzkj01 2021-03-07-study]# openssl rand -base64 10
J86RAYw1LuPKWw==
[root@lzkj01 2021-03-07-study]# 

```


## 随机生成字母数字组合的文件

> 命令解析：

    | tr -dc '[:alnum:]' 

-dc  : c 是补集，alnum 是字母数字，c 是字母和数字之外的 ， d 意思就是删掉 字母数字通过c 命令补集得到的字符


大写转化为小写

    |tr '[:upper:]' '[:lower:]'`


> 3 补全后缀.log

    touch `openssl rand -base64 10 | tr -dc '[:alnum:]' |tr '[:upper:]' '[:lower:]'`.log


```sh
[root@lzkj01 2021-03-07-study]# touch `openssl rand -base64 10 | tr -dc '[:alnum:]' |tr '[:upper:]' '[:lower:]'`
[root@lzkj01 2021-03-07-study]# ll
总用量 0
-rw-r--r-- 1 root root 0 3月   7 21:44 wtyyjixh4cjdcg
[root@lzkj01 2021-03-07-study]# touch `openssl rand -base64 10 | tr -dc '[:alnum:]' |tr '[:upper:]' '[:lower:]'`.log
[root@lzkj01 2021-03-07-study]# ll
总用量 0
-rw-r--r-- 1 root root 0 3月   7 21:48 nmd51qbago7psq.log
```

