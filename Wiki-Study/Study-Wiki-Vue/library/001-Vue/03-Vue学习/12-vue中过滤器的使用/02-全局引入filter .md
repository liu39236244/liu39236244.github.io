# 全局引入过滤器 

## 总结

### main中全局引入过滤器



> 1. src下创建 filters 目录，创建index.js 文件 

```js

exports.formatMoney = (value) => {
  if (value) {
    value = Number(value);
    return '￥ ' + value.toFixed(2);
  }
};

exports.statusName = (val) => {
  let statusName = '';
  switch (val) {
    case 0: {
      statusName = '已取消';
      break;
    }
    case 10: {
      statusName = '未付款';
      break;
    }
    case 20: {
      statusName = '已付款';
      break;
    }
  }
  return statusName;
};

```


> 2. main.js 中 引入 此过滤器

```js
// 引入自定义过滤器
import filters from './filters';

// 自定义过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
```



> 3. 过滤器使用

{{ 值 | 过滤器名字 | 过滤器名字2 ...}}

```html

            <div>队长名称:
                <el-tag type="info">{{teamDetailObj.createPeopleName  | statusName}}

                </el-tag>
            </div>
```


## 案例

原博主地址：https://blog.csdn.net/qq_35285627/article/details/80805705
