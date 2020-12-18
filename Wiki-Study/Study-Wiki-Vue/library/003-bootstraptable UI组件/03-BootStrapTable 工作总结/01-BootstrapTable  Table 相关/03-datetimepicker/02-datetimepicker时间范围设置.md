# bootstraptable datetimepicker 时间框设置


## 设置时间，并且设置开始结束时间范围


```js
dateDefind() {
      //初始化
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
      $("#beginDate" + that.index).datetimepicker(config).on("hide", function (ev) {
        var value = $("#beginDate" + that.index).val();
        that.beginDate  = value;
      }).on('changeDate',function(e){
				$("#endDate" + that.index).datetimepicker('setStartDate',e.date); 
			});
      $("#endDate" + that.index).datetimepicker(config).on("hide", function (ev) {
        var value = $("#endDate" + that.index).val();
        that.overDate = value;
      }).on('changeDate',function(e){
				$("#beginDate" + that.index).datetimepicker('setEndDate',e.date);
			});
    },
```


