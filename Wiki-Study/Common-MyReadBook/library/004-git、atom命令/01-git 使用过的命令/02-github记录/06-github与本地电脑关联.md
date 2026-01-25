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
