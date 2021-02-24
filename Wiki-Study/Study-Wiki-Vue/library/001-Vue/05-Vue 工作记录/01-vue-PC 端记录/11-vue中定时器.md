# vue 中定时器

## 定时考试案例

```js

// duration 考试时间
t = setInterval(() => {
        if (this.duration > 0) {
          let endTime = this.duration * 60 - second
          let hh, mm, ss = null
          if (endTime >= 0) {
            hh = Math.floor(endTime / 60 / 60);
            mm = Math.floor((endTime / 60) % 60);
            ss = Math.floor(endTime % 60);
            if (hh.toString().length === 1) {
              hh = "0" + hh
            }
            if (mm.toString().length === 1) {
              mm = "0" + mm
            }
            if (ss.toString().length === 1) {
              ss = "0" + ss
            }
            this.djs = hh + ":" + mm + ":" + ss;
            second++
          } else {
            this.$message({
              message: '考试时间已结束，试卷将自动进行提交!',
              type: 'warning',
              duration: 1500,
              onClose: () => {
                this.autoSubmit = true
                this.submitPaper()
              }
            })
            clearInterval(t)
          }
        }
      }, 1000);
```