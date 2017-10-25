import { IState } from './types'
import padNewLines from '../pad-newlines'
import repeat from '../string-repeat'
import splice from '../string-splice'

const symbol = '* * *'
const symbolLength = symbol.length

/**
 * 水平分割线
 */
export default function(state: IState) {
  const { before, after } = padNewLines(state)
  const { selectionStart } = state
  const newState = {} as IState
  newState.value = splice(
    state.value,
    selectionStart,
    state.selectionEnd - selectionStart,
    before + symbol + after
  )
  newState.selectionStart = newState.selectionEnd =
    selectionStart + before.length + symbolLength + after.length + 1
  return newState
}
