import stringSplice from '../../src/utils/string-splice'

it('stringSplice() 方法是类似于 Array#splice() 的方法', () => {
  expect(stringSplice('abcd', 1, 2)).toBe('acd')
  expect(stringSplice('abcd', 1, 2, 'xxx')).toBe('axxxcd')
})
