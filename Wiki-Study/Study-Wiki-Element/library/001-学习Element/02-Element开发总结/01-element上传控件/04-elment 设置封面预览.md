# elment 上传组件设置封面预览


## 较为完整的自定义按钮以及照片墙


```js
<template>
  <div style="padding: 0;" class="editCourse">
     <el-row type="flex">
      <el-col :span="24">
        <el-form ref="courseInfo" size='small' :model="courseInfo" :rules="rules" label-width="110px"
                 class="demo-ruleForm">
          <el-row>
            <el-col :span="24">
              <el-form-item label="名称:" prop="name">
                <el-input v-model="courseInfo.name"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="课程封面:" class='addImg'>
                <el-upload
                  ref="uploadImmediatePreview"
                  class="upload-demo"
                  :action="acceptApi"
                  :on-remove="handleRemove"
                  :on-success="handleSuccess"
                  :before-upload="beforeUpload"
                  :file-list="fileList"
                  list-type="picture-card"
                >
                  <i slot="default" class="el-icon-plus"></i>
                  <div slot="file" slot-scope="{file}">
                    <!--<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" height="150px">-->
                    <el-image
                      style="width: 100%; height: 150px"
                      :src=file.url
                      fit="contain"
                    ></el-image>
                    <span class="el-upload-list__item-actions">
                        <span
                          style="margin-left: 30px"
                          class="el-upload-list__item-preview"
                          @click="handlePreview(file)"
                        >
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span
                          style="margin-left: 4px"
                          class="el-upload-list__item-delete"
                          @click="handleDownload(file)"
                        >
                          <i class="el-icon-download"></i>
                        </span>
                        <span
                          style="margin-left: 4px"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>

                  </div>
                  <div slot="tip" class="el-upload__tip" style="color: red;">
                    只能上传{{acceptFileType}}文件，大小不超过{{limitSize}}
                  </div>
                </el-upload>
              </el-form-item>
            </el-col>
             </el-row>
        </el-form>
      </el-col>
    </el-row>
  <div slot="footer" class="dialog-footer" style="margin-top: 10px;text-align: center;">
      <el-button type="primary" @click="editCourse" :disabled="isSubmit">保存</el-button>
    </div>

    <el-dialog :visible.sync="previewDialogVisible"
               :before-close="previewImgClose"
               append-to-body
    >
      <div slot="title"
           class="dialog-title">图片预览
      </div>
      <div class="img-content">
        <el-image

          style="width: 100%; height: 340px"
          :src=previewDialogImageUrl
          fit="contain"
          :preview-src-list="previewDialogImageList"
        >
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>

// 在created 中初始化

 export default {
    name: "editCourse",
    props: ['dataInfo', 'moduleArr'],
    data() {
      return {
          // 上传地址
            acceptApi:""
            acceptFileType: "png,bmp,jpg,jpeg",
            limitSize: "10M",


            // 封面使用变量
            previewDialogImageUrl: "",
            previewDialogVisible: false,
            previewDialogImageList: []
      }
    }
 }

created() {

    this.courseInfo = this.dataInfo;
    this.moduleId = this.courseInfo.moduleId;
    //图片上传id,如果没有就生成一个uuid
    if (this.courseInfo.pictureid) {
        // 说明是编辑页面
        this.acceptApi = this.baseUrl + this.acceptApiBaseSpe + this.courseInfo.pictureid
        this.getPicture(this.courseInfo.pictureid)
    } else {
        let uuid = this.getUUid()
        this.courseInfo.pictureid = uuid
        this.acceptApi = this.baseUrl + this.acceptApiBaseSpe + uuid
    }
    // acceptApi http://10.0.2.55:13722/api/mongodb/fileInfo/uploadFileInfo?parentId=5b343f5a-750e-4aa7-8fb2-eaa0d585408d
    console.log("acceptApi",this.acceptApi);
    
    },
}

methods: {
    //文件上传前的钩子（这个感觉中间变量定义有点不好，以后得进行改动）
      beforeUpload(file) {
        //判断大小,取出页面传递指定大小
        let limitSize = this.limitSize.split('M')[0]
        //判断文件类型是否相符
        const name = file.name ? file.name : '';//file.name为true 赋值给a，否则赋值空串
        const fileName = name.substr(name.lastIndexOf('.') + 1, name.length) //上传文件类型截取，截取(最右侧出现第一个()的位置，截取末端的位置)
        const ext = fileName ? fileName : true;//filename为true 赋值给ext，否则赋值true
        const isExt = this.acceptFileType.indexOf(ext) < 0;//判断文件类型在索引值中的位置,如果存在为否,不存在为真
        if (isExt) {//存在不执行
          this.$message.error('请上传png,bmp,jpg,jpeg类型的文件');
          return !isExt;
        }
        //读取文件大小
        let fileSize = file.size;
        limitSize = parseFloat(limitSize) * 1024 * 1024
        if (fileSize > limitSize) {
          this.$message({
            type: 'error',
            showClose: true,
            duration: 3000,
            message: `文件大于10M!`
          });
          return false;
        }
      },
    //上传成功后的事件
      handleSuccess(res, file, fileList) {
        file.id = res.data.id
      },
    //删除图片的事件
      handleRemove(file, fileList) {
        this.axios.delete(this.baseUrl + "/mongodb/fileInfo/delFiles/" + file.id, {
          headers: {"Content-Type": "application/json"}
        }).then(res => {
          if (res.data.code == 1) {
            return true;
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning',
              center: true,
              offset: '50%'
            });
            return false
          }
        })
        let deleteIndex = 0;
        for (var i in this.$refs.uploadImmediatePreview.uploadFiles) {
          if (this.$refs.uploadImmediatePreview.uploadFiles[i].uid == file.uid) {
            deleteIndex = i;
            break;
          }
        }
        this.$refs.uploadImmediatePreview.uploadFiles.splice(deleteIndex, 1);
      },


      
    //获取封面图片的事件
    getPicture(id) {
        this.axios.post(this.baseUrl + '/mongodb/fileInfo/getFileInfoList', {
        parentId: id,
        type: ''
        }).then((res) => {
        if (res.data.code == 1) {
            let arrData = res.data.data.rows;
            arrData.map(item => {
            this.fileList.push({
                url: this.baseUrl + '/mongodb/getDownloadOutputStream?fileId=' + item.id,
                id: item.id
            })
            })
        }
        })
    },
    //点击图片预览的事件
    handlePreview(file) {
    this.previewDialogImageUrl = file.url;
    this.previewDialogVisible = true;
    this.previewDialogImageList.push(file.url)
    },
    //点击下载图片
    handleDownload(file) {
    window.location.href = this.baseUrl + '/mongodb/downloadFile' + '?fileId=' + file.id
    },
}



<style scoped>
  .editCourse .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .editCourse .el-form-item {
    padding-right: 30px;
  }

  .editCourse .el-form-item__label {
    padding: 0 12px 0 20px;
  }

  .editCourse .el-form-item__content span {
      /*阴影按钮宽度*/
    display: inline-block;
    width: 100%;
    text-align: left;
    cursor: pointer;
  }



  .editCourse .title {
    margin-bottom: 15px;
    border-bottom: 1px dotted #ddd;
  }

  .editCourse .title > p {
    font-size: 0.115rem;
    font-weight: bold;
    color: #434343;
    text-align: left;
    padding-left: 10px;
    border-left: 3px solid #005bac;
  }

  /* .editCourse  .el-col-12 >>> .el-form-item__content{
	  height: 40px;
	} */
  .addImg {
    text-align: left;
  }

  /*图片预览*/
  .img-content {
    width: 100%;
    height: 350px;
    overflow: auto;
  }

  /*dialog标题样式*/
  .dialog-title {
    text-align: left;
    font-size: 0.115rem;
    font-weight: 500;
    color: #FFFFFF;
    white-space: nowrap;
  }

  .el-upload-list__item-actions span{
    width: auto !important;
  }

</style>

```