import mutations from './mutations'
import action from './action'

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
