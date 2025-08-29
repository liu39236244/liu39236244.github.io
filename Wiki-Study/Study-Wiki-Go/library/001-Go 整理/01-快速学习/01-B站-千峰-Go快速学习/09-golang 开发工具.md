# golang开发工具

[视频地址](https://www.bilibili.com/video/BV1jJ411c7s3?spm_id_from=333.788.videopod.episodes&vd_source=c35490de6888f6b2eaf6af9798d41a06&p=11)


## 安装工具goland


https://cloud.tencent.com/developer/article/1668717

## 

![](assets/001/01/01/09-1753598117588.png)



## ubuntu 安装 goland

![](assets/001/01/01/09-1756297930240.png)


## 安装踩坑


啊！找到问题了！**GoLand 2019 版本太老了**，这就是问题的根源。

## 🚨 版本兼容性问题

### **GoLand 2019 的限制：**
- 发布于 2019 年
- 最多支持到 Go 1.13-1.15 左右
- 对较新的 Go 版本（1.16+）支持有问题
- SDK 检测机制较旧

### **你的 Go 版本可能太新了**
请运行确认：
```cmd
go version
```
如果显示 Go 1.16 或更高版本，就会出现兼容性问题。

## 🛠️ 解决方案

### **方案 1：升级 GoLand（推荐）**
升级到较新版本的 GoLand：
- **GoLand 2023.3** 或更新版本
- 支持最新的 Go 版本
- 更好的功能和性能

### **方案 2：降级 Go 版本**
如果必须使用 GoLand 2019：
1. 卸载当前 Go
2. 安装 Go 1.15 或更早版本
3. 下载地址：https://golang.org/dl/

### **方案 3：使用 VS Code（免费替代）**
- 完全免费
- 支持所有 Go 版本
- 功能强大的 Go 扩展
- 轻量级

## 📋 GoLand 版本对应关系

| GoLand 版本 | 支持的 Go 版本 |
|------------|---------------|
| 2019.x     | Go 1.11-1.15 |
| 2020.x     | Go 1.13-1.16 |
| 2021.x     | Go 1.15-1.17 |
| 2022.x     | Go 1.16-1.19 |
| 2023.x+    | Go 1.18+     |

## 🎯 我的建议

### **如果预算允许：**
升级到 **GoLand 2023.3** 或更新版本
- 解决所有兼容性问题
- 获得最新功能

### **如果想免费解决：**
改用 **VS Code + Go 扩展**
```bash
# 安装 VS Code 后，安装这个扩展
Go (by Google)
```

### **临时解决方案：**
安装 Go 1.15：
1. 从 https://golang.org/dl/ 下载 Go 1.15.15
2. 卸载当前 Go
3. 安装到 `D:\MyInstall\work\go`

## 📝 请告诉我：

1. `go version` 的输出
2. 你是否愿意升级 GoLand 或改用 VS Code？
3. 还是想降级 Go 版本继续使用 GoLand 2019？

根据你的选择，我可以提供具体的操作步骤！