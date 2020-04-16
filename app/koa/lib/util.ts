/** 二维数组扁平化处理
 *
 * @param args  二维数组
 */
export function flatten<T = any>(...args: (T | T[])[]): T[] {
  return ([] as T[]).concat(...args)
}
