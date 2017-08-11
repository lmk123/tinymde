import MDE from './MDE'

export default function (el) {
  if (typeof el === 'string') {
    el = document.querySelector(el)
  }
  return new MDE(el || document.createElement('textarea'))
}
