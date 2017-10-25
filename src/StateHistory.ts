import { IState } from './utils/manipulate-state/types'

export default class StateHistory {
  private readonly max: number
  private history: IState[]
  private current: number

  constructor(max = 50) {
    this.max = max
    this.clear()
  }

  get(index = this.current) {
    return this.history[index]
  }

  push(state: IState) {
    const { history, current } = this

    // 删除后面的状态并添加新状态
    history.splice(current + 1, history.length - current, state)

    // 如果更新后记录超出最大记录数则删除最前面的记录
    if (history.length > this.max) {
      history.shift()
    } else {
      // 否则更新当前索引
      this.current += 1
    }
  }

  replace(state: IState) {
    const { history } = this
    let deleted
    if (this.current >= 0) {
      deleted = history.pop()
    } else {
      this.current = 0
    }
    history.push(state)
    return deleted
  }

  restore(index: number) {
    if (index >= 0 && index <= this.current) {
      this.current = index
      return this.get()
    }
  }

  go(count: number) {
    return this.restore(this.current + count)
  }

  clear() {
    this.history = []
    this.current = -1
  }
}
