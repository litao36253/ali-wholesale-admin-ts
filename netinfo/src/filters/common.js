'use strict'

import moment from 'moment'

export default {
  // 格式化时间
  dateFilter (val, format) {
    if (val === null || typeof val === 'undefined') {
      return val
    }
    return moment(val).format(format || 'YYYY-MM-DD')
  }
}
