# github 问题记录


## 1历史命令记录



### 1.1  设置当前目录使用的git账号(如果你本地设置git账号是用globa 设置的全局的，但是你github 是你自己单独的git账号的话，你就需单独设置公司电脑 你自己的 项目目录的账号)

如果你电脑只用一个git账号 ，你就可以直接设置全局账号

```sh

设置全局git账号
 git config --global user.name "你常用的git账号，如果你在公司配置且公司有使用git 进行项目管理，则你可以设置全局设置公司gitlib 等 git账号"
 git config --global user.email "同上  的邮箱地址"

例如我公司gitlib账号，那么我自己就如下命令

    shenyabo
    Shenyabo123!
    git config --global user.name "shenyabo"
    git config --global user.email "15238043665@163.com"
    ssh-keygen -t rsa -C "15238043665@163.com"


设置局部账号

 git config --local user.name "github的账号[liu392]"

    查看命令：git config user.name

 git config --local user.email "github的账号绑定的邮箱[2268]"

    查看命令：git config user.email
```


### 1.2 生成github 在本地使用的公钥【这里我着重说一下，我最开始是按照有的博客设置的公钥文件命名  要么直接就是ids 要么就是 github】

#### 1.2.1 问题记录

***我本地设置以后一直都访问不同github 后来看了下面博主说的， 改了生成 github 公钥命名才解决了我的我问题***


这里有个博客的一句话解决了我的问题

链接如下：

https://blog.csdn.net/G_C_H/article/details/127981765

*** 默认情况下，GitHub 的一个支持的公钥的文件名是以下之一: id_rsa.pub、id_ecdsa.pub、id_ed25519.pub ***




* 指定 生成ssh 文件命令1 

    ssh-keygen -t ed25519 -C "your_email@example.com"
    ssh-keygen -t ecdsa -C "your_email@example.com"
    ssh-keygen -t rsa -C "your_email@example.com"

 * 下面. 当前目录就是 .ssh 目录


 ssh-keygen -t rsa -C "2268288783@qq.com" -f ~/.ssh/id_rsa_github




#### 1.2.2 事后总结


 看我本地创建过得

![](assets/004/01/02/02-1717727519420.png)


我是在ssh 目录下创建了一个 config的配置，没有后缀

![](assets/004/01/02/02-1717728848585.png)


```
Host gitlab
	HostName 10.0.2.6:17000
	User shenyabo
	IdentityFile ~/.ssh/id_rsa
Host github.com
	HostName github.com
	User liu39236244
	IdentityFile ~/.ssh/id_rsa_github
```


### 3 设置本地项目制定远程仓库地址 ssh (一般从别的地方复制过来的现有 github 项目 我感觉不需要设置这个，这个应该就是 用于设置了一个空的仓库，然后本地创建了一个空文件夹，想直接 关联 用)

git remote set-url origin git@github.com:git账号(liu39236244)/仓库名(liu39236244.github.io.git)

git remote set-url origin git@github.com:liu39236244/liu39236244.github.io.git

* 测试访问github 是否成功命令


ssh -T git@github.com

成功则返回如下：

Hi liu39236244! You've successfully authenticated, but GitHub does not provide shell access.




## 3 记录一次本地github 与本地 gitlib 记录


### 背景

问题背景：问题起初是因为换了新电脑，我把旧电脑上的 git 的一个项目文件夹给直接复制到电脑上，但是新电脑在尝试往我github 项目替代码之前我本地做了两天公司gitlib 的一个项目

问题： 项目处理完以后我打算将我新电脑上的笔记进行调试(因为旧电脑刚复制过来的肯定不能直接提交，1 需要新电脑上面设置ssh 并生成公钥配置到github上，2 要设置github的账号 这是我印象中需要做的) 


### 1 总结


#### 配置过程重要关注点就是github默认支持的公钥 文件命名 、如果想要自己命名 公钥文件 name需要加一个 config 文件， 且这个文件 直接就是config 无后缀即可

这里就不记录我中间试错了， 直接写流程， 总结我本地vscode  配完 github 上的 公钥 还是本地vscode 不能拉代码，我这里 

```
1.  给github 项目目录设置单独github 账号； 没问题
2.  我出问题出在因为设置了多个 git账号，但是我不知道 github 支持默认的 ssh 下的 config 配置文件生效问题
    2.1 ssh 下多个账号生成的公钥与秘钥 有多个 ，但是github 默认支持(也就是不用cofig 配置的话 ) 
        默认情况下，GitHub 的一个支持的公钥的文件名是以下之一: id_rsa.pub、id_ecdsa.pub、id_ed25519.pub 
            也就是需要 密钥文件 不是 公钥文件 在没在配置config 情况 必须是上面这三个。否则就会有问题

    2.2 配置文件生效需要ssh 下面创建 config 文件即可，不需要后缀，

config

    Host gitlab
        HostName 10.0.2.6:17000
        User shenyabo
      IdentityFile ~/.ssh/id_rsa
    Host github.com
        HostName github.com
        User liu39236244
        IdentityFile ~/.ssh/id_rsa_github

```




#### 1 在注意上述rsa 情况下，直接配置完公钥到github 就可以直接与github 关联啦！
