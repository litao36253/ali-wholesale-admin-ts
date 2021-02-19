'use strict'

import http from '@/commons/http'
import storage from './storage'
import { formateData, jsonResultCallback } from '@/utils/formate'
import { API as configApi } from '@/conf/'
// 获取接口根路径
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development

export default {
  /*******************************************************************
   * @name njdfAjax 对http进行二次封装，提供单接口、多接口调用
   * @prama options {Object} 单接口调用传入参数
   *  #url
   *    #Object 多接口 {key1:['url', {httpOptions}]}
   *    #String  单接口 url
   *  #options
   *    #method <String> 请求方式，支持restful(get、post、delete、put、patch)
   *    #apiType <String> 请求接口类型，请查阅@conf/index.js
   *    #data {Object} post入参
   *    #params {Object} get入参
   *    #mask <null、Boolean> 默认不展示菊花，显示则设置为true
   *    #json <null、Boolean> 设置为true则为设置 content-type=text/json
   *    #token <null、Boolean> 需要用户登录，设置为false则不需要验证
   *    #formUpload <null、Boolean> 是否是form提交的方式上传附件，设置为true则为设置 content-type=multipart/form-data
   *  @prama callback {Object} 接口请求钩子回调事件
   *      #<Function> 成败 ----- 执行完之后的动作
   *      #[Array] 执行完之后的动作集
   *        #0 <Function> 成功 ----- 执行完之后的动作
   *        #1 <Function> 失败 ----- 执行完之后的动作
   *        #2 <Function> 成败 ----- 执行完之后的动作
   *        #3 <Function> 捕捉异常 ----- 执行完之后的动作
   ******************************************************************/
  njdfAjax: async (options, _callback) => {
    try {
      let data = formateData(options)
      if (options.length) {
        data.mask = false
      } else {
        if (options.mask === true) {
          data.mask = {
            background: 'rgba(255,255,255,0.25)'
          }
        } else {
          data.mask = false
        }
      }
      return httpRequst(data.url, {
        method: 'post',
        data: data['data'],
        headers: {
          'Content-Type': data['contentType']
        },
        mask: data.mask,
        callback: _callback
      }).then(res => {
        let result = jsonResultCallback(res.data)
        if (+result.code === 10069) { // 重写会话过期逻辑
          storage.xAuthToken = false
          window.app.$store.commit('M_SESSION_EXP_TIP', true)
          return Promise.resolve(result)
        } else {
          if (+result.code !== 0) { // 后台报错后在前端抛出
            window.app.$message.error(result.msg)
          }
          return Promise.resolve(result)
        }
      }).catch(e => {
        return Promise.reject(e)
      })
    } catch (err) {
      console.error(err)
    }
  },
  /*******************************************************************
   * @name request 对http进行二次封装，提供通过指定 apiType(api类型，有：导入、导出、CMS、邮件网关、话务平台等等) 访问系统接口
   * @author 李涛
   * @prama options {Object} 传入本次请求的配置信息
   *  #options
   *    #method <String> 请求方式，支持restful(get、post、delete、put、patch)
   *    #apiType <String> 请求接口类型，请查阅@conf/index.js(api类型，有：导入、导出、CMS、邮件网关、话务平台等等)
   *    #url <String> 请求接口的路径
   *    #data {Object} post入参
   *    #params {Object} get入参
   *    #mask <null、Boolean> 默认不展示菊花，显示则设置为true
   *    #json <null、Boolean> 设置为true则为设置 content-type=text/json
   *    #token <null、Boolean> 需要用户登录，设置为false则不需要验证
   *    #formUpload <null、Boolean> 是否是form提交的方式上传附件，设置为true则为设置 content-type=multipart/form-data
   *  @prama callback {Object} 接口请求钩子回调事件
   *      #<Function> 成败 ----- 执行完之后的动作
   *      #[Array] 执行完之后的动作集
   *        #0 <Function> 成功 ----- 执行完之后的动作
   *        #1 <Function> 失败 ----- 执行完之后的动作
   *        #2 <Function> 成败 ----- 执行完之后的动作
   *        #3 <Function> 捕捉异常 ----- 执行完之后的动作
   ******************************************************************/
  request: async (options, _callback) => {
    let _options = [options]
    try {
      let data = formateData(_options)
      if (options.mask === true) {
        data.mask = {
          background: 'rgba(255,255,255,0.25)'
        }
      } else {
        data.mask = false
      }
      options.apiType = options.apiType || 'DEFAULT' // 未指定apiType则默认为 'DEFAULT'
      data.url = `${BASE_PATH[options.apiType]}${options.url || ''}`
      return httpRequst(data.url, {
        method: options.method || 'post',
        data: data['data'],
        params: options['params'],
        json: options['json'],
        token: options['token'],
        headers: {
          'Content-Type': data['contentType']
        },
        mask: data.mask,
        callback: _callback
      }).then(res => {
        if (options.apiType === 'UCC') {
          let result = jsonResultCallback(res.data)
          if (+result.code === 10069) { // 重写会话过期逻辑
            storage.xAuthToken = false
            window.app.$store.commit('M_SESSION_EXP_TIP', true)
            return Promise.resolve(result)
          } else {
            if (+result.code !== 0) { // 后台报错后在前端抛出
              window.app.$message.error(result.msg)
            }
            return Promise.resolve(result)
          }
        } else {
          return Promise.resolve(res)
        }
      }).catch(e => {
        return Promise.reject(e)
      })
    } catch (err) {
      console.error(err)
    }
  }
}

// 起源
class OrginHttp {
  constructor (_url, _options) {
    const options = _options || {}
    this.options = Object.assign(
      {
        mask: true,
        method: 'get'
      },
      this._setOptions(_url, options)
    )
  }

  request (resolve, reject) {
    const options = this.options
    const CALLBACK = options.callback
    options.isUCCInterfaceNumber = true // 标记是通过接口号发起的请求
    http(options)
      .then(response => {
        // 无论咋样
        CALLBACK[2] && CALLBACK[2](jsonResultCallback(response.data))
        resolve(response)
      })
      .catch(e => {
        // 捕捉异常
        CALLBACK[3] && CALLBACK[3](e)
        reject(e)
      })
  }

  _setOptions (_url, _options) {
    let options = _options
    options.url = _url
    if (typeof _options.callback === 'function') {
      options.callback = [null, null, _options.callback]
    } else if (!_options.callback) {
      options.callback = []
    }
    return options
  }
}

const httpRequst = (url, options) => {
  return new Promise((resolve, reject) => {
    const baseRequest = new OrginHttp(url, options)
    baseRequest.request(resolve, reject)
  })
}
