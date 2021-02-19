<template lang="pug">
  njs-combogrid(
    hide-head
    auto-loading
    datagrid-id="select_system_trigger_P0109401"
    v-model="bindValue"
    :dialog-title="$t('选择触发器')"
    :placeholder="$t('请选择触发器')"
    :single-select="singleSelect"
    :multiple="multiple"
    ref="combogrid"
    service="P0109401"
    :rules="rules"
    data-value="TRIGGER_NAME"
    data-label="TRIGGER_NAME"
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
  )
    <!-----------     列配置  start ---------------------------------------------------------- -->
    njs-column(prop="TRIGGER_NAME" :label="$t('触发器名称')" show-overflow-tooltip sortable min-width="120")
    njs-column(prop="TRIGGER_TYPE" :label="$t('触发器类型')" show-overflow-tooltip sortable min-width="120" dict="TRIGGER_TYPE")
    njs-column(prop="TRIGGER_INTERVAL" :label="$t('执行间隔')" min-width="80")
    njs-column(prop="TRIGGER_INTERVAL_UNIT" :label="$t('间隔单位')" min-width="120" dict="TIME_UNIT")
    njs-column(prop="TRIGGER_REPEAT_COUNT" :label="$t('重复执行次数')" show-overflow-tooltip min-width="120" :formatter="(row, column, cellValue) => cellValue ? cellValue : $t('无限制')")
    njs-column(prop="TRIGGER_START_TIME" :label="$t('每日开始时间')" show-overflow-tooltip min-width="120")
    njs-column(prop="TRIGGER_END_TIME" :label="$t('每日结束时间')" show-overflow-tooltip min-width="120")
    njs-column(prop="TRIGGER_WEEK_DAY" :label="$t('星期执行日')" show-overflow-tooltip min-width="140" dict="WEEK_DAY")
    njs-column(prop="TRIGGER_EXPRESSION" :label="$t('表达式')" show-overflow-tooltip min-width="140")
    njs-column(prop="LAST_UPDATE_USER" show-overflow-tooltip :label="$t('最后更新人')" min-width="120" sortable)
    njs-column(prop="LAST_UPDATE_TIME"  show-overflow-tooltip sortable :label="$t('最后更新时间')" min-width="160")
    <!-----------     列配置  end ---------------------------------------------------------- -->

    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
    template(slot="more-used-query" slot-scope="{ formData }")
      njs-form-item(prop="TRIGGER_TYPE")
        njs-combobox(v-model="formData.TRIGGER_TYPE" dict="TRIGGER_TYPE" :placeholder="$t('请选择触发器类型')" clearable @change="$refs.datagrid.refresh()")
      njs-datagrid-search(v-model="formData" query-text="TRIGGER_NAME" hide-select :placeholder="$t('请输入触发器名称')")
    <!-----------     常用查询条件  end ---------------------------------------------------------- -->
</template>

<script>
export default {
  name: 'nbs-select-trigger',
  data () {
    return {
      rules: {
        TRIGGER_NAME: [
          { max: 20, message: this.$t('输入长度不可超过 20'), trigger: 'change' }
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
