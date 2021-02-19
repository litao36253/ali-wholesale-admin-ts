import Vue from 'vue'
import { TimePicker } from 'element-ui'
TimePicker.name = 'njs-time-picker'
TimePicker.props.valueFormat = {
  type: String,
  default: 'HH:mm:ss'
}
Vue.use(TimePicker)
