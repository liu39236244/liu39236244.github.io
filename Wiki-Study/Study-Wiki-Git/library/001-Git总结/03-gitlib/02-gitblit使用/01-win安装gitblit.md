# win gitlib 安装使用

* 参考博客：https://blog.csdn.net/a513684882/article/details/80229141
* 详细端口配置：https://www.jianshu.com/p/0f67398c672f

## 安装包版

* 修改gitlib 文件路径
// (资料库路径)
git.repositoriesFolder = D:/shenyabo-work/my-local-gitlib

* 修改端口：


# server.httpBindInterface = 0.0.0.0
server.httpPort = 10101
server.httpBindInterface = 10.0.2.55
server.httpsBindInterface = localhost

* 设置为 win服务

设置以Windows Service方式启动Gitblit.

在Gitblit目录下，找到installService.cmd文件。

以Windows Service方式启动Gitblit.

3. 修改 ARCH

32位系统：SET ARCH=x86

64位系统：SET ARCH=amd64

4. 添加 CD 为程序目录

SET CD=D:\Git\Gitblit-1.6.0(你的实际目录)

5. 修改StartParams里的启动参数，给空就可以了。

![](assets/001/03/02/01-1615516385544.png)


1.双击Gitblit目录下的installService.cmd文件(以管理员身份运行)。

## war 版本


