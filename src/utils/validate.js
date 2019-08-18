/**
 * Created by tianwen on 18/11/18.
 */
const validate = require('validate.js')

// 验证字符串正整数
export function strIsInt(val) {
  return isEmpty(val)
    ? false
    : isNaN(parseInt(val))
      ? false
      : (parseInt(val) + '').length === val.length
}

// 验证手机号
export function isPhone(val) {
  return (
    isNotEmpty(val) &&
    val.length === 11 &&
    parseInt(val) > 12999999999 &&
    val < 19999999999
  )
}

export function isvalidUsername(str) {
  return true
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validateAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * validate email
 * @param email
 * @returns {boolean}
 */
export function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

export function isEmpty(val) {
  if (!val && val !== 0) return true
  if (val === undefined) return true
  if (typeof val === 'object') return Object.keys(val).length === 0
  if (typeof val === 'string') return val == null || val.length === 0
  return false
}

export function isNotEmpty(val) {
  return !isEmpty(val)
}

export function isNullOrUndefined(val) {
  return !val || val === undefined
}

/**
 * 保留小数方法
 * @param {String} val
 * @param {Number} count
 * count为保留几位
 */
export function keepDecimals(val, count) {
  count = isEmpty(count) ? 2 : count
  const decimal = Math.pow(10, count)
  return validate.isNumber(val) ? Math.floor(Math.abs(parseFloat(val) * decimal)) / decimal : ''
}
