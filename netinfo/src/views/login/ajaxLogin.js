'use strict'

import axios from 'axios'
// import jsCookie from 'js-cookie'
// import storage from '@/commons/storage'
import { API as configApi } from '@/conf/'

// 获取接口根路径
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

// 申请一个新的http实例
const instance = axios.create({
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'text/xml; charset=utf-8',
    'Data-Type': 'text'
  },
  timeout: 60000, // 设置超时时间为1分钟d
  toastDuration: 3000
})

// 添加请求拦截器
instance.interceptors.request.use(
  options => {
    let url = options.url
    // 如果配置了要请求的接口号,则
    options.url = BASE_PATH['UCC'] + url
    return options
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance
