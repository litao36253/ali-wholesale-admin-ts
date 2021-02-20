import Vue from 'vue'
import jql from './server/jql/jql'
import * as utils from './utils/utils'
declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-unused-vars
  interface Vue {
    readonly $jql: typeof jql
    readonly $utils: typeof utils
  }
}
