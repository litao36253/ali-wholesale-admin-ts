<template lang="pug">
      njs-combogrid(
        hide-head
        auto-loading
        datagrid-id="select_system_interface_P0107401"
        v-model="bindValue"
        :disabled="disabled"
        :dialog-title="$t('选择系统接口')"
        :placeholder="$t('请选择系统接口')"
        :single-select="singleSelect"
        :multiple="multiple"
        ref="combogrid"
        service="P0107401"
        :rules="rules"
        data-value="SERVICE_CODE"
        data-label="SERVICE_CODE,SERVICE_NAME"
        height="60vh"
        top="10vh"
        dialog-width="80vw"
        :clearable="clearable"
        :before-close="beforeClose"
        @blur="handleBlur"
        @focus="handleFocus"
        @change="handleChange"
        @before-load="handleBeforeLoad"
        @load-success="handleLoadSuccess"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @cell-mouse-enter="handleMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
        @cell-click="handleCellClick"
        @load-error="handleLoadError"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentRowChange"
        @cell-dblclick="handleCellDbclick"
        @row-click="handleRowClick"
        @row-contextmenu="handleRowContextmenu"
        @row-dblclick="handleRowDbclick"
        @header-click="handleHeaderClick"
        @header-contextmenu="handleHeaderContextmenu"
        @sort-change="handleSortChange"
        @size-change="handleSizeChange"
        @current-page-change="handleCurrentPageChange"
        @prev-click="handlePrevClick"
        @next-click="handleNextClick"
        :pagination="false"
      )
        <!-----------     列配置  start ---------------------------------------------------------- -->
        njs-column(prop="SERVICE_CODE" :label="$t('接口编号')" sortable min-width="10")
        njs-column(prop="SERVICE_NAME" :label="$t('接口名称')" show-overflow-tooltip sortable min-width="20")
        njs-column(prop="SERVICE_SOAP" :label="$t('webservice是否启动')" min-width="14" dict="SERVICE_SOAP")
        njs-column(prop="SERVICE_TYPE" :label="$t('是否开启事务')" min-width="10" dict="SERVICE_TYPE")
        njs-column(prop="BUSINESS_TYPE" :label="$t('配置类型')" min-width="10" dict="BUSINESS_TYPE")
        njs-column(prop="PAGE_TYPE" :label="$t('是否分页')" min-width="10" dict="PAGE_TYPE")
        njs-column(prop="BUSINESS_CODE" :label="$t('配置编码')" min-width="20" show-overflow-tooltip)
        njs-column(prop="BUSINESS_NAME" :label="$t('配置名称')" min-width="20" show-overflow-tooltip)
        <!-----------     列配置  end ---------------------------------------------------------- -->

        <!-----------     常用查询条件  start ---------------------------------------------------------- -->
        template(slot="more-used-query" slot-scope="{ formData }")
          njs-form-item(prop="SERVICE_CODE")
            njs-input(v-model="formData.SERVICE_CODE" :placeholder="$t('请输入接口编号')" clearable @keydown.13.native="$refs.combogrid.refresh()")
          njs-form-item(prop="SERVICE_NAME")
            njs-input(v-model="formData.SERVICE_NAME" :placeholder="$t('请输入接口名称')" clearable @keydown.native.13="$refs.combogrid.refresh()")
          njs-form-item
            njs-button(@click="$refs.combogrid.refresh()" type="primary") {{$t('查询')}}
        <!-----------     常用查询条件  start ---------------------------------------------------------- -->
</template>

<script>
export default {
  name: 'nbs-select-interface',
  data () {
    return {
      rules: {
        SERVICE_CODE: [
          { max: 8, message: this.$t('接口编号长度最长为 8'), trigger: 'change' }
        ],
        SERVICE_NAME: [
          { max: 60, message: this.$t('输入长度不可超过 60'), trigger: 'change' }
        ]
      }
    }
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: { // 是否禁用
      type: Boolean,
      default: false
    },
    clearable: { // 是否可清空
      type: Boolean,
      default: true
    },
    singleSelect: { // 单选
      type: Boolean,
      default: true
    },
    multiple: { // 多选
      type: Boolean,
      default: false
    },
    size: String, // 输入框尺寸
    beforeClose: Function // 关闭前的回调，会暂停 Dialog 的关闭
  },
  methods: {
    handleBlur () {
      this.$emit('blur')
    },
    handleFocus () {
      this.$emit('focus')
    },
    handleChange (value, selection) {
      this.$emit('change', value, selection)
    },
    handleBeforeLoad (req, callback) {
      this.$emit('before-load', req, callback)
    },
    handleLoadSuccess (data, callback) {
      this.$emit('load-success', data, callback)
    },
    handleSelect (selection, row) {
      this.$emit('load-success', selection, row)
    },
    handleSelectAll (selection) {
      this.$emit('select-all', selection)
    },
    handleMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    handleCellMouseLeave (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    handleCellClick (row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
    },
    handleLoadError (err) {
      this.$emit('load-error', err)
    },
    handleSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    handleCurrentRowChange (currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    // 当单元格 hover 进入时会触发该事件
    handleCellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    // 当某个单元格被双击击时会触发该事件
    handleCellDbclick (row, column, cell, event) {
      this.$emit('cell-dbclick', row, column, cell, event)
    },
    // 当某一行被点击时会触发该事件
    handleRowClick (row, column, event) {
      this.$emit('row-click', row, column, event)
    },
    // 当某一行被鼠标右键点击时会触发该事件
    handleRowContextmenu (row, column, event) {
      this.$emit('row-contextmenu', row, column, event)
    },
    // 当某一行被双击时会触发该事件
    handleRowDbclick (row, column, event) {
      this.$emit('row-dblclick', row, column, event)
    },
    // 当某一列的表头被点击时会触发该事件
    handleHeaderClick (column, event) {
      this.$emit('header-click', column, event)
    },
    // 当某一列的表头被鼠标右键点击时触发该事件
    handleHeaderContextmenu (column, event) {
      this.$emit('header-contextmenu', column, event)
    },
    // 当表格的排序条件发生变化的时候会触发该事件
    handleSortChange (sort) {
      this.$emit('sort-change', sort)
    },
    handleSizeChange (val) {
      this.$emit('size-change', val)
    },
    handleCurrentPageChange (val) {
      this.$emit('current-page-change', val)
    },
    // 用户点击上一页按钮改变当前页后触发
    handlePrevClick (val) {
      this.$emit('prev-click', val)
    },
    // 用户点击下一页按钮改变当前页后触发
    handleNextClick (val) {
      this.$emit('next-click', val)
    },
    loadText () {
      this.$refs.combogrid.loadText()
    },
    focus () {
      this.$refs.combogrid.focus()
    },
    blur () {
      this.$refs.combogrid.blur()
    },
    getAttr (attributeName) {
      this.$refs.combogrid.getAttr(attributeName)
    },
    refresh () {
      this.$refs.combogrid.refresh()
    },
    toggleMoreQuery (openState) {
      this.$refs.combogrid.toggleMoreQuery(openState)
    },
    toggleRowSelection (row, selected) {
      this.$refs.combogrid.toggleRowSelection(row, selected)
    },
    toggleAllSelection () {
      this.$refs.combogrid.toggleRowSelection()
    },
    setCurrentRow (row) {
      this.$refs.combogrid.toggleRowSelection(row)
    },
    clearSort () {
      this.$refs.combogrid.clearSort()
    },
    clearFilter (columnKey) {
      this.$refs.combogrid.clearSort(columnKey)
    },
    doLayout () {
      this.$refs.combogrid.doLayout()
    },
    sort (prop, order) {
      this.$refs.combogrid.sort(prop, order)
    },
    setLoading (loading) {
      this.$refs.combogrid.setLoading(loading)
    }
  },
  computed: {
    bindValue: {
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
