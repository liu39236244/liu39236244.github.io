要将代码从本地计算机推送到 GitHub 上的一个新的项目（也就是新的远程仓库），一般需要先在 GitHub 上创建该项目，然后才能将本地代码推送到新的远程仓库，以下是详细的步骤：

### 1. 在 GitHub 上创建新的仓库

1. **登录 GitHub**：
   - 使用你的 GitHub 账户登录到 [GitHub 网站](https://github.com)。

2. **创建新仓库**：
   - 在右上角的 "+" 图标下拉菜单中选择 "New repository"。
   - 输入新的仓库名称，并根据需要填写其他选项（这里建议不要勾选“Initialize this repository with a README”）。
   - 点击 "Create repository" 按钮，完成仓库创建。

### 2. 在本地设置并推送代码

在命令行中从本地文件夹将代码推送到新创建的 GitHub 仓库：

#### **在本地初始化 Git 仓库**

如果你还没有初始化本地 Git 仓库，可以按照以下步骤来执行：

```bash
# 进入您的项目目录
cd path/to/your/project

# 初始化新的 Git 仓库
git init

# 添加所有文件到仓库
git add .

# 提交更改
git commit -m "Initial commit"
```

#### **添加 GitHub 远程仓库**

接下来，你需要将远程仓库地址添加到本地 Git 仓库，并推送你的代码：

```bash
# 添加 GitHub 远程仓库
git remote add origin https://github.com/yourusername/your-repository-name.git

# 推送代码到 GitHub
git push -u origin master
```

替换 `yourusername` 和 `your-repository-name` 为你的 GitHub 用户名和新创建的仓库名。

### 3. 注意事项

- **访问权限**：GitHub 通常要求进行身份验证，你可能需要使用 GitHub 的用户名和访问令牌（Personal Access Token）来验证身份，尤其是对那些启用了 2FA（双重认证）的账户。
- **默认分支**：新仓库的默认分支可能是 `main` 而不是 `master`，如果是这样你的推送命令需要适应：

  ```bash
  git push -u origin main
  ```

- **创建 README 文件**：如果你选择了在 GitHub 上创建新的仓库时初始化 README 文件，请在执行 `git push` 之前先从远程仓库 `pull` 最新的更改：

  ```bash
  git pull origin main
  ```

- **SSH 访问**：如果你更喜欢使用 SSH 而不是 HTTPS，可以在 GitHub 设置 SSH Key，然后使用 SSH URL 进行远程仓库的添加，例如：

  ```bash
  git remote add origin git@github.com:yourusername/your-repository-name.git
  ```

执行完这些步骤后，你的项目代码就会被推送到 GitHub 上的新仓库中了。如果过程中遇到什么问题或有疑问，请随时告诉我！