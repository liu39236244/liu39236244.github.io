# dialog 对应键位关闭弹框问题


Dialog 对话框

element 对话框默认情况下，点击 modal / 按下ESC键 会自动关闭 Dialog对话框


## 全局控制

```js
// main.js 中可以全局设置 点击空白处、按下ESC不能关闭Dialog弹窗
	// 首先你得保证在main.js里面引入了 element-ui
	import ElementUI from 'element-ui'
	
	// 全局修改默认配置，点击空白处不能关闭弹窗
	ElementUI.Dialog.props.closeOnClickModal.default = false
	// 全局修改默认配置，按下ESC不能关闭弹窗
	ElementUI.Dialog.props.closeOnPressEscape.default = false
	
	Vue.use(ElementUI)
```

* 设置dialog 的属性控制

![](assets/001/02/06/04/01-1614147213499.png)