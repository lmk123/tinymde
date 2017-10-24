export interface IInterOutro {
  intro: string
  outro: string
}

export type TStringOrIntroOutro = string | IInterOutro

export interface IAnyFunc {
  (...a: any[]): any
}

/**
 * 在字符串中插入一段字符串
 * @param str - 原本的字符串
 * @param start - 要插入字符串的位置
 * @param insert - 要插入的字符串
 * @param end - 如果有 end 参数，则会替换掉 start 至 end 范围内的这段字符串
 */
export function insertString(
  str: string,
  start: number,
  insert: string,
  end?: number
) {
  if (!end) end = start
  const startString = str.slice(0, start)
  const endString = str.slice(start + (end - start))
  return startString + insert + endString
}

export function getInOut(inOut: TStringOrIntroOutro): IInterOutro {
  if (typeof inOut === 'string') {
    return {
      intro: inOut,
      outro: inOut
    }
  }
  return inOut
}

export interface IRepeatFunc {
  (str: string, count: number): string
}

/**
 * 重复字符串
 */
export const repeat: IRepeatFunc = String.prototype.repeat
  ? function(str, count) {
      return str.repeat(count)
    }
  : function(str, count) {
      let s = ''
      for (let i = 0; i < count; i++) {
        s += str
      }
      return s
    }

/**
 * 注册事件的便捷方法。
 */
export function addEvent<
  T extends EventTarget,
  K extends keyof HTMLElementEventMap
>(el: T, name: K, handler: (this: T, event: HTMLElementEventMap[K]) => void) {
  el.addEventListener(name, handler)
  return function() {
    el.removeEventListener(name, handler)
  }
}

/**
 * 简单的 debounce 方法
 */
export function debounce(func: IAnyFunc, timeout = 250) {
  let timeId: number
  return function(this: any, ...args: any[]) {
    window.clearTimeout(timeId)
    timeId = window.setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

// tslint:disable-next-line:no-empty
export function noop() {}
