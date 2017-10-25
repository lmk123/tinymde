import 'core-js/modules/es6.object.assign'
import 'core-js/modules/es6.string.starts-with'
import 'core-js/modules/es6.string.repeat'

import TinyMDE from '../src/index'
import { noop } from '../src/utils'

export { TinyMDE }
export const DEFAULT_TEXT = `这是段落一。

这是第二个段落。`

export default new TinyMDE(el => {
  document.body.appendChild(el)
})
