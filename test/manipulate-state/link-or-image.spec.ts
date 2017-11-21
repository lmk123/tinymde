import linkOrImage from '../../src/manipulate-state/link-or-image'

const value = 'abc\n\ndef'

describe('linkOrImage() 方法', () => {
  it('有选中文本且传了 url 参数则光标在末尾', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 3
    }
    linkOrImage(state, 'u')
    expect(state).toEqual({
      value: 'a![bc](u)\n\ndef',
      selectionStart: 9,
      selectionEnd: 9
    })
  })

  it('有选中文本但没传 url 参数则会选中 url 部分', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 3
    }
    linkOrImage(state, '', '', true)
    expect(state).toEqual({
      value: 'a[bc](url)\n\ndef',
      selectionStart: 6,
      selectionEnd: 9
    })
  })

  it('没有选中文本则总是把光标放在中括号里', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 1
    }
    linkOrImage(state)
    expect(state).toEqual({
      value: 'a![](url)bc\n\ndef',
      selectionStart: 3,
      selectionEnd: 3
    })
  })

  it('优先使用传入的 text 参数作为文本', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 3
    }
    linkOrImage(state, '', 'xxx')
    expect(state).toEqual({
      value: 'a![xxx](url)\n\ndef',
      selectionStart: 8,
      selectionEnd: 11
    })
  })
})
