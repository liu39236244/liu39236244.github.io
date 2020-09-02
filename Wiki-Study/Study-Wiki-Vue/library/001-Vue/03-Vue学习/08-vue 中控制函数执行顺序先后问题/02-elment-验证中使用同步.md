# elment 在 validate 中使用同步 await

## 案例如下

* 总结，elment 验证中使用同步，主要是在匿名函数加 async 外层(写   this.$refs.form.validate 外一层的函数)是不行的


```js
 // 保存
      // 外层不用再加 async 了  
      saveCourseChapter(ifCloseAddPage) {

        let this_=this;
         this.$refs.form.validate(async (valid) => { // 注意这里如果不添加async 的话，无法在内层使用await 
          if (valid) {
              console.log("通过验证")
              let paramData={
                  .... // 你的数据属性，
                  age:100,
                  id:"2"
              }
              let result;
              if(action == 'add'){
                    // 这里执行添加
                    result =  await this.addCourseChapter(paramData);
              }else{
                    result = await this.updateCourseChapter(paramData);
              }

          }else{
              console.log("通过验证")
          }
```


