import MDE from './MDE'

export default function (el: string | HTMLTextAreaElement): MDE {
  if (typeof el === 'string') {
    el = (document.querySelector(el) as HTMLTextAreaElement)
  }
  return new MDE(el || document.createElement('textarea'))
}
