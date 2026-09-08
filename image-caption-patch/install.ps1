# 安装/更新图片图注补丁到 Typora（需要管理员权限，会弹 UAC）
$ErrorActionPreference = "Stop"
$dst  = "C:\Program Files\Typora\resources\appsrc\window\frame.js"
$bak  = "C:\Program Files\Typora\resources\appsrc\window\frame.js.bak"
$src  = Join-Path $PSScriptRoot "frame.patched.js"

if (-not (Test-Path $src)) { Write-Host "frame.patched.js not found: $src"; exit 1 }
if (-not (Test-Path $dst)) { Write-Host "Typora frame.js not found: $dst"; exit 1 }

# 首次安装时备份原始文件（已存在备份则保留最早的原始备份，不覆盖）
if (-not (Test-Path $bak)) { Copy-Item $dst $bak -Force }

Copy-Item $src $dst -Force
Write-Host "OK: frame.js patched. Please restart Typora completely."
