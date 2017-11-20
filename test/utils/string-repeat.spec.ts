import stringRepeat from '../../src/utils/string-repeat'

it('stringRepeat() 方法会将一段字符串重复 N 次', () => {
  expect(stringRepeat('1', 5)).toBe('11111')
})
