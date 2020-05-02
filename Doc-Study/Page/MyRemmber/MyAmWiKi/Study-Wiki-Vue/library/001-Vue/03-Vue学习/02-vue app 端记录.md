

# app 端记录

```js
this.$http({
          url: this.$http.adornUrl(`/danger/dangerinfo/getDangerphotoById`),
          method: 'get',
          params: this.$http.adornParams({
            id: this.HidenDangerDto.id
          })
        }).then(({data}) => {
          if (data && data.code === 1) {
            
          } else {
            this.$toast({
              duration: 1000,
              message: data.data
            })
          }
        }).catch(() => {
          this.$toast({
            duration: 1000,
            message: '网络异常，请稍后重试...'
          })
        })
```

```baseurl
this.$http.defaults.baseURL


```