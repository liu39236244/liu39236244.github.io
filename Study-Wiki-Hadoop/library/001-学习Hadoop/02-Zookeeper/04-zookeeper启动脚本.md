# zookeeper 脚本的记录

# zookeeper 启动所有zookeeper 脚本

# 启动zookeeper

## 单个启动
```

```

## ws科技

```sh
#!/bin/bash
# start zookeeper
zookeeperHome=/data/hdfs/zookeeper-3.4.6
zookeeperArr=( "NUC-1" "NUC-2" "NUC-3" )
for znode in ${zookeeperArr[@]}; do
    ssh -p 36928 -q hdfs@$znode "
        export PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin
        source /etc/profile
        $zookeeperHome/bin/zkServer.sh $1
    "
    echo "$znode zookeeper $1 done"
done
```

使用：
sh zookeeper_all_op.sh 一个参数
