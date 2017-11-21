import TinyMDE from '../src/index'
import { copy } from '../src/utils/state'

describe('初始化构造函数时', () => {
  it('第一个参数可以是字符串、节点或函数', () => {
    const t = document.createElement('textarea')
    document.body.appendChild(t)
    const m = new TinyMDE('textarea')
    expect(m.el).toBe(t)

    const t2 = document.createElement('textarea')
    const m2 = new TinyMDE(t2)
    expect(m2.el).toBe(t2)

    let e: HTMLTextAreaElement
    const m3 = new TinyMDE(el => {
      e = el
    })

    // @ts-ignore
    expect(m3.el).toBe(e)
  })

  it('当第一个参数是字符串时，如果找不到这个元素或这个元素不是 textarea 则报错', () => {
    expect(() => new TinyMDE('no-this-element')).toThrow()
    expect(() => new TinyMDE('body')).toThrow()
  })
})

describe('实例', () => {
  let mde: TinyMDE
  let textarea: HTMLTextAreaElement

  beforeEach(() => {
    mde = new TinyMDE(
      el => {
        textarea = el
        document.body.appendChild(textarea)
        textarea.value = 'abc'
        textarea.selectionStart = 1
        textarea.selectionEnd = 2
      },
      {
        saveDelay: 1000
      }
    )
  })

  afterEach(() => {
    document.body.removeChild(textarea)
  })

  it('用户停止输入 3 秒后会保存一次编辑器状态', done => {
    spyOn(mde, 'saveState')

    function triggerInput() {
      textarea.dispatchEvent(
        new Event('input', {
          bubbles: true,
          cancelable: true
        })
      )
    }

    triggerInput()
    setTimeout(triggerInput, 100)
    setTimeout(triggerInput, 200)
    setTimeout(() => {
      expect(mde.saveState).toHaveBeenCalledTimes(1)
      done()
    }, 1500)
  })

  it('redo() 和 undo() 会撤销/恢复编辑器的状态', () => {
    mde.bold()
    mde.undo()
    expect(copy(textarea)).toEqual({
      value: 'abc',
      selectionStart: 1,
      selectionEnd: 2
    })
    mde.redo()
    expect(copy(textarea)).toEqual({
      value: 'a**b**c',
      selectionStart: 3,
      selectionEnd: 4
    })
  })

  it('bold() 方法会将选中的文本使用星号包裹', () => {
    mde.bold()
    expect(copy(textarea)).toEqual({
      value: 'a**b**c',
      selectionStart: 3,
      selectionEnd: 4
    })
  })

  it('italic() 会将选中的文本用下划线包裹', () => {
    mde.italic()
    expect(copy(textarea)).toEqual({
      value: 'a_b_c',
      selectionStart: 2,
      selectionEnd: 3
    })
  })

  it('strikethrough() 会将选中的文本用波浪线包裹', () => {
    mde.strikethrough()
    expect(copy(textarea)).toEqual({
      value: 'a~~b~~c',
      selectionStart: 3,
      selectionEnd: 4
    })
  })

  it('inlineCode() 会将选中的文本用反引号包裹', () => {
    mde.inlineCode()
    expect(copy(textarea)).toEqual({
      value: 'a`b`c',
      selectionStart: 2,
      selectionEnd: 3
    })
  })

  it('blockCode() 会将选中的文本用多个反引号包裹', () => {
    mde.blockCode()
    expect(copy(textarea)).toEqual({
      value: 'a\n\n```\nb\n```\n\nc',
      selectionStart: 7,
      selectionEnd: 8
    })
  })

  it('ul() 会在选中的文本的换行符后添加短横线', () => {
    mde.ul()
    expect(copy(textarea)).toEqual({
      value: 'a\n\n- b\n\nc',
      selectionStart: 5,
      selectionEnd: 6
    })
  })

  it('ol() 会在选中的文本的换行符后添加数字索引', () => {
    mde.ol()
    expect(copy(textarea)).toEqual({
      value: 'a\n\n1. b\n\nc',
      selectionStart: 6,
      selectionEnd: 7
    })
  })

  it('quote() 会在选中的文本的换行符后添加大于号', () => {
    mde.quote()
    expect(copy(textarea)).toEqual({
      value: 'a\n\n> b\n\nc',
      selectionStart: 5,
      selectionEnd: 6
    })
  })

  it('task() 会在选中的文本的换行符后添加选择框', () => {
    mde.task()
    expect(copy(textarea)).toEqual({
      value: 'a\n\n- [ ] b\n\nc',
      selectionStart: 9,
      selectionEnd: 10
    })
  })

  it('link() 会使用中括号包裹选中的文本并在后面添加用括号包裹起来的 url', () => {
    mde.link()
    expect(copy(textarea)).toEqual({
      value: 'a[b](url)c',
      selectionStart: 5,
      selectionEnd: 8
    })
  })

  it('image() 类似于 link()，但前面多出了一个感叹号', () => {
    mde.image()
    expect(copy(textarea)).toEqual({
      value: 'a![b](url)c',
      selectionStart: 6,
      selectionEnd: 9
    })
  })

  it('hr() 会在光标的开始位置插入一行星号', () => {
    mde.hr()
    expect(copy(textarea)).toEqual({
      value: 'a\n\n* * *\n\nc',
      selectionStart: 10,
      selectionEnd: 10
    })
  })

  it('heading() 会在光标的开始位置所在行的开头添加适当个数的井号', () => {
    mde.heading(3)
    expect(copy(textarea)).toEqual({
      value: '### abc',
      selectionStart: 5,
      selectionEnd: 6
    })
  })
})
