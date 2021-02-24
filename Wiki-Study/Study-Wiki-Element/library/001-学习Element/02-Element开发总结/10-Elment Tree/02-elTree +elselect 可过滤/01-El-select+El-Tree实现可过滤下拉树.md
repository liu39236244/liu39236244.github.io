# 可过滤下拉树

```js
<el-select v-model="workplaceStr" placeholder="接收对象"  @remove-tag="removeTag" filterable
                                       :filter-method="selectfilter"
                                       :disabled="setDisabled">
                                <el-option :value="workplace.id" :label="workplace.name"
                                           style="height:200px;overflow: auto;background-color:#fff">
                                    <el-tree

                                            :data="treeData"
                                            :props="defaultProps"
                                            multiple
                                            node-key="id"
                                            show-checkbox
                                            :check-strictly="false"
                                            :default-checked-keys="workplaceStr"
                                            @check-change="handleNodeClick"
                                            :filter-node-method="filterNode"
                                            ref="departTree"
                                    ></el-tree>
                                </el-option>
                            </el-select>


```

```js
// 对应变量

workplaceStr: [],//多选框名称数组
        workplace: {
          id: "",
          name: []

        },

// 部门下拉树过滤

departFilterText: ""
// 树组件配置
 defaultProps: {
          children: "nodes",
          label: "text"
        },

```


对应方法



```js
//el select过滤中填写的文字
selectfilter(val) {
        this.departFilterText = val;

      },


watch: {
      departFilterText(val) {
        this.$refs.departTree.filter(val.trim())
      },
    }


handleNodeClick(data, checked, node) {
        let { id } = data;
        let index = this.checked.indexOf(id);
        // 当前节点不在this.checked中,且当前节点为选中状态
        if (index < 0 && this.checked.length && checked) {
          this.$message.warning("只能选中一个节点");
          this.$refs.departTree.setChecked(data, false); // 取消当前节点的选中状态
          return;
        }
        // 当前节点在this.checked中,当前节点为未选中状态(主动去掉当前选中状态)
        if (!checked && index >= 0 && this.checked.length) {
          this.checked = [];
          this.workplaceStr = [];
          this.datareport.enterpriseId = "";
          return;
        }
        // 当前节点不在this.checked(长度为0)中,当前节点为选中状态,this.checked中存储当前节点id
        if (index < 0 && !this.checked.length && checked) {
          if (id != "qyid" && id != "zfid") {
            this.checked.push(id);
            let arrLabel = [];
            arrLabel.push(data.text);//获取名称
            var dataid = data.id;
            this.workplaceStr = arrLabel;
            this.datareport.enterpriseId = dataid;
          }
        }


//	      		let res = this.$refs.departTree.getCheckedNodes(false, false); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
//			      let arrLabel = [];
//			      let arr = [];
//			      var idString = "";
//			      res.forEach(item => {
//			      	if(item.id != "zfid" && item.id != "qyid"){
//			      		arrLabel.push(item.text);//获取名称
//			      		arr.push(item.id);
//			        	idString = idString+item.id+",";
//			      	}
//			      });
//			      this.workplaceStr = arrLabel;
//			      if(idString.length>0){
//			      	idString = idString.substring(0, idString.length-1);
//			      }
//			      this.datareport.enterpriseId = idString;
      },
```