/**
 * @param {Number} length id长度???
 * @description 生成唯一id
 */
export const genID = length => {
  return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
}

/**
 * @param {Array} arr 检测数组
 * @description 用于判断arr是否为数组
 */
export function isArray (arr) {
  if (!Array.isArray) {
    Array.isArray = (arg) => {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
  }
  return Array.isArray(arr)
}
