<template lang="pug">
  .wrap
    njs-datagrid(
      datagrid-id="employee_role_P0403404"
      ref="datagrid"
      :title="$t('角色管理')"
      :subheading="$t('用于开发人员及运维人员维护角色信息。')"
      service="P0403404"
      :rules="rules"
      :auto-loading="true"
      :button-list="btnList"
      @row-click="rowClick"
      single-select
    )
      <!-----------     列配置  start ---------------------------------------------------------- -->
      njs-column(prop="ROLE_CODE" :label="$t('角色编号')" sortable min-width="50")
      njs-column(prop="ROLE_NAME" :label="$t('角色名称')" show-overflow-tooltip sortable min-width="100")
      njs-column(prop="ROLE_STAT" :label="$t('角色状态')" min-width="100" dict="POST_STAT" type="state" :state-map="{'0': 'info', '1': 'success'}")
      njs-column(prop="ROLE_NUM" :label="$t('成员人数')" min-width="100")
      njs-column(prop="REMARK" :label="$t('备注')" min-width="100")
      njs-column(prop="LAST_UPDATE_USER" :label="$t('最后更新人')" min-width="120")
      njs-column(prop="LAST_UPDATE_TIME" :label="$t('最后更新时间')" min-width="120")
      njs-column(:label="$t('操作')" min-width="200" fixed="right")
        template(slot-scope="{row}")
          njs-button(type="text" @click.stop="handlerShowDetails(row)") {{ $t('成员管理') }}
          njs-button(type="text" @click.stop="handlerPermissionSet(row)") {{ $t('权限设置') }}
          njs-button(type="text" @click.stop="handlerPermissionClone(row)") {{ $t('权限复制') }}
          njs-button(type="text" @click.stop="handlerEditItem(row)") {{ $t('修改') }}
          njs-tooltip(effect="dark" :content="$t('该角色存在成员，不可删除！')" placement="top" :disabled="+row.ROLE_NUM === 0")
            span(:style="{display: 'inline-block', marginLeft: '10px'}" @click.stop)
              njs-button(type="text" @click.stop="handlerDelItem(row)" :disabled="+row.ROLE_NUM !== 0") {{ $t('删除') }}
      <!-----------     列配置  end ---------------------------------------------------------- -->

      <!-----------     常用查询条件  start ---------------------------------------------------------- -->
      template(slot="more-used-query" slot-scope="{ formData }")
        njs-form-item(prop="ROLE_STAT")
          njs-combobox(v-model="formData.ROLE_STAT" :placeholder="$t('请选择角色状态')" dict="POST_STAT"  clearable @keydown.native.13="$refs.datagrid.refresh()" @change="$refs.datagrid.refresh()")
        njs-datagrid-search(v-model="formData" query-text="ROLE_NAME" :placeholder="$t('请输入角色名称')" hide-select)
      <!-----------     常用查询条件  start ---------------------------------------------------------- -->

      <!-- 右侧卡片的插槽新增修改 ------------------- start ---------------------------------------------- -->
      template(slot="fixed-card" slot-scope="{ formData }")
        njs-datagrid-card(:width="500" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
          .form-wrap
            njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules" )
              njs-form-item(prop="ROLE_NAME" :label="$t('角色名称')")
                njs-input(v-model="addEdit[addEditType].formData.ROLE_NAME")
              njs-form-item(prop="ROLE_STAT" :label="$t('角色状态')")
                njs-radio-group(v-model="addEdit[addEditType].formData.ROLE_STAT" dict="POST_STAT")
              njs-form-item(prop="REMARK" :label="$t('备注')")
                njs-input(v-model="addEdit[addEditType].formData.REMARK" type="textarea" :rows="4")
          njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{$t('确定')}}

        <!-- 权限设置 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="showPowerSetCard" width="400px" :title="$t('权限设置')")
          div(style="padding: 20px;")
            njs-tree(
              service="P0403409"
              show-checkbox
              default-expand-all
              node-key="POWER_ID"
              pid="PAR_POWER"
              ref="rolePowerSetTree"
              highlight-current
              label="POWER_NAME"
              @load-success="loadSuccessPowerSet"
              @before-load="boforeLoadPowerSet"
              show-search
            )
          njs-button(type="primary" slot="footer" size="medium" @click="submitRolePowerSet") {{$t('确定')}}
        <!-- 权限设置 ------------------- end ---------------------------------------------- -->
        <!-- 权限复制 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="showPowerCloneCard" width="400px" :title="$t('权限复制')")
          .form-wrap
            njs-form(:model="powerClone.formData" v-if="showPowerCloneCard" size="small" ref="powerCloneForm" :show-submit="false" :service="powerClone.service" :show-reset="false" :close-text="$t('取消')" :rules="powerCloneRules")
              njs-form-item(prop="TARG_ROLE_CODE" :label="$t('复制角色模板')")
                njs-combogrid(datagrid-id="employee_rolePower_P0403404"
                  v-model="powerClone.formData.TARG_ROLE_CODE"
                  ref="rolePowerCombogrid"
                  :dialog-title="$t('角色信息')"
                  @before-load="beforeLoadRoleInfo"
                  dialog-width="50%"
                  service="P0403404"
                  hide-head
                  single-select
                  data-value="ROLE_CODE"
                  data-label="ROLE_CODE,ROLE_NAME"
                )
                  <!-----------     列配置  start ---------------------------------------------------------- -->
                  njs-column(prop="ROLE_CODE" :label="$t('角色编号')" sortable min-width="50")
                  njs-column(prop="ROLE_NAME" :label="$t('角色名称')" show-overflow-tooltip sortable min-width="100")
                    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                  template(slot="more-used-query" slot-scope="{ formData }")
                    njs-form-item(prop="ROLE_STAT")
                      njs-combobox(v-model="formData.ROLE_STAT" :placeholder="$t('请选择角色状态')" dict="POST_STAT"  clearable @keydown.native.13="$refs.rolePowerCombogrid.refresh()" @change="$refs.rolePowerCombogrid.refresh()")
                    njs-datagrid-search(v-model="formData" query-text="ROLE_NAME" :placeholder="$t('请输入角色名称')" hide-select)
                  <!-----------     常用查询条件  start ---------------------------------------------------------- -->
              njs-form-item(prop="CLONE_WAY" :label="$t('复制类型')")
                njs-radio-group(v-model="powerClone.formData.CLONE_WAY" dict="CLONE_WAY")
          njs-button(type="primary" slot="footer" size="medium" @click="submitRolePowerClone") {{$t('确定')}}

        <!-- 角色成员管理 ------------------- start ---------------------------------------------- -->
        njs-datagrid-card(:visible.sync="showCard" width="80%" hide-title)
          njs-datagrid(
            datagrid-id="employee_role_people_P0403405"
            service="P0403405"
            ref="rolePeopleDatagrid"
            :title="$t('角色成员管理')"
            :subheading="$t('管理') + oldRow.ROLE_NAME + $t('的员工。')"
            @before-load="handleRolePeopleBeforeLoad"
            :auto-loading="true"
            :multiple="true"
            :button-list="peopleBtnList"
            reserve-selection
            row-key="USER_CODE"
            v-if="showCard"
          )
            njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable show-overflow-tooltip)
            njs-column(prop="USER_NAME" :label="$t('员工名称')" sortable show-overflow-tooltip)
            njs-column(prop="ORG_NAME" :label="$t('所属机构')" sortable show-overflow-tooltip)
            njs-column(prop="POST_NAME_STR" :label="$t('所属岗位')" sortable show-overflow-tooltip)
            njs-column(prop="USER_STAT" :label="$t('员工状态')" sortable show-overflow-tooltip dict="USER_STAT" type="state" :state-map="{'1': 'success', '0': 'danger'}")
            njs-column(prop="OFF_TEL" :label="$t('办公电话')" sortable show-overflow-tooltip)
            njs-column(prop="MOBILE" :label="$t('移动电话')" sortable show-overflow-tooltip)
            njs-column(prop="EMAIL" :label="$t('邮箱地址')" sortable show-overflow-tooltip)
            njs-column(:label="$t('操作')" min-width="80")
              template(slot-scope="{row, column}" fixed="right")
                njs-button(type="text"  @click.stop="handlerPeopleDelItem(row)") {{ $t('删除') }}
      <!-- 角色成员管理 ------------------- end ---------------------------------------------- -->

    <!-- 角色批量新增 ------------------------------------------ start ------------------------------>
    njs-dialog(:title="addRolePeople.title" :visible.sync="addRolePeopleVisible" width="65%" :class="['njs-combogrid-dialog']")
      njs-datagrid(
        datagrid-id="employee_addRolePeople_P0403407"
        service="P0403407"
        ref="addRolePeopleDatagrid"
        @before-load="handleAddRolePeopleBeforeLoad"
        :auto-loading="true"
        :multiple="true"
        reserve-selection
        row-key="USER_CODE"
        hide-head
        height="60vh"
        v-if="addRolePeopleVisible"
      )
        njs-column(prop="USER_CODE" :label="$t('员工编号')" sortable show-overflow-tooltip)
        njs-column(prop="USER_NAME" :label="$t('员工名称')" sortable show-overflow-tooltip)
        njs-column(prop="ORG_NAME" :label="$t('所属机构')" sortable show-overflow-tooltip)
        njs-column(prop="POST_NAME_STR" :label="$t('所属岗位')" sortable show-overflow-tooltip)
        njs-column(prop="USER_STAT" :label="$t('员工状态')" sortable show-overflow-tooltip dict="USER_STAT" type="state" :state-map="{'1': 'success', '0': 'danger'}")
        njs-column(prop="OFF_TEL" :label="$t('办公电话')" sortable show-overflow-tooltip)
        njs-column(prop="MOBILE" :label="$t('移动电话')" sortable show-overflow-tooltip)
        njs-column(prop="EMAIL" :label="$t('邮箱地址')" sortable show-overflow-tooltip)
        template(slot="more-used-query" slot-scope="{ formData }")
          njs-form-item(prop="USER_CODE")
            njs-input(v-model="formData.USER_CODE" :placeholder="$t('请输入员工编号')" clearable @keydown.native.13="$refs.addRolePeopleDatagrid.refresh()" @change="$refs.addRolePeopleDatagrid.refresh()")
          njs-form-item(prop="USER_STAT")
            njs-combobox(v-model="formData.USER_STAT" :placeholder="$t('请选择员工状态')" dict="USER_STAT"  clearable @keydown.native.13="$refs.addRolePeopleDatagrid.refresh()" @change="$refs.addRolePeopleDatagrid.refresh()")
          njs-form-item
            njs-button(@click="$refs.addRolePeopleDatagrid.refresh()" type="primary") {{$t('查询')}}

      template(slot="footer")
        njs-button(type="primary" @click="addBatchRolePeople()") {{ $t('保存') }}
        njs-button(@click="addRolePeopleVisible = false") {{ $t('取 消') }}
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
const RULE_ROLE_NAME = [
  { max: 32, message: window.app.$t('长度不能超过20'), trigger: 'change' }
]
export default {
  name: 'employee.role', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      oldRow: {}, // 老的选中行
      showCard: false, // 是否显示右侧卡片
      showPowerSetCard: false, // 权限设置是否显示
      showPowerCloneCard: false, // 权限复制是否显示
      rules: {
        ROLE_NAME: RULE_ROLE_NAME
      },
      addEditRules: { // 新增/修改的校验规则
        ROLE_NAME: [
          { required: true, message: this.$t('请输入角色名称'), trigger: ['blur', 'change'] },
          ...RULE_ROLE_NAME
        ]
      },
      powerCloneRules: {
        TARG_ROLE_CODE: [
          { required: true, message: this.$t('请选择复制角色模板'), trigger: ['blur', 'change'] }
        ],
        CLONE_WAY: [
          { required: true, message: this.$t('请选择复制类型'), trigger: ['blur', 'change'] }
        ]
      },
      btnList: [
        {
          text: this.$t('新增角色'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              ROLE_NAME: '', // 角色名称
              ROLE_STAT: '1', // 角色状态
              REMARK: '' // 备注
            }
            this.$nextTick(() => {
              this.$refs.addEditForm.clearValidate()
            })
          }
        }
      ],
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

      addRolePeopleVisible: false, // 角色普通新增成员
      addRolePeople: {
        title: this.$t('员工信息')
      },
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEdit: {
        add: {
          formData: {
            ROLE_NAME: '', // 角色名称
            ROLE_STAT: '1', // 角色状态
            REMARK: '' // 备注
          },
          title: this.$t('新增角色'),
          service: 'P0403101' // 接口号
        },
        edit: {
          formData: {
            ROLE_NAME: '', // 角色名称
            POST_STAT: '1', // 角色状态
            REMARK: '' // 备注
          },
          title: this.$t('修改角色'),
          service: 'P0403302' // 接口号
        }
      },
      importInfo: {
        formData: {
          TYPE: ''
        },
        title: this.$t('员工导入')
      },
      powerClone: {
        formData: {
          TARG_ROLE_CODE: '', // 复制角色模板
          CLONE_WAY: '1' // 复制模式
        },
        service: 'P0403111'
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
              message: this.$t('新增角色') + this.addEdit.add.formData.ROLE_NAME + this.$t('成功')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改角色') + this.addEdit.edit.formData.ROLE_NAME + this.$t('成功')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 修改角色
    handlerEditItem (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.addEdit.edit.formData = {
        ROLE_CODE: row.ROLE_CODE,
        ROLE_NAME: row.ROLE_NAME, // 角色名称
        ROLE_STAT: row.ROLE_STAT, // 角色状态
        REMARK: row.REMARK // 备注
      }
      this.$nextTick(() => {
        this.$refs.addEditForm.clearValidate()
      })
    },
    // 删除角色
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要删除角色 ') + row.ROLE_NAME + this.$t(' 吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0403203',
          ROLE_CODE: row.ROLE_CODE
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除角色 ') + row.ROLE_NAME + this.$t(' 成功')
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
      if (this.oldRow.ROLE_CODE === row.ROLE_CODE) {
        this.showCard = !this.showCard
      } else {
        this.showCard = true
      }
      this.oldRow = row || {}
    },
    // 成员刷新之前
    handleRolePeopleBeforeLoad (req, callback) {
      req[0].ROLE_CODE = this.oldRow.ROLE_CODE
      callback(req)
    },
    // 点击管理成员管理
    handlerShowDetails (row) {
      this.showCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
    },
    handleAddRolePeopleBeforeLoad (req, callback) {
      req[0].ROLE_CODE = this.oldRow.ROLE_CODE
      callback(req)
    },
    handlerPeopleDelItem (row) {
      this.$confirm(this.$t('你确定要删除成员 ') + row.USER_NAME + this.$t(' 吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0403206',
          ROLE_CODE: row.ROLE_CODE,
          USER_CODE: row.USER_CODE
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除成员 ') + row.USER_NAME + this.$t(' 成功')
            })
            this.$refs.rolePeopleDatagrid.refresh()
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
    addBatchRolePeople () {
      let selection = this.$refs.addRolePeopleDatagrid.getAttr('selection')
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
        service: 'P0403108',
        USER_CODES: userIds,
        ROLE_CODE: this.oldRow.ROLE_CODE
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.addRolePeopleVisible = false
          this.$refs.rolePeopleDatagrid.refresh()
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 角色权限设置加载成功回写数据
    loadSuccessPowerSet (data) {
      let powerArr = []
      data.forEach((item, index) => {
        if (item.POWER_FLAG === '1' && item.PAR_POWER !== '0') {
          powerArr.push(item.POWER_ID)
        }
      })
      this.$refs.rolePowerSetTree.setCheckedKeys(powerArr)
    },
    // 查询当前选中角色的权限
    boforeLoadPowerSet (req, callback) {
      req[0].ROLE_CODE = this.oldRow.ROLE_CODE
      callback(req)
    },
    // 点击权限设置
    handlerPermissionSet (row) {
      this.showPowerSetCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$refs.rolePowerSetTree.refresh()
    },
    // 权限复制
    handlerPermissionClone (row) {
      this.showPowerCloneCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$set(this.powerClone, 'formData', {
        TARG_ROLE_CODE: '', // 复制角色模板
        CLONE_WAY: '1' // 复制模式
      })
      this.$nextTick(() => {
        this.$refs.rolePowerCombogrid.loadText()
      })
    },
    // 权限复制排除当前角色
    beforeLoadRoleInfo (req, callback) {
      req[0].CLONE_ROLE_CODE = this.oldRow.ROLE_CODE
      callback(req)
    },
    // 提交权限复制
    submitRolePowerClone () {
      this.$refs.powerCloneForm.submit({ ROLE_CODE: this.oldRow.ROLE_CODE }).then((result) => {
        if (result.code === '0') {
          this.showPowerCloneCard = false
        }
      })
    },
    // 保存角色权限设置数据
    submitRolePowerSet () {
      let select = this.$refs.rolePowerSetTree.getCheckedNodes(false, true)
      console.log(select)
      if (select.length === 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择记录')
        })
        return
      }
      let powerArr = []
      select.forEach((item, index) => {
        powerArr.push(item.POWER_ID)
      })
      select = powerArr.join(',')
      this.$ajaxRequest([{
        service: 'P0403110',
        ROLE_CODE: this.oldRow.ROLE_CODE,
        POWER_ID: select
      }]).then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('保存成功')
          })
          this.showPowerSetCard = false
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
        url: '/njdf_import?FILENAME=' + this.fileName + '&SERVICE=P0404509&IMPORTTYPE=1&encoderType=none&TYPE=' + this.importInfo.formData.TYPE + '&MODULE=ROLE_CODE&ID=' + this.oldRow.ROLE_CODE,
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
        ID: vm.oldRow.ROLE_CODE,
        MODULE: 'ROLE_CODE',
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
            this.addRolePeopleVisible = true
            // this.$refs.addRolePeopleDatagrid.clearSelection()
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
          service: 'P0403206',
          key: 'USER_CODE',
          max: '100',
          query: {
            ROLE_CODE: this.oldRow.ROLE_CODE
          },
          success: (result) => {
            this.$refs.rolePeopleDatagrid.clearSelection()
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
                service: 'P0403206',
                ROLE_CODE: this.oldRow.ROLE_CODE
              }]).then((result) => {
                if (result.code === '0') {
                  this.$message({
                    type: 'success',
                    message: this.$t('清空成功！')
                  })
                  this.$refs.rolePeopleDatagrid.refresh()
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
