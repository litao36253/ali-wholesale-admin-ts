const auth = require('./middleware/auth')
const validate = require('./middleware/validate')
const throwError = require('./middleware/throw')

module.exports = {
  debug: true, // 调试模式时，将返回 stack 错误堆栈
  baseDir: __dirname, // 必选，应用根目录
  middleware: [ // 自定义中间件
    [
      auth(),
      { enable: true, ignore: /^uniID\/(login|register)$/ }
    ],
    [
      validate(),
      { enable: true }
    ],
    [
      throwError(),
      { enable: true }
    ]
  ]
}
