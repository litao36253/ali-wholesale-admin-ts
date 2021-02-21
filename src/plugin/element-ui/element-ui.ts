import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import ElRadioGroup from './el-radio-group.vue'
import ElCheckboxGroup from './el-checkbox-group.vue'
import ElSelect from './el-select.vue'

// Vue.use(ElementUI, { size: 'small' })
Vue.use(ElementUI)

Vue.component('el-radio-group', ElRadioGroup)
Vue.component('el-checkbox-group', ElCheckboxGroup)
Vue.component('el-select', ElSelect)
