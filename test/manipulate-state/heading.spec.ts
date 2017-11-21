import heading from '../../src/manipulate-state/heading'

const value = 'abc\n\ndef'

it('heading() 方法用来给段落开头添加 # 号', () => {
  expect(
    heading(
      {
        value,
        selectionStart: 1,
        selectionEnd: 1
      },
      1
    ).value
  ).toBe('# ' + value)

  expect(
    heading(
      {
        value,
        selectionStart: 6,
        selectionEnd: 6
      },
      4
    ).value
  ).toBe('abc\n\n#### def')
})
