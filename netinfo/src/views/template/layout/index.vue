<template lang="pug">
.layout-wrap
  .layout-aside(:class="{collapse: isMenuCollapse}")
    .layout-logo
      .logo-img
        img(src="~@res/logo.png")
      .soft-name {{$t('app')['systemTitle']}}
    Menu(:isMenuCollapse.sync="isMenuCollapse")
  .layout-body
    .layout-header
      Header(:isMenuCollapse.sync="isMenuCollapse", @switch-menu="onSwitchMenu")
    .layout-bom-history
      PageHistory
    .layout-main
      .container-wrap
        .box-body
          transition(name="bounce" leave-active-class="animated bounceOutRight" mode="out-in" :duration="{ enter: 0, leave: 100 }")
            keep-alive(:include="$store.state.common.cachedViews")
              router-view
  <!-- 会话过期提示弹框 -->
  njs-dialog(:title="$t('提示')", :visible.sync='$store.state.common.sessionExpTip', width='30%')
    span
      i.el-icon-error(:style="{color: '#f56c6c', fontSize: '24px', paddingRight: '14px', verticalAlign: 'middle'}")
      span(:style="{verticalAlign: 'middle'}") {{ $t('你的服务会话已过期，是否重新登录?') }}
    span.dialog-footer(slot='footer')
      njs-button(@click="$store.commit('M_SESSION_EXP_TIP', false)") {{ $t('取消') }}
      njs-button(type='primary', @click='toLogin') {{ $t('确定') }}
</template>

<script>
// import { mapState } from 'vuex'
// import storage from '@/commons/storage'

import Menu from '@/components/c-menu/index'
import Header from '@/components/c-header/index'
import PageHistory from '@/components/c-history/index'

export default {
  data () {
    return {
      transitionName: 'slide-left',
      baseInfo: null,
      bodyHeight: 400,
      isMenuCollapse: true
    }
  },
  created () {
    // console.log(this.$i18n.t('extend')['util.js.batch1'])
    // console.log(this.$route)
    // console.log(this.$router)
  },
  mounted () {
  },
  computed: {},
  watch: {},
  updated () {},
  methods: {
    onSwitchMenu (_isMenuCollapse) {
      // 单项数据流，不允许子组件修改父组件的值
      this.isMenuCollapse = !_isMenuCollapse
    },
    // 会话过期返回登录界面
    toLogin () {
      this.$store.commit('M_SESSION_EXP_TIP', false)
      this.$router.replace({
        name: 'login',
        query: {
          redirect: this.$route.fullPath
        }
      })
    }
  },
  components: {
    Menu,
    Header,
    PageHistory
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
