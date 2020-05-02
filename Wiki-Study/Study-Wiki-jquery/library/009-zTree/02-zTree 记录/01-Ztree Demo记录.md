# zTree Demo记录


# ZTree 单选的两种实现方式

## Demo案例

```java
var setting = {
 
        ......
 
        check: { //表示tree的节点在点击时的相关设置
            enable: true, //是否显示radio/checkbox
            autoCheckTrigger: false,
            chkStyle: "checkbox",//值为checkbox或者radio表示
            chkboxType: {"Y": "", "N": ""}//表示父子节点的联动效果,这里设置不联动
        },
 
        callback: {
            onCheck: zTreeOnCheck,//勾选事件回调函数
            onClick: zTreeOnClick,//点击事件回调函数
            onAsyncSuccess: ztreeOnAsyncSuccess,//异步加载成功后执行的方法
        }
 
        ......
    };
 
 
function zTreeOnCheck(event, treeId, treeNode) {
        if(treeNode.checked){    //注意，这里的树节点的checked状态表示勾选之后的状态
            treeObj.checkAllNodes(false);//取消所有节点的选中状态
            treeObj.checkNode(treeNode,true,false,false);重新选中被勾选的节点
        }
}

```


## 参考文章

### 两种实现方式


[地址](https://blog.csdn.net/junxiao_chen/article/details/83081825)
