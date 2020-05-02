# bootstrap 获取表格数据



```js


$(".optioncolum").on("click", ".trash", this.deleteDire);

 deleteDire: function () {
        var el = event.currentTarget;
        var ids = $(el).parents("tr").attr('data-uniqueid');
        if (ids) {
          this.ids = ids
          this.$layer.alert('确定要删除所选项吗？', (id) => {
            this.axios.delete(this.baseUrl + '/danger/dangeraccount/deletedangersByids/' + ids, {}).then((res) => {
              if (res.data.code == 1) {
                this.initGrid(1);
                this.$layer.msg('操作成功！');
                this.$layer.close(id);
              }
            });
          });
        }
      }

 
```

## 图片预览

```js
this.axios.get(this.baseUrl + '/mongodb/getMongodFileInfoById?fileId=' + fileId, {}).then((res) => {
					var fileType = res.data.data.type
					if(fileType == '.jpg' || fileType == '.bmp' || fileType == '.png' || fileType == '.jepg') {
						this.$layer.iframe({
							title: '图片预览',
							content: {
								content: previewImg,
								parent: this, //当前的vue对象
								data: {
									'src': this.baseUrl + '/mongodb/getDownloadOutputStream?fileId=' + fileId
								} //props
							},


   previewFiles: function(event) {
    //				var el = event.currentTarget;
    //				var parentId = $(el).parents("tr").attr('data-uniqueid');
    //				this.axios.post(this.baseUrl + '/law/getFilesIdByParentId/' + parentId + '', {}).then((res) => {
    //					var ids = res.data.data
    //					if(ids != null) {
    //						for(var index in ids) {
    //							window.open('http://10.0.0.48:8091/mongodb/getDownloadOutputStream?fileId=' + ids[index]);
    //						}
    //					}
    //				});
```