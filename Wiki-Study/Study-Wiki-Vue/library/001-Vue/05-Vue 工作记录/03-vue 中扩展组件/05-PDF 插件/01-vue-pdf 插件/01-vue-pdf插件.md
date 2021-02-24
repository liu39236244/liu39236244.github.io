
# vue-pdf 插件使用

```js
<el-dialog title="PDF 预览"
                   :visible.sync="viewVisible" width="40%" center  top="10px" bottom="100px"
                   :close-on-click-modal="false"
                   @close='closeDialog'>
            <div style="margin-bottom: 15px; text-align: right">
                <el-button type="primary" size="small" @click.stop="previousPage">
                    上一页
                </el-button>
                <el-button type="primary" size="small" @click.stop="nextPage">
                    下一页
                </el-button>
                <span>当前第{{pdfPage}}页 / 共{{pageCount}}页</span>
            </div>

            <div>
                <pdf
                        :src="src"
                        :page="pdfPage"
                        @num-pages="pageCount = $event"
                        @page-loaded="pdfPage = $event"
                        style="display: inline-block; width: 100% ; height:800px ; overflow-y: auto"
                ></pdf>
            </div>
        </el-dialog>

```



```js
<script>

  import pdf from "vue-pdf";
   export default {

    data() {
      return {
        // pdf 预览
        //PDF预览
        viewVisible: false,
        src: null,
        pdfPage: 1,
        pageCount: 0,
      }
    },

    methods:{
         //PDF改变页数
      previousPage() {
        var p = this.pdfPage;
        p = p > 1 ? p - 1 : this.pageCount;
        this.pdfPage = p;
      },
      nextPage() {
        var p = this.pdfPage;
        p = p < this.pageCount ? p + 1 : 1;
        this.pdfPage = p;
      },
    }  


</script>
```
