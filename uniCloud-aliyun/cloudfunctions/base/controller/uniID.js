const { Controller } = require('uni-cloud-router')
const uniID = require('uni-id')

module.exports = class uniIDController extends Controller { 
  // 用户登录
  async login () {
    await this.ctx.validate({
      username: {
        required: true,
        type: 'string',
        max: 20
      },
      password: {
        required: true,
        type: 'string',
        min: 6,
        max: 99
      }
    })
    return await this.service.sUniID.login()
  }

  // 用户注册
  async register () {
    await this.ctx.validate({
      username: {
        required: true,
        type: 'string',
        max: 20
      },
      password: {
        required: true,
        type: 'string',
        min: 6
      }
    })

    return await this.service.sUniID.register()
  }

  // 校验token
  async checkToken () {
    return await uniID.checkToken(this.ctx.event.uniIdToken)
  }

  // 登出
  async logout () {
    console.log('this.ctx.event.uniIdToken', this.ctx.event.uniIdToken)
    return await uniID.logout(this.ctx.event.uniIdToken)
  }
}
