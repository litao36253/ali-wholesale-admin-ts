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
          <el-tooltip v-if="btn==='refresh'" :key="btn" effect="dark" content="刷新" placement="top">
            <el-button @click="refresh" icon="el-icon-refresh" size="small" :class="['njs-datagrid-prvbtn']">
            </el-button>
          </el-tooltip>
          <el-tooltip v-else-if="btn==='hideColumns'" :key="btn" effect="dark" content="调整展示列" placement="top">
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
          <el-tooltip v-if="btn==='export'" :key="btn" effect="dark" content="导出" placement="top">
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
        <el-form ref="queryForm" :model="formData" label-position="right" size="small" inline="inline" :rules="rules"
          :class="['njs-datagrid-more-used-query']" @submit.native.prevent>
          <slot name="query" :formData="formData"></slot>
        </el-form>
        <el-dropdown size="small" type="primary" v-if="$scopedSlots['more-query']" @command="handleQueryCommand">
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
            <el-button @click="handleClickRefresh" size="small" type="primary">查询</el-button>
            <el-button @click="resetFields" size="small">重置</el-button>
            <el-form ref="saveQueryForm" :model="saveQueryModel" size="small"
              :rules="[{ required: true, message: '请输入查询名称', trigger: 'change' }, { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }]" @submit.native.prevent>
              <el-form-item prop="queryName">
                <el-input :placeholder="'请输入查询名称'" v-model="saveQueryModel.queryName">
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
        :empty-text="emptyText" @selection-change="handleSelectionChange"
        header-row-class-name="njs-datagrid-table-header" size="medium"
        @current-change="handleCurrentRowChange"
        @select="handleSelect" @select-all="handleSelectAll"
        @cell-mouse-enter="handleCellMouseEnter"
        @cell-mouse-leave="handleCellMouseLeave" @cell-click="handleCellClick"
        @cell-dblclick="handleCellDblclick"
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
      <div class="njs-datagrid-page-info"><span>共 {{total}} 条 / 耗时 {{ realDuration }} 秒</span><span
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
    </div>
    <slot name="fixed-card" :formData="formData"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'
import { Form, Table } from 'element-ui'

@Component({
  name: 'njs-datagrid'
})
export default class NjsDatagrid extends Vue {
  @Ref('queryForm')
  protected queryForm: Form

  @Ref('moreQueryForm')
  protected moreQueryForm: Form

  @Ref('saveQueryForm')
  protected saveQueryForm: Form

  @Ref('table')
  protected table: Table

  @Ref('moreQueryDrop')
  protected moreQueryDrop

  @Prop({ type: String, required: true })
  public readonly datagridId // 组件ID,用于保存查询条件时与其他datagrid组件的查询条件作区分

  @Prop({ type: [Function, String], required: true })
  public readonly rowKey: string // 行数据的 Key

  @Prop(String)
  public readonly title: string // 标题

  @Prop(String)
  public readonly subheading: string // 副标题

  @Prop({ type: Array, default: () => [] })
  public readonly buttonList: [] // 组件右上角的按钮列表

  @Prop({ type: Array, default: () => ['refresh', 'hideColumns'] })
  public readonly prevButtonList: [] // 组件的前置按钮

  @Prop({ type: Object, default: () => ({}) })
  public readonly rules // 查询条件的校验规则

  @Prop({ type: Object, default: () => ({}) })
  public readonly defaultQuery // 查询条件默认值

  @Prop({ type: String, default: '96px' })
  public readonly formLabelWidth: string // 表单label的默认宽度

  @Prop(Function)
  public readonly service: Function // 接口

  @Prop({ type: Boolean, default: false })
  public readonly autoLoading: boolean // 配置了service时，是否在created钩子里自动加载一次数据

  @Prop(Array)
  public readonly data: [] // 配置要展示的数据

  @Prop(Number)
  public readonly duration: number // 耗时

  @Prop({ type: Boolean, default: true })
  public readonly pagination: boolean // 是否显示分页条

  @Prop({ type: Array, default: () => [10, 20, 30, 50] })
  public readonly pageSizes: number[] // 选择每页展示数据量的选项集合。仅当pagination为true有效。

  @Prop({ type: Boolean, default: false })
  public readonly fit: boolean // 横向是否充满整个父级容器

  @Prop({ type: Function })
  public readonly selectable: Function // 仅当 multiple=true 有效，类型为 Function，Function 的返回值用来决定这一行的 CheckBox 是否可以勾选

  @Prop({ type: Boolean, default: false })
  public readonly singleSelect: boolean // 行数据是否支持单选

  @Prop({ type: Boolean, default: false })
  public readonly multiple: boolean // 行数据是否支持多选

  @Prop({ type: Boolean, default: false })
  public readonly reserveSelection: boolean // 为 true 则会在数据更新之后保留之前选中的数据（需指定 row-key）

  @Prop(String)
  protected emptyText: string // 空数据时显示的文本内容，也可以通过 slot="empty" 设置

  @Prop({ type: Boolean, default: false })
  public readonly hideHead: boolean // 是否隐藏datagrid组件的头部，即最上面一栏

  @Prop({ type: Boolean, default: false })
  public readonly hideNeck: boolean // 是否隐藏datagrid组件的颈部，即第二栏

  @Prop({ type: String, default: '拼命加载中' })
  public readonly loadingText: string // 加载时显示的提示文字

  @Prop({ type: Array, default: () => [] })
  public readonly notSaveQueries: string[] // 保存查询条件时要忽略的字段

  public readonly formData: {[key: string] : any} = {} // 查询条件绑定的数据

  protected loading = false

  protected selection = []

  public currentRow // 单选时的当前项目
  public oldCurrentRow // 单选时的老的当前项目

  public tableData = [] // 表格绑定的数据

  protected saveQueryModel: {queryName: ''} // 保存查询条件时的数据

  protected queryList = [] // 保存的查询条件集合

  protected columns = [] // 表格的列集合

  protected showColumns = [] // 表格显示的列集合

  protected hideBadge = true // 是否显示更多查询条件的标记

  protected pageSize = 0

  protected currentPage = 1

  protected total = 0

  protected realDuration = 0

  protected created () {
    Object.assign(this.formData, this.defaultQuery)
    this.pageSize = this.pageSizes[0]
    this.realDuration = this.duration
    if (this.data) {
      this.total = this.data.length
      this.loadData()
    }
  }

  protected mounted () {
    // 获取保存的查询条件
    this.$scopedSlots['more-query'] && this.getSaveQuery()
    if (this.queryForm) {
      // @ts-ignore
      this.queryForm.fields.forEach((item) => {
        if (!this.formData[item.prop]) {
          this.$set(this.formData, item.prop, '')
        }
      })
      this.$nextTick(() => {
        if (!this.autoLoading) {
          this.queryForm.clearValidate()
        }
      })
    }
    if (this.moreQueryForm) {
      // @ts-ignore
      this.moreQueryForm.fields.forEach((item) => {
        if (!this.formData[item.prop]) {
          this.$set(this.formData, item.prop, '')
        }
      })
      this.$nextTick(() => {
        if (!this.autoLoading) {
          this.moreQueryForm.clearValidate()
        }
      })
    }
    // 初始化创建表格的列集合和表格显示的列集合
    this.table.$children.forEach((item: any) => {
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
  }

  // 点击右上角按钮执行的方法
  protected btnListClick ($event, btn) {
    // @todo
    // if (btn.type === 'delete') {
    //   if (this.multiple) {
    //     if (this.selection.length) {
    //       this.$confirm(btn.confirm || '你确定要删除选中的数据吗？', '提示', {
    //         type: 'warning'
    //       }).then(() => {
    //         let reqJson = {
    //           service: btn.service
    //         }
    //         if (btn.max === undefined) {
    //           if (this.selection.length > 100) {
    //             if (btn.maxText) {
    //               this.$message.warning(btn.maxText)
    //             } else {
    //               this.$message.warning('批量删除数量不能超过 ' + 100)
    //             }
    //             return
    //           }
    //         } else {
    //           if (this.selection.length > btn.max) {
    //             if (btn.maxText) {
    //               this.$message.warning(btn.maxText)
    //             } else {
    //               this.$message.warning('批量删除数量不能超过 ' + btn.max)
    //             }
    //             return
    //           }
    //         }
    //         const keys = []
    //         this.selection.forEach((item) => {
    //           keys.push(item[btn.key])
    //         })
    //         reqJson[btn.key] = keys.join(',')
    //         if (btn.query) { // 如果调用删除接口有附加的条件
    //           reqJson = { ...reqJson, ...btn.query }
    //         }
    //         this.$ajaxRequest([reqJson]).then((result) => {
    //           if (result.code === '0') {
    //             this.$message({
    //               type: 'success',
    //               message: btn.successText || '删除成功！'
    //             })
    //             this.clearSelection()
    //             this.refresh()
    //             btn.success && btn.success(result)
    //           } else {
    //             this.$message.error(result.head.msg)
    //             btn.fail && btn.fail(result.head)
    //           }
    //         }).catch((err) => {
    //           console.log(err)
    //           btn.fail && btn.fail(err)
    //         })
    //       }).catch(() => {
    //         this.$message({
    //           type: 'info',
    //           message: '已取消删除'
    //         })
    //       })
    //     } else {
    //       this.$message.warning(btn.unchecked || '请勾选要删除的数据！')
    //     }
    //   }
    // } else {
    //   btn.handler && btn.handler($event, btn)
    // }
  }

  public async refresh () {
    if (this.data) {
      return
    }
    const queryValidateResult = this.queryForm ? await this.queryForm.validate() : true
    const moreQueryValidateResult = this.queryForm ? await this.queryForm.validate() : true
    if (queryValidateResult && moreQueryValidateResult) {
      this.loading = true
      this.tableData = []
      this.$emit('before-load', this.formData)
      const result = await this.service(this.formData).then(result => {
        if (result.code) {
          this.$emit('load-error', result)
        } else {
          this.$emit('load-success', result)
        }
        return result
      })
      this.total = result.total
      this.realDuration = result.duration
      this.loading = false
      this.$nextTick(() => {
        this.doLayout()
      })
    }
  }

  // 载入静态数据
  protected loadData () {
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
  }

  // 获取已保存的查询条件
  protected getSaveQuery () {
    // @todo
  }

  // 重置查询条件
  protected resetFields () {
    this.queryForm && this.queryForm.resetFields()
    this.moreQueryForm && this.moreQueryForm.resetFields()
  }

  // 点击搜索按钮
  protected handleClickRefresh () {
    this.moreQueryDrop.visible = false
    this.refresh()
  }

  protected handleQueryCommand () {
    // @todo
    // const json = JSON.parse(query.QUERY_JSON.replace(/(&quot;)/g, () => {
    //   return '"'
    // }))
    // for (const attr in json) {
    //   if (!this.notSaveQueries.some((notSave) => {
    //     return notSave === attr
    //   })) {
    //     this.formData[attr] = json[attr]
    //   }
    // }
    // this.refresh()
  }

  // 保存查询条件
  protected async saveQuery () {
    const validateResult = await this.saveQueryForm.validate()
    if (validateResult) {
      const json = {}
      for (const attr in this.formData) {
        if (!this.notSaveQueries.includes(attr)) {
          json[attr] = this.formData[attr]
        }
      }
      // @todo
      // this.$ajaxRequest([{
      //   service: 'U0301101',
      //   DATAGRID_ID: this.datagridId,
      //   QUERY_CONDITION_NAME: this.saveQueryModel.queryName,
      //   QUERY_JSON: JSON.stringify(json)
      // }]).then((result) => {
      //   if (result.code === '0') {
      //     this.$message({
      //       type: 'success',
      //       message: '保存查询条件成功，可在“我的查询”中使用。'
      //     })
      //     this.saveQueryForm.resetFields()
      //     this.getSaveQuery()
      //   }
      // }).catch((err) => {
      //   console.log(err)
      // })
    }
  }

  // 删除已保存的查询
  protected deleteQuery (query) {
    this.$confirm(`你确定要删除名为“${query.query_name}”的查询吗？`, '提示', {
      type: 'warning'
    }).then(() => {
      // @todo
      // this.$ajaxRequest([{
      //   service: 'U0301202',
      //   HIS_ID: query.HIS_ID
      // }]).then((result) => {
      //   if (result.code === '0') {
      //     this.getSaveQuery()
      //     this.$message({
      //       type: 'success',
      //       message: `删除名为“${query.query_name}”'的查询成功。`
      //     })
      //   }
      // })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  // 分页条当前页码变化
  protected handleCurrentChange (val) {
    if (this.data) {
      this.loadData()
    } else {
      this.$nextTick(() => {
        this.refresh()
      })
    }
    this.$emit('current-page-change', val)
  }

  // 当多选选择项发生变化时会触发该事件
  protected handleSelectionChange (selection) {
    this.selection = selection
    this.$emit('selection-change', selection)
  }

  // 当单选选择项发生变化时会触发该事件
  protected handleCurrentRowChange (currentRow, oldCurrentRow) {
    if (this.reserveSelection) { // 需要保存刷新前的选中数据时
      if (this.currentRow) {
        if (currentRow && this.currentRow[this.rowKey] !== currentRow[this.rowKey]) {
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
    } else { // 不需要保存刷新前的选中数据时
      this.currentRow = currentRow
      this.oldCurrentRow = oldCurrentRow
      this.$emit('current-change', currentRow, oldCurrentRow)
    }
  }

  // 当用户手动勾选数据行的 Checkbox 时触发的事件
  protected handleSelect (...arg) {
    this.$emit('select', ...arg)
  }

  // 当用户手动勾选全选 Checkbox 时触发的事件
  protected handleSelectAll (...arg) {
    this.$emit('select-all', ...arg)
  }

  // 当单元格 hover 进入时会触发该事件
  protected handleCellMouseEnter (...arg) {
    this.$emit('cell-mouse-enter', ...arg)
  }

  // 当单元格 hover 退出时会触发该事件
  protected handleCellMouseLeave (...arg) {
    this.$emit('cell-mouse-leave', ...arg)
  }

  // 当某个单元格被点击时会触发该事件
  protected handleCellClick (...arg) {
    this.$emit('cell-click', ...arg)
  }

  // 当某个单元格被双击击时会触发该事件
  protected handleCellDbclick (...arg) {
    this.$emit('cell-dbclick', ...arg)
  }

  // 当某一行被点击时会触发该事件
  protected handleRowClick (...arg) {
    this.$emit('row-click', ...arg)
  }

  // 当某一行被鼠标右键点击时会触发该事件
  protected handleRowContextmenu (...arg) {
    this.$emit('row-contextmenu', ...arg)
  }

  // 当某一行被双击时会触发该事件
  protected handleRowDbclick (...arg) {
    this.$emit('row-dblclick', ...arg)
  }

  // 当某一列的表头被点击时会触发该事件
  protected handleHeaderClick (...arg) {
    this.$emit('header-click', ...arg)
  }

  // 当某一列的表头被鼠标右键点击时触发该事件
  protected handleHeaderContextmenu (...arg) {
    this.$emit('header-contextmenu', ...arg)
  }

  // 当表格的排序条件发生变化的时候会触发该事件
  protected handleSortChange (...arg) {
    this.$emit('sort-change', ...arg)
  }

  // 用户点击下一页按钮改变当前页后触发
  protected handleNextClick (...arg) {
    this.$emit('next-click', ...arg)
  }

  // 用户点击上一页按钮改变当前页后触发
  protected handlePrevClick (...arg) {
    this.$emit('prev-click', ...arg)
  }

  // 表格重绘
  public doLayout () {
    this.table.doLayout()
  }

  // 用于多选表格，清空用户的选择
  public clearSelection () {
    this.table.clearSelection()
  }

  // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
  public toggleRowSelection (row, selected) {
    this.table.toggleRowSelection(row, selected)
  }

  // 用于多选表格，切换所有行的选中状态
  public toggleAllSelection () {
    this.table.toggleAllSelection()
  }

  // 用于单选表格，设定某一行为选中行，如果调用时不加参数，则会取消目前高亮行的选中状态。
  public setCurrentRow (row?) {
    this.table.setCurrentRow(row)
  }

  // 用于清空排序条件，数据会恢复成未排序的状态
  public clearSort () {
    this.table.clearSort()
  }

  // 不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，也可传入由columnKey组成的数组以清除指定列的过滤条件
  public clearFilter (columnKey) {
    // @ts-ignore
    this.table.clearFilter(columnKey)
  }

  // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序。
  public sort (prop: string, order: string) {
    this.table.sort(prop, order)
  }

  // 单选时用来回写选中状态
  public singleSelectRewrite () {
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

  // 切换更多查询条件的收缩展开状态
  public toggleMoreQuery (openState) {
    if (openState === undefined) {
      this.moreQueryDrop.visible = !this.moreQueryDrop.visible
    } else if (openState === true) {
      this.moreQueryDrop.visible = true
    } else if (openState === false) {
      this.moreQueryDrop.visible = false
    }
  }
}
</script>
