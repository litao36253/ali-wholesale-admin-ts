'use strict'

export default router => {
  router.push({
    name: 'system',
    path: '/system',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'system.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: 'interface',
        name: 'system.interface',
        meta: {
          title: '系统接口管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/interface'], resolve)
      },
      {
        path: 'dict',
        name: 'system.dict',
        meta: {
          title: '数据字典管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/dict'], resolve)
      },
      {
        path: 'sysparam',
        name: 'system.sysparam',
        meta: {
          title: '系统参数管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/sysparam'], resolve)
      },
      {
        path: 'lessee',
        name: 'system.lessee',
        meta: {
          title: '租户管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/lessee'], resolve)
      },
      {
        path: 'service',
        name: 'system.service',
        meta: {
          title: '系统服务管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/service'], resolve)
      },
      {
        path: 'menu',
        name: 'system.menu',
        meta: {
          title: '系统菜单管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/menu'], resolve)
      },
      {
        path: 'service-query',
        name: 'system.service-query',
        meta: {
          title: '系统服务流水查询',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/service-query'], resolve)
      },
      {
        path: 'timing-task',
        name: 'system.timing-task',
        meta: {
          title: '定时任务管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/timing-task'], resolve)
      },
      {
        path: 'trigger',
        name: 'system.trigger',
        meta: {
          title: '触发器管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/trigger'], resolve)
      },
      {
        path: 'i18n',
        name: 'system.i18n',
        meta: {
          title: '国际化管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/i18n'], resolve)
      },
      {
        path: 'logger',
        name: 'system.logger',
        meta: {
          title: '日志下载管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/logger'], resolve)
      },
      {
        path: 'notice',
        name: 'system.notice',
        meta: {
          title: '系统公告管理',
          // keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/notice'], resolve)
      },
      {
        path: 'setting',
        name: 'system.setting',
        meta: {
          title: '系统设置',
          keepAlive: false, // 切换路由是否不销毁原来的组件,默认为不销毁
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/system/setting'], resolve)
      }
    ]
  })
}
