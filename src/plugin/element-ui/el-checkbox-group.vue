<template>
  <NativeElCheckboxGroup
    v-model="checked"
    :size="size"
    :disabled="disabled"
    :fill="fill"
    :text-color="textColor"
    :min="min"
    :max="max"
    @change="handleChange"
  >
    <template v-if="autoCreateButton">
      <el-checkbox-button
        v-for="item in dictList"
        :key="item.dict_item_code"
        :label="item.dict_item_code"
        :disabled="setDisabled(item.dict_item_code)"
      >
        {{ item.dict_item_name }}
      </el-checkbox-button>
      <el-checkbox-button
        v-for="item in queryResult"
        :key="item[serviceDataValue]"
        :label="item[serviceDataValue]"
        :disabled="setDisabled(item[serviceDataValue])"
      >
        {{ computedLabel(item,serviceDataLabel) }}
      </el-checkbox-button>
    </template>
    <template v-else>
      <el-checkbox
        v-for="item in dictList"
        :key="item.dict_item_code"
        :label="item.dict_item_code"
        :disabled="setDisabled(item.dict_item_code)"
        :border="autoCreateBorder"
        :size="autoCreateSize"
      >
        {{ item.dict_item_name }}
      </el-checkbox>
      <el-checkbox
        v-for="item in queryResult"
        :key="item[serviceDataValue]"
        :label="item[serviceDataValue]"
        :disabled="setDisabled(item[serviceDataValue])"
        :border="autoCreateBorder"
        :size="autoCreateSize"
      >
        {{ computedLabel(item,serviceDataLabel) }}
      </el-checkbox>
    </template>
    <slot></slot>
  </NativeElCheckboxGroup>
</template>

<script>
import { CheckboxGroup } from 'element-ui'

export default {
  components: {
    NativeElCheckboxGroup: CheckboxGroup
  },
  props: {
    value: {
      required: true,
      type: Array
    },
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
      this.service({
        ...this.query
      }, {
        pageSize: 100,
        currentPage: 1
      }).then((result) => {
        if (!result.code) {
          this.queryResult = result.data
        }
      })
    }
  },
  methods: {
    handleChange (val) {
      this.$emit('change', val)
    },
    // 计算出 label 文字
    computedLabel (item, serviceDataLabel) {
      const label = []
      const lables = serviceDataLabel ? serviceDataLabel.split(',') : []
      lables.forEach((lableItem) => {
        label.push(item[lableItem])
      })
      return label.join(this.separator)
    }
  },
  computed: {
    // 获取数据字典
    dictList () {
      return this.$utils.getDict(this.dict)
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
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
