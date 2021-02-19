<template lang="pug">
  .container-wrap.home-wrap
    .box-body
      .box-home-service(style="padding: 20px;")
        h5 基础用法
        .demo-con
          njs-radio-group(v-model='radio0')
            njs-radio(label="1") 备选项1
            njs-radio(label="2") 备选项2
            njs-radio(label="3") 备选项3
        h5 数据字典生成的普通单选框，绑定了change事件
        .demo-con
          njs-radio-group(v-model='radio2' dict="AGENT_STATUS" @change="change")
            njs-radio(label="11") 备选项1
            njs-radio(label="12") 备选项2
            njs-radio(label="13") 备选项3
        h5 数据字典生成的按钮形式单选框
        .demo-con
          njs-radio-group(v-model='radio1' dict="ERROR_LVL"  :dictButton="true" size="mini")
        h5 数据字典生成的普通单选框，禁用部分选项
        .demo-con
          njs-radio-group(v-model='radio3' dict="AGENT_STATUS" :disabled-items="['3','4','5']")
        h5 数据字典生成的带边框单选框，并手动添加一些选项
        .demo-con
          njs-radio-group(v-model='radio4' :dict-border="true" size="mini")
            njs-radio-button(label="8") 手动添加选项1
            njs-radio-button(label="9") 手动添加选项2
        h5 禁用所有选项（给 njs-radio-group 加 disabled 属性）
          .demo-con
            njs-radio-group(v-model='radio3' dict="AGENT_STATUS" disabled)
</template>

<script>
export default {
  data () {
    return {
      radio0: '1',
      radio1: '1',
      radio2: '2',
      radio3: '1',
      radio4: '1'
    }
  },
  methods: {
    change (val) {
      this.$alert(this.$t('触发change事件，当前选中')+` ${val}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
  // @import "./form-demo.styl";
</style>
