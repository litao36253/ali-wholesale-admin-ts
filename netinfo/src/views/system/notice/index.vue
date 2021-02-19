<template lang="pug">
  .wrap(@click="enterCell = {NOTE_ID: '', property: '', EXP_DATE: '',row: {}}")
    njs-datagrid(
      datagrid-id="system_notice_P0113404"
      ref="datagrid"
      :title="$t('系统公告管理')"
      :subheading="$t('用于管理人员及运维人员管理公告。')"
      service="P0113404"
      :rules="rules"
      :auto-loading="true"
      :button-list="btnList"
      @row-click="rowClick"
      single-select
      :default-query="{BEGIN_END_DATE: BEGIN_END_DATE}"
    )
      <!-----------     列配置  start ---------------------------------------------------------- -->
      njs-column(prop="NOTE_ID" :label="$t('公告编号')" sortable min-width="100")
      njs-column(prop="NOTE_TITLE" :label="$t('公告标题')" show-overflow-tooltip sortable min-width="100")
      njs-column(prop="NOTE_STATE" :label="$t('公告状态')" min-width="100" dict="POST_STAT" type="state" :state-map="{'1': 'success', '0': 'danger'}")
      njs-column(prop="IMDE" :label="$t('重要程度')" min-width="100" dict="IMDE")
      njs-column(prop="NOTE_TYPE" :label="$t('公告类型')" min-width="100" dict="NOTE_TYPE")
      njs-column(prop="EXP_DATE" :label="$t('有效期')" min-width="160")
        template(slot-scope="{row, column}")
          span(v-show="row.NOTE_ID !== enterCell.NOTE_ID || enterCell.property !== column.property") {{ row.EXP_DATE }}
          njs-button(v-show="row.NOTE_ID !== enterCell.NOTE_ID || enterCell.property !== column.property" type='text' icon="el-icon-edit" @click.stop="editNoteExpDate(row, column)")
          njs-date-picker(:clearable="false" size="small" value-format="yyyy-MM-dd" :style="{width: '150px'}" v-show="row.NOTE_ID === enterCell.NOTE_ID && enterCell.property === column.property"  v-model="enterCell.EXP_DATE" @change="handlerExpdateChange" @click.native.stop)
      njs-column(prop="ORG_NAME" :label="$t('所属机构')" min-width="100")
      njs-column(prop="ISSUE_USER" :label="$t('发布人')" min-width="120")
      njs-column(prop="ISSUE_TIME" :label="$t('发布时间')" min-width="140")
      njs-column(:label="$t('操作')" min-width="250" fixed="right")
        template(slot-scope="{row}")
          njs-button(type="text" @click.stop="handlerShowDetails(row)") {{$t('详情')}}
          njs-button(type="text" @click.stop="handlerDelItem(row)" ) {{$t('删除')}}
          njs-button(type="text" @click.stop="handlerNoteReadQuery(row)" ) {{$t('已读未读查询')}}
      <!-----------     列配置  end ---------------------------------------------------------- -->

      <!-----------     常用查询条件  start ---------------------------------------------------------- -->
      template(slot="more-used-query" slot-scope="{ formData }")
        njs-form-item(prop="NOTE_ID")
          njs-input(v-model="formData.NOTE_ID" :placeholder="$t('请输入公告编号')" clearable @keydown.13.native="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
        njs-form-item(prop="NOTE_TITLE")
          njs-input(v-model="formData.NOTE_TITLE" :placeholder="$t('请输入公告标题')"   clearable @keydown.native.13="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
        njs-form-item(prop="BEGIN_END_DATE")
          njs-date-picker(v-model="formData.BEGIN_END_DATE" type="daterange" value-format="yyyy-MM-dd" :start-placeholder="$t('请选择开始日期')" :end-placeholder="$t('请选择截止日期')" :clearable="false" @change="$refs.datagrid.refresh()" :picker-options="computedPickerOptions" unlink-panels)
        njs-form-item
          njs-button(@click="$refs.datagrid.refresh()" type="primary") {{$t('查询')}}
      <!-----------     常用查询条件  start ---------------------------------------------------------- -->

      <!-- 右侧卡片的插槽新增修改 ------------------- start ---------------------------------------------- -->
      template(slot="fixed-card" slot-scope="{ formData }")
        njs-datagrid-card(:width="500" :title="release.title" :visible.sync="releaseVisible" :close-text="$t('取消')" width="50%")
          .form-wrap
            njs-form(:model="release.formData" size="small" ref="releaseForm" :show-submit="false" :show-reset="false" :service="release.service" label-width="120px" :rules="releaseRules" v-if="releaseVisible")
              njs-form-item(prop="NOTE_TYPE" :label="$t('公告类型')")
                njs-combobox(v-model="release.formData.NOTE_TYPE" dict="NOTE_TYPE")
              njs-form-item(prop="NOTE_TITLE" :label="$t('公告标题')")
                njs-input(v-model="release.formData.NOTE_TITLE")
              njs-form-item(prop="NOTE_OBJ_TYPE" :label="$t('接收类型')")
                njs-radio-group(v-model="release.formData.NOTE_OBJ_TYPE" dict="NOTE_OBJ_TYPE")
              njs-form-item(prop="NOTE_OBJ_USER" :label="$t('接收员工')" v-if="release.formData.NOTE_OBJ_TYPE === '2'")
                njs-combogrid(datagrid-id="system_noticeUser_P0405403"
                  v-model="release.formData.NOTE_OBJ_USER"
                  ref="noticeUserCombogrid"
                  :dialog-title="$t('员工信息')"
                  dialog-width="50%"
                  service="P0405403"
                  hide-head
                  single-select
                  data-value="USER_CODE"
                  data-label="USER_CODE,USER_NAME"
                  multiple
                  reserve-selection
                  row-key="USER_CODE")
                  <!-----------     列配置  start ---------------------------------------------------------- -->
                  njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable min-width="100")
                  njs-column(prop="USER_NAME" :label="$t('员工名称')" show-overflow-tooltip sortable min-width="120")
                  njs-column(prop="USER_ACCOUNT" :label="$t('员工账号')" min-width="120")
                  njs-column(prop="USER_TYPE" :label="$t('员工类型')" min-width="120" dict="USER_TYPE")
                  njs-column(prop="EXTERNAL_SYS_ACCOUNT" :label="$t('外部系统账号')" min-width="120")
                  njs-column(prop="USER_STAT" :label="$t('员工状态')" min-width="100" dict="USER_STAT")
                  <!-----------     列配置  end ---------------------------------------------------------- -->
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                  template(slot="more-used-query" slot-scope="{ formData }")
                    njs-form-item(prop="USER_CODE")
                      njs-input(v-model="formData.USER_CODE" :placeholder="$t('请输入员工编号')" clearable @keydown.13.native="$refs.noticeUserCombogrid.refresh()" @change="$refs.noticeUserCombogrid.refresh()")
                    njs-form-item(prop="USER_STAT")
                      njs-combobox(v-model="formData.USER_STAT" :placeholder="$t('请选择员工状态')"  dict="USER_STAT" clearable @keydown.native.13="$refs.noticeUserCombogrid.refresh()" @change="$refs.noticeUserCombogrid.refresh()")
                    njs-form-item
                      njs-button(@click="$refs.noticeUserCombogrid.refresh()" type="primary") {{ $t('查询') }}
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                  template(slot="more-query" slot-scope="{ formData }")
                    njs-row(:gutter="20")
                      njs-col(:span='12')
                        njs-form-item(prop="ROLE_CODE" :label="$t('用户角色')")
                          njs-combobox(
                            service="P0403404"
                            service-data-value="ROLE_CODE"
                            ref="roleCombobox"
                            service-data-label="ROLE_CODE,ROLE_NAME"
                            v-model="formData.ROLE_CODE"
                          )
                      njs-col(:span='12')
                        njs-form-item(:label="$t('员工类型')" prop="USER_TYPE")
                          njs-combobox(v-model="formData.USER_TYPE"  style='width: 100%;' dict="USER_TYPE")
                    njs-row(:gutter="20")
                      njs-col(:span='12')
                        njs-form-item(prop="BIZ_GRP_ID" :label="$t('业务分组')")
                          njs-combobox(
                            service="P0404404"
                            service-data-value="BIZ_GRP_ID"
                            ref="roleCombobox"
                            service-data-label="BIZ_GRP_ID,GRP_NAME"
                            v-model="formData.BIZ_GRP_ID"
                          )
                      njs-col(:span='12')
                        njs-form-item(:label="$t('所属机构')" prop="ORG_ID")
                          njs-input(v-model="formData.ORG_ID"  style='width: 100%;')
                    div(style="border-bottom: 1px dashed rgba(232,232,232,1); margin-bottom:20px;")
                    njs-row(:gutter="20")
                      njs-col(:span='12')
                        njs-form-item(:label="$t('联系电话')" prop="ATTN_TEL")
                          njs-input(v-model="formData.ATTN_TEL")
                      njs-col(:span='12')
                        njs-form-item(:label="$t('联系邮箱')" prop="EMAIL")
                          njs-input(v-model="formData.EMAIL")
                  <!-----------     常用查询条件  end  ---------------------------------------------------------- -->
              njs-form-item(prop="NOTE_OBJ_GRP" :label="$t('接收业务分组')" v-if="release.formData.NOTE_OBJ_TYPE === '3'")
                njs-combogrid(datagrid-id="system_noticeGrp_P0404404"
                  v-model="release.formData.NOTE_OBJ_GRP"
                  ref="noticeGrpCombogrid"
                  :dialog-title="$t('业务分组')"
                  dialog-width="50%"
                  service="P0404404"
                  hide-head
                  single-select
                  data-value="BIZ_GRP_ID"
                  data-label="BIZ_GRP_ID,GRP_NAME"
                  multiple
                  reserve-selection
                  row-key="BIZ_GRP_ID")
                  <!-----------     列配置  start ---------------------------------------------------------- -->
                  njs-column(prop="BIZ_GRP_ID" :label="$t('分组编号')" sortable min-width="80")
                  njs-column(prop="GRP_NAME" :label="$t('分组名称')" show-overflow-tooltip min-width="100")
                  njs-column(prop="HEADMAN_CODE" :label="$t('组长编号')" min-width="100")
                  njs-column(prop="HEADMAN_NAME" :label="$t('组长名称')" min-width="100")
                  njs-column(prop="GRP_PURP" :label="$t('分组用途')" dict="GRP_PURP" min-width="120")
                  <!-----------     列配置  end ---------------------------------------------------------- -->
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                  template(slot="more-used-query" slot-scope="{ formData }")
                    njs-form-item(prop="BIZ_GRP_ID")
                      njs-input(v-model="formData.BIZ_GRP_ID" :placeholder="$t('请输入分组编号')" clearable @keydown.13.native="$refs.noticeGrpCombogrid.refresh()" @change="$refs.noticeGrpCombogrid.refresh()")
                    njs-form-item(prop="GRP_NAME")
                      njs-input(v-model="formData.GRP_NAME" :placeholder="$t('请输入分组名称')"  clearable @keydown.native.13="$refs.noticeGrpCombogrid.refresh()" @change="$refs.noticeGrpCombogrid.refresh()")
                    njs-form-item
                      njs-button(@click="$refs.noticeGrpCombogrid.refresh()" type="primary") {{$t('查询')}}
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
              njs-form-item(prop="NOTE_OBJ_ORG" :label="$t('接收机构')" v-if="release.formData.NOTE_OBJ_TYPE === '4'")
                njs-input(v-model="release.formData.NOTE_OBJ_ORG")
              njs-form-item(prop="NOTE_OBJ_POST" :label="$t('接收岗位')" v-if="release.formData.NOTE_OBJ_TYPE === '5'")
                njs-combogrid(datagrid-id="system_noticePost_P0402404"
                  v-model="release.formData.NOTE_OBJ_POST"
                  ref="noticePostCombogrid"
                  :dialog-title="$t('岗位')"
                  dialog-width="50%"
                  service="P0402404"
                  hide-head
                  single-select
                  data-value="POST_ID"
                  data-label="POST_ID,POST_NAME"
                  multiple
                  reserve-selection
                  row-key="POST_ID")
                  <!-----------     列配置  start ---------------------------------------------------------- -->
                  njs-column(prop="POST_ID" :label="$t('岗位编号')" sortable min-width="50")
                  njs-column(prop="POST_NAME" :label="$t('岗位名称')" show-overflow-tooltip sortable min-width="100")
                  njs-column(prop="POST_STAT" :label="$t('岗位状态')" min-width="100" dict="POST_STAT" type="state" :state-map="{'1': 'success', '0': 'danger'}")
                  <!-----------     列配置  end ---------------------------------------------------------- -->

                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                  template(slot="more-used-query" slot-scope="{ formData }")
                    njs-form-item(prop="POST_NAME")
                      njs-input(v-model="formData.POST_NAME" :placeholder="$t('请输入岗位名称')" clearable @keydown.13.native="$refs.noticePostCombogrid.refresh()" @change="$refs.noticePostCombogrid.refresh()")
                    njs-form-item(prop="POST_STAT")
                      njs-combobox(v-model="formData.POST_STAT" :placeholder="$t('请选择岗位状态')" dict="POST_STAT"  clearable @keydown.native.13="$refs.noticePostCombogrid.refresh()" @change="$refs.noticePostCombogrid.refresh()")
                    njs-form-item
                      njs-button(@click="$refs.datagrid.refresh()" type="primary") {{$t('查询')}}
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
              njs-form-item(prop="IMDE" :label="$t('重要程度')")
                njs-combobox(v-model="release.formData.IMDE" dict="IMDE")
              njs-form-item(prop="EXP_DATE" :label="$t('有效期')")
                njs-date-picker(v-model="release.formData.EXP_DATE" value-format="yyyy-MM-dd" style='width: 100%;')
              njs-form-item(prop="NOTE_CONT" :label="$t('公告内容')")
                editor(v-model="release.formData.NOTE_CONT" :init="{toolbar: 'fullscreen preview | undo redo | bold italic forecolor backcolor underline strikethrough | link table image | alignleft aligncenter alignright alignjustify outdent indent | formatselect fontselect fontsizeselect | bullist numlist | blockquote subscript superscript removeformat'}")
          njs-button(type="primary" slot="footer" size="medium" @click="submitRelease") {{$t('发布')}}

          <!-- 系统公告已读未读查询 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="showCard" width="60%" hide-title)
          njs-datagrid(
          datagrid-id="system_noteIsRead_P0113405"
          service="P0113405"
          ref="noteReadDatagrid"
          :title="$t('系统公告已读未读查询')"
          @before-load="handleNoteReadBeforeLoad"
          :auto-loading="true"
          )
            njs-column(prop="NOTE_ID" :label="$t('公告编号')" sortable show-overflow-tooltip)
            njs-column(prop="NOTE_TITLE" :label="$t('公告标题')" sortable show-overflow-tooltip)
            njs-column(prop="USER_NAME" :label="$t('接收人')" sortable show-overflow-tooltip)
            njs-column(prop="IS_READ" :label="$t('是否已读')" sortable show-overflow-tooltip dict="IS_READ")
            njs-column(prop="ISSUE_USER" :label="$t('发布人')" sortable show-overflow-tooltip)
            njs-column(prop="ISSUE_TIME" :label="$t('发布时间')" sortable show-overflow-tooltip min-width="130")
          <!-- 系统公告已读未读查询 ------------------- end ---------------------------------------------- -->

        <!-- 系统公告详情 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="noticeshowCard" width="60%" hide-title)
          div
            njs-row
              njs-col(:span='24')
                h2(v-html="oldRow.NOTE_TITLE")
            njs-row(type="flex" justify="center" class="notice-span")
              njs-col(:span='6')
                span {{ $t('重要程度') }} :
                span( v-text=" $store.getters.getDict('IMDE',oldRow.IMDE)" )
              njs-col(:span='6')
                span {{ $t('公告类型') }} :
                span(v-text="$store.getters.getDict('NOTE_TYPE', oldRow.NOTE_TYPE)")
              njs-col(:span='6')
                span {{ $t('发布时间') }} :
                span {{ oldRow.ISSUE_TIME }}
              njs-col(:span='6')
                span {{ $t('发布人') }} :
                span {{ oldRow.ISSUE_USER }}
          .border-bottom
          .notice-div(v-html="noticeHtml")
      <!-- 系统公告详情 ------------------- end ---------------------------------------------- -->

</template>

<script>
import { formatDate } from '@/utils/utils'
import editor from '@/components/c-editor/index'
export default {
  name: 'system.notice', // 页面级别组件一定要用路由名称命名！！！
  components: {
    editor
  },
  data () {
    return {
      oldRow: {}, // 老的选中行
      showCard: false, // 是否显示右侧卡片
      noticeshowCard: false, // 详情的右侧卡片
      rules: {
        NOTE_ID: { max: 60, message: this.$t('输入长度不可超过 60'), trigger: 'change' },
        NOTE_TITLE: { max: 60, message: this.$t('输入长度不可超过 60'), trigger: 'change' },
        BEGIN_END_DATE: { required: true, message: this.$t('请选择日期范围'), trigger: 'change' }
      },
      releaseRules: { // 发布公告校验
        NOTE_TYPE: { required: true, message: this.$t('请选择公告类型'), trigger: 'change' },
        NOTE_TITLE: { required: true, max: 60, message: this.$t('输入长度不可超过 60'), trigger: 'change' },
        IMDE: { required: true, message: this.$t('请选择重要程度'), trigger: 'change' },
        EXP_DATE: { required: true, message: this.$t('请选择有效期'), trigger: 'change' },
        NOTE_OBJ_TYPE: { required: true, message: this.$t('请选择接收类型'), trigger: 'change' },
        NOTE_OBJ_USER: { required: true, message: this.$t('请选择员工'), trigger: 'change' },
        NOTE_OBJ_GRP: { required: true, message: this.$t('请选择业务分组'), trigger: 'change' },
        NOTE_OBJ_ORG: { required: true, message: this.$t('请选择机构'), trigger: 'change' },
        NOTE_OBJ_POST: { required: true, message: this.$t('请选择岗位'), trigger: 'change' }
      },
      btnList: [
        {
          text: this.$t('发布公告'),
          handler: () => {
            this.releaseVisible = true
            this.release.formData = {
              NOTE_TYPE: '',
              NOTE_TITLE: '',
              NOTE_OBJ_TYPE: '',
              NOTE_OBJ_USER: '',
              NOTE_OBJ_GRP: '',
              NOTE_OBJ_ORG: '',
              NOTE_OBJ_POST: '',
              IMDE: '',
              EXP_DATE: '',
              NOTE_CONT: ''
            }
          }
        }
      ],
      addPostPeople: {
        title: this.$t('员工信息')
      },
      releaseVisible: false, // 系统公告发布
      release: {
        formData: {
          NOTE_TYPE: '',
          NOTE_TITLE: '',
          NOTE_OBJ_TYPE: '',
          NOTE_OBJ_USER: '',
          NOTE_OBJ_GRP: '',
          NOTE_OBJ_ORG: '',
          NOTE_OBJ_POST: '',
          IMDE: '',
          EXP_DATE: '',
          NOTE_CONT: ''
        },
        title: this.$t('发布公告'),
        service: 'P0113101' // 接口号
      },
      enterCell: {
        NOTE_ID: '',
        property: '',
        EXP_DATE: '',
        row: {}
      }
    }
  },
  methods: {
    // 提交新增或修改
    submitRelease () {
      this.$refs.releaseForm.submit().then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('发布公告成功')
          })
          this.releaseVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 删除公告
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要删除公告') + row.NOTE_TITLE + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0113203',
          NOTE_ID: row.NOTE_ID
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除公告') + row.NOTE_TITLE + this.$t('成功')
            })
            this.$refs.datagrid.refresh()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消删除')
        })
      })
    },
    // 点击某行
    rowClick (row, column, event) {
      if (this.oldRow.NOTE_ID === row.NOTE_ID) {
        this.showCard = !this.showCard
      } else {
        if (!this.noticeshowCard) {
          this.showCard = true
        }
      }
      this.oldRow = row || {}
      this.$refs.noteReadDatagrid.refresh()
    },
    // 点击已读未读查询之前
    handleNoteReadBeforeLoad (req, callback) {
      req[0].NOTE_ID = this.oldRow.NOTE_ID
      callback(req)
    },
    // 点击详情
    handlerShowDetails (row) {
      this.showCard = false
      this.noticeshowCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
    },
    // 已读未读查询
    handlerNoteReadQuery (row) {
      this.showCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$refs.noteReadDatagrid.refresh()
    },
    // 状态变更标记哪一行那一列
    editNoteExpDate (row, column) {
      this.enterCell.NOTE_ID = row.NOTE_ID
      this.enterCell.property = column.property
      this.enterCell.EXP_DATE = row.EXP_DATE
      this.enterCell.row = row
    },
    handlerExpdateChange (val) {
      this.$ajaxRequest([{
        service: 'P0113302',
        NOTE_ID: this.enterCell.NOTE_ID,
        EXP_DATE: val
      }]).then((result) => {
        if (result.code === '0') {
          this.enterCell.row.EXP_DATE = this.enterCell.EXP_DATE
        } else {
          this.enterCell.EXP_DATE = this.enterCell.row.EXP_DATE
        }
        this.enterCell = {
          NOTE_ID: '',
          property: '',
          EXP_DATE: '',
          row: {}
        }
        this.$refs.datagrid.refresh()
      }).catch((err) => {
        this.enterCell.EXP_DATE = this.enterCell.row.EXP_DATE
        this.enterCell = {
          NOTE_ID: '',
          property: '',
          EXP_DATE: '',
          row: {}
        }
        console.error(err)
      })
    }
  },
  computed: {
    computedPickerOptions () {
      let _this = this
      return {
        shortcuts: [{
          text: this.$t('最近一周'),
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            _this.minDate = null
            picker.$emit('pick', [start, end])
          }
        }],
        disabledDate (time) {
          let getTime = time.getTime()
          let timeAfterNow = getTime > Date.now()
          if (timeAfterNow) {
            return timeAfterNow
          }
          if (_this.minDate) {
            const times = 86400000 * 6// 6天的毫秒数
            let curSelectTime = _this.minDate.getTime()
            let before = curSelectTime - times// 前一周毫秒数
            let after = curSelectTime + times// 后一周毫秒数
            return getTime > after || getTime < before
          }
        },
        onPick ({ maxDate, minDate }) {
          if (!maxDate) {
            _this.minDate = minDate
          } else {
            _this.minDate = null
          }
        }
      }
    },
    BEGIN_END_DATE () { // 设置默认查询范围为近一周
      let now = new Date()
      let start = new Date(now.getTime() - 24 * 60 * 60000 * 6)
      return `${formatDate(start, 'yyyy-MM-dd')},${formatDate(now, 'yyyy-MM-dd')}`
    },
    noticeHtml () {
      console.log(this.oldRow.NOTE_CONT)
      return this.oldRow.NOTE_CONT ? this.oldRow.NOTE_CONT.replace(/\&quot;/g, '"') : ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
