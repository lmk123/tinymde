import { IAnyFunc } from './utils'
import { IState } from './utils/manipulate-state/types'
import noop from './utils/noop'
import addEvent from './utils/add-event'
import debounce from './utils/debounce'
import padNewLines from './utils/pad-newlines'

import StateHistory from './StateHistory'

import wrap from './utils/manipulate-state/wrap'
import list from './utils/manipulate-state/list'
import linkOrImage from './utils/manipulate-state/link-or-image'
import hr from './utils/manipulate-state/horizontal-rule'
import heading from './utils/manipulate-state/heading'

export interface IVoidFunc {
  (): void
}

export interface IOptions {
  maxRecords?: number
  saveDelay?: number
  onSave?: IVoidFunc
}

const defaultOptions = {
  maxRecords: 100,
  saveDelay: 3000,
  onSave: noop
}

function getStateFromTextarea(el: HTMLTextAreaElement) {
  return {
    selectionStart: el.selectionStart,
    selectionEnd: el.selectionEnd,
    value: el.value
  }
}

export default class {
  el: HTMLTextAreaElement
  private options: IOptions
  private history: StateHistory
  private unbindInput: IVoidFunc

  constructor(
    el: string | HTMLTextAreaElement | ((el: HTMLTextAreaElement) => void),
    options?: IOptions
  ) {
    const op = (this.options = Object.assign({}, defaultOptions, options))

    this.history = new StateHistory(op.maxRecords)

    let element: HTMLTextAreaElement
    if (typeof el === 'string') {
      const queryElement = document.querySelector(el)
      if (queryElement instanceof HTMLTextAreaElement) {
        element = queryElement
      } else {
        throw new TypeError('必须是一个 textarea 元素。')
      }
    } else if (typeof el === 'function') {
      element = document.createElement('textarea')
      el(element)
    } else {
      element = el
    }
    this.el = element

    this.unbindInput = addEvent(
      element,
      'input',
      debounce(() => {
        this.saveState()
        op.onSave()
      }, op.saveDelay)
    )
  }

  saveState() {
    this.history.push(getStateFromTextarea(this.el))
  }

  undo() {
    this.apply(this.history.go(-1), false)
  }

  redo() {
    this.apply(this.history.go(1), false)
  }

  bold() {
    this.apply(wrap(this.el, '**'))
  }

  italic() {
    this.apply(wrap(this.el, '_'))
  }

  strikethrough() {
    this.apply(wrap(this.el, '~~'))
  }

  inlineCode() {
    this.apply(wrap(this.el, '`'))
  }

  blockCode() {
    const newlinePad = padNewLines(this.el)
    return this.apply(
      wrap(this.el, {
        intro: newlinePad.before + '```\n',
        outro: '\n```' + newlinePad.after
      })
    )
  }

  ul() {
    this.apply(list(this.el, '- '))
  }

  ol() {
    this.apply(list(this.el, index => `${index + 1}. `))
  }

  quote() {
    this.apply(list(this.el, '> ', 1))
  }

  task() {
    this.apply(list(this.el, '- [ ] '))
  }

  link(url?: string, text?: string) {
    this.apply(linkOrImage(this.el, url, text, true))
  }

  image(url?: string, text?: string) {
    this.apply(linkOrImage(this.el, url, text))
  }

  hr() {
    this.apply(hr(this.el))
  }

  heading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    this.apply(heading(this.el, level))
  }

  private apply(state?: IState, save = true) {
    if (state) {
      Object.assign(this.el, state)
      if (save) {
        this.history.push(state)
      }
    }
  }
}
