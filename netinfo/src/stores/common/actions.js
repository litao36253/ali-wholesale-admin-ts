'use strict'

import http from '@/commons/http'
import storage from '@/commons/storage'
import { language } from '@/conf/'
import * as types from './types'

export default {
  /***************************************
   * 获取数据字典
   * @author litao
   * @params
   * @
   **************************************/
  [types.A_DICT_LIST] ({
    commit
  }) {
    return http({
      apiType: 'UCC',
      method: 'get',
      url: `/njdf_cache?cacheType=dictCache&language=${storage.lang || language.default}`
    })
      .then(response => {
        let { data } = response
        if (response.status === 200) {
          // 储存数据字典信息
          commit(types.M_DICT_LIST, data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  /***************************************
   * 获取系统参数
   * @author litao
   * @params
   * @
   **************************************/
  [types.A_SYS_PARAM] ({
    commit
  }) {
    return http({
      apiType: 'UCC',
      method: 'get',
      url: `/njdf_cache?cacheType=sysParamCache&language=${storage.lang || language.default}`
    })
      .then(response => {
        let { data } = response
        if (response.status === 200) {
          // 储存数据字典信息
          commit(types.M_SYS_PARAM, data)
        }
      })
      .catch(error => {
        console.log(error)
      })
  },
  /***************************************
   * 获取角色信息
   * @author litao
   * @params options: {} | object
   * @
   **************************************/
  [types.A_ROLE_LIST] ({
    commit
  }, options) {
    return http({
      apiType: 'UCC',
      method: 'get',
      url: `/njdf_cache?cacheType=roleCache&language=${storage.lang || language.default}`
    })
      .then(response => {
        let { data } = response
        if (response.status === 200) {
          // 储存数据字典信息
          commit(types.M_ROLE_LIST, data)
          options && options.successCb && options.successCb()
        } else {
          options && options.failCb && options.failCb()
        }
      })
      .catch(error => {
        console.log(error)
        options && options.failCb && options.failCb()
      })
  },
  /***************************************
   * 获取当前登录帐号的系统菜单
   * @author litao
   * @params options: {} | object
   * @
   **************************************/
  [types.A_COMMON_MENU] ({
    commit
  }, options) {
    return window.app.$ajaxRequest([{
      service: 'U0201404',
      mask: false
    }])
      .then(result => {
        if (result.code === '0') {
          commit(types.M_COMMON_MENU, result.data)
          options && options.successCb && options.successCb()
        } else {
          commit(types.M_COMMON_MENU, [])
          options && options.failCb && options.failCb()
        }
      })
      .catch(error => {
        console.error(error)
        commit(types.M_COMMON_MENU, [])
        options && options.failCb && options.failCb()
      })
  }

}
