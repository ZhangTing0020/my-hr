/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  // test() 方法用于检测一个字符串是否匹配某个模式.
  // 如果字符串 string 中含有与 RegExpObject 匹配的文本，则返回 true，否则返回 false。
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  // const valid_map = ['admin', 'editor']
  // return valid_map.indexOf(str.trim()) >= 0
  // 双叹号用于把数据转换为布尔值
  return !!str
}
