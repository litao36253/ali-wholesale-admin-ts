<template lang="pug">
  .njs-combogrid
    njs-popover(placement="top" :title="popoverTitle" :width="popoverWidth" :disabled="popoverDisabled || !text" trigger="hover" :content="text")
      template(slot="reference")
        njs-input(:clearable="clearable" @clear="handleClear" @focus="handleInputFocus" @blur="isFocus = false" ref="textInput" v-model="text" :placeholder="realPlaceholder" :disabled="realDisabled" :size="size" @click.native="handeleClickInput")
          i(class="el-icon-search el-input__icon" slot="suffix" @click.native="handeleClickInput")
    njs-dialog(:title="dialogTitle" append-to-body :width="dialogWidth" :fullscreen="fullscreen" :top="top" :lock-scroll="lockScroll" :visible.sync="dialogVisible" :close-on-click-modal="closeOnClickModal" :close-on-press-escape="closeOnPressEscape" :show-close="showClose" :before-close="beforeClose" :center="center" @close="handleDialogClose" @open="handleDialogOpen" :class="['njs-combogrid-dialog']")
      njs-datagrid(
        ref="datagrid"
        :datagridId="datagridId"
        :service="service"
        :autoLoading="autoLoading"
        :data="data"
        :duration="duration"
        :pagination="pagination"
        :pageSizes="pageSizes"
        :fit="fit"
        :height="height"
        :maxHeight="maxHeight"
        :width="width"
        :selectable="selectable"
        :singleSelect="singleSelect"
        :multiple="multiple"
        :reserveSelection="true"
        :rowKey="realRowKey"
        :emptyText="emptyText"
        :hideHead="hideHead"
        :hideNeck="hideNeck"
        :title="title"
        :subheading="subheading"
        :buttonList="buttonList"
        :prevButtonList="prevButtonList"
        :rules="rules"
        :defaultQuery="defaultQuery"
        :loadingText="loadingText"
        :formLabelWidth="formLabelWidth"
        :notSaveQueries="notSaveQueries"
        @before-load="handleBeforeLoad"
        @load-success="handleLoadSuccess"
        @load-error="handleLoadError"
        @selection-change="handleSelectionChange"
        @current-change="handleCurrentRowChange"
        @select="handleSelect"
        @select-all="handleSelectAll"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave"
        @cell-click="handleCellClick"
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
        slot
        template(v-if="$scopedSlots['more-used-query']" :slot="$scopedSlots['more-used-query'] ? 'more-used-query' : ''" slot-scope="{ formData }")
          slot(name="more-used-query" :formData="formData")
        template(v-if="$scopedSlots['more-query']" :slot="$scopedSlots['more-query'] ? 'more-query' : ''" slot-scope="{ formData }")
          slot(name="more-query" :formData="formData")
        template(slot="fixed-card" slot-scope="{ formData }")
          slot(name="fixed-card" :formData="formData")
      template(slot='footer')
        njs-button(@click='dialogVisible = false' size="medium") {{$t('取 消')}}
        njs-button(type='primary', @click='handleOkClick' size="medium" :style="{marginLeft: '20px'}") {{$t('确 定')}}

</template>

<script>
export default {
  name: 'njs-combogrid',
  props: {
    value: {
      type: String,
      default: ''
    }, // v-model 绑定的值
    dataValue: { // 用于指定请求到数据作为值的字段名
      type: String,
      required: true
    },
    dataLabel: { // 用于指定请求到数据作为描述的字段名(多个字段名用逗号隔开)
      type: String,
      required: true
    },
    separator: { // 多字段作为label时的分隔符
      type: String,
      default: '-'
    },
    placeholder: { // 输入框占位文本
      type: String,
      default: window.app.$t('请选择')
    },
    clearable: { // 是否可清空
      type: Boolean,
      default: true
    },
    disabled: Boolean, // 禁用
    size: String, // 输入框尺寸
    popoverTitle: { // popover的标题
      type: String,
      default: window.app.$t('已选择')
    },
    popoverWidth: [String, Number], // popover的宽度
    popoverDisabled: {
      type: Boolean,
      default: false
    }, // Popover 是否可用
    dialogTitle: { // Dialog 的标题
      type: String,
      default: window.app.$t('请选择')
    },
    dialogWidth: { // Dialog 的宽度
      type: String,
      default: '50%'
    },
    fullscreen: { // 是否为全屏 Dialog
      type: Boolean,
      default: false
    },
    top: { // Dialog CSS 中的 margin-top 值
      type: String,
      default: '15vh'
    },
    lockScroll: { // 是否在 Dialog 出现时将 body 滚动锁定
      type: Boolean,
      default: true
    },
    closeOnClickModal: { // 是否可以通过点击 modal 关闭 Dialog
      type: Boolean,
      default: true
    },
    closeOnPressEscape: { // 是否可以通过按下 ESC 关闭 Dialog
      type: Boolean,
      default: true
    },
    showClose: { // 是否显示关闭按钮
      type: Boolean,
      default: true
    },
    beforeClose: Function, // 关闭前的回调，会暂停 Dialog 的关闭
    center: { // 是否对头部和底部采用居中布局
      type: Boolean,
      default: false
    },
    showOk: { // 是否显示确定按钮
      type: Boolean,
      default: true
    },
    okText: { // 确定按钮的文字
      type: String,
      default: window.app.$t('确定')
    },
    showCancel: { // 是否显示取消按钮
      type: Boolean,
      default: true
    },
    cancelText: { // 取消按钮的文字
      type: String,
      default: window.app.$t('取消')
    },

    // 以下是继承了 datagrid 组件的 prop

    datagridId: { // 组件ID,用于保存查询条件时与其他datagrid组件的查询条件作区分
      type: String,
      required: true
    },
    service: String, // 接口号
    autoLoading: { // 配置了service时，是否在created钩子里自动加载一次数据
      type: Boolean,
      default: true
    },
    data: Array, // 配置要展示的数据
    duration: Number, // 耗时
    pagination: { // 是否显示分页条
      type: Boolean,
      default: true
    },
    pageSizes: { // 选择每页展示数据量的选项集合。仅当pagination为true有效。
      type: Array,
      default () {
        return [10, 20, 30, 50]
      }
    },
    fit: { // 横向是否充满整个父级容器
      type: Boolean,
      default: true
    },
    height: { // 高度
      type: [Number, String],
      default: '50vh'
    },
    maxHeight: [Number, String],
    width: [Number, String],
    selectable: Function, // 仅当 multiple=true 有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
    singleSelect: { // 是否支持单选
      type: Boolean,
      default: false
    },
    multiple: Boolean, // 是否支持复选
    rowKey: {
      type: String,
      default: ''
    }, // 行数据的 Key
    emptyText: String, // 空数据时显示的文本内容，也可以通过 slot="empty" 设置
    hideHead: { // 是否隐藏datagrid组件的头部，即最上面一栏
      type: Boolean,
      default: false
    },
    hideNeck: { // 是否隐藏datagrid组件的颈部，即第二栏
      type: Boolean,
      default: false
    },
    title: String, // 标题
    subheading: String, // 副标题
    buttonList: { // 组件右上角的按钮列表。
      type: Array,
      default () {
        return []
      }
    },
    prevButtonList: { // 组件的前置按钮
      type: Array,
      default () {
        return ['refresh', 'hideColumns']
      }
    },
    rules: {
      type: Object,
      default () {
        return {}
      }
    }, // 自定义校验规则
    defaultQuery: {
      type: Object,
      default () {
        return {}
      }
    }, // 查询条件默认值
    loadingText: { // 加载时显示的提示文字
      type: String,
      default: window.app.$t('拼命加载中')
    },
    formLabelWidth: {
      type: String,
      default: '96px'
    },
    notSaveQueries: { // 保存查询条件时不保存的查询条件，回写查询条件也不回写
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      dialogVisible: false, // 是否显示弹框
      text: '', // input 框中的文字
      selection: [], // 选中项
      realPlaceholder: '',
      realDisabled: true,
      realRowKey: '', // 真实的datagrid组件的rowKey属性
      isFocus: false // 标记当前文本框是否处于焦点状态
    }
  },
  created () {
    this.realRowKey = this.rowKey || this.dataValue
    if (this.multiple && this.singleSelect) {
      console.error(this.$t('combogrid 组件不能同时支持单选和多选！请注意 multiple 和 single-select 属性！'))
    }
    this.loadText()
  },
  methods: {
    refresh () {
      this.dialogVisible && this.$refs.datagrid.refresh()
    },
    // 切换“更多查询条件”的收缩展开状态
    toggleMoreQuery (openState) {
      this.dialogVisible && this.$refs.datagrid.toggleMoreQuery(openState)
    },
    // 清空事件处理函数
    handleClear () {
      this.$emit('input', '')
      this.$nextTick(() => {
        this.loadText()
        this.selection = []
        this.$emit('clear')
        this.$emit('change', '')
      })
    },
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    toggleRowSelection (row, selected) {
      this.dialogVisible && this.$refs.datagrid.toggleRowSelection(row, selected)
    },
    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection () {
      this.dialogVisible && this.$refs.datagrid.toggleAllSelection()
    },
    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow (row) {
      this.dialogVisible && this.$refs.datagrid.setCurrentRow(row)
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort () {
      this.dialogVisible && this.$refs.datagrid.clearSort()
    },
    // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
    clearFilter (columnKey) {
      this.dialogVisible && this.$refs.datagrid.clearFilter(columnKey)
    },
    // 对 datagrid 进行重新布局。当 datagrid 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout () {
      this.dialogVisible && this.$refs.datagrid.doLayout()
    },
    // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
    sort (sort) {
      this.dialogVisible && this.$refs.datagrid.sort(sort)
    },
    // 用来改变datagrid的loading状态
    setLoading (loading) {
      this.dialogVisible && this.$refs.datagrid.setLoading(loading)
    },
    // 对话框关闭事件处理函数
    handleDialogClose () {
      this.$emit('blur') // 对话框打开就认为combogrid获得焦点
    },
    // 对话框打开事件处理函数
    handleDialogOpen () {
      this.$emit('focus') // 对话框打开就认为combogrid失去焦点
      this.loadDataTodatagrid()
    },
    // 点击确定事件处理函数
    handleOkClick (event, row) {
      if (this.multiple) {
        let vals = []
        this.selection = this.$refs.datagrid.getAttr('selection')
        this.selection.forEach((item) => {
          vals.push(item[this.dataValue])
        })
        this.$emit('input', vals.join(','))
        this.$emit('change', vals.join(','), JSON.parse(JSON.stringify(this.selection))) // 向父级广播change事件
      } else if (this.singleSelect) {
        let currentRow = row || this.$refs.datagrid.getAttr('currentRow')
        if (currentRow) {
          this.selection = [currentRow]
          this.$emit('input', currentRow[this.dataValue])
          this.$emit('change', currentRow[this.dataValue], JSON.parse(JSON.stringify(this.selection))) // 向父级广播change事件
        } else {
          this.selection = []
          this.$emit('input', '')
          this.$emit('change', '', JSON.parse(JSON.stringify(this.selection))) // 向父级广播change事件
        }
      }
      this.$nextTick(() => {
        this.dialogVisible = false // 计算完成输入框里展示的文字后再将弹框的可见状态标识置为 false
      })
      // this.computedText()
    },
    // 计算input框内的文本内容
    computedText () {
      if (this.multiple) {
        let bigTexts = []
        this.selection.forEach((item) => {
          let texts = []
          let dataLabel = this.dataLabel ? this.dataLabel.split(',') : []
          dataLabel.forEach((label) => {
            texts.push(item[label])
          })
          bigTexts.push(texts.join(this.separator))
        })
        this.text = bigTexts.join(' , ')
      } else if (this.singleSelect) {
        let currentRow = this.selection[0]
        if (currentRow) {
          let texts = []
          let dataLabel = this.dataLabel ? this.dataLabel.split(',') : []
          dataLabel.forEach((label) => {
            texts.push(currentRow[label])
          })
          this.text = texts.join(this.separator)
        } else {
          this.selection = []
          this.text = ''
        }
      }
    },
    // 计算选中行数据的集合
    computedSelection (tableData) {
      this.selection = []
      if (this.multiple) {
        let vals = this.value ? this.value.split(',') : []
        vals.forEach((val) => {
          if (val) {
            for (let i = 0; i < tableData.length; i++) {
              if (tableData[i][this.dataValue] === val) {
                this.selection.push(tableData[i])
                break
              }
            }
          }
        })
      } else if (this.singleSelect) {
        for (let i = 0; i < tableData.length; i++) {
          if (tableData[i][this.dataValue] === this.value) {
            this.selection.push(tableData[i])
            break
          }
        }
      }
    },
    // 给combogrid绑定数据后，可调用此方法加载显示文字
    loadText () {
      this.realDisabled = true
      this.text = ''
      if (this.value) { // 有初始选中值时
        if (this.data) {
          this.computedSelection(this.data)
          this.computedText()
          this.realDisabled = this.disabled
          this.realPlaceholder = this.placeholder
        } else {
          let reqJson = { // 需要接口支持 按串查询且不分页！！！！！！！！！！！！！！！！！！！！！
            service: this.service,
            page: 1,
            pagecount: 1000,
            pageoffset: 1,
            rows: 1000
          }
          reqJson[this.dataValue] = this.value
          this.realPlaceholder = this.$t('正在加载，请稍候...')
          this.$ajaxRequest([
            reqJson
          ]).then((result) => {
            if (result.code === '0') {
              this.realDisabled = this.disabled
              this.realPlaceholder = this.placeholder
              this.computedSelection(result.data)
              this.computedText()
            } else {
              this.realPlaceholder = this.$t('加载失败，请刷新重试')
            }
          }).catch((err) => {
            console.log(err)
            this.realPlaceholder = this.$t('加载失败，请刷新重试')
          })
        }
      } else {
        this.realDisabled = this.disabled
        this.realPlaceholder = this.placeholder
        // this.$refs.datagrid.currentRow = null
      }
    },
    // 文本框获得焦点
    handleInputFocus () {
      this.isFocus = true
      // this.$nextTick(() => {
      //   this.$refs.textInput.blur()
      // })
    },
    handeleClickInput ($event) {
      console.log($event)
      if ($event.target.tagName === 'INPUT' || $event.target.className === 'el-icon-search el-input__icon') { // 点击input本身或搜索图标时弹框
        if (this.isFocus) {
          this.dialogVisible = true
        }
      }
    },
    // 给内嵌datagrid回写数据
    loadDataTodatagrid () {
      this.$nextTick(() => {
        if (this.multiple) {
          this.$refs.datagrid.clearSelection()
          this.selection.forEach((row) => {
            this.$refs.datagrid.toggleRowSelection(row, true)
          })
        } else if (this.singleSelect) {
          this.$refs.datagrid.currentRow = this.selection[0] || null
          this.$refs.datagrid.singleSelectRewrite()
        }
        this.$refs.datagrid.tableData = JSON.parse(JSON.stringify(this.$refs.datagrid.tableData))
      })
    },
    // 获取combogrid组件的属性
    getAttr (attr) {
      if (attr === 'req' || attr === 'formData' || attr === 'tableData' || attr === 'openMoreQuery' || attr === 'total' || attr === 'pageSize' || attr === 'currentPage' || attr === 'pageCount' || attr === 'requeryTime') {
        if (this.$refs.datagrid) {
          return this.$refs.datagrid.getAttr(attr)
        } else {
          console.error(`${this.$t('要获取')} ${attr} ${this.$t('必须让 combogrid 组件内置的 datagrid 组件完成一次加载！')}`)
        }
      } else if (attr === 'selection') {
        return JSON.parse(JSON.stringify(this.selection))
      } else if (attr === 'text') {
        return this.text
      } else if (attr === 'dialogVisible') {
        return this.dialogVisible
      }
    },
    // before-load 事件处理函数
    handleBeforeLoad (req, callback) {
      this.$emit('before-load', req, callback)
    },
    // load-success 事件处理函数
    handleLoadSuccess (data, callback) {
      this.$emit('load-success', data, callback)
    },
    // 当多选选择项发生变化时会触发该事件
    handleSelectionChange (selection) {
      this.$emit('selection-change', selection)
    },
    handleCurrentRowChange (currentRow, oldCurrentRow) {
      this.$emit('current-change', currentRow, oldCurrentRow)
    },
    // load-error 事件处理函数
    handleLoadError (err) {
      this.$emit('load-error', err)
    },
    handleSelect (selection, row) {
      this.$emit('select', selection, row)
    },
    // 当用户手动勾选全选 Checkbox 时触发的事件
    handleSelectAll (selection) {
      this.$emit('select-all', selection)
    },
    // 当单元格 hover 进入时会触发该事件
    handleCellMouseEnter (row, column, cell, event) {
      this.$emit('cell-mouse-enter', row, column, cell, event)
    },
    // 当单元格 hover 退出时会触发该事件
    handleCellMouseLeave (row, column, cell, event) {
      this.$emit('cell-mouse-leave', row, column, cell, event)
    },
    // 当某个单元格被点击时会触发该事件
    handleCellClick (row, column, cell, event) {
      this.$emit('cell-click', row, column, cell, event)
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
      if (this.singleSelect) { // 单选时双击某行即选中
        this.handleOkClick(event, row)
      }
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
    // 用户点击上一页按钮改变当前页后触发
    handlePrevClick (val) {
      this.$emit('prev-click', val)
    },
    // 用户点击下一页按钮改变当前页后触发
    handleNextClick (val) {
      this.$emit('next-click', val)
    },
    handleSizeChange (val) {
      this.$emit('size-change', val)
    },
    handleCurrentPageChange (val) {
      this.$emit('current-page-change', val)
    }
  },
  watch: {
    value () {
      if (this.dialogVisible) {
        this.computedText()
      } else {
        this.loadText()
      }
    },
    disabled (val) {
      this.realDisabled = val
    }
  }
}
</script>

<style lang="stylus">
  .njs-combogrid-dialog
    .el-dialog__body
      padding 0
</style>
