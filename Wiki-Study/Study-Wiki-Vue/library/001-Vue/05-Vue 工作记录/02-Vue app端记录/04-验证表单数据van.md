# vant vue app 端验证 表单数据记录



# validateform 介绍

需要引入：

```js
  import {
    validateForm,
    isNumber
  } from '@/utils/validate.js'
```

# 使用

表格
```html
<van-cell-group id="dangerAdd">
        <!-- timePicker -->
        <van-field label="检查时间" required :value="HidenDangerDto.checkTime" :error-message="errorMsg.checkTime" @click='pickerTimeShow("checkTime")' readonly />
        <van-field label="整改期限" required :value="HidenDangerDto.deadline" @click='pickerTimeShow("deadline")'
          :error-message="errorMsg.deadline" readonly />
        <!-- timePicker -->

        <van-field label="**单位" required :value="HidenDangerDto.checkDepart_Name" @click='pickerDepartShow("checkDepart")'
          :error-message="errorMsg.checkDepart_Name" readonly/>
        <van-field label="责任单位" required :value="HidenDangerDto.hiddenDangerDepart_Name" @click='pickerDuttyDepartShow("hiddenDangerDepart")'
          :error-message="errorMsg.hiddenDangerDepart" @change="changeDutteyNameList" readonly/>
        <van-field label="责任人" required :value="HidenDangerDto.dutyOfficer_Name" @click='pickerResponseUserShow("dutyOfficer")'
          :error-message="errorMsg.dutyOfficer_Name" readonly/>
        <!--<van-field v-if="" label='检查人' v-model="HidenDangerDto.checker" placeholder=""/>-->
        <van-field label='money 来源' v-model="HidenDangerDto.capitalSource" placeholder="" />
        <van-field required v-model="HidenDangerDto.content" label="**内容" type="textarea" placeholder="" autosize
          :error-message="errorMsg.content" />
        <van-field required v-model="HidenDangerDto.controlRequirements" label="修改要求:" type="textarea"
          placeholder="" autosize :error-message="errorMsg.controlRequirements" />
        <!-- <van-field :label='i.title' v-model="form[i.field]"  placeholder="请输入用户名" /> -->
      </van-cell-group>
```

前端js

```js
// 验证表单数据是否通过验证，为了使第一次不进行验证

* 数据准备： data(){
    return {
        errorMsg: {
                checkTime: '', // 排查时间
                deadline: "",
                checkDepart_Name: "",
                hiddenDangerDepart: "",
                dutyOfficer_Name: "",
                content: '', // **内容
                controlRequirements: ""
                },
                rules: {
                checkTime: [{
                    required: true,
                    message: '请选择排查时间'
                }],
                deadline: [{
                    required: true,
                    message: '请选择整改期限'
                }],
                checkDepart_Name: [{
                    required: true,
                    message: '请选择**单位'
                }],
                hiddenDangerDepart: [{
                    required: true,
                    message: '请选择责任单位'
                }],
                dutyOfficer_Name: [{
                    validator: (rule, value, callback) => {
                    if (!value) {
                        callback('请选择责任人!');
                    }
                    }
                }],
                content: [{
                    validator: (rule, value, callback) => {
                    if (!value) {
                        callback('请输入**内容');
                    }
                    if (value.length > 200) {
                        callback('**内容1-200字数');
                    }
                    }
                }],
                controlRequirements: [{
                    validator: (rule, value, callback) => {
                    if (!value) {
                        callback('请输入修改要求');
                    }
                    if (value.length > 200) {
                        callback('修改要求1-200字数');
                    }
                    }
                }],
                }

    }
}

// 需要监控对象值的改变

watch: {
      // 监控属性值改变；暂不可用
      HidenDangerDto: {
        handler(oldhiden, newhiden) {
          console.log("new hidendangerdto", newhiden)
          if(!this.ifOnce){
            this.validateFormFields()
          }else{
            // 说明第一次加载，不进行验证输入，否则初次加载页面就会提示验证信息
          }
        },
        deep: true
      },

      'HidenDangerDto.hiddenDangerDepart':{
        handler(oldhiden, newhiden) {
          this.changeDutteyNameList() // 责任部门一旦修改，就更新责任部门负责人列表
        },
        deep: true
      }
    },

// 验证方法
validateFormFields() {
    if(this.ifOnce){
    this.ifOnce=false;
    }
    validateForm(this.rules, this.HidenDangerDto, this.errorMsg, (errors, fields) => {
        // this.HidenDangerDto 与文本框绑定的值得data vue数据对象
    this.isPassValidateForm = !errors
    })
},
```

# 






