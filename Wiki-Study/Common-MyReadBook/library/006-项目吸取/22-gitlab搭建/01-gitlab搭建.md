# gitlab 搭建

## 1- gitlab搭建总结

```
官方文档
	https://about.gitlab.com/installation/
centos6 安装
	依赖
		yum install -y curl policycoreutils-python openssh-server cronie
		lokkit -s http -s ssh
	邮件服务
		yum install postfix # 安装期间会出现配置信息
		service postfix start
		chkconfig postfix on
	配置postfix
		vim /etc/postfix/main.cf
		https://www.cnblogs.com/ilanni/p/5294611.html
	添加并安装gitLab包库
		curl https://packages.gitlab.com/install/repositories/gitlab/gitlab-ee/script.rpm.sh | sudo bash
		vim /etc/yum.repos.d/gitlab-ee.repo
			[gitlab-ee]
			name=Gitlab EE Repository
			baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ee/yum/el6/
			gpgcheck=0
			enabled=1
		yum makecache
		yum -y install gitlab-ee
	配置gitLab
		vim /etc/gitlab/gitlab.rb
GitLab常用命令
	gitlab-ctl start			# 启动所有 gitlab 组件；
	gitlab-ctl stop				# 停止所有 gitlab 组件；
	gitlab-ctl restart			# 重启所有 gitlab 组件；
	gitlab-ctl status			# 查看服务状态；
	gitlab-ctl reconfigure		# 启动服务；
	gitlab-rake gitlab:check SANITIZE=true --trace    # 检查gitlab；
	gitlab-ctl tail        # 查看日志；
系统管理员
	root
	5iveL!fe
卸载
	rpm -e gitlab-ee
	rm -rf /etc/gitlab /var/log/gitlab /var/opt/gitlab /opt/gitlab
GitLab 接入 OpenLDAP和AD域
	https://www.linuxidc.com/Linux/2018-01/150516.htm


```
