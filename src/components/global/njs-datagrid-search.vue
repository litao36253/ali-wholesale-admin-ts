<template>
  <el-form-item :prop="fieldName">
    <el-input v-model="queryText" :placeholder="realPlaceholder" clearable @keydown.native.13="datagridRefresh" @clear="datagridRefresh">
      <template v-slot:prepend>
        <el-select v-if="!hideSelect" v-model="fieldName" placeholder="请选择" :clearable="false" :style="{ width: realSelectWidth }" @change="queryTypeChange">
          <el-option v-for="item in fields" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </template>
      <template v-slot:append>
        <el-button icon='el-icon-search' @click="datagridRefresh"></el-button>
      </template>
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'njs-datagrid-search',
  props: {
    value: {
      type: Object,
      required: true
    },
    fields: { // 下拉选项(可选字段名列表)
      type: Array,
      default () {
        return []
      }
    },
    defaultFieldName: String, // 默认的查询字段
    hideSelect: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    selectWidth: { // 内嵌下拉框的宽度
      type: [String, Number],
      default: '100px'
    }
  },
  data () {
    return {
      datagrid: null, // 父级 datagrid 组件
      fieldName: this.defaultFieldName || '' // 要查询的字段名
    }
  },
  methods: {
    // 触发下拉选框 change 事件
    queryTypeChange (val) {
      this.$emit('select-change', val)
    },
    // 刷新 datagrid
    datagridRefresh () {
      if (this.datagrid) {
        this.datagrid.refresh()
      } else {
        console.error(this.$t('njs-datagrid-search 组件必须嵌套在 datagrid 组件的 more-used-query 插槽中使用！'))
      }
    }
  },
  computed: {
    queryText: {
      get () {
        return this.value[this.fieldName]
      },
      set (val) {
        this.$set(this.value, this.fieldName, val)
        this.$emit('input', this.value)
      }
    },
    realPlaceholder () {
      const placeholderItem = this.fields.find(item => item.value === this.fieldName)
      if (placeholderItem) {
        return placeholderItem.placeholder
      } else {
        return this.placeholder
      }
    },
    realSelectWidth () {
      if (typeof this.selectWidth === 'number') {
        return this.selectWidth + 'px'
      } else {
        return this.selectWidth
      }
    }
  },
  mounted () {
    try {
      if (this.$parent.$el.className.indexOf('njs-datagrid-more-used-query') > -1) {
        this.datagrid = this.$parent.$parent
      } else {
        console.error(this.$t('njs-datagrid-search 组件必须嵌套在 datagrid 组件的 query 插槽中使用！'))
      }
    } catch (e) {
      console.error(this.$t('njs-datagrid-search 组件必须嵌套在 datagrid 组件的 query 插槽中使用！'))
    }
  },
  watch: {
    fieldName (val, oldVal) {
      const oldText = this.value[oldVal]
      this.fields.forEach(item => {
        if (item.value !== val) {
          this.$set(this.value, item.value, undefined)
        } else {
          this.$set(this.value, item.value, oldText)
        }
      })
    }
  }
}
</script>
