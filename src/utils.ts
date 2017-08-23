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
 * 将一段字符串用指定的符号包裹
 * @param str - 要处理的字符串
 * @param start - 要包裹的字符串的开始位置
 * @param end - 要包裹的字符串的结束位置
 * @param wrapStr - 用于包裹的字符串
 */
export function wrapBy (str: string, start: number, end: number, wrapStr: StringOrIntroOutro) {
  const { intro, outro } = getInOut(wrapStr)

  const result = insertString(str, start, intro)
  return insertString(result, end + outro.length, outro)
}

/**
 * 重复字符串
 * @type {(str, count) => string}
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
