<template>
  <transition name="bounce" :duration="{ enter: 120, leave: 100 }" enter-class="bounceInRight" leave-active-class="bounceOutRight">
    <div class="ni-card animated" :style="{width: computedWidth}" v-show="visible">
      <div class="ni-card-header" v-if="!hideTitle">
        <slot name="header">
          {{title}}
        </slot>
      </div>
      <div class="ni-card-main">
        <slot></slot>
      </div>
      <div class="ni-card-footer">
        <slot name="footer"></slot>
        <njs-button size="medium" @click="$emit('update:visible', false)" v-if="showClose">{{ closeText }}</njs-button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'njs-datagrid-card',
  props: {
    title: {
      type: [String],
      default: ''
    },
    hideTitle: {
      type: Boolean,
      default: false
    },
    visible: { // 是否显示该卡片
      type: Boolean,
      default: false
    },
    showClose: { // 是否显示关闭按钮
      type: Boolean,
      default: true
    },
    closeText: { // 关闭按钮的文字
      type: String,
      default: window.app.$t('关闭')
    },
    width: {
      type: [Number, String],
      default: '35%'
    }
  },
  computed: {
    // 计算组件最大高度
    computedWidth () {
      let type = typeof this.width
      if (type === 'string') {
        return this.width
      } else if (type === 'number') {
        return `${this.width}px`
      } else {
        return ''
      }
    }
  },
  watch: {
    visible (val) {
      if (val) { // 触发 open 事件
        this.$emit('open')
      } else { // 触发 close 事件
        this.$emit('close')
      }
    }
  }
}

</script>

<style lang="stylus">
  @import './c-njs-datagrid-card.styl'
</style>
