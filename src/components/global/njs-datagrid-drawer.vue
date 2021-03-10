<template>
  <transition name="drawer">
    <div class="ni-card" :style="{width: computedWidth}" v-if="visible">
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
        <el-button type="danger" size="medium" @click="$emit('update:visible', false)" v-if="showClose">{{ closeText }}</el-button>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'njs-datagrid-drawer',
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
      default: '关闭'
    },
    width: {
      type: [Number, String],
      default: '35%'
    }
  },
  computed: {
    // 计算组件最大高度
    computedWidth () {
      const type = typeof this.width
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

<style lang="scss" scoped>
.ni-card {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 1);
  box-shadow: -3px 0px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.ni-card-header {
  flex: none;
  color: #495061;
  font-size: 16px;
  text-align: left;
  height: 46px;
  line-height: 46px;
  display: block;
  padding: 0 15px;
  border-bottom: 1px solid #e8e9eb;
  font-weight: bold;
  span.action {
    font-weight: 400;
    font-size: 13px;
    margin-left: 10px;
    color: #409eff;
    cursor: pointer;
  }
}

.ni-card-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ni-card-main {
  flex: 1;
  overflow-y: scroll;
}

.ni-card-footer {
  flex: none;
  padding: 10px 0;
  border-top: 1px solid #e8e9eb;
  text-align: center
}

.drawer-enter-active, .drawer-leave-active {
  transition: right .2s;
}
.drawer-enter, .drawer-leave-to {
  right: -100%;
}
</style>
