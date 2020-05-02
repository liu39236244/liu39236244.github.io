# Element 验证控件的总结

## 表单验证element 组件简单介绍



## element 表单验证控件总结


### 参考博主



### 我的总结


#### 案例1

* 博主原文：



* 控制 element 的输入框：https://www.cnblogs.com/yingzi1028/p/6843313.html
* 自定义验证：https://www.jianshu.com/p/93c5cd5f3226

```html
<el-dialog title="新增学生" :visible.sync="addStudent" width="400px">
      <el-form 
      :model="addDate"
      :rules="addRules"
      ref="addForm">
        <el-form-item label="账号" :label-width="formLabelWidth" prop="codeName">
          <el-input v-model="addDate.codeName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="addDate.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="学号" :label-width="formLabelWidth" prop="code">
          <el-input v-model="addDate.code" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="专业" :label-width="formLabelWidth" prop="major_name">
            <el-select v-model="addDate.major_name" placeholder="请选择专业">
              <el-option v-for="(major,index) in majorList" :label="major.name" :value="major.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="班级" :label-width="formLabelWidth" prop="class_name">
            <el-select v-model="addDate.class_name" placeholder="请选择专业">
              <el-option v-for="(major,index) in majorList" :label="major.name" :value="major.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="联系电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addDate.mobile" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addDate.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份证号" :label-width="formLabelWidth" prop="id_card">
          <el-input v-model="addDate.id_card" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStudent = false">取 消</el-button>
        <el-button type="primary" @click="addStudentData('addForm')">确 定</el-button>
      </div>
    </el-dialog>
```

```js
data () {
// 添加学生账号的正则
let validcodeName=(rule,value,callback)=>{
    let reg=/[0-9a-zA-Z]{4,9}/
    if(!reg.test(value)){callback(new Error('账号必须是由4-9位数字和字母组合'))
    }else{
        callback()
    }
};
let validCode=(rule,value,callback)=>{
    let reg=/[0-9a-zA-Z]{4,9}/
    if(!reg.test(value)){callback(new Error('学号必须是由4-9位数字和字母组合'))
    }else{
        callback()
    }
};
let validMobile=(rule,value,callback)=>{
    if(value==''||value==undefined){
        callback()
    }else{
        let reg=/[0-9]{11}/
        if(!reg.test(value)){callback(new Error('格式不对'))}else{
            callback()
        }
    }
};
let validID=(rule,value,callback)=>{
    if(value==''||value==undefined){
        callback()
    }else{
        let reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-      9])|10|20|30|31)\d{3}[0-9Xx]$/
        if(!reg.test(value)){callback(new Error('身份证号码不正确'))}
    }
    
};
return {
  addRules:{
    codeName:[
        {required:true,message:'请输入账号',trigger:'blur'},
        {validator:validcodeName,trigger:'blur'}
    ],
    name:[
        {required:true,message:'请输入姓名',trigger:'blur'}
    ],
    code:[
        {required:true,message:'请输入学号',trigger:'blur'},
        {validator:validCode,trigger:'blur'}
    ],
    major_name:[
        {required:true,message:'请选择专业',trigger:'change'},
    ],
    class_name:[
        {required:true,message:'请选择班级',trigger:'change'},
    ],
    mobile:[
        {validator:validMobile,trigger:'blur'}
    ],
    email:[
        {type:'email',message:'格式不对',trigger:'blur'}
    ],
    id_card:[
        {validator:validID,trigger:'blur'}
    ]

  },//添加学生的正则
```

* 自己修改版本

添加验证表单：

> 前端

```html
<template>
    <div class>
        <el-form label-width="auto" :inline="true" :model="form" ref="form" :rules="menuRules">
            <el-row>
                <el-col :span="4">
                    <firtstTree ref="myTreeChildren"></firtstTree>
                </el-col>
                <el-col :span="5">
                    <el-form-item
                            :label="$t('table.systemMenu.menuCode')"
                            prop="menuCode"
                    >
                        <el-input v-model="form.menuCode"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-form-item
                            :label="$t('table.systemMenu.menuName')"
                            prop="menuName"

                    >
                        <el-input v-model="form.menuName"></el-input>
                    </el-form-item>

                </el-col>

                 <el-col :span="5">
                     <el-form-item
                             :label="$t('table.systemMenu.menuNameFt')"
                             prop="menuNameFt"

                     >
                         <el-input v-model="form.menuNameFt"></el-input>
                     </el-form-item>
                 </el-col>

                <el-col :span="5">
                    <el-form-item :label="$t('table.systemMenu.parentId')">
                        <el-select v-model="form.parentName" placeholder="请选择" clearable>
                            <el-option v-model="form.parentName" style="height: auto">
                                <el-tree
                                        :data="menudata"
                                        show-checkbox
                                        ref="DeviceGroupTree"
                                        node-key="id"
                                        :check-strictly="true"
                                        :props="defaultProps"
                                        @check="checkGroupNode">
                                </el-tree>
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

             <el-col :span="5">
                 <el-form-item :label="$t('table.systemMenu.isLinked')" prop="isLinked" >
                     <el-select v-model="form.isLinked" placeholder="请选择">
                         <el-option
                                 v-for="(item,index) in list.selectList"
                                 :key="item.value"
                                 :label="item.name"
                                 :value="item.value">
                         </el-option>

                     </el-select>
                 </el-form-item>

             </el-col>

          <el-col :span="5">
              <el-form-item
                      :label="$t('table.systemMenu.accessPath')"
                      prop="accessPath"
              >
                  <el-input v-model="form.accessPath" :disabled="accessPathIfdisable"></el-input>
              </el-form-item>

          </el-col>
         <el-col :span="5">
             <el-form-item
                     :label="$t('table.systemMenu.sort')"
                     prop="sort"
             >
                 <el-input v-model.number="form.sort"></el-input>
             </el-form-item>
         </el-col>
            </el-row>
        </el-form>
        <el-button @click="commit('form')" type="primary">{{$t('form.submit')}}</el-button>
    </div>
</template>
```


```js

export default {
        name: 'menuAddAndEdit',
        components: {
            CDropdown,
            firtstTree, selectTree, select
        },
        props: ['data'],
        data() {

            let validmenuCode = (rule, value, callback) => {
                let reg=/[\u4e00-\u9fa5_a-zA-Z0-9_]{1,36}/
                if (!reg.test(value)) {
                    callback(new Error(this.$t('table.systemMenu.menuCode') + '1-36'))
                } else {
                    this.listQuery.queryParamsEqual.menuCode = value;
                    this.axios.post("/user/menu/getByExample", this.listQuery).then(res => {
                        if (res.data.code == this.axios.SUCCESS) {
                            console.log(value, res.data.data)
                            if (res.data.data.rows.length <= 0) {
                                callback()
                            } else {
                                callback(new Error(this.$t('table.systemMenu.menuCode') + this.$t('form.ishave')));
                            }
                        } else {
                            //this.$message.error(this.$t('fail'))
                        }
                    });
                }
            };
            let validmenuName = (rule, value, callback) => {
                let reg=/[\u4e00-\u9fa5_a-zA-Z0-9_]{1,32}/
                if (!reg.test(value)) {
                    callback(new Error(this.$t('table.systemMenu.menuName') + '1-32'))
                } else {
                    callback()
                }
            };
            let validcodeNameFt = (rule, value, callback) => {
                let reg=/[\u4e00-\u9fa5_a-zA-Z0-9_]{1,32}/
                if (!reg.test(value)) {
                    callback(new Error(this.$t('table.systemMenu.menuNameFt') + '1-32'))
                } else {
                    callback()
                }
            };
            let validsort = (rule, value, callback) => {
                callback()
            };
            return {
                listQuery: {
                    queryParamsEqual: {
                        menuCode: '',
                    },
                },// 查询条件
                // 验证消息
                menuRules: {
                    menuCode: [
                        {
                            required: true,
                            message: this.$t('table.systemMenu.menuCode') + this.$t('form.null'),
                            trigger: 'blur'
                        },
                        {validator: validmenuCode, trigger: 'blur'}
                    ],
                    menuName: [
                        {required: true, message: this.$t('table.systemMenu.menuName') + this.$t('form.null'), trigger: 'blur'},
                        {validator: validmenuName, trigger: 'blur'}
                    ],
                    menuNameFt:[
                        {required:true,message:this.$t('table.systemMenu.menuNameFt') + this.$t('form.null'), trigger: 'blur'},
                        {validator:validcodeNameFt,trigger:'blur'}
                    ],
                    sort: [
                        {type: 'number', required: true, message: this.$t('table.systemMenu.sort') + this.$t('form.number')},
                        {validator: validsort, trigger: 'blur'}
                    ],

                },

                accessPathIfdisable: false, // 文本路径输入框是否禁用
                parentName: "",
                menudata: [],
                defaultProps: {
                    children: "children",
                    label: "menuName",
                    id: 'id'
                },
                form: {
                    parentName: "",
                    isLinked:1

                },
                list: {
                    selectList: [{name: '是', value: 1}, {name: '否', value: 0}],
                }

            }
        },
        created() {
            if(this.data !=undefined){
                console.log(this.data,"==")
                this.form = JSON.parse(this.data);
                this.$refs.DeviceGroupTree.setCheckedKeys([this.form.id]);
            }
            this.getMenuTree();
        },
        watch: {
            'form.isLinked': {
                handler(val) {
                    if (val == "0") {
                        this.accessPathIfdisable = true
                    } else {
                        this.accessPathIfdisable = false
                    }
                },
                deep: true
            }
        },
        methods: {

            refreshXTSZTree() {
                // 更新系统设置目录树,暂时只更新这一个
                this.$refs.myTreeChildren.getNavList();

            },
            getMenuTree() {
                this.axios.get("/user/menu/getAllMenuTree").then(res => {
                    if (res.data.code == this.axios.SUCCESS) {
                        this.menudata = res.data.data;
                    }
                }).catch(err => {
                })
            },
            checkGroupNode(data, tree) {
                if (tree.checkedKeys.length > 0) {
                    // console.log('--', this.$refs.DeviceGroupTree)
                    this.$refs.DeviceGroupTree.setCheckedKeys([data.id]);
                    this.form.parentId = data.id
                    this.form.parentName = data.menuName;
                    // console.log(this.form.parentId,this.parentName,this.form.parentName);
                }
                this.$nextTick(function () {

                });

            },
            commit(form) {
                // 表单数据处理
                let loading = this.$loading()
                this.$refs[form].validate((valid) => {
                    if (valid) { // 验证通过
                        this.axios.post('url', this.form).then(res => {
                            loading.close()
                            if (res.data.code == this.axios.SUCCESS) {
                                // 成功
                                this.common.msgSuccess(this.$t('success'))
                                // 添加成功之后 更新目录树
                                this.refreshXTSZTree();
                            } else {
                                this.$message.error(this.$t('fail'))
                            }
                        }).catch(err => {
                            loading.close()
                            this.$message.error(this.$t('fail'))
                        })
                    } else {
                    
                        loading.close()
                        return false;
                    }
                });


            }
        }
    }
```