import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const modules = {}
const requireContext = require.context('.', true, /^\.\/.*\/index\.js$/)
requireContext.keys().forEach(key => {
  const mod = requireContext(key)
  modules[key.slice(2, -9)] = mod.__esModule && mod.default ? mod.default : mod
})

export default new Vuex.Store({
  modules,
  strict: true
})
