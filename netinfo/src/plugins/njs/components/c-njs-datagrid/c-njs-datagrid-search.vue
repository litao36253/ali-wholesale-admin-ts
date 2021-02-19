<template lang="pug">
  njs-form-item(:prop="queryText")
    njs-input.input-with-select( v-model='QUERY_TEXT' clearable @keydown.native.13="datagridRefresh" :placeholder="realPlaceholder")
      njs-select(v-model='QUERY_TYPE', @change="queryTypeChange" slot='prepend', :placeholder="$t('请选择')" :style="{width:'100px'}" v-if="!hideSelect")
        njs-option(v-for="(item,index) in selectItems" :key="index" :label="item.label", :value="item.value")
      njs-button(slot='append' icon='el-icon-search' @click="datagridRefresh")
</template>

<script>
export default {
  name: 'njs-datagrid-search',
  props: {
    value: {
      type: Object,
      required: true
    },
    selectItems: { // 下拉选项
      type: Array,
      default () {
        return [{ label: this.$t('全部'), value: '1' }]
      }
    },
    hideSelect: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    queryText: {
      type: String,
      default: 'QUERY_TEXT'
    }
  },
  created () {
    if (!this.value.QUERY_TYPE && !this.hideSelect) {
      console.error(this.$t('使用 njs-datagrid-search 组件时，若 hideSelect 属性不为 true，则其父级 njs-datagrid 组件必须通过 default-query 属性来设置默认的 QUERY_TYPE 作为查询条件！'))
    }
  },
  data () {
    return {
      datagrid: null, // 父级 datagrid 组件
      first: true // 标记是否为第一次value[queryText]的值为空字符串
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
    QUERY_TEXT: {
      get () {
        return this.value[this.queryText]
      },
      set (val) {
        this.value[this.queryText] = val
        this.$emit('input', this.value)
      }
    },
    QUERY_TYPE: {
      get () {
        return this.value.QUERY_TYPE
      },
      set (val) {
        this.value.QUERY_TYPE = val
        this.$emit('input', this.value)
      }
    },
    realPlaceholder () {
      if (this.placeholder) {
        return this.placeholder
      }
      let placeholderitem
      this.selectItems.forEach((item) => {
        if (item.value === this.QUERY_TYPE) {
          placeholderitem = item
        }
      })
      if (placeholderitem) {
        return placeholderitem.placeholder
      } else {
        return this.$t('请输入内容')
      }
    }
  },
  mounted () {
    try {
      if (this.$parent.$el.className.indexOf('njs-datagrid-more-used-query') > -1) {
        this.datagrid = this.$parent.$parent.$parent
      } else {
        console.error(this.$t('njs-datagrid-search 组件必须嵌套在 datagrid 组件的 more-used-query 插槽中使用！'))
      }
    } catch (e) {
      console.error(this.$t('njs-datagrid-search 组件必须嵌套在 datagrid 组件的 more-used-query 插槽中使用！'))
    }
  },
  watch: {
    QUERY_TEXT (val) {
      if (val === '' && !this.first) {
        this.datagridRefresh()
      } else {
        this.first = false
      }
    }
  }
}
</script>

<style scoped>

</style>
