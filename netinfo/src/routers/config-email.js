'use strict'

export default router => {
  router.push({
    name: 'configEmail',
    path: '/config-email',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'configEmail.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'configEmail.index',
        meta: {
          title: '邮件配置管理',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
