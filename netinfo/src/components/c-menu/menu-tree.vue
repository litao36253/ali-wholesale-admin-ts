<template lang="pug">
div
  template(v-for="(item, index) in menuData")
    njs-submenu(:index="item.MENU_ID", :class="{'parent-top': item.PAR_MENU === '0'}", v-if="item.children && item.children.length")
      template(slot="title")
        span.icon-wrap(v-if="parseInt(item.PAR_MENU) === 0")
          i(class="iconfont" :class="item.MENU_ICO")
        .title(slot="title") {{item.MENU_NAME}}
      MenuTree(:menuData="item.children")
    njs-menu-item(:index="item.MENU_ID", :route="{path: item.MENU_LINK}", :class="{'parent-top': item.PAR_MENU === '0'}", v-else)
      span.icon-wrap(v-if="item.PAR_MENU === '0'")
        i(class="iconfont" :class="item.MENU_ICO")
      .title(slot="title") {{item.MENU_NAME}}
</template>

<script>
export default {
  name: 'MenuTree',
  props: {
    menuData: {
      type: [Array]
    },
    isMenuCollapse: {
      type: [Boolean, String],
      default: true
    }
  },
  data () {
    return {}
  },
  created () { },
  watch: {},
  methods: {}
}
</script>

<style lang="stylus"></style>
