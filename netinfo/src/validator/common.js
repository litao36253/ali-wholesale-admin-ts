'use strict'

// 邮箱校验器
export let validateEmail = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    if (/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,6}$/.test(value)) {
      callback()
    } else {
      callback(new Error(window.app.$t('请输入正确的邮箱地址')))
    }
  }
}

// 联系电话校验器（包含手机号、座机号、短号等）
export let validateTelephone = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    if (/^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9}))$/.test(value)) { // 验证手机
      callback()
    } else if (/^(([0\+]\d{2,3}-?)?(0\d{2,3})-?)?(\d{7,8})(-(\d{3,}))?$/.test(value)) { // 验证座机
      callback()
    } else if (value.length == 5 && /^\d{5}$/g.exec(value)) { // 验证5位数字号码
      callback()
    } else if (value.length == 3 && /^\d{3}$/g.exec(value)) { // 验证3位数字号码
      callback()
    } else if (value.length == 10 && /^\d{10}$/g.exec(value)) { // 验证10位数字号码
      callback()
    } else {
      callback(new Error(window.app.$t('请输入正确的联系号码')))
    }
  }
}

// 手机号码校验器
export let validateMobile = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    if (/^([+]?[\d]{1,3}-|[ ])?((13[0-9]{9})|(18[0-9]{9})|(15[0-9]{9})|(16[0-9]{9})|(14[0-9]{9})|(17[0-9]{9}))$/.test(value)) {
      callback()
    } else {
      callback(new Error(window.app.$t('请输入正确的手机号码')))
    }
  }
}

// 只能输入英文字母、数字、下划线
export let validateEnNumUdl = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    if (/^[A-Za-z0-9_]+$/.test(value)) {
      callback()
    } else {
      callback(new Error(window.app.$t('只能输入英文字母、数字、下划线')))
    }
  }
}

// 只能输入数字，且可通过 max 和 min 限制大小, 通过 int:true 限制必须为整数
export let validateNumber = (rule, value, callback) => {
  if (value === '') {
    callback()
  } else {
    if (/^\d+(\.\d+)?$/.test(value)) {
      let val = parseFloat(value)
      let result = {
        min: {
          result: false,
          msg: window.app.$t('最小输入 ') + rule.min
        },
        max: {
          result: false,
          msg: window.app.$t('最大输入 ') + rule.max
        },
        int: {
          result: false,
          msg: window.app.$t('请输入数字')
        }
      }
      if (rule.min !== undefined) {
        val >= rule.min ? result.min.result = true : callback(new Error(result.min.msg))
      }
      if (rule.max !== undefined) {
        val <= rule.max ? result.max.result = true : callback(new Error(result.max.msg))
      }
      if (rule.int) {
        /^\d+$/.test(value) ? result.int.result = true : callback(new Error(result.int.msg))
      }
      result.min && result.max && result.int && callback()
    } else {
      callback(new Error(window.app.$t('请输入数字')))
    }
  }
}
