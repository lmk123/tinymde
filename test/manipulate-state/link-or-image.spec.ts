import linkOrImage from '../../src/manipulate-state/link-or-image'

const value = 'abc\n\ndef'

describe('linkOrImage() 方法', () => {
  it('有选中文本且传了 url 参数则光标在末尾', () => {
    expect(
      linkOrImage(
        {
          value,
          selectionStart: 1,
          selectionEnd: 3
        },
        'u'
      )
    ).toEqual({
      value: 'a![bc](u)\n\ndef',
      selectionStart: 9,
      selectionEnd: 9
    })
  })

  it('有选中文本但没传 url 参数则会选中 url 部分', () => {
    expect(
      linkOrImage(
        {
          value,
          selectionStart: 1,
          selectionEnd: 3
        },
        '',
        '',
        true
      )
    ).toEqual({
      value: 'a[bc](url)\n\ndef',
      selectionStart: 6,
      selectionEnd: 9
    })
  })

  it('没有选中文本则总是把光标放在中括号里', () => {
    expect(
      linkOrImage({
        value,
        selectionStart: 1,
        selectionEnd: 1
      })
    ).toEqual({
      value: 'a![](url)bc\n\ndef',
      selectionStart: 3,
      selectionEnd: 3
    })
  })

  it('优先使用传入的 text 参数作为文本', () => {
    expect(
      linkOrImage(
        {
          value,
          selectionStart: 1,
          selectionEnd: 3
        },
        '',
        'xxx'
      )
    ).toEqual({
      value: 'a![xxx](url)\n\ndef',
      selectionStart: 8,
      selectionEnd: 11
    })
  })
})
