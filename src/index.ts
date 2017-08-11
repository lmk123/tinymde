import MDE from './MDE'

export default function (el: string | HTMLTextAreaElement): MDE {
  if (typeof el === 'string') {
    el = <HTMLTextAreaElement>document.querySelector(el)
  }
  return new MDE(el || document.createElement('textarea'))
}
