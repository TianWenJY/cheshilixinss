/**
 * Created by tainwen on 18/11/18.
 */
// 按照cFormat格式化时间
// time可以是Date或long
import { isEmpty, isNotEmpty, isNullOrUndefined } from './validate'

export function parsePostArr(postData, cols) {
  if (isEmpty(postData) || isEmpty(cols)) {
    return
  }
  for (const [key, val] of Object.entries(postData)) {
    if (
      cols.some(item => {
        return item === key
      })
    ) {
      if (!isEmpty(val) || val instanceof Array) {
        postData[key] = val.join('<')
      }
    }
  }
}

export function concatImg(imgMap, keys) {
  const ks = keys.split(',')
  const temp = []
  ks.forEach(item => {
    if (isNotEmpty(imgMap[item])) {
      temp.concat(imgMap[item])
    }
  })
  return temp
}

export function imgHash(imgs) {
  const result = {}
  if (!isEmpty(imgs)) {
    for (const [key, val] of Object.entries(imgs)) {
      result[key] = isEmpty(val)
        ? ''
        : val
          .map(item => {
            return isNotEmpty(item.hashCode)
              ? item.hashCode
              : isNotEmpty(item.response) && isNotEmpty(item.response.key)
                ? item.response.key
                : 'error'
          })
          .join(',')
    }
  }
  return result
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string') time = parseInt(time)
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 将时间格式化为几天前几个小时前的样子
export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// 将url参数转换为JSON
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 获取字节长度
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

/**
 * 清除数组中的null项目
 * @param {Array} actual
 */
export function cleanArray(actual) {
  return actual.filter(item => {
    return !isEmpty(item)
  })
}

/**
 * 将json转换为url参数列表
 * @param {object}} json
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (isEmpty(json[key]) && key !== 'offset') return ''
      return (
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(
          typeof json[key] === 'object' ? JSON.stringify(json[key]) : json[key]
        )
      )
    })
  ).join('&')
}

/**
 * 不知道干嘛的,应该是url参数转json
 * @param {String} url
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * 展开合并对象，内部属性只展开object
 * @param {*} target
 * @param {*} source
 */
export function expandAndMergeObject(target, ...sourceArr) {
  if (typeof target !== 'object') {
    target = {}
  }
  sourceArr.forEach(source => {
    if (!Array.isArray(source) && isNotEmpty(source)) {
      Object.keys(source).forEach(property => {
        const sourceProperty = source[property]
        if (
          sourceProperty instanceof Object &&
          !(sourceProperty instanceof Array)
        ) {
          objectMerge(target, sourceProperty)
        } else {
          target[property] = sourceProperty
        }
      })
    }
  })
  return target
}

/**
 * 合并对象
 * @param {Object} target
 * @param {object} source
 */
export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (source === null || source === undefined) {
    return target
  }

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * 页面滚动
 * @param {document} element
 * @param {number} to
 * @param {number} duration 时长
 */
export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

/**
 * element的dom对象中添加或去除className
 * @param {document} element
 * @param {String} className
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }  
]

/**
 * 获取当前时间或当天开始时间
 * @param {string} type
 */
export function getTime(type) {
  return new Date(new Date().toDateString())
}

/**
 * 延时调用
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

/**
 * 深度克隆
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

export function removeAllChild(domId) {
  var dom = document.getElementById(domId)
  while (
    !isNullOrUndefined(dom) &&
    dom.hasChildNodes() // 当div下还存在子节点时 循环继续
  ) {
    dom.removeChild(dom.firstChild)
  }
}

// 读取图片
export function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = reject
  })
}

// 读取文件
export function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader)
    reader.onerror = reject
  })
}
