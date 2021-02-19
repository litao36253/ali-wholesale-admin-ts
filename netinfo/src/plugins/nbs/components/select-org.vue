<template>
  <njs-cascader
      v-model="bindValue"
      :placeholder="realPlaceholder"
      :size="size"
      :disabled="realDisabled"
      :clearable="clearable"
      :show-all-levels="showAllLevels"
      :collapse-tags="collapseTags"
      :options="options"
      :props="props"
      :filterable="filterable"
      @change="handleChage"
      @expand-change="handleExpandChange"
      @blur="handleBlur"
      @focus="handleFocus"
      @visible-change="handleVisibleChange"
      @remove-tag="handleRemoveTag"
  >
  </njs-cascader>
</template>

<script>
import { listTransTree } from '@/utils/utils'
export default {
  name: 'nbs-select-org',
  props: {
    value: {
      type: String,
      default: ''
    },
    size: String,
    placeholder: String,
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    expandTrigger: {
      type: String,
      default: 'click'
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    disabledItem: { // 要禁用的项目
      type: [String, Function],
      default: ''
    },
    filterable: {
      type: Boolean,
      default: true
    },
    query: { // 额外的查询条件
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      requestSuccess: false, // 标记数据请求是否成功
      loading: false, // 是否正在请求数据
      data: [] // 加载级联选择器需要的数据
    }
  },
  created () {
    this.refresh()
  },
  methods: {
    refresh () {
      this.loading = true
      this.$ajaxRequest([{
        service: 'P0401404',
        ...this.query
      }]).then((result) => {
        if (result.code === '0') {
          this.requestSuccess = true
          this.data = result.data
        } else {
          this.requestSuccess = false
        }
        this.loading = false
      }).catch((err) => {
        this.loading = false
        this.requestSuccess = false
        console.error(err)
      })
    },
    // change事件
    handleChage (val) {
      this.$emit('change', val)
    },
    // expand-change 当展开节点发生变化时触发
    handleExpandChange (nodes) {
      this.$emit('expand-change', nodes)
    },
    // 当失去焦点时触发
    handleBlur ($event) {
      this.$emit('blur', $event)
    },
    // 当获得焦点时触发
    handleFocus ($event) {
      this.$emit('focus', $event)
    },
    // 当获得焦点时触发
    handleVisibleChange (val) {
      this.$emit('visible-change', val)
    },
    // 在多选模式下，移除Tag时触发
    handleRemoveTag (node) {
      this.$emit('remove-tag', node)
    }
  },
  computed: {
    bindValue: {
      get () {
        if (this.multiple) { // 复选
          if (this.value) {
            return this.value.split(',')
          } else {
            return []
          }
        } else { // 单选
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
    },
    // 真实的启用禁用状态
    realDisabled () {
      if (this.disabled) {
        return true
      } else {
        return this.loading || !this.requestSuccess
      }
    },
    // 真实要展示的占位符
    realPlaceholder () {
      if (this.loading) {
        return this.$t('正在加载组织机构')
      } else if (!this.requestSuccess) {
        return this.$t('加载组织机构失败')
      } else {
        return this.placeholder || this.$t('请选择组织机构')
      }
    },
    // 级联选择器的props
    props () {
      return {
        expandTrigger: this.expandTrigger,
        multiple: this.multiple,
        checkStrictly: this.checkStrictly,
        emitPath: false,
        value: 'ORG_ID',
        label: 'ORG_NAME'
      }
    },
    // 级联选择器的options
    options () {
      return listTransTree(this.data.map((item) => {
        if (typeof this.disabledItem === 'string') {
          item.disabled = this.disabledItem.split(',').some((disableItem) => {
            return disableItem === item.ORG_ID
          })
        } else {
          item.disabled = this.disabledItem(JSON.parse(JSON.stringify(item)))
        }
        return item
      }), 'ORG_ID', 'PAR_ORG')
    }
  }
}
</script>

<style scoped>

</style>
