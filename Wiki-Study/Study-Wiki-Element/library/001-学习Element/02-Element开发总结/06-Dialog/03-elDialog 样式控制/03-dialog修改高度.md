# 控制dialog高度


之前写了个如何修改表单样式，今天用到了dialog，一个页面有5个的dialog，高度不一样，怎么修改？
简单，给dialog加个id 修改时候你懂得：

```html
<el-dialog title="合同完成" id="achieve_dialog" center :visible.sync="achieve_dialog" width="600px"></el-dialog>

<style>
#history_dialog .el-dialog__body{
  height:360px;
}
#acceptance_dialog .el-dialog__body{
  height:300px;
}
#achieve_dialog .el-dialog__body{
  height:200px;
}
</style>

```