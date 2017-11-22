// TODO 完善测试

import restore from '../../src/manipulate-state/try-restore'

describe('restore 方法', () => {
  it('能恢复内联文本', () => {
    const state = {
      value: 'abc**bold**def',
      selectionStart: 5,
      selectionEnd: 9
    }
    expect(restore(state, 'bold')).toBe(true)
    expect(state).toEqual({
      value: 'abcbolddef',
      selectionStart: 3,
      selectionEnd: 7
    })
  })

  it('能恢复块级代码', () => {
    const state = {
      value: 'abc\n```jsp\ncode\n```\ndef',
      selectionStart: 11,
      selectionEnd: 15
    }
    expect(restore(state, 'blockCode')).toBe(true)
    expect(state).toEqual({
      value: 'abccodedef',
      selectionStart: 3,
      selectionEnd: 7
    })
  })

  describe('能恢复列表类型的格式', () => {
    it('', () => {
      const state = {
        value: 'abc\n- a\ndef',
        selectionStart: 6,
        selectionEnd: 7
      }
      expect(restore(state, 'ul')).toBe(true)
      expect(state).toEqual({
        value: 'abc\na\ndef',
        selectionStart: 4,
        selectionEnd: 5
      })
    })

    it('', () => {
      const state = {
        value: 'abc\n- a\n- b\n- c\ndef',
        selectionStart: 4,
        selectionEnd: 15
      }
      expect(restore(state, 'ul')).toBe(true)
      expect(state).toEqual({
        value: 'abc\na\nb\nc\ndef',
        selectionStart: 4,
        selectionEnd: 9
      })
    })
  })
})
