import list from '../../src/manipulate-state/list'

const value = 'abc\n\ndef'

describe('list() 方法', () => {
  it('若没有选中文本，则将光标插入到第一个符号后面', () => {
    expect(
      list(
        {
          value,
          selectionStart: 1,
          selectionEnd: 1
        },
        '~~'
      )
    ).toEqual({
      value: 'a\n\n~~\n\nbc\n\ndef',
      selectionStart: 5,
      selectionEnd: 5
    })
  })

  it('若选中文本只有一行，则包裹被选中的文本', () => {
    expect(
      list(
        {
          value,
          selectionStart: 1,
          selectionEnd: 2
        },
        index => `${index + 1}. `
      )
    ).toEqual({
      value: 'a\n\n1. b\n\nc\n\ndef',
      selectionStart: 6,
      selectionEnd: 7
    })
  })

  it('若选中文本有多行，则包裹整个列表体', () => {
    expect(
      list(
        {
          value,
          selectionStart: 1,
          selectionEnd: 7
        },
        index => `${index + 1}. `
      )
    ).toEqual({
      value: 'a\n\n1. bc\n2. \n3. de\n\nf',
      selectionStart: 3,
      selectionEnd: 18
    })
  })
})
