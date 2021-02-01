import Vue from 'vue'
import App from './App.vue'
import './plugin/plugin'
import router from '@/router/router.ts'
import store from '@/store/store'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
