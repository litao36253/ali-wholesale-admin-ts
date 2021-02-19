'use strict'

export default router => {
  router.push({
    name: 'configVoice',
    path: '/config-voice',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'configVoice.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'configVoice.index',
        meta: {
          title: '语音配置管理',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
