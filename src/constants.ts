// 快捷键的修饰符
export const MODIFIER: string = window.navigator.userAgent.toLowerCase().indexOf('mac') > 0 ? 'metaKey' : 'ctrlKey'

// keyCode 到数字的映射
export const enum KEYS {
  B = 66, // Command + B  粗体
  H = 72, // Command + H  标题
  I = 73, // Command + I  斜体
  U = 85, // Command + U  下划线
  Z = 90 // Command + Z   撤销
}
