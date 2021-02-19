'use strict'

import * as config from '@/conf/'
import { mapState } from 'vuex'
import * as TYPES from '@/stores/common/types'
import * as UtilLanguage from '@/utils/language'

export default {
  computed: {
    ...mapState({
      bomHistory: state => state.common.bomHistory,
      currentRouter: state => state.route,
      language: state => state.common.language,
      languageConfig: () => config.language
    })
  },
  data () {
    return {
      thisRouter: this.$router.currentRoute
    }
  },
  watch: {
    // 监听路由，并做相应得处理
    $route: {
      handler: function (val, oldVal) {
        // 添加到历史记录
        !val.meta.ignoreSaveHistory && this.$store.commit(TYPES.M_BOM_HISTORY_ADD, {
          name: val.name,
          fullPath: val.fullPath,
          meta: val.meta
        })
      },
      // 深度观察监听
      deep: true
    },
    // 监听历史记录数据变化
    bomHistory: {
      handler: function (val, oldVal) {
        this.$store.commit(TYPES.M_BOM_HISTORY_ACTIVE_INDEX, this.currentRouter)
      },
      // 深度观察监听
      deep: true
    }
  },
  created () { // !!!!!!!!!!!!!! 暂时由于数据字典或系统参数等数据后台发生改变无法通知前端，故每次刷新界面时重新请求
    // if (!this.$store.state.common.roleList) {
    this.$store.dispatch(TYPES.A_ROLE_LIST)
    // }
    // if (!this.$store.state.common.dictList) {
    this.$store.dispatch(TYPES.A_DICT_LIST)
    // }
    // if (!this.$store.state.common.sysParam) {
    this.$store.dispatch(TYPES.A_SYS_PARAM)
    // }
  },
  mounted () {
    // 初始化历史标签当前高亮索引
    this.$store.commit(TYPES.M_BOM_HISTORY_ACTIVE_INDEX, this.$router.currentRoute)
    // 获取相关配置信息
  }
}
