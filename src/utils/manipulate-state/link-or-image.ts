import { IState } from './types'
import stringSplice from '../string-splice'

/**
 * link() 与 image() 的底层方法。
 */
export default function(
  state: IState,
  url = '',
  text?: string,
  isLink?: boolean
) {
  const { selectionStart, selectionEnd, value } = state
  const selectedText = value.slice(selectionStart, selectionEnd)

  if (!text) {
    text = selectedText
  }

  let noUrl

  if (!url) {
    noUrl = true
    url = 'url'
  }

  let intro = (isLink ? '' : '!') + '['

  const outroIn = ']('
  const outroOut = ')'

  const newString = intro + text + outroIn + url + outroOut
  const newState = {} as IState
  newState.value = stringSplice(
    value,
    selectionStart,
    selectionEnd - selectionStart,
    newString
  )

  if (!noUrl && text) {
    // 如果既有 url 也有 text，则将光标放在最后面
    newState.selectionEnd = newState.selectionStart =
      selectionStart + newString.length
  } else if (!text) {
    // 如果没有描述，则将光标放在描述里
    newState.selectionStart = newState.selectionEnd =
      selectionStart + intro.length
  } else if (noUrl) {
    // 如果有描述但没有 url，则将光标放在 url 里
    const start = selectionStart + intro.length + text.length + outroIn.length
    newState.selectionStart = start
    newState.selectionEnd = start + 3 /* 'url'.length */
  }

  return newState
}
