const Schema = require('async-validator').default

/**
 * 校验中间件，将会在ctx上添加一个 validate 方法，该方法会对 ctx.data 进行校验，接收对 ctx.data 的描述作为参数
 * @param options object 中间件配置
 */
module.exports = (options) => {
  return async (ctx, next) => {
    ctx.validate = async (descriptor) => {
      const validator = new Schema(descriptor)
      return await validator.validate(ctx.data, options).catch(result => {
        ctx.throw(10000, result.errors)
      })
    }
    await next()
  }
}
