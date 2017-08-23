import TinyEmitter from 'tiny-emitter'

import { getInOut, insertString, StringOrIntroOutro, repeat } from './utils'

export default class extends TinyEmitter {
  el: HTMLTextAreaElement

  constructor (el: string | HTMLTextAreaElement) {
    super()

    if (typeof el === 'string') {
      el = (document.querySelector(el) as HTMLTextAreaElement)
    }

    this.el = el || document.createElement('textarea')
  }

  /**
   * 设置当前的选中范围
   */
  setSelection (start: number, end?: number) {
    const { el } = this
    el.setSelectionRange(start, end == null ? start : end)
    el.focus()
  }

  /**
   * 包裹用户选中文本的快捷方法。
   * @param {StringOrIntroOutro} introOutro
   * @param {boolean} autoSelect
   */
  wrap (introOutro: StringOrIntroOutro, autoSelect = true) {
    const { intro, outro } = getInOut(introOutro)
    const { selectionStart, selectionEnd, value } = this.el
    this.el.value = insertString(value, selectionStart, intro + value.slice(selectionStart, selectionEnd) + outro, selectionEnd)
    if (autoSelect) {
      const selectionOffset = intro.length
      this.setSelection(selectionStart + selectionOffset, selectionEnd + selectionOffset)
    }
    return this
  }

  /**
   * 一些操作需要给选中的文本前后补充换行符，例如 codeBlock() 与 list()，
   * 这个方法根据位置判断需要补充多少个换行符。
   * @param {number} count
   */
  padNewline (count = 2) {
    const { selectionStart, selectionEnd, value } = this.el
    let start = 0
    let end = 0

    for (let i = 0; i < count; i++) {
      const startChar = value[selectionStart - (i + 1)]
      if (startChar !== '\n' && startChar !== undefined) {
        start += 1
      }

      const endChar = value[selectionEnd + i]
      if (endChar !== '\n' && endChar !== undefined) {
        end += 1
      }
    }

    return {
      start,
      end
    }
  }

  /**
   * ol()、ul() 与 quote() 方法的底层方法
   */
  list (symbol: string | ((index: number) => string)) {
    let symbolFunc: (index: number) => string

    if (typeof symbol === 'string') {
      symbolFunc = () => symbol
    } else {
      symbolFunc = symbol
    }

    const newlinePad = this.padNewline()

    const { selectionStart, selectionEnd, value } = this.el
    let newString = value.slice(selectionStart, selectionEnd)

    let index = 0
    newString = newString.replace(/\n{2,}/g, match => {
      index += 1
      return match + symbolFunc(index)
    })

    newString = repeat('\n', newlinePad.start) + symbolFunc(0) + newString + repeat('\n', newlinePad.end)

    this.el.value = insertString(value, selectionStart, newString, selectionEnd)
    return this
  }

  /**
   * link() 与 image() 的操作基本一样，所以提取出来了一个内部的公用方法
   * @param {string} url
   * @param {boolean} isLink
   */
  private linkOrImage (url?: string, isLink?: boolean) {
    let hasUrl = true
    let intro = (isLink ? '' : '!') + '['
    if (!url) {
      hasUrl = false
      url = isLink ? 'link' : 'image url'
    }

    const outroIn = ']('
    const outroOut = ')'
    const outro = outroIn + url + outroOut

    const { selectionStart, selectionEnd, value } = this.el
    const collapsed = selectionStart === selectionEnd
    this.wrap({
      intro,
      outro
    }, collapsed) // 如果用户调用方法前没有选中文本，则由 wrap 方法自动将光标置于中括号内

    // 如果用户调用方法前有选中的文本
    if (!collapsed) {
      const { length } = value.slice(selectionStart, selectionEnd)

      // 如果显式的传入了 url 参数，则将光标置于末尾
      if (hasUrl) {
        this.setSelection(selectionEnd + intro.length + outro.length)
      } else { // 否则选中 url 部分
        const start = selectionStart + intro.length + length + outroIn.length
        this.setSelection(start, start + url.length)
      }
    }

    return this
  }

  /**
   * 无序列表
   */
  ul () {
    return this.list('- ')
  }

  /**
   * 有序列表
   */
  ol () {
    return this.list(index => `${index + 1}. `)
  }

  /**
   * 引用
   */
  quote () {
    return this.list('> ')
  }

  /**
   * 粗体。
   */
  bold () {
    return this.wrap('**')
  }

  /**
   * 斜体。
   */
  italic () {
    return this.wrap('_')
  }

  /**
   * 内联代码。
   */
  inlineCode () {
    return this.wrap('`')
  }

  /**
   * 块级代码。
   */
  blockCode () {
    const newlinePad = this.padNewline()

    let intro = repeat('\n', newlinePad.start) + '```\n'
    let outro = '\n```' + repeat('\n', newlinePad.end)

    // const { selectionStart, selectionEnd, value } = this.el
    //
    // const firstChar = value[selectionStart - 1]
    // if (firstChar !== '\n' && firstChar !== undefined) {
    //   intro = '\n' + intro
    // }
    //
    // const secondChar = value[selectionStart - 2]
    // if (secondChar !== '\n' && secondChar !== undefined) {
    //   intro = '\n' + intro
    // }
    //
    // if (value[selectionEnd] !== '\n' && value[selectionEnd] !== undefined) { // 如果末尾不是一个换行符，则加上
    //   outro += '\n'
    // }
    //
    // if (value[selectionEnd + 1] !== '\n' && value[selectionEnd + 1] !== undefined) {
    //   outro += '\n'
    // }

    return this.wrap({
      intro,
      outro
    })
  }

  /**
   * 链接。
   * @param {string} url
   */
  link (url?: string) {
    return this.linkOrImage(url, true)
  }

  /**
   * 插入一张图片
   * @param url
   */
  image (url?: string) {
    return this.linkOrImage(url)
  }

  /**
   * 标题。
   * @param {number} level
   */
  heading (level: 1 | 2 | 3 | 4 | 5 | 6) {
    const { selectionStart, selectionEnd, value } = this.el

    // 查找离光标最近的换行符
    const br = '\n'
    let brIndex = value.lastIndexOf(br, selectionStart) + br.length

    // 插入 # 号
    const fragment = repeat('#', level) + ' '
    this.el.value = insertString(value, brIndex, fragment)

    // 还原光标的位置
    this.setSelection(selectionStart + fragment.length, selectionEnd + fragment.length)

    return this
  }
}
