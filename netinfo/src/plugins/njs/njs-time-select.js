import Vue from 'vue'
import { TimeSelect } from 'element-ui'
TimeSelect.name = 'njs-time-select'
TimeSelect.props.valueFormat = {
  type: String,
  default: 'HH:mm:ss'
}
Vue.use(TimeSelect)
