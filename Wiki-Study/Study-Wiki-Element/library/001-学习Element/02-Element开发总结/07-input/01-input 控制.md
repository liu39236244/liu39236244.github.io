# input 控制

## 普通input 控制

```

<el-input
            class="verification-input"
            v-model.number="verificationVal"
            :maxlength="6"
            size="small"
            @input.native="inputhandle">
</el-input>


  inputhandle({ target }) {
    this.verificationVal = target.value = target.value.replace(/[^0-9]/g, "");
  }

```

## 数字行input 控制

```
<el-col :span="12">
            <el-form-item label="分数:" prop="behaviorFraction">
              <el-input
                type="number"
                v-model="form.behaviorFraction"
                @input="numberChange(arguments[0],9999999)"
                @change="numberChange(arguments[0],9999999)"
                :max="100"
                :maxlength="3"
              ></el-input>
            </el-form-item>
          </el-col>
```

```js

// 控制最大了展示参数中最大值
numberChange (val,maxNum) {

        //转换数字类型
        this.form.behaviorFraction = Number(val)
        //重新渲染
        this.$nextTick(()=>{
            //比较输入的值和最大值，返回小的
            let num = Math.min(Number(val),maxNum)
            //输入负值的情况下， = 0（可根据实际需求更该）
            if(num<0) {
                this.form.behaviorFraction = 0
            }else {
                //反之
                this.form.behaviorFraction = num
            }
        })
    },

// 控制输入长度即可

numberChange (val,maxNum) {
        debugger
        let oldVal=Number(val)
        let curVal=oldVal
        if(oldVal < 0 ){
            curVal = 0
        }else if(val.length > (maxNum+"").length){
            curVal= val.substr(0,val.length-1)
        }
        this.form.behaviorFraction=curVal
        
    },
```