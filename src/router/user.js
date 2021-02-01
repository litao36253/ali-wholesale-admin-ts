export default {
  path: '/user',
  name: 'user',
  meta: {
    hideInMenu: true // 不显示在系统菜单中
  },
  redirect: '/user/login',
  component: () => import('@/layout/user-layout/user-layout.vue'),
  children: [
    {
      path: '/user/login',
      name: 'user.login',
      meta: {
        authCheck: false
      },
      component: () => import('@/views/user/login.vue')
    },
    {
      path: '/user/register',
      name: 'user.register',
      meta: {
        authCheck: false
      },
      component: () => import('@/views/user/register.vue')
    }
  ]
}
