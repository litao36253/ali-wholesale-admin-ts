/*
*  引入业务组件插件
*  以 nbs- 开头的组件为业务组件，系统中所有业务组件都通过本文件引入，并且在本文件中要对相应组件有简单说明。
* */

import Vue from 'vue'
import selectTrigger from './components/select-trigger'
import selectInterface from './components/select-interface'
import selectLessee from './components/select-lessee'
import selectDict from './components/select-dict'
import selectOrg from './components/select-org'
import selectUser from './components/select-user'

// 注册全局业务组件的方法
function registerBusinessComponents (plugin) {
  plugin.install = function (Vue) {
    Vue.component(plugin.name, plugin)
  }
  Vue.use(plugin)
}

/*
*  组件名称：选择触发器
*  组件功能：用于选择在触发器管理界面维护好的触发器
*  依赖的基础组件：njs-combogrid
* */
registerBusinessComponents(selectTrigger)

/*
*  组件名称：选择触发系统接口
*  组件功能：用于选择在系统接口管理界面维护好的系统接口
*  依赖的基础组件：njs-combogrid
* */
registerBusinessComponents(selectInterface)

/*
*  组件名称：选择租户
*  组件功能：用于选择在租户管理界面维护好的租户
*  依赖的基础组件：njs-combogrid
* */
registerBusinessComponents(selectLessee)

/*
*  组件名称：选择数据字典
*  组件功能：用于选择在数据字典管理界面维护好的数据字典
*  依赖的基础组件：njs-combogrid
* */
registerBusinessComponents(selectDict)

/*
*  组件名称：选择组织机构
*  组件功能：用于选择组织机构
*  依赖的基础组件：njs-cascader
* */
registerBusinessComponents(selectOrg)

/*
*  组件名称：选择用户
*  组件功能：用于选择系统里员工资料管理中维护的员工
*  依赖的基础组件：njs-auto-complete
* */
registerBusinessComponents(selectUser)
