'use strict'

export default router => {
  router.push({
    name: 'reportVoice',
    path: '/report-voice',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'reportVoice.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: '',
        name: 'reportVoice.index',
        meta: {
          title: '语音报表',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/coming-soon/'], resolve)
      }
    ]
  })
}
