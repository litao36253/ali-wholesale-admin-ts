<template lang="pug">
  .wrap
    njs-datagrid(
      datagrid-id="employee_post_P0402404"
      ref="datagrid"
      :title="$t('岗位管理')"
      :subheading="$t('用于开发人员及运维人员维护岗位信息。')"
      service="P0402404"
      :rules="rules"
      :auto-loading="true"
      :button-list="btnList"
      @row-click="rowClick"
      single-select
    )
      <!-----------     列配置  start ---------------------------------------------------------- -->
      njs-column(prop="POST_ID" :label="$t('岗位编号')" sortable min-width="50")
      njs-column(prop="POST_NAME" :label="$t('岗位名称')" show-overflow-tooltip sortable min-width="100")
      njs-column(prop="POST_STAT" :label="$t('岗位状态')" min-width="100" dict="POST_STAT" type="state" :state-map="{'1': 'success', '0': 'danger'}")
      njs-column(prop="POST_NUM" :label="$t('成员人数')" min-width="100")
      njs-column(prop="LAST_UPDATE_USER" :label="$t('最后更新人')" min-width="120")
      njs-column(prop="LAST_UPDATE_TIME" :label="$t('最后更新时间')" min-width="120")
      njs-column(:label="$t('操作')" min-width="150" fixed="right")
        template(slot-scope="{row}")
          njs-button(type="text" @click.stop="handlerShowDetails(row)") {{$t('成员管理')}}
          njs-button(type="text" @click.stop="handlerEditItem(row)") {{$t('修改')}}
          njs-tooltip(effect="dark" :content="$t('该岗位存在成员,清空成员才可删除！')" placement="top" :disabled="+row.POST_NUM === 0")
            span(:style="{display: 'inline-block', marginLeft: '10px'}" @click.stop)
              njs-button(type="text" @click.stop="handlerDelItem(row)" :disabled="+row.POST_NUM !== 0") {{$t('删除')}}
      <!-----------     列配置  end ---------------------------------------------------------- -->

      <!-----------     常用查询条件  start ---------------------------------------------------------- -->
      template(slot="more-used-query" slot-scope="{ formData }")
        njs-form-item(prop="POST_NAME")
          njs-input(v-model="formData.POST_NAME" :placeholder="$t('请输入岗位名称')" clearable @keydown.13.native="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
        njs-form-item(prop="POST_STAT")
          njs-combobox(v-model="formData.POST_STAT" :placeholder="$t('请选择岗位状态')" dict="POST_STAT"  clearable @keydown.native.13="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
        njs-form-item
          njs-button(@click="$refs.datagrid.refresh()" type="primary") {{$t('查询')}}
      <!-----------     常用查询条件  start ---------------------------------------------------------- -->

      <!-- 右侧卡片的插槽新增修改 ------------------- start ---------------------------------------------- -->
      template(slot="fixed-card" slot-scope="{ formData }")
        njs-datagrid-card(:width="500" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
          .form-wrap
            njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules" )
              njs-form-item(prop="POST_NAME" :label="$t('岗位名称')")
                njs-input(v-model="addEdit[addEditType].formData.POST_NAME")
              njs-form-item(prop="POST_STAT" :label="$t('岗位状态')")
                njs-radio-group(v-model="addEdit[addEditType].formData.POST_STAT" dict="POST_STAT")
          njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{$t('确定')}}

        <!-- 岗位成员管理 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="showCard" width="80%" hide-title)
          njs-datagrid(
            datagrid-id="employee_post_people_P0402405"
            service="P0402405"
            ref="postPeopleDatagrid"
            :title="$t('岗位成员管理')"
            :subheading="$t('管理') + oldRow.POST_NAME + $t('的员工。')"
            @before-load="handlePostPeopleBeforeLoad"
            :auto-loading="true"
            :multiple="true"
            :button-list="peopleBtnList"
            reserve-selection
            row-key="USER_CODE"
          )
            njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable show-overflow-tooltip)
            njs-column(prop="USER_NAME" :label="$t('员工名称')" sortable show-overflow-tooltip)
            njs-column(prop="ORG_NAME" :label="$t('所属机构')" sortable show-overflow-tooltip)
            njs-column(prop="ROLE_NAME_STR" :label="$t('所属角色')" sortable show-overflow-tooltip)
            njs-column(prop="USER_STAT" :label="$t('员工状态')" sortable show-overflow-tooltip dict="USER_STAT" type="state" :state-map="{'1': 'success', '0': 'danger'}")
            njs-column(prop="OFF_TEL" :label="$t('办公电话')" sortable show-overflow-tooltip)
            njs-column(prop="MOBILE" :label="$t('移动电话')" sortable show-overflow-tooltip)
            njs-column(prop="EMAIL" :label="$t('邮箱地址')" sortable show-overflow-tooltip)
            njs-column(:label="$t('操作')" min-width="80")
              template(slot-scope="{row, column}" fixed="right")
                njs-button(type="text"  @click.stop="handlerPeopleDelItem(row)") {{$t('删除')}}
      <!-- 岗位成员管理 ------------------- end ---------------------------------------------- -->

    <!-- 岗位批量新增 ------------------------------------------ start ------------------------------>
    njs-dialog(:title="addPostPeople.title" :visible.sync="addPostPeopleVisible" width="65%" :class="['njs-combogrid-dialog']")
      njs-datagrid(
        datagrid-id="employee_addPostPeople_P0402407"
        service="P0402407"
        ref="addPostPeopleDatagrid"
        :auto-loading="true"
        :multiple="true"
        reserve-selection
        row-key="USER_CODE"
        hide-head
        height="60vh"
        v-if="addPostPeopleVisible"
        @before-load="handleAddPostPeopleBeforeLoad"
      )
        njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable show-overflow-tooltip)
        njs-column(prop="USER_NAME" :label="$t('员工名称')" sortable show-overflow-tooltip)
        njs-column(prop="ORG_NAME" :label="$t('所属机构')" sortable show-overflow-tooltip)
        njs-column(prop="ROLE_NAME_STR" :label="$t('所属角色')" sortable show-overflow-tooltip)
        njs-column(prop="USER_STAT" :label="$t('员工状态')" sortable show-overflow-tooltip dict="USER_STAT")
        njs-column(prop="OFF_TEL" :label="$t('办公电话')" sortable show-overflow-tooltip)
        njs-column(prop="MOBILE" :label="$t('移动电话')" sortable show-overflow-tooltip)
        njs-column(prop="EMAIL" :label="$t('邮箱地址')" sortable show-overflow-tooltip)
        template(slot="more-used-query" slot-scope="{ formData }")
          njs-form-item(prop="USER_CODE")
            njs-input(v-model="formData.USER_CODE" :placeholder="$t('请输入员工编号')" clearable @keydown.native.13="$refs.addPostPeopleDatagrid.refresh()" @change="$refs.addPostPeopleDatagrid.refresh()")
          njs-form-item(prop="USER_STAT")
            njs-combobox(v-model="formData.USER_STAT" :placeholder="$t('请选择员工状态')" dict="USER_STAT"  clearable @keydown.native.13="$refs.addPostPeopleDatagrid.refresh()" @change="$refs.addPostPeopleDatagrid.refresh()")
          njs-form-item
            njs-button(@click="$refs.addPostPeopleDatagrid.refresh()" type="primary") {{$t('查询')}}

      template(slot="footer")
        njs-button(type="primary" @click="addBatchPostPeople()") {{ $t('保存') }}
        njs-button(@click="addPostPeopleVisible = false") {{ $t('取 消') }}
    <!-- 岗位批量新增 ------------------------------------------ end ------------------------------>
    <!---------------    导入员工数据 弹出框    start  --------------------------------------------------------->
    njs-dialog(:title="importInfo.title" :visible.sync="importVisible")
      njs-row(:gutter="20")
        njs-col(:span="12")
          njs-radio-group(v-model='importInfo.formData.TYPE' dict="IMP_EMP_TYPE" )
      njs-row(:gutter="20")
        njs-col(:span="12")
          a(href="#" @click="download") {{ $t('下载员工导入模版') }}
      njs-row(:gutter="20")
        njs-col(:span="12")
          njs-upload(
            :action="uploadUrl"
            :file-list="fileList"
            :multiple="false"
            :onSuccess="uploadsuccess"
            :limit='1'
            :beforeUpload="beforeAvatarUpload"
            :beforeRemove="beforeRemove"
            :onExceed="onExceed"
            ref="upLoad")
            njs-button(type="primary") {{ $t('上传文件') }}
      div(v-show="showMsg")
        p {{ $t('文件共') }}{{ checkInAll }}{{ $t('条数据，已通过') }}{{ checkInData.SUCCESS_COUNT }}{{ $t('条，未通过') }}{{ checkInData.FAIL_COUNT }}{{ $t('条') }}
        div(v-show="checkInData.SUCCESS_COUNT != 0")
          njs-button(type="primary" @click="continueUpdata" v-show="checkInData.SUCCESS_COUNT != 0") {{ $t('继续导入') }}
          njs-button(type="primary" @click="continueDown" plain v-show="checkInData.FAIL_COUNT != 0") {{ $t('下载未通过的数据') }}
        p(v-show="successUp") {{ $t('成功导入') }}{{ successUpData.SUCCESS_COUNT }}{{ $t('条数据，失败') }}{{ successUpData.FAIL_COUNT }}{{ $t('条数据') }}
        div(v-show="successUp")
          njs-button(type="primary" @click="isOk") {{ $t('完成') }}
          njs-button(type="primary" @click="errorDown"  plain v-show="successUpData.FAIL_COUNT != 0 && successUpData.FAIL_COUNT != 'underfind'") {{ $t('下载错误的数据') }}
    <!---------------    导入员工数据 弹出框    end  --------------------------------------------------------->

</template>

<script>
import { API as configApi } from '@/conf/'
// 获取接口根路径
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development
const RULE_POST_NAME = [
  { max: 32, message: window.app.$t('长度不能超过20'), trigger: 'change' }
]
export default {
  name: 'employee.post', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      oldRow: {}, // 老的选中行
      showCard: false, // 是否显示右侧卡片
      rules: {
        POST_NAME: RULE_POST_NAME
      },
      addEditRules: { // 新增/修改的校验规则
        POST_NAME: [
          { required: true, message: this.$t('请输入岗位名称'), trigger: ['blur', 'change'] },
          ...RULE_POST_NAME
        ]
      },
      btnList: [
        {
          text: this.$t('新增岗位'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              POST_NAME: '', // 岗位名称
              POST_STAT: '1' // 岗位状态
            }
            this.$nextTick(() => {
              this.$refs.addEditForm.clearValidate()
            })
          }
        }
      ],
      addPostPeopleVisible: false, // 岗位普通新增成员
      addPostPeople: {
        title: this.$t('员工信息')
      },
      fileList: [],
      fileName: '', // 文件名
      errorInfo: false, // 错误显示
      isAppendixUploading: false, // 是否有附件正在上传
      cannotExtensionName: ['xlsx'], // 只允许上传的文件格式
      checkInAll: '', // 总校验条数
      checkInData: [], // 校验返回值
      successUp: false, // 成功上传显示
      successUpData: [], // 成功返回值
      showMsg: false, // 显示上传状态框
      failRedisKey: '', // 失败redis key
      successRedisKey: '', // 成功redis key
      errorRedisKey: '', // 错误的redis key
      importVisible: false, // 导入弹窗可见状态
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEdit: {
        add: {
          formData: {
            POST_NAME: '', // 岗位名称
            POST_STAT: '1' // 岗位状态
          },
          title: this.$t('新增岗位'),
          service: 'P0402101' // 接口号
        },
        edit: {
          formData: {
            POST_NAME: '', // 岗位名称
            POST_STAT: '' // 岗位状态
          },
          title: this.$t('修改岗位'),
          service: 'P0402302' // 接口号
        }
      },
      importInfo: {
        formData: {
          TYPE: ''
        },
        title: this.$t('员工导入')
      },
      uploadUrl: ''
    }
  },
  created () {
    this.uploadUrl = '/njdf_upload?DIR=import'
  },
  methods: {
    // 提交新增或修改
    submitAddEdit () {
      this.$refs.addEditForm.submit().then((result) => {
        if (result.code === '0') {
          if (this.addEditType === 'add') {
            this.$message({
              type: 'success',
              message: this.$t('新增岗位') + this.addEdit.add.formData.POST_NAME + this.$t('成功')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改岗位') + this.addEdit.edit.formData.POST_NAME + this.$t('成功')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 修改岗位
    handlerEditItem (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.addEdit.edit.formData = {
        POST_ID: row.POST_ID,
        POST_NAME: row.POST_NAME, // 岗位名称
        POST_STAT: row.POST_STAT // 岗位状态
      }
      this.$nextTick(() => {
        this.$refs.addEditForm.clearValidate()
      })
    },
    // 删除岗位
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要删除岗位') + row.POST_NAME + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0402203',
          POST_ID: row.POST_ID
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除岗位') + row.POST_NAME + this.$t('成功')
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
      if (this.oldRow.POST_ID === row.POST_ID) {
        this.showCard = !this.showCard
      } else {
        this.showCard = true
      }
      this.oldRow = row || {}
      if (this.showCard) {
        this.$refs.postPeopleDatagrid.refresh()
        this.$refs.postPeopleDatagrid.clearSelection()
      }
    },
    // 成员刷新之前
    handlePostPeopleBeforeLoad (req, callback) {
      req[0].POST_ID = this.oldRow.POST_ID
      callback(req)
    },
    handleAddPostPeopleBeforeLoad (req, callback) {
      req[0].POST_ID = this.oldRow.POST_ID
      callback(req)
    },
    // 点击管理成员管理
    handlerShowDetails (row) {
      this.showCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$refs.postPeopleDatagrid.refresh()
      this.$refs.postPeopleDatagrid.clearSelection()
    },
    handlerPeopleDelItem (row) {
      this.$confirm(this.$t('你确定要删除成员') + row.USER_NAME + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0402206',
          POST_ID: row.POST_ID,
          USER_CODE: row.USER_CODE
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除成员') + row.USER_NAME + this.$t('成功')
            })
            this.$refs.postPeopleDatagrid.refresh()
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
    addBatchPostPeople () {
      let selection = this.$refs.addPostPeopleDatagrid.getAttr('selection')
      if (selection.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择记录')
        })
        return
      }
      let userIds = ''
      selection.forEach((item, index) => {
        if (index === 0) {
          userIds += item.USER_CODE
        } else {
          userIds += `,${item.USER_CODE}`
        }
      })
      this.$ajaxRequest([{
        service: 'P0402108',
        USER_CODES: userIds,
        POST_ID: this.oldRow.POST_ID
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.addPostPeopleVisible = false
          this.$refs.postPeopleDatagrid.refresh()
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 导入功能下载模板方法
    download () {
      let url = BASE_PATH.UCC + '/EmployeeImport.xlsx'
      window.open(url, '_blank')
    },
    // 文件数量校验，设置 :limit="1"
    onExceed () {
      this.$message({
        message: this.$t('只能上传一个文件'),
        type: 'warning'
      })
    },
    // 上传之前调用，用于检测文件是否符合需求
    beforeAvatarUpload (file) {
      let cnaNameLength = file.name.length <= 128
      var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
      let canLname = this.cannotExtensionName.indexOf(testmsg) !== -1
      const isLt2M = file.size / 1024 / 1024 <= 100

      if (!isLt2M) {
        this.$message({
          message: this.$t('上传文件大小不能超过 100MB!'),
          type: 'warning'
        })
      }
      if (!cnaNameLength) {
        this.$message({
          message: this.$t('上传文件名的长度不能超过128(含扩展名)！'),
          type: 'warning'
        })
      }
      if (!canLname) {
        this.$message({
          message: this.$t('只允许上传xlsx文件格式！'),
          type: 'warning'
        })
      }
      let verification = isLt2M && cnaNameLength && canLname
      if (verification) {
        this.isAppendixUploading = true
      }
      return verification
    },
    // 移除文件时调用
    beforeRemove (file, fileList) {
      this.$confirm(this.$t('确定移除') + file.name + '？')
      this.showMsg = false
    },
    // 上传成功调用
    async uploadsuccess (res) {
      let file = res[0].data
      this.fileName = file[0].FILECON
      this.$request({
        apiType: 'UCC',
        url: '/njdf_import?FILENAME=' + this.fileName + '&SERVICE=P0404509&IMPORTTYPE=1&encoderType=none&TYPE=' + this.importInfo.formData.TYPE + '&MODULE=POST_ID&ID=' + this.oldRow.POST_ID,
        data: {}
      }).then((result) => {
        this.showMsg = true
        console.log(result)
        this.checkInData = result.data[0]
        if (this.checkInData.SUCCESS_COUNT === 0) {
          this.errorInfo = true
        }
        this.failRedisKey = result.data[0].FAIL_REDIS_KEY
        this.successRedisKey = result.data[0].SUCCESS_REDIS_KEY
        this.checkInAll = parseInt(this.checkInData.FAIL_COUNT) + parseInt(this.checkInData.SUCCESS_COUNT)
        if (this.checkInAll === 0) {
          this.$message({
            message: this.$t('上传文件的数据为空，请重新上传！'),
            type: 'warning'
          })
          this.isOk()
        }
      })
    },
    // 继续导入调用
    continueUpdata () {
      this.continue()
    },
    // 下载未通过的数据
    continueDown () {
      let url = BASE_PATH.UCC + '/EmployeeExportTXT?FAIL_REDIS_KEY=' + this.failRedisKey + '&FILE_NAME=' + this.$t('检查未通过的数据')
      window.open(url, '_blank')
    },
    // 下载错误数据
    errorDown () {
      let url = BASE_PATH.UCC + '/EmployeeExportTXT?FAIL_REDIS_KEY=' + this.errorRedisKey + '&FILE_NAME=' + this.$t('导入失败的数据')
      window.open(url, '_blank')
    },
    // 点击成功之后关闭弹框，并初始化数据
    isOk () {
      this.$refs.upLoad.clearFiles()
      this.checkInAll = ''
      this.successUp = false
      this.checkInData = []
      this.showMsg = false
      this.errorInfo = false
      this.$refs.datagrid.refresh()
    },
    // 导入成功之后的数据，可以获取成功和失败的数据
    async continue () {
      let vm = this
      this.$ajaxRequest([{
        service: 'P0404510',
        SUCCESS_REDIS_KEY: vm.checkInData.SUCCESS_REDIS_KEY,
        ID: vm.oldRow.POST_ID,
        MODULE: 'POST_ID',
        TYPE: this.importInfo.formData.TYPE
      }]).then((result) => {
        if (result.code === '0') {
          vm.$message.success(result.msg)
          vm.successUpData = result.data[0]
          vm.successUp = true
          vm.errorRedisKey = result.data[0].FAIL_REDIS_KEY
          this.$refs.bizGrpMemberDatagrid.refresh()
        } else {
          vm.$message.error(result.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  },
  computed: {
    peopleBtnList () {
      return [
        { // 普通新增成员
          text: this.$t('新增'),
          handler: () => {
            this.addPostPeopleVisible = true
            this.$refs.addPostPeopleDatagrid.clearSelection()
          }
        },
        { // 导入成员
          text: this.$t('导入'),
          handler: () => {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.successUp = false
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.checkInData.SUCCESS_COUNT = 0
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.importInfo.formData.TYPE = 'USER_CODE'
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.importVisible = true
          }
        },
        { // 批量录入成员
          text: this.$t('批量录入'),
          handler: () => {
            this.$alert(window.app.$t('待开发(*￣︶￣)'))
          }
        },
        { // 批量删除
          type: 'delete',
          text: this.$t('批量删除'),
          service: 'P0402206',
          key: 'USER_CODE',
          max: '100',
          query: {
            POST_ID: this.oldRow.POST_ID
          },
          success: (result) => {
            this.$refs.postPeopleDatagrid.clearSelection()
            this.$refs.datagrid.refresh()
          }
        },
        { // 清空该岗位下的所有成员
          text: this.$t('清空'),
          handler: () => {
            this.$confirm(this.$t('你确定要清空所有成员吗？'), this.$t('提示'), {
              type: 'warning'
            }).then(() => {
              this.$ajaxRequest([{
                service: 'P0402206',
                POST_ID: this.oldRow.POST_ID
              }]).then((result) => {
                if (result.code === '0') {
                  this.$message({
                    type: 'success',
                    message: this.$t('清空成功！')
                  })
                  this.$refs.postPeopleDatagrid.refresh()
                  this.$refs.datagrid.refresh()
                }
              })
            }).catch(() => {
              this.$message({
                type: 'info',
                message: this.$t('已取消删除')
              })
            })
          }
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
