
# vue 随心所欲调整el-dialog中body的样式

* 参考原文：https://blog.csdn.net/qq_43258500/article/details/106274243
```js
<el-dialog
      :visible.sync="dialogVisible"
      width="30%"
      class="dialogClass"//设置弹框样式
      :showClose="showClo"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <b>系统提示</b>
      </div>
      <el-row>
        <el-col :span="2">
          <svg-icon icon-class="warning" style="height:3em;weight:8em" class="iconClass" />
        </el-col>
        <el-col :span="22" style="padding-top:12px">
          <span style="font-size:16px;">
            当前设备编码与设备型号不符，请检查！
          </span>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button style="margin-left:7%"
          type="primary"
          plain
          @click="dialogVisible = false;"
        >确认</el-button>
      </span>
    </el-dialog>
```


```css
.dialogClass .el-dialog__body {
  padding: 20px;
  padding-top: 0px;
  padding-bottom: 0px;
  margin-left: 20px;
  color: #606266;
  font-size: 14px;
}
.dialogClass .el-dialog__footer {
  text-align: right;
}
```