# Git 推送失败诊断和修复脚本
# 用于解决 SSL_ERROR_SYSCALL 错误

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Git 推送问题诊断工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. 检查当前远程仓库配置
Write-Host "`n[1] 检查当前远程仓库配置..." -ForegroundColor Yellow
git remote -v

# 2. 检查Git代理设置
Write-Host "`n[2] 检查Git代理设置..." -ForegroundColor Yellow
$httpProxy = git config --global http.proxy http://127.0.0.1:7890
$httpsProxy = git config --global https.proxy https://127.0.0.1:7890

if ($httpProxy) {
    Write-Host "HTTP代理已设置: $httpProxy" -ForegroundColor Green
} else {
    Write-Host "HTTP代理未设置" -ForegroundColor Gray
}

if ($httpsProxy) {
    Write-Host "HTTPS代理已设置: $httpsProxy" -ForegroundColor Green
} else {
    Write-Host "HTTPS代理未设置" -ForegroundColor Gray
}

# 3. 测试网络连接
Write-Host "`n[3] 测试与GitHub的连接..." -ForegroundColor Yellow
try {
    $testConnection = Invoke-WebRequest -Uri "https://github.com" -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ 可以连接到 GitHub" -ForegroundColor Green
} catch {
    Write-Host "✗ 无法连接到 GitHub，可能的原因：" -ForegroundColor Red
    Write-Host "  - 网络连接问题" -ForegroundColor Yellow
    Write-Host "  - 防火墙阻止" -ForegroundColor Yellow
    Write-Host "  - DNS问题" -ForegroundColor Yellow
}

# 4. 显示修复选项
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "请选择修复方案：" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[1] 使用SSH方式（推荐）" -ForegroundColor Green
Write-Host "[2] 增加Git缓冲区大小" -ForegroundColor Green
Write-Host "[3] 取消代理设置" -ForegroundColor Green
Write-Host "[4] 使用GitHub镜像源" -ForegroundColor Green
Write-Host "[5] 清除所有Git配置并重新设置（高级）" -ForegroundColor Yellow
Write-Host ""

$choice = Read-Host "请输入选项 (1-5)"

switch ($choice) {
    "1" {
        Write-Host "`n正在切换到SSH方式..." -ForegroundColor Cyan
        git remote set-url origin git@github.com:liu39236244/liu39236244.github.io.git
        Write-Host "✓ 已切换到SSH" -ForegroundColor Green
        Write-Host "  提示：确保你已配置SSH密钥" -ForegroundColor Yellow
        Write-Host "  查看配置: git remote -v" -ForegroundColor Yellow
    }
    "2" {
        Write-Host "`n增加Git缓冲区大小..." -ForegroundColor Cyan
        git config --global http.postBuffer 524288000
        Write-Host "✓ 已设置缓冲区大小为500MB" -ForegroundColor Green
    }
    "3" {
        Write-Host "`n取消代理设置..." -ForegroundColor Cyan
        git config --global --unset http.proxy
        git config --global --unset https.proxy
        Write-Host "✓ 已取消代理设置" -ForegroundColor Green
    }
    "4" {
        Write-Host "`n使用GitHub镜像源..." -ForegroundColor Cyan
        git remote set-url origin https://github.com.cnpmjs.org/liu39236244/liu39236244.github.io.git
        Write-Host "✓ 已切换到镜像源" -ForegroundColor Green
    }
    "5" {
        Write-Host "`n警告：这将清除所有Git全局配置！" -ForegroundColor Red
        $confirm = Read-Host "确定继续吗？(yes/no)"
        if ($confirm -eq "yes") {
            git config --global --unset http.proxy
            git config --global --unset https.proxy
            git config --global --unset http.sslVerify
            git config --global http.postBuffer 524288000
            Write-Host "✓ 已重置Git配置" -ForegroundColor Green
        }
    }
    default {
        Write-Host "无效选择" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "现在尝试推送代码..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 5. 尝试推送
Write-Host "执行: git push origin main" -ForegroundColor Yellow
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✓ 推送成功！" -ForegroundColor Green
} else {
    Write-Host "`n✗ 推送仍然失败" -ForegroundColor Red
    Write-Host "`n请尝试以下步骤：" -ForegroundColor Yellow
    Write-Host "1. 检查是否有网络连接" -ForegroundColor Yellow
    Write-Host "2. 检查GitHub用户名和密码是否正确" -ForegroundColor Yellow
    Write-Host "3. 如使用SSH，确保SSH密钥已正确配置" -ForegroundColor Yellow
    Write-Host "4. 查看详细错误: git push origin main -v" -ForegroundColor Yellow
}

Write-Host "`n脚本执行完毕" -ForegroundColor Cyan
