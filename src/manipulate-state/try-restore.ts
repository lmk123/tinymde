import stringSplice from '../utils/string-splice'
import { IState } from '../types'

export const restoreFns = {
  bold: tryUnWrap('**'),
  italic: tryUnWrap('_'),
  strikethrough: tryUnWrap('~~'),
  inlineCode: tryUnWrap('`'),
  blockCode,
  ul: tryUnlist(/\-\s/),
  ol: tryUnlist(/\d+\.\s/),
  quote: tryUnlist(/>\s/),
  task: tryUnlist(/\-\s\[[\sx]\]\s/)
}

export type KeyOfRestoreFns = keyof typeof restoreFns

export default function(state: IState, type: KeyOfRestoreFns) {
  return restoreFns[type](state)
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

function blockCode(state: IState) {
  const { value, selectionStart, selectionEnd } = state

  // 判断选中文本后四个字符是否是 \n```
  let wrapEnd = selectionEnd + 5
  if (value.slice(selectionEnd, wrapEnd) !== '\n```\n') return
  // 判断选中文本前一个字符是否是 \n
  const prevInedex = selectionStart - 1
  if (value[prevInedex] !== '\n') return
  // 判断前面的一行是否以 ``` 开头
  let wrapStart = value.lastIndexOf('\n', prevInedex - 1)
  if (value.slice(wrapStart, wrapStart + 4) !== '\n```') return
  const selectedStr = value.slice(selectionStart, selectionEnd)
  if (value[wrapStart - 1] === '\n') wrapStart -= 1
  if (value[wrapEnd] === '\n') wrapEnd += 1
  state.value = stringSplice(value, wrapStart, wrapEnd, selectedStr)
  state.selectionStart = wrapStart
  state.selectionEnd = wrapStart + selectedStr.length
  return true
}

function tryUnlist(char: RegExp) {
  return function(state: IState) {}
}
