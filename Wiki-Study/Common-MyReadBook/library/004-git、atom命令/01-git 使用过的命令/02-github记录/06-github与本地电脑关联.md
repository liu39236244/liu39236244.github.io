# 1 github 关联远程账号

## 1.1 ssh方式：生成默认公钥名称就是  ： id_rsa ， 这里讲自定义名称，因为电脑有可能需要有多个公钥

1 本地电脑生成公钥/私钥 ； 目录就在你电脑账号的ssh目录下 ：
ssh-keygen -t rsa -b 4096 -C "wsp0806@163.com" -f id_rsa_shenyabo_github

C:\Users\lenovo\.ssh

私钥：id_rsa_shenyabo_github
公钥 ：id_rsa_shenyabo_github.pub  【公钥是在github 上加的】

code:

git@github.com:wps0806/bridge-map.git

2 配置文件

C:\Users\lenovo\.ssh

Host github.com
       HostName github.com
       User wps0806@163.com
       IdentityFile ~/.ssh/id_rsa_shenyabo_github
Host github.com
       HostName github.com
       User wps0806@163.com
       IdentityFile ~/.ssh/id_rsa_shenyabo_wangpeisi

## 2 关联远程仓库

### 2.1 远程github 创建空仓库 【设置私有/设置描述 等等】

### 2.2 本地创建空仓库【前提是本地需要有gith 】

1 在空的目录中 gitbash

2 执行命令： git init ，空目录下就有个 .git 的隐藏目录

3 配置当前项目的邮箱账号：
git config --global --list

 git config user.email wps0806@163.com
 git config user.name wps0806@163.com

4. # 添加所有文件到仓库

git add .

4.1 git .ignore  ；设置忽略掉的一些文件以及一些文件夹 在 git add . 之前创建

5 # 提交更改
git commit -m "Initial commit 初始化了项目"

6 # 添加 GitHub 远程仓库
git remote add origin https://github.com/yourusername/your-repository-name.git

7 推送
7.1 推送前创建分支：
	git branch 【查看当前所有的分支】
	git push -u origin dev/wangpeisi

# 方法1：创建并立即切换到新分支

git checkout -b 分支名称

# 方法2：分步操作

git branch 分支名称    # 创建分支
git checkout 分支名称  # 切换到分支

# 方法3：从特定分支创建（如从main分支创建）

git checkout -b 分支名称 origin/main

7.2 要么直接推送
git push -u origin master

### 最后

git 配置代理

git config --global http.proxy http://代理服务器地址:端口
git config --global https.proxy https://代理服务器地址:端口

例如：
git config --global http.proxy http://192.168.1.25:7890
git config --global https.proxy https://192.168.1.25:7890

git config --global --unset http.proxy
git config --global --unset https.proxy



## 使用记录

### 当前目录

ssh-keygen -t rsa -b 4096 -C "2268288783@qq.com" -f id_rsa_shenyabo_github
### 制定目录
ssh-keygen -t rsa -b 4096 -C "2268288783@qq.com" -f ~/.ssh/id_rsa_shenyabo_github

### 创建配置文件，应为多个git的话就是需要配置

~/.ssh/config  文件


Host github.com-shenyabo
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_shenyabo_github
    IdentitiesOnly yes
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p

### 原来用：
git clone git@github.com:用户名/仓库名.git

### 现在改成（注意 Host 别名）：
git clone git@github.com-shenyabo:用户名/仓库名.git    

#### 不设置别名
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_shenyabo_github
    IdentitiesOnly yes

** 注意配置git代理只对https生效ssh 不生效 ** 

```sh
# 全局代理（所有 github.com 连接都走代理）
Host github.com
    HostName github.com
    User git
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p

# 个人账号
Host github.com-shenyabo
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_shenyabo_github
    IdentitiesOnly yes
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p

# 公司账号（如果有）
Host github.com-work
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_work_github
    IdentitiesOnly yes
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p
```


## git 拉去github上的代码最终解决方案

ssh-keygen -t rsa -b 4096 -C "2268288783@qq.com" -f ~/.ssh/id_rsa_shenyabo_github


~/.ssh/config  文件

linux 有nc的情况 文件内容

```
# 全局代理（所有 github.com 连接都走代理）
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_shenyabo_github
    IdentitiesOnly yes
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p

# 个人账号
Host github.com-shenyabo
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_shenyabo_github
    IdentitiesOnly yes
    ProxyCommand nc -X 5 -x 127.0.0.1:7890 %h %p

```

如果没有nc 就用下面connect（windows用户）

```

Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_shenyabo_github
    IdentitiesOnly yes
    # 用 connect 代替 nc（Git for Windows 自带）
    ProxyCommand connect -S 127.0.0.1:7897 %h %p
    # 或 HTTP 代理
    # ProxyCommand connect -H 127.0.0.1:7897 %h %p

# 你的多账号配置
Host github.com-shenyabo
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_rsa_shenyabo_github
    IdentitiesOnly yes
    ProxyCommand connect -S 127.0.0.1:7897 %h %p
```

找个目录gitinit 然后设置这个目录的用户

 git config user.email 2268288783@qq.com
 git config user.name liu39236244


 ## 项目

 git clone git@github.com:liu39236244/desktopAudioVisualAlarmV1.git
 git clone git@github.com:liu39236244/serialPortProject.git
 git clone git@github.com:liu39236244/BaiChuan-Cloud.git
 git clone git@github.com:liu39236244/liu39236244.github.io.git
 git clone git@github.com:liu39236244/myGoExportBridgeData.git
 git clone git@github.com:liu39236244/com.shuke.bridge-design-page-project.git
 git clone git@github.com:liu39236244/pythonDataExport.git
 git clone git@github.com:liu39236244/myGoSocketProject.git
 git clone git@github.com:liu39236244/HikVideoDemoProject.git

 ssh -T git@github.com
 ssh -T github.com-shenyabo
 两个就会都ok 了

### git切换分支

 git branch -r

git checkout dev/go_moke5753

# 或完整方式：
git checkout -b dev/go_moke5753 origin/dev/go_moke5753