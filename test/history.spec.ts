import StateHistory from '../src/StateHistory'

interface IFakeTextarea {
  selectionStart: number
  selectionEnd: number
  value: string
  [other: string]: any
}

describe('历史记录', () => {
  let state: IFakeTextarea
  let history: StateHistory
  beforeEach(() => {
    state = {
      tagName: 'TEXTAREA',
      value: '0',
      selectionStart: 0,
      selectionEnd: 0
    }
    history = new StateHistory(state, 2)
  })

  it('初始化时会将初始状态保存到记录中', () => {
    expect(history.current).toBe(0)
    expect(state).toEqual(jasmine.objectContaining(history.history[0]))
  })

  it('保存的记录与数组里的记录对象并不相等', () => {
    expect(state).toEqual(jasmine.objectContaining(history.history[0]))
    expect(state).not.toBe(history.history[0])

    state.value = 'I am changed!'
    history.push()

    expect(state).toEqual(jasmine.objectContaining(history.history[1]))
    expect(state).not.toBe(history.history[1])
  })

  it('push 方法不会保存相同的记录', () => {
    history.push()
    expect(history.history.length).toBe(1)
    expect(history.current).toBe(0)
    history.push()
    expect(history.history.length).toBe(1)
    expect(history.current).toBe(0)
  })

  it('go 方法会将 state 还原到某一状态', () => {
    state.value = '1'
    history.push()
    expect(history.current).toBe(1)

    history.go(-1)
    expect(state.value).toBe('0')
    expect(history.current).toBe(0)
    expect(history.history.length).toBe(2)

    history.go(100)
    expect(state.value).toBe('0')
    expect(history.current).toBe(0)
    expect(history.history.length).toBe(2)
  })

  it('超过最大记录数时会删除前面的记录', () => {
    state.value = '1'
    history.push()
    state.value = '2'
    history.push()
    expect(history.history.length).toBe(2)
    expect(history.current).toBe(1)
  })
})
