export default {
  path: '/system',
  redirect: '/system',
  component: () => import('@/layout/home/home.vue'),
  meta: {
    title: '系统管理',
    icon: 'el-icon-s-tools'
  },
  children: [
    // {
    //   path: '/system/menu',
    //   name: 'system.menu',
    //   meta: {
    //     title: '菜单管理',
    //     keepAlive: true // 缓存路由组件
    //   },
    //   component: () => import('@/views/system/menu/menu.vue')
    // },
    {
      path: '/system/dict',
      name: 'system.dict',
      meta: {
        title: '数据字典管理',
        // icon: 'el-icon-s-tools',
        keepAlive: true // 缓存路由组件
      },
      component: () => import('@/views/system/dict/dict.vue')
    },
    {
      path: '/system/source',
      name: 'system.source',
      meta: {
        title: '素材管理',
        // icon: 'el-icon-s-tools',
        keepAlive: true // 缓存路由组件
      },
      component: () => import('@/views/system/source/source.vue')
    }
  ]
}
