import Vue from 'vue'
import App from './App.vue'
import './plugin/plugin'
import './components/global/global'
import router from '@/router/router'
import store from '@/store/store'
import '@/style/style.scss'

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
