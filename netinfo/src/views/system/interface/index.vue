<template lang="pug">
  njs-datagrid(
    datagrid-id="system_interface_P0107401"
    ref="datagrid"
    :title="$t('系统接口管理')"
    :subheading="$t('用户管理系统中的接口，主要用于开发人员查看系统接口配置。')"
    hide-head
    service="P0107401"
    :rules="rules"
    :auto-loading="true"
    :pagination="false"
  )
    <!-----------     列配置  start ---------------------------------------------------------- -->
    njs-column(prop="SERVICE_CODE" :label="$t('接口编号')" sortable min-width="10")
    njs-column(prop="SERVICE_NAME" :label="$t('接口名称')" show-overflow-tooltip sortable min-width="20")
    njs-column(prop="SERVICE_SOAP" :label="$t('webservice是否启动')" min-width="14" dict="SERVICE_SOAP")
    njs-column(prop="SERVICE_TYPE" :label="$t('是否开启事务')" min-width="10" dict="SERVICE_TYPE")
    njs-column(prop="BUSINESS_TYPE" :label="$t('配置类型')" min-width="10" dict="BUSINESS_TYPE")
    njs-column(prop="PAGE_TYPE" :label="$t('是否分页')" min-width="10" dict="PAGE_TYPE")
    njs-column(prop="BUSINESS_CODE" :label="$t('配置编码')" min-width="20" show-overflow-tooltip)
    njs-column(prop="BUSINESS_NAME" :label="$t('配置名称')" min-width="20" show-overflow-tooltip)
    <!-----------     列配置  end ---------------------------------------------------------- -->

    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
    template(slot="more-used-query" slot-scope="{ formData }")
      njs-form-item(prop="SERVICE_CODE")
        njs-input(v-model="formData.SERVICE_CODE" :placeholder="$t('请输入接口编号')" clearable @keydown.13.native="$refs.datagrid.refresh()" @change="handleQueryChcange")
      njs-form-item(prop="SERVICE_NAME")
        njs-input(v-model="formData.SERVICE_NAME" :placeholder="$t('请输入接口名称')" clearable @keydown.native.13="$refs.datagrid.refresh()" @change="handleQueryChcange")
      njs-form-item
        njs-button(@click="$refs.datagrid.refresh()" type="primary") {{ $t('查询') }}
    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
</template>

<script>
export default {
  name: 'system.dict', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      rules: {
        SERVICE_CODE: [
          { max: 8, message: this.$t('接口编号长度最长为 8'), trigger: 'change' }
        ],
        SERVICE_NAME: [
          { max: 60, message: this.$t('输入长度不可超过 60'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    handleQueryChcange (val) {
      if (val === '') {
        this.$refs.datagrid.refresh()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
