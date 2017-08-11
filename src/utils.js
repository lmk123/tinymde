/**
 * 作用于 string 的类似 Array#splice 的方法
 * @param {string} str
 * @param {number} start
 * @param {number} remove
 * @param {string} [insertStr]
 * @return {string}
 */
export function splice4string (str, start, remove, insertStr = '') {
  const startString = str.slice(0, start)
  const endString = str.slice(start + remove)
  return startString + insertStr + endString
}

export function wrapBy (str, start, end, wrapStr) {
  let result = splice4string(str, start, 0, wrapStr)
  result = splice4string(result, end + wrapStr.length, 0, wrapStr)

  return result
}
