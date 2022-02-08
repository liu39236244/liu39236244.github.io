# vue 强制渲染

vue页面中通过v-for进行数据渲染，如果层次太多，有时候数据发生改变但是页面上看到的效果是毫无变化。render函数没有自动更新，可以通过this.$forceUpdate()手动刷新.

当视图层无法就行数据更新时，用this.$forceUpdate()进行视图层重新渲染。当然用this.$set(),数据也会视图层更新。