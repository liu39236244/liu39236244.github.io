# el-table 设置点击行内事件


## 地址

[官网案例：](https://element.faas.ele.me/#/zh-CN/component/table#table-column-scoped-slot)

## 总结



## 使用案例 01

```vue
<template>
  <div class="boxSizing">
    <!-- <table id="listTableList"></table> -->
    <el-table :data="list" style="width: 100%" height="calc(100% - 20px)"

            @row-click="tableRowClick"
    >
      <el-table-column type="index" label="序号" :index="indexMethod" width="60" align="center"></el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        label="设备类别"
        prop="airType"
        min-width="80"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.airType==='1'" style="color: green">空气站</span>
          <span v-else-if="scope.row.airType==='2'" style="color: blue">排口</span>
          <span v-else >位置设备类别</span>
        </template>

      </el-table-column>
      <el-table-column
        :prop="item.field"
        :label="item.title"
        align="center"
        :width="item.width"
        :min-width="item.minWidth"
        v-for="(item,i) in columns"
        :formatter="item.formatter"
        :key="i"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column header-align="center" align="center" prop="isHandle" width="80" label="处置状态">
        <template slot-scope="scope">
          <div v-if="scope.row.isHandle===1" style="color: green;">已处置</div>
          <div
            v-else
            style="cursor: pointer;margin: 0 5px; color: red;"
            @click.stop="sendSMS(scope.row)"
          >未处置</div>
        </template>
      </el-table-column>

     一下是额外加的按钮

     <el-table-column prop="id" label="操作" width="60" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                  title="处理"
                  type="text"
                  v-if="scope.row.ishandle=='0'"
                  size="small"
                  icon="el-icon-circle-check"
                  @click="tableRowClick(scope.row)"  // @click.native.stop="tableRowClick(scope.row)" 放置事件冒泡可以这么写
                  
                ></el-button>
                <el-button
                  title="处置详情"
                  type="text"
                  v-if="scope.row.ishandle=='1'"
                  size="small"
                  icon="el-icon-search"
                  @click="tableRowClick(scope.row)"
                ></el-button>
              </template>
            </el-table-column>

    </el-table>
    <page
      style="position:absolute;bottom:10px;right:20px;"
      @changePage="changePage"
      :page="dataPage"
      :tranTotal="dataPage.total"
    ></page>
  </div>
</template>
```


```js



import airAlarmShortMsg from "@/components/homegove/alarmShortMessage/airAlarmShortMsg.vue";

import page from "@/components/common/page.vue";
export default {
  props: {
    beforeUpload: Function, // eslint-disable-line
    onSuccess: Function, // eslint-disable-line
  },
  data() {
    const that = this
    return {
      baseUrl: localStorage.getItem("url"),
      columns: [
        // {
        //   field: "index",
        //   title: "序号",
        //   align: "center",
        //   width: 60,
        //   formatter: (row, column, cellValue, index) => {
        //     return (that.dataPage.pageSize * (that.dataPage.currentPage - 1)) + index + 1
        //   },
        // },
        {
          field: "stationName",
          title: "设备名称",
          align: "center",
        },
        {
          field: "alarmDescription",
          title: "预警内容",
          align: "center",
        },
        {
          field: "alarmLevel",
          title: "预警类型",
          align: "center",
        },
        {
          field: "createTimeStr",
          title: "报警时间",
          align: "center",
        },
        {
          field: "linkman",
          title: "联系人",
          align: "center",
        },
        {
          field: "phone",
          title: "联系电话",
          align: "center",
        },
      ],
      dataPage: {
        total: 0, //总条数
        currentPage: 1, //当前页
        pageSizes: [5, 10, 20, 30], //每页可选的显示条数列表
        pageSize: 20, //当前每页显示的条数
      },
      list: [],
    };
  },
  mounted() {
    this.initGrid(1);
  },
  components: {
    page,
  },
  //注册事件
  methods: {
    indexMethod(index) {
      return  this.dataPage.pageSize * (this.dataPage.currentPage - 1) + 1 + index;
    },
    changePage(currentPage, pageSize) {
      //改变了页码
      this.dataPage.currentPage = currentPage;
      this.dataPage.pageSize = pageSize;
      this.getShortByParentId(this.dataPage.currentPage);
    },
    retrieve: function () {
      this.initGrid(1);
    },
    initGrid: function (pageNo, pageSize) {
      if (pageSize) {
        this.dataPage.pageSize = pageSize;
      }
      this.dataPage.currentPage = pageNo;
      this.getShortByParentId(pageNo);
    },
    //赋值
    getShortByParentId: function (pageNo) {
      this.no = (pageNo - 1) * this.dataPage.pageSize;
      this.axios.post(this.baseUrl + "/synthesize/airAlarm/getAirAlarmByParams",
        {
          limit: this.dataPage.pageSize,
          page: this.dataPage.currentPage
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          showLoading: false,
        })
        .then((res) => {
          if (res.data.code == 1) {
            this.dataPage.total  = res.data.data.total
            this.list  = res.data.data.rows.map(item=>{
              item['airTypeName'] = item['airType'] == '1' ? '空气站' : '排口'
              // 时间处理
              // item['createTimeStr'] =  this.dateFormat("YYYY-mm-dd HH:MM:SS",new Date(item['createTime']) );
              // item['isHandleName'] = item['isHandle'] == '0' ? '未处理' : '已处理'
              return item;
            })
            console.log('列表数据',this.dataList)
          }
        })
    },
    // 表格行点击
     tableRowClick(row, event, column) {
        //点击行
        if (event) {
          this.$refs.olmap.locateToMapWithID(row.id)
        } else {
          if(row.ishandle=='0'){

          }
        }
     },
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },

    //发送短信
    sendSMS(rowData) {
      this.$layer.iframe({
        title: "发送短信",
        content: {
          content: airAlarmShortMsg, //传递的组件对象
          parent: this, //当前的vue对象
          data: {
            itemData: JSON.stringify(rowData), // 深拷贝
          },
        },
        area: ["720px", "350px"],
        shadeClose: false, // 点击遮罩是否关闭
      });
    },


  },
};

```

> 1. 使用到的Page 组件代码

```vue
<template>
  <el-pagination
    small
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :pager-count="5"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
  ></el-pagination>
</template>

<script>
export default {
  props: ["page", "tranTotal"],
  data() {
    return {
      total: 0,
      currentPage: 0, //当前页
      pageSizes: [], //每页显示的条数列表
      pageSize: 0, //当前页面显示的条数
    };
  },
  created() {
    this.total = this.page.total;
    this.currentPage = this.page.currentPage;
    this.pageSizes = this.page.pageSizes;
    this.pageSize = this.page.pageSize;
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val;
      this.$emit("changePage", this.currentPage, this.pageSize);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.$emit("changePage", this.currentPage, this.pageSize);
    },
  },
  watch: {
    tranTotal(newV) {
      this.total = newV;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
```