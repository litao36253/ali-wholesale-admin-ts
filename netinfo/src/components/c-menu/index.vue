<template lang="pug">
njs-menu(
  class="bar-menu",
  :router="true",
  :default-active="activeIndex",
  :collapse="isMenuCollapse"
  )
  MenuTree(:menuData.sync="category")
</template>

<script>
import { mapState } from 'vuex'
import MenuTree from './menu-tree'

import { listTransTree } from '@/utils/utils'
export default {
  name: 'Menu',
  computed: {
    ...mapState({
      category (state) {
        return listTransTree(state.common.menu, 'MENU_ID', 'PAR_MENU')
      }
    })
  },
  props: {
    isMenuCollapse: {
      type: [Boolean, String],
      default: true
    }
  },
  data () {
    return {
      activeIndex: '1'
    }
  },
  created () {},
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.activeIndex = val.MENU_NAME
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {},
  components: {
    MenuTree
  }
}
</script>

<style lang="stylus">
@import './index.styl'
</style>
