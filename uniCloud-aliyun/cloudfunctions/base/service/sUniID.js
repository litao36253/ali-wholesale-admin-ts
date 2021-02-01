const { Service } = require('uni-cloud-router')
const uniID = require('uni-id')
const getUuid = require('../utils/getUuid')

module.exports = class testService extends Service {
  // 用户登录
  async login () {
    const params = {
      username: this.ctx.data.username,
      password: this.ctx.data.password,
      needPermission: true, // 设置为true时会在checkToken时返回用户权限（permission）
      queryField: ['username', 'email', 'mobile']
    }
    const result = await uniID.login(params)

    if (result.code === 10101 || result.code === 10102) {
      this.throw(10100) // 用户名或密码错误
    }

    return result
  }

  // 用户注册
  async register () {
    const params = {
      username: this.ctx.data.username,
      password: this.ctx.data.password,
      needPermission: true,
      myInviteCode: getUuid()
    }
    const result = await uniID.register(params)

    return result
  }
}
