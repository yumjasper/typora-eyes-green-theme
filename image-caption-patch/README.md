# Typora 图片图注补丁（EyesGreen 主题配套）

给 Typora 增加"图片图注"能力：用原生 Markdown 语法插入图片时，圆括号里
URL 后引号内的文字会渲染为图片下方的居中图注：

```
![图9.1：光是一种电磁横波……](images/Chapter-9/xxx.png "图9.1：光是一种电磁横波……")
                                              ↑ 引号内的文字 = 图注
```

## 为什么必须改 frame.js（纯 CSS 做不到）

1. Typora 把 `title` 只放在 `<img>` 元素上（可用 Typora 安装目录
   `resources/appsrc/window/frame.js` 中 `setAttribute("title", …)` 验证）。
2. `<img>` 是替换元素，不能有 `::after` / `::before` 伪元素。
3. CSS 的 `attr()` 只能读取元素**自身**的属性，永远读不到子元素的 title。

所以唯一出路：注入一小段 JS 把 img 的 title 镜像到外层 `.md-image` 容器的
`data-img-title` 属性上，再由主题 CSS 用 `attr(data-img-title)` 渲染。

## 本目录文件

| 文件 | 作用 |
|---|---|
| `caption-append.js` | 追加到 frame.js 末尾的注入脚本（MutationObserver 同步 title → data-img-title） |
| `frame.patched.js`  | 原始 frame.js + 注入脚本的完整成品 |
| `install.ps1`       | 安装/更新补丁（右键"使用 PowerShell 运行"，会弹 UAC） |
| `restore.ps1`       | 卸载补丁，还原备份的原始 frame.js |

主题样式部分（`.md-image[data-img-title]::after` 图注规则）已直接追加在
`themes/eyes-green.css` 和 `themes/eyes-green-dark.css` 末尾。

## 注意事项

- **Typora 升级后补丁会被覆盖**：升级后重新运行 `install.ps1` 即可
  （脚本会自动用新版 frame.js 不对——如果 frame.js 变了，需要重新生成
  `frame.patched.js`：把新版 frame.js 内容 + `caption-append.js` 拼接。
  简单做法：把 `caption-append.js` 的内容手动粘贴到新版 frame.js 末尾）。
- 安装后需**完全退出 Typora 再重开**（含后台进程）才生效。
- `install.ps1` 首次运行会把原始文件备份为
  `C:\Program Files\Typora\resources\appsrc\window\frame.js.bak`。
- 导出 PDF 时图注通常会一并渲染（打印走当前 DOM + 主题 CSS）；
  **导出 HTML 时图注不会出现**（导出走独立构造路径，无注入脚本、
  容器上没有 data-img-title）。需要导出 HTML 带图注的话，可以再写一个
  后处理脚本把 `<img title="…">` 转成 `<figure><figcaption>…`。
- 修改的只是外层容器的自定义 `data-*` 属性，不写回 Markdown 源文件，
  源码里的 `![alt](src "title")` 语法保持不变，其它编辑器打开不受影响。
