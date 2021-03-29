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
    ctx.body = {
      token: auth.token, // 新增于uni-id 1.1.7版本，用户token快要过期时，新生成的token，只有在config内配置了tokenExpiresThreshold的值时才会有此行为
      tokenExpired: auth.tokenExpired, // 新增于uni-id 1.1.7版本，新token的过期时间
      ...ctx.body
    }
  }
}
