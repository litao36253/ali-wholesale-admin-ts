// 动态载入所有插件
const pluginModels = require.context('.', false, /^\.\/(?!plugin\.ts)[^/]+\.ts/)
pluginModels.keys().forEach(item => {
  pluginModels(item)
})
