'use strict'
import * as config from '@/conf/'
import { mapState } from 'vuex'
import * as UtilLanguage from '@/utils/language'

export default {
  computed: {
    ...mapState({
      language (state) {
        return state.common.language
      },
      languageConfig () {
        return config.language
      }
    })
  },
  data () {
    return {}
  },
  watch: {
    // 监听语言
    language (val, oldVal) {
      // console.log(val)
    }
  },
  beforeCreate () {},
  created () {},
  mounted () {},
  updated () {},
  methods: {
    // 语言切换
    changeLanguage (_lang, _doNotMessage) {
      UtilLanguage.changeLanguage(this, _lang, _doNotMessage)
    }
  }
}
