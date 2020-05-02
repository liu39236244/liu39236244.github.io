# OlWind 学习


# 配置参数详解


## 需要引入的包

```
<link href="../js/ol.css" rel="stylesheet" />
<script src="../js/ol.js"></script>
<script src="../lib/v5.1.3-dist/OlWind.js"></script>
<script src="../lib/jquery/jquery3.3.1.min.js"></script>
```

* 注意：如果requirejs 中定义了 OlWind、jquery、ol.js 依赖 在path 中  ； ol.css ，还有ol.js 都需要在shim中定义其依赖，

```
// 如果使用  // winStreamLayer = new windLayer.OlWind(data, {}) 设定
//windlayer 也需要设定
'windLayer':{
           deps: ['ol'],
           exports: 'windLayer'
       },

// 如果设置 // wind = new OlWind(data, {}) 设置 设置图层 的画需要设置，否则提示imagecanvas 找不到的js错误，而且不能使用OlWind这种方式
  'OlWind':{
           deps:['ol'],
           exports:'OlWind'
       }

// ol.js 也需要设置依赖
'ol': {
           deps: ['jquery','ol_form','css!../js/ol/ol.css'],
           exports: 'ol'
       },

```

## function js  获取数据


```java
var initwinStreamdata = function (windata) {
        var data = [
            {
                "header": {
                    "discipline": 0,
                    "disciplineName": "Meteorological products",
                    "gribEdition": 2,
                    // "gribLength": 132662,
                    "gribLength": 77171,
                    "center": 7,
                    "centerName": "US National Weather Service - NCEP(WMC)",
                    "subcenter": 0,
                    "refTime": "2016-04-06T12:00:00.000Z",
                    "significanceOfRT": 1,
                    "significanceOfRTName": "Start of forecast",
                    "productStatus": 0,
                    "productStatusName": "Operational products",
                    "productType": 1,
                    "productTypeName": "Forecast products",
                    "productDefinitionTemplate": 0,
                    "productDefinitionTemplateName": "Analysis/forecast at horizontal level/layer at a point in time",
                    "parameterCategory": 2,
                    "parameterCategoryName": "Momentum",
                    "parameterNumber": 2,
                    "parameterNumberName": "U-component_of_wind",
                    "parameterUnit": "m.s-1",
                    "genProcessType": 2,
                    "genProcessTypeName": "Forecast",
                    // "forecastTime": 9,
                    "forecastTime": 0,
                    "surface1Type": 100,
                    "surface1TypeName": "Isobaric surface",
                    // "surface1Value": 50000,
                    "surface1Value": 10,
                    "surface2Type": 255,
                    "surface2TypeName": "Missing",
                    "surface2Value": 0.0,
                    "gridDefinitionTemplate": 0,
                    "gridDefinitionTemplateName": "Latitude_Longitude",
                    "numberPoints": 1271,
                    "shape": 6,
                    "shapeName": "Earth spherical with radius of 6,371,229.0 m",
                    "gridUnits": "degrees",
                    "resolution": 48,
                    "winds": "true",
                    "scanMode": 0,
                    "nx": 41,
                    "ny": 31,
                    "basicAngle": 0,
                    "subDivisions": 0,
                    "lo1": 46,
                    "la1": 10,
                    "lo2": 87,
                    "la2": 41,
                    "dx": 1.0,
                    "dy": 1.0
                },
                 "data": windata[0]
            },
            {
                "header": {
                    "discipline": 0,
                    "disciplineName": "Meteorological products",
                    "gribEdition": 2,
                    // "gribLength": 132662,
                    "gribLength": 77171,
                    "center": 7,
                    "centerName": "US National Weather Service - NCEP(WMC)",
                    "subcenter": 0,
                    "refTime": "2016-04-06T12:00:00.000Z",
                    "significanceOfRT": 1,
                    "significanceOfRTName": "Start of forecast",
                    "productStatus": 0,
                    "productStatusName": "Operational products",
                    "productType": 1,
                    "productTypeName": "Forecast products",
                    "productDefinitionTemplate": 0,
                    "productDefinitionTemplateName": "Analysis/forecast at horizontal level/layer at a point in time",
                    "parameterCategory": 2,
                    "parameterCategoryName": "Momentum",
                    "parameterNumber": 3,
                    "parameterNumberName": "V-component_of_wind",
                    "parameterUnit": "m.s-1",
                    "genProcessType": 2,
                    "genProcessTypeName": "Forecast",
                    // "forecastTime": 9,
                    "forecastTime": 0,
                    "surface1Type": 100,
                    "surface1TypeName": "Isobaric surface",
                    // "surface1Value": 50000,
                    "surface1Value": 10,
                    "surface2Type": 255,
                    "surface2TypeName": "Missing",
                    "surface2Value": 0.0,
                    "gridDefinitionTemplate": 0,
                    "gridDefinitionTemplateName": "Latitude_Longitude",
                    "numberPoints": 1271,
                    "shape": 6,
                    "shapeName": "Earth spherical with radius of 6,371,229.0 m",
                    "gridUnits": "degrees",
                    "resolution": 48,
                    "winds": "true",
                    "scanMode": 0,
                    "nx": 41,
                    "ny": 31,
                    "basicAngle": 0,
                    "subDivisions": 0,
                    "lo1": 46,
                    "la1": 10,
                    "lo2": 87,
                    "la2": 41,
                    "dx": 1.0,
                    "dy": 1.0
                },
                 "data": windata[1]

            }
        ]
        if (winStreamLayer) {
            map.removeLayer(winStreamLayer)
            winStreamLayer = null;
        }

        winStreamLayer=new OlWind(data, {
        // winStreamLayer = new windLayer.OlWind(data, {
            layerName: 'StreamLayerdata',
            projection: 'EPSG:4326',
            ratio: 1,
            map: map,
            colorScale: [
                // 越往下 红色越深，数值越大，风越快
                // 蓝-红
            // "rgb(36,104, 180)",
            // "rgb(60,157, 194)",
            // "rgb(128,205,193 )",
            // "rgb(151,218,168 )",
            // "rgb(198,231,181)",
            // "rgb(238,247,217)",
            // "rgb(255,238,159)",
            // "rgb(252,217,125)",
            // "rgb(255,182,100)",
            // "rgb(252,150,75)",
            // "rgb(250,112,52)",
            // "rgb(245,64,32)",
            // "rgb(237,45,28)",
            // "rgb(220,24,32)",
            // "rgb(180,0,35)"

            // 红- 蓝
            // "rgb(180,0,35)",
            // "rgb(220,24,32)",
            // "rgb(237,45,28)",
            // "rgb(245,64,32)",
            // "rgb(250,112,52)",
            // "rgb(252,150,75)",
            // "rgb(255,182,100)",
            // "rgb(252,217,125)",
            // "rgb(255,238,159)",
            // "rgb(238,247,217)",
            // "rgb(198,231,181)",
            // "rgb(151,218,168 )",
            // "rgb(128,205,193 )",
            // "rgb(60,157, 194)",

            // 偏蓝色系
            "rgb(42,11,180)",
            "rgb(87,12,180)",
            "rgb(119,46,205)",
            "rgb(20,80,218)",
            "rgb(49,113,231)",
            "rgb(81,129,247)",
            "rgb(59,242,255)",
            "rgb(137,252,244)",
            "rgb(134,255,112)",
            "rgb(252,150,75)",
            "rgb(250,112,52)",
            "rgb(245,64,32)",
            "rgb(237,45,28)",
            "rgb(220,24,32)",
            "rgb(180,0,35)"



            ],
            minVelocity: 0,
            maxVelocity: 10,
            velocityScale: 0.1,
            particleAge: 90,
            lineWidth: 2,
            particleMultiplier: 0.0005,

            // minVelocity: 0, // 粒子强度最小的速度 (m/s)
            // maxVelocity: 15, // 粒子强度最大的速度 (m/s)  官方例子描述 0-15  按照上面配色方案，红色表示速度越小
            // velocityScale: 0.05,   // 风速的比例  官网范围 （ 0-0.1）：这个配置参数能控制线条长度越大线条越长
            // particleAge: 0,  // 官网范围 （ 0-180）重绘之前生成的离子数量的最大帧数，数值越大线条消失的就越慢
            // lineWidth: 1, // 官网范围 （ 1-10） 绘制粒子的线宽 ， 但是  0.1  都是可以的
            // particleMultiplier: 0.001, // 官网范围 （ 1-10） 也就是线条的密度 ，一般0.001 就已经比较密集了

        });
         // winStreamLayer.appendTo(map)
        map.addLayer(winStreamLayer)

    }

```
