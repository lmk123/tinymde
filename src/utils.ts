// 作用于 string 的类似 Array#splice 的方法
export function splice4string (str: string, start: number, remove: number, insertStr: string = ''): string {
  const startString = str.slice(0, start)
  const endString = str.slice(start + remove)
  return startString + insertStr + endString
}

export function wrapBy (str: string, start: number, end: number, wrapStr: string): string {
  let result = splice4string(str, start, 0, wrapStr)
  result = splice4string(result, end + wrapStr.length, 0, wrapStr)

  return result
}
