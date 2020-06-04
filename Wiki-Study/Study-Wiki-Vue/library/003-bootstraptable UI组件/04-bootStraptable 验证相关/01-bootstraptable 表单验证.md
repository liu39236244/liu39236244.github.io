# bootstraptable 验证



## 简单表单验证


```html
<form id="form_law" style="height: 90%;width: 100%;position: relative;">
            <table :class="[current==0?'showTab':'hideTab']" style="width: 100%;z-index: -1;" class="form border">
              <tr>
                <td class="formTitle">姓名：</td>
                <td class="formValue">
                  <input v-validate="'required|max:8'" data-vv-name="姓名" v-model="item.seUser.realName" type="text"
                    class="form-control">
                  <i>*</i>
                </td>
                <td class="formTitle">照片：</td>
                <td class="formValue" rowspan="4">
                  <div class="imgbox imgCon clearfix">
                    <div class="pic-container clearfix" style="text-align: center;">
                      <div class="inpImg clearfix">
                        <img :src="src" class="img inpImgBox">
                        <input ref="fileInput1" @change="uploadImg" type="file"  placeholder="请选择文件" accept="image/jpg,image/jpeg,image/gif,image/bmp,image/png" />
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <!--<tr>
                <td class="formTitle">员工编号：</td>
                <td class="formValue">
                  <input v-validate="'required|max:30'" data-vv-name="员工编号" v-model="item.seUser.empNo" type="text"
                    class="form-control" disabled="disabled">
                </td>
              </tr>-->
              <td class="formTitle">登录名：</td>
                <td class="formValue">
                  <input v-validate="'required|max:30|min:2'" data-vv-name="登录名" v-model="item.seUser.username" type="text"
                    class="form-control" @blur="isUniqueName" style="margin-bottom: -7px;">
                  <i>*</i>
                  <div v-if="isUniqueUsername">
                    <span class="badge badge-important">!</span>
                  </div>
                </td>
              <tr>
                <td class="formTitle">员工编号：</td>
                <td class="formValue">
                  <input data-vv-name="员工编号" v-model="item.seUser.empNo" class="form-control" type='number' min='0' v-validate="'required|max:20|min:2'"   @blur="isUniqueNo">

                  <!--<input  data-vv-name="档案号" v-model="item.seUser.archiveNo" class="form-control" v-validate="'max:125'">-->
                </td>


                <td class="formValue">
                  <input v-validate="'phone'" data-vv-name="手机号" v-model="item.seUser.phoneNum" :class="{'input': true, 'is-danger': errors.has('mobile') }"
                    type="number" class="form-control">
                </td>

                <td class="formTitle">身份证号：</td>
                            <td class="formValue">
                                <input data-vv-name="身份证号" v-model="item.seUser.idCard" v-validate="'idCard'" type="text" class="form-control">
                </td>
              </tr>
            </table>
        </form>
```

 ```js

 this.$validator.extend('phone', {
        messages: {
          zh_CN: field => field + '必须是11位手机号码'
        },
        validate: value => {
          return value.length === 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/.test(value)
        }
      })
      this.$validator.extend('idCard', {
        messages: {
          zh_CN: field => field + '请输入正确的身份证号'
        },
        validate: value => {
          return value.length === 18 && /^\d{17}[0-9Xx]$/.test(value)
        }
      })


       this.$validator.validateAll().then((result) => {
        // 验证通过

       }
 ```