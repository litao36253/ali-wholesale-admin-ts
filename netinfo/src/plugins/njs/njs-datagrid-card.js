import Vue from 'vue'
import plugin from './components/c-njs-datagrid/c-njs-datagrid-card'

plugin.install = function (Vue) {
  Vue.component(plugin.name, plugin)
}

Vue.use(plugin)
