'use strict'
import { language } from '@/conf/'
import storage from '@/commons/storage'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

export default {
  state: {
    userBaseInfo: {}, // 用户基本信息
    language: storage.lang || language.default, // 当前语言
    dictList: storage.dictList || [], // 数据字典集合
    sysParam: storage.sysParam || [], // 系统参数集合
    bomHistory: storage.bomHistory || [], // 历史记录
    cachedViews: storage.cachedViews || [], // 需要缓存的路由级组件
    bomHistoryActiveIndex: 0, // 当前历史标签索引
    menu: [], // 菜单
    roleList: storage.roleList || {}, // 所有的角色信息
    sessionExpTip: false // 会话过期提示弹框的显示状态
  },
  actions,
  mutations,
  getters
}
