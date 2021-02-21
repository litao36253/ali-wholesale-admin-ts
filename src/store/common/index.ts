import mutations from './mutations'
import actions from './actions'

export default {
  namespaced: true,
  state: {
    userInfo: {
    },
    keepAliveRoutes: [], // 需要缓存的路由组件集合
    dict: {
      test: [
        {
          dict_item_name: '测试3',
          dict_item_code: '3'
        },
        {
          dict_item_name: '测试2',
          dict_item_code: '2'
        }
      ]
    } // 数据字典
  },
  mutations,
  actions
}
