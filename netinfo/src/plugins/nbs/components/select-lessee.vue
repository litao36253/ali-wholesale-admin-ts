<template lang="pug">
  njs-combogrid(
  hide-head
  auto-loading
  :default-query="{QUERY_TYPE:'1'}"
  datagrid-id="select_lessee_P0112404"
  v-model="bindValue"
  :dialog-title="$t('选择租户')"
  :placeholder="$t('请选择租户')"
  :single-select="singleSelect"
  :multiple="multiple"
  ref="combogrid"
  service="P0112404"
  :rules="rules"
  data-value="LSE_ID"
  data-label="LSE_ID,LSE_NAME"
  height="60vh"
  top="10vh"
  dialog-width="80vw"
  :clearable="clearable"
  :disabled="disabled"
  :before-close="beforeClose"
  @blur="handleBlur"
  @focus="handleFocus"
  @change="handleChange"
  @clear="handleClear"
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
    njs-column(prop="LSE_ID" :label="$t('租户编号')" show-overflow-tooltip sortable min-width="100")
    njs-column(prop="LSE_NAME" :label="$t('租户名称')" show-overflow-tooltip sortable min-width="100")
    njs-column(prop="LSE_TYPE" :label="$t('租户类型')" min-width="100" dict="LSE_TYPE")
    njs-column(prop="LSE_STAT" :label="$t('租户状态')" min-width="100" dict="LSE_STAT" type="state" :state-map="{'0': 'success', '1': 'danger'}")
    njs-column(prop="OPEN_DATE" :label="$t('开户日期')" show-overflow-tooltip min-width="100")
    njs-column(prop="CANCEL_DATE" :label="$t('销户日期')" show-overflow-tooltip min-width="100")
    njs-column(prop="EXP_DATE" :label="$t('有效期')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_NAME" :label="$t('联系人')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_TEL" :label="$t('联系电话')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_EMAIL" :label="$t('联系邮箱')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_ADD" :label="$t('联系地址')" show-overflow-tooltip min-width="140")
    njs-column(prop="LAST_UPDATE_USER" show-overflow-tooltip :label="$t('最后更新人')" min-width="120" sortable)
    njs-column(prop="LAST_UPDATE_TIME"  show-overflow-tooltip sortable :label="$t('最后更新时间')" min-width="160")
    <!-----------     列配置  end ---------------------------------------------------------- -->

    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
    template(slot="more-used-query" slot-scope="{ formData }")
      njs-form-item(prop="LSE_TYPE")
        njs-combobox(v-model="formData.LSE_TYPE" dict="LSE_TYPE" :placeholder="$t('请选择租户类型')" clearable @change="$refs.combogrid.refresh()")
      njs-form-item(prop="LSE_STAT")
        njs-combobox(v-model="formData.LSE_STAT" dict="LSE_STAT" :placeholder="$t('请选择租户状态')" clearable @change="$refs.combogrid.refresh()")
      njs-datagrid-search(v-model="formData" :selectItems="selectItems")
    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
</template>

<script>
export default {
  name: 'nbs-select-lessee',
  data () {
    return {
      rules: {
        QUERY_TEXT: { max: 40, message: window.app.$t('长度不能超过 40'), trigger: 'change' }
      },
      selectItems: [
        { label: '全部', value: '1', placeholder: window.app.$t('请输入租户名称或租户联系人') },
        { label: '租户名称', value: '3', placeholder: window.app.$t('请输入租户名称') },
        { label: '租户联系人', value: '2', placeholder: window.app.$t('请输入租户联系人') }
      ]
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
    handleClear () {
      this.$emit('clear')
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
