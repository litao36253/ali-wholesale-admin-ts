const errorMap = {
  10000: '请求入参不合法',
  10001: 'token已失效',
  10100: '用户名或密码错误'
}

module.exports = (options) => {
  return async (ctx, next) => {
    const originThrow = ctx.throw
    ctx.throw = (code, message) => {
      return originThrow(code, message || errorMap[code] || '服务出错了，请稍后再试')
    }

    await next()
  }
}
