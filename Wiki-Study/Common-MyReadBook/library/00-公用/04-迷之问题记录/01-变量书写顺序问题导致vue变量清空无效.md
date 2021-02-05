# 这是个神奇的问题

```js
  
// 这两行代码的顺序导致了后续清空不可用
//  1 
// this.eduTestPaperVo.eduTestPlan = res.data.data.eduTestPlan
// this.eduTestPaperVo.eduTestPlan["markingName"] = res.data.data.markingName

//  2
res.data.data.eduTestPlan.markingName = res.data.data.markingName;
this.eduTestPaperVo.eduTestPlan = res.data.data.eduTestPlan;



// 在绑定输入框的时候

  <el-col :span='12'>
          <el-form-item label="阅卷人:" prop="eduTestPlan.markingName" :rules="[{required: true, message: '不能为空'}]">
            <el-input @focus="userSingleDialog=true" :clearable="true" v-model="eduTestPaperVo.eduTestPlan.markingName" @clear="clearEduMarking"></el-input>
          </el-form-item>
        </el-col>


// 1-在清空的时候无法清空对应的值， 而使用2 就可以 


```