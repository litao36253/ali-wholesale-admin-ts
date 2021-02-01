// 动态载入所有插件
const pluginModels = require.context('.', false, /^\.\/(?!plugin\.js)[^/]+\.js/)
pluginModels.keys().forEach(item => {
  pluginModels(item)
})
