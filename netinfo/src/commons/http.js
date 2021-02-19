'use strict'

import axios from 'axios'
// import jsCookie from 'js-cookie'
import qs from 'querystring'
import storage from './storage'
import { API as configApi } from '@/conf/'
import { Loading, Message } from 'element-ui'

// 菊花
let gloading

// 获取接口根路径
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

// 申请一个新的http实例
const instance = axios.create({
  // baseURL: 再配,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  timeout: 60000, // 设置超时时间为1分钟d
  toastDuration: 3000
})

// 添加请求拦截器
instance.interceptors.request.use(
  options => {
    let url = options.url
    // 遮罩，默认不显示菊花
    if (options.mask) {
      // 这里写菊花转
      gloading = Loading.service()
      delete options.mask
    }
    // 简化类型设置
    const headers = (options.headers = options.headers || {})
    if (options.json) {
      headers['Content-Type'] = 'application/json; charset=UTF-8'
      delete options.json
    }
    if (options.formUpload) {
      headers['Content-Type'] = 'multipart/form-data; charset=UTF-8'
      delete options.formUpload
    }
    // 校验post数据格式
    const contentType = headers['Content-Type']
    if (
      typeof options.data === 'object' &&
      contentType &&
      contentType.indexOf('application/x-www-form-urlencoded') > -1
    ) {
      options.data = qs.stringify(options.data)
    }
    // 是否要设置token
    if (options.token !== false) {
      headers['x-auth-token'] = storage.xAuthToken
      delete options.token
    }
    // 如果不是是通过UCC接口号发起请求
    if (!options.isUCCInterfaceNumber) {
      options.url = BASE_PATH[options.apiType || 'DEFAULT'] + url
    }

    return options
  },
  error => {
    // 错误了要把菊花停下来
    gloading && gloading.close()
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 成功了要把菊花停下来
    gloading && gloading.close()
    // 获取token，本地存储
    if (response.headers['x-auth-token']) {
      storage.xAuthToken = response.headers['x-auth-token']
    }
    return response
  },
  error => {
    // 错误了要把菊花停下来
    gloading && gloading.close()
    if (error.response) {
      const data = error.response.data
      const status = error.response.status
      console.error(error.config.url, status, JSON.stringify(data))
      let errMessage =
        data.message ||
        storage.httpStatus.DEFAULT_ERROR ||
        ''
      switch (status) {
        case 401:
          window.location.replace(process.env.BASE_URL + 'login')
          break
        case 500:
          const code = +data.code || ''
          switch (code) {
            case 1003:
              // 没有登录
              errMessage = window.app.$t('没有登录')
              break
            default:
              errMessage = data.message || storage.httpStatus[code] || storage.httpStatus.DEFAULT_ERROR || ''
              if (!isProd) {
                errMessage = `${errMessage}${window.app.$t(' - 状态码：')}${code || status}`
              }
              break
          }
          break
      }
      // 禁用全局错误提示
      if (error.config.toast !== false) {
        Message({
          type: 'error',
          message: errMessage
        })
      }
    } else {
      if (axios.isCancel(error)) {
        console.error(window.app.$t('请求被取消'), error.message)
      } else {
        // 默认放一个空对象避免其他地方报错
        error.response = {}
        console.error(
          (error.config && error.config.url) || window.app.$t('无url'),
          window.app.$t('请求接口超时无响应')
        )
        Message({
          type: 'error',
          message: window.app.$t('请求接口超时无响应！')
        })
      }
    }
    return Promise.reject(error)
  }
)

export default instance
