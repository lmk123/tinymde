import {
  StringOrIntroOutro,
  AnyFunc,

  getInOut,
  insertString,
  repeat,
  debounce,
  addEvent
} from './utils'

interface State {
  selectionStart: number
  selectionEnd: number
  value: string
}

export interface Options {
  maxRecords?: number

  [otherProps: string]: any // 允许用户传入自定义参数
}

export default class {
  el: HTMLTextAreaElement
  private history: State[]
  private hid: number
  private unbinds: AnyFunc[]
  private maxRecords: number

  constructor (el: string | HTMLTextAreaElement | ((el: HTMLTextAreaElement) => void), options?: Options) {
    this.maxRecords = options && options.maxRecords || 100
    this.history = []
    this.hid = -1

    let element: HTMLTextAreaElement

    if (typeof el === 'string') {
      element = (document.querySelector(el) as HTMLTextAreaElement)
    } else if (typeof el === 'function') {
      element = document.createElement('textarea')
      el(element)
    } else {
      element = el
    }

    this.unbinds = [
      addEvent(element, 'mouseup', () => {
        if (element.selectionStart !== element.selectionEnd) {
          this.saveState()
        }
      }),
      addEvent(element, 'input', debounce(() => {
        this.saveState()
      }))
    ]

    this.el = element

    this.saveState()
  }

  /**
   * 摧毁实例。目前其实就解绑了一些事件。
   */
  destroy () {
    this.unbinds.forEach(unbind => unbind())
  }

  /**
   * 设置当前的选中范围
   */
  setSelection (start: number, end?: number) {
    const { el } = this
    el.setSelectionRange(start, end === undefined ? start : end)
    el.focus()
  }

  /**
   * 保存编辑器当前的状态。
   */
  saveState () {
    const { selectionStart, selectionEnd, value } = this.el
    const { history, hid } = this

    // 删除后面的状态并添加新状态
    history.splice(hid + 1, history.length - hid, {
      selectionStart,
      selectionEnd,
      value
    })

    // 如果更新后记录超出最大记录数则删除最前面的记录
    if (history.length > this.maxRecords) {
      history.shift()
    } else { // 否则更新当前索引
      this.hid += 1
    }

    return this
  }

  /**
   * 回到编辑器的指定位置的状态。
   * @param {number} index
   */
  restoreState (index: number) {
    const state = this.history[index]
    if (state) {
      this.hid = index
      this.el.value = state.value
      this.setSelection(state.selectionStart, state.selectionEnd)
    }
    return this
  }

  /**
   * 撤销，即回到上一个状态。
   */
  undo () {
    return this.restoreState(this.hid - 1)
  }

  /**
   * 重做，即前进到下一个状态。
   */
  redo () {
    return this.restoreState(this.hid + 1)
  }

  /**
   * 一些操作需要给选中的文本前后补充换行符，例如 codeBlock() 与 list()。
   * 这个方法根据位置判断需要补充多少个换行符。
   * @param {number} count
   */
  padNewline (count = 2) {
    const { selectionStart, selectionEnd, value } = this.el
    let start = 0
    let end = 0

    for (let i = 1; i <= count; i++) {
      const startIndex = selectionStart - i
      if (startIndex >= 0) {
        const startChar = value[startIndex]
        if (startChar !== '\n') {
          start += 1
        }
      }

      const endIndex = selectionEnd + i
      if (endIndex < value.length) {
        const endChar = value[selectionEnd]
        if (endChar !== '\n') {
          end += 1
        }
      }
    }

    return {
      start,
      end
    }
  }

  /**
   * 包裹用户选中文本的快捷方法。
   * @param introOutro
   * @param autoSelect
   */
  wrap (introOutro: StringOrIntroOutro, autoSelect = true) {
    const { intro, outro } = getInOut(introOutro)
    const { selectionStart, selectionEnd, value } = this.el
    this.el.value = insertString(value, selectionStart, intro + value.slice(selectionStart, selectionEnd) + outro, selectionEnd)
    if (autoSelect) {
      const selectionOffset = intro.length
      this.setSelection(selectionStart + selectionOffset, selectionEnd + selectionOffset)
      this.saveState()
    }
    return this
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
   * 删除线。
   */
  strikethrough () {
    return this.wrap('~~')
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

    return this.wrap({
      intro: repeat('\n', newlinePad.start) + '```\n',
      outro: '\n```' + repeat('\n', newlinePad.end)
    })
  }

  /**
   * ol()、ul()、task() 与 quote() 的底层方法。
   * @param pattern - 每一行后面要添加的前缀，可以提供一个方法动态生成，例如有序列表就需要添加递增的数字前缀
   * @param brCount - 满足多少个换行符时才添加前缀。一般需要两个，但 quote() 方法只需要一个。
   */
  list (pattern: string | ((index: number) => string), brCount = 2) {
    let symbolFunc: (index: number) => string

    if (typeof pattern === 'string') {
      symbolFunc = () => pattern
    } else {
      symbolFunc = pattern
    }

    const newlinePad = this.padNewline()

    const { selectionStart, selectionEnd, value } = this.el
    const selectedString = value.slice(selectionStart, selectionEnd)

    // 记录一下当前正在添加的是第几个前缀
    let index = 0
    // 一个用来判断需要满足多少个换行符才添加前缀的正则。
    // 一般情况下只会在两个换行符后面添加前缀，但 quote() 方法需要在满足一个换行符时就添加。
    const brReg = new RegExp('\n{' + brCount + '}', 'g')
    let newString = selectedString.replace(brReg, match => {
      index += 1
      return match + symbolFunc(index)
    })

    // 需要在选中文本前面添加适当的换行符，与上面的内容分隔开来
    const introBr = repeat('\n', newlinePad.start)
    // 除此之外，还需要在开头添加前缀
    const firstSymbol = symbolFunc(0)
    // 另外还需要在选中文本后面添加适当的换行符，与下面的内容分隔开来
    const outro = repeat('\n', newlinePad.end)
    // 所以最终的文本应该是 开头的换行符 + 第一个前缀 + 在内容中添加过换行符的文本 + 末尾的换行符
    newString = introBr + firstSymbol + newString + outro

    // 用最终处理过后的文本替换掉原本的文本
    this.el.value = insertString(value, selectionStart, newString, selectionEnd)

    // 因为不想选中前面添加的换行符，所以选中的开始位置要加上前置换行符的长度
    // 因为不想选中后面添加的换行符，所以选中的结束位置要减去后置换行符的长度
    this.setSelection(selectionStart + introBr.length, selectionStart + newString.length - outro.length)
    this.saveState()
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
   * 引用。
   */
  quote () {
    return this.list('> ', 1)
  }

  /**
   * 任务列表。
   */
  task () {
    return this.list('- [ ] ')
  }

  /**
   * 链接。
   * @param url
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
   * @param level
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

    return this.saveState()
  }

  /**
   * 分隔线。
   */
  hr () {
    const { start, end } = this.padNewline()
    const { el } = this
    const { selectionStart } = el

    el.value = insertString(el.value, selectionStart, repeat('\n', start) + '* * *' + repeat('\n', end), el.selectionEnd)
    this.setSelection(selectionStart + start + 5/* '* * *'.length */ + end)
    return this.saveState()
  }

  /**
   * link() 与 image() 的操作基本一样，所以提取出来了一个内部的公用方法
   * @param url
   * @param isLink
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

      this.saveState()
    }

    return this
  }
}
