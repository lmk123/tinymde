# TinyMDE [![Build Status](https://img.shields.io/travis/lmk123/tinymde/master.svg?style=flat-square)](https://travis-ci.org/lmk123/tinymde) [![Coverage Status](https://img.shields.io/coveralls/lmk123/tinymde/master.svg?style=flat-square)](https://coveralls.io/github/lmk123/tinymde?branch=master) [![NPM Version](https://img.shields.io/npm/v/tinymde.svg?style=flat-square)](https://www.npmjs.com/package/tinymde)

TinyMDE 是一个运行在浏览器中的 Markdown 文本编辑器，它提供了一些 API 以便生成特定的 Markdown 语法，例如链接、图片、列表等。

[查看在线演示](https://lmk123.github.io/tinymde/index.html)

## 安装

### 用 NPM 安装

```
npm install tinymde
```

然后你就可以在代码中引用了：

```js
// CommonJS 语法
const TinyMDE = require('tinymde')
// ES6 模块语法
import TinyMDE from 'tinymde'
```

### 直接引用 CDN

你可以直接在页面中引用下面的代码获取最新版本的 TinyMDE：

```html
<!-- 压缩过的版本可以使用 https://unpkg.com/tinymde/dist/tinymde.min.js -->
<script src="https://unpkg.com/tinymde"></script>
```

之后你就可以使用全局变量 `TinyMDE` 了。

## API

### `new TinyMDE(textarea[, options])`

有三种方法初始化一个编辑器：

- 使用一个已经存在的 textarea 节点：`new TinyMDE(document.querySelector('textarea'))`
- 使用 CSS 选择器：`new TinyMDE('textarea')`
- 让 TinyMDE 帮你创建一个 textarea 节点：`new TinyMDE(textarea => document.body.appendChild(textarea))`

`options` 有这些设置：

 - `saveDelay`：用于控制 TinyMDE 自动保存编辑器状态的时间间隔，在用户停止输入后的这段时间内没有检测到 `input` 事件就会保存编辑器状态，默认值为 `3000`，单位是毫秒。
 - `maxRecords`：保存编辑器状态的最大条数，默认值是 `50`。当编辑器状态个数超出这个数字后，会将最前面的状态丢弃。
 - `onSave`：在 TinyMDE 保存编辑器状态后会调用一下这个函数。

### TinyMDE#saveState()

TinyMDE 会在适当的时机保存编辑器状态，但你也可以调用这个方法手动保存编辑器的当前状态。

### TinyMDE#undo()

回到编辑器的上一个状态，即“撤销”。

### TinyMDE#redo()

前进一个状态，即“重做”。

### TinyMDE#bold()

切换选中文本的加粗状态，例如将 `text` 变为 `**text**`，反之亦然。

### TinyMDE#italic()

切换选中文本的斜体状态，例如将 `text` 变为 `_text_`，反之亦然。

### TinyMDE#strikethrough()

切换选中文本的删除状态，例如将 `text` 变为 `~~text~~`，反之亦然。

### TinyMDE#inlineCode()

切换选中文本的代码状态，例如将 `text` 变为 \`text\`，反之亦然。

### TinyMDE#blockCode()

切换选中文本的块级代码状态，例如将 `text` 变为：

    ```
    text
    ```

反之亦然。

### TinyMDE#ul()

切换选中文本的无序列表状态，例如将 `text` 变为：

```
- text
```

反之亦然。

### TinyMDE#ol()

切换选中文本的有序列表状态，例如将 `text` 变为：

```
1. text
```

反之亦然。

### TinyMDE#quote()

切换选中文本的引用状态，例如将 `text` 变为：

```
> text
```

反之亦然。

### TinyMDE#task()

切换选中文本的任务列表状态，例如将 `text` 变为：

```
- [ ] text
```

反之亦然。

### TinyMDE#link([url, text])

根据选中的文本生成一段链接，例如将 `text` 变成 `[text](url)`，可以根据 `url` 与 `text` 参数改变生成的链接的默认值。

### TinyMDE#image([url, text])

根据选中的文本生成一段图片，例如将 `text` 变成 `![text](url)`，可以根据 `url` 与 `text` 参数改变生成的图片的默认值。

### TinyMDE#hr()

在当前光标所在的位置插入一段 `* * *`。

### TinyMDE#heading(level)

在当前光标所在的这一行开头插入若干个 `#` 号，可以使用 `level` 参数控制 `#` 号的个数。

## 许可

MIT
