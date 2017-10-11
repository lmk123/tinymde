/**
 * 在字符串中插入一段字符串
 * @param str - 原本的字符串
 * @param start - 要插入字符串的位置
 * @param insert - 要插入的字符串
 * @param end - 如果有 end 参数，则会替换掉 start 至 end 范围内的这段字符串
 */
export function insertString (str: string, start: number, insert: string, end?: number) {
  if (!end) end = start

  const startString = str.slice(0, start)
  const endString = str.slice(start + (end - start))
  return startString + insert + endString
}

export type IntroOutro = { intro: string, outro: string }
export type StringOrIntroOutro = string | IntroOutro

export function getInOut (inOut: StringOrIntroOutro): IntroOutro {
  if (typeof inOut === 'string') {
    return {
      intro: inOut,
      outro: inOut
    }
  }
  return inOut
}

/**
 * 重复字符串
 */
export const repeat: (str: string, count: number) => string = String.prototype.repeat
    ? function (str, count) {
      return str.repeat(count)
    }
    : function (str, count) {
      let s = ''
      for (let i = 0; i < count; i++) {
        s += str
      }
      return s
    }

export type AnyFunc = (...a: any[]) => any

/**
 * 注册事件的便捷方法。
 * @param el
 * @param name
 * @param handler
 */
export function addEvent (el: EventTarget, name: string, handler: (event: Event) => any) {
  el.addEventListener(name, handler)
  return function () {
    el.removeEventListener(name, handler)
  }
}

/**
 * 简单的 debounce 方法
 * @param func
 * @param timeout
 */
export function debounce (func: AnyFunc, timeout = 250) {
  let timeId: number
  return function (this: any, ...args: any[]) {
    window.clearTimeout(timeId)
    timeId = window.setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
