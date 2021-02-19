import Vue from 'vue'
import DatePicker from './components/c-njs-date-picker'

DatePicker.install = function (Vue) {
  Vue.component(DatePicker.name, DatePicker)
}
Vue.use(DatePicker)
