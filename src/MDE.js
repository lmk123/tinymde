import { splice4string, wrapBy } from './utils'

export default class {
  /**
   *  构造函数
   * @param {HTMLElement} el
   */
  constructor (el) {
    this.el = el

    el.addEventListener('keypress', event => {
      console.log(event)
    })
  }

  /**
   * 获取当前编辑器的内容
   * @return {string}
   */
  getValue () {
    return this.el.value
  }

  /**
   * 设置当前编辑器的内容
   * @param {string} val
   */
  setValue (val) {
    this.el.value = val
  }

  /**
   * 设置当前的选中范围
   * @param {number} start
   * @param {number} end
   */
  setSelection (start, end) {
    this.el.focus()
    this.el.setSelectionRange(start, end)
  }

  /**
   * 获取编辑器当前选中区域的范围。如果没有选中文本，则 start 和 end 是相等的。
   * @return {{start: number, end:number}} - 如果是 number，说明当前编辑器没有选中内容，则此时返回光标的位置
   */
  getSelection () {
    const { selectionStart, selectionEnd } = this.el

    return {
      start: selectionStart,
      end: selectionEnd
    }
  }

  /**
   * 获取选中文本
   * @return {string}
   */
  getSelectionText () {
    const pos = this.getSelection()
    if (typeof pos === 'object') {
      return this.getValue().slice(pos.start, pos.end)
    } else {
      return ''
    }
  }

  /**
   * 将当前选中文本用加粗语法包裹。
   * 如果编辑器没有选中文本，则在光标位置插入一段加粗提示。
   */
  bold () {
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
