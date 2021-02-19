'use strict'

export default router => {
  router.push({
    name: 'quality',
    path: '/quality',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'quality.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'quality.index',
        meta: {
          title: '质检管理',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
