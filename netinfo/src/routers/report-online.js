'use strict'

export default router => {
  router.push({
    name: 'reportOnline',
    path: '/report-online',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'reportOnline.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'reportOnline.index',
        meta: {
          title: '在线报表',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
