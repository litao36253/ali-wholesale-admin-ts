'use strict'

export default router => {
  router.push({
    name: 'infoService',
    path: '/info-service',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'infoService.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'infoService.index',
        meta: {
          title: '信息服务管理',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
