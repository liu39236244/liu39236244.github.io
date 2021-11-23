# 前端存储cookie

## vue项目使用存储、读取cookie


```
    setCookie(name, value, days) {
        let d = new Date();
        d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
        window.document.cookie =
            name + '=' + value + ';path=/;expires=' + d.toGMTString();
    },
    getCookie(name) {
        let v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        return v ? v[2] : null;
    },
    deleteCookie(name) {
        this.setCookie(name, '', -1);
    },


    //保存用户名与密码 this.rem就是是否保存账号是否勾选

    keepNameAndPwd() {
        if (this.rem) {
            this.setCookie('username', this.form.username, 7);
            this.setCookie('password', this.form.password, 7);
        } else {
            this.deleteCookie('username');
            this.deleteCookie('password');
        }
    },
```