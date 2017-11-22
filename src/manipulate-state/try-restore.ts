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
    if (wrapStart < 0) return
    const wrapEnd = selectionEnd + length
    if (wrapEnd > value.length) return
    const startChar = value.slice(wrapStart, selectionStart)
    if (startChar !== char) return
    const endChar = value.slice(selectionEnd, wrapEnd)
    if (startChar !== endChar) return
    const selectedStr = value.slice(selectionStart, selectionEnd)
    state.value = stringSplice(value, wrapStart, wrapEnd, selectedStr)
    state.selectionStart = wrapStart
    state.selectionEnd = wrapStart + selectedStr.length
    return true
  }
}

function blockCode(state: IState) {
  const { value, selectionStart, selectionEnd } = state

  // 判断选中文本后四个字符是否是 \n```。如果没有触到文本结尾，则要多判断一个换行
  const { length } = value
  let wrapEnd = selectionEnd + 4
  if (wrapEnd > length) return
  let endEdge
  if (wrapEnd === length) {
    endEdge = true
  } else {
    wrapEnd += 1
  }
  if (value.slice(selectionEnd, wrapEnd) !== '\n```' + (endEdge ? '' : '\n'))
    return
  // 判断选中文本前一个字符是否是 \n
  const prevInedex = selectionStart - 1
  if (value[prevInedex] !== '\n') return
  // 判断前面的一行是否以 \n``` 开头。如果触到了文本开头，则不要求有第一个换行符。
  let wrapStart = value.lastIndexOf('\n', prevInedex - 1)
  let startEdge
  if (wrapStart < 0) {
    wrapStart = 0
    startEdge = true
  }
  if (
    value.slice(wrapStart, wrapStart + (startEdge ? 3 : 4)) !==
    (startEdge ? '' : '\n') + '```'
  )
    return
  const selectedStr = value.slice(selectionStart, selectionEnd)
  if (!startEdge && value[wrapStart - 1] === '\n') wrapStart -= 1
  if (value[wrapEnd] === '\n') wrapEnd += 1
  state.value = stringSplice(value, wrapStart, wrapEnd, selectedStr)
  state.selectionStart = wrapStart
  state.selectionEnd = wrapStart + selectedStr.length
  return true
}

function tryUnlist(char: RegExp) {
  return function(state: IState) {}
}
