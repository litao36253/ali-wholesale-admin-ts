<template>
  <div v-loading="loading"
    element-loading-text="loadingText"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.8)"
    class="njs-datagrid"
  >
    <div class="njs-datagrid-head" v-if="!hideHead">
      <div class="njs-datagrid-title-wrap">
        <div class="njs-datagrid-title">{{ title }}</div>
        <div class="njs-datagrid-subheading">{{ subheading }}</div>
      </div>
      <div class="njs-datagrid-buttons">
        <template v-for="(btn, i) in buttonList">
          <el-button v-if="!btn.prevButton" :key="`topBtnList${i}`" size="small" :icon="btn.icon"
            :disabled="btn.disabled" @click="btnListClick($event,btn)">{{ btn.text }}</el-button>
        </template>
      </div>
    </div>

    <div class="njs-datagrid-neck" v-if="!hideNeck">
      <div class="njs-datagrid-prvbtns">
        <template v-for="btn in prevButtonList">
          <el-tooltip v-if="btn==='refresh'" :key="btn" effect="dark" :content="preBtnTooltips[btn]" placement="top">
            <el-button @click="refresh" icon="el-icon-refresh" size="small" :class="['njs-datagrid-prvbtn']">
            </el-button>
          </el-tooltip>
          <el-tooltip v-else-if="btn==='hideColumns'" :key="btn" effect="dark" :content="preBtnTooltips[btn]" placement="top">
            <el-dropdown trigger="click" placement="bottom-start">
              <el-button icon="el-icon-setting" size="small" :class="['njs-datagrid-prvbtn']"></el-button>
              <el-dropdown-menu slot="dropdown">
                <li class="njs-datagrid-hide-colum">
                  <el-checkbox-group v-model="showColumns">
                    <el-checkbox v-for="colum in columns" :label="colum.prop" :key="'showColumn-' + colum.prop">{{ colum.label }}</el-checkbox>
                  </el-checkbox-group>
                </li>
              </el-dropdown-menu>
            </el-dropdown>
          </el-tooltip>
          <el-tooltip v-if="btn==='export'" :key="btn" effect="dark" :content="preBtnTooltips[btn]" placement="top">
            <el-button @click="handleExport" icon="el-icon-download" size="small" :class="['njs-datagrid-prvbtn']"></el-button>
          </el-tooltip>
        </template>
        <template v-for="(btn) in buttonList">
          <el-tooltip v-if="btn.type === 'custom' && btn.prevButton" :key="btn.text" effect="dark" :content="btn.text" placement="top">
            <el-button @click="btnListClick($event,btn)" :icon="btn.icon" size="small" :class="['njs-datagrid-prvbtn']" :disabled="btn.disabled"></el-button>
          </el-tooltip>
        </template>
      </div>
      <div class="njs-datagrid-query">
        <el-form ref="moreUsedQuery" :model="formData" label-position="right" size="small" inline="inline" :rules="rules"
          :class="['njs-datagrid-more-used-query']" @submit.native.prevent>
          <slot name="query" :formData="formData"></slot>
        </el-form>
        <el-dropdown size="small" type="primary" v-if="$scopedSlots['more-query']" @command="myQueryCommand">
          <el-button type="primary" size="small">{{'我的查询'}}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="queryList.length===0" disabled="disabled">{{'你没有保存查询条件'}}</el-dropdown-item>
            <el-dropdown-item v-for="item in queryList" :key="item" :command="item" :class="['njs-datagrid-query-item']">
              <span>{{ item['QUERY_CONDITION_NAME'] }}</span><i class="el-icon-delete"
                :class="['njs-datagrid-del-query']" @click.stop="deleteQuery(item)"></i></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-popover v-if="$scopedSlots['more-query']" trigger="click" ref="moreQueryDrop">
          <el-badge class="njs-datagrid-more-query-mark" is-dot="is-dot" slot="reference" :hidden="hideBadge">
            <el-button type="text" :class="['njs-datagrid-more-query-btn']">{{'更多查询'}}</el-button>
          </el-badge>
          <el-form :class="['njs-datagrid-more']" ref="moreQueryForm" :model="formData" label-position="right"
            :label-width="formLabelWidth" size="small" :rules="rules" @submit.native.prevent>
            <slot name="more-query" :formData="formData"></slot>
          </el-form>
          <div class="njs-datagrid-query-btngroup">
            <el-button @click="clickRefresh" size="small" type="primary">搜索</el-button>
            <el-button @click="resetFields" size="small">{{'重置'}}</el-button>
            <el-form ref="queryName" :model="queryName" size="small"
              :rules="queryNameRules" @submit.native.prevent>
              <el-form-item prop="QUERY_NAME">
                <el-input :placeholder="'请输入查询名称'" v-model="queryName.QUERY_NAME">
                  <el-button slot="append" type="primary" @click="saveQuery">{{'保存'}}</el-button>
                </el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-popover>
      </div>
    </div>

    <div class="njs-datagrid-table">
      <el-table ref="table" :key="`${datagridId}_table`" :row-key="rowKey" :fit="true"
        :highlight-current-row="singleSelect" :data="tableData" :style="{width: '100%'}" height="100%"
        :empty-text="realEmptyText" @selection-change="handleSelectionChange"
        header-row-class-name="njs-datagrid-table-header" size="medium"
        @current-change="handleCurrentRowChange"
        @select="handleSelect" @select-all="handleSelectAll"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave" @cell-click="handleCellClick"
        @cell-dblclick="handleCellDbclick"
        @row-click="handleRowClick" @row-contextmenu="handleRowContextmenu"
        @row-dblclick="handleRowDbclick"
        @header-click="handleHeaderClick"
        @header-contextmenu="handleHeaderContextmenu"
        @sort-change="handleSortChange"
      >
        <el-table-column v-if="multiple" type="selection" :selectable="selectable"
          :reserve-selection="reserveSelection"></el-table-column>
        <slot></slot>
      </el-table>
    </div>

    <div class="njs-datagrid-foot" v-if="pagination">
      <div class="njs-datagrid-page-info"><span>共 {{total}} 条 / 耗时 {{realDuration}}s</span><span
          class="njs-datagrid-page-size"><span>每页</span>
          <el-select v-model="pageSize" size="mini" :style="{display: 'inline-block', width: '68px'}"
            :clearable="false">
            <el-option v-for="item in pageSizes" :key="item" :lable="item" :value="item"></el-option>
          </el-select><span>条</span>
        </span></div>
      <div class="njs-datagrid-select-num" v-if="reserveSelection && (singleSelect || multiple)">
        <span>已选数量：</span><span style="color: red;">{{selectNum}}</span></div>
      <el-pagination @current-change="handleCurrentChange" @prev-click="handlePrevClick" @next-click="handleNextClick"
        background="background" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper"
        :total="total"></el-pagination>
      <!-- <a-pagination @current-change="handleCurrentChange" @prev-click="handlePrevClick" @next-click="handleNextClick"
        background="background" :current-page.sync="currentPage" :page-size="pageSize" layout="prev, pager, next, jumper"
        :total="total"></a-pagination> -->
    </div>
    <slot name="fixed-card" :formData="formData"></slot>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  name: 'njs-datagrid',
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
          { required: true, message: '请输入查询名称', trigger: 'change' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }
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
        refresh: '刷新',
        hideColumns: '选择展示列',
        export: '导出'
      },
      columns: [], // 表格的列集合
      showColumns: [], // 表格显示的列集合
      hideBadge: true // 是否显示更多查询条件的标记
    }
  },
  props: {
    datagridId: { // 组件ID,用于保存查询条件时与其他datagrid组件的查询条件作区分
      type: String,
      required: true
    },
    service: String, // 接口路径
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
    buttonList: { // 组件右上角的按钮列表
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
    rules: { // 查询条件的校验规则
      type: Object,
      default () {
        return {}
      }
    },
    defaultQuery: { // 查询条件默认值
      type: Object,
      default () {
        return {}
      }
    },
    loadingText: { // 加载时显示的提示文字
      type: String,
      default: '拼命加载中'
    },
    formLabelWidth: {
      type: String,
      default: '96px'
    }
  },
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
      this.$refs.moreUsedQuery.fields.forEach((item) => {
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
      this.$refs.moreQueryForm.fields.forEach((item) => {
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
          this.showColumns.push(item.prop)
        }
      }
    })
    // 是否自动加载一次
    if (this.autoLoading) {
      this.refresh()
    }
  },
  methods: {
    // 点击右上角按钮执行的方法
    btnListClick ($event, btn) {
      if (btn.type === 'delete') {
        if (this.multiple) {
          if (this.selection.length) {
            this.$confirm(btn.confirm || '你确定要删除选中的数据吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
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
                    this.$message.warning('批量删除数量不能超过 ' + 100)
                  }
                  return
                }
              } else {
                if (this.selection.length > btn.max) {
                  if (btn.maxText) {
                    this.$message.warning(btn.maxText)
                  } else {
                    this.$message.warning('批量删除数量不能超过 ' + btn.max)
                  }
                  return
                }
              }
              const keys = []
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
                    message: btn.successText || '删除成功！'
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
                message: '已取消删除'
              })
            })
          } else {
            this.$message.warning(btn.unchecked || '请勾选要删除的数据！')
          }
        }
      } else {
        btn.handler && btn.handler($event, btn)
      }
    },
    // 选中一个存储的查询条件组
    myQueryCommand (query) {
      const json = JSON.parse(query.QUERY_JSON.replace(/(&quot;)/g, () => {
        return '"'
      }))
      for (const attr in json) {
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
          !result && this.$message.error('更多查询条件输入不合法！')
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
        const { head } = result
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
        if (this.total > 0 && this.tableData.length === 0) { // 有数据时当前页没请求到数据则主动请求上一页的数据
          this.refresh()
          return
        }
        this.realDuration = parseInt(head.RUN_TIMES) / 1000
      } else {
        this.$emit('load-error', result)
      }
      this.loading = false
      this.realEmptyText = this.emptyText
      this.$nextTick(() => {
        this.doLayout()
      })
    },
    // 重置查询条件
    resetFields () {
      this.$refs.moreUsedQuery && this.$refs.moreUsedQuery.resetFields()
      this.$refs.moreQueryForm && this.$refs.moreQueryForm.resetFields()
    },
    // 保存查询条件
    saveQuery () {
      this.$refs.queryName.validate((result) => {
        if (result) {
          const json = {}
          for (const attr in this.formData) {
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
                message: '保存查询条件成功，可在“我的查询”中使用。'
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
      this.$confirm(`你确定要删除名为“${query.QUERY_CONDITION_NAME}”的查询吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
              message: `删除名为“${query.QUERY_CONDITION_NAME}”'的查询成功。`
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
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
      const tableData = []
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
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
          console.error('当reserveSelection为true时，必须指定rowKey。')
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
        const pageCount = Math.ceil(this.total / this.pageSize)
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
      this.$refs.table && this.$refs.table.doLayout()
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
      const type = typeof this.height
      if (type === 'string') {
        if (this.height.indexOf('px') !== -1) {
          return `${parseInt(this.height) / 16}rem`
        }
        return this.height
      } else if (type === 'number') {
        return `${this.height / 16}rem`
      } else {
        return ''
      }
    },
    // 计算组件最大高度
    computedMaxHeight () {
      const type = typeof this.maxHeight
      if (type === 'string') {
        if (this.maxHeight.indexOf('px') !== -1) {
          return `${parseInt(this.maxHeight) / 16}rem`
        }
        return this.maxHeight
      } else if (type === 'number') {
        return `${this.maxHeight / 16}rem`
      } else {
        return ''
      }
    },
    // 计算组件最大宽度
    computedWidth () {
      const type = typeof this.width
      if (!this.fit && type === 'string') {
        if (this.width.indexOf('px') !== -1) {
          return `${parseInt(this.width) / 16}rem`
        }
        return this.width
      } else if (!this.fit && type === 'number') {
        return `${this.width / 16}rem`
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
        return 0
      }
      return 0
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
          console.error('当reserveSelection为true时，必须指定rowKey。')
        }
      }
    },
    // 监听查询条件的变化
    formData: {
      deep: true,
      handler (formData) {
        if (this.$refs.moreQueryForm) {
          const fields = this.$refs.moreQueryForm.fields
          for (let i = 0; i < fields.length; i++) {
            if (this.formData[fields[i].prop]) {
              this.hideBadge = false
              return
            }
          }
          this.hideBadge = true
        } else {
          this.hideBadge = true
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
// - 组件样式
.njs-datagrid
  height 100%
  display flex
  box-sizing border-box
  flex-direction column
  overflow hidden
  position relative
  .njs-datagrid-head
    border-bottom 1px solid #F2F2F2
    padding 0 20px
    display flex
    align-items center
    overflow hidden
    .njs-datagrid-title-wrap
      max-width 50%
      padding-top 16px
      padding-bottom 14px
      .njs-datagrid-title
        color #3A3C3E
        font-size 14px
        font-weight bold
        line-height 20px
      .njs-datagrid-subheading
        line-height 20px
        padding 3px 0
        color #818691
        font-size 12px
    .njs-datagrid-buttons
      flex 1
      text-align right
    .el-button--default
      font-weight bold
  .njs-datagrid-neck
    display flex
    height 72px
    align-items center
    overflow: hidden;
    .njs-datagrid-prvbtns
      padding 0 20px
      .njs-datagrid-prvbtn
        width 40px
        height 32px
        padding 0
        color #409EFF
        font-size 18px
        border-color #E8E8E8
        color #409EFF
        margin-right 10px
    .njs-datagrid-query
      flex 1
      display flex
      overflow hidden
      justify-content flex-end
      align-items center
      padding-right 20px
      .njs-datagrid-more-query-btn
        margin-left 14px
        white-space nowrap
      .njs-datagrid-more-used-query
        display flex
        padding-top 18px
        .el-form-item__label
          padding-left 12px
        &>div
          margin-right 10px
  .njs-datagrid-table
    flex 1
    overflow hidden
    padding 0 20px
    z-index 0
    .njs-datagrid-table-header
      th
        background-color #eee
        font-weight bold
        color #333
        padding 0
        height 44px
        line-height 44px
        &>.cell
          white-space nowrap
    .el-table
      min-height 100%
  .njs-datagrid-foot
    height 64px
    display flex
    align-items center
    justify-content space-between
    padding 0 20px
    color #606266
    font-size 14px
    .njs-datagrid-page-info
      .njs-datagrid-page-size
        padding-left 6px
        >span
          padding 0 6px
    //解决combogrid组件分页条显示校验图标问题
    .el-input__suffix
      .el-input__icon.el-input__validateIcon
        display none
.njs-datagrid-more
  padding-top 16px
  width auto
.njs-datagrid-more-form
  padding 20px 30px 0 30px
.njs-datagrid-hide-colum
  padding 6px 20px
  .el-checkbox
    display block
    height 28px
    line-height 28px
    margin 0 !important
.njs-datagrid-query-btngroup
  display flex
  height 54px
  padding-top 10px
  align-items flex-start
  justify-content center
  .el-input-group__append
    background-color #2994FF
    color #FFFFFF
    &:hover
      background-color #53a9ff
.njs-datagrid-query-item
  display: flex;
  align-items: center;
  justify-content: space-between;
  .njs-datagrid-del-query
    font-size 14px
    color #0486FE
  .njs-datagrid-del-query:hover
    color #f56c6c
.njs-datagrid-more-query-mark
  .el-badge__content.is-fixed
    top 10px
    width 10px
    height 10px

</style>
