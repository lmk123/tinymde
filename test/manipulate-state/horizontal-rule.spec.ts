import hr from '../../src/manipulate-state/horizontal-rule'
const value = 'abc\n\ndef'

describe('hr() 方法的作用是添加水平分割线并且光标永远固定在结尾的换行符上', () => {
  it('光标在开头时', () => {
    const state = {
      value,
      selectionStart: 0,
      selectionEnd: 0
    }
    hr(state)
    expect(state).toEqual({
      value: '\n\n* * *\n\nabc\n\ndef',
      selectionStart: 9,
      selectionEnd: 9
    })
  })

  it('光标在段落中时', () => {
    const state = {
      value,
      selectionStart: 1,
      selectionEnd: 1
    }
    hr(state)
    expect(state).toEqual({
      value: 'a\n\n* * *\n\nbc\n\ndef',
      selectionStart: 10,
      selectionEnd: 10
    })
  })

  it('光标在段落结尾时', () => {
    const state = {
      value,
      selectionStart: 3,
      selectionEnd: 3
    }
    hr(state)
    expect(state).toEqual({
      value: 'abc\n\n* * *\n\ndef',
      selectionStart: 12,
      selectionEnd: 12
    })
  })

  it('光标在结尾时', () => {
    const state = {
      value,
      selectionStart: value.length - 1,
      selectionEnd: value.length - 1
    }
    hr(state)
    expect(state).toEqual({
      value: 'abc\n\ndef\n\n* * *\n\n',
      selectionStart: 17,
      selectionEnd: 17
    })
  })
})
