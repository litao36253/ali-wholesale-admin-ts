<template lang="pug">
.component
  njs-button.demo(size="mini", @click="handelEmit") 父组件通信
  h2(v-if="title") {{title}}
  h3 状态
    span.true(v-if='status') 真的
    span.false(v-else) 假的
  ul(v-if="list && list.length > 0", v-for="(item) in list")
    li {{item}}
</template>

<script>
export default {
  name: 'DemoComponent', // 命名规则，驼峰命名、首字母大写
  props: {
    title: {
      type: [Object, String],
      default: ''
    },
    list: {
      type: [Array],
      default: () => []
    },
    status: {
      type: [Boolean, String],
      default: false
    },
    // props数据示例,必须声明其类型,以下各个类型的引入声明示例
    boolean: {
      type: [Boolean, String],
      default: true
    },
    number: {
      type: [Number],
      default: 1
    },
    string: {
      type: [String],
      default: ''
    },
    array: {
      type: [Array],
      default: () => []
    },
    object: {
      type: [Object],
      default: () => {}
    }
  },
  data () {
    return {
      emitData: '通过改变父组件的数据来改变子组件的数据'
    }
  },
  mounted () {},
  watch: {},
  methods: {
    // 调用父组件的事件
    handelEmit () {
      this.$emit('handelParent', this.emitData)
    },
    // 被父组件调用的事件
    handelByParent (_data) {
      this.$message.warning(`${_data}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
