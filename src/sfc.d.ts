import Vue from 'vue'
import jql from './server/jql/jql'

declare module '*.vue' {
  export default Vue
}

declare module 'vue/types/vue' {
  // eslint-disable-next-line no-unused-vars
  interface Vue {
    readonly $jql: typeof jql
  }
}
