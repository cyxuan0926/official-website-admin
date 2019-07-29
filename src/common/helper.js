/**
 * 拷贝简单对象（对象的属性值为基本类型）
 * ps: 引用类型的属性值无法正确拷贝, undefined, null, NaN均拷贝为null
 * @param {Object} obj 目标对象
 * @return {Object} 拷贝结果
 * @example
 *
 * const testObj = { a: 1, b: '2', c: true, h: { a: 1, b: true } }
 * const result = deepCopy(testObj)
 * // => {a: 1, b: "2", c: true, h: {a: 1, b: true}}
 * result === testObj
 * // => false
 */
export function deepCopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * 判断是否有值
 * @param {Any} val 待检测值
 * @example
 *
 * hasValue(0) // => true
 * hasValue({}) // => true
 * hasValue(null) // => false
 * hasValue("") // => false
 */
export function hasValue(val) {
  if (val === 0) {
    return true;
  } else {
    return Boolean(val);
  }
}
