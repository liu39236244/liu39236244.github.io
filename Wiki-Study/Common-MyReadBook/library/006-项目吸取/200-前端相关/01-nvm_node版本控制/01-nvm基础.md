# nvm 基础

## 基础命令

```
nvm version // 查看版本

nvm list　　//查看目前已经安装的版本
nvm list available //显示可下载版本的部分列表
nvm install 16.13.1 //安装指定的版本的nodejs
nvm use 16.13.1 //使用指定版本的nodejs (注意 cmd 要是用管理员身份打开)
```


## 设置npm 淘宝镜像 

```
http://npm.taobao.org和 http://registry.npm.taobao.org 将在 2022.06.30 号正式下线和停止 DNS 解析。

http://npm.taobao.org => http://npmmirror.com
http://registry.npm.taobao.org => http://registry.npmmirror.com
 

npm config set registry http://registry.npmmirror.com  //使用淘宝镜像

npm config get registry  // 查询是否设置成功

或

npm info express

npm config set registry https://registry.npmjs.org  // 回复原来的镜像地址
```
## npm 清空缓存


npm cache clean
```
npm 升到最新版本v5.3.0，刚安装webpack出现莫名的错误，清下npm缓存 npm cache clean，竟然报错。提示是npm@5版本清理缓存加 --force

或npm cache verify . 原来前段时间npm@5版本发布，最大的改进之处就是对npm缓存策略的变动。

npm 是包管理器，它对于cache提供了3个命令：

npm cache add：

add the specified package to the local cache. This command is primarily intended to be used internally by npm, but it can provide a way to add data to the local installation cache explicitly.

npm cache clean --force：

delete all data out of the cache folder.

npm cache verify：

verify the contents of the cache folder, garbage collecting any unneeded data, and verifying the integrity of the cache index and all cached data.

verify和clean --force的区别在于是否会验证缓存数据的有效性和完整性从而进行有效cache clean.

```

## 设置nvm 淘宝镜像

nvm配置淘宝镜像源
下载安装nvm工具【查看此处】: https://blog.csdn.net/bidang3275/article/details/115357916

nvm设置淘宝镜像
方法1：使用cmd
nvm node_mirror: https://npm.taobao.org/mirrors/node/
nvm npm_mirror: https://npm.taobao.org/mirrors/npm/

方法2：修改setting文件
安装路径/setting.txt
打开文件加入以下两行：

node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/

node -v
npm -v

nvm version