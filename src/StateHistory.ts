import copyState from './utils/copy-state'
import { IState } from './types'

export default class StateHistory {
  private readonly state: IState
  private readonly max: number
  private history: IState[]
  private current: number

  constructor(state: IState, max = 50) {
    this.state = state
    this.max = max
    this.clear()
    this.push()
  }

  push() {
    const state = copyState(this.state)
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

  go(count: number) {
    const newIndex = this.current + count
    if (newIndex >= 0 && newIndex < this.current) {
      this.current = newIndex
      Object.assign(this.state, this.history[newIndex])
    }
  }

  clear() {
    this.history = []
    this.current = -1
  }
}
