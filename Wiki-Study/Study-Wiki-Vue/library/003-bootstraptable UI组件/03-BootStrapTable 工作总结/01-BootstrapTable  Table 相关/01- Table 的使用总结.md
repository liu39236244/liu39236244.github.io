# Table 的使用总结


## 介绍


## 用法总结

## 案例 


## 修改table 的title 长度以及换行

* 这里给出 扩展宽度以及换行; 处理这块的时候搜了不少说明，但是都用这感觉比较麻烦，这种的感觉比较实用， 主要是 "</br>" 标签 , 以及空格思维填充title的宽度使得 内容列宽度增加

效果图

![](assets/003/03/01/01-1590721839777.png)


```
<template> 
<div>
    <table  id="hbTable"></table>
    <page :total="total" :pageSize="pageSize" @navpage="initGrid"></page>
</div>

</template>
```

```js
<script>
data(){
    return {

        columns:[
            {
            field: 'createtime',
            title: ' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 时间  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;',
            align: 'center',
            formatter: function(value, row, index) {
              if (value != null) {
                return value.slice(0, 19).replace('T', ' ') // 这个不用在意只是做了处理
              } else {
                return "";
              }
            }
          },
          {
            field: 'a1',
            title: '超长标题 需要换行</br> 换行后面内容',
            align: 'center',
            vlign: "center",
            formatter: function(value, row, index) {
              // console.log("打印a1上下线",this.equipAllExplainData.a1.min,this.equipAllExplainData.a1.max)
              if (value != null &&  (parseFloat(value) <= parseFloat(row.a1Lower) || parseFloat(value) >= parseFloat(row.a1Upper) )) {
                var ans = '' ;
                ans = "<div style='text-align: center;color: red'>" +value + "</div>";
                // row.iswarning=1
                return ans;
              }else{
                return value
              }
            }
          },
        ]
    }
},

methods:{

    initData(){
        $('#hbTable').bootstrapTable("destroy").bootstrapTable({
              pagination: false,
              toolbar: '#bmtoolbar',//工具按钮用哪个容器
              data: res.data.data.rows,// 直接传值给Data
              totalRows: res.data.data.total,
              uniqueId: "id",
              pageNumber: 0, //初始化加载第一页，默认第一页
              pageSize: this.pageSize,  //每页的记录行数（*）
              height: 252,//$(".content").height() - 320,
              columns: this.columns,
              sortable: true,
              striped: true
            });


    }
}
 </script>
```