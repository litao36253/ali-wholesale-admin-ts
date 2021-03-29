import baseServer, { baseApi } from '@/server/base/base'
import router from '@/router/router'

export default async () => {
  const tokenResult = await baseServer(baseApi.userCheckToken)
  if (tokenResult.code) {
    router.push({
      path: '/user/login',
      query: {
        redirect: router.currentRoute.fullPath
      }
    })
  }
  return tokenResult
}
