# 使用点记录


## el 修改行内字段值的颜色

* 早期版本

 <template scope="scope">

```html
 <el-table-column
              :show-overflow-tooltip="true"
              label="设备状态"
              prop="onlineState"
              min-width="150"
              align="center"
            >
              <template scope="scope">
                <span v-if="scope.row.onlineState==='在线'" style="color: green">{{scope.row.onlineState}}</span>
                <span v-else-if="scope.row.onlineState==='离线'" style="color: red">{{scope.row.onlineState}}</span>
                <span v-else >{{scope.row.onlineState}}</span>
              </template>


            </el-table-column>

```

* vue 2.5 版本之后需要携程 slot-scope
    
    <template slot-scope="scope">

```html
  <el-table-column
              :show-overflow-tooltip="true"
              label="设备状态"
              prop="onlineState"
              min-width="150"
              align="center"
            >

              <template slot-scope="scope">
                <span v-if="scope.row.onlineState==='在线'" style="color: green">{{scope.row.onlineState}}</span>
                <span v-else-if="scope.row.onlineState==='离线'" style="color: red">{{scope.row.onlineState}}</span>
                <span v-else >{{scope.row.onlineState}}</span>
              </template>

            </el-table-column>
```