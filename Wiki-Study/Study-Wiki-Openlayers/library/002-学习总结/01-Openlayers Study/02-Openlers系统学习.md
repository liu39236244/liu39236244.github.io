# Openlayers 3 系统学习

## [点我中文api地址](http://weilin.me/ol3-primer/index.html)

## [官方api](https://openlayers.org/en/latest/apidoc/)



## Openlayers 坐标 以及坐标系


### 坐标系与坐标系投影



坐标系及投影
关于原点，方向，单位等等的相关定义和描述，组成了我们常说的坐标系。谈到坐标系，就会想起初中数学中经常接触到的二维笛卡尔坐标系，在图形学中也会遇到三维坐标系，在GIS中我们需要地理坐标系。但它并不像笛卡尔坐标系那样简单，学过地理知识就知道，地球并不是一个完全规则的球体。在不同的地区，为了在数学上表示它，就出现了多种不同的参考椭球体，比如克拉索夫斯基(Krasovsky)椭球体，WGS1984椭球体，更多的椭球体参见[参考椭球体](https://zh.wikipedia.org/wiki/%E5%8F%82%E8%80%83%E6%A4%AD%E7%90%83%E4%BD%93)。

在参考椭球体的基础上，就发展出了不同的地理坐标系，比如我国常用的WGS84，北京54，西安80坐标系，欧洲，北美也有不同的坐标系。北京54使用的是克拉索夫斯基(Krasovsky)椭球体，WGS84使用的是WGS1984椭球体。由此可见，多个坐标系是源于地理的复杂性。

由于存在着多种坐标系，即使同样的坐标，在不同的坐标系中，也表示的是不同的位置，这就是大家经常遇到的偏移问题的根源，要解决这类问题，就需要纠偏，把一个坐标系的坐标转换成另一个坐标系的坐标。由于WGS84是全球通用的坐标系，涉及到多个坐标系与它之间的转换，所以在此做个简单的介绍。

<label style="color:red">

WGS84，全称World Geodetic System 1984，是为GPS全球定位系统使用而建立的坐标系统。

</label>

通过遍布世界的卫星观测站观测到的坐标建立，其初次WGS84的精度为1-2m，在1994年1月2日，通过10个观测站在GPS测量方法上改正，得到了WGS84（G730），G表示由GPS测量得到，730表示为GPS时间第730个周。

1996年，National Imagery and Mapping Agency (NIMA) 为美国国防部 (U.S.Department of Defense, DoD)做了一个新的坐标系统。这样实现了新的WGS版本WGS（G873）。其因为加入了美国海军天文台和北京站的改正，其东部方向加入了31-39cm 的改正。所有的其他坐标都有在1分米之内的修正。

关于北京54和西安80坐标系，请自行通过网络查找相关资料进行了解。

有了坐标系后，我们就能精确的表示地球上的每一个位置，但为什么还需要投影呢？投影是为了把不可展的椭球面描绘到平面上，它使用几何透视方法或数学分析的方法，将地球上的点和线投影到可展的曲面(平面、园柱面或圆锥面)上，再将此可展曲面展成平面，建立该平面上的点、线和地球椭球面上的点、线的对应关系。正是因为有投影，大家才能在网页上看到二维平面的地球地图。

投影方式也多种多样，其中有一种投影叫墨卡托投影(Mercator Projection)，广泛使用于网页地图，对于OpenLayers 3的开发者而言，尤其重要，详情参见[墨卡托投影](https://baike.baidu.com/item/%E5%A2%A8%E5%8D%A1%E6%89%98%E6%8A%95%E5%BD%B1)。

如果不了解上面这些基本知识，在使用OpenLayers 3的过程中，会感觉寸步难行，相反，则得心应手。

---


## Openlayers3 使用的坐标系

原文地址：http://weilin.me/ol3-primer/ch04/04-04.html


目前OpenLayers 3支持两种投影，一个是EPSG:4326，等同于WGS84坐标系，参见[详情](https://spatialreference.org/ref/epsg/wgs-84/)。另一个是EPSG:3857[详情](https://spatialreference.org/ref/sr-org/7483/)。一个是全球通用的，一个是web地图专用的，自然OpenLayers 3支持它们。在使用过程中，需要注意OpenLayers 3默认使用的是EPSG:3857。这也是为什么前面的代码里需要进行坐标转换的原因。 既然支持EPSG:4326，为什么还要转换？当然是可以不用转换的，但前提是你得指定使用具体那种投影，

## 几种坐标系的转换


### 博主原文地址：https://www.imooc.com/article/details/id/23512

### 国内几种坐标系总结：https://blog.csdn.net/m0_37738114/article/details/80452485

## Openlayers 加载几种在线地图案例


```html
<div id="map" style="width: 100%"></div>
<input type="radio" checked="checked" name="mapSource" onclick="switch2OSM();" />OpenStreetMap地图
<input type="radio" name="mapSource" onclick="switch2BingMap();" />Bing地图
<input type="radio" name="mapSource" onclick="switch2StamenMap();" />Stamen地图
<input type="radio" name="mapSource" onclick="switch2MapQuest();" />MapQuest地图

<script>

    // Open Street Map 地图层
    var openStreetMapLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });

    // Bing地图层
    var bingMapLayer = new ol.layer.Tile({
        source: new ol.source.BingMaps({
            key: 'AkjzA7OhS4MIBjutL21bkAop7dc41HSE0CNTR5c6HJy8JKc7U9U9RveWJrylD3XJ',
      imagerySet: 'Road'
        })
    });

    // Stamen地图层
    var stamenLayer = new ol.layer.Tile({
        source: new ol.source.Stamen({
            layer: 'watercolor'
        })
    });

    // MapQuest地图层
    var mapQuestLayer = new ol.layer.Tile({
        source: new ol.source.MapQuest({
            layer: 'osm'
        })
    });

    // 创建地图
  var map = new ol.Map({
        layers: [
            openStreetMapLayer
        ],
        view: new ol.View({
            // 设置成都为地图中心
            center: [104.06, 30.67],
            projection: 'EPSG:4326',
            zoom: 10
        }),
        target: 'map'
  });

  function switch2OSM() {
      // 先移除当前的地图，再添加Open Street Map 地图
      map.removeLayer(map.getLayers().item(0));
      map.addLayer(openStreetMapLayer);
  }

  function switch2BingMap() {
      // 先移除当前的地图，再添加Bing地图
      map.removeLayer(map.getLayers().item(0));
      map.addLayer(bingMapLayer);
  }

  function switch2StamenMap() {
      // 先移除当前的地图，再添加stamen地图
      map.removeLayer(map.getLayers().item(0));
      map.addLayer(stamenLayer);
  }

  function switch2MapQuest() {
      // 先移除当前的地图，再添加MapQuest地图
      map.removeLayer(map.getLayers().item(0));
      map.addLayer(mapQuestLayer);
  }
</script>
```


## Openlayers 图层的设置字体以及线条颜色


```javascript
contourL = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: function (f, r) {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#00EEFF', // 线条颜色
                        width: 2 // 线条宽度
                    }),
                    text: new ol.style.Text({
                        text: f.getProperties().m.toString() + "hPa", // 字体内容
                        fill: new ol.style.Fill({color: '#FFFFFF'}) // 字颜色
                    }),
                    image: new ol.style.Icon({
                       src: './img/map/weatherStation.png', // 图标图片地址
                       anchor: [0.5, 0],
                       // scale:0.1
                   })
                });
                var weight = f.getProperties().weight;
                var fillC = colors[6];
                var m = maxD;
                if (weight >= minD && weight < minD + 0.5 * m) {
                    fillC = colors[6];
                } else if (weight >= minD + 0.5 * m && weight < minD + 0.75 * m) {
                    fillC = colors[5];
                } else if (weight >= minD + 0.75 * m && weight < minD + 0.80 * m) {
                    fillC = colors[4];
                } else if (weight >= minD + 0.80 * m && weight < minD + 0.85 * m) {
                    fillC = colors[3];
                } else if (weight >= minD + 0.85 * m && weight < minD + 0.90 * m) {
                    fillC = colors[2];
                } else if (weight >= minD + 0.90 * m && weight < minD + 0.95 * m) {
                    fillC = colors[1];
                } else if (weight >= minD + 0.95 * m && weight < minD + 1 * m) {
                    fillC = colors[0];
                }
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        col5or: '#00EEFF',
                        width: 2
                    }),
                    fill: new ol.style.Fill({color: fillC})
                    //text: new ol.style.Text({
                    //    text: txt.toString(),
                    //    fill: new ol.style.Fill({ col5or: '#FFFFFF' })
                    //})
                })
            }
        });
        //流线风场图层
        windStream = new ol.layer.Vector({
            source: new ol.source.Vector(),
            style: function (f, r) {
                return new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: '#00EEFF',
                        width: 2
                    }),
                });
            }
        });


        //核设施图层
         var facL = new ol.layer.Vector({
             source: new ol.source.Vector(),
             style: function (f, r) {
                 // 这个是福清核电站 组织id
                 if (f.getProperties().orgid == "4a503887-9fa3-4cd4-aa2a-61f801d0a847") {
                     return new ol.style.Style({
                         image: new ol.style.Icon({
                             src: './img/map/factory1.png', // 黄色图标
                             anchor: [0.5, 0.5],
                             scale: 0.6
                         }),
                         text: new ol.style.Text({
                             text: f.getProperties().orgname,
                             fill: new ol.style.Fill({
                                 color: '#ff0e1b'
                             }),
                             font: 'bold 15px serif',
                             offsetX: 55,
                             stroke: new ol.style.Stroke({
                                 color: '#FFFFFF',
                                 width: 0.08
                             })
                         })
                     })
                 } else {
                     return new ol.style.Style({
                         image: new ol.style.Icon({
                             src: './img/map/factory1.png',
                             anchor: [0.5, 0.5],
                             scale: 0.6
                         }),
                         text: new ol.style.Text({
                             text: f.getProperties().orgname,
                             fill: new ol.style.Fill({
                                 color: '#ffb921'
                             }),
                             font: 'bold 15px serif',
                             offsetX: 55,
                             stroke: new ol.style.Stroke({
                                 color: '#FFFFFF',
                                 width: 0.08
                             })
                         })
                     })
                 }
             },
             name: 'facL'
         });
        //核设施 图层添加feature
         var fs = [];
         $.ajax({
             url: "tbnucfacorg/selectCityTbnucfacorg",
             dataType: 'json',
             async: false,
             success: function (result) {
                 var list = result.list;
                 for (var i = 0; i < list.length; i++) {
                     var coord = [parseFloat(list[i].longitude), parseFloat(list[i].latitude)];
                     var f = new ol.Feature({
                         geometry: new ol.geom.Point(coord),
                         orgid: list[i].orgid,
                         orgname: list[i].orgname,
                         parentid: list[i].parentid,

                     });
                     fs.push(f);
                 }
                 facL.getSource().addFeatures(fs);

             }
         });


        //省界图层
        var proL = new ol.layer.Vector({
            // opacity: 0.5, // 不透明度
            source: new ol.source.Vector(),
            style: function (f, r) {
                return new ol.style.Style({
                    // stroke: new ol.style.Stroke({
                    //     color: '#FFFFFF',
                    //     width: 2,
                    // }),
                    fill: new ol.style.Fill({
                        color: 'rgba(100,255,0,0.5)'
                    }),
                    text: new ol.style.Text({
                        text: '福建省',
                        fill: new ol.style.Fill({
                            color: '#ffb921'
                        }),
                        font: 'bold 20px serif',
                        stroke: new ol.style.Stroke({
                            color: '#FFFFFF',
                            width: 0.5
                        })
                        // overflow: 'true'

                    })
                })
            },
            name: 'proL'
        });
        // 省界图层注意需要读取 一个地区的经纬度文件，然后 添加feature

        $.getJSON("js/language/data.json", function (result) {
           console.log(result.type);
           // alert(result.NAME);
           var fea = new ol.Feature({
               geometry: new ol.geom.MultiPolygon(result.geometry.coordinates),
           });
           proL.getSource().addFeature(fea);
       });

```

### ol.style.text

## 这里是文字格式设置


* 参数如下


| 参数           |    类型    |默认值|说明 (原文)    |解释|
| :------------- | :---------| :---------| :------------- | :--------|
| placement    |	[module:ol/style/TextPlacement](https://openlayers.org/en/latest/apidoc/module-ol_style_TextPlacement.html) string| 无，但是数据类型页面介绍的POINT类型 |Text placement.|文字放置位置：有 POINT、LINE 两种，默认是<span style="color:red">注意：参数中的point，line 要写成小写、小写、小写、重要的事说三遍</span> |
|rotateWithView |	boolean	|false|Whether to rotate the text with the view.|当地图 shift+alt 加鼠标旋转时候文字是否也旋转，默认false，文字始终保持一个方向显示|
|maxAngle	|number	|暂无|When placement is set to 'line', allow a maximum angle between adjacent characters. The expected value is in radians, and the default is 45° (Math.PI / 4).|当placement 设置为 line 的时候，允许文字之间旋转的最大角度，默认是45度，就是layer上的文字旋转角度差不能大于45度|
|textBaseline	| string|	'middle'|Text base line. Possible values: 'bottom',  'top', 'middle', 'alphabetic', 'hanging', 'ideographic'.| 跟css中的 设置文字上线条的样式一样，参数说明的是文字实在线条上方还是下方还是线条中间，|
|rotation |	number|	0 水平|	Rotation in radians (positive rotation clockwise).|顺时针旋转文字显示方向，用弧度表示，0 代表水平方向文字，Math.PI/2 则垂直向下；注意 <span style="color:red">这个跟style 中的 rotation: r 不一样，rotation 中 0 代表的是数值向上，但也是按照顺时针，Math.Pi/2 则代表90度，则水平向右，Math.PI 则代表180 表示竖直向下</span> new ol.style.Style({<br/>                    image: new ol.style.Icon({<br/>                        src: getSrc(w),<br/>                        anchor: [0.5, 0.5],<br/>                        rotation: r<br/>                    })<br/>                })|  


## view

## 官网api

地址：https://openlayers.org/en/latest/apidoc/module-ol_View-View.html   


## 限制地图范围
```html

<body>
    <div id="map" style="width: 100%"></div>
    <script>
      new ol.Map({
            layers: [
                new ol.layer.Tile({source: new ol.source.OSM()})
            ],
            view: new ol.View({
                // 设置地图中心范围
                extent: [102, 29, 104, 31],
                // 设置成都为地图中心
                center: [104.06, 30.67],
                projection: 'EPSG:4326',
                zoom: 10
            }),
            target: 'map'
      });
    </script>
</body>
```

就只是添加了 extent: [102, 29, 104, 31],这行代码就实现了功能。extent参数类型为[minX, minY, maxX, maxY]的ol.Extent，很容易记住。

如果对上面的地图进行缩小，然后再看地图，是否发现范围[102, 29, 104, 31]外的区域也显示出来了，而这并不是我们期望看到的。这时请注意仔细看extent参数的说明，这个范围指的是地图中心的限制范围，而不是整个地图显示的范围。那遇到这个问题该怎么办？我们发现，当我们地图放大后，这个问题并不那么明显，地图放大的越大，固定窗口显示的实际地理范围越小。一个简单的办法就是限制地图不能无限缩小，具体允许缩小到哪一级，可通过实际缩小地图到刚好填满整个窗口(id为map的div)来确定。限制地图缩放级别可参见下一节。

这是一种简单的做法，虽然有效，但并不精确，如果要做到非常精确，还需要学习后面更多的知识(分辨率等)，在后续章节会有更深入的说明和示例。

## 缩放级别


缩放试试便知，地图现在不能无限缩小放大了，代码也是非常的简单：

```html
<body>
    <div id="map" style="width: 100%"></div>
    <script>
      new ol.Map({
            layers: [
                new ol.layer.Tile({source: new ol.source.OSM()})
            ],
            view: new ol.View({
                // 设置成都为地图中心
                center: [104.06, 30.67],
                projection: 'EPSG:4326',
                zoom: 10,
                // 限制地图缩放最大级别为14，最小级别为10
                minZoom: 10,
                maxZoom: 14
            }),
            target: 'map'
      });
    </script>
</body>
```


很多初学者问这个问题，其实仔细阅读一下API文档就会知道如何编码，以至于很多已经知道这个功能的其他开发者不愿意回答这么基础的功能。如果只是显示最小级别则只用设置minZoom的值即可，反之只设置maxZoom的值。

除了使用minZoom和maxZoom之外，还可以使用minResolution和maxResolution，其具体原理和使用，在分辨率小节会有介绍。对于开发者而言，建议使用minZoom和maxZoom，简单直接。



## 自适配区域


```html
<body>
    <div id="map" style="width: 100%"></div>
    <input type="button" value="显示成都" onclick="fitToChengdu();" />
    <script>
      var map = new ol.Map({
            layers: [
                new ol.layer.Tile({source: new ol.source.OSM()})
            ],
            view: new ol.View({
                // 设置成都为地图中心
                center: [104.06, 30.67],
                projection: 'EPSG:4326',
                zoom: 10
            }),
            target: 'map'
      });

      function fitToChengdu() {
          // 让地图最大化完全地显示区域[104, 30.6, 104.12, 30.74]
          map.getView().fit([104, 30.6, 104.12, 30.74], map.getSize());
      }
    </script>
</body>

```
只用了一行代码，ol.View的fit函数很强大，希望初学者能认真仔细的查看API文档，它的第三个参数还可以设置更多的选项，以适应更多的需要。关于更多的使用，参见[官网例子](https://openlayers.org/en/latest/apidoc/module-ol_View-View.html#fit)


## 暂时零碎

### 视图change 改变事件

```
view.on('change', function () {

    if (view.getZoom() > 8) {
        proL.setVisible(false);
    } else {
        proL.setVisible(true);
    }
});
```



## source  layer



<section class="normal" id="section-">

                        <h1 id="source和layer">Source和Layer</h1>
<p>在前面的例子中，已经对<code>Source</code>和<code>Layer</code>有所了解了。比如我们加载了Open Street Map的地图。然而世界上的地图并不只有Open Street Map，还有很多其他的地图，比如Google地图，天地图，高德地图，百度地图等。如果OpenLayers支持的地图来源越多，就会越适用，越强大。除了加载基本的地图之外，GIS还需要加载很多其他的信息，比如街道名称，商店名称，公交站点，道路等等。那么在OpenLayers 3中，具体该如何把这些添加在地图上呢？</p>
<p>首先需要明白的一点是，<code>Source</code>和<code>Layer</code>是一对一的关系，有一个<code>Source</code>，必然需要一个<code>Layer</code>，然后把这个<code>Layer</code>添加到<code>Map</code>上，就可以显示出来了。通过官网的API搜索<code>ol.source</code>可以发现有很多不同的<code>Source</code>，但归纳起来共三种：<code>ol.source.Tile</code>，<code>ol.source.Image</code>和<code>ol.source.Vector</code>。 </p>
<ul>
<li><code>ol.source.Tile</code>对应的是瓦片数据源，现在网页地图服务中，绝大多数都是使用的瓦片地图，而OpenLayers 3作为一个WebGIS引擎，理所当然应该支持瓦片。</li>
<li><code>ol.source.Image</code>对应的是一整张图，而不像瓦片那样很多张图，从而无需切片，也可以加载一些地图，适用于一些小场景地图。</li>
<li><code>ol.source.Vector</code>对应的是矢量地图源，点，线，面等等常用的地图元素(Feature)，就囊括到这里面了。这样看来，只要这两种<code>Source</code>就可以搞定80%的需求了。</li>
</ul>
<p>从复杂度来分析，<code>ol.source.Image</code>和<code>ol.source.Vector</code>都不复杂，其数据格式和来源方式都简单。而<code>ol.source.Tile</code>则不一样，由于一些历史问题，多个服务提供商，多种标准等诸多原因，导致要支持世界上大多数的瓦片数据源，就需要针对这些差异提供不同的<code>Tile</code>数据源支持。在更进一步了解之前，我们先来看一下OpenLayers 3现在支持的<code>Source</code>具体有哪些：


<img src="assets/002/20190611-17be38fd.png" alt="ol.source.Tile类图"></p>


<p>上图中的类是按照继承关系，从左向右展开的，左边的为父类，右边的为子类。在使用时，一般来说，都是直接使用叶子节点上的类，基本就可以完成需求。父类需要自己进一步扩展或者处理才能有效使用的。</p>
<p>我们先了解最为复杂的<code>ol.source.Tile</code>，其叶子节点类有很多，大致可以分为几类：</p>
<ul>
<li>在线服务的<code>Source</code>，包括<code>ol.source.BingMaps</code>(使用的是微软提供的Bing在线地图数据)，<code>ol.source.MapQuest</code>(使用的是MapQuest提供的在线地图数据)<font color="#ff0000">(注: 由于MapQuest开始收费，ol v3.17.0就移除了<code>ol.source.MapQuest</code>)</font>，<code>ol.source.OSM</code>(使用的是Open Street Map提供的在线地图数据)，<code>ol.source.Stamen</code>(使用的是Stamen提供的在线地图数据)。没有自己的地图服务器的情况下，可直接使用它们，加载地图底图。</li>
<li>支持协议标准的<code>Source</code>，包括<code>ol.source.TileArcGISRest</code>，<code>ol.source.TileWMS</code>，<code>ol.source.WMTS</code>，<code>ol.source.UTFGrid</code>，<code>ol.source.TileJSON</code>。如果要使用它们，首先你得先学习对应的协议，之后必须找到支持这些协议的服务器来提供数据源，这些服务器可以是地图服务提供商提供的，也可以是自己搭建的服务器，关键是得支持这些协议。</li>
<li>ol.source.XYZ，这个需要单独提一下，因为是可以直接使用的，而且现在很多地图服务（在线的，或者自己搭建的服务器）都支持xyz方式的请求。国内在线的地图服务，高德，天地图等，都可以通过这种方式加载，本地离线瓦片地图也可以，用途广泛，且简单易学，需要掌握。</li>
</ul>
<p><code>ol.source.Image</code>虽然有几种不同的子类，但大多比较简单，因为不牵涉到过多的协议和服务器提供商。而<code>ol.source.Vector</code>就更加的简单了，但有时候其唯一的子类<code>ol.source.Cluster</code>在处理大量的<code>Feature</code>时，我们可能需要使用。</p>
<p>在大概了解了整个<code>Source</code>之后，紧接着该介绍它的搭档<code>Layer</code>了，同样的，我们还是先从OpenLayers 3现有的<code>Layer</code>类图大致了解一下：
<img src="assets/002/20190611-faffcc33.png" alt="ol.layer.Base类图"></p>
<p>为了便于了解和使用，图中标注了每一个<code>Layer</code>对应的<code>Source</code>。通过上图可以看到<code>Layer</code>相对于<code>Source</code>而言，真是太简单了。</p>
<p>对于初学者而言，如何选择和应用不同的<code>Source</code>和<code>Layer</code>是一个非常迷惑和困难的问题。为此，本章将围绕着<code>Source</code>和<code>Layer</code>展开，为大家解决这个问题。</p>
  </section>


### 万能加载瓦片地图

[文档地址](http://weilin.me/ol3-primer/ch05/05-03.html  )


###特殊的在线瓦片地图加载



### 瓦片地图加载：

在请求的url中，我们可以很明显地看到xyz这三个参数，这进一步说明了百度地图就是用了瓦片地图。如果你多分析一下现有的在线网页地图，基本都是瓦片地图。正因为如此，OpenLayers 3提供了ol.source.XYZ这种通用的Source来适应广大的在线瓦片地图数据源，具备很好的适用性。通常情况下，开发者想要加载不同的在线瓦片地图源，则只需要更改ol.source.XYZ的构造参数中url就可以了。 比如我们就可以不用ol.source.OSM，而用ol.source.XYZ来加载Open Street Map地图，结果一样：

```html

<body>
    <div id="map" style="width: 100%"></div>
    <script>
        // Open Street Map 地图层
        var openStreetMapLayer = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });

        // 创建地图
      var map = new ol.Map({
            layers: [
                openStreetMapLayer
            ],
            view: new ol.View({
                // 设置成都为地图中心
                center: [104.06, 30.67],
                projection: 'EPSG:4326',
                zoom: 10
            }),
            target: 'map'
      });
    </script>
</body>
```

除了Open Street Map可以这样加载外，还有很多其他的在线瓦片地图源也可以，比如高德地图：


```
// 高德地图层
var gaodeMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url:'http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
    })
});

```


比如Yahoo地图：

```
// yahoo地图层
var yahooMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        tileSize: 512,
        url:'https://{0-3}.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/512/png8?lg=ENG&ppi=250&token=TrLJuXVK62IQk0vuXFzaig%3D%3D&requestid=yahoo.prod&app_id=eAdkWGYRoc4RfxVo0Z4B'
    })
});
```

大同小异，非常简单。上面的三个例子，只有Yahoo地图的代码有点不一样：多了tileSize参数的设置。默认情况下，tileSize为256，这也是现在绝大多数瓦片采用的大小。但Yahoo地图使用的是512，所以我们需要显示指定。

### 百度瓦片地图加载


通过上面的示例我们已经发现，其实可以非常轻松地加载多种不同来源的在线瓦片地图。但遗憾地是，上面这种简单方法并不适用于所有的在线瓦片地图，总有一些是特殊的，比如百度地图，上面这种方式就不生效了。此时，我们需要回过头来思考一下瓦片地图加载的整个过程：瓦片地图加载的关键在于找对瓦片，但要找对瓦片，就得知道瓦片的坐标，而坐标又需要明确的坐标系。我们在坐标里说过，任何坐标都得有坐标系才有意义。在OpenLayers 3中，默认使用的瓦片地图的坐标系是如何定义的？经分析可知，OpenLayers 3的瓦片坐标系的原点在左上角，向上为y轴正方向，向右为x轴正方向。具体到地图上来讲，地球经过投影，投影到一个平面上，平面最左边对应地球最西边，平面最上边对应地球最北边。原点就处于整个平面的左上角，即地球的西北角，从北向南为y轴负方向，从西向东为x轴正方向。理解这一点非常重要，因为并不是所有在线的瓦片地图都是采用这样的坐标系。用OpenLayers 3加载它们的时候，如果坐标系不同，计算出来的瓦片地址就获取不到对应的瓦片，为解决这个问题，我们必须要先对瓦片坐标进行转换。那么，具体该怎么实现转换？最详细明了的方式还是看实例，下面我们看一下加载百度地图一种实现方式：




```html
<div id="baiduMap" style="width: 100%"></div>
<script>
    // 百度地图层
    var baiduMapLayer = new ol.layer.Tile({
        source: new ol.source.XYZ({
            tilePixelRatio: 2,
            tileUrlFunction: function(tileCoord){  // 参数tileCoord为瓦片坐标
                var z = tileCoord[0];
        var x = tileCoord[1];
        var y = tileCoord[2];

        // 计算当前层级下瓦片总数的一半，用于定位整个地图的中心点
        var halfTileNum = Math.pow(2, z-1);
        // 原点移到中心点后，计算xy方向上新的坐标位置
        var baiduX =  x - halfTileNum;
        var baiduY =  y + halfTileNum;

        // 百度瓦片服务url将负数使用M前缀来标识
        if (baiduX < 0) {
            baiduX = 'M' + (-baiduX);
        }
        if (baiduY < 0) {
            baiduY = 'M' + (-baiduY);
        }

        // 返回经过转换后，对应于百度在线瓦片的url
        return 'http://online2.map.bdimg.com/onlinelabel/?qt=tile&x=' + baiduX + '&y=' + baiduY + '&z=' + z + '&styles=pl&udt=20160321&scaler=2&p=0';
            }
        })
    });

    // 创建地图
  var map = new ol.Map({
        layers: [
            baiduMapLayer
        ],
        view: new ol.View({
            // 设置成都为地图中心
            center: [104.06, 30.67],
            projection: 'EPSG:4326',
            zoom: 4
        }),
        target: 'baiduMap'
  });
</script>
```


和前面几个加载在线瓦片地图的例子不一样的地方在于，我们没有设置url，而是设置了tileUrlFunction，这是一个获取瓦片url的函数，如果自定义这个函数，就可以实现不同坐标系之间的转换，从而返回在线地图服务对应瓦片的url。通过代码可以看到，函数入参是一个瓦片坐标，然后进行一系列的转换，得到百度在线地图的瓦片地址。效果参见上方地图，不妨拖动、缩放试试，拼接无缝，并没有什么问题。

tileUrlFunction这个自定义函数的代码实现有可能看不懂，虽然知道在进行坐标转换，但并不知道为什么要这样实现。为了彻底弄明白代码，我们必须得把之前遗漏的一个很重要环节补上：弄明白待加载的在线瓦片地图的坐标系。对百度在线瓦片坐标系进行简单分析发现，它是以某一个位置为原点，向右为x正方向，向上为y正方向的坐标系，进一步分析发现，原点应该在中心位置，为此，我们假设百度地图是以经纬度[0,0]为原点，在此基础上编写函数tileUrlFunction的实现。halfTileNum表示的是在当前缩放层级之下，总的瓦片个数的一半，意味着它就是中心位置。对于baiduX小于0的情况，百度使用了M来表示负号，所以要特殊处理一下。想必这下应该更加理解代码实现了。不同的在线瓦片地图的转换代码可能不同，需要根据对应的坐标系来确定。

但上面这个地图并不完美，因为我们设定的地图中心为成都，然而实际上显示的地图中心并不在成都。虽然无缝拼接，但位置偏差有点远。由此基本可以排除坐标转换的问题，看起来应该是OpenLayers 3的分辨率和百度在线瓦片地图使用的分辨率对不上。经过分析发现，确实如此，在网上也有很多分析文章可以查阅。那么我们是否可以重新定义分辨率呢？ 答案是肯定的，我们可以使用ol.source.XYZ的父类来解决问题。

* 重新定义OpenLayers 3的瓦片坐标系

* 分析瓦片地图坐标


* 解密 瓦片url

### 加载离线瓦片地图[地址](http://weilin.me/ol3-primer/ch05/05-04.html)



### 瓦片地图加载源码解析[地址](http://weilin.me/ol3-primer/ch05/05-12.html)


## 静态地图以及应用[地址](http://weilin.me/ol3-primer/ch05/05-05.html)


## 加载wsm 服务地图[地址](http://weilin.me/ol3-primer/ch05/05-06.html)

## 矢量地图[地址](http://weilin.me/ol3-primer/ch05/05-07.html)


### 获取加载后所有的feature


这是一个很多人会遇到的问题，因为在加载矢量地图后，需要对矢量地图做一些简单的查询，分析等。 但是经常会遇到获取不到加载后的feature的问题。 原因就在于获取的时机不对，因为矢量地图是异步加载的。 下面就看一下正确的获取所有feature的做法是什么：


矢量地图Feature总数： 9
从图上可以看到，共有9个feature， 在地图下方的统计数据也是9。 下面看看代码是如何实现的：

```html
<div id="map" style="width: 100%"></div>
<div>矢量地图Feature总数： <span id="count"></span></div>
<script type="text/javascript">

    //创建地图
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: [-72.980624870461128, 48.161307640513321],
            zoom: 8,
            projection: 'EPSG:4326'
        }),
        target: 'map'
    });

    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: '../data/geojson/line-samples.geojson',
            format: new ol.format.GeoJSON()
        })
    });

    // 因为是异步加载，所以要采用事件监听的方式来判定是否加载完成
    var listenerKey = vectorLayer.getSource().on('change', function(){
        if (vectorLayer.getSource().getState() === 'ready') {    // 判定是否加载完成
            document.getElementById('count').innerHTML = vectorLayer.getSource().getFeatures().length;
            vectorLayer.getSource().unByKey(listenerKey); // 注销监听器
        }
    });

    map.addLayer(vectorLayer);
    // 如果在此处调用vectorLayer.getSource().getFeatures()是完全有可能获取不到任何Feature的，这是常犯错误
</script>
```
对于其他格式的矢量地图加载也需要这样编写代码，才能正确获取到加载完成的所有feature。

## 坐标转换[地址](http://weilin.me/ol3-primer/ch05/05-09.html)

坐标转换也是矢量地图经常会遇到的问题，比如当前地图用的是EPSG:3857，但是矢量地图用的是EPSG:4326，这样就需要进行坐标转换。 由于OpenLayers 3为我们内置了地图格式解析器，那么自然只能依靠它来处理。 上一节中使用的.geojson文件内的坐标使用的是wgs84坐标，那么如果我们地图使用EPSG:3857，该怎么来加载？


详细实现参见代码：

```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">

    //创建地图
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),

        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-72.980624870461128, 48.161307640513321]),
            zoom: 8
        }),
        target: 'map'
    });

    // 加载矢量地图
    function addGeoJSON(src) {
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(src, {     // 用readFeatures方法可以自定义坐标系
                    dataProjection: 'EPSG:4326',    // 设定JSON数据使用的坐标系
                    featureProjection: 'EPSG:3857' // 设定当前地图使用的feature的坐标系
                })
            })
        });
        map.addLayer(layer);
    }

    // 使用ajax获取矢量地图数据
    $.ajax({
        url: '../data/geojson/line-samples.geojson',
        success: function(data, status) {
            // 成功获取到数据内容后，调用方法添加到地图
            addGeoJSON(data);
        }
    });
</script>
```
代码稍微麻烦了一点，是因为目前ol.format.GeoJSON的构造参数不支持设定创建feature的坐标系，如果要支持也并不麻烦，期望后续官网能够改进。

注意，该方法可以适用于其他几种矢量地图。readFeatures这个方法在内置的几个解析类中都有。

## 矢量地图的样式设置[地址](http://weilin.me/ol3-primer/ch05/05-10.html)


对矢量元素进行样式设置，OpenLayers3 支持两种方式，一种是直接给feature设置样式，一种是给layer设置样式。系统默认优先考虑feature的样式，如果没有，则使用layer的样式，还有一种情况是layer也没有设置样式，则会采用系统默认的样式。

对于矢量地图而言，要想修改样式也只有这两种途径可选。比如之前例子中使用的GeoJSON，如果要改变线条的颜色成下面这样，可以考虑在layer上设置样式：


代码很简单：

```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">

    //创建地图
    var map = new ol.Map({
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            })
        ],
        view: new ol.View({
            center: [-72.980624870461128, 48.161307640513321],
            zoom: 8,
            projection: 'EPSG:4326'
        }),
        target: 'map'
    });

    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: '../data/geojson/line-samples.geojson',
            format: new ol.format.GeoJSON()
        }),
        // 设置样式，颜色为红色，线条粗细为1个像素
        style: new ol.style.Style({
            stroke: new ol.style.Stroke({
                color: 'red',
                size: 1
            })
        })
    });

    map.addLayer(vectorLayer);
</script>
```
如果要在feature上设置样式，就必须先获取到所有加载的feature，然后依次设置，显然直接设置layer的样式，会在代码编写上更容易一些。

自带样式的矢量地图修改样式
有些矢量地图数据自带样式，比如KML格式的矢量地图，如果要修改样式，则相对比较麻烦。得分情况考虑：

一种是所有矢量地图都不使用自带的样式；
一种是部分矢量地图不使用自带的样式。
对于第一种情况，则相对比较简单一些，只需要把ol.format.KML的构造参数extractStyles设置为false即可，然后为layer设定自定义的样式。

对于第二种情况，则相对麻烦一些，必须要读取加载的所有feature，并进行过滤，对符合条件的feature重新设置样式。


## 图层叠加以及管理

分层管理是GIS渲染引擎及其他图形系统常用的策略，为业务的应用提高了较大的适用性。比如更换地图底图，不能影响在上地图上添加的一些标注。如果把地图底图和标注分开，放在不同的图层上，就很容易解决这个问题。

有了图层的概念，自然需要对图层进行控制，比如增删改查等，图层之间的顺序，图层可见度等等。这些都是大家经常会遇到的问题。下面先来看一下三个图层叠加的情况：

显示/隐藏：  底图  圆  点
图层顺序：  底图最上  圆最上  点最上
上面这个地图示范了显示和隐藏的控制，以及图层顺序的控制。可以勾选上面的复选框和单选框试试。具体实现，参见下面的代码：

```html
<div id="map" style="width: 100%"></div>
<div> 显示/隐藏：
    <input type="checkbox" checked="checked" onclick="checkOsm(this);" />底图
    <input type="checkbox" checked="checked" onclick="checkCircle(this);"/>圆
    <input type="checkbox" checked="checked" onclick="checkPoint(this);"/>点
</div>
<div>
    图层顺序：
    <input name="seq" type="radio" value="" onclick="upOsm(this);" />底图最上
    <input name="seq" type="radio" value="" checked="checked" onclick="upCircle(this);"/>圆最上
    <input name="seq" type="radio" value="" onclick="upPoint(this);"/>点最上
</div>

<script>

    // 创建3个图层
    var osmLayer = new ol.layer.Tile({
        source: new ol.source.OSM()
    });
    var pointLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    var circleLayer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });

  new ol.Map({
      // 在地图上添加上面创建的三个图层，图层顺序自下而上，依次是osm，point，circle
        layers: [osmLayer, pointLayer, circleLayer],
        view: new ol.View({
            center: [0, 0],
            zoom: 2
        }),
        target: 'map'
  });

  // 添加点
  var point = new ol.Feature({
      geometry: new ol.geom.Point([0, 0])
  });
  point.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
          radius: 1,
          fill: new ol.style.Fill({
              color: 'red'
          }),
          stroke: new ol.style.Stroke({
              color: 'red',
              size: 1
          })
      })
  }));
  pointLayer.getSource().addFeature(point);


  // 添加圆
  var circle = new ol.Feature({
      geometry: new ol.geom.Point([0, 0])
  });
  circle.setStyle(new ol.style.Style({
      image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
              color: 'blue',
              size: 1
          })
      })
  }));
  circleLayer.getSource().addFeature(circle);

  // 隐藏显示osm图层
  function checkOsm(elem) {
      osmLayer.setVisible(elem.checked);
  }

    // 隐藏显示point图层
  function checkPoint(elem) {
      pointLayer.setVisible(elem.checked);
  }

  // 隐藏显示circle图层
  function checkCircle(elem) {
      circleLayer.setVisible(elem.checked);
  }

  // 置顶osm图层到最上面
  function upOsm (elem) {
      if (elem.checked) {
          osmLayer.setZIndex(3);
          circleLayer.setZIndex(circleLayer.getZIndex()-1);
          pointLayer.setZIndex(pointLayer.getZIndex()-1);
      }
  }

  // 置顶circle图层到最上面
  function upCircle (elem) {
      if (elem.checked) {
          circleLayer.setZIndex(3);
          osmLayer.setZIndex(osmLayer.getZIndex()-1);
          pointLayer.setZIndex(pointLayer.getZIndex()-1);
      }
  }

  // 置顶point图层到最上面
  function upPoint(elem) {
      if (elem.checked) {
          pointLayer.setZIndex(3);
          osmLayer.setZIndex(osmLayer.getZIndex()-1);
          circleLayer.setZIndex(circleLayer.getZIndex()-1);
      }
  }

</script>
```
简而言之，就是可以利用方法setVisible和setZIndex来控制图层，满足80%的这种需求。 除此之外，大家也可以使用很早之前使用的一种方式来实现管理，即删除/添加图层，参见最简单的加载在线地图。


## LOD与分辨率


LOD是Levels of Detail的简写，用于根据当前的环境，渲染不同的图像，用于降低非重要的细节度，从而提高渲染效率，在电子游戏中经常运用，对于需要显示全球地图的GIS系统而言，更需要应用这项技术。在万能瓦片地图加载秘籍中，有简单的说明。 在不同的细节层次下，自然分辨率就可能不一样，这两者是紧密结合在一起的。 对于图形显示系统而言，分辨率作为屏幕坐标和世界坐标之间计算的纽带，其作用是非常重要的。 本章节将以实例的方式深入浅出的讲解这两个重要的概念，及在OpenLayers 3中的应用。

### LOD 的原理[地址](http://weilin.me/ol3-primer/ch06/06-01.html)


在详细讲解之前，假设给你两张A4纸，在其中一张纸上把你家整个绘制上去，在另一张纸上只把你睡的房间绘制上去。如果别人想看你家，你会给哪一张纸？如果想看你睡的房间，你会给哪一张纸？ 相信你不会给错，LOD就是这种根据不同需要，采用不同图的技术方案。在地图应用中，最直观的体验，就是地图放大缩小。当地图放大后，能看到更详细的地理信息，比如街道，商店等等。当地图缩小再缩小，原来能看到的街道，商店就看不见了，当能看到更大的区域，我们的屏幕就相当于是A4纸，大小不变。

LOD这个技术方案非常棒，非常符合我们的自然习惯，所以在很多图形系统中都使用了这项技术。在GIS系统中，不断放大，就能看到更多地图细节，了解更加详细的信息。对于GIS引擎的开发者而言，需要实现这项技术，当发现用户放大地图时，就立马使用更有细节的地图图片，替换现在显示的地图图片。 现在问题来了：意思是说对于同一个地点而言，需要有很多张呈现不同细节程度的图片？是的，你没有猜错，虽然在使用地图的过程中，感觉放大缩小地图是浑然一体的，但其实就在你眼皮下发生了图片替换。 不同层级使用具有不同细节的地图图片，这就需要为每一个层级准备图片，如果使用离线工具下载瓦片地图，会看到下载的图片是按照层级Z进行存储的。开发者不用担心数据源的处理，只需要知道这个原理就可以了。

为了便于理解GIS系统中不同层级，使用不同的图片，下面使用google在线瓦片地图进行说明。 最小层级0情况下，只用了一张256*256像素的图片表示整个地球平面：

![](assets/002/20190612-915a3a7f.png)  


层级0google地图瓦片

稍大一个层级1情况下，用了四张256*256像素的图片来表示整个地球：

![](assets/002/20190612-fd39eff4.png)  

层级1google地图瓦片层级1google地图瓦片 层级1google地图瓦片层级1google地图瓦片

![](assets/002/20190612-e8f37231.png)  


对照一下，是否更加的明白了LOD原理及在GIS中的应用？

### 瓦片计算[地址](http://weilin.me/ol3-primer/ch06/06-02.html)


#### 瓦片计算的必要性


* 瓦片计算

不同环境条件下，加载具有不同细节的图片资源，可以提高效率，但这并不是终点。 瓦片技术可以更进一步提高效率。 其原理是将一张大图片切割成很多张小图片，按照呈现需要，加载其中的几张小图片即可。 为什么这样就能提高效率？因为屏幕显示窗口的大小是固定，比如屏幕分辨率是800*600，或者1024*768，又或者是1920*800等等。如果屏幕分辨率是800*600，一张大图是9000*9000，那么同一时间，你只能看到这张图片的十分之一。 但是在不切片的情况下，你却必须要加载整个地图。 如果是在本地浏览还好，假如是发布在网络上，则网络传输和渲染，都将耗时。如果我们按照500*500大小进行切片，我们则只需要加载4张500*500的小图片就可以了。 对于WebGIS而言，需要在网络上发布，同时需要显示整个地球，自然需要使用瓦片技术。

* 切片方式

如果对整个地球图片进行切片，需要考虑的是整个地球图片大小，以及切片规则，切片大小。 对于WebGIS而言，在线地图几乎都采用墨卡托投影坐标系(Mercator)，对应的地图投影到平面上就是一个正方形。 为了方便使用，切片时大多按照正方形的方式来进行切片，比如切片大小为256*256。一个1024*1024的地图，就可以切成4张小的瓦片。 同时，瓦片大小几乎都是256*256，有一些则会增加到512*512。

LOD会使得不同层级下的全球地图大小不一致，结合瓦片技术一起，就出现了金字塔瓦片。 参见万能瓦片地图加载秘籍里面的图。 在WebGIS中，上一层级的一张瓦片，在更大一层级中，会用4张瓦片来表示，依次类推，比如上一节中看到的Google在线瓦片地图的第0级和第1级的瓦片地图。 这样做可以维持正方形的投影方式不变，同时按照2的幂次方放大，计算效率非常高。


计算

```
通过上面切片的介绍，我们可以对每一层级瓦片的数量进行简单的计算。 层级0的瓦片数是1=2^0*2^01=2

​​ ， 层级1的瓦片数是4=2^1*2^14=2

​​ ，层级n的瓦片数是2^n*2^n2

​​ 。 这个地方计算的是所有瓦片数，因为是一个正方形，所以是边长的平方，如只计算x轴或者y轴一边的瓦片数，就是2^n2
​n
​​ 个。
```


* 瓦片坐标

任意一个层级的地图，切成多个瓦片后，我们需要给瓦片编号，才能通过编号找到瓦片。这个问题在这就涉及到坐标系，在万能瓦片地图加载秘籍里我们提到过，不同的在线地图服务商，可能定义不一样的瓦片坐标系，坐标系不一样，那么对应的同一个位置的瓦片的坐标也会不一样。 需要引起重视。

在OpenLayers 3提供了一个用于调试瓦片的source: ol.source.TileDebug。可以清晰的看到每一个瓦片的坐标：


<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var osmSource = new ol.source.OSM();
    var map = new ol.Map({
    layers: [
        // 加载Open Street Map地图
      new ol.layer.Tile({
        source: osmSource
      }),
      // 添加一个显示Open Street Map地图瓦片网格的图层
      new ol.layer.Tile({
        source: new ol.source.TileDebug({
          projection: 'EPSG:3857',
          tileGrid: osmSource.getTileGrid()
        })
      })
    ],
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform(
          [104, 30], 'EPSG:4326', 'EPSG:3857'),
      zoom: 10
    })
});
</script>

代码：

```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var osmSource = new ol.source.OSM();
    var map = new ol.Map({
    layers: [
        // 加载Open Street Map地图
      new ol.layer.Tile({
        source: osmSource
      }),
      // 添加一个显示Open Street Map地图瓦片网格的图层
      new ol.layer.Tile({
        source: new ol.source.TileDebug({
          projection: 'EPSG:3857',
          tileGrid: osmSource.getTileGrid()
        })
      })
    ],
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform(
          [104, 30], 'EPSG:4326', 'EPSG:3857'),
      zoom: 10
    })
});
</script>
```


首先从上图可以看到地图上多了网格，每一个网格对应的就是一个瓦片。 其次网格中有三个数字，这些数字就表示当前瓦片的坐标，第一个数字是层级z，第二个数字是表示经度方向上的x，第三个数字是表示维度方向上的y。 同样的，可以采用上面的方式来看看在万能瓦片地图加载秘籍中提到的各种瓦片地图的瓦片坐标。



#### 分辨率:

[原文地址](http://weilin.me/ol3-primer/ch06/06-03.html)



缩放上面的地图，从层级0开始，用前面介绍的公式和当前地图显示的分辨率进行比较，你会发现OpenLayers默认采用的分辨率和Google在线瓦片地图一样。

```html
<div id="map" style="width: 100%"></div>
<div><span>当前层级：</span><span id="zoom"></span><span>分辨率：</span><span id="resolution"></span></div>
<script type="text/javascript">
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    // 监听层级变化，输出当前层级和分辨率
    map.getView().on('change:resolution', function(){
        document.getElementById('zoom').innerHTML =  this.getZoom() + '，';
        document.getElementById('resolution').innerHTML = this.getResolution();
    })

    document.getElementById('zoom').innerHTML = map.getView().getZoom() + '，';
    document.getElementById('resolution').innerHTML = + map.getView().getResolution();
</script>
```


注意事项
为什么我们上面一直以Google在线瓦片地图举例说明？ 因为不同的在线瓦片地图可能采用不一样的分辨率，比如百度在线瓦片地图。 所以在使用在线瓦片地图或者自己制作的瓦片地图时，都需要知道使用的分辨率是多少。 如若不然，可能也会出现位置偏移。


#### 自定义瓦片地图加载


[地址](http://weilin.me/ol3-primer/ch06/06-04.html)


## 图标以及提示信息


* 图标及提示信息

图标是GIS应用中必不可少的要素，比如在地图上标注饭店，学校，加油站等，就需要添加图标，点击图标，可能需要提示更为详细的信息，比如地址，评价，或者更为复杂的业务信息。本节将从基本的应用入手讲解，直到比较高级一些的自定义特色图标和信息展示。


### overlayer

应用overlayer

在OpenLayer3中添加图标有两种方式，一种是我们这一小节马上就要介绍的，比较传统的overlay，另一种是下一小节马上就要介绍的Feature + Style的方式。 overlay之所以传统，是因为它就是传统的html方式显示图片。 下面就是用这种方式加载一个锚点的示例：

```html
<div id="map" style="width: 100%"></div>
<!--下面就是传统的显示一个图片图标的方式，用img-->
<div id="anchor"><img src="../img/anchor.png" alt="示例锚点"/></div>
<script type="text/javascript">
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104, 30],
      zoom: 10
    })
  });

  // 下面把上面的图标附加到地图上，需要一个ol.Overlay
  var anchor = new ol.Overlay({
    element: document.getElementById('anchor')
  });
  // 关键的一点，需要设置附加到地图上的位置
  anchor.setPosition([104, 30]);
  // 然后添加到map上
  map.addOverlay(anchor);
</script>
```

缺点
当图标比较多的情况下，如果采用这种方式，那么我们会加入非常多的HTML元素，从而造成效率降低。 关于效率的测试，大家可以自行测试。 为什么会这样呢？ 因为界面上元素的遍历在数量比较多的情况下，会变慢，基于此基础上的渲染，鼠标事件都会变慢。

优点
这种使用传统的方式显示图标可以应用传统的HTML技术，比如鼠标移动到图标上，鼠标图标变成手势。 我们可以用css来处理就可以了，比如在head里面添加下面的代码：

<style type="text/css">
    #anchor {
        cursor:pointer;
    }
</style>
就可以看到鼠标放到锚点上去的时候，鼠标图标从箭头，变成手了。 类似的其他技术都可以应用上去，比如css动画。 鉴于动画在前端的重要性，下面单独分出一个小节用实例来讲解。


### 动画图标

[原地址](http://weilin.me/ol3-primer/ch07/07-02.html)

动态图标：
动起来的图标会更有吸引力，下面用overlay+css的方式来实现：


```html
<head>
    <!--定义动画，图标先放大，再缩小-->
    <style type="text/css">
      @keyframes zoom
      {
        from {top: 0; left: 0; width: 32px; height: 32px;}
        50% {top: -16px; left: -16px; width: 64px; height: 64px;}
        to {top: 0; left: 0; width: 32px; height: 32px;}
      }

      @-moz-keyframes zoom /* Firefox */
      {
        from {top: 0; left: 0; width: 32px; height: 32px;}
        50% {top: -16px; left: -16px; width: 64px; height: 64px;}
        to {top: 0; left: 0; width: 32px; height: 32px;}
      }

      @-webkit-keyframes zoom /* Safari 和 Chrome */
      {
        from {top: 0; left: 0; width: 32px; height: 32px;}
        50% {top: -16px; left: -16px; width: 64px; height: 64px;}
        to {top: 0; left: 0; width: 32px; height: 32px;}
      }

      @-o-keyframes zoom /* Opera */
      {
        from {top: 0; left: 0; width: 32px; height: 32px;}
        50% {top: -16px; left: -16px; width: 64px; height: 64px;}
        to {top: 0; left: 0; width: 32px; height: 32px;}
      }

      /* 应用css动画到图标元素上 */
      #anchorImg
      {
        display: block;
        position: absolute;
        animation: zoom 5s;
        animation-iteration-count: infinite; /* 一直重复动画 */
        -moz-animation: zoom 5s; /* Firefox */
        -moz-animation-iteration-count: infinite; /* 一直重复动画 */
        -webkit-animation: zoom 5s;  /* Safari 和 Chrome */
        -webkit-animation-iteration-count: infinite; /* 一直重复动画 */
        -o-animation: zoom 5s; /* Opera */
        -o-animation-iteration-count: infinite; /* 一直重复动画 */
      }
    </style>
</head>

<div id="map" style="width: 100%"></div>
<div id="anchor" style="width: 64px;height: 64px;" ><img id='anchorImg' src="../img/anchor.png" alt="示例锚点"/></div>
<script type="text/javascript">
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      })
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104, 30],
      zoom: 10
    })
  });

  var anchor = new ol.Overlay({
    element: document.getElementById('anchor')
  });
  anchor.setPosition([104, 30]);
  map.addOverlay(anchor);
</script>
```

除了这种css实现动画之外，你还可以直接加载gif动画，这是非常简单的，再此不表。

### style 应用（加载图标的第二种方法）

代码：

```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
  // 我们需要一个vector的layer来放置图标
  var layer = new ol.layer.Vector({
    source: new ol.source.Vector()
  })

  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      layer
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104, 30],
      zoom: 10
    })
  });

  // 创建一个Feature，并设置好在地图上的位置
  var anchor = new ol.Feature({
    geometry: new ol.geom.Point([104, 30])
  });
  // 设置样式，在样式中就可以设置图标
  anchor.setStyle(new ol.style.Style({
    image: new ol.style.Icon({
      src: '../img/anchor.png'
       anchor: [0.5, 1]    // 设置图标位置，图标x的一半在中心，y的底层在中心
    })
  }));
  // 添加到之前的创建的layer中去
  layer.getSource().addFeature(anchor);
</script>
```

效果是一样的，但从代码上来看，是不一样的:

首先overlay需要HTML元素img，但这种方式不需要
overlay是添加在map上的，但是这种方式需要一个Vector的layer，并添加在其上
我们没有办法像overlay那样使用一些HTML技术

* 应用

虽然不能用css直接修改图标显示，但并不是说使用这种方式没有自定义的余地，大家可以先在官网API上看一下ol.style.Icon的构造参数，会看到可以设置位置，透明度，放大缩小，旋转等，基本能满足大多数的应用，由于和CSS不同，很多同学在应用时遇到一些问题，所以下面给出了一些具体的使用示例。


### 设置中心的位置上


要做到这个效果，我们只需要把设置样式的代码加上anchor的设置：

image: new ol.style.Icon({
  src: '../img/anchor.png',
  anchor: [0.5, 1]    // 设置图标位置
})

为什么是[0.5, 1]这种值，表示什么？ 默认情况下，位置坐标是按照比例的方式来设置的，范围从0到1，x轴上0表示最左边，1表示最右边，y轴上0表示最上边，1表示最下边。 如代码所示，x设置为0.5可以让图片在x方向上居中，y设置为1可以让图片在y方向上移动到最底端。 大家可以给予上面这个代码修改一下，试试[0, 0]会让图标处于什么位置？

除了按照比例进行移动之外，还可以按照像素来计算位置，但必须显示设置anchorXUnits或 anchorYUnits为pixels。 根据不同的需要，可以采用不同的单位来设置。


### 根据层级放大缩小图标

由于图标不会跟随图层的放大缩小而放大缩小，所以在某些业务应用中，可能并不合适，需要也跟随变化。 之前就有同学提到这个问题，在ol.style.Icon中是可以设置scale的，这样就为 我们提供了方便。 通过设置它，就可以做到。 下面这个地图中的锚点图标，就会随着地图放大缩小而变化大小：


```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
  var layer = new ol.layer.Vector({
    source: new ol.source.Vector()
  })
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      layer
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104, 30],
      zoom: 10
    })
  });

  var anchor = new ol.Feature({
    geometry: new ol.geom.Point([104, 30])
  });
  anchor.setStyle(new ol.style.Style({
    image: new ol.style.Icon({
      src: '../img/anchor.png'
    })
  }));
  layer.getSource().addFeature(anchor);

  // 监听地图层级变化
  map.getView().on('change:resolution', function(){
      var style = anchor.getStyle();
      // 重新设置图标的缩放率，基于层级10来做缩放
      style.getImage().setScale(this.getZoom() / 10);
      anchor.setStyle(style);
  })
</script>
```

利用一个监听和scale改变，就实现了这个同比缩放。 具体缩放多少，请根据业务来设置，可以设置的更加精细，此处只是功能示例。 其实还有另外一种方式，可以实现动态缩放大小，参见styleFunction应用[地址](http://weilin.me/ol3-primer/ch07/07-04.html)。


### 另类设置svg图标


[原文地址](http://weilin.me/ol3-primer/ch07/07-03-03.html)

svg的一些简单介绍
[svg的一些简单介绍](http://www.php.cn/html5-tutorial-413456.html)



对应的代码

```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
  var layer = new ol.layer.Vector({
    source: new ol.source.Vector()
  })
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      layer
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104, 30],
      zoom: 10
    })
  });

  var anchor = new ol.Feature({
    geometry: new ol.geom.Point([104, 30])
  });

  // 构建svg的Image对象
  var svg = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve">'+    
'<path fill="#156BB1" d="M22.906,10.438c0,4.367-6.281,14.312-7.906,17.031c-1.719-2.75-7.906-12.665-7.906-17.031S10.634,2.531,15,2.531S22.906,6.071,22.906,10.438z"/>'+
'<circle fill="#FFFFFF" cx="15" cy="10.677" r="3.291"/></svg>';

    var mysvg = new Image();
    mysvg.src = 'data:image/svg+xml,' + escape(svg);

  anchor.setStyle(new ol.style.Style({
    image: new ol.style.Icon({
      img: mysvg,    // 设置Image对象
      imgSize: [30, 30]    // 及图标大小
//          src: 'http://www.williambuck.com/portals/0/Skins/WilliamBuck2014/images/location-icon.svg',
//          size: [30, 30]
    })
  }));
  layer.getSource().addFeature(anchor);
</script>
```


### 规则几何体图标


* 原文地址


[规则几何体图标](http://weilin.me/ol3-primer/ch07/07-03-04.html)

#### 介绍

相对于png而言，svg这样的矢量图在放大缩小方面更清晰，但对于规则几何体而言，如果也使用svg，未免复杂了一点，OpenLayers 3为了简化这样的操作，提供了一个规则几何体的样式类ol.style.RegularShape，使用它可以轻松绘制正方形，三角形等,也支持星形规则几何图形，比如下面这样：


### 动态改变图标


[原文地址](http://weilin.me/ol3-primer/ch07/07-03-06.html)

* 动态改变图标以及监听事件

```html
<script type="text/javascript">
		var layer = new ol.layer.Vector({
			source: new ol.source.Vector()
		})
		var map = new ol.Map({
			layers: [
				new ol.layer.Tile({
					source: new ol.source.OSM()
				}),
				layer
			],
			target: 'map',
			view: new ol.View({
				projection: 'EPSG:4326',
				center: [104, 30],
				zoom: 10
			})
		});

		// 添加一个空心的五星
		var star = new ol.Feature({
			geometry: new ol.geom.Point([104, 30])
		});
		star.setStyle(new ol.style.Style({
			image: new ol.style.RegularShape({
				points: 5,
				radius1: 20,
				radius2: 10,
				stroke: new ol.style.Stroke({
					color: 'red',
					size: 2
				})
			})
		}));

		layer.getSource().addFeature(star);

		// 监听地图点击事件
		map.on('click', function(event) {
			var feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
				return feature;
			});
			if(feature) {
				// 将空心五星为红色实心五星
				var style = feature.getStyle().getImage();
				feature.setStyle(new ol.style.Style({
					image: new ol.style.RegularShape({
						points: 5,
						radius1: 20,
						radius2: 10,
						stroke: style.getStroke(),
						fill: new ol.style.Fill({
							color: 'blue'
						})
					})
				}));
			}
		});
		// 监听地图鼠标滑过
		//map.on('pointermove', function(event){
		map.on('pointermove', function(event) {
			//根据鼠标的位置查找最近的feature
			var feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
				return feature;
			});

			// if (feature && feature.getProperties().featureType != null) {
			if(feature) {
				 map.getTargetElement().style.cursor = 'pointer';
				// 将空心五星为红色实心五星
				var style = feature.getStyle().getImage();
				feature.setStyle(new ol.style.Style({
					image: new ol.style.RegularShape({
						points: 5,
						radius1: 20,
						radius2: 10,
						stroke: style.getStroke(),
						fill: new ol.style.Fill({
							color: 'red'
						})
					})
				}));
			}else{
				  map.getTargetElement().style.cursor = 'default';
			}
		});

//		map.on('pointerout', function(event) {
//			alert("鼠標移出暂时没效果")
//			//根据鼠标的位置查找最近的feature
//			var feature = map.forEachFeatureAtPixel(event.pixel, function(feature) {
//				return feature;
//			});
//
//			// if (feature && feature.getProperties().featureType != null) {
//			if(feature) {
//				 map.getTargetElement().style.cursor = 'pointer';
//				// 将空心五星为红色实心五星
//				var style = feature.getStyle().getImage();
//				feature.setStyle(new ol.style.Style({
//					image: new ol.style.RegularShape({
//						points: 5,
//						radius1: 20,
//						radius2: 10,
//						stroke: style.getStroke(),
//						fill: new ol.style.Fill({
//							color: 'pink'
//						})
//					})
//				}));
//			}else{
//				  map.getTargetElement().style.cursor = 'default';
//			}
//		});
	</script>

```

### 文字标注

[地址](http://weilin.me/ol3-primer/ch07/07-03-07.html)

前面基本都在围绕着图标进行说明，其实用Feature + Style的方式，也是可以单独添加文字的，虽然简单，但可能有些同学会忽略这样的做法，所以在此用一个简单的示例来说明：


```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
  var layer = new ol.layer.Vector({
    source: new ol.source.Vector()
  })
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      layer
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104.06, 30.67],
      zoom: 10
    })
  });

  var anchor = new ol.Feature({
    geometry: new ol.geom.Point([104.06, 30.67])
  });
  // 设置文字style
  anchor.setStyle(new ol.style.Style({
    text: new ol.style.Text({
       font: '20px sans-serif' ,//默认这个字体，可以修改成其他的，格式和css的字体设置一样
      text: '添加文字图层',
      fill: new ol.style.Fill({
          color: 'green'
      })
    })
  }));
  layer.getSource().addFeature(anchor);
</script>
	</body>

```


## stylefunction 的应用

[地址](http://weilin.me/ol3-primer/ch07/07-04.html)


很多时候，我们会忽略styleFunction的存在，但很明显的，它可以让我们的图标或者标签应用更加灵活，比如根据层级放大缩小图标也可以用styleFunction来实现：

* 根据地图缩放feature
```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
  var layer = new ol.layer.Vector({
    source: new ol.source.Vector()
  })
  var map = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      layer
    ],
    target: 'map',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104, 30],
      zoom: 10
    })
  });

  var anchor = new ol.Feature({
    geometry: new ol.geom.Point([104, 30])
  });
  // 应用style function，动态的获取样式
  anchor.setStyle(function(resolution){
      return [new ol.style.Style({
          image: new ol.style.Icon({
            src: '../img/anchor.png',
            scale: map.getView().getZoom() / 10
          })
        })];
  });

  layer.getSource().addFeature(anchor);
</script>
```

* 根据不同的feature type 给feature设定不同的图形


```html
<div id="map2" style="width: 100%"></div>
<script type="text/javascript">

  // 创建layer使用的style function，根据feature的自定义type，返回不同的样式
  var layerStyleFunction = function(feature, resolution) {
    var type = feature.get('type');
    var style = null;
    // 点
    if (type === 'point') {
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 1,
          fill: new ol.style.Fill({
            color: 'red'
          })
        })
      });
    } else if ( type === 'circle') { // 圆形
      style = new ol.style.Style({
        image: new ol.style.Circle({
          radius: 10,
          stroke: new ol.style.Stroke({
            color: 'red',
            size: 1
          })
        })
      });
    } else { // 其他形状
      style = new ol.style.Style({
        image: new ol.style.RegularShape({
          points: 5,
          radius: 10,
          fill: new ol.style.Fill({
            color: 'blue'
          })
        })
      });
    }

    // 返回 style 数组
    return [style];
  };

  var layer2 = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: layerStyleFunction // 应用上面创建的 style function
  });

  var map2 = new ol.Map({
    layers: [
      new ol.layer.Tile({
        source: new ol.source.OSM()
      }),
      layer2
    ],
    target: 'map2',
    view: new ol.View({
      projection: 'EPSG:4326',
      center: [104, 30],
      zoom: 10
    })
  });

  // 添加三个feature，并设置自定义属性 type
  var rect = new ol.Feature({
    geometry: new ol.geom.Point([104, 30])
  });
  layer2.getSource().addFeature(rect);

  var circle = new ol.Feature({
    geometry: new ol.geom.Point([104, 30])
  });
  circle.set('type', 'circle');
  layer2.getSource().addFeature(circle);

  var point = new ol.Feature({
    geometry: new ol.geom.Point([104, 30])
  });
  point.set('type', 'point');
  layer2.getSource().addFeature(point);

</script>
```


## 大量图标方案。减少内存占用


[原文地址](http://weilin.me/ol3-primer/ch07/07-05.html)

此处的大量图标方案，不涉及服务器端，如果图标不进行交互，可以把图标渲染到底图上。 此处只介绍说明在前端可交互的大量图标方案，在图标数量不大的情况，无论使用什么方式加载，都不会有性能问题，当图标多了之后，就会出现卡顿，内存占用增大等问题。 在OpenLayers 3开发中，可以考虑下面两个方案来解决这个问题。

### 问题重现

在应用大量图标的时候，其实图标样式差异化并不大，比如快餐店，公共厕所，公交站点等等有很多，但都是用同样的图标在地图上标准，在不注意的时候，我们是采用下面的方式来添加图标
的：


```

for (var index = 0; index < 10000; index++) {
    var feature = new ol.Feature({
        geometry: new ol.geom.Point([latlon[index].lon, latlon[index].lat])
    });
    feature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
            src: '../img/marker.png'
        })
    }));
}

```

注意上面代码，对每个feature设置style的时候，都是直接new的，这样势必会创建很多对象，占用很多内存。 那么复用必然减少很多内存，重构上面的代码为：

```

var style = new ol.style.Style({
    image: new ol.style.Icon({
        src: '../img/marker.png'
    })
});
for (var index = 0; index < 10000; index++) {
    var feature = new ol.Feature({
        geometry: new ol.geom.Point([latlon[index].lon, latlon[index].lat])
    });
    feature.setStyle(style);
}
```

这样，我们就只创建了一个style对象，那么势必减少内存占用。 如果有多类图标，可以用数组缓存下来：

```
var styles = [
    new ol.style.Style({
        image: new ol.style.Icon({
            src: '../img/marker1.png'
        })
    }),
    new ol.style.Style({
        image: new ol.style.Icon({
            src: '../img/marker2.png'
        })
    }),
    new ol.style.Style({
        image: new ol.style.Icon({
            src: '../img/marker3.png'
        })
    })
];


for (var index = 0; index < 10000; index++) {
    var feature = new ol.Feature({
        geometry: new ol.geom.Point([latlon[index].lon, latlon[index].lat])
    });
    feature.setStyle(styles[index % styles.length]);
}
```

由于官网有实际的例子，大家请移步到icon-sprite-webgl。 下面是其中的一些代码片段，在里面加入了一些注释，便于大家理解：

```
// 预先设置好要使用的style，并缓存在icons数组中
for (i = 0; i < iconCount; ++i) {
  var info = iconInfo[i];
  icons[i] = new ol.style.Icon({
    offset: info.offset,
    opacity: info.opacity,
    rotateWithView: info.rotateWithView,
    rotation: info.rotation,
    scale: info.scale,
    size: info.size,
    src: 'data/Butterfly.png'
  });
}

......

for (i = 0; i < featureCount; ++i) {
  geometry = new ol.geom.Point(
      [2 * e * Math.random() - e, 2 * e * Math.random() - e]);
  feature = new ol.Feature(geometry);
  feature.setStyle(
      new ol.style.Style({
          // 直接使用上面缓存的icons里面的样式
        image: icons[i % (iconCount - 1)]
      })
  );
  features[i] = feature;
}

```


### 复用Canvas提高效率

采用上一种方式基本能解决掉绝大部分的问题，但是OpenLayers 3还提供了一种复用图标渲染使用的Canvas的方式，对应的类是ol.style.AtlasManager。 在了解其作用之前，需要先了解一点图标的渲染机制，比如ol.style.Circle和ol.style.RegularShape这样的图标，在内部渲染时，都会创建一个HTML的canvas，然后在这个画布上绘制图像，然后再把图像复制到地图上。 这样创建一个图标，就会在内部创建一个canvas。 ol.style.AtlasManager解决的问题就是，用一个大的canvas来绘制多个图标，这样就能减少canvas的数量，从而提高效率。


```
var atlasManager = new ol.style.AtlasManager({
  // we increase the initial size so that all symbols fit into
  // a single atlas image
  initialSize: 512
});

......

                    // circle symbol
          symbols.push(new ol.style.Circle({
            opacity: info.opacity,
            scale: info.scale,
            radius: radiuses[j],
            fill: new ol.style.Fill({
              color: info.fillColor
            }),
            stroke: new ol.style.Stroke({
              color: info.strokeColor,
              width: 1
            }),
            // by passing the atlas manager to the symbol,
            // the symbol will be added to an atlas
            atlasManager: atlasManager  // 注意：在创建style的这个地方设置了 atlasManager
          }));

```

需要注意的是，在API官方文档上，并没有这个属性的设置，但内部实现是有这个优化的。 同时需要注意的是经常使用的ol.style.Icon目前是没有实现这个优化的。


## 提示信息


[原文地址](http://weilin.me/ol3-primer/ch07/07-06.html)

提示信息在很多业务场景中都需要，比如显示当前位置周边的饭店列表，或者点击饭店，显示饭店详细信息，交通路线，电话号码等等。 鉴于显示的业务信息比较多，所以通常的做法都是采用overlay的方式来做。 用传统的HTML来布局和排版信息，然后附加到地图上的指定位置就可以了。 官网中提供了一个具体的例子： popup。 下面就解读一下这个例子的代码：



## 地图上事件

[原文地址](http://weilin.me/ol3-primer/ch08/index.html)

事件让很多业务的东西串联在一起，在前端中起着非常重要的作用，比如鼠标点击，移动事件。但其应用远不仅如此，现实生活中就存在很多大大小小的事件。 在OpenLayers 3中，同样存在非常多的事件，比如鼠标左键单击，双击等等。 同时还有一些用于各个模块之间进行协作使用的事件，比如ol.Map的postrender和propertychange事件。 通过这些事件，OpenLayers 3的功能模块协作一致，同样地，也可以让我们自己二次开发的功能模块运作起来。 同时，根据需要，我们还可以在系统中新增自定义事件，使得我们的开发使用方式同OpenLayers 3更加的一致。在本章节将详细介绍OpenLayers 3中的各种事件，及相关应用。


### 常用事件

常用事件
几乎OpenLayers主要的类都会派发相关的事件，虽然事件很多，但日常使用的事件大致分为下面几类。

常用鼠标事件
地图鼠标左键单击事件
对应的类为ol.Map，事件名为singleclick。

地图鼠标左键双击事件
对应的类为ol.Map，事件名为dblclick。

地图鼠标点击事件
对应的类为ol.Map，事件名为click。

地图鼠标移动事件
对应的类为ol.Map，事件名为pointermove。

地图鼠标拖拽事件
对应的类为ol.Map，事件名为pointerdrag。

地图移动事件
对应的类为ol.Map，事件名为moveend。

可以通过下面这个地图来尝试一下鼠标事件：



注意在singleclick和dblclick响应之前，都会触发click事件，在选择事件时，需要谨慎考虑。 同时发现moveend事件在地图缩放的时候，也会触发。 代码如下：

```html
<div id="info" style="background-color: #999;">触发事件提示信息</div>
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    // 响应单击事件
    map.on('singleclick', function(event){
        document.getElementById('info').innerHTML = '触发了ol.Map的单击事件：singleclick';
    });

    // 响应双击事件
    map.on('dblclick', function(event){
        document.getElementById('info').innerHTML = '触发了ol.Map的双击事件：dblclick';
    });

    // 响应点击事件
    map.on('click', function(event){
        document.getElementById('info').innerHTML = '触发了ol.Map的点击事件：click';
    });

    // 响应鼠标移动事件，事件太频繁，故注释掉了，可自行验证该事件
    // map.on('pointermove', function(event){
    //     document.getElementById('info').innerHTML = '触发了ol.Map的鼠标移动事件：pointermove';
    // });

    // 响应拖拽事件
    map.on('pointerdrag', function(event){
        document.getElementById('info').innerHTML = '触发了ol.Map的拖拽事件：pointerdrag';
    });

    // 地图移动事件
    map.on('moveend', function(event){
        document.getElementById('info').innerHTML = '触发了ol.Map的地图移动事件：moveend';
    });

</script>
```



### 注销事件


#### map.unByKey（）


```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    var key = map.on('singleclick', function(event){
        alert('这是一个演示如何取消事件监听的应用，之后再点击地图时，你将不会再看到这个说明。');
        // 下面这行代码就是取消事件监听
        map.unByKey(key);
    })
</script>
```


#### map.un   map.on  分别赋予事件


```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    // 创建事件监听器
    var singleclickListener = function(event){
        alert('大家好，我是淡叔，这是一个演示如何取消事件监听的应用，之后再点击地图时，你将不会再看到这个说明。');
        // 在响应一次后，注销掉该监听器
        map.un('singleclick', singleclickListener);
    };
    map.on('singleclick', singleclickListener);
</script>
```

#### once 执行一次的事件



```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    // 使用once函数，只会响应一次事件，之后自动注销事件监听
    map.once('singleclick', function(event){
        alert('这是一个演示如何取消事件监听的应用，之后再点击地图时，你将不会再看到这个说明。');
    })
</script>
```



## Interaction  交互


交互是人机界面非常重要的一个部分，任何一个GIS引擎都会内置这一部分功能，而不是让开发者自己实现。 在交互方式上，几乎都是约定俗成的，比如用鼠标左键双击地图可以放大地图，按住鼠标左键拖动地图可以移动浏览地图，用滚动鼠标中间的滑轮可以放大缩小地图等等。 OpenLayers 3都内置支持这些交互方式，同时还具备更多的其他交互方式，这些都将一并在本章节介绍。 更为重要的是，了解其中的基本原理，并在此基础上，应用于自己的业务开发。


### 内置交互方式介绍

[原文地址](http://weilin.me/ol3-primer/ch09/09-01.html)




OpenLayers 3提供了最基本的地图放大，缩小，平移等功能，以满足用户浏览地图的需要。 这些功能都是内置的，实现类都放在包ol.interaction下面，可以通过官网API查询到。 在做二次开发的时候，我们无需做任何设置，地图就具有这些功能，比如下面这个最简单的地图，你可以用鼠标对它进行浏览，不管是放大，还是缩小，平移都可以。


虽然代码中没有做任何的设置，ol.Map的默认行为中，设置了和地图的交互方式，如果表示出来，代码是这样的：

```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var map = new ol.Map({
        interactions: ol.interaction.defaults(),  // 不设置的情况下，默认会设置为ol.interaction.defaults()
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });
</script>
```



```
ol.interaction.defaults()这个函数用于返回默认的交互方式，通过API文档可知，还可以通过参数控制交互方式，非常的灵活。 在进一步深入之前，还是先了解一下默认都提供了那些交互方式：

按住alt+shift键，用鼠标左键拖动地图，就能让地图旋转，对应的交互类为ol.interaction.DragRotate。
用鼠标左键双击地图，就可以放大地图，对应的交互类为ol.interaction.DoubleClickZoom。
用鼠标左键，拖拽地图，就可以平移地图，对应的交互类为ol.interaction.DragPan。
在触摸屏上，用两个手指在触摸屏上旋转，就可以旋转地图，对应的交互类为ol.interaction.PinchRotate。
在触摸屏上，用两个手指在触摸屏上缩放，就可以缩放地图，对应的交互类为ol.interaction.PinchZoom。
用键盘上的上下左右键，就可以平移地图，对应的交互类为ol.interaction.KeyboardPan。
用键盘上的+/-键，就可以缩放地图，对应的交互类为ol.interaction.KeyboardZoom。
滚动鼠标中间的滑轮，就可以缩放地图，对应的交互类为ol.interaction.MouseWheelZoom。
按住shift键，同时用鼠标左键在地图上拖动，就可以放大地图，对应的交互类为ol.interaction.DragZoom。
从上面可以看到，支持的交互方式挺多的，归纳为缩放，平移，旋转三类。 同时支持键盘，鼠标，和触屏三种方式。

```
虽然默认的交互方式很全，但如果我们的地图只是在PC端提供或者只是在触屏提供，那么有些交互方式就会显得多余，最好是去掉不需要的，或者我们的地图因为业务需要，不允许用户平移，或者缩放地图。 为了满足这样的需求，ol.interaction.defaults()提供了相应的参数来控制交互方式，详见[ol.interaction.defaults API](https://openlayers.org/en/latest/apidoc/module-ol_interaction.html#.defaults)文档。 下面简单演示一个不能缩放的地图：


```html
<div id="map2" style="width: 100%"></div>
<script type="text/javascript">
    new ol.Map({
        // 让所有的zoom开关都设置为false
        interactions: ol.interaction.defaults({
            doubleClickZoom: false,
            mouseWheelZoom: false,
            shiftDragZoom: false,
            pinchZoom:false
        }),
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map2',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });
</script>
```

有时候也需要设置地图不能旋转，只要设置altShiftDragRotate:false, pinchRotate:false即可，可自行验证。





### tabindex 决定能否键盘决定事件


```html
<!--注意：需要设置tabindex，才能使div获得键盘事件-->
<div id="map3" tabindex="0" style="width: 100%"></div>
<script type="text/javascript">
    new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map3',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });
</script>
```


### 实现原理

#### 注意监听事件中最好不要返回false 之类的 值

[原文地址](http://weilin.me/ol3-primer/ch09/09-02.html)

```html
<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          })
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    // 监听了dblclick事件，并返回了false
    map.on('dblclick', function(event){
        return false;
    });
    </script>
```

这样做了后，后果非常的严重，出问题后，可能还不知道为什么？ 所以建议不要轻易在MapBrowserEvent事件的监听器里面返回false。

到此，我们可以进一步分析一下ol.interaction相关交互类的内部实现了，以ol.interaction.DoubleClickZoom为例，其核心必然是处理事件：


```html
ol.interaction.DoubleClickZoom.handleEvent = function(mapBrowserEvent) {
     var stopEvent = false;
     var browserEvent = mapBrowserEvent.originalEvent;
     if (mapBrowserEvent.type == ol.MapBrowserEvent.EventType.DBLCLICK) {    // 事件类型过滤
       var map = mapBrowserEvent.map;
       var anchor = mapBrowserEvent.coordinate;
       var delta = browserEvent.shiftKey ? -this.delta_ : this.delta_;    // 按住shift键，就缩小，否则就放大
       var view = map.getView();
       goog.asserts.assert(view, 'map must have a view');
       ol.interaction.Interaction.zoomByDelta(
           map, view, delta, anchor, this.duration_);        // 调用 ol.interaction.Interaction.zoomByDelta函数实现放大缩小
       mapBrowserEvent.preventDefault();
       stopEvent = true;
     }
     return !stopEvent;
   };
```


代码其实很简单，如果要自己实现一种交互方式，对照ol.interaction.DoubleClickZoom这个学习，再加以应用就可以了。


### feature 选取之选中样式



OpenLayers 3除了在地图浏览方面提供内置的交互方式之外，还提供了地图上Feature选取的交互类： ol.interaction.Select。 这是一个经常会用到的类，应用范围非常的广。 我们可以先简单操作一下下面地图中的圆，点击一下，颜色就变了：

在[自定义事件](http://weilin.me/ol3-primer/ch08/08-05.html)及应用中，我们用了方法map.forEachFeatureAtPixel来获取当前选择的Feature，这个例子中，我们没有这样使用：
map.foreachfeatureatpixel 使用

```html
// 为地图注册鼠标移动事件的监听
     map.on('pointermove', function(event){
         map.forEachFeatureAtPixel(event.pixel, function(feature){
             // 为移动到的feature发送自定义的mousemove消息
             feature.dispatchEvent({type: 'mousemove', event: event});
         });
     });
```


*  自定义，不使用    foreachfeatureatpixel  指定点击事件
```html

<div id="map" style="width: 100%"></div>
<script type="text/javascript">
    var layer = new ol.layer.Vector({
        source: new ol.source.Vector()
    });
    var map = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          layer
        ],
        target: 'map',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    // 在地图上添加一个圆
    var circle = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'))
    })
    circle.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 10,
            fill: new ol.style.Fill({
                color: 'red'
            })
        })
    }));

    layer.getSource().addFeature(circle);

    // 前面的代码我们已经看了很多遍了，关键是下面这段代码
    // 添加一个用于选择Feature的交互方式
    var selectSingleClick = new ol.interaction.Select({
        // API文档里面有说明，可以设置style参数，用来设置选中后的样式，但是这个地方我们注释掉不用，因为就算不注释，也没作用，为什么？
        // style: new ol.style.Style({
        //     image: new ol.style.Circle({
        //         radius: 10,
        //         fill: new ol.style.Fill({
        //             color: 'blue'
        //         })
        //     })
        // })
    });
    map.addInteraction(selectSingleClick);
    // 监听选中事件，然后在事件处理函数中改变被选中的`feature`的样式
    selectSingleClick.on('select', function(event){
        event.selected[0].setStyle(new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: 'blue'
                })
            })
        }));
    })

</script>
```


官网其实有例子select-features，但是这里面还是有一些需要注意的地方，比如上面注释里面说到的，为什么style参数设置了没用？ 因为我们的circle本身就设置了样式，而style参数设置的样式，其实是设置在内部新建的一个layer上的，而OpenLayers 3中，feature的样式优先级是大于layer的样式的优先级的。所以没生效，如果换成下面这种方式，就可以了：

改成下面代码就行了

```html
<div id="map2" style="width: 100%"></div>
<script type="text/javascript">
    var layer2 = new ol.layer.Vector({
        source: new ol.source.Vector(),
        // 注意：把feature上的style，直接移到layer上，避免直接在feature上设置style
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: 'red'
                })
            })
        })
    });
    var map2 = new ol.Map({
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          layer2
        ],
        target: 'map2',
        view: new ol.View({
          center: ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'),
          zoom: 10
        })
    });

    // 在地图上添加一个圆
    var circle2 = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform(
              [104, 30], 'EPSG:4326', 'EPSG:3857'))
    })
    // 此处不再为feature设置style
    layer2.getSource().addFeature(circle2);

    // 添加一个用于选择Feature的交互方式
    map2.addInteraction(new ol.interaction.Select({
        // 设置选中后的style
        style: new ol.style.Style({
            image: new ol.style.Circle({
                radius: 10,
                fill: new ol.style.Fill({
                    color: 'blue'
                })
            })
        })
    }));
</script>
```


## openlayers 画形状



### Openlayers 画各种形状总结


#### 各种博主总结

* [openlayers3 画 点 圆 多边折线](https://blog.csdn.net/u012413551/article/details/95729028)

部分记录：
```
这里重点需要关注的的几个参数：
type: 绘图的几何类型
source: 源，必须是矢量源，用于承载你绘制的图形要素
freehand: 徒手模式，值为真时可以鼠标跟随绘制，不用点击地图。
```


* [区域画矩形](https://aaron2010.iteye.com/blog/1468584)
* [华静态边界线](https://blog.csdn.net/u014529917/article/details/52522823)


### jquery 数组

* jquery数组操作：https://www.cnblogs.com/huangyin1213/p/5573676.html


