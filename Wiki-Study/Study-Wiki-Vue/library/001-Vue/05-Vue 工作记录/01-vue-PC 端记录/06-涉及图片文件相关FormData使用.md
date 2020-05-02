# 表单中涉及图片相关的数据pc端需要用formdata 使用


# formData 数据介绍


# formData 用法 


# formdata 数据使用案例


## 添加图片为例

* 上传图片前端使用 《input》 标签

```html
<tr>
            <td class="formTitle">隐患图片：</td>
            <td class="formValue" colspan="3">
              <div class="imgbox imgCon clearfix">

                <template v-for="(file,index) in EditPicArr">
                 <span class="pic-container">
                   <img :src="baseUrl+'/mongodb/getDownloadOutputStream?fileId='+ file" class="img inpImgBox">
                   <i class="closeImg" @click="removeFile($event,1,file,index)"></i>
                 </span>
                </template>

                <template v-for="(url,index) in picPreArr">
		                <span class="pic-container">
		                  <img :src="url" class="img inpImgBox">
		                  <i class="closeImg" @click="removeFile($event,0,'',index)"></i>
		                </span>
                </template>
                <div v-show="isShowFileInput" class="pic-container clearfix">
                  <div class="inpImg clearfix">
                    <input ref="fileInput1" @change="selectFile" type="file" placeholder="请选择文件"
                           accept="image/jpg,image/jpeg,image/gif,image/bmp,image/png"/>
                  </div>
                </div>
              </div>
            </td>
          </tr>
```


```js


selectFile(){
    //图片文件选择的统一方法
  selectFile: function (obj, e) {
    let files = e.target.files || e.dataTransfer.files;
    let self = this;
    if (files.length) {
      let flag = false;
      let allImgExt = '.jpg|.jpeg|.gif|.bmp|.png|';
      let filePath = e.target.value;
      let extName = filePath.substring(filePath.lastIndexOf(".")).toLowerCase();
      if (allImgExt.indexOf(extName + '|') == -1) {
        obj.$layer.alert('请选择正确的图片类型！', (id) => {
          obj.$layer.close(id);
        });
        return;
      }
      let arr = filePath.split('\\');
      let file = files[0];
      if (file.size / 1024 > 1000) {//大于1兆的情况下进行压缩
        flag = true;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      if (flag) {
        reader.onloadend = function () {
          obj.picArr.push(reader.result); // result 就是base64 的数据，
          let result = this.result;
          let img = new Image();
          img.src = result;
          img.onload = function () {
            let data = self.compress(img);
            self.imgUrl = result;
            let blob = self.dataURItoBlob(data); //
            obj.fileArr.push(blob); // 所以最终 上传到mongodb 中的图片是blob 图片数据
          };
        };
      } else {
        reader.onloadend = () => {
          obj.picArr.push(reader.result);
          obj.fileArr.push(file);
        }
      }

    }
    //e.target.value = '';
    //obj.$previewRefresh();手机预览
  },
}

base64 转 blob

// base64转成bolb对象
  dataURItoBlob(base64Data) {
    var byteString;
    if (base64Data.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(base64Data.split(",")[1]);
    else byteString = unescape(base64Data.split(",")[1]);
    var mimeString = base64Data
      .split(",")[0]
      .split(":")[1]
      .split(";")[0];
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString});
  },

save: function () {

        // 这里的
        this.$validator.validateAll().then((result) => {
          if (result) {
            this.$layer.alert('确定提交信息吗？', (id) => {
              this.$layer.close(id)
              //需要把人的值加入
              this.axios.post(this.baseUrl + '/danger/dangerinfo/saveDangerinfo', this.item, {
                headers: {
                  'Content-Type': 'application/json'
                }
              }).then((response) => {
                if (response.data.code == 1) {

                  let formData = new FormData();
                  if (this.fileArr.length) { // 文件选择其新选择的文件id
                    this.fileArr.forEach((item) => {
                      formData.append('files1', item);
                    });
                  }
                  if (this.fileIds.length) { // 需要删除的文件id
                    this.fileIds.forEach((item) => {
                      formData.append('fileIds', item);
                    });
                  }

                  formData.append("parentId", response.data.data.id);
                  if(this.operation=="add"){
                    formData.append("fjSource", 'dangerInfo_check'+"|"+response.data.data.flowId);
                  }else {
                    formData.append("fjSource", 'dangerInfo_check'+"|"+this.dangerFlowIdpaicha);
                  }
                  formData.append("type", 1); // 隐患图片：1

                  if (this.fileArr.length > 0 || this.fileIds.length > 0) { // 如果选择了图片 就进行图片添加
                    this.axios.post(this.baseUrl + '/mongodb/DangerMongodb/saveDangerinfoImage', formData, {
                      headers: {
                        'Content-Type': 'application/json'
                      }
                    }).then((response) => {
                      if (response.data.code == 1) {
                        this.$layer.close(this.$options.propsData.layerid);
                        // 图片上传成功！
                      } else {
                        this.$layer.msg('图片上传失败！');
                        this.$layer.close(this.$options.propsData.layerid);
                      }
                    });
                  }
                  this.$layer.msg('保存成功！');
                  this.$layer.close(this.$options.propsData.layerid);
                  // 图片上传成功！
                  this.refreshParentGrid()

                } else {
                  this.$layer.msg('数据保存操作失败！');
                }
              }).catch((e) => {
              })
            }) // 确定

          } else {
            this.common.promptLayer(this, this.$validator.errors.all());
          }
        })
      }
```


* 后端

```java
@PostMapping(value = "/saveDangerinfoImage", produces = "application/json;charset=UTF-8")
    @Override
    public RestMessage saveDangerinfoImage(String parentId, MultipartFile[] files1, String [] fileIds ,String fjSource, Integer type, HttpServletRequest request) {
        try {
            //删除之前的照片
            if(fileIds!=null && fileIds.length>0){
                for (int k=0;k<fileIds.length;k++) {
                    fileinfoservice.delFiles(fileIds[k]);
                    mongoDbUtil.deleteByFileId(fileIds[k]);//上传到mongodb
                }
            }
            if (files1 != null && files1.length > 0) {
                //上传第1种多个附件
                for (int i = 0; i < files1.length; i++) {
                    String mongodbid1 = mongoDbUtil.uploadFileBackId(files1[i], request);
                    FileInfo fileInfo = new FileInfo();
                    fileInfo.setId(mongodbid1);
                    fileInfo.setParentId(parentId);
                    fileInfo.setName(files1[i].getOriginalFilename());
                    fileInfo.setAttachType(files1[i].getOriginalFilename().substring(files1[i].getOriginalFilename().indexOf(".")));
                    if(fjSource.contains("null")||fjSource.contains("undefined")){
                            // 說明是修改 , 仅仅设置type操作
                        fileInfo.setType(new Integer(type));
                    }else{
                        setHiddenDangerFjSAndType(fileInfo, fjSource, type);
                    }
                    fileInfo.setCreateTime(new Date());
                    fileinfoservice.insertFileInfo(fileInfo);
                }
            }
            return new RestMessage();
        } catch (Exception ex) {
            ex.printStackTrace();
            return new RestMessage(RespCodeAndMsg.FAIL);
        }
    }
```