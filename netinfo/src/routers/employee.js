'use strict'

export default router => {
  router.push({
    name: 'employee',
    path: '/employee',
    meta: {
      ignoreAuth: true // 是否不需要验证权限
    },
    redirect: { name: 'employee.index' },
    component: resolve => require(['../views/template/layout/'], resolve),
    children: [
      {
        path: 'post',
        name: 'employee.post',
        meta: {
          title: '岗位管理',
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/employee/post'], resolve)
      },
      {
        path: 'role',
        name: 'employee.role',
        meta: {
          title: '角色信息管理',
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/employee/role'], resolve)
      },
      {
        path: 'employee-info',
        name: 'employee.employee-info',
        meta: {
          title: '员工资料管理',
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/employee/employee-info'], resolve)
      },
      {
        path: 'biz-grp',
        name: 'employee.biz-grp',
        meta: {
          title: '业务分组管理',
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/employee/biz-grp'], resolve)
      },
      {
        path: 'org',
        name: 'employee.org',
        meta: {
          title: '组织机构管理',
          ignoreAuth: false // 是否不需要验证权限
        },
        component: resolve => require(['../views/employee/org'], resolve)
      }
    ]
  })
}
