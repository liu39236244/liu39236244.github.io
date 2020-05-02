# Promise 优雅处理

## 总结


### Demo

```js
 //1  更新票数据
saveHazardousMainData(row) {
    return new Promise(param=>{
        // console.log(this.form.hazardousMain)
        this.axios.post("/ehs/hazardous/saveHazardousMain", this.form.hazardousMain).then(res => {
            if (res.data.code === this.axios.SUCCESS) {
                this.form.hazardousMain.id = res.data.data;
                let workMainId = this.form.hazardousMain.id;
                this.common.msgSuccess(['hazardousOperation.hazardousMainData','hazardousOperation.ticket','table.common.save','success']);
            }
        }).catch(err => {
            this.common.msgErr(['hazardousOperation.hazardousMainData','hazardousOperation.ticket','table.common.save','fail']);
        })/*.then(res=>{ // 保存people
            if(row){ // 如果有row 參數则为保存人
                row.workMainId = this.form.hazardousMain.id;
                // console.log("row.workMainid----------",row.workMainId)
                this.saveHazardousSinglePeople(row);
            }
        })*/
    })

},

别处使用：
   let max = await this.saveHazardousMainData(row);
   // 下面的不知执行
    row.workMainId = this.form.hazardousMain.id;
    console.log("form.peoples",this.form.hazardousMainGuardianPeople)
    console.log("row.workMainid----------",row.workMainId)
    this.saveHazardousSinglePeople(row);

```


## 博主：

### [优雅处理同步，原文地址](https://www.cnblogs.com/zhazhanitian/p/11206663.html)

```js

class Api {
    constructor () {
        this.user = { id: 1, name: 'test' }
        this.friends = [ this.user, this.user, this.user ]
        this.photo = 'not a real photo'
    }
 
    getUser () {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.user), 200)
        })
    }
 
    getFriends (userId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.friends.slice()), 200)
        })
    }
 
    getPhoto (userId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.photo), 200)
        })
    }
 
    throwError () {
        return new Promise((resolve, reject) => {
            setTimeout(() => reject(new Error('Intentional Error')), 200)
        })
    }
}



```

* 很臃肿 
```js
function callbackHell () {
    const api = new Api()
    let user, friends
    api.getUser().then(function (returnedUser) {
        user = returnedUser
        api.getFriends(user.id).then(function (returnedFriends) {
            friends = returnedFriends
            api.getPhoto(user.id).then(function (photo) {
                console.log('callbackHell', { user, friends, photo })
            })
        })
    })
}
```

在真实的代码库中，每个回调函数可能会非常长，这可能会导致庞大且深层交错的函数。处理这种类型的代码，在回调中继续使用回调，就是通常所谓的“回调地狱”。

更糟糕的是，这里没有错误检查，所以其中任何一个回调都可能会悄无声息地发生失败，表现形式则是未处理的 Promise 拒绝。

* promise 链


```js


function promiseChain () {
    const api = new Api()
    let user, friends
    api.getUser()
        .then((returnedUser) => {
            user = returnedUser
            return api.getFriends(user.id)
        })
        .then((returnedFriends) => {
            friends = returnedFriends
            return api.getPhoto(user.id)
        })
        .then((photo) => {
            console.log('promiseChain', { user, friends, photo })
        })
}
```

Promise 非常棒的一项特性就是它们能够链接在一起，这是通过在每个回调中返回另一个 Promise 来实现的。通过这种方式，我们能够保证所有的回调处于相同的嵌套级别。我们在这里还使用了箭头函数，简化了回调函数的声明。

这个变种形式显然比前面的更易读，也更加具有顺序性，但看上去依然非常冗长和复杂。


* 使用 async awit


```js
第三次尝试：Async/Await
在编写的时候怎样才能避免出现回调函数呢？这难道是不可能实现的吗？怎样使用 7 行代码完成编写呢？

async function asyncAwaitIsYourNewBestFriend () {
    const api = new Api()
    const user = await api.getUser()
    const friends = await api.getFriends(user.id)
    const photo = await api.getPhoto(user.id)
    console.log('asyncAwaitIsYourNewBestFriend', { user, friends, photo })
}
```

这样就更好了。在返回 Promise 函数调用之前，添加“await”将会暂停函数流，直到 Promise 处于 resolved 状态为止，并且会将结果赋值给等号左侧的变量。借助这种方式，我们在编写异步操作流时，能够像编写正常的同步命令序列一样。

博主写的这个博客很棒！



