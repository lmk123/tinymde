import mde, { DEFAULT_TEXT } from './mde.helper'

const { el } = mde

describe('', () => {
  beforeEach(() => {
    el.value = DEFAULT_TEXT
    mde.setSelection(0)
  })
  describe('wrap 类方法中', () => {
    const wrapMethodsMap = {
      bold: {
        name: '星号',
        symbol: '**'
      },
      italic: {
        name: '下划线',
        symbol: '_'
      },
      strikethrough: {
        name: '波浪线',
        symbol: '~~'
      },
      inlineCode: {
        name: '点',
        symbol: '`'
      }
    }

    type TWrapMethod = keyof typeof wrapMethodsMap

    for (let method in wrapMethodsMap) {
      const o = wrapMethodsMap[method as TWrapMethod]
      const { symbol } = o
      const symbolLength = symbol.length

      describe(`${method} 方法`, () => {
        it(`在没有选中文本时会创建${o.name}并将光标置于星号中间`, () => {
          const cursor = 15
          mde.setSelection(cursor)
          mde[method as TWrapMethod]()
          expect(el.value.slice(cursor, cursor + symbolLength * 2)).toBe(
            symbol.repeat(2)
          )
          expect(el.selectionStart).toBe(cursor + symbolLength)
          expect(el.selectionEnd).toBe(cursor + symbolLength)
        })

        it('在选中文本时会用星号包裹文本，并保持选中文本不变', () => {
          const start = 3
          const end = 4
          mde.setSelection(start, end)
          const selected = el.value.slice(start, end)
          mde[method as TWrapMethod]()
          expect(
            el.value.slice(
              start,
              start + symbolLength + selected.length + symbolLength
            )
          ).toBe(`${symbol}${selected}${symbol}`)
          expect(el.selectionStart).toBe(start + symbolLength)
          expect(el.selectionEnd).toBe(start + symbolLength + selected.length)
        })
      })
    }

    describe('blockCode 方法', () => {
      it('会生成代码块', () => {
        const start = 1
        const emptyBlock = '\n\n```\n\n```\n\n'
        mde.setSelection(start)
        mde.blockCode()
        expect(el.value.slice(start, start + emptyBlock.length)).toBe(
          emptyBlock
        )
        expect(el.selectionStart).toBe(start + 6)
        expect(el.selectionEnd).toBe(start + 6)
      })

      it('若有选中文本则会包含进代码块', () => {
        const start = 3
        const end = 4
        mde.setSelection(start, end)
        const selected = el.value.slice(start, end)
        const expectedString = '\n\n```\n' + selected + '\n```\n\n'
        mde.blockCode()
        expect(el.value.slice(start, start + expectedString.length)).toBe(
          expectedString
        )
        expect(el.selectionStart).toBe(start + 6)
        expect(el.selectionEnd).toBe(start + 6 + selected.length)
      })
    })
  })
})
