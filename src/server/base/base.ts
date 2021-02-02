import { Message } from 'element-ui'
import * as api from './api'
import router from '@/router/router'

export default async (path, data?, options = { tips: true }) => {
  return uniCloud.callFunction({
    name: 'base',
    data: {
      action: path,
      data
    }
  }).then(({ result }) => {
    const errorCode = result?.code
    if (errorCode) {
      switch (+errorCode || errorCode) {
        case 10000: // 入参错误
          console.error(`请求 ${path} 入参错误`, result.message)
          break
        case 10001: // 会话过期
          router.push({
            path: '/user/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
          break
        default:
          options.tips && Message.error(result.message)
      }
    } else {
      if (path === api.apiLogin || path === api.apiRegister) {
        uni.setStorageSync('uni_id_token', result.token)
        uni.setStorageSync('tokenExpired', result.tokenExpired)
      }
    }
    return result
  }).catch(() => {
    Message.error('请求出错，请稍后再试！')
  })
}

export const baseApi = api
