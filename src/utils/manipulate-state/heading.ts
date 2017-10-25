import { IState } from './types'
import splice from '../string-splice'
import repeat from '../string-repeat'

const lf = '\n'
const lfLength = lf.length

export default function(state: IState, level: 1 | 2 | 3 | 4 | 5 | 6) {
  const { selectionStart, selectionEnd, value } = state

  // 查找离光标最近的换行符
  let brIndex = value.lastIndexOf(lf, selectionStart) + lfLength

  // 插入 # 号
  const fragment = repeat('#', level) + ' '
  const newState = {} as IState
  newState.value = splice(value, brIndex, 0, fragment)
  newState.selectionStart = selectionStart + fragment.length
  newState.selectionEnd = selectionEnd + fragment.length
  return newState
}
