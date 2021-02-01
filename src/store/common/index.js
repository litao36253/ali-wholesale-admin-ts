import mutations from './mutations.js'
import action from './action.js'

export default {
  namespaced: true,
  state: {
    userInfo: {
      username: 'litao'
    }
  },
  mutations,
  action
}
