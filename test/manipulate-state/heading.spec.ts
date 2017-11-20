import heading from '../../src/manipulate-state/heading'

const value = 'abc\n\ndef'

it('heading() 方法用来给段落开头添加 # 号', () => {
  const state = {
    value,
    selectionStart: 1,
    selectionEnd: 1
  }
  heading(state, 1)
  expect(state.value).toBe('# ' + value)

  const state2 = {
    value,
    selectionStart: 6,
    selectionEnd: 6
  }
  heading(state2, 4)
  expect(state2.value).toBe('abc\n\n#### def')
})
