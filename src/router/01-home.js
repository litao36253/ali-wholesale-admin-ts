export default {
  path: '/',
  redirect: '/index',
  component: () => import('@/layout/home/home.vue'),
  meta: {
    title: '首页',
    icon: 'el-icon-sell'
  },
  children: [
    {
      path: '/index',
      name: 'index',
      meta: {
        hideInMenu: true // 不显示在系统菜单中
      },
      component: () => import('@/views/home/home.vue')
    }
  ]
}
