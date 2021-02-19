'use strict'

import storage from '@/commons/storage'
import actions from './actions'
import mutations from './mutations'

export default {
  state: {
    userBaseInfo: {},
    address: storage.demoAddress
  },
  actions,
  mutations
}
