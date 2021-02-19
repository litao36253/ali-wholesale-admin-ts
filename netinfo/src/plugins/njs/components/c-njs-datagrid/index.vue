<template lang="pug">
  .njs-datagrid(v-loading="loading" :element-loading-text="loadingText" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)" :style="{height: computedHeight, maxHeight: computedMaxHeight, width: computedWidth}")
    .njs-datagrid-head(v-if="!hideHead")
      .njs-datagrid-title-wrap
        .njs-datagrid-title(v-html="title")
        .njs-datagrid-subheading(v-html="subheading")
      .njs-datagrid-buttons
        njs-button(v-for="(btn,i) in buttonList" :key="`topBtnList${i}`" size="small" :icon="btn.icon" :disabled="btn.disabled" @click="btnListClick($event,btn)") {{ btn.text }}
    .njs-datagrid-neck(v-if="!hideNeck")
      .njs-datagrid-prvbtns
        template(v-for="(btn,i) in prevButtonList")
          njs-tooltip(v-if="btn==='refresh'" effect="dark" :content="preBtnTooltips[btn]" placement="top")
            njs-button(@click="refresh" icon="el-icon-refresh" size="small" :class="['njs-datagrid-prvbtn']")
          njs-tooltip(v-else-if="btn==='hideColumns'" effect="dark" :content="preBtnTooltips[btn]" placement="top")
            njs-dropdown(trigger="click" placement="bottom-start")
              njs-button(icon="el-icon-setting" size="small" :class="['njs-datagrid-prvbtn']")
              njs-dropdown-menu(slot='dropdown')
                li(class="njs-datagrid-hide-colum")
                  njs-checkbox-group(v-model="showColumns")
                    njs-checkbox(v-for="colum in columns" :label="colum.prop" :key="'showColumn-' + colum.prop") {{ colum.label }}
          njs-tooltip(v-if="btn==='export'" effect="dark" :content="preBtnTooltips[btn]" placement="top")
            njs-button(@click="handleExport" icon="el-icon-download" size="small" :class="['njs-datagrid-prvbtn']")
      .njs-datagrid-query
        njs-form(ref="moreUsedQuery" :model="formData" label-position="right" size="small" inline :rules="rules" :class="['njs-datagrid-more-used-query']")
          slot(name="more-used-query" :formData="formData")
        njs-dropdown(size='small', type="primary" v-if="$scopedSlots['more-query']" @command="myQueryCommand")
          njs-button(type="primary" size="small") {{$t('我的查询')}}
            i.el-icon-arrow-down.el-icon--right
          njs-dropdown-menu(slot='dropdown')
            njs-dropdown-item(v-if="queryList.length===0" disabled) {{$t('你没有保存查询条件')}}
            njs-dropdown-item(v-for="item in queryList" :command="item" :class="['njs-datagrid-query-item']")
              span(:style="{paddingRight: '40px'}") {{ item['QUERY_CONDITION_NAME'] }}
              i(class="el-icon-delete" :class="['njs-datagrid-del-query']" @click.stop="deleteQuery(item)")
        njs-popover(v-if="$scopedSlots['more-query']" trigger="click" ref="moreQueryDrop")
          njs-button(type="text" slot="reference" :class="['njs-datagrid-more-query-btn']") {{$t('更多查询')}}
          njs-form(:class="['njs-datagrid-more']" ref="moreQueryForm" :model="formData" label-position="right" :label-width="formLabelWidth" size="small" :rules="rules")
            slot(name="more-query" :formData="formData")
          .njs-datagrid-query-btngroup
            njs-button(@click="clickRefresh" size="small" type="primary") {{$t('搜索')}}
            njs-button(@click="resetFields" size="small" :style="{'margin-left':'20px'}") {{$t('重置')}}
            njs-form(ref="queryName" :model='queryName' size="small" :style="{'margin-left':'20px'}" :rules="queryNameRules")
              njs-form-item(prop="QUERY_NAME")
                njs-input(:placeholder="$t('请输入查询名称')" v-model="queryName.QUERY_NAME" :style="{'width':'200px'}")
                  njs-button(slot="append" type="primary" @click="saveQuery") {{$t('保存')}}
    .njs-datagrid-table
      njs-table(ref="table" :key="`${datagridId}_table`" :row-key="rowKey" :fit="true" :highlight-current-row="singleSelect" :data="tableData" :style="{width: '100%'}" height="100%" :empty-text="realEmptyText" @selection-change="handleSelectionChange" @current-change="handleCurrentRowChange" @select="handleSelect" @select-all="handleSelectAll" @cell-mouse-enter="handleCellMouseEnter" @cell-mouse-leave="handleCellMouseLeave" @cell-click="handleCellClick" @cell-dblclick="handleCellDbclick" @row-click="handleRowClick" @row-contextmenu="handleRowContextmenu" @row-dblclick="handleRowDbclick" @header-click="handleHeaderClick" @header-contextmenu="handleHeaderContextmenu" @sort-change="handleSortChange" header-row-class-name="njs-datagrid-table-header" size="medium")
        njs-table-column(v-if="multiple" type="selection" width="26" :selectable="selectable" :reserve-selection="reserveSelection")
        slot
    .njs-datagrid-foot(v-if="pagination")
      .njs-datagrid-page-info
        span {{$t('共')}} {{total}} {{$t('条 / 耗时')}}{{realDuration}}s
        span.njs-datagrid-page-size
          span {{$t('每页')}}
          njs-select(v-model="pageSize" size="mini" :style="{width:'62px'}" :clearable="false")
            njs-option(v-for="item in pageSizes" :key="item" :lable="item" :value="item")
          span {{$t('条')}}
      .njs-datagrid-select-num(v-if="reserveSelection && (singleSelect || multiple)")
        span {{$t('已选数量：')}}
        span(style="color: red;") {{selectNum}}
      njs-pagination(@current-change='handleCurrentChange' @prev-click="handlePrevClick" @next-click="handleNextClick" background :current-page.sync='currentPage', :page-size='pageSize', layout='prev, pager, next, jumper', :total='total')
    slot(name="fixed-card" :formData="formData")

    <!----       导出对话框 start -------------------------------->
    njs-dialog(:title="$t('导出选项')" :visible.sync="exportDialogVisible" width="60%")
      njs-form(ref="exportForm" :model="exportFormData" :rules="exportRules" v-if="exportDialogVisible")
        njs-form-item(prop="fileName" :label="$t('导出文件名')")
          njs-input(v-model="exportFormData.fileName" :placeholder="$t('请填写导出的文件名')")
        njs-form-item(prop="exportColumns" :label="$t('导出列')")
          njs-checkbox-group(v-model="exportFormData.exportColumns")
            njs-checkbox(v-for="column in columns" :label="column.prop" :key="'export-' + column.prop") {{ column.label }}
      template(slot="footer")
        njs-button(type="primary" @click="exportExcel") {{ $t('导 出') }}
        njs-button(@click="exportDialogVisible = false") {{ $t('取 消') }}
    <!----       导出对话框 end -------------------------------->
</template>

<script>
import { mapGetters } from 'vuex'
import mixinsExport from './mixins/export' // 引入导出功能的代码
export default {
  name: 'njs-datagrid',
  mixins: [mixinsExport],
  created () {
    if (this.data) {
      this.total = this.data.length
      this.loadData()
      if (this.duration) {
        this.realDuration = parseInt(this.duration) / 1000
      }
    }
  },
  mounted () {
    // 获取保存的查询条件
    this.$scopedSlots['more-query'] && this.refreshQuery()
    // 给查询表单动态绑定初始值
    if (this.$refs.moreUsedQuery) {
      this.$refs.moreUsedQuery.$children[0].fields.forEach((item) => {
        if (!this.formData[item.prop]) {
          this.$set(this.formData, item.prop, '')
        }
      })
      this.$nextTick(() => {
        if (!this.autoLoading) {
          this.$refs.moreUsedQuery.clearValidate()
        }
      })
    }
    if (this.$refs.moreQueryForm) {
      this.$refs.moreQueryForm.$children[0].fields.forEach((item) => {
        if (!this.formData[item.prop]) {
          this.$set(this.formData, item.prop, '')
        }
      })
      this.$nextTick(() => {
        if (!this.autoLoading) {
          this.$refs.moreQueryForm.clearValidate()
        }
      })
    }
    // 初始化创建表格的列集合和表格显示的列集合
    this.$refs.table.$children.forEach((item) => {
      if (item.prop) {
        this.columns.push(item)
        if (item.hide === false) { // 初始状态不为隐藏的列才在初始时显示
          // this.showColumns.push(item.prop)
          if (this.showColumns) {
            this.showColumns += `,${item.prop}`
          } else {
            this.showColumns += item.prop
          }
        }
      }
    })
    // 是否自动加载一次
    if (this.autoLoading) {
      this.refresh()
    }
  },
  data () {
    return {
      formData: { // 查询条件绑定的数据
        ...this.defaultQuery
      },
      loading: false, // 是否正在加载
      queryName: { // 保存查询条件时的数据
        QUERY_NAME: ''
      },
      queryNameRules: { // 保存查询条件时的校验规则
        QUERY_NAME: [
          { required: true, message: this.$t('请输入查询名称'), trigger: 'change' },
          { min: 3, max: 20, message: this.$t('长度在 3 到 20 个字符'), trigger: 'change' }
        ]
      },
      tableData: [], // 表格绑定的数据
      pageSize: this.pageSizes[0], // 每页展示数量
      currentPage: 1, // 当前页数
      total: 0, // 总数据量
      realDuration: 0, // 真实的请求耗时
      selection: [], // 选中项
      currentRow: null, // 单选时的当前项目
      oldCurrentRow: null, // 单选时的老的当前项目
      realEmptyText: this.emptyText, // 无数据时的提示文字
      queryList: [], // 保存的查询条件集合
      preBtnTooltips: { // 预置按钮的提示文字
        refresh: this.$t('刷新'),
        hideColumns: this.$t('选择展示列'),
        export: this.$t('导出')
      },
      columns: [], // 表格的列集合
      showColumns: '' // 表格显示的列集合
    }
  },
  props: {
    datagridId: { // 组件ID,用于保存查询条件时与其他datagrid组件的查询条件作区分
      type: String,
      required: true
    },
    service: String, // 接口号
    autoLoading: { // 配置了service时，是否在created钩子里自动加载一次数据
      type: Boolean,
      default: false
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
      default: false
    },
    height: { // 高度
      type: [Number, String],
      default: '100%'
    },
    maxHeight: [Number, String],
    width: [Number, String],
    selectable: Function, // 仅当 multiple=true 有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选
    singleSelect: { // 是否支持单选
      type: Boolean,
      default: false
    },
    multiple: Boolean, // 是否支持复选
    reserveSelection: {
      type: Boolean,
      default: false
    }, // 类型为 Boolean，为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）
    rowKey: [Function, String], // 行数据的 Key
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
  methods: {
    // 点击右上角按钮执行的方法
    btnListClick ($event, btn) {
      if (btn.type === 'delete') {
        if (this.multiple) {
          if (this.selection.length) {
            this.$confirm(btn.confirm || this.$t('你确定要删除选中的数据吗？'), this.$t('提示'), {
              confirmButtonText: this.$t('确定'),
              cancelButtonText: this.$t('取消'),
              type: 'warning'
            }).then(() => {
              let reqJson = {
                service: btn.service
              }
              if (btn.max === undefined) {
                if (this.selection.length > 100) {
                  if (btn.maxText) {
                    this.$message.warning(btn.maxText)
                  } else {
                    this.$message.warning(this.$t('批量删除数量不能超过 ') + 100)
                  }
                  return
                }
              } else {
                if (this.selection.length > btn.max) {
                  if (btn.maxText) {
                    this.$message.warning(btn.maxText)
                  } else {
                    this.$message.warning(this.$t('批量删除数量不能超过 ') + btn.max)
                  }
                  return
                }
              }
              let keys = []
              this.selection.forEach((item) => {
                keys.push(item[btn.key])
              })
              reqJson[btn.key] = keys.join(',')
              if (btn.query) { // 如果调用删除接口有附加的条件
                reqJson = { ...reqJson, ...btn.query }
              }
              this.$ajaxRequest([reqJson]).then((result) => {
                if (result.code === '0') {
                  this.$message({
                    type: 'success',
                    message: btn.successText || this.$t('删除成功！')
                  })
                  this.clearSelection()
                  this.refresh()
                  btn.success && btn.success(result)
                } else {
                  this.$message.error(result.head.msg)
                  btn.fail && btn.fail(result.head)
                }
              }).catch((err) => {
                console.log(err)
                btn.fail && btn.fail(err)
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('已取消删除')
              })
            })
          } else {
            this.$message.warning(btn.unchecked || this.$t('请勾选要删除的数据！'))
          }
        }
      } else {
        btn.handler && btn.handler($event, btn)
      }
    },
    // 选中一个存储的查询条件组
    myQueryCommand (query) {
      let json = JSON.parse(query.QUERY_JSON.replace(/(&quot;)/g, () => {
        return '"'
      }))
      for (let attr in json) {
        if (!this.notSaveQueries.some((notSave) => {
          return notSave === attr
        })) {
          this.formData[attr] = json[attr]
        }
      }
      this.refresh()
    },
    // 点击搜索按钮
    clickRefresh () {
      this.$refs.moreQueryDrop.visible = false
      this.refresh()
    },
    // 刷新
    refresh (refreshSucces) {
      if (!this.data) {
        let validate1 = true
        let validate2 = true
        this.$refs.moreUsedQuery && this.$refs.moreUsedQuery.validate((result) => {
          validate1 = result
        })
        this.$refs.moreQueryForm && this.$refs.moreQueryForm.validate((result) => {
          !result && this.$message.error(this.$t('更多查询条件输入不合法！'))
          validate2 = result
        })
        if (validate1 && validate2) {
          this.loading = true
          this.$nextTick(() => {
            this.realEmptyText = ' '
            // this.total = 0
            this.tableData = []
            this.realDuration = 0
            let submitBeforeCallback
            this.$emit('before-load', JSON.parse(JSON.stringify(this.req)), (val) => {
              submitBeforeCallback = val
            })
            if (submitBeforeCallback === undefined) {
              this.$ajaxRequest(this.req).then((result) => {
                this.$refs.moreUsedQuery && this.$refs.moreUsedQuery.clearValidate() // 清空常用条件校验结果
                this.$refs.moreQueryForm && this.$refs.moreQueryForm.clearValidate() // 清空更多条件校验结果
                this.refreshSucces(result)
                refreshSucces && refreshSucces(result)
              }).catch((err) => {
                this.$emit('load-error', err)
                console.log(err)
                this.loading = false
                this.realEmptyText = this.emptyText
              })
            } else {
              if (submitBeforeCallback !== false) {
                this.$ajaxRequest(submitBeforeCallback).then((result) => {
                  this.$refs.moreUsedQuery && this.$refs.moreUsedQuery.clearValidate() // 清空常用条件校验结果
                  this.$refs.moreQueryForm && this.$refs.moreQueryForm.clearValidate() // 清空更多条件校验结果
                  this.refreshSucces(result)
                  refreshSucces && refreshSucces(result)
                }).catch((err) => {
                  this.$emit('load-error', err)
                  console.log(err)
                  this.loading = false
                  this.realEmptyText = this.emptyText
                })
              }
            }
          })
        }
      }
    },
    // 请求刷新接口成功
    refreshSucces (result) {
      if (result.code === '0') {
        let callback
        this.$emit('load-success', JSON.parse(JSON.stringify(result.data)), (val) => {
          callback = val
        })
        let { head } = result
        if (callback === undefined) {
          this.tableData = result.data
        } else {
          if (callback === false) {
            this.total = 0
            this.tableData = []
            this.realDuration = parseInt(head.RUN_TIMES) / 1000
            this.loading = false
            this.realEmptyText = this.emptyText
            return
          } else {
            this.tableData = callback
          }
        }
        this.total = parseInt(head.DATA_ROWS)
        this.realDuration = parseInt(head.RUN_TIMES) / 1000
      } else {
        this.$emit('load-error', result)
      }
      this.loading = false
      this.realEmptyText = this.emptyText
    },
    // 重置查询条件
    resetFields () {
      this.$refs.moreQueryForm && this.$refs.moreQueryForm.resetFields()
    },
    // 保存查询条件
    saveQuery () {
      this.$refs.queryName.validate((result) => {
        if (result) {
          let json = {}
          for (let attr in this.formData) {
            if (!this.notSaveQueries.some((notSave) => {
              return notSave === attr
            })) {
              json[attr] = this.formData[attr]
            }
          }
          this.$ajaxRequest([{
            service: 'U0301101',
            DATAGRID_ID: this.datagridId,
            QUERY_CONDITION_NAME: this.queryName.QUERY_NAME,
            QUERY_JSON: JSON.stringify(json)
          }]).then((result) => {
            if (result.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('保存查询条件成功，可在“我的查询”中使用。')
              })
              this.$refs.queryName.resetFields()
              this.refreshQuery()
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 刷新保存的查询条件
    refreshQuery () {
      this.$ajaxRequest([{
        service: 'U0301403',
        DATAGRID_ID: this.datagridId
      }]).then((result) => {
        if (result.code === '0') {
          this.queryList = result.data
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    // 删除查询
    deleteQuery (query) {
      this.$confirm(`${this.$t('你确定要删除名为')}“${query.QUERY_CONDITION_NAME}”${this.$t('的查询吗？')}`, this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'U0301202',
          HIS_ID: query.HIS_ID
        }]).then((result) => {
          if (result.code === '0') {
            this.refreshQuery()
            this.$message({
              type: 'success',
              message: `${this.$t('删除名为')}“${query.QUERY_CONDITION_NAME}”${this.$t('的查询成功。')}`
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消删除')
        })
      })
    },
    // 分页条当前页码变化
    handleCurrentChange (val) {
      if (this.data) {
        this.loadData()
      } else {
        this.$nextTick(() => {
          this.refresh()
        })
      }
      this.$emit('current-page-change', val)
    },
    // 载入静态数据
    loadData () {
      let tableData = []
      let start = (this.currentPage - 1) * this.pageSize
      let end = this.currentPage * this.pageSize
      this.data.forEach((item, index) => {
        if (index >= start && index < end) {
          tableData.push(item)
        } else {
          return false
        }
      })
      this.tableData = tableData
    },
    // 当多选选择项发生变化时会触发该事件
    handleSelectionChange (selection) {
      this.selection = selection
      this.$emit('selection-change', selection)
    },
    // 当单选选择项发生变化时会触发该事件
    handleCurrentRowChange (currentRow, oldCurrentRow) {
      if (this.reserveSelection) { // 需要保存刷新前的选中数据时
        if (this.rowKey) {
          if (this.currentRow) {
            if (currentRow && !(this.currentRow[this.rowKey] === currentRow[this.rowKey])) {
              this.currentRow = currentRow
              this.oldCurrentRow = oldCurrentRow
              this.$emit('current-change', currentRow, oldCurrentRow)
            }
          } else {
            if (currentRow) {
              this.currentRow = currentRow
              this.oldCurrentRow = oldCurrentRow
              this.$emit('current-change', currentRow, oldCurrentRow)
            }
          }
        } else {
          console.error(this.$t('当reserveSelection为true时，必须指定rowKey。'))
        }
      } else { // 不需要保存刷新前的选中数据时
        this.currentRow = currentRow
        this.oldCurrentRow = oldCurrentRow
        this.$emit('current-change', currentRow, oldCurrentRow)
      }
    },
    // 当用户手动勾选数据行的 Checkbox 时触发的事件
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
    // 获取datagrid组件的属性
    getAttr (attr) {
      if (attr === 'req') {
        return this.req
      } else if (attr === 'formData') {
        return JSON.parse(JSON.stringify(this.formData))
      } else if (attr === 'tableData') {
        return JSON.parse(JSON.stringify(this.tableData))
      } else if (attr === 'openMoreQuery') {
        return this.$refs.moreQueryDrop.visible
      } else if (attr === 'total') {
        return this.total
      } else if (attr === 'pageSize') {
        return this.pageSize
      } else if (attr === 'currentPage') {
        return this.currentPage
      } else if (attr === 'pageCount') {
        let pageCount
        pageCount = Math.ceil(this.total / this.pageSize)
        return pageCount === 0 ? 1 : pageCount
      } else if (attr === 'requeryTime') {
        return this.requeryTime * 1000
      } else if (attr === 'selection') {
        return JSON.parse(JSON.stringify(this.selection))
      } else if (attr === 'currentRow') {
        return JSON.parse(JSON.stringify(this.currentRow))
      } else if (attr === 'oldCurrentRow') {
        return JSON.parse(JSON.stringify(this.oldCurrentRow))
      }
    },
    // 切换更多查询条件的收缩展开状态
    toggleMoreQuery (openState) {
      if (openState === undefined) {
        this.$refs.moreQueryDrop.visible = !this.$refs.moreQueryDrop.visible
      } else if (openState === true) {
        this.$refs.moreQueryDrop.visible = true
      } else if (openState === false) {
        this.$refs.moreQueryDrop.visible = false
      }
    },
    // 用于多选表格，清空用户的选择
    clearSelection () {
      this.$refs.table.clearSelection()
    },
    // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
    toggleRowSelection (row, selected) {
      this.$refs.table.toggleRowSelection(row, selected)
    },
    // 用于多选表格，切换所有行的选中状态
    toggleAllSelection () {
      this.$refs.table.toggleAllSelection()
    },
    // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
    setCurrentRow (row) {
      this.$refs.table.setCurrentRow(row)
    },
    // 用于清空排序条件，数据会恢复成未排序的状态
    clearSort () {
      this.$refs.table.clearSort()
    },
    // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
    clearFilter (columnKey) {
      this.$refs.table.clearFilter(columnKey)
    },
    // 对 datagrid 进行重新布局。当 datagrid 或其祖先元素由隐藏切换为显示时，可能需要调用此方法
    doLayout () {
      this.$refs.table.doLayout()
    },
    // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
    sort (sort) {
      this.$refs.table.sort(sort)
    },
    // 用来改变datagrid的loading状态
    setLoading (loading) {
      if (loading === true) {
        this.loading = true
      } else if (loading === false) {
        this.loading = false
      }
    },
    // 单选时用来回写选中状态
    singleSelectRewrite () {
      this.setCurrentRow()
      let row
      if (this.currentRow) {
        for (let i = 0; i < this.tableData.length; i++) {
          if (this.tableData[i][this.rowKey] === this.currentRow[this.rowKey]) {
            row = this.tableData[i]
            break
          }
        }
      }
      if (row) {
        this.setCurrentRow(row)
      }
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
    // 计算组件高度
    computedHeight () {
      let type = typeof this.height
      if (type === 'string') {
        return this.height
      } else if (type === 'number') {
        return `${this.height}px`
      } else {
        return ''
      }
    },
    // 计算组件最大高度
    computedMaxHeight () {
      let type = typeof this.maxHeight
      if (type === 'string') {
        return this.maxHeight
      } else if (type === 'number') {
        return `${this.maxHeight}px`
      } else {
        return ''
      }
    },
    // 计算组件最大高度
    computedWidth () {
      let type = typeof this.width
      if (!this.fit && type === 'string') {
        return this.width
      } else if (!this.fit && type === 'number') {
        return `${this.width}px`
      } else {
        return ''
      }
    },
    req () { // 刷新时的请求条件
      return [{
        service: this.service,
        page: this.currentPage,
        pagecount: this.pageSize,
        pageoffset: this.currentPage,
        rows: this.currentPage,
        ...this.formData
      }]
    },
    selectNum () {
      if (this.reserveSelection) {
        if (this.multiple) {
          return this.selection.length
        } else if (this.singleSelect) {
          return this.currentRow ? 1 : 0
        }
      }
    }
  },
  watch: {
    data: { // 传入的静态数据发生变化时
      deep: true,
      handler (data) {
        this.total = data.length
        this.loadData()
      }
    },
    pageSize (val) { // 分页条每页页数变化
      if (this.data) {
        this.loadData()
      } else {
        this.$nextTick(() => {
          this.refresh()
        })
      }
      this.$emit('size-change', val)
    },
    // 表格数据发生变化时
    tableData (tableData) {
      if (this.reserveSelection) { // 如果当前是要保存刷新前选中数据的datagrid
        if (this.rowKey) {
          this.$nextTick(() => {
            if (this.multiple) {
              // let rows = tableData.filter((tableDataItem)=>{
              //   return this.selection.some((selectionItem)=>{
              //     return tableDataItem[this.dataValue] === selectionItem[this.dataValue]
              //   })
              // })
              // this.clearSelection()
              // rows.forEach((row)=>{
              //   this.toggleRowSelection(row, true)
              // })
            } else if (this.singleSelect) {
              this.singleSelectRewrite()
            }
          })
        } else {
          console.error(this.$t('当reserveSelection为true时，必须指定rowKey。'))
        }
      }
    }
  }
}
</script>
<style lang="stylus">
  @import './index.styl'
</style>
