# Openlers 零碎点记录

## 零碎记录

### 1- ol_form  ：'ol_form': 'ol/coordtransform',

> 今天遇到了ol_form ，刚看openlayers 的时候没见到过这个，决定查一下这个的用途，应为在require shim中引入openlayer3 的css 的时候，貌似是需要引入的一个依赖，

-   1.  搜到的一些博主介绍：

<https://727798013.iteye.com/blog/2329694>

-   2.  ol_form是一个坐标转换用的工具库

coordtransform 是一个提供了百度坐标（BD09）、国测局坐标（火星坐标，GCJ02）、和WGS84坐标系之间的转换的工具模块。

<label style="color:red">

百度坐标系对应的就是-百度地图;

国测局坐标系对应的是-高德地图，谷歌地图，ios地图等。

wgs84是国际标准，是从专业gps设备中取出的数据坐标系。

</label>

这里要说一下百度坐标系，因为之前用在app时，准是会出现几百米的固定误差。是因为百度地图为保护个人的隐私，在获取坐标系时首先通过国测局坐标系进行了一次加密，之后又通过百度坐标系进行了二次加密。所以获得的坐标系不是gps设备定位到的准确的坐标系。要经过转换才可以使用。下面我提供了nodejs坐标系转换的方法，希望能帮到有此困扰的博友：

  安装：
首先在你的项目上安装模块：
npm install coordtransform  

//国测局坐标(火星坐标,比如高德地图在用),百度坐标,wgs84坐标(谷歌国外以及绝大部分国外在线地图使用的坐标)  
var coordtransform=require('coordtransform');  
//百度经纬度坐标转国测局坐标  
var bd09togcj02=coordtransform.bd09togcj02(116.404, 39.915);  
//国测局坐标转百度经纬度坐标  
var gcj02tobd09=coordtransform.gcj02tobd09(116.404, 39.915);  
//wgs84转国测局坐标  
var wgs84togcj02=coordtransform.wgs84togcj02(116.404, 39.915);  
//国测局坐标转wgs84坐标  
var gcj02towgs84=coordtransform.gcj02towgs84(116.404, 39.915);  
console.log(bd09togcj02);  
console.log(gcj02tobd09);  
console.log(wgs84togcj02);  
console.log(gcj02towgs84);  
//result  
//bd09togcj02:   [ 116.39762729119315, 39.90865673957631 ]  
//gcj02tobd09:   [ 116.41036949371029, 39.92133699351021 ]  
//wgs84togcj02:  [ 116.41024449916938, 39.91640428150164 ]  
//gcj02towgs84:  [ 116.39775550083061, 39.91359571849836 ]  

* * *

### [2] Openlayers的获取feature中的经纬度


```
划线相关的方法
```

```


  let dx=$("#divWaterTaskInfo #parmdx").val();
  let per=dx/lineLength;//每段所占百分比
  let nodeNum=parseInt(1/per);//线上的节点个数
  let nodeArr=new Array();//线上各节点经纬度
  nodeArr.push(lineGeom.getCoordinates()[0]);//起始位置节点的经纬度
  for(let i=0;i<nodeNum;i++){
      nodeArr.push(lineGeom.getCoordinateAt(per*(i+1)));
  }

```



```js
 locateL: null,//核设施定位图层
  drawFeature:null,//地图线feature ：使用这个对象，可以获取线的经纬度，长度、并且进行切分不同点的经纬度
initMap:function(){
            func.locateL = new ol.layer.Vector({
                source: new ol.source.Vector(),
                style: function (f, r) {
                    return new ol.style.Style({
                        image: new ol.style.Icon({
                            src: './img/map/factory1.png',
                            anchor: [0.5, 1]
                        })
                    })
                }
            });
            let address = $("#geoAddress").val();
            let urlTemplate = address + '/geowebcache/service/wms';
            let tileWMSSource = new ol.source.TileWMS({
                projection:"EPSG:4326",
                url:urlTemplate,
                crossOrigin:'Anonymous',
                params:{
                    "LAYERS":'praster',
                    "FORMAT":'image/png',
                    "SRS":"EPSG:4326",
                    'VERSION':'1.1.1'
                },
                tileGrid:new ol.tilegrid.TileGrid({
                    resolutions:[1.40625,
                        0.703125,
                        0.3515625,
                        0.17578125,
                        0.087890625,
                        0.0439453125,
                        0.02197265625,
                        0.010986328125,
                        0.0054931640625,
                        0.00274658203125,
                        0.001373291015625,
                        0.0006866455078125,
                        3.4332275390625e-4,
                        1.71661376953125e-4,
                        8.58306884765625e-5,
                        4.291534423828125e-5,
                        2.145767211914063e-5,

                    ],
                    origin:[-180.0,90.0],
                    tileSize: [256, 256]
                })
            });
            func.drawLineL = new ol.layer.Vector({
                source: new ol.source.Vector({wrapX: false})
            });
            func.map = new ol.Map({
                view: new ol.View({
                    center: [116.38,39.90],
                    zoom: 4,
                    minZoom: 4,
                    maxZoom: 17,
                    projection: 'EPSG:4326'
                }),
                layers: [
                    new ol.layer.Tile({
                        source:tileWMSSource
                    }),
                    func.locateL,
                    func.drawLineL
                ],
                target: 'divCalAreaMap'
            });
            func.drawLine();
        },
        drawFeature:null,//地图线feature
        drawLine:function(){//地图画线
            let draw = new ol.interaction.Draw({
                source: func.drawLineL.getSource(),
                type: "LineString"
            });
            func.map.addInteraction(draw);

            draw.on('drawstart', function (e) {
                if(func.drawFeature!=null){//移除上一条线
                    func.resetLine();
                }
            });
            draw.on('drawend', function (e) {
                func.drawFeature=e.feature; // 这个应该就是划线完成之后的线的对象
                  // let lineGeom=func.drawFeature.getGeometry();
                  // let lineLength=lineGeom.getLength(); 这两行就是获取划线的线的长度；

                let dx=$("#divWaterTaskInfo #parmdx").val(); // 节点纵向距离
                let per=dx/lineLength;//每段所占百分比
                let nodeNum=parseInt(1/per);//线上的节点个数
                let nodeArr=new Array();//线上各节点经纬度
                nodeArr.push(lineGeom.getCoordinates()[0]);//起始位置节点的经纬度
                for(let i=0;i<nodeNum;i++){
                    nodeArr.push(lineGeom.getCoordinateAt(per*(i+1)));
                }

---


                // let coords=e.feature.getGeometry().getCoordinates();
                // coords.unshift(func.locateL.getSource().getFeatures()[0].getGeometry().getCoordinates());
                // let f = new ol.Feature({geometry:new ol.geom.LineString(coords)});
                // func.drawLineL.getSource().clear();
                // func.drawLineL.getSource().addFeature(f);


                /*console.log(func.drawFeature.getGeometry().getCoordinates());
                let lineLength=func.drawFeature.getGeometry().getLength();
                lineLength=lineLength/360*(2 * Math.PI * 6371004);//度转米
                let per=100/lineLength;//每段所占百分比
                let nodeNum=parseInt(1/per);//线上的节点个数
                let nodeArr=new Array();
                nodeArr.push(func.drawFeature.getGeometry().getCoordinates()[0]);//起始位置节点的经纬度
                for(let i=0;i<nodeNum;i++){
                    nodeArr.push(func.drawFeature.getGeometry().getCoordinateAt(per*(i+1)));
                }
                $.ajax({
                    url:'waterCR/simpleDistFile1D',
                    type:'post',
                    data:JSON.stringify({
                        "taskid":'20190505102511',//$("#formWaterTask #taskid").val(),
                        "nodeArr":nodeArr
                    }),
                    contentType:'application/json;charset=utf-8',
                    dataType:"json",
                    success:function(res){
                    },
                    error:function(){
                    },
                    complete:function(){
                    }
                })*/
            });
        },
        resetLine:function(){//清除地图画线
            if(func.drawFeature!=null){
                func.drawLineL.getSource().removeFeature(func.drawFeature);
                func.drawFeature=null;
            }
        },
```



### 地图上创建一个经纬度feature，并设置id 画圈


```
url: "tbnucfacorg/getTbnucfacorgByid",
data: {"orgid": '4a503887-9fa3-4cd4-aa2a-61f801d0a847'},
dataType: 'json',
success: function (data) {
    var lon = data.tbnucfacorg.longitude;
    var lat = data.tbnucfacorg.latitude;
    var orgid = data.tbnucfacorg.orgid;
    coord = [parseFloat(lon), parseFloat(lat)];
    var point = new ol.Feature({
        geometry: new ol.geom.Point(coord),
        orgname: data.tbnucfacorg.orgname
    });
    point.setId(orgid);
    // sectionL.getSource().clear();
    // sectionL2.getSource().clear();
    // nucfacOrgL.getSource().clear();
    nucfacOrgL.getSource().addFeature(point);



}

* 构建方形圆形范围：


//创建影响范围 5千米
    function createCircle(coord, r, text, id) {
        // sectionL.getSource().clear();
        var r1 = r / (2 * Math.PI * 6378137.0) * 360;
        var bufferCircle1 = new ol.geom.Circle(coord, r1, 'XY');
        var polygon = ol.geom.Polygon.fromCircle(bufferCircle1, 96);
        var feature = new ol.Feature({
            geometry: polygon
        });
        feature.setId(id);
        feature.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff8147',
                width: 2
            }),
        }));
        sectionL.getSource().addFeature(feature);
        var textPoint = [coord[0], coord[1] + r1];
        var f = new ol.Feature({geometry: new ol.geom.Point(textPoint)});
        f.setId(id + 'text')
        f.setStyle(
            new ol.style.Style({
                text: new ol.style.Text({
                    font: '16px 微软雅黑',
                    text: text,
                    textBaseline: 'bottom',
                    stroke: new ol.style.Stroke({
                        color: '#ffffff',
                        width: 0.02
                    }),
                    fill: new ol.style.Fill({
                        color: '#ff8147'
                    }),
                }),
            })
        )
        sectionL.getSource().addFeature(f);
    }

    //创建影响范围 10千米
    function createCircle2(coord, r, text, state, id) {
        // sectionL2.getSource().clear();
        var r1 = r / (2 * Math.PI * 6378137.0) * 360;
        var bufferCircle1 = new ol.geom.Circle(coord, r1, 'XY');
        var polygon = ol.geom.Polygon.fromCircle(bufferCircle1, 96);
        var feature = new ol.Feature({
            geometry: polygon
        });
        feature.setId(id);
        feature.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff8147',
                width: 2
            }),
        }));
        sectionL2.getSource().addFeature(feature);
        if (state) {
            map.getView().fit(polygon, map.getSize());
        }
        var textPoint = [coord[0], coord[1] + r1];
        var f = new ol.Feature({geometry: new ol.geom.Point(textPoint)});
        f.setId(id + 'text')
        f.setStyle(
            new ol.style.Style({
                text: new ol.style.Text({
                    font: '16px 微软雅黑',
                    text: text,
                    textBaseline: 'bottom',
                    stroke: new ol.style.Stroke({
                        color: '#ffffff',
                        width: 0.02
                    }),
                    fill: new ol.style.Fill({
                        color: '#ff8147'
                    }),
                }),
            })
        )
        sectionL2.getSource().addFeature(f);
    }

    //创建方形范围 评价区域
    function createRec(coord, r, text, id) {
        var r1 = r / (2 * Math.PI * 6378137.0) * 360;
        var bottomleft = [coord[0] - r1, coord[1] - r1];//左下角
        var topright = [coord[0] + r1, coord[1] + r1];//右上角
        var extent = [bottomleft[0], bottomleft[1], topright[0], topright[1]];
        var polygon = ol.geom.Polygon.fromExtent(extent);
        var feature = new ol.Feature({
            geometry: polygon
        });
        feature.setId(id);
        feature.setStyle(new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: '#ff8147',
                width: 1
            }),
        }));
        recL.getSource().addFeature(feature);
        var textPoint = [coord[0], coord[1] + r1];
        var f = new ol.Feature({geometry: new ol.geom.Point(textPoint)});
        f.setId(id + 'text')
        f.setStyle(
            new ol.style.Style({
                text: new ol.style.Text({
                    font: '16px 微软雅黑',
                    text: text,
                    textBaseline: 'bottom',
                    stroke: new ol.style.Stroke({
                        color: '#ffffff',
                        width: 0.02
                    }),
                    fill: new ol.style.Fill({
                        color: '#ff8147'
                    }),
                }),
            })
        )
        recL.getSource().addFeature(f);
    }
```


### Openlayers 添加多个feature ，并且设置到指定对象中


```js
$.ajax({
        url: "tbnucfacpoint/getPointByOrgidAndType",
        data: {"orgid": orgid, "type": type},
        dataType: 'json',
        success: function (data) {
            /*if(treeNode.chname == "中心点" && data.data != null && data.data.length>0){
                curP = [parseFloat(data.data[0].longitude),parseFloat(data.data[0].latitude)];
                addSection(curP);
            }else */
            if (data.data != null && data.data.length > 0) {
                var points = [];
                var count = 0;
                data.data.forEach(function (item) {
                    var lon = item.longitude;
                    var lat = item.latitude;
                    var point = new ol.Feature({geometry: new ol.geom.Point([lon, lat])});
                    point.setId(item.longitude.pointid);
                    point.setProperties({featureType: item.pointname});
                    points.push(point);
                    count++;
                });
                if (treeNode.chname == "释放点") {
                    releaseL.getSource().addFeatures(points);
                    pointFeatures.release[orgid] = points;
                }
            }
        }
}
```


### 网格划线


```js

* 链接不同经纬度点，划线
$.ajax({
            url: "airs/getFarFieldNetworkL",
            data: {lon: coord[0], lat: coord[1]},
            dataType: 'json',
            success: function (data) {
                var lines = [];
                var points = data.data;
                for (var i = 0; i < 204; i++) {
                    var pointD = points[i][0];
                    var pointU = points[i][1];
                    lines.push(new ol.Feature({geometry: new ol.geom.LineString([[pointD[0], pointD[1]], [pointU[0], pointU[1]]])}));//存放所有竖线所用的点
                }
                farFieldNetworkL.getSource().clear();
                farFieldNetworkL.getSource().addFeatures(lines)
            }
        });
```

### openlayers 点击按钮画点并且连起来







