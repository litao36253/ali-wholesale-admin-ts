'use strict'

export default router => {
  router.push({
    name: 'configOnline',
    path: '/config-online',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'configOnline.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'configOnline.index',
        meta: {
          title: '在线配置管理',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
