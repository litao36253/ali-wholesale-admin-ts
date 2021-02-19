<template lang="pug">
  .container-wrap.home-wrap
    .box-body
      .box-home-service(style="padding: 20px;")
        h5 基本用法
        .demo-con
          njs-checkbox-group(v-model='radio0')
            njs-checkbox(label="1") 备选项1
            njs-checkbox(label="2") 备选项2
            njs-checkbox(label="3") 备选项3

        h5 数据字典生成的普通复选框，绑定了change事件
        .demo-con
          njs-checkbox-group(v-model='radio2' dict="AGENT_STATUS" @change="change")

        h5 数据字典生成的按钮形式复选框
        .demo-con
          njs-checkbox-group(v-model='radio1' dict="ATTA_CHNL"  :autoCreateButton="true" size="mini")

        h5 数据字典生成的普通复选框，禁用部分选项
        .demo-con
          njs-checkbox-group(v-model='radio3' dict="AGENT_STATUS" :disabled-items="['3','4']")

        h5 数据字典生成的带边框复选框，并手动添加一些选项
        .demo-con
          njs-checkbox-group(v-model='radio4' dict="AGENT_STATUS" :auto-create-border="true" size="mini")
            njs-checkbox( label="8") 手动添加选项1
            njs-checkbox(:dict-border="true" label="9" border) 手动添加选项2

        h5 禁用所有选项（给 njs-checkbox-group 加 disabled 属性）
        .demo-con
          njs-checkbox-group(v-model='radio3' dict="AGENT_STATUS" disabled)

        h5 通过配置接口号生成复选框
          njs-checkbox-group(v-model='radio5' size="mini" service="U0101400" service-data-value="ROLE_CODE" service-data-label="ROLE_NAME")

        h5 通过配置接口号生成复选框，配置多个字段作为label,配置多字段间的分隔符
          njs-checkbox-group(v-model='radio5' size="mini" service="U0101400" service-data-value="ROLE_CODE" service-data-label="ROLE_CODE,ROLE_NAME" separator="#" :query="{kdk:'pp'}")
</template>
<script>
export default {
  data () {
    return {
      radio0: '',
      radio1: '',
      radio2: '',
      radio3: '',
      radio4: '',
      radio5: ''
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
  @import "../form/index.styl";
</style>
