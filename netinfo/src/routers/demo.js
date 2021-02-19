'use strict'

export default router => {
  router.push({
    name: 'demo',
    path: '/demo',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'demo.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        name: 'demo.index',
        path: 'index',
        meta: {
          title: 'demo',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/'], resolve)
      },
      {
        name: 'demo.radio',
        path: 'radio',
        meta: {
          title: 'radio(单选框)',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/radio'], resolve)
      },
      {
        name: 'demo.checkbox',
        path: 'checkbox',
        meta: {
          title: 'checkbox(复选框)',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/checkbox'], resolve)
      },
      {
        name: 'demo.combobox',
        path: 'combobox',
        meta: {
          title: 'combobox(组合下拉框)',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/combobox'], resolve)
      },
      {
        name: 'demo.auto-complete',
        path: 'auto-complete',
        meta: {
          title: 'auto-complete(自动补全)',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/auto-complete'], resolve)
      },
      {
        name: 'demo.datagrid',
        path: 'datagrid',
        meta: {
          title: 'datagrid列表',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/datagrid'], resolve)
      },
      {
        name: 'demo.combogrid',
        path: 'combogrid',
        meta: {
          title: 'combogrid列表',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/combogrid'], resolve)
      },
      {
        name: 'demo.form',
        path: 'form',
        meta: {
          title: 'form表单',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/form'], resolve)
      },
      {
        name: 'demo.editor',
        path: 'editor',
        meta: {
          title: 'editor富文本',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/editor'], resolve)
      },
      {
        name: 'demo.upload',
        path: 'upload',
        meta: {
          title: 'upload上传组件',
          ignoreAuth: true // 是否不需要验证权限
        },
        component: resolve => require(['../views/demo/upload'], resolve)
      },
      {
        name: 'demo.tree',
        path: 'tree',
        meta: {
          title: '树形组件',
          ignoreAuth: true // 是否开放访问
        },
        component: resolve => require(['../views/demo/tree'], resolve)
      },
      {
        name: 'demo.select-org',
        path: 'select-org',
        meta: {
          title: '机构选择框',
          ignoreAuth: true // 是否开放访问
        },
        component: resolve => require(['../views/demo/select-org'], resolve)
      },
      {
        name: 'demo.select-user',
        path: 'select-user',
        meta: {
          title: '员工选择示例',
          ignoreAuth: true // 是否开放访问
        },
        component: resolve => require(['../views/demo/select-user'], resolve)
      },
      {
        name: 'demo.i18n',
        path: 'i18n',
        meta: {
          title: 'i18n国际化',
          ignoreAuth: true // 是否开放访问
        },
        component: resolve => require(['../views/demo/i18n'], resolve)
      }
    ]
  })
}
