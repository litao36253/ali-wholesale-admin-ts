<template lang="pug">
  .container-wrap
    .box-body
      njs-datagrid(
        datagrid-id="system_serviceQuery_P0106401"
        ref="datagrid"
        :title="$t('系统服务流水查询')"
        :subheading="$t('用户管理系统中的接口，主要用于开发人员查看系统服务操作日志。')"
        hide-head
        auto-loading
        service="P0106401"
        :default-query="{QUERY_TYPE:'1', BEGIN_END_DATE: BEGIN_END_DATE}"
        :rules="rules"
      )
        njs-column(prop="REC_NO" :label="$t('流水号')" sortable min-width="50")
        njs-column(prop="SERVICE_CODE" :label="$t('服务代码')" show-overflow-tooltip sortable min-width="100")
        njs-column(prop="SERVICE_NAME" :label="$t('服务名称')" min-width="120")
        njs-column(prop="OP_USER" :label="$t('操作人')" min-width="50" )
        njs-column(prop="OP_SITE" :label="$t('操作地址')" min-width="120")
        njs-column(prop="OPT_PAR" :label="$t('操作参数')" min-width="240")
        njs-column(prop="EXEC_DATE" :label="$t('操作时间')" min-width="140" show-overflow-tooltip)
        <!-----------     列配置  end ---------------------------------------------------------- -->
        <!-----------     常用查询条件  start ---------------------------------------------------------- -->
        template(slot="more-used-query" slot-scope="{ formData }")
          njs-form-item(prop="OP_USER")
            nbs-select-user(v-model="formData.OP_USER" :placeholder="$t('请输操作员或操作员名称')")
          njs-form-item(prop="BEGIN_END_DATE")
            njs-date-picker(v-model="formData.BEGIN_END_DATE" type="daterange" value-format="yyyy-MM-dd" :start-placeholder="$t('请选择开始日期')" :end-placeholder="$t('请选择截止日期')" :clearable="false" @change="$refs.datagrid.refresh()" :picker-options="computedPickerOptions" unlink-panels)
          njs-datagrid-search(v-model="formData" :selectItems="selectItems" @select-change="queryTypeChange")
        <!-----------     常用查询条件  start ---------------------------------------------------------- -->
</template>

<script>
import { validateEnNumUdl } from '@/validator/common'
import { formatDate } from '@/utils/utils'
const SERVICE_NAME_RULE = [
  { max: 60, message: window.app.$t('服务名称不可超过 60'), trigger: 'change' }
]
const SERVICE_CODE_RULE = [
  { validator: validateEnNumUdl, trigger: 'change' },
  { max: 20, message: window.app.$t('服务代码长度最长为 20'), trigger: 'change' }
]
export default {
  name: 'system.service-query', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      rules: {
        OP_USER: [
          { max: 60, message: this.$t('输入长度不可超过 60'), trigger: 'change' }
        ],
        QUERY_TEXT: { max: 60, message: this.$t('输入长度不可超过 60'), trigger: 'change' },
        BEGIN_END_DATE: { required: true, message: this.$t('请选择日期范围'), trigger: 'change' }
      },
      selectItems: [
        { label: this.$t('全部'), value: '1', placeholder: this.$t('请输入服务代码或服务名称') },
        { label: this.$t('服务代码'), value: '2', placeholder: this.$t('请输入服务代码') },
        { label: this.$t('服务名称'), value: '3', placeholder: this.$t('请输入服务名称') }
      ],
      minDate: null
    }
  },
  methods: {
    // 查询类型发生变化时
    queryTypeChange (val) {
      if (val === '1') { // 全部
        this.rules.QUERY_TEXT = SERVICE_NAME_RULE
      } else if (val === '2') { // 服务代码
        this.rules.QUERY_TEXT = SERVICE_CODE_RULE
      } else if (val === '3') { // 服务名称
        this.rules.QUERY_TEXT = SERVICE_NAME_RULE
      }
    }
  },
  computed: {
    computedPickerOptions () {
      let _this = this
      return {
        shortcuts: [{
          text: this.$t('最近一周'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            _this.minDate = null
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (time) {
          let getTime = time.getTime()
          let timeAfterNow = getTime > Date.now()
          if (timeAfterNow) {
            return timeAfterNow
          }
          if (_this.minDate) {
            const times = 86400000 * 6// 6天的毫秒数
            let curSelectTime = _this.minDate.getTime()
            let before = curSelectTime - times// 前一周毫秒数
            let after = curSelectTime + times// 后一周毫秒数
            return getTime > after || getTime < before
          }
        },
        onPick ({ maxDate, minDate }) {
          if (!maxDate) {
            _this.minDate = minDate
          } else {
            _this.minDate = null
          }
        }
      }
    },
    BEGIN_END_DATE () { // 设置默认查询范围为近一周
      let now = new Date()
      let start = new Date(now.getTime() - 24 * 60 * 60000 * 6)
      return `${formatDate(start, 'yyyy-MM-dd')},${formatDate(now, 'yyyy-MM-dd')}`
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
