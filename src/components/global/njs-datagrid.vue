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
      <div class="njs-datagrid-page-info"><span>共 {{total}} 条 / 耗时 {{ duration }} 秒</span><span
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
import { Component, Prop, Ref, Vue } from 'vue-property-decorator'

@Component({
  name: 'njs-datagrid'
})
export default class NjsDatagrid extends Vue {
  @Prop({ type: String, required: true })
  public readonly datagridId // 组件ID,用于保存查询条件时与其他datagrid组件的查询条件作区分

  @Prop({ type: [Function, String], required: true })
  public readonly rowKey: Function | string // 行数据的 Key

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

  public readonly formData: {[key: string] : any} = {} // 查询条件绑定的数据

  public readonly loading = false

  public readonly selection = []

  public currentRow // 单选时的当前项目
  public oldCurrentRow // 单选时的老的当前项目

  public readonly tableData = [] // 表格绑定的数据

  protected saveQueryModel: {queryName: ''} // 保存查询条件时的数据

  protected queryList = [] // 保存的查询条件集合

  protected columns = [] // 表格的列集合
  protected showColumns = [] // 表格显示的列集合

  protected pageSize = 0

  protected currentPage = 1

  protected total = 0

  protected created () {
    Object.assign(this.formData, this.defaultQuery)
    this.pageSize = this.pageSizes[0]
  }
}
</script>
