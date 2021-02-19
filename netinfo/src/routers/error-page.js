'use strict'

export default router => {
  router.push({
    name: '404',
    path: '/404',
    meta: {
      title: '404', // 文档标题
      ignoreAuth: true, // 是否不需要验证权限
      ignoreSaveHistory: true // 是否不需要将此路由加入历史记录
    },
    component: resolve => require(['../views/error-page/404'], resolve)
  })
  router.push({
    name: '401',
    path: '/401',
    meta: {
      title: '401', // 文档标题
      ignoreAuth: true, // 是否不需要验证权限
      ignoreSaveHistory: true // 是否不需要将此路由加入历史记录
    },
    component: resolve => require(['../views/error-page/401'], resolve)
  })
}
