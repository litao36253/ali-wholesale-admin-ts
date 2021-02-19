'use strict'

export default router => {
  router.push({
    name: 'flowQuery',
    path: '/flow-query',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'flowQuery.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'flowQuery.index',
        meta: {
          title: '流水查询',
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
