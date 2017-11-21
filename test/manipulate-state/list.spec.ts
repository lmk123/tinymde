import list from '../../src/manipulate-state/list'
const value = 'abc\n\ndef'
describe('list() 方法', () => {
  it('若没有选中文本，则将光标插入到第一个符号后面', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 1
    }
    list(state, '~~')
    expect(state).toEqual({
      value: 'a\n\n~~\n\nbc\n\ndef',
      selectionStart: 5,
      selectionEnd: 5
    })
  })

  it('若有选中文本，则包裹整个列表体', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 7
    }
    list(state, index => `${index + 1}. `)
    expect(state).toEqual({
      value: 'a\n\n1. bc\n\n2. de\n\nf',
      selectionStart: 3,
      selectionEnd: 15
    })
  })

  it('第三个参数可以指定换行符满足多少个时就插入符号', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 7
    }
    list(state, index => `${index + 1}. `, 1)
    expect(state).toEqual({
      value: 'a\n\n1. bc\n2. \n3. de\n\nf',
      selectionStart: 3,
      selectionEnd: 18
    })
  })
})
