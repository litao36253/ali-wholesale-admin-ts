'use strict'

// 打印钩子函数运行的时间
export const hookTime = (component, hookFnName) => {
  let date = new Date()
  let m = date.getMinutes()
  let s = date.getSeconds()
  let ms = date.getMilliseconds()
  console.log(`${component} ${hookFnName} ${m}-${s}-${ms}`)
}

// 将平级格式数据 深度递归
export const sonsTree = (arr, id) => {
  let temp = []
  let lev = 0
  let forFn = function (arr, id, lev) {
    for (var i = 0; i < arr.length; i++) {
      let item = arr[i]
      if (item.parent_id === id) {
        item.lev = lev
        temp.push(item)
        forFn(arr, item.id, lev + 1)
      }
    }
  }
  forFn(arr, id, lev)
  return temp
}

// 递归函数
export const toTree = (data) => {
  // 删除 所有 children,以防止多次调用
  data.forEach(function (item) {
    delete item.children
  })
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  let map = {}
  data.forEach(function (item) {
    map[item.id] = item
  })
  // console.log(map);
  let val = []
  data.forEach(function (item) {
    // 以当前遍历项，的pid,去map对象中找到索引的id
    let parent = map[item.pid]
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item)
    } else {
      // 如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item)
    }
  })
  return val
}

/*******************************************************************
 * @name listTransTree  list转树方法,传入 list 数组指定节点 id 的字段和父节点 id 的字段
 * @author 李涛
 * @prama list [{Object},{Object}...] 传入 list 数组
 * @prama id String 指定节点 ID 的字段名
 * @prama pid String 指定父节点 ID 的字段名
 * @prama children String 指定每个节点的子节点集合的名称，不指定则为 “children”
 * @return [tree] 返回树形结构的数据
 ******************************************************************/
export const listTransTree = (list, id, pid, children) => {
  return list.filter(function (parent) {
    let branchArr = list.filter(function (child) {
      return parent[id] === child[pid]
    })
    // parent[children || 'children'] = []
    if (branchArr.length > 0) {
      parent[children || 'children'] = branchArr
    }
    return parent[pid] === '0' // 根节点 id 为'0'
  })
}

/*******************************************************************
 * @name treeTransList  树型数据转list方法,传入树型数组指定节点树
 * @author 李涛
 * @prama list [{Object},{Object}...] 传入 list 数组
 * @prama id String 指定节点 ID 的字段名
 * @prama pid String 指定父节点 ID 的字段名
 * @prama children String 指定每个节点的子节点集合的名称，不指定则为 “children”
 * @return [tree] 返回树形结构的数据
 ******************************************************************/
export const treeTransList = (tree, key = 'children') => {
  return tree.reduce(function fn (con, item) {
    // let callee = arguments.callee
    con.push(item)
    if (item[key] && item[key].length > 0) { item[key].reduce(fn, con) }
    return con
  }, []).map(function (item) {
    item[key] = []
    return item
  })
}

/*******************************************************************
 * @name formatDate  将日期对象格式化固定格式字符串的方法
 * @author 李涛
 * @prama date 需要格式化的日期对象
 * @prama valueFormat 指定日期格式如：yyyy-MM-dd HH:mm:ss
 * @return string 返回格式化后的日期
 ******************************************************************/
export const formatDate = function (date, valueFormat) {
  let o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(valueFormat)) { valueFormat = valueFormat.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(valueFormat)) { valueFormat = valueFormat.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))) }
  }
  return valueFormat
}
