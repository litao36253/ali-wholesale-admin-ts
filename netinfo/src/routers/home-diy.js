'use strict'

export default router => {
  router.push({
    name: 'homeDiy',
    path: '/home-diy',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'homeDiy.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'homeDiy.index',
        meta: {
          title: '首页布局管理',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
