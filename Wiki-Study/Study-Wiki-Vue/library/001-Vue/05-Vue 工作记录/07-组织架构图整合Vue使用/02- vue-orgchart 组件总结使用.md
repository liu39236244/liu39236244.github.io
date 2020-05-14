#  vue-orgchart 插件使用


## 总结

官网介绍文档：https://spiritree.github.io/vue-orgchart/#/zh-cn/quickstart


## 使用vue-orgchart 生成组织架构树并且支持导出图片


> 0 参数说明


![参数配置说明](assets/001/05/07/02-1589340912774.png)

> 1 引入vue-orgchart 到 vue 组件中

* 1.1 安装 依赖
```sh
npm install vue-orgchart -S
```

注意：本组件使用到的导出组件需要安装 html2canvas ，如下使用的话直接在vue 中import 就可以了


```sh
npm install html2canvas
```


* 1.2 main.js 中导入对应样式


```js
import 'vue-orgchart/dist/style.min.css'
```


* 1.3 封装了一个组织架构组件，可导出图片


```js
<template>

  <div>

    <!--<button @click="createPicture" class="notify-btn"  type="submit" >导出</button>-->

    <div id="bmtoolbar" >
        <button type="button" class="btn btn-default" @click="createPicture">
          <span class="glyphicon glyphicon-open" aria-hidden="true"></span>导出
        </button>
        <!--<input type="text" id="selected-node" class="selected-node-group new-node" v-model="selectNode">-->
    </div>


    <!--<div id="org-export" class="export-org">-->
    <!--:key="menuKey"-->
    <div id="org-export" class="org-box" >

      <!--<vo-basic  :data="chartData"-->
                 <!--:pan="true"-->
                 <!--:zoom="true"-->
                 <!--:toggleCollapse="false"-->
                 <!--exportButtonName="export"-->
                  <!--:exportButton="false"-->
                 <!--export-filename="testpic"-->
                 <!--direction="l2r"-->
                 <!--:toggleSiblingsResp="true"-->
                 <!--depth="999"-->
      <!--&gt;</vo-basic>-->
      <!--direction="l2r"-->
      <vo-edit
        v-if="show"
        :data="chartData"
                 :pan="true"
                 :zoom="true"
                 :toggleCollapse="false"
                 exportButtonName="export"
                 :exportButton="false"
                 export-filename="testpic"
                direction="t2b"
                 :toggleSiblingsResp="true"

      ></vo-edit>
      <!--<vo-basic :data="chartData" :export-button="true" export-filename="testpic"></vo-basic>-->
    </div>

  </div>

</template>

<script>
  import {VoBasic, VoEdit} from 'vue-orgchart'
  import html2canvas from "html2canvas";
  export default {

    name: "orgFrameworkPhoto",
    components: {VoBasic, VoEdit},
    data() {
      return {
        baseUrl: localStorage.getItem("url"),
        chartData: {},
        show: true,
        // chartData : {
        //   name: 'JavaScript',
        //   children: [
        //     { name: 'Angular' },
        //     {
        //       name: 'React',
        //       children: [{ name: 'Preact' }]
        //     },
        //     {
        //       name: 'Vue',
        //       children: [{ name: 'Moon' }]
        //     }
        //   ]
        // }

        selectNode:""
      };
    },
    created() {
      // 查询出所有的组织部门
      this.axios.get(this.baseUrl + '/user/depart/getDepartTreeByUser', {}).then((res) => {
        if (res.data.code == 1) {
          // console.log(res.data.data,"返回数据")
          let result = this.setAttributeByTreeData(res.data.data, "id", "text", "nodes", "id", "name", "children");
          // console.log("最终数据", result)
          this.$nextTick(()=>{
            this.chartData=result[0]

          })

        }
      });
    },



    methods:{


      refreshNodeOrgPhoto(data) {
        // console.log("输出",data)
        this.show=false
        let result=this.setAttributeByTreeData([data],"id", "text", "nodes", "id", "name", "children");

        this.$nextTick(()=>{
          // this.$set(this.chartData,result[0])
          this.chartData=result[0]
          this.show=true


          // console.log("输出最终",this.chartData)

        })

      },

      // 根据组织树生成对应图所需要节点属性，此方法可以根据树形数据重新给每一个节点添加所需要的节点属性名，
      setAttributeByTreeData(treeData,oldId,oldName,oldChild,newId,newName,newChild) {

        let list = [];
        treeData && treeData.forEach(e=>{
          //e 每个数据
          oldId && e[oldId] && (e[newId]=e[oldId])
          oldName && e[oldName] && (e[newName]=e[oldName]) //
          // newChild && e[newChild] && e[newChild].length && (e[newChild] = [])
          e[newChild] = [];
          e[newChild].push(...this.setAttributeByTreeData(e[oldChild],oldId,oldName,oldChild,newId,newName,newChild))
          list.push(e)
        }

      )
        // console.log(list,"list")
        return list;

      },

      createPicture() {

        // 创建画布
        // var w = document.querySelector("#org-export").scrollWidth;
        // var h = document.querySelector("#org-export").scrollHeight;
        // alert("w,h",w,h)
      //   var w = "800";
      //   var h = "800"
      //   //要将 canvas 的宽高设置成容器宽高的 2 倍
      //   var canvas = document.createElement("canvas");
      //   canvas.width = w * 2;
      //   canvas.height = h * 2;
      //   canvas.style.width = w + "px";
      //   canvas.style.height = h + "px";
      //   var context = canvas.getContext("2d");
      // //然后将画布缩放，将图像放大两倍画到画布上

        let orgChartAllElements=document.body.getElementsByClassName("orgchart") // 获取总的元素
        // console.log("导出是否",!!orgChartAllElements,orgChartAllElements)
        if(!!orgChartAllElements){
          let useOrgElement = {};
          if(orgChartAllElements.length==2){ // 初次加载的时候会有两个元素，但是第一个导出是空的
            useOrgElement = orgChartAllElements[1];
          }else {
            // 只有唯一一个组织架构元素 // 通过点击触发更新的架构树有一个div 取第一个就ok
            useOrgElement = orgChartAllElements[0];
          }
          // html2canvas(document.body.getElementsByClassName("orgchart")[1], { // 导出一片白
          // html2canvas(document.querySelector("#org-export").getElementsByClassName("orgchart")[0], { // 导出一片白
          html2canvas(useOrgElement, {
            backgroundColor: "white"
          }).then(canvas => {
            var imgData = canvas.toDataURL("image/jpeg");
            this.fileDownload(imgData);
          });
        }



      },
      //下载图片
      fileDownload(downloadUrl) {
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = downloadUrl;
        aLink.download = "组织.png";
        // 触发点击-然后移除
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
      }

    },

    watch:{
      selectNode: {
        handler: function() {
          let that = this;
          that.$refs.mychild.initGrid();
          that.$refs.mychild.getHiddendangerLevelCount();
        }
      },
    }




  }
</script>

<style scoped>
  .org-box{
    height:50%;
    width:auto;
  }
  #bmtoolbar {
    text-align: right;
    margin-bottom: 10px;
  }
</style>


```

* 1.4 最终结果图

![最终组织架构树图](assets/001/05/07/02-1589342034591.png)



