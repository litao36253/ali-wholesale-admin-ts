export default {
  path: '/exception',
  name: 'exception',
  meta: {
    authCheck: false, // 是否鉴权
    hideInMenu: true // 在菜单中隐藏
  },
  redirect: '/exception/error',
  component: () => import('@/layout/home/home.vue'),
  children: [
    {
      path: '/exception/error',
      name: 'exception.error',
      meta: {
        title: '出错了'
      },
      component: () => import('@/views/exception/error.vue')
    },
    {
      path: '/exception/404',
      name: 'exception.404',
      component: () => import('@/views/exception/404.vue')
    },
    {
      path: '/exception/401',
      name: 'exception.401',
      component: () => import('@/views/exception/401.vue')
    }
  ]
}
