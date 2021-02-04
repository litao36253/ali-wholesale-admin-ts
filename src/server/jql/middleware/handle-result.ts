import { Message } from 'element-ui'
import { Result } from '@/server/jql/types'

export default async (res: Promise<any>, countRes?: Promise<any>): Result => {
  const start = new Date().getTime()
  return Promise.all([res, countRes]).then(([res, countRes]) => {
    const result = res.result
    if (result.code) {
      Message.error(result.message)
      throw new Error(result.message)
    }
    let total
    if (countRes) {
      const result = countRes.result
      if (result.code) {
        Message.error(result.message)
        throw new Error(result.message)
      }
      total = countRes.result.total
    }
    return {
      total,
      duration: (new Date().getTime() - start) / 1000,
      ...result
    }
  }).catch(e => {
    Message.error('服务器出错了，请稍候再试！')
    throw e
  })
}