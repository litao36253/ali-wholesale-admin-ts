'use strict'

export default router => {
  router.push({
    name: 'index',
    path: '/',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'dashboard' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          title: '首页',
          ignoreAuth: false, // 是否不需要验证权限
          ignoreSaveHistory: true, // 是否不需要将此路由加入历史记录
          eventDeleteDisabled: true // 不能删除
        },
        component: resolve => require(['../views/home/'], resolve)
      }
    ]
  })
}
