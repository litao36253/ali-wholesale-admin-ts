'use strict'

import storage from 'store'
// TOKEN
const X_AUTH_TOKEN = 'X_AUTH_TOKEN'
// 语言
const LANG = 'LANG'
const LANG_PACKAGE = 'LANG_PACKAGE'
const HTTP_STATUS = 'HTTP_STATUS'
// 历史记录
const BOM_HISTORY = 'BOM_HISTORY'
// 数据字典
const DICT_LIST = 'DICT_LIST'
// 系统参数
const SYS_PARAM = 'SYS_PARAM'
// 角色信息
const ROLE_LIST = 'ROLE_LIST'
// 需要缓存的路由级组件
const CACHED_VIEWS = 'CACHED_VIEWS'

export default {
  // 系统当前语言
  get lang () {
    return storage.get(LANG)
  },
  set lang (val) {
    if (!val) {
      storage.remove(LANG)
    } else {
      storage.set(LANG, val)
    }
  },
  // 国际化语言包
  get langPackage () {
    return storage.get(LANG_PACKAGE)
  },
  set langPackage (val) {
    if (!val) {
      storage.remove(LANG_PACKAGE)
    } else {
      storage.set(LANG_PACKAGE, val)
    }
  },
  // http状态提示语
  get httpStatus () {
    return storage.get(HTTP_STATUS)
  },
  set httpStatus (val) {
    if (!val) {
      storage.remove(HTTP_STATUS)
    } else {
      storage.set(HTTP_STATUS, val)
    }
  },
  // 历史记录
  get bomHistory () {
    return storage.get(BOM_HISTORY)
  },
  set bomHistory (val) {
    if (!val) {
      storage.remove(BOM_HISTORY)
    } else {
      storage.set(BOM_HISTORY, val)
    }
  },
  // token
  set xAuthToken (val) {
    if (!val) {
      storage.remove(X_AUTH_TOKEN)
    } else {
      storage.set(X_AUTH_TOKEN, val)
    }
  },
  get xAuthToken () {
    return storage.get(X_AUTH_TOKEN)
  },
  // 数据字典
  get dictList () {
    return storage.get(DICT_LIST)
  },
  set dictList (val) {
    if (!val) {
      storage.set(DICT_LIST, false)
    } else {
      storage.set(DICT_LIST, val)
    }
  },
  // 数据字典
  get sysParam () {
    return storage.get(SYS_PARAM)
  },
  set sysParam (val) {
    if (!val) {
      storage.set(SYS_PARAM, false)
    } else {
      storage.set(SYS_PARAM, val)
    }
  },
  // 角色信息
  get roleList () {
    return storage.get(ROLE_LIST)
  },
  set roleList (val) {
    if (!val) {
      storage.set(ROLE_LIST, false)
    } else {
      storage.set(ROLE_LIST, val)
    }
  },
  // 需要缓存的路由级组件
  get cachedViews () {
    return storage.get(CACHED_VIEWS)
  },
  set cachedViews (val) {
    if (!val) {
      storage.set(CACHED_VIEWS, false)
    } else {
      storage.set(CACHED_VIEWS, val)
    }
  }
}
