import Vue from 'vue'
import App from './App.vue'
import './plugin/plugin'
import './components/global/global'
import jql from './server/jql/jql'
import router from '@/router/router'
import store from '@/store/store'
import '@/style/style.scss'

Object.defineProperty(Vue.prototype, '$jql', {
  get () {
    return jql
  }
})

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
