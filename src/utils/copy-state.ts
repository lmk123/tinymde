import { IState } from '../types'

export default function(state: IState) {
  return {
    selectionStart: state.selectionStart,
    selectionEnd: state.selectionEnd,
    value: state.value
  }
}
