'use strict'

/*******************************************************************
 * @name http请求集合
 * @ps 函数参数命名建议加一个前缀'_',驼峰命名
 * 给大家写一个比较简单的例子
 * method: get、post、put、delete、patch
 ******************************************************************/

import http from '@/commons/http-async'
import httpOptions from '../data/conf-http'

export default {
  // get请求单个接口
  async get (_argument) {
    try {
      return http(httpOptions.get.url, httpOptions.get.options)
    } catch (e) {
      console.error(e)
    }
  },
  // get请求多个接口
  async getMulti (_argument) {
    try {
      return http(httpOptions.getMulti)
    } catch (e) {
      console.error(e)
    }
  },
  // delete
  async delete (_argument) {
    try {
      return http(httpOptions.delete.url, httpOptions.delete.options)
    } catch (e) {
      console.error(e)
    }
  }
}
