import Vue from 'vue'
import plugin from './components/c-njs-checkbox-group'

plugin.install = function (Vue) {
  Vue.component(plugin.name, plugin)
}

Vue.use(plugin)
