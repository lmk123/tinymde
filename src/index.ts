import noop from './utils/noop'
import addEvent from './utils/add-event'
import debounce from './utils/debounce'
import padNewLines from './utils/pad-newlines'
import assign from './utils/assign'

import StateHistory from './StateHistory'

import wrap from './manipulate-state/wrap'
import list from './manipulate-state/list'
import linkOrImage from './manipulate-state/link-or-image'
import hr from './manipulate-state/horizontal-rule'
import heading from './manipulate-state/heading'

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

export default class {
  readonly el: HTMLTextAreaElement
  private readonly options: IOptions
  private readonly history: StateHistory
  private readonly unbindInput: IVoidFunc

  constructor(
    el: string | HTMLTextAreaElement | ((el: HTMLTextAreaElement) => void),
    options?: IOptions
  ) {
    const op = (this.options = assign({}, defaultOptions, options))

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
    this.history = new StateHistory(element, op.maxRecords)

    this.unbindInput = addEvent(
      element,
      'input',
      debounce(() => {
        this.saveState()
        op.onSave()
      }, op.saveDelay)
    )
  }

  private manipulate(action: () => void) {
    this.saveState()
    action()
    this.saveState()
  }

  saveState() {
    this.history.push()
    this.el.focus()
  }

  undo() {
    this.history.go(-1)
    this.el.focus()
  }

  redo() {
    this.history.go(1)
    this.el.focus()
  }

  bold() {
    this.manipulate(() => {
      wrap(this.el, '**')
    })
  }

  italic() {
    this.manipulate(() => {
      wrap(this.el, '_')
    })
  }

  strikethrough() {
    this.manipulate(() => {
      wrap(this.el, '~~')
    })
  }

  inlineCode() {
    this.manipulate(() => {
      wrap(this.el, '`')
    })
  }

  blockCode() {
    this.manipulate(() => {
      const newlinePad = padNewLines(this.el)
      wrap(this.el, {
        intro: newlinePad.before + '```\n',
        outro: '\n```' + newlinePad.after
      })
    })
  }

  ul() {
    this.manipulate(() => {
      list(this.el, '- ')
    })
  }

  ol() {
    this.manipulate(() => {
      list(this.el, index => `${index + 1}. `)
    })
  }

  quote() {
    this.manipulate(() => {
      list(this.el, '> ', 1)
    })
  }

  task() {
    this.manipulate(() => {
      list(this.el, '- [ ] ')
    })
  }

  link(url?: string, text?: string) {
    this.manipulate(() => {
      linkOrImage(this.el, url, text, true)
    })
  }

  image(url?: string, text?: string) {
    this.manipulate(() => {
      linkOrImage(this.el, url, text)
    })
  }

  hr() {
    this.manipulate(() => {
      hr(this.el)
    })
  }

  heading(level: 1 | 2 | 3 | 4 | 5 | 6) {
    this.manipulate(() => {
      heading(this.el, level)
    })
  }
}
