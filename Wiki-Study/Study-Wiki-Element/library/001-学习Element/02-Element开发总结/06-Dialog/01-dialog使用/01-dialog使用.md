# El-Dialog 使用


## dialog 使用


## dialog 功能点


 :modal="false" 修改不让显示遮罩
  append-to-body 属性控制遮罩展示到弹窗后面

 <el-dialog
              :visible.sync="showDirNameFlag "
              width="20%"
              top="20%"
              :modal="false"
              append-to-body
              v-if="showDirNameFlag" title="新建目录" >