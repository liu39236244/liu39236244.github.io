# Elment Tree 修改源码获取选中节点父节点

## 总结


## 参考

原文地址:https://www.cnblogs.com/qing619/p/8144584.html

Element-ui树形控件el-tree获取父级节点的id
Element-ui官网给的方法

getCheckedKeys() { console.log(this.$refs.tree.getCheckedKeys()); },
这种只有在所有子级都被选中的情况下才能获得父级的id，如果不选中所有的子级那么获取得到的id就只有子级的。但是一般提交数据时后台都需要父级id的。

本人写的时候花费了一上午的时间，最后在找到了一种改源码的方法解决了，贴出来供各位有需要的下伙伴参考。

1.找到node_modules/element-ui/lib/element-ui.common.js文件

2.按Ctrl+F搜索TreeStore.prototype.getCheckedKeys这个方法

3.把if(node.checked)改为if (node.checked||node.indeterminate) 如下图：

![](assets/001/02/10/01/01-1608016859635.png)

4.保存重启项目console.log(this.$refs.tree.getCheckedKeys());这样就可以看到父级和子级的id了