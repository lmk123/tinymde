import { IState } from '../types'
import padNewLines from '../utils/pad-newlines'
import splice from '../utils/string-splice'

const symbol = '* * *'
const symbolLength = symbol.length

/**
 * 水平分割线
 */
export default function(state: IState) {
  const { before, after } = padNewLines(state)
  const { selectionStart } = state
  state.value = splice(
    state.value,
    selectionStart,
    state.selectionEnd,
    before + symbol + after
  )
  state.selectionStart = state.selectionEnd =
    selectionStart + before.length + symbolLength + after.length + 1
}
