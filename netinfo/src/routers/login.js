'use strict'

export default router => {
  router.push({
    name: 'login',
    path: '/login',
    meta: {
      title: '登陆', // 文档标题
      ignoreAuth: true, // 是否不需要验证权限
      ignoreSaveHistory: true // 是否不需要将此路由加入历史记录
    },
    component: resolve => require(['../views/login/'], resolve)
  })
}
