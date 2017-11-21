import wrap from '../../src/manipulate-state/wrap'

const value = 'abc\n\ndef'

describe('wrap() 方法', () => {
  it('支持字符串参数', () => {
    expect(
      wrap(
        {
          value,
          selectionStart: 1,
          selectionEnd: 2
        },
        '!!'
      )
    ).toEqual({
      value: 'a!!b!!c\n\ndef',
      selectionStart: 3,
      selectionEnd: 4
    })
  })

  it('支持对象参数', () => {
    expect(
      wrap(
        {
          value,
          selectionStart: 1,
          selectionEnd: 2
        },
        {
          intro: '!',
          outro: '~'
        }
      )
    ).toEqual({
      value: 'a!b~c\n\ndef',
      selectionStart: 2,
      selectionEnd: 3
    })
  })
})
