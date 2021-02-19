'use strict'

export default router => {
  router.push({
    name: 'configCommon',
    path: '/config-common',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'configCommon.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'configCommon.index',
        meta: {
          title: '通用配置管理',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
