<template>
  <NativeElSelect
    v-model="bindValue"
    ref="njsSelect"
    :multiple="multiple"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    :filterable="filterable"
    :allowCreate="allowCreate"
    :loading="loading"
    :popperClass="popperClass"
    :class="['njs-select']"
    :noMatchText="noMatchText"
    :noDataText="realNoDataText"
    :filterMethod="filterMethod"
    :multipleLimit="multipleLimit"
    :placeholder="placeholder"
    :defaultFirstOption="defaultFirstOption"
    :reserveKeyword="reserveKeyword"
    :collapseTags="collapseTags"
    :popperAppendToBody="popperAppendToBody"
    @change="change"
    @visible-change="visibleChange"
    @remove-tag="removeTag"
    @clear="handleClear"
    @focus="handleFocus"
  >
    <el-option
      v-for="item in dictList"
      :key="item.dict_item_code"
      :label="item.dict_item_name"
      :value="item.dict_item_code"
      :disabled="setDisabled(item.dict_item_code)"
    >
    </el-option>

    <el-option
      v-for="item in queryResult"
      :key="item[serviceDataValue]"
      :label="computedLabel(item,serviceDataLabel)"
      :value="item[serviceDataValue]"
      :disabled="setDisabled(item[serviceDataValue])"
    >
    </el-option>

    <slot></slot>

    <template v-slot:prefix>
      <slot name="prefix"></slot>
    </template>

    <template v-slot:empty>
      <slot name="empty"></slot>
    </template>

  </NativeElSelect>
</template>

<script>
import { Select } from 'element-ui'
// import Select from 'element-ui/packages/select/index.js'

export default {
  components: {
    NativeElSelect: Select
  },
  props: {
    value: {
      required: true
    },
    size: String,
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default () {
        return true
      }
    },
    filterable: {
      type: Boolean,
      default () {
        return true
      }
    },
    allowCreate: Boolean,
    popperClass: String,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    filterMethod: Function,
    multiple: Boolean,
    multipleLimit: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default () {
        return '请选择'
      }
    },
    defaultFirstOption: {
      default: true,
      type: Boolean
    },
    reserveKeyword: {
      default: true,
      type: Boolean
    },
    collapseTags: {
      default: false,
      type: Boolean
    },
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    dict: String, // 数据字典
    disabledItems: Array, // 生成的要禁用掉哪些项
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
  created () {
    if (this.service) {
      this.loading = true
      this.service({
        ...this.query
      }, {
        pageSize: 200,
        currentPage: 1
      }).then((result) => {
        if (result.code) {
          this.loading = false
          this.realNoDataText = this.$t('加载失败')
        } else {
          this.queryResult = result.data
          this.loading = false
        }
      }).catch((err) => {
        console.error(err)
        this.loading = false
        this.realNoDataText = this.$t('加载失败')
      })
    }
  },
  data () {
    return {
      queryResult: [],
      loading: false,
      realNoDataText: this.noDataText // 无数据时的提示
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
    // 绑定的值
    bindValue: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    change (val) {
      if (this.multiple) {
        this.$emit('change', val.join(','))
      } else {
        this.$emit('change', val)
      }
    },
    visibleChange (show) {
      this.$emit('visible-change', show)
    },
    removeTag (tag) {
      this.$emit('remove-tag', tag)
    },
    handleClear () {
      this.$emit('clear')
    },
    blur () {
      this.$refs.njsSelect.blur()
    },
    focus () {
      this.$refs.njsSelect.focus()
    },
    // 获得焦点事件处理函数
    handleFocus ($event) {
      this.$emit('focus', $event)
    },
    // 失去焦点事件处理函数
    handleBlur ($event) {
      this.$emit('blur', $event)
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
  }
}
</script>

<style scoped>
  .njs-select{
    display: block;
  }
</style>
