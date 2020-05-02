# van-field 下拉单的使用 picker 下拉单

# 时间下拉单,以及自定义下拉单


```html
 <van-field label="检查时间" required :value="HidenDangerDto.checkTime" :error-message="errorMsg.checkTime" @click='pickerTimeShow("checkTime")' readonly />

 <!-- 弹出层 选择器picker-->
      <van-popup v-model="picker.show" position="bottom">
        <van-datetime-picker v-show="picker.showTab=='isTimePicker'" type="datetime" :min-date="new Date()" :formatter="formatter"
          @confirm='pickerValueHandle' @cancel='pickerValueHandle' />

        <van-picker v-show="picker.showTab=='isCheckDepart'" show-toolbar :columns="departList" @cancel="pickerValueHandle"
          @confirm="pickerValueHandle" />
        <van-picker v-show=" picker.showTab=='isDutyDepart'" show-toolbar :columns="responsibleddepartList"
          @cancel="pickerValueHandle" @confirm="pickerValueHandle" />
        <van-picker v-show="picker.showTab=='isResponseUser'" show-toolbar :columns="responseUserList"
          @cancel="pickerValueHandle" @confirm="pickerValueHandle" />
</van-popup>


  <!-- 弹出层 选择器picker-->
      <van-popup v-model="picker.show" position="bottom">
        <van-datetime-picker v-show="picker.showTab=='isTimePicker'" type="datetime" :min-date="new Date()" :formatter="formatter"
          @confirm='pickerValueHandle' @cancel='pickerValueHandle' />
        <van-picker v-show="picker.showTab=='isCheckDepart'" show-toolbar :columns="departList" @cancel="pickerValueHandle"
          @confirm="pickerValueHandle" />
        <van-picker v-show=" picker.showTab=='isDutyDepart'" show-toolbar :columns="responsibleddepartList"
          @cancel="pickerValueHandle" @confirm="pickerValueHandle" />
        <van-picker v-show="picker.showTab=='isResponseUser'" show-toolbar :columns="responseUserList"
          @cancel="pickerValueHandle" @confirm="pickerValueHandle" />
      </van-popup>
```

```js

   Data(){
    return {
        picker: {
          show: false,
          showTab: "",
          field: ''
        },
    }
   }

    // 时间弹出框
    pickerTimeShow(e) {
    this.picker.show=true;
    this.picker.showTab = "isTimePicker"
    this.picker.field = e
    },
    // 受检部门
      pickerDepartShow(e) {

        // this.picker.isCheckDepart = true
        this.picker.show=true;
        this.picker.showTab = "isCheckDepart"
        this.picker.field = e
      },
      // 责任部门
      pickerDuttyDepartShow(e) {
        this.picker.show=true;
        // this.picker.isDutyDepart = true
        this.picker.showTab = "isDutyDepart"
        this.picker.field = e
      },
      // 责任人
      pickerResponseUserShow(e) {
        this.picker.show=true;
        // this.picker.isResponseUser = true
        this.picker.showTab = "isResponseUser"
        this.picker.field = e
      },
      formatter(type, value) {
        if (type === 'year') {
          return `${value}年`
        } else if (type === 'month') {
          return `${value}月`
        } else if (type === 'day') {
          return `${value}日`
        }
        return value
      },
      pickerValueHandle(e) {
        // alert(e.id+":"+e.text)
        // console.log(e) // e 每一行选中的对象
        if (e) {
          this.picker.showTab=="isTimePicker" && (e = tools.parseTime(e))
          if (this.picker.showTab=="isTimePicker") {
            this.HidenDangerDto[this.picker.field] ? (this.HidenDangerDto[this.picker.field] = e) : this.$set(this.HidenDangerDto,
              this.picker.field, e)
          } else {
            this.HidenDangerDto[this.picker.field] ? (this.HidenDangerDto[this.picker.field] = e.id) : this.$set(this.HidenDangerDto,
              this.picker.field, e.id)
            this.HidenDangerDto[this.picker.field + "_Name"] ? (this.HidenDangerDto[this.picker.field + "_Name"] = e.text) :
              this.$set(this.HidenDangerDto, this.picker.field + "_Name", e.text)
          }
        }
         this.picker.show = false
      },
```
