# go 学习过程错误整理

## 1 任意一目录下执行 go build  go install 报错

### 原因 因为我学习视频版本是1.16 我学习的时候下载的是1.24

错误演示：

```
D:>cd D:\myProject\MyGoWorkPath\src\com.yabo.study\sduty-1\test1\hello

D:\myProject\MyGoWorkPath\src\com.yabo.study\sduty-1\test1\hello>go build
go: go.mod file not found in current directory or any parent directory; see 'go help modules'

D:\myProject\MyGoWorkPath\src\com.yabo.study\sduty-1\test1\hello>go install
go: go.mod file not found in current directory or any parent directory; see 'go help modules'

D:\myProject\MyGoWorkPath\src\com.yabo.study\sduty-1\test1\hello>
```

## Go 版本变化说明：

- **Go 1.16 之前**：可以在任意目录直接 `go install hello`
- **Go 1.16 之后**：必须在模块内或指定版本

## 解决方案：

### 方案1：使用 go run（推荐）

```bash
# 直接运行你的 hello.go 文件
go run hello.go
```

### 方案2：创建模块后安装

```bash
# 1. 初始化模块
go mod init hello

# 2. 然后可以构建
go build hello.go

# 3. 运行生成的可执行文件
./hello        # Linux/Mac
hello.exe      # Windows
```

### 方案3：使用旧的 GOPATH 模式

```bash
# 设置环境变量（临时）
set GO111MODULE=off

# 然后可以使用旧方式
go install hello
```

## 推荐做法：

对于学习阶段，直接使用：

```bash
go run hello.go
```

这样最简单，不需要安装，直接运行你的程序。

`go install` 主要用于安装可执行程序到 `$GOPATH/bin` 目录，学习时通常用 `go run` 就够了。




## 处理以后


### go build

```
D:\myProject\MyGoWorkPath\src\com.yabo.study\sduty-1\test1\hello>go mod init hello
go: creating new go.mod: module hello
go: to add module requirements and sums:
        go mod tidy

D:\myProject\MyGoWorkPath\src\com.yabo.study\sduty-1\test1\hello>go build

D:\myProject\MyGoWorkPath\src\com.yabo.study\sduty-1\test1\hello>
```

生成了 exe

![](assets/001/100/10/1-1753596928867.png)


### go install

直接在gopath bin 下面生成exe 

![](assets/001/100/10/1-1753597025298.png)



