import TinyEmitter from 'tiny-emitter'

import { getInOut, insertString, StringOrIntroOutro, wrapBy, repeat } from './utils'

export default class extends TinyEmitter {
  el: HTMLTextAreaElement
  private scrollTop: number

  constructor (el: string | HTMLTextAreaElement) {
    super()

    if (typeof el === 'string') {
      el = (document.querySelector(el) as HTMLTextAreaElement)
    }

    this.el = el || document.createElement('textarea')
  }

  /**
   * 获取当前编辑器的内容
   */
  getValue () {
    return this.el.value
  }

  /**
   * 设置当前编辑器的内容
   * @param {string} val
   */
  setValue (val: string) {
    this.el.value = val
  }

  /**
   * 设置当前的选中范围
   */
  setSelection (start: number, end: number) {
    const { el } = this
    el.focus()
    el.setSelectionRange(start, end)
  }

  /**
   * 获取编辑器当前选中区域的范围。如果没有选中文本，则 start 和 end 是相等的。
   */
  getSelection () {
    const { selectionStart, selectionEnd } = this.el

    return {
      start: selectionStart,
      end: selectionEnd
    }
  }

  /**
   * 粗体。
   * @param {string} tip
   */
  bold (tip?: string) {
    this.wrap('**', tip)
  }

  /**
   * 斜体。
   * @param {string} tip
   */
  italic (tip?: string) {
    this.wrap('_', tip)
  }

  /**
   * 块级代码。
   * @param {string} tip
   */
  codeBlock (tip?: string) {
    this.wrap({
      intro: '```\n',
      outro: '\n```'
    }, tip)
  }

  test () {
    console.log('xyyysssssd')
  }

  /**
   * 标题。
   * @param {number} level
   */
  heading (level: 1 | 2 | 3 | 4 | 5 | 6) {
    const { start } = this.getSelection()
    const value = this.getValue()

    console.log(value)

    // 查找离光标最近的换行符
    let brIndex = value.lastIndexOf('\n', start) + 1

    // 插入 # 号
    this.setValue(insertString(value, brIndex, repeat('#', level) + ' '))
  }

  /**
   * 保存滚动条位置
   */
  protected saveScroll () {
    this.scrollTop = this.el.scrollTop
  }

  /**
   * 恢复滚动条位置
   */
  protected restoreScroll () {
    this.el.scrollTop = this.scrollTop
  }

  /**
   * 将文本框中被选中的文本用指定字符串包裹起来。
   * 如果文本框中没有选中文本，则在光标的位置插入一段被包裹起来的提示文本。
   * @param {string} introOutro - 用于包裹的字符串
   * @param {string} tip - 默认文本
   */
  protected wrap (introOutro: StringOrIntroOutro, tip = '') {
    const { start, end } = this.getSelection()
    const val = this.getValue()
    let selectionStart
    let selectionEnd

    let { intro, outro } = getInOut(introOutro)

    this.saveScroll()
    if (start === end) {
      this.setValue(insertString(val, end, `${intro}${tip}${outro}`))
      selectionStart = end + intro.length
      selectionEnd = selectionStart + tip.length
    } else {
      this.setValue(wrapBy(val, start, end, introOutro))
      selectionStart = start + intro.length
      selectionEnd = end + outro.length
    }
    this.setSelection(selectionStart, selectionEnd)
    this.restoreScroll()
  }
}
