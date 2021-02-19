'use strict'

import locale from 'element-ui/lib/locale/lang/en'

// 通用报错信息
const DEFAULT_ERROR =
  'The system is busy. Please try again later. If you need help, please call 400-8888-888'

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
    3500: '您是非担保酒店，该功能无法使用，请重新登录',
    1104: '图片验证码错误',
    1103: '图形验证码已被使用',
    1105: '图形验证码已过期'
  },
  app: {
    systemTitle: 'UCC System',
    languageChangeTipSuccess: 'switch language success',
    languageChangeTipError: 'switch language fail'
  },
  router: { // 路由的国际化词条
    '星网信通': 'Netinfo',
    '首页': 'Home page',
    '岗位管理': 'Post Management',
    '角色信息管理': 'Role Management',
    '员工资料管理': 'Employee Management',
    '业务分组管理': 'Business Group Management',
    '组织机构管理': 'Organizational Management',
    '404': 'Not Found',
    '401': 'No privileges',
    '流水查询': 'Pipeline Query',
    '登陆': 'Login',
    '权限信息管理': 'Authority Management',
    '功能授权查询': 'Functional Authorization Query',
    '系统接口管理': 'System Interface Management',
    '数据字典管理': 'Data dictionary management',
    '系统参数管理': 'System parameter management',
    '租户管理': 'Tenant management',
    '系统服务管理': 'System Service Management',
    '系统菜单管理': 'System menu management',
    '系统服务流水查询': 'System Service Pipeline Query',
    '定时任务管理': 'Timing Task Management',
    '触发器管理': 'Flip-flop management',
    '国际化管理': 'Internationalization Management',
    '日志下载管理': 'Log Download Management',
    '系统公告管理': 'System Announcement Management',
    '系统设置': 'System Setting',
    'datagrid示例': 'Datagrid Example',
    'demo': 'Example',
    'radio(单选框)': 'Radio(Single Choose Box)',
    'checkbox(复选框)': 'Checkbox(Multiple Choose Box)',
    'combobox(组合下拉框)': 'Combobox(Group Combbox)',
    'auto-complete(自动补全)': 'Auto-complete',
    'datagrid列表': 'Datagrid',
    'combogrid列表': 'Combogrid',
    'form表单': 'Form',
    'editor富文本': 'Editor',
    'upload上传组件': 'Upload',
    '树形组件': 'Tree',
    '机构选择框': 'Org select panel'
  },
  demo: {
    directives: 'directive - count down',
    filters: 'filters - format time',
    utils: 'utils ',
    http: 'http - get user info',
    localstorage: 'localstorage - i18n',
    componentsEvent: 'component - event',
    componentsVuex: 'component - vuex',
    radioDemo: 'radio demo',
    checkboxDemo: 'checkbox demo',
    datagridDemo1: 'datagrid 示例1'
  },
  ...locale
}
