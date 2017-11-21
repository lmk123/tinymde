import padNewLines from '../../src/utils/pad-newlines'

const value = `abc\n\ndef`

describe('padNewLines() 方法会确定在插入块级内容时，前后需要插入多少个换行符', () => {
  it('光标在开头时，前面不需要，后面需要 2 各', () => {
    expect(
      padNewLines({
        value,
        selectionStart: 0,
        selectionEnd: 0
      })
    ).toEqual({
      before: '',
      beforeEdge: true,
      after: '\n\n',
      afterEdge: false
    })
  })

  it('光标在段落中间时，前后都需要两个换行', () => {
    expect(
      padNewLines({
        value,
        selectionStart: 1,
        selectionEnd: 1
      })
    ).toEqual({
      before: '\n\n',
      beforeEdge: false,
      after: '\n\n',
      afterEdge: false
    })
  })

  it('光标在段落结尾时，前面需要 2 个，后面不需要', () => {
    expect(
      padNewLines({
        value,
        selectionStart: 3,
        selectionEnd: 3
      })
    ).toEqual({
      before: '\n\n',
      beforeEdge: false,
      after: '',
      afterEdge: false
    })
  })

  it('光标在段落开头时，前面不需要，后面需要 2 个', () => {
    expect(
      padNewLines({
        value,
        selectionStart: 5,
        selectionEnd: 5
      })
    ).toEqual({
      before: '',
      beforeEdge: false,
      after: '\n\n',
      afterEdge: false
    })
  })

  it('光标在段落中间时，前后各需要 1 个', () => {
    expect(
      padNewLines({
        value,
        selectionStart: 4,
        selectionEnd: 4
      })
    ).toEqual({
      before: '\n',
      beforeEdge: false,
      after: '\n',
      afterEdge: false
    })
  })

  it('光标在结尾时，前面需要 2 个，后面不需要', () => {
    expect(
      padNewLines({
        value,
        selectionStart: value.length,
        selectionEnd: value.length
      })
    ).toEqual({
      before: '\n\n',
      beforeEdge: false,
      after: '',
      afterEdge: true
    })
  })
})
