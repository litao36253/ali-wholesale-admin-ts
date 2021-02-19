<template lang="pug">
  njs-select(
    v-model="bindValue"
    :name="name"
    :size="size"
    :disabled="disabled"
    :clearable="clearable"
    reserve-keyword
    filterable
    remote
    :remote-method="remoteMethod"
    :loading="loading"
    :popperClass="popperClass"
    :noMatchText="noMatchText"
    :noDataText="noDataText"
    :placeholder="placeholder"
    :defaultFirstOption="defaultFirstOption"
    :collapseTags="collapseTags"
    :popperAppendToBody="popperAppendToBody"
    @change="change"
    @visible-change="visibleChange"
    @remove-tag="removeTag"
    @clear="clear"
    @blur="handleBlur"
    @focus="handleFocus"
  )
    njs-option(
      v-for="(item,index) in options"
      :key="index"
      :label="computedLabel(item,serviceDataLabel)"
      :value="item[serviceDataValue]"
      :disabled="setDisabled(item[serviceDataValue])"
    )
    slot(slot="prefix" name="prefix")
    slot(slot="empty" name="empty")
</template>

<script>
export default {
  name: 'njs-auto-complete',
  props: {
    name: String,
    id: String,
    value: {
      type: String,
      default: ''
    },
    size: String,
    disabled: Boolean,
    clearable: {
      type: Boolean,
      default: true
    },
    popperClass: String,
    loadingText: String,
    noMatchText: String,
    noDataText: String,
    placeholder: {
      type: String,
      default () {
        return this.$t('请输入')
      }
    },
    defaultFirstOption: {
      type: Boolean,
      default: true
    },
    reserveKeyword: Boolean,
    valueKey: {
      type: String,
      default: 'value'
    },
    collapseTags: Boolean,
    popperAppendToBody: {
      type: Boolean,
      default: true
    },
    service: String, // 接口号
    disabledItems: Array, // 生成的要禁用掉哪些项
    serviceDataValue: {
      type: String,
      required: true,
      default: ''
    }, // 用于指定请求到数据作为值的字段名。仅当service属性生效时生效
    serviceDataLabel: {
      type: String,
      required: true,
      default: ''
    }, // 用于指定请求到数据作为描述的字段名(多个字段名用逗号隔开)
    separator: { // 多字段作为label时的分隔符
      type: String,
      default: '-'
    },
    searchKey: { // 用于远程搜索时指定key
      type: String,
      required: true
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
      loading: false,
      options: []
    }
  },
  created () {
    if (this.value) { // 如果创建的时候有值，则回写其值的描述文字
      this.$ajaxRequest([{
        service: this.service,
        page: 1,
        pagecount: 1000,
        pageoffset: 1,
        rows: 1000,
        ...this.query
      }]).then((result) => {
        if (result.code === '0') {
          this.options = result.data
        }
      })
    }
  },
  computed: {
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
      this.$emit('change', val)
    },
    visibleChange (show) {
      this.$emit('visible-change', show)
    },
    removeTag (tag) {
      this.$emit('remove-tag', tag)
    },
    clear () {
      this.options = []
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
      this.options = []
      this.$emit('blur', $event)
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true
        let req = [{
          service: this.service,
          page: 1,
          pagecount: 1000,
          pageoffset: 1,
          rows: 1000,
          ...this.query
        }]
        req[0][this.searchKey] = query
        this.$ajaxRequest(req).then((result) => {
          this.loading = false
          if (result.code === '0') {
            this.options = result.data
          } else {
            this.options = []
          }
        }).catch((err) => {
          this.loading = false
          this.options = []
          console.log(err)
        })
      } else {
        this.options = []
      }
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

</style>
