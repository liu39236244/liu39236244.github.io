# win 安装docker 遇到问题

## docker 启动如果失败，则手动启动 wsl docker 


PS C:\WINDOWS\system32> wsl -d docker-desktop


### 如果有一下问题

不受支持的控制台设置。若要使用此功能，必须禁用旧的控制台。

错误代码: Wsl/Service/WSL_E_CONSOLE



解决方法：cmd 中将设置 取消勾选 旧平台的 勾选；

然后在执行就可以了，随后docker 就可以正常执行了

![](assets/000/01/02/13/03/04-1742287787626.png)

### 详细方案 


你的错误提示表明当前控制台（如命令提示符或 PowerShell）使用了旧版设置，而 WSL 2 需要启用新式控制台支持。以下是具体解决方案：

---

### **1. 禁用“旧版控制台”模式**
- **步骤：**
  1. 右键点击当前终端窗口的标题栏（如 PowerShell 或命令提示符），选择 **属性**。
  2. 切换到 **选项** 标签页。
  3. 取消勾选 **使用旧版控制台**。
  4. 点击 **确定** 并关闭所有终端窗口。
  5. 重新以管理员身份打开 PowerShell，再次运行命令。

---

### **2. 使用 Windows Terminal 替代旧终端**
- **原因：** Windows 自带的旧终端（cmd/PowerShell 默认控制台）可能与 WSL 2 存在兼容问题。
- **步骤：**
  1. 从 Microsoft Store 安装 [Windows Terminal](https://aka.ms/terminal)。
  2. 以管理员身份启动 Windows Terminal。
  3. 执行以下命令：
     ```powershell
     wsl -d docker-desktop
     ```

---

### **3. 验证系统版本兼容性**
- **要求：** WSL 2 需要 Windows 10 版本 **2004 (Build 19041)** 或更高。
- **检查方法：**
  - 按 `Win + R` 输入 `winver`，确认版本号符合要求。
  - 如果版本过低，通过 **设置 > 更新与安全 > Windows 更新** 升级系统。

---

### **4. 修复控制台相关组策略（企业环境适用）**
- **适用场景：** 若电脑受企业组策略限制，可能强制启用了旧控制台。
- **步骤：**
  1. 按 `Win + R` 输入 `gpedit.msc` 打开组策略编辑器。
  2. 导航到：
     ```
     计算机配置 > 管理模板 > Windows 组件 > 控制台
     ```
  3. 检查 **强制旧控制台模式** 是否被启用，若启用则设为 **已禁用**。
  4. 重启电脑。

---

### **5. 重置 Docker Desktop 的 WSL 发行版**
- **适用场景：** 若 `docker-desktop` 发行版损坏。
- **步骤：**
  1. 卸载 Docker Desktop。
  2. 手动删除残留的 WSL 发行版：
     ```powershell
     wsl --unregister docker-desktop
     ```
  3. 重新安装最新版 Docker Desktop：[官网下载](https://www.docker.com/products/docker-desktop)。

---

### **6. 彻底重启 WSL 服务**
- **步骤：**
  1. 关闭所有 WSL 相关进程：
     ```powershell
     wsl --shutdown
     ```
  2. 重启电脑。
  3. 重新尝试启动 Docker。

---

### **7. 检查 Hyper-V 和虚拟化支持**
- **要求：** 需在 BIOS 中启用虚拟化（Intel VT-x/AMD-V）。
- **验证方法：**
  1. 打开任务管理器（`Ctrl + Shift + Esc`）。
  2. 切换到 **性能** 标签页，查看右下角 **虚拟化** 是否显示为 **已启用**。
  3. 如果未启用，需进入 BIOS 设置启用（不同主板操作不同，重启时按 `F2/Del` 等键进入）。

---

### **总结流程**
1. 禁用旧版控制台 → 使用 Windows Terminal → 检查系统版本 → 重启服务 → 重装 Docker。
2. 若仍失败，检查虚拟化和组策略限制。

请按顺序尝试上述步骤，通常前两步即可解决问题。如果问题依旧，请提供以下信息：
- Windows 版本（`winver` 截图）
- 执行 `wsl -l -v` 的输出
- Docker Desktop 日志（`Settings > Troubleshoot > View logs`）