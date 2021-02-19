<template lang="pug">
  njs-select(
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
    @blur="handleBlur"
    @focus="handleFocus"
  )
    njs-option(
      v-for="(item,index) in dictList"
      :key="`dict${index}`"
      :label="item.DICT_ITEM_NAME"
      :value="item.DICT_ITEM"
      :disabled="setDisabled(item.DICT_ITEM)"
    )
    njs-option(
      v-for="(item,index) in queryResult"
      :key="`service${index}`"
      :label="computedLabel(item,serviceDataLabel)"
      :value="item[serviceDataValue]"
      :disabled="setDisabled(item[serviceDataValue])"
    )
    slot
    slot(slot="prefix" name="prefix")
    slot(slot="empty" name="empty")
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'njs-combobox',
  props: {
    name: String,
    id: String,
    value: {
      type: String,
      default: ''
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
        return this.$t('请输入')
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
          this.loading = false
        } else {
          this.loading = false
          this.realNoDataText = this.$t('加载失败')
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
    bindValue: {
      get () {
        if (this.multiple) {
          return this.value ? this.value.split(',') : []
        } else {
          return this.value
        }
      },
      set (val) {
        if (this.multiple) {
          this.$emit('input', val.join(','))
        } else {
          this.$emit('input', val)
        }
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
      let label = []
      let lables = serviceDataLabel ? serviceDataLabel.split(',') : []
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
