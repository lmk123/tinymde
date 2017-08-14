// 快捷键的修饰符
export const modifier: string = window.navigator.userAgent.toLowerCase().indexOf('mac') > 0 ? 'metaKey' : 'ctrlKey'

// keyCode 到数字的映射
export const enum Keys {
  B = 66, // Command + B  粗体
  H = 72, // Command + H  标题
  I = 73, // Command + I  斜体
  U = 85, // Command + U  下划线
  Z = 90 // Command + Z   撤销  Command + Shift + Z 反撤销
}
