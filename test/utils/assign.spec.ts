import assign from '../../src/utils/assign'

describe('assign() 方法', () => {
  it('如果第一个参数是 null，则会报错', () => {
    expect(() => {
      // @ts-ignore
      assign(null)
    }).toThrow()

    expect(() => {
      // @ts-ignore
      assign(undefined)
    }).toThrow()
  })

  it('会将所有对象的属性添加在第一个参数上', () => {
    expect(assign({}, { a: 1 }, { a: 2, b: '' }, { c: { d: 'x' } })).toEqual({
      a: 2,
      b: '',
      c: { d: 'x' }
    })
  })
})
