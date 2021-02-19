<template lang="pug">
  njs-combogrid(
  :default-query="{QUERY_TYPE:'1'}"
  hide-head
  auto-loading
  datagrid-id="select_system_dict_P0102401"
  v-model="bindValue"
  :dialog-title="$t('选择数据字典')"
  :placeholder="$t('请选择数据字典')"
  single-select
  ref="combogrid"
  service="P0102401"
  :rules="rules"
  data-value="DICT_CODE"
  data-label="DICT_CODE"
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
    njs-column(prop="DICT_CODE" :label="$t('字典代码')" show-overflow-tooltip sortable min-width="120")
    njs-column(prop="DICT_NAME" :label="$t('字典名称')" show-overflow-tooltip sortable min-width="120")
    njs-column(prop="DICT_TYPE" :label="$t('字典分类')" min-width="120" dict="DICT_TYPE")
    njs-column(prop="MAINTAIN_FLAG" :label="$t('维护标识')" min-width="120" dict="MAINTAIN_FLAG" type="state" :state-map="{'0': 'success', '1': 'danger', '2': 'warning', '3': 'info'}")
    njs-column(prop="LAST_UPDATE_USER" :label="$t('最后更新人')" sortable min-width="100")
    njs-column(prop="LAST_UPDATE_TIME" :label="$t('最后更新时间')" min-width="180" sortable)
    njs-column(:label="$t('字典项')" min-width="160" fixed="right")
      template(slot-scope="{ row, column, $index }")
        njs-button(type="text" @click.stop="handlerShowDetails(row)") {{$t('查看字典项')}}
    <!-----------     列配置  end ---------------------------------------------------------- -->

    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
    template(slot="more-used-query" slot-scope="{ formData }")
      njs-form-item(prop="DICT_TYPE")
        njs-combobox(v-model="formData.DICT_TYPE" dict="DICT_TYPE" :placeholder="$t('请选择字典类型')" clearable @change="$refs.combogrid.refresh()")
      njs-form-item(prop="MAINTAIN_FLAG")
        njs-combobox(v-model="formData.MAINTAIN_FLAG" dict="MAINTAIN_FLAG" :placeholder="$t('请选择维护标识')" clearable @change="$refs.combogrid.refresh()")
      njs-datagrid-search(v-model="formData" :selectItems="selectItems" @select-change="queryTypeChange")
    <!-----------     常用查询条件  end ---------------------------------------------------------- -->

    <!-- 右侧卡片的插槽 ------------------- start ---- litao -------------------------------------------- -->
    template(slot="fixed-card" slot-scope="{ formData }")
      njs-datagrid-card(:visible.sync="showCard" width="45%" hide-title)
        njs-datagrid(
          datagrid-id="select_system_dict_item_P0102405"
          service="P0102405"
          ref="dictItemDatagrid"
          :title="$t('查看字典项')"
          :subheading="`${$t('查看')} ${oldRow.DICT_CODE} ${$t('的字典项。')}`"
          @before-load="handleDictItemBeforeLoad"
          :auto-loading="true"
        )
          njs-column(prop="DICT_ORD" :label="$t('取值顺序')" sortable show-overflow-tooltip)
          njs-column(prop="DICT_ITEM" :label="$t('字典项代码')" sortable show-overflow-tooltip)
          njs-column(prop="DICT_ITEM_NAME" :label="$t('字典项名称')" sortable show-overflow-tooltip)
          njs-column(prop="MAINTAIN_FLAG" :label="$t('维护标识')" sortable show-overflow-tooltip dict="MAINTAIN_FLAG" type="state" :state-map="{'0': 'success', '1': 'danger', '2': 'warning', '3': 'info'}")
      <!-- 右侧卡片的插槽 ------------------------------------------ end ------------------------------>
</template>

<script>
import { validateEnNumUdl } from '@/validator/common'

export default {
  name: 'nbs-select-dict',
  data () {
    const DICT_NAME_RULE = [
      { max: 40, message: window.app.$t('字典名称长度不能超过 40'), trigger: 'change' }
    ]
    const DICT_CODE_RULE = [
      { validator: validateEnNumUdl, trigger: 'change' },
      { max: 32, message: window.app.$t('字典代码长度不能超过 32'), trigger: 'change' }
    ]
    return {
      showCard: false, // 是否显示右侧卡片
      oldRow: {}, // 老的选中行
      rules: { QUERY_TEXT: DICT_NAME_RULE },
      selectItems: [
        { label: window.app.$t('全部'), value: '1', placeholder: window.app.$t('请输入字典代码或字典名称') },
        { label: window.app.$t('字典代码'), value: '2', placeholder: window.app.$t('请输入字典代码') },
        { label: window.app.$t('字典名称'), value: '3', placeholder: window.app.$t('请输入字典名称') }
      ],
      DICT_NAME_RULE,
      DICT_CODE_RULE
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
    },
    // 点击管理字典项
    handlerShowDetails (row) {
      this.showCard = true
      this.oldRow = row || {}
      this.$refs.combogrid.setCurrentRow(row)
      this.$refs.dictItemDatagrid.refresh()
    },
    // 查询类型发生变化时
    queryTypeChange (val) {
      if (val === '1') { // 全部
        this.rules = { QUERY_TEXT: this.DICT_NAME_RULE }
      } else if (val === '2') { // 字典代码
        this.rules = { QUERY_TEXT: this.DICT_CODE_RULE }
      } else if (val === '3') { // 字典名称
        this.rules = { QUERY_TEXT: this.DICT_NAME_RULE }
      }
    },
    // 字典项刷新之前
    handleDictItemBeforeLoad (req, callback) {
      req[0].DICT_CODE = this.oldRow.DICT_CODE
      callback(req)
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
