# 记录openlayers 案例

# 以下是博主记录的案例

## openlayers3 画线段

### 博主

[博主1](https://blog.csdn.net/zhongshijun521/article/details/61198600)

### 案例代码

根据经纬度点话线条

```
function addLine(begin,end,layer){
var line = new ol.Feature({

geometry:new ol.geom.LineString([[begin.geox,begin.geoy], [end.geox,end.geoy]])

});
line.setStyle(new ol.style.Style({

stroke: new ol.style.Stroke({

width: 5,

color:'#5298FF'
})

}));

layer.getSource().addFeature(line);
}
```


# 以下记载了 官网案例


# Ol.Style.Text



# feature添加

## Clustered Features 集群功能，多个feature

[原文地址](https://openlayers.org/en/latest/examples/cluster.html?q=ol.style.text.img)


## Draw Features 画feature


[原文地址](https://openlayers.org/en/latest/examples/draw-features.html?q=ol.style.text.img)

# 画图案修改线条等
## Modify Features Test - 修改功能测试

* 画布同组的图案并且可以进行修改

[原文地址](https://openlayers.org/en/v4.6.5/examples/modify-test.html?q=ol%2Fstyle%2FText)


## Regular Shapes -设置不同形状


[原文地址](https://openlayers.org/en/v4.6.5/examples/regularshape.html?q=ol%2Fstyle%2FText)


## Marker Animation- 两个地点划线然后添加动画移动

[原文地址](https://openlayers.org/en/v4.6.5/examples/feature-move-animation.html?q=ol%2Fstyle%2FText)


## Draw and Modify Features 能够画线条形状并且能够进行修改

[原文地址](https://openlayers.org/en/latest/examples/draw-and-modify-features.html?q=ol.style.text.img)
