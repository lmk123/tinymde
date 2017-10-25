import { IState } from './types'
import stringSplice from '../string-splice'

export interface IInterOutro {
  intro: string
  outro: string
}

export type TStringOrIntroOutro = string | IInterOutro

function getInOut(inOut: TStringOrIntroOutro): IInterOutro {
  if (typeof inOut === 'string') {
    return {
      intro: inOut,
      outro: inOut
    }
  }
  return inOut
}

/**
 * 包裹用户选中文本的快捷方法。
 */
export default function(state: IState, introOutro: TStringOrIntroOutro) {
  const { intro, outro } = getInOut(introOutro)
  const { selectionStart, selectionEnd, value } = state
  const newState = {} as IState
  newState.value = stringSplice(
    value,
    selectionStart,
    selectionEnd - selectionStart,
    intro + value.slice(selectionStart, selectionEnd) + outro
  )
  const selectionOffset = intro.length
  newState.selectionStart = selectionStart + selectionOffset
  newState.selectionEnd = selectionEnd + selectionOffset
  return newState
}
