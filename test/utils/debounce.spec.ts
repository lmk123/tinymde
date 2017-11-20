import debounce from '../../src/utils/debounce'

it('debounce() 方法会延迟执行函数', done => {
  const spy = jasmine.createSpy('debounce')
  const wrapped = debounce(spy, 250)
  wrapped()
  setTimeout(wrapped, 100)
  setTimeout(wrapped, 200)
  setTimeout(() => {
    expect(spy).toHaveBeenCalledTimes(1)
    done()
  }, 500)
})
