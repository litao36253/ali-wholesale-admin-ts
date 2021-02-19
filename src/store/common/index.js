import mutations from './mutations.js'
import action from './action.js'

export default {
  namespaced: true,
  state: {
    userInfo: {
    },
    keepAliveRoutes: [] // 需要缓存的路由组件集合
  },
  mutations,
  action
}
