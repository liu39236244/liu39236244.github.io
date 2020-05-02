# html 使用vlc 调用 摄像头 显示 到ie浏览器上 

* 注意 只能在ie 或者 搜狗浏览器上面，而且本地需要安装vlc ，切版本是 3.0.4 ，其他版本的 播放不了 。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <script type="text/javascript">
        var itemId = 0;


        function getVLC(name)
        {
            if (window.document[name])
            {
                return window.document[name];
            }
            if (navigator.appName.indexOf("Microsoft Internet")==-1)
            {
                if (document.embeds && document.embeds[name])
                    return document.embeds[name];
            }
            else
            {
                return document.getElementById(name);
            }
        }


        function doGo(mrl) {
            setTimeout(function(){
                var vlc = getVLC("vlc");
                itemId = vlc.playlist.add(mrl);
                vlc.playlist.playItem(itemId);
                document.getElementById("btn_stop").disabled = false;
            },500)
        }


        function updateVolume(deltaVol) {
            var vlc = getVLC("vlc");
            vlc.audio.volume += deltaVol;
        }

        function doPlay() {
            getVLC("vlc").playlist.playItem(itemId);
            document.getElementById("btn_stop").disabled = false;
            document.getElementById("btn_play").disabled = true;
        }

        function doStop() {
            getVLC("vlc").playlist.stop();
            document.getElementById("btn_stop").disabled = true;
            document.getElementById("btn_play").disabled = false;
        }
    </script>
</head>
<body>
<div style="margin: 50px">
    <span style="margin: 20px;"/>

    <a title="rtsp://184.72.239.149/vod/mp4://BigBuckBunny_175k.mov" href="#" onclick="doGo(this.title);return false;">rtsp://184.72.239.149/vod/mp4://BigBuckBunny_175k.mov
        流播放</a>
    <br/>
    
    <br/>
    <a title="rtsp://218.204.223.237:554/live/1/66251FC11353191F/e7ooqwcfbqjoo80j.sdp" href="#" onclick="doGo(this.title);return false;">电视台
         流播放</a>
    <br/>
    <span style="margin: 20px;"/>
</div>
<div>
    <!--codebase 提示插件下载地址-->
    <OBJECT classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" id="vlc"
            codebase="http://comic.sjtu.edu.cn/vlc/cab/axvlc.cab"
            width="600" height="480" id="vlc" events="True">
        <param name="Src" value=""/>
        <param name="MRL" value=""/>
        <param name="ShowDisplay" value="True"/>
        <param name="AutoLoop" value="False"/>
        <param name="AutoPlay" value="False"/>
        <param name="Time" value="True"/>
        <EMBED pluginspage="http://www.videolan.org"
               type="application/x-vlc-plugin"
               version="VideoLAN.VLCPlugin.2"
               width="600"
               height="480"
               text="Waiting for video"
               name="vlc">

        </EMBED>
        <!--针对火狐浏览器-->
         <embed id="vlcEmb" type="application/x-google-vlc-plugin" version="VideoLAN.VLCPlugin.2" autoplay="yes"
                loop="no" width="640" height="480"
                target="rtsp://admin:chenhui561X@10.0.2.64:554/Streaming/Channels/201"></embed>
    </OBJECT>
</div>
<div>
    <input type=button id="btn_play" value=" 播放 " onClick='doPlay();' disabled="true">
    <input type=button id="btn_stop" value="停止" onClick='doStop();' disabled="true">
    <input type=button value="静音切换" onclick='getVLC("vlc").audio.togglemute();'>
    <input type=button value="减小音量" onclick='updateVolume(-10)'>
    <input type=button value="增加音量" onclick='updateVolume(+10)'>
</div>
</body>
</html>

```
