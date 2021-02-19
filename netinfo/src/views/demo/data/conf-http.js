'use strict'

// http参数

export default {
  // get单接口请求
  get: {
    url: '/get',
    options: {
      method: 'get'
    }
  },
  // get多接口请求，key:value
  getMulti: {
    one: {
      url: '/get/one',
      method: 'get'
    },
    two: {
      url: '/get/two',
      method: 'get'
    }
  },
  delete: {
    url: '/delete',
    options: {
      method: 'delete'
    }
  }
}
