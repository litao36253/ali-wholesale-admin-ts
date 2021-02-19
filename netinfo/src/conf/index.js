'use strict'

// http接口地址（类型）根路径
export const API = {
  // 开发环境
  development: {
    DEFAULT: process.env.BASE_URL,
    DEMO: '/api',
    SOCKET: '',
    IMR: '/imr',
    MAIL: '/MailService',
    CMS: '/cmsService',
    UCC: '/ucc_server' // 后台服务的根目录
    // NJDF_AJAX: '/njdf_ajax', // 通过 $ajaxRequest 访问接口的地址
    // NJDF_EXPORT: '/njdf_export', // 后台导出国际化文件等的路径
    // NJDF_IMPORT: '/njdf_import' // 导入文件路径
  },
  // 生产环境
  production: {
    DEFAULT: process.env.BASE_URL,
    DEMO: '/api',
    SOCKET: '',
    IMR: '/imr',
    MAIL: '/MailService',
    CMS: '/cmsService',
    UCC: '/ucc_server'
  }
}

// 项目语言配置
export const language = {
  // 默认语言
  default: 'zh_CN',
  // 支持语言
  package: ['zh_CN', 'en_US'],
  // 语言别名
  alias: {
    zh_CN: '中文简体',
    zh_TW: '中文繁体',
    ar_AE: 'Arabic',
    de_DE: 'Dansk',
    en_US: 'English',
    es_ES: 'Español',
    fr_FR: 'Français',
    ja_JP: '日本語',
    ko_KR: '대한민국 - 한국어',
    ru_RU: 'русский язык'
  },
  // 语言包数据
  data: {
    zh_CN: 'zh_CN.json',
    zh_TW: 'zh_TW.json',
    ar_AE: 'ar_AE.json',
    de_DE: 'de_DE.json',
    en_US: 'en_US.json',
    es_ES: 'es_ES.json',
    fr_FR: 'fr_FR.json',
    ja_JP: 'ja_JP.json',
    ko_KR: 'ko_KR.json',
    ru_RU: 'ru_RU.json'
  }
}
