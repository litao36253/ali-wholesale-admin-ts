import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ElRadioGroup from './el-radio-group.vue'

// Vue.use(ElementUI, { size: 'small' })
Vue.use(ElementUI)

Vue.component('el-radio-group', ElRadioGroup)