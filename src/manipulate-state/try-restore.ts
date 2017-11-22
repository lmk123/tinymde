import stringSplice from '../utils/string-splice'
import { IState } from '../types'

export interface ResotoreMap {
  [type: string]: (state: IState) => true | undefined
}

const restoreFns: ResotoreMap = {
  bold: tryUnWrap('**'),
  italic: tryUnWrap('_'),
  strikethrough: tryUnWrap('~~'),
  inlineCode: tryUnWrap('`')
}

export default function(state: IState, type: string) {
  const fn = restoreFns[type]
  if (fn) return fn(state)
}

function tryUnWrap(char: string) {
  return function(state: IState) {
    const { value, selectionStart, selectionEnd } = state
    const { length } = char
    const wrapStart = selectionStart - length
    const wrapEnd = selectionEnd + length
    if (wrapStart >= 0 && wrapEnd <= value.length) {
      const startChar = value.slice(wrapStart, selectionStart)
      const endChar = value.slice(selectionEnd, wrapEnd)
      if (startChar === endChar && startChar === char) {
        const selectedStr = value.slice(selectionStart, selectionEnd)
        state.value = stringSplice(value, wrapStart, wrapEnd, selectedStr)
        state.selectionStart = wrapStart
        state.selectionEnd = wrapStart + selectedStr.length
        return true
      }
    }
  }
}
