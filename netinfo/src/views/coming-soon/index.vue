<template lang="pug">
.container-wrap
  .coming-soon
    h1 {{$t('开发中...')}}
    .img
</template>

<script>

export default {
  data () {
    return {
      thisRouter: this.$router.currentRoute
    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        console.log(val)
        this.thisRouter = val
      },
      // 深度观察监听
      deep: true
    }
  },
  methods: {},
  components: {}
}
</script>

<style lang="stylus">
@import './index.styl'
</style>
