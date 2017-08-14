import TinyEmitter from 'tiny-emitter'

import { splice4string, wrapBy } from './utils'

export default class extends TinyEmitter {
  el: HTMLTextAreaElement

  constructor (el: HTMLTextAreaElement) {
    super()
    this.el = el

    this.on('x', function () {
      console.log('x')
    })

    el.addEventListener('keypress', event => {
      console.log(event)
    })
  }

  /**
   * 获取当前编辑器的内容
   */
  getValue (): string {
    return this.el.value
  }

  /**
   * 设置当前编辑器的内容
   * @param {string} val
   */
  setValue (val: string): void {
    this.el.value = val
  }

  /**
   * 设置当前的选中范围
   */
  setSelection (start: number, end: number): void {
    this.el.focus()
    this.el.setSelectionRange(start, end)
  }

  /**
   * 获取编辑器当前选中区域的范围。如果没有选中文本，则 start 和 end 是相等的
   */
  getSelection (): { start: number, end: number } {
    const { selectionStart, selectionEnd } = this.el

    return {
      start: selectionStart,
      end: selectionEnd
    }
  }

  /**
   * 获取选中文本
   */
  getSelectionText (): string {
    const pos = this.getSelection()
    return this.getValue().slice(pos.start, pos.end)
  }

  /**
   * 将当前选中文本用加粗语法包裹。
   * 如果编辑器没有选中文本，则在光标位置插入一段加粗提示。
   */
  bold (): void {
    const { start, end } = this.getSelection()
    const val = this.getValue()
    let selectionStart
    let selectionEnd
    if (start === end) {
      const tip = 'Bold Text'
      this.setValue(splice4string(val, end, 0, `**${tip}**`))
      selectionStart = end + 2
      selectionEnd = selectionStart + tip.length
    } else {
      this.setValue(wrapBy(val, start, end, '**'))
      selectionStart = start + 2
      selectionEnd = end + 2
    }
    this.setSelection(selectionStart, selectionEnd)
  }
}
