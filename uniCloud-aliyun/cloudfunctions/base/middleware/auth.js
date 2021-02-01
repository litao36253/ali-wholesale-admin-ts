const uniID = require('uni-id')

/**
 * 鉴权中间件
 * @param option object 中间件配置
 */
module.exports = (option) => {
  // uniID.init(option)
  return async (ctx, next) => {
    // 校验 token
    const auth = await uniID.checkToken(ctx.event.uniIdToken)

    if (auth.code) {
      ctx.throw(10001, `${auth.code}, ${auth.message}`)
    }

    ctx.auth = auth

    await next()
  }
}
