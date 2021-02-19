'use strict'
import * as config from '@/conf/'
import storage from '@/commons/storage'
import http from '@/commons/http'
import * as TYPES from '@/stores/common/types'
import i18n from '../i18n'

// 获取语言包
export const changeLanguage = (_$vue, _lang) => {
  const vm = _$vue
  const THIS_MESSAGES = storage.langPackage[_lang]
  if (THIS_MESSAGES.extend) { // 判断是否加载完成了扩展语言包
    setLocaleData(_$vue, _lang, THIS_MESSAGES)
    return false
  }
  http({
    mask: true,
    url: 'data/i18n/' + config.language.data[_lang]
  })
    .then(res => {
      setLocaleData(_$vue, _lang, res.data)
    })
    .catch(errCatch => {
      vm.$message({
        message: vm.$i18n.t('app')['languageChangeTipError'],
        type: 'error'
      })
    })
}

// 将语言包挂在到到vue、本地存储
export const setLocaleData = (_$vue, _lang, _messages) => {
  const vm = _$vue
  let THIS_MESSAGES = vm.$i18n.getLocaleMessage(_lang)
  let storageLangPackage = storage.langPackage
  vm.$i18n.locale = _lang
  THIS_MESSAGES.extend = true // 标记加载完成了扩展语言包
  THIS_MESSAGES = { ...THIS_MESSAGES, ..._messages }
  storageLangPackage[_lang].extend = true // 标记加载完成了扩展语言包
  storageLangPackage[_lang] = { ...storageLangPackage[_lang], ..._messages }
  storage.langPackage = storageLangPackage
  storage.httpStatus = vm.$i18n.t('status')
  vm.$i18n.setLocaleMessage(_lang, THIS_MESSAGES)
  vm.$store.commit(TYPES.M_COMMON_LANGUAGE_CHANGE, _lang)
  document.title = vm.$i18n.t('router')[vm.$route.meta.title] || vm.$i18n.t('router')['星网信通'] // 设置文档标题
  vm.$nextTick(() => {
    vm.$message({
      message: vm.$i18n.t('app')['languageChangeTipSuccess'],
      type: 'success'
    })
  })
}
