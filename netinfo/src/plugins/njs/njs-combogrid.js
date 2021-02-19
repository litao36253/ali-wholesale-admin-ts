import Vue from 'vue'
import plugin from './components/c-njs-combogrid'

plugin.install = function (Vue) {
  Vue.component(plugin.name, plugin)
}

Vue.use(plugin)
