# datetimepicker 简单使用


## 基础简单使用


```js
 created() {

    this.initData();
    this.$nextTick(() => {
        // this.initData(); // 时间不应该写到这里面。如果写到这里面，重新修改的时间将会与组件中选中样式的日期不一致，需要写道外面，如果非要写到这里面，那么可以手动修改组件中的选中的日期，// $("#alarmStartDate").val( this.alarmParams.startTime)
    });
 }
 
 initData(){
     // 注意这里有一个坑，datetimepicker 是在mounted中给定绑定事件的，所以v-model 显示的时间写道created中的 nextTick 中，就会出现时间组件与时间框中的展示时间不一致，
    this.alarmParams.startTime = this.dateFormat(
        "YYYY-mm-dd",
        new Date(Date.parse(curTimeStr))
      );

 }
 mounted() {
    this.$nextTick(function () {
      this.dateDefault();
    });
  },

// dateDefault 需要写到 mounted中
dateDefault() {
      var that = this;
      var config = {
        language: "zh-CN",
        format: "yyyy-mm-dd",
        weekStart: 1,
        todayBtn: 1,
        autoclose: 2,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0,
        showMeridian: 1,
        clearBtn: true,
      };
      $("#theFristDate")
        .datetimepicker(config)
        .on("hide", function (ev) {
          var value = $("#theFristDate").val();
          that.startTime = value;
        });

      $("#alarmStartDate")
        .datetimepicker(config)
        .on("hide", function (ev) {
          var value = $("#alarmStartDate").val();
          that.alarmParams.startTime = value;
        });


      $("#alarmEndDate")
        .datetimepicker(config)
        .on("hide", function (ev) {
          var value = $("#alarmEndDate").val();
          that.alarmParams.endTime = value;
        });

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
```