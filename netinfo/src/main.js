'use strict'

import Vue from 'vue'
// 国际化
import i18n from './i18n/'
import Vuex from 'vuex'
import App from './App.vue'
import Router from 'vue-router'
import { sync } from 'vuex-router-sync'
import storage from './commons/storage'
import mixins from './mixins/'
import http from '@/commons/http'
import ajaxRequest from '@/commons/http-async'
import animated from 'animate.css'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 引入 iview 样式
import 'iview/dist/styles/iview.css'
// 不知道为啥有些element样式不生效，手动引入一次样式
import 'element-ui/lib/theme-chalk/index.css'

// 引入 animate 动画样式库
Vue.use(animated)

// 简单配置
NProgress.configure({ showSpinner: false })

// 注册全局的调用UCC系统接口的方法
Vue.prototype.$ajaxRequest = ajaxRequest.njdfAjax
// 注册全局的通用请求的方法
Vue.prototype.$request = ajaxRequest.request

Vue.config.productionTip = false
// 是否开启严格模式
const strict = process.env.NODE_ENV !== 'production'

// 加载路由
const routes = []
let requireContext = require.context('./routers', false, /^\.\/.*\.js$/)
requireContext.keys().forEach(key => {
  const mod = requireContext(key)
  ;(mod.__esModule && mod.default ? mod.default : mod)(routes)
})

// 如果没匹配上路由则自动跳转到 404
routes.push({
  path: '/*',
  redirect: '/404'
})

Vue.use(Router)

const router = new Router({
  strict: strict,
  routes: routes,
  mode: 'history',
  base: process.env.BASE_URL
})
// 初始化一个历史记录-首页
let bomHistory = storage.bomHistory || []
if (!bomHistory.some((item) => {
  return item.name === 'dashboard'
})) {
  bomHistory.unshift({
    name: 'dashboard',
    fullPath: '/dashboard',
    meta: {
      title: '首页',
      ignoreAuth: false, // 是否不需要验证权限
      ignoreSaveHistory: true, // 是否不需要将此路由加入历史记录
      eventDeleteDisabled: true // 不能删除
    }
  })
}
storage.bomHistory = bomHistory

// 刷新页面后需要重新验证会话状态
storage.xAuthToken = false

// 配置路由钩子
router.beforeEach((to, from, next) => {
  // 设置文档标题
  document.title = (window.app || new Vue({ i18n })).$i18n.t('router')[to.meta.title] || (window.app || new Vue({ i18n })).$i18n.t('router')['星网信通']
  // 进度条
  if (to.name !== from.name) {
    NProgress.start()
  }
  // 判断权限
  let Authentication = () => {
    let menu = window.app.$store.state.common.menu
    if (to.path === '/dashboard' || menu.some((item) => {
      return item.MENU_LINK === to.path
    })) {
      next()
    } else {
      window.app.$router.replace({
        name: '401'
      })
    }
  }
  // 加载loading
  if (to.matched.some(r => !r.meta.ignoreAuth)) {
    if (storage.xAuthToken) {
      Authentication()
    } else {
      // 判断是否有登录会话
      http({
        apiType: 'UCC',
        method: 'post',
        url: `/njdf_session`
      })
        .then(response => {
          let user = response['data']
          if (user['IRETCODE'] === '0') {
            // 存在未过期的会话
            storage.xAuthToken = true
            // 此处获取到了登录的用户信息
            window.app.$store.commit('M_USER_INFO', 'clear')
            for (let key in user) { // 将帐号信息存入state
              window.app.$store.commit('M_USER_INFO', { key: key, val: user[key] })
            }
            window.app.$store.dispatch('A_COMMON_MENU', { // 获取当前登录帐号的系统菜单
              successCb: () => {
                Authentication()
              }
            })
          } else {
            storage.xAuthToken = false
            next({
              name: 'login',
              query: {
                redirect: to.fullPath
              }
            })
          }
        })
    }
  } else {
    if (storage.xAuthToken) {
      next()
    } else {
      // 判断是否有登录会话
      http({
        apiType: 'UCC',
        method: 'post',
        url: `/njdf_session`
      })
        .then(response => {
          let user = response['data']
          if (user['IRETCODE'] === '0') {
            // 存在未过期的会话
            storage.xAuthToken = true
            // 此处获取到了登录的用户信息
            window.app.$store.commit('M_USER_INFO', 'clear')
            for (let key in user) { // 将帐号信息存入state
              window.app.$store.commit('M_USER_INFO', { key: key, val: user[key] })
            }
            window.app.$store.dispatch('A_COMMON_MENU', { // 获取当前登录帐号的系统菜单
              successCb: () => {
                next()
              }
            })
          } else {
            next()
          }
        })
    }
  }
})
router.afterEach(route => {
  // 删除loading
  NProgress.done()
})

// 动态加载vuex
const modules = {}
requireContext = require.context('./stores', true, /^\.\/.*\/index\.js$/)
requireContext.keys().forEach(key => {
  const mod = requireContext(key)
  modules[key.slice(2, -9)] = mod.__esModule && mod.default ? mod.default : mod
})
Vue.use(Vuex)
const store = new Vuex.Store({
  modules,
  strict
})
// 将路由写进state
sync(store, router)

// 加载过滤器
Vue.use(Vue => {
  ;(r => {
    const arr = r.keys().map(r) || []
    arr.forEach(filter => {
      filter = filter.__esModule && filter.default ? filter.default : filter
      Object.keys(filter).forEach(key => {
        Vue.filter(key, filter[key])
      })
    })
  })(require.context('./filters', false, /^\.\/.*\.js$/))
})

// 加载指令
Vue.use(Vue => {
  ;(r => {
    const arr = r.keys().map(r) || []
    arr.forEach(directive => {
      directive = directive.__esModule && directive.default
        ? directive.default
        : directive
      Object.keys(directive).forEach(key => {
        Vue.directive(key, directive[key])
      })
    })
  })(require.context('./directives', false, /^\.\/.*\.js$/))
})

window.app = new Vue({
  el: 'app',
  mixins: [mixins],
  store,
  router,
  i18n,
  render: h => h(App)
})

// 动态加载插件
requireContext = require.context('./plugins', true, /^\.\/.*\.js$/)
requireContext.keys().forEach(key => {
  requireContext(key)
})

export default window.app
