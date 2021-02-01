# vue 中props 设置默认值

```js
props: {
    rowClick: {
      type: Function,
      default: function() {}
    },
    title: {
      type: String,
      default: "标题"
    },
    display: {
      type: String,
      default: "table" 
    },
    columnCount: {
      type: Number,
      default: 4
    },
    columns: {
      type: Array,
      default() {
        return [];
      }
    },
    showPage: {
      type: Boolean,
      default: true
    },
    api: {
      type: Object,
      default() {
        return {};
      }
    },
    parameter: {
      type: Object,
      default() {
        return {};
      }
    },
    defaultParameter: {
      type: Boolean,
      default() {
        return true;
      }
    }
  },
```