<template lang="pug">
  ElCheckboxGroup(
    v-model="checked"
    :size="size"
    :disabled="disabled"
    :fill="fill"
    :text-color="textColor"
    :min="min"
    :max="max"
    @change="change"
  )
    template(v-if="autoCreateButton")
      njs-checkbox-button(
        v-for="(item,index) in dictList"
        :key="`dict${index}`"
        :label="item.DICT_ITEM"
        :disabled="setDisabled(item.DICT_ITEM)"
      ) {{ item.DICT_ITEM_NAME }}
      njs-checkbox-button(
        v-for="(item,index) in queryResult"
        :key="`service${index}`"
        :label="item[serviceDataValue]"
        :disabled="setDisabled(item.DICT_ITEM)"
      ) {{ computedLabel(item,serviceDataLabel) }}
    template(v-else)
      njs-checkbox(
        v-for="(item,index) in dictList"
        :key="`dict${index}`"
        :label="item.DICT_ITEM"
        :disabled="setDisabled(item.DICT_ITEM)"
        :border="autoCreateBorder"
        :size="autoCreateSize"
      ) {{ item.DICT_ITEM_NAME }}
      njs-checkbox(
        v-for="(item,index) in queryResult"
        :key="`service${index}`"
        :label="item[serviceDataValue]"
        :disabled="setDisabled(item.DICT_ITEM)"
        :border="autoCreateBorder"
        :size="autoCreateSize"
      ) {{ computedLabel(item,serviceDataLabel) }}
    slot
</template>

<script>
import ElCheckboxGroup from 'element-ui/packages/checkbox/src/checkbox-group'
import { mapGetters } from 'vuex'
export default {
  name: 'njs-checkbox-group',
  components: {
    ElCheckboxGroup
  },
  props: {
    value: String,
    disabled: Boolean,
    min: Number,
    max: Number,
    size: String,
    fill: String,
    textColor: String,
    dict: String, // 数据字典
    autoCreateSize: String, // 通过数据字典生成的选框的尺寸
    autoCreateBorder: Boolean, //  通过数据字典生成的选框的是否带边框
    autoCreateButton: Boolean, //  通过数据字典生成的选框的是否为按钮
    disabledItems: Array, //  通过数据字典生成的选框要禁用掉哪些项
    service: String, // 接口号
    serviceDataValue: {
      type: String,
      default: ''
    }, // 用于指定请求到数据作为值的字段名。仅当service属性生效时生效
    serviceDataLabel: {
      type: String,
      default: ''
    }, // 用于指定请求到数据作为描述的字段名(多个字段名用逗号隔开)
    separator: { // 多字段作为label时的分隔符
      type: String,
      default: '-'
    },
    query: { // 附加查询条件
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      queryResult: []
    }
  },
  created () {
    if (this.service) {
      this.$ajaxRequest([{
        service: this.service,
        page: 1,
        pagecount: 1000,
        pageoffset: 1,
        rows: 1000,
        ...this.query
      }]).then((result) => {
        if (result.code === '0') {
          this.queryResult = result.data
        }
      })
    }
  },
  methods: {
    change (val) {
      this.$emit('change', val.join(','))
    },
    // 计算出 label 文字
    computedLabel (item, serviceDataLabel) {
      let label = []
      let lables = serviceDataLabel ? serviceDataLabel.split(',') : []
      lables.forEach((lableItem) => {
        label.push(item[lableItem])
      })
      return label.join(this.separator)
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
    checked: {
      get () {
        return this.value ? this.value.split(',') : []
      },
      set (val) {
        this.$emit('input', val.join(','))
      }
    }
  }
}
</script>
