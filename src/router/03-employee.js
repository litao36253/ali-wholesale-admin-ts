export default {
  path: '/employee',
  redirect: '/employee',
  component: () => import('@/layout/home/home.vue'),
  meta: {
    title: '员工管理',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: '/employee/roles',
      name: 'employee.roles',
      meta: {
        title: '角色列表',
        // icon: 'el-icon-s-tools',
        keepAlive: true // 缓存路由组件
      },
      component: () => import('@/views/employee/roles/roles.vue')
    },
    {
      path: '/employee/member',
      name: 'employee.member',
      meta: {
        title: '员工列表',
        // icon: 'el-icon-s-tools',
        keepAlive: true // 缓存路由组件
      },
      component: () => import('@/views/employee/member/member.vue')
    }
  ]
}
