// 快捷键的修饰符
export const MODIFIER = window.navigator.userAgent.toLowerCase().indexOf('mac') > 0 ? 'metaKey' : 'ctrlKey'

export const KEY_CODES = {
  b: 66, // Command + B  粗体
  h: 72, // Command + H  标题
  i: 73, // Command + I  斜体
  u: 85, // Command + U  下划线
  z: 90 // Command + Z   撤销
}
