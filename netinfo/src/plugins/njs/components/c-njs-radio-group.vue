<template lang="pug">
  ElRadioGroup(
    v-model="checkedValue"
    :size="size"
    :disabled="disabled"
    :fill="fill"
    :text-color="textColor"
    @change="change"
  )
    template(v-if="autoCreateButton")
      njs-radio-button(
        v-for="(item,index) in dictList"
        :key="index"
        :label="item.DICT_ITEM"
        :disabled="setDisabled(item.DICT_ITEM)"
      ) {{ item.DICT_ITEM_NAME }}
    template(v-else)
      njs-radio(
        v-for="(item,index) in dictList"
        :key="index"
        :label="item.DICT_ITEM"
        :disabled="setDisabled(item.DICT_ITEM)"
        :border="autoCreateBorder"
        :size="autoCreateSize"
      ) {{ item.DICT_ITEM_NAME }}
    slot
</template>

<script>
import ElRadioGroup from 'element-ui/packages/radio/src/radio-group'
import { mapGetters } from 'vuex'
export default {
  name: 'njs-radio-group',
  components: {
    ElRadioGroup
  },
  props: {
    value: {
      type: String,
      default: ''
    }, // v-modle
    size: String, // 尺寸
    fill: String, // 按钮形式的 Radio 激活时的填充色和边框色
    textColor: String, // 按钮形式的 Radio 激活时的文本颜色
    disabled: Boolean, // 是否禁用整个单选框组
    dict: String, // 数据字典
    autoCreateSize: String, // 通过数据字典生成的单选框的尺寸
    autoCreateBorder: Boolean, //  通过数据字典生成的单选框的是否带边框
    autoCreateButton: Boolean, //  通过数据字典生成的单选框的是否为按钮
    disabledItems: Array //  通过数据字典生成的单选框要禁用掉哪些项
  },
  methods: {
    // 值改变时触发change事件
    change (val) {
      this.$emit('change', val)
    }
  },
  computed: {
    ...mapGetters(['getDict']),
    // 获取数据字典
    dictList () {
      if (this.dict) {
        return this.getDict(this.dict) || []
      } else {
        return []
      }
    },
    // 设置字典项是否禁用
    setDisabled () {
      return (val) => {
        if (this.disabledItems) {
          if (this.disabledItems.length) {
            return this.disabledItems.some((item) => {
              return item === val
            })
          } else {
            return false
          }
        } else {
          return false
        }
      }
    },
    // 绑定的值
    checkedValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
