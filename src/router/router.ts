import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import store from '@/store/store'
import baseServer, { baseApi } from '@/server/base/base'

Vue.use(VueRouter)

const routes: RouteConfig[] = []

// 动态载入所有路由
const routeModels = require.context('.', false, /^\.\/(?!router\.ts)[^/]+\.js/)
routeModels.keys().forEach(item => {
  routes.push(routeModels(item).default)
})

routes.push({
  path: '/*',
  redirect: '/exception/404',
  meta: {
    hideInMenu: true
  }
})

const router = new VueRouter({
  routes,
  base: process.env.BASE_URL
})

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const authCheck = !to.matched.some(item => item.meta?.authCheck === false) // 当前要进入的路由是否需要校验权限
  if (authCheck) {
    // @ts-ignore
    const userInfo = store.state.common.userInfo
    if (userInfo._id) {
      next()
    } else {
      const token = uni.getStorageSync('uni_id_token')
      if (token) {
        const tokenResult = await baseServer(baseApi.apiCheckToken)
        if (tokenResult.code) {
          next({
            path: '/user/login',
            query: {
              redirect: to.fullPath
            }
          })
        } else {
          store.commit('common/changeUserInfo', tokenResult.userInfo)
          await store.dispatch('common/queryAllDict')
          next()
        }
      } else {
        next({
          path: '/user/login',
          query: {
            redirect: to.fullPath
          }
        })
      }
    }
  } else {
    next()
  }
})

router.afterEach((to, from) => {
  NProgress.done()
  document.title = `后台管理系统${to.meta?.title ? '-' + to.meta.title : ''}`
  if (to.meta.keepAlive) {
    store.commit('common/changeKeepAliveRoutes', { type: 'add', name: to.name })
  }
})

export default router
