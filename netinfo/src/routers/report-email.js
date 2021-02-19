'use strict'

export default router => {
  router.push({
    name: 'reportEmail',
    path: '/report-email',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'reportEmail.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'reportEmail.index',
        meta: {
          title: '邮件报表',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
