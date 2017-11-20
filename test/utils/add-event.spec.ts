import addEvent from '../../src/utils/add-event'

it('addEvent() 方法在注册事件后会返回一个取消事件注册的函数', () => {
  const spy = jasmine.createSpy('click')
  const btn = document.createElement('button')
  const unwatch = addEvent(btn, 'click', spy)
  btn.click()
  unwatch()
  btn.click()
  expect(spy).toHaveBeenCalledTimes(1)
})
