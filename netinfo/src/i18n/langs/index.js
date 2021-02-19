'use strict'

import { language } from '@/conf/'
import storage from '@/commons/storage'

// 语言基础包
import enUS from './en_US'
import zhCN from './zh_CN'

const MESSAGES = {
  zh_CN: zhCN,
  en_US: enUS
}
// 当前语言扩展包
let extendJson = require('@data/i18n/' + language.data[storage.lang || language.default])
MESSAGES[storage.lang || language.default] = { ...MESSAGES[storage.lang || language.default], ...extendJson }
MESSAGES[storage.lang || language.default].extend = true // 标记加载完成了扩展语言包
// 将语言配置包存储到本地，方便其他组件调用
storage.langPackage = MESSAGES
// 储存默认http状态提示语
storage.httpStatus = MESSAGES[storage.lang || language.default].status

export default MESSAGES
