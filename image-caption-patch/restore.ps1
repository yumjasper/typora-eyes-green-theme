# 卸载图片图注补丁：还原 frame.js 备份（需要管理员权限，会弹 UAC）
$ErrorActionPreference = "Stop"
$dst = "C:\Program Files\Typora\resources\appsrc\window\frame.js"
$bak = "C:\Program Files\Typora\resources\appsrc\window\frame.js.bak"

if (Test-Path $bak) {
    Copy-Item $bak $dst -Force
    Write-Host "OK: frame.js restored from backup. Please restart Typora completely."
} else {
    Write-Host "No backup found at: $bak"
}
