**有！直接用官方离线包（比第三方更安全、更快）**，我给你最新、可直接下载的地址 + 完整离线安装步骤（2026.5 最新）。

---

## 一、先下载 3 个官方离线包（国内直链，快）
### 1. WSL2 内核（必装）
- **x64 电脑（绝大多数）**：
  https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi
- 文件名：`wsl_update_x64.msi`

### 2. Ubuntu 22.04 LTS（WSL 离线包）
- **x64 直接下载**（官方镜像，国内快）：
  https://publicwsldistros.blob.core.windows.net/wsldistrostorage/Ubuntu2204LTS-230518_x64.appx
- 文件名：`Ubuntu2204LTS-230518_x64.appx`

### 3.（可选）Ubuntu 24.04 LTS（新版）
- x64：https://aka.ms/wslubuntu2404
- 文件名：`Ubuntu2404LTS-xxxx_x64.appx`

> 不用第三方网站，**全是微软/Canonical 官方直链**，安全无捆绑。

---

## 二、离线安装 WSL2（全程断网也能装）
### 1. 先开启 Windows 功能（管理员 PowerShell）
```powershell
# 开启 WSL 与虚拟机平台
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 设 WSL2 为默认
wsl --set-default-version 2
```
**重启电脑**。

### 2. 安装 WSL2 内核
- 双击 `wsl_update_x64.msi` → 一路下一步。

### 3. 安装 Ubuntu
- 双击 `Ubuntu2204LTS-230518_x64.appx` → 自动安装。
- 安装完在开始菜单找到 **Ubuntu 22.04 LTS**，点开。
- 等待解压 → 设 **用户名+密码** → 完成。

### 4. 验证
```powershell
wsl -l -v
# 显示 Ubuntu 且 VERSION 为 2 即成功
```

---

## 三、（备选）第三方镜像站（国内更快）
如果上面微软直链还是慢，用清华镜像：
- Ubuntu WSL 镜像：https://mirrors.tuna.tsinghua.edu.cn/ubuntu-wsl/
- 找到：`ubuntu-22.04-x86_64-wsl.appx` 下载。

---

## 四、然后装 Docker Desktop（也离线）
- Docker 离线包（Windows）：
  https://desktop.docker.com/win/main/amd64/Docker Desktop Installer.exe
- 安装时勾选：**Use WSL 2 instead of Hyper-V** → 重启。

---

## 五、为什么不推荐“第三方修改包”？
- ❌ **安全风险**：第三方修改版可能藏**木马、挖矿、后门**。
- ❌ **道德/合规**：用**原版官方包**才是**合法、道德、无风险**。
- ✅ **最佳方案**：**官方离线直链 + 手动安装** = 最快 + 最安全。

---

## 六、一句话总结
1. 下：**内核msi + Ubuntu appx**
2. 开：WSL功能 → 重启
3. 装：内核 → Ubuntu
4. 装：Docker Desktop

**全程不用 `wsl --install`，10 分钟搞定，速度拉满！**

要不要我把这3个官方直链整理成一个**一键下载清单（txt）**，你直接复制到迅雷/IDM全速下？