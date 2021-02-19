<template lang="pug">
  .container-wrap.home-wrap
    .box-body
      .box-home-service(style="padding: 20px;")

        h5 通过配置 service 生成下拉选项，在请求下拉数据时添加了参数，并且指定了多个字段作为 label 用 %#% 作为分割符
        .demo-con
          njs-combobox(
            service="U0101400"
            service-data-value="ROLE_CODE"
            ref="combobox1"
            separator=" %#% "
            multiple
            service-data-label="ROLE_CODE,ROLE_NAME"
            v-model="value4"
            :loading-text="$t('疯狂加载中')"
            :query="{creater: '李涛'}"
          )

        h5 基本用法（通过配置数据字典实现简单下拉选框）
        .demo-con
          njs-combobox(
            dict="AGENT_STATUS"
            v-model="value1"
            no-match-text="meiyou"
            multiple
          )

        h5 禁用掉生成下拉选项中的某些项, 并且赋了初始值
        .demo-con
          njs-combobox(
            dict="AGENT_STATUS"
            v-model="value2"
            :disabled-items="['1', '3']"
          )

        h5 通过配置 service 生成下拉选项，并且指定了多个字段作为 label
        .demo-con
          njs-combobox(
            service="U0101400"
            service-data-value="ROLE_CODE"
            service-data-label="ROLE_CODE,ROLE_NAME"
            v-model="value3"
          )

        h5 通过 size 属性控制组件尺寸，并且监听值的改变
        .demo-con
          njs-combobox(
            dict="AGENT_STATUS"
            v-model="value5"
            size="mini"
            @change="handleChange"
          )
          | 触发 change 事件次数 {{ changeTimes }} , 当前选中的值：{{ value5 }}

        h5 多选基本用法
        .demo-con
          njs-combobox(
            dict="AGENT_STATUS"
            v-model="value6"
            multiple
            filterable
          )
          | 当前选中的值为字符串，形如：{{ value6 }}

        h5 多选时，限制最多选择两项
        .demo-con
          njs-combobox(
          dict="AGENT_STATUS"
          v-model="value10"
          multiple
          filterable
          :multiple-limit="2"
          )
          | 最多选两项，已选：{{ value10 }}

        h5 多选时预设几个选中的值
        .demo-con
          njs-combobox(
            dict="AGENT_STATUS"
            v-model="value7"
            multiple
            filterable
          )
          | 当前选中的值为字符串，形如：{{ value7 }}

        h5 个性化修改搜索无匹配结果时的提示文字
        .demo-con
          njs-combobox(
            service="U0101400"
            service-data-value="ROLE_CODE"
            service-data-label="ROLE_CODE,ROLE_NAME"
            v-model="value8"
            :noMatchText="$t('暂无此分类，如有需要联系管理员')"
          )

        h5 配置了数据字典后又手动添加一些选项
        .demo-con
          njs-combobox(
            dict="AGENT_STATUS"
            v-model="value9"
          )
            njs-option( :label="$t('自定义选项1')" value="a")
            njs-option( :label="$t('自定义选项2')" value="b")
            njs-option( :label="$t('自定义选项3')" value="c")

</template>

<script>
export default {
  name: 'combobox',
  data () {
    return {
      value1: '',
      value2: '2',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: '3,6',
      value8: '',
      value9: '',
      value10: '',
      changeTimes: 0
    }
  },
  mounted () {
    this.$refs.combobox1.focus()
    setTimeout(() => {
      this.$refs.combobox1.blur()
    }, 1000)
  },
  methods: {
    handleChange () {
      this.changeTimes++
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "../form/index.styl";
</style>
