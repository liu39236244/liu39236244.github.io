## go build 和 go install 的作用和区别

### **go build** - 编译程序
**作用：**
- 编译 Go 代码生成可执行文件
- 可执行文件生成在**当前目录**
- 不会安装到系统路径

**示例：**
```bash
go build hello.go
# 生成 hello.exe（Windows）或 hello（Linux/Mac）
# 文件在当前目录

# 运行
./hello      # Linux/Mac
hello.exe    # Windows
```

### **go install** - 编译并安装
**作用：**
- 编译 Go 代码
- 将可执行文件安装到 `$GOPATH/bin` 或 `$GOBIN` 目录
- 可以在任意位置直接运行程序

**示例：**
```bash
go install hello.go
# 可执行文件安装到系统路径
# 可以在任意目录直接运行 hello
```

## 先后顺序和使用场景

### **开发阶段：**
```bash
# 1. 直接运行（测试代码）
go run hello.go

# 2. 编译测试（检查是否能正常编译）
go build hello.go

# 3. 最终安装（发布使用）
go install hello.go
```

### **实际操作流程：**

```bash
# 第一步：写代码并测试
go run hello.go

# 第二步：编译检查
go build hello.go
./hello  # 测试可执行文件

# 第三步：安装到系统（可选）
go install hello.go
hello    # 可以在任意位置运行
```

## 三个命令对比

| 命令 | 作用 | 生成位置 | 使用场景 |
|------|------|----------|----------|
| `go run` | 编译并直接运行 | 临时文件 | 开发测试 |
| `go build` | 编译生成可执行文件 | 当前目录 | 本地使用 |
| `go install` | 编译并安装到系统 | $GOPATH/bin | 全局使用 |

## 学习建议顺序：
1. **go run** - 学习时最常用
2. **go build** - 需要分发程序时
3. **go install** - 制作工具程序时

对于初学者，大部分时候用 `go run hello.go` 就够了！