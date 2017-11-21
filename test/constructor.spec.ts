import TinyMDE from '../src/index'

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
