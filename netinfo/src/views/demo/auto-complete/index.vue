<template lang="pug">
  .container-wrap.home-wrap
    .box-body
      .box-home-service(style="padding: 20px;")
        h5 基本用法（通过配置接口并指定值和描述的字段）
        .demo-con
          njs-auto-complete(
            v-model="val1"
            service="U0101400"
            search-key="ROLE_CODE"
            service-data-value="ROLE_CODE"
            service-data-label="ROLE_NAME"
          )
          | 选中了的值：{{ val1 }}

        h5 指定多个字段作为描述，并配置分隔符为“ && ”
        .demo-con
          njs-auto-complete(
            v-model="val2"
            service="U0101400"
            search-key="ROLE_NAME"
            service-data-value="ROLE_CODE"
            service-data-label="ROLE_CODE,ROLE_NAME"
            separator=" && "
          )
          | 选中了的值：{{ val2 }}

        h5 通过 query 配置额外的请求条件
        .demo-con
          njs-auto-complete(
            v-model="val3"
            service="U0101400"
            search-key="ROLE_NAME"
            service-data-value="ROLE_CODE"
            service-data-label="ROLE_CODE,ROLE_NAME"
            :query="{'CREATER':'1'}"
          )
          | 选中了的值：{{ val3 }}

        h5 通过 disabledItems 配置禁用项
        .demo-con
          njs-auto-complete(
            v-model="val4"
            service="U0101400"
            search-key="ROLE_NAME"
            service-data-value="ROLE_CODE"
            service-data-label="ROLE_CODE,ROLE_NAME"
            :disabledItems="['1','4','6']"
          )
          | 选中了的值：{{ val4 }}

        h5 通过 disabled 配置禁用整个组件
        .demo-con
          njs-auto-complete(
            v-model="val5"
            service="U0101400"
            search-key="ROLE_NAME"
            service-data-value="ROLE_CODE"
            service-data-label="ROLE_CODE,ROLE_NAME"
            disabled
          )
          | 选中了的值：{{ val5 }}
</template>

<script>
export default {
  data () {
    return {
      val1: '',
      val2: '4',
      val3: '',
      val4: '',
      val5: ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../form/index.styl";
</style>
