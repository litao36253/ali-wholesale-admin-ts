<!-- 将员工详情功能独立成组件  李涛  -->
<template lang="pug">
  njs-dialog(:visible.sync="dialogVisible" width = "1000" :title="empinfo.USER_NAME + $t('的详情')")
    table(class="detail")
      tr
        td(:span="3") {{ $t('员工编号') }}
        td(:span="3") {{ empinfo.USER_CODE }}
        td(:span="3") {{ $t('员工姓名') }}
        td(:span="3") {{ empinfo.USER_NAME }}
        td(:span="3") {{ $t('员工状态') }}
        td(:span="3") {{ empinfo.USER_STAT === '1' ? $t('正常') : $t('禁用') }}
        td(:span="3") {{ $t('员工类型') }}
        td(:span="3")
      tr
        td(:span="3") {{ $t('员工机构') }}
        td(:span="3") {{ empinfo.ORG_NAME }}
        td(:span="3") {{ $t('入职日期') }}
        td(:span="3")
        td(:span="3") {{ $t('业务分组') }}
        td(:span="3") {{ empinfo.GRP_NAME_STR }}
        td(:span="3") {{ $t('出生日期') }}
        td(:span="3") {{ empinfo.BIRTHDAY }}
      tr
        td(:span="3") {{ $t('员工角色') }}
        td(colspan='7') {{empinfo.ROLE_NAME_STR}}
      tr
        td(:span="3") {{ $t('员工岗位') }}
        td(colspan='7') {{ empinfo.POST_NAME_STR }}
      tr
        td {{ $t('员工性别') }}
        td {{ empinfo.USER_SEX === '1' ?  $t('男') : $t('女') }}
        td {{ $t('联系电话') }}
        td {{ empinfo.MOBILE }}
        td {{ $t('办公电话') }}
        td {{ empinfo.OFF_TEL }}
        td {{ $t('邮箱') }}
        td {{ empinfo.EMAIL }}
</template>

<script>
export default {
  name: 'c-deatil',
  props: {
    visible: Boolean,
    empinfo: Object
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  .detail
    font-size 12px
    tr
      width 100%
      line-height 32px
      background #fff
      td
        text-align center
        width 100px
        line-height 32px
        border 1px solid #ddd
        &:nth-child(2n)
          width 140px
        &:nth-child(2n-1)
          background  rgba(246, 246, 246,.8)
</style>
