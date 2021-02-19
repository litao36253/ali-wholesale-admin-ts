'use strict'

import Vue from 'vue'
import storage from '@/commons/storage'
import * as types from './types'

export default {
  // 获取用户信息
  [types.M_USER_INFO] (state, payload) {
    if (payload === 'clear') {
      state.userBaseInfo = {}
    } else {
      if (payload.key) {
        Vue.set(state.userBaseInfo, payload.key, payload.val)
      }
    }
  },
  // 切换语言
  [types.M_COMMON_LANGUAGE_CHANGE] (state, _data) {
    state.language = storage.lang = _data
  },
  // 添加历史记录
  [types.M_BOM_HISTORY_ADD] (state, _data) {
    state.bomHistory.push(_data)
    let map = {}
    // 数据去重
    const HISTORY = state.bomHistory.reduce((result, next) => {
      if (!map[next.name]) {
        map[next.name] = true
        result.push(next)
      }
      return result
    }, [])
    const CACHEDS = []
    HISTORY.forEach((next) => {
      if (next.meta.keepAlive !== false) {
        CACHEDS.push(next.name)
      }
    })
    storage.bomHistory = HISTORY
    storage.cachedViews = CACHEDS
    state.bomHistory = HISTORY
    state.cachedViews = CACHEDS
  },
  // 删除历史记录
  [types.M_BOM_HISTORY_DELETE] (state, _data) {
    let goPath = '/'
    if (_data.index) {
      state.bomHistory.splice(_data.index, 1)
    } else {
      state.bomHistory.length > 1 &&
        state.bomHistory.splice(1, state.bomHistory.length - 1)
      goPath = state.bomHistory[0].fullPath
      _data.callback && _data.callback(goPath)
    }

    const HISTORY = state.bomHistory
    const CACHEDS = []
    HISTORY.forEach((next) => {
      if (next.meta.keepalive !== false) {
        CACHEDS.push(next.name)
      }
    })
    storage.bomHistory = HISTORY
    storage.cachedViews = CACHEDS
    state.bomHistory = HISTORY
    state.cachedViews = CACHEDS

    if (_data.isCurrent && _data.index === HISTORY.length) {
      goPath = state.bomHistory[HISTORY.length - 1].fullPath
      _data.callback && _data.callback(goPath)
    } else if (_data.isCurrent && _data.index < HISTORY.length) {
      goPath = state.bomHistory[_data.index].fullPath
      _data.callback && _data.callback(goPath)
    }
  },
  // 清空历史
  [types.M_BOM_HISTORY_CLEAR] (state) {
    let HISTORY = [{
      name: 'dashboard',
      fullPath: '/dashboard',
      meta: {
        title: '首页',
        ignoreAuth: false, // 是否不需要验证权限
        ignoreSaveHistory: true, // 是否不需要将此路由加入历史记录
        eventDeleteDisabled: true // 不能删除
      }
    }]
    const CACHEDS = []
    HISTORY.forEach((next) => {
      if (next.meta.keepalive !== false) {
        CACHEDS.push(next.name)
      }
    })
    storage.bomHistory = HISTORY
    storage.cachedViews = CACHEDS
    state.bomHistory = HISTORY
    state.cachedViews = CACHEDS
  },
  // 获取历史标签当前索引
  [types.M_BOM_HISTORY_ACTIVE_INDEX] (state, _thisRouter) {
    let HISTORY = state.bomHistory
    HISTORY.forEach((item, index) => {
      if (item.name === _thisRouter.name) {
        state.bomHistoryActiveIndex = index
        HISTORY[index] = _thisRouter
      }
    })
    storage.bomHistory = HISTORY
    state.bomHistory = HISTORY
  },
  // 菜单
  [types.M_COMMON_MENU] (state, _data) {
    state.menu = _data
  },
  // 数据字典
  [types.M_DICT_LIST] (state, _data) {
    storage.dictList = _data
    state.dictList = _data
  },
  // 系统参数
  [types.M_SYS_PARAM] (state, _data) {
    storage.sysParam = _data
    state.sysParam = _data
  },
  // 角色信息
  [types.M_ROLE_LIST] (state, _data) {
    storage.roleList = _data
    state.roleList = _data
  },
  // 会话过期弹框的显示状态
  [types.M_SESSION_EXP_TIP] (state, _data) {
    state.sessionExpTip = _data
  }
}
