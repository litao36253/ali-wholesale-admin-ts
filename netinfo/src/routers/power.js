'use strict'

export default router => {
  router.push({
    name: 'power',
    path: '/power',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'power.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: 'power-info',
        name: 'power.power-info',
        meta: {
          title: '权限信息管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/power/power-info'], resolve)
      },
      {
        path: 'power-query',
        name: 'power.power-query',
        meta: {
          title: '功能授权查询',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/power/power-query'], resolve)
      }
    ]
  })
}
