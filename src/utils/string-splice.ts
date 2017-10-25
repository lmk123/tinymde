/**
 * 一个针对字符串的类似于 Array#splice 的方法
 * @param str 要操作的字符串
 * @param start 修改的开始位置
 * @param deleteCount 要删除多少个字符
 * @param insert 要插入的字符串
 * @example
 *   stringSplice('acd', 1, 0, 'b') => 'abcd'
 *   stringSplice('abcde', 1, 2) => 'ade'
 *   stringSplice('abcde', 1, 2, 'z') => 'azde'
 */
export default function(
  str: string,
  start: number,
  deleteCount = 0,
  insert = ''
) {
  const startString = str.slice(0, start)
  const endString = str.slice(start + deleteCount)
  return startString + insert + endString
}
