# 这里记录jquery 进度条Demo


# 公用记录
主要是利用pageX 获取鼠标相对于文档的偏移量，便于鼠标移动的时候知道移动了多少，但是因为进度条可能不在0的位置上，所以
e.pageX- y :中的y 值就是当前滚动条的距离。


# 工作所用到的Demo

## 滑动条1  ，原始版本


### scrool bar 与 bar

```js
var ScrollBar = {
        // 鼠标是否按下拖动按钮
        ifmousedown:false,
        value: 0,
        maxValue: 10,
        step: 1,
        currentX: 0,

        // 滑动条
        ox:0, // 按下记录鼠标相对于文档的偏移量
        e_offset:0,
        left : 0,
        //初始化
        Initialize: function () {
            $("#progressTime").show();
            if (this.value > this.maxValue) {
                //alert("给定当前值大于了最大值");
                return;

            }
            this.setScrollwidth();

            $("#scroll_Track").css("width",  0+ "px");

            $("#scroll_Thumb").css("margin-left", - 7.5 + "px");

            // this.Value();

        },
        //销毁
        Destroy: function () {
            // progressTimeStop();
            $("#progressTime").hide();
            // window.clearInterval(_mProgressTimer);
            // _mProgressTimer = null;
        },
        //设置轴值
        SetValue: function (aValue) {
            /*if (!curLevel) {
                layer.msg(language==0?'Please select the number of wind layers':'请选择风场层数');
                return;
            }*/
            this.value = aValue;

            if (this.value >= this.maxValue) this.value = this.maxValue;

            if (this.value <= 0) this.value = 0;

            this.currentX=this.value / this.maxValue * $("#scrollBar").width()
            $("#scroll_Track").css("width", this.currentX + "px");
            $("#scroll_Thumb").css("margin-left", this.currentX - 7.5 + "px")

        },

        Value: function () {

            var valite = false;

            var currentValue;


        },
        //获取值
        setScrollwidth: function () {
            this.currentX = $("#scrollBar").width() * (this.value / this.maxValue);
        }

    }

    var _index = 0;//进度
    var barStep = 1;
    var _mProgressTimer;//定时器
    var _speed = WinControlVar._speed;
    var myfun;//执行方法，当前时间为参数

    //初始化时间轴
    function SetProgressTime(fun, startTime, endTime, mValue) {
        myfun = fun;
        ScrollBar.maxValue = mValue;
        //初始化
        ScrollBar.Initialize();


    }
    //开始 暂停

    function progressTimeControl(img) {

        if ($(img).attr("title") == (language == 0 ? 'Pause' : "暂停")) {
            barStatus = '暂停';
            $(img).attr("title", language == 0 ? 'Start' : "开始");

            $(img).attr("src", "img/20150608024026950_easyicon_net_48.png");

            window.clearInterval(_mProgressTimer);
            _mProgressTimer = null;

        } else {
            barStatus = '开始';
            $(img).attr("title", language == 0 ? 'Pause' : "暂停");
            $(img).attr("src", "img/2015060802411313_easyicon_net_48.png");
            // 初始化定时事件
            initIntervalPlay()

        }

    }

    /**
     * 停止播放事件：
     * @param ifclearInterval : 是否也清空定时事件
     */
    function progressTimeStop(ifclearInterval) {

        $("#scroll_Thumb").css("margin-left", "-7.5px");
        $("#scroll_Track").css("width", "0px");
        _index = 0;
        ScrollBar.SetValue(0);
        update3LayerAndText(0) //  将三要素layer 展示成第一个时间点的状态
        if (ifclearInterval == true) { //如果为true，则表示播放完一次之后停止
            $("#progressTime_control").attr("title", language == 0 ? 'Start' : "开始");
            $("#progressTime_control").attr("src", "img/20150608024026950_easyicon_net_48.png");
            _speed = WinControlVar._speed;
            window.clearInterval(_mProgressTimer);
            _mProgressTimer = null;
            barStep = 1;
            barStatus = '停止';
            $("#TimeSpeed").text("×1");
            $('#startTime').html('');
            $('#endTime').html('');
            // if(windL!=null) windL.getSource().clear();
        }


    }

    //加速
    function speedSubtract() {
        if (barStatus != "开始" || !_mProgressTimer) {
            return;
        }
        _speed = _speed / 2;
        if (_speed < WinControlVar.max_speed) { // 速度已经是最大限度
            _speed = WinControlVar.max_speed
            $.modalMsg("速度已经最大", 0)
            return;
        }
        $("#TimeSpeed").text("×" + (WinControlVar._speed / _speed))
        SetInterval();
    }

    //减速
    function speedAdd() {
        if (barStatus != "开始") return;

        if (!_mProgressTimer) {
            return;
        }
        _speed = _speed * 2;
        if (_speed > WinControlVar.min_speed) { // 速度已经是慢速度
            _speed = WinControlVar.min_speed
            $.modalMsg("速度已经最小", 0)
            return;
        }
        $("#TimeSpeed").text("×" + (WinControlVar._speed / _speed))
        SetInterval();
    }

    //重制播放
    function SetInterval() {
        initIntervalPlay();
    }

    // 初始化定时事件
    function initIntervalPlay() {
        window.clearInterval(_mProgressTimer);
        _mProgressTimer = null;
        _mProgressTimer = window.setInterval(function () {
            if (_index <= ScrollBar.value) {
                $("#txtInfo").text(getTxtDate(windFiles[_index]));
                _index += 1;
                ScrollBar.SetValue(_index);
                // 改变_index ,步长 则需要同步更新矢量、流线、压力 三者layer
                update3LayerAndText(_index)
            } else {
                // true 则调用停止方法，
                progressTimeStop(true)
            }
        }, _speed);

    }

    //按钮绑定事件
    function bindEvent1() {
        //减速
        $('#pro_down').click(function () {
            speedAdd();
        })
        //开始
        $('#progressTime_control').click(function () {
            progressTimeControl(this);
        })
        //停止
        $('#pro_stop').click(function () {
            progressTimeStop(true);
        })
        //加速
        $('#pro_up').click(function () {
            speedSubtract();
        })
        // 拖动滑块事件
        $("#scroll_Thumb").mousedown(function (e) {
            ScrollBar.ox=e.pageX-ScrollBar.currentX;
            ScrollBar.ifmousedown=true;
            e.stopPropagation();    //  阻止事件冒泡
        })

        // 鼠标弹起
        $(document).mouseup(function () {
          if(ScrollBar.ifmousedown==true){
              ScrollBar.ifmousedown=false;
              // 当鼠标松开判断当前距离的占比
              var percent=ScrollBar.currentX / $("#scrollBar").width()
              _index=Math.floor(windFiles.length * percent)
              update3LayerAndText(_index)
              ScrollBar.SetValue(_index);
          }
        });
        // 鼠标移动
        $(document).mousemove(function(e){
            if(ScrollBar.ifmousedown){
                ScrollBar.currentX=e.pageX-ScrollBar.ox
                if(ScrollBar.currentX<0){
                    ScrollBar.currentX=0
                }else if(ScrollBar.currentX>$("#scrollBar").width()){
                    ScrollBar.currentX= $("#scrollBar").width()
                }
                $("#scroll_Track").css("width",  ScrollBar.currentX + "px");
                $("#scroll_Thumb").css("margin-left",  ScrollBar.currentX - 7.5 + "px")

            }
        })
        $("#scrollBar").click(function(e) {
            var left=e.pageX- $(this).offset().left
            ScrollBar.currentX=left;
            if(ScrollBar.currentX<0){
                ScrollBar.currentX=0
            }else if(ScrollBar.currentX>$("#scrollBar").width()){
                ScrollBar.currentX= $("#scrollBar").width()
            }
            $("#scroll_Track").css("width",  ScrollBar.currentX + "px");
            $("#scroll_Thumb").css("margin-left",  ScrollBar.currentX - 7.5 + "px")

            var percent=ScrollBar.currentX / $("#scrollBar").width()
            _index=Math.floor(windFiles.length * percent)
            update3LayerAndText(_index)
            ScrollBar.SetValue(_index);

            e.stopPropagation()
        })

    }

    var bar =
        {
            init: function (maxValue) {
                // 播放条
                $(document).ready(function (e) {
                    //gfs 最多 8 * 7 =56  fnl最多：4*7=28 maxvalue:最多 55/27
                    //初始化进度条
                    SetProgressTime(null, windFiles[0], windFiles[windFiles.length - 1], maxValue);

                });
            },
            destroy: function () {//销毁
                $("#txtInfo").text("");
                ScrollBar.Destroy();
            }
        }

```


# 博主Demo

## Demo滑动条1

[原文地址](https://www.cnblogs.com/Strom-HYL/p/7028531.html)

```html
<div class="progress">
            <div class="progress_bg">
                <div class="progress_bar"></div>
            </div>
            <div class="progress_btn"></div>
            <div class="text">0%</div>
        </div>
```


```css
.progress{position: relative; width:300px;margin:100px auto;}
        .progress_bg{height: 10px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;background-color:#f2f2f2;}
        .progress_bar{background: #5FB878; width: 0; height: 10px; border-radius: 5px;}
        .progress_btn{width: 20px; height: 20px; border-radius: 5px; position: absolute;background:#fff;
        left: 0px; margin-left: -10px; top:-5px; cursor: pointer;border:1px #ddd solid;box-sizing:border-box;}
        .progress_btn:hover{border-color:#F7B824;}
```

```jquery
$(function(){
                var tag = false,ox = 0,left = 0,bgleft = 0;
                $('.progress_btn').mousedown(function(e) {
                    ox = e.pageX - left;
                    tag = true;
                });
                $(document).mouseup(function() {
                    tag = false;
                });
                $('.progress').mousemove(function(e) {//鼠标移动
                    if (tag) {
                        left = e.pageX - ox;
                        if (left <= 0) {
                            left = 0;
                        }else if (left > 300) {
                            left = 300;
                        }
                        $('.progress_btn').css('left', left);
                        $('.progress_bar').width(left);
                        $('.text').html(parseInt((left/300)*100) + '%');
                    }
                });
                $('.progress_bg').click(function(e) {//鼠标点击
                    if (!tag) {
                        bgleft = $('.progress_bg').offset().left;
                        left = e.pageX - bgleft;
                        if (left <= 0) {
                            left = 0;
                        }else if (left > 300) {
                            left = 300;
                        }
                        $('.progress_btn').css('left', left);
                        $('.progress_bar').animate({width:left},300);
                        $('.text').html(parseInt((left/300)*100) + '%');
                    }
                });
            });
```


实现原理

　　首先是用mousedown()鼠标按下事件保存一个状态值，mouseup()鼠标抬起事件取消该状态，再同时配合mousemove()鼠标移动事件，实现按住拖动的效果。

在鼠标移动的同时去改变精度条的长度和按钮的相对左部的距离。

　　然后就是距离的计算，主要利用的就是pageX() 属性。pageX是鼠标指针相对于文档的左边缘的位置。在鼠标按下是就记录相对位置，在鼠标移动后就可求出鼠标移动的距离。从而改变按钮位置和进度条长度。



## Demo2



```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>www.jb51.net jQuery手动拖动进度条</title>
<style type="text/css">
 #box{position: relative; width: 200px; height: 50px; border: 1px solid #eee; margin: 50px auto 0;}
 #bg{height: 10px; margin-top: 19px; border: 1px solid #ddd; border-radius: 5px; overflow: hidden;}
 #bgcolor{background: #5889B2; width: 0; height: 10px; border-radius: 5px;}
 #bt{width: 34px; height: 34px;background-color: red; border-radius: 17px; overflow: hidden; position: absolute; left: 0px; margin-left: -17px; top: 8px; cursor: pointer;}
 #text{width: 200px; margin: 0 auto; font-size: 16px; line-height: 2em;}
</style>
<script src="http://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
</head>
<body>
 <div id="box">
 <div id="bg">
  <div id="bgcolor"></div>
 </div>
 <div id="bt"></div>
 </div>
 <div id="text"></div>
 <script type="text/javascript">
 (function($){
 var $box = $('#box');
 var $bg = $('#bg');
 var $bgcolor = $('#bgcolor');
 var $btn = $('#bt');
 var $text = $('#text');
 var statu = false;
 var ox = 0;
 var lx = 0;
 var left = 0;
 var bgleft = 0;
  $btn.mousedown(function(e){
  lx = $btn.offset().left;
  ox = e.pageX - left;
  statu = true;
  });
  $(document).mouseup(function(){
  statu = false;
  });
  $box.mousemove(function(e){
  if(statu){
   left = e.pageX - ox;
   if(left < 0){
   left = 0;
   }
   if(left > 200){
   left = 200;
   }
   $btn.css('left',left);
   $bgcolor.width(left);
   $text.html('位置:' + parseInt(left/2) + '%');
  }
  });
  $bg.click(function(e){
  if(!statu){
   bgleft = $bg.offset().left;
   left = e.pageX - bgleft;
   if(left < 0){
   left = 0;
   }
   if(left > 200){
   left = 200;
   }
   $btn.css('left',left);
   $bgcolor.stop().animate({width:left},200);
   $text.html('位置:' + parseInt(left/2) + '%');
  }
  });
 })(jQuery);
 </script>
</div>
</body>
</html>

```
