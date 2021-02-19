'use strict'

import locale from 'element-ui/lib/locale/lang/zh-CN'

// 通用报错信息
const DEFAULT_ERROR = '系统繁忙，请稍后再试，如需帮助请联系星网信通'

export default {
  status: {
    DEFAULT_ERROR: DEFAULT_ERROR,
    404: '404 Not Found',
    500: DEFAULT_ERROR,
    700: DEFAULT_ERROR,
    1001: '服务API入口不存在',
    1002: '没有权限访问，请联系管理员',
    1011: '账号不存在，或者账号异常，请重新登录系统',
    1012: '账号被禁用',
    1013: '用户名或密码不匹配API网关',
    1101: '创建验证码失败',
    3500: '该功能无法使用，请重新登录',
    1104: '图片验证码错误',
    1103: '图形验证码已被使用',
    1105: '图形验证码已过期'
  },
  app: {
    systemTitle: 'UCC客服系统',
    languageChangeTipSuccess: '切换语言成功',
    languageChangeTipError: '切换语言失败，无法获取语言包'
  },
  router: { // 路由的国际化词条
    '星网信通': '星网信通',
    '首页': '首页',
    '岗位管理': '岗位管理',
    '角色信息管理': '角色信息管理',
    '员工资料管理': '员工资料管理',
    '业务分组管理': '业务分组管理',
    '组织机构管理': '组织机构管理',
    '404': '未找到页面',
    '401': '没有权限访问',
    '流水查询': '流水查询',
    '登陆': '登陆',
    '权限信息管理': '权限信息管理',
    '功能授权查询': '功能授权查询',
    '系统接口管理': '系统接口管理',
    '数据字典管理': '数据字典管理',
    '系统参数管理': '系统参数管理',
    '租户管理': '租户管理',
    '系统服务管理': '系统服务管理',
    '系统菜单管理': '系统菜单管理',
    '系统服务流水查询': '系统服务流水查询',
    '定时任务管理': '定时任务管理',
    '触发器管理': '触发器管理',
    '国际化管理': '国际化管理',
    '日志下载管理': '日志下载管理',
    '系统公告管理': '系统公告管理',
    '系统设置': '系统设置',
    'datagrid示例': 'datagrid示例',
    'demo': '示例',
    'radio(单选框)': 'radio(单选框)',
    'checkbox(复选框)': 'checkbox(复选框)',
    'combobox(组合下拉框)': 'combobox(组合下拉框)',
    'auto-complete(自动补全)': 'auto-complete(自动补全)',
    'datagrid列表': 'datagrid列表',
    'combogrid列表': 'combogrid列表',
    'form表单': 'form表单',
    'editor富文本': 'editor富文本',
    'upload上传组件': 'upload上传组件',
    '树形组件': '树形组件',
    '机构选择框': '机构选择框',
    'i18n国际化': 'i18n国际化',
    '员工选择示例': '员工选择示例'
  },
  demo: {
    directives: '指令 - 倒计时',
    filters: '过滤器 - 格式化时间',
    utils: '工具类',
    http: 'http请求 - 获取用户信息',
    localstorage: '本地存储 - 国际化',
    componentsEvent: '组件通信 - 简单',
    componentsVuex: '组件通信 - vuex',
    radioDemo: '单选框示例',
    checkboxDemo: '复选框示例',
    datagridDemo1: 'datagrid 示例1'
  },
  ...locale
}
