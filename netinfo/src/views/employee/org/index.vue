<template lang="pug">
  .container-wrap-aside
    .box-body
      .menu
        .menu-title {{ $t('组织机构管理') }}
        .menu-con
          njs-tree(:data='data' node-key='ORG_ID' ref="tree" default-expand-all :expand-on-click-node='false' check-on-click-node highlight-current @current-change="handleCurrentChange")
            span.custom-tree-node(slot-scope='{ node, data }' v-if="data.showState === 'show'" @mouseenter="mouseIn = data.ORG_ID" @mouseleave="mouseIn = ''")
              span {{ data.ORG_NAME }}
              span(v-show="mouseIn === data.ORG_ID")
                njs-button(type='text', icon='el-icon-plus', @click.stop='append(node, data)')
                njs-button(type='text', icon="el-icon-edit"  @click="data.showState = 'edit'" v-if="data.ORG_ID !== '0'")
                njs-button(type='text', icon="el-icon-delete"  @click='delNode(node, data)' v-if="data.ORG_ID !== '0'")
            span.custom-tree-node(slot-scope='{ node, data }' v-else)
              njs-form(:model="data" :ref="`form${data.ORG_ID}`" :rules="addEditRules" :style="{flex:1, marginRight: '4px'}" size="mini" @submit.native.prevent @click.stop)
                njs-form-item(prop="editName" :style="{marginBottom: '0'}")
                  njs-input(v-model="data.editName" :ref="`input${data.ORG_ID}`" @keydown.native.13="doEdit(node, data)")
              njs-button(type="text" icon="el-icon-check" @click="doEdit(node, data)")
              njs-button(type="text" icon="el-icon-close" @click="cancelEdit(node, data)")
      .form-wrap
        .form-title(v-html="formTitle")
        .form(style='width:80%')
          njs-form(:model="formData" ref="addEditForm" :service="currentNodeData.showState==='add' ? 'P0401101' : 'P0401302'" :rules="addEditRules" @before-submit="handleSubmitHandle" @submit-success="handleSuccessHandle" size="default" v-if="formShow" :disabled="!currentNodeData.ORG_ID || currentNodeData.ORG_ID === '0'" )
            njs-row(:gutter="40")
              njs-col(:span="12")
                njs-form-item(prop="ORG_CODE" :label="$t('机构代码')")
                  njs-input(v-model="formData.ORG_CODE" clearable)
              njs-col(:span="12")
                njs-form-item(prop="ORG_STAT" :label="$t('机构状态')")
                  njs-combobox(v-model="formData.ORG_STAT" dict="ORG_STAT" clearable )
            njs-row(:gutter="40")
              njs-col(:span="12")
                njs-form-item(prop="ORG_TYPE" :label="$t('机构类型')")
                  njs-combobox(v-model="formData.ORG_TYPE" dict="ORG_TYPE" clearable)
              njs-col(:span="12")
                njs-form-item(prop="ORG_CON" :label="$t('联系人')")
                  njs-input(v-model="formData.ORG_CON" clearable)
            njs-row(:gutter="40")
              njs-col(:span="12")
                njs-form-item(prop="ORG_TEL" :label="$t('联系电话')")
                  njs-input(v-model="formData.ORG_TEL" )
              njs-col(:span="12")
                njs-form-item(prop="EMAIL" :label="$t('电子邮箱')")
                  njs-input(v-model="formData.EMAIL" clearable )
            njs-row(:gutter="40")
              njs-col(:span="12")
                njs-form-item(prop="ORG_FAX" :label="$t('传真号码')")
                  njs-input(v-model="formData.ORG_FAX" clearable)
              njs-col(:span="12")
                njs-form-item(prop="ORG_ADDR" :label="$t('联系地址')")
                  njs-input(v-model="formData.ORG_ADDR" clearable )
            njs-row(:gutter="40")
              njs-col(:span="12")
                njs-form-item(prop="ZIP_CODE" :label="$t('邮政编码')")
                  njs-input(v-model="formData.ZIP_CODE" clearable)
              njs-col(:span="12")
                njs-form-item(prop="ORG_CITY_ZIP" :label="$t('所在城市编码')")
                  njs-combogrid(datagrid-id="employee_org_P0401405"
                    v-model="formData.ORG_CITY_ZIP"
                    ref="cityZipCombogrid"
                    service="P0401405"
                    hide-head
                    single-select
                    data-value="REGION_ID"
                    data-label="REGION_ID")
                    <!-----------     列配置  start ---------------------------------------------------------- -->
                    njs-column(prop="REGION_ID" :label="$t('地区编号')" sortable min-width="10")
                    njs-column(prop="REGION_CODE" :label="$t('地区代码')" show-overflow-tooltip sortable min-width="20")
                    njs-column(prop="REGION_NAME" :label="$t('地区名称')" min-width="20" show-overflow-tooltip)
                    njs-column(prop="ZONE_CODE" :label="$t('地区区号')" min-width="20" show-overflow-tooltip)
                    <!-----------     列配置  end ---------------------------------------------------------- -->

                    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
                    template(slot="more-used-query" slot-scope="{ formData }")
                      njs-form-item(prop="REGION_CODE")
                        njs-input(v-model="formData.REGION_CODE" :placeholder="$t('请输入地区代码')" clearable @keydown.13.native="$refs.cityZipCombogrid.refresh()")
                      njs-form-item(prop="SERVICE_NAME")
                        njs-input(v-model="formData.REGION_NAME" :placeholder="$t('请输入地区名称')" clearable @keydown.native.13="$refs.cityZipCombogrid.refresh()")
                      njs-form-item
                        njs-button(@click="$refs.cityZipCombogrid.refresh()" type="primary") {{ $t('查询') }}
            njs-row(:gutter="20")
              njs-col(:span="24")
                njs-form-item(prop="REMARK" :label="$t('备注')")
                  njs-input(v-model="formData.REMARK" clearable)
</template>

<script>
import { listTransTree } from '@/utils/utils'
import { validateEmail, validateTelephone } from '@/validator/common'

const RMAIL_RULE = [
  { validator: validateEmail, trigger: 'change' },
  { max: 32, message: window.app.$t('邮箱长度不能超过 64'), trigger: 'change' }
]
const TEL_RULE = [
  { validator: validateTelephone, trigger: 'change' },
  { max: 32, message: window.app.$t('邮箱长度不能超过 64'), trigger: 'change' }
]
const search = (tree, target) => {
  if (tree.ORG_ID === target) {
    return tree
  }
  for (const children of tree.children || []) {
    const res = search(children, target)
    if (res) {
      return res
    }
  }
}
export default {
  name: 'employee.org', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      data: [{
        ORG_ID: '0',
        ORG_NAME: this.$t('全部机构'),
        showState: 'show',
        ORG_STAT: '',
        children: []
      }],
      formData: { // 新增修改表单数据
        ORG_CODE: '',
        ORG_TYPE: '',
        ORG_NAME: '',
        ORG_STAT: '',
        ORG_ADDR: '',
        ORG_CON: '',
        ORG_TEL: '',
        ORG_FAX: '',
        ZIP_CODE: '',
        EMAIL: '',
        ORG_CITY_ZIP: '',
        REMARK: ''
      },
      formShow: true, // 用于重新渲染表单
      addEdit: 'edit', // 新增修改标识
      addEditRules: { // 新增修改表单校验规则
        ORG_CODE: [
          { required: true, message: this.$t('请输入机构代码'), trigger: ['blur', 'change'] },
          { max: 64, message: this.$t('机构代码长度不能超过 64'), trigger: 'change' }
        ],
        ORG_NAME: [
          { required: true, message: this.$t('请输入机构名称'), trigger: ['blur', 'change'] },
          { max: 64, message: this.$t('机构代码长度不能超过 64'), trigger: 'change' }
        ],
        editName: [
          { required: true, message: this.$t('请输入机构名称'), trigger: ['blur', 'change'] },
          { max: 64, message: this.$t('机构代码长度不能超过 64'), trigger: 'change' }
        ],
        ORG_TYPE: [
          { required: true, message: this.$t('请选择机构类型'), trigger: ['blur', 'change'] }
        ],
        ORG_STAT: [
          { required: true, message: this.$t('请选择机构状态'), trigger: ['blur', 'change'] }
        ],
        EMAIL: { RMAIL_RULE },
        ORG_CON: [
          { max: 64, message: this.$t('联系人长度不能超过 64'), trigger: 'change' }
        ],
        ORG_TEL: { TEL_RULE },
        ORG_FAX: [
          { max: 64, message: this.$t('传真号码长度不能超过 32'), trigger: 'change' }
        ],
        ZIP_CODE: [
          { max: 64, message: this.$t('邮政编码长度不能超过 16'), trigger: 'change' }
        ],
        REMARK: [
          { max: 64, message: this.$t('备注长度不能超过 256'), trigger: 'change' }
        ]
      },
      currentNodeData: {}, // 当前选中节点的数据
      mouseIn: '' // 记录当前鼠标指针在哪个几点里
    }
  },

  methods: {
    append (node, data) {
      console.log('node', node)
      console.log('data', data)
      const newChild = {
        ORG_ID: 'timeStamp' + new Date().getTime(),
        showState: 'add', // 标记当前新增的这条数据处于"正在新增"状态
        ORG_CODE: '',
        ORG_TYPE: '',
        ORG_NAME: '',
        ORG_STAT: '',
        ORG_ADDR: '',
        ORG_CON: '',
        ORG_TEL: '',
        ORG_FAX: '',
        ZIP_CODE: '',
        EMAIL: '',
        ORG_CITY_ZIP: '',
        REMARK: '',
        PAR_ORG: data.ORG_ID,
        children: []
      }
      if (data.children) {
        data.children.push(newChild)
      } else {
        this.$set(data, 'children', [newChild])
      }
      this.$nextTick(() => {
        this.$refs.tree.setCurrentKey(newChild.ORG_ID)
        this.handleCurrentChange(newChild)
        this.$refs[`input${newChild.ORG_ID}`].focus()
      })
    },
    // 删除前端节点（没调接口）
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.ORG_ID === data.ORG_ID)
      children.splice(index, 1)
    },
    // 取消编辑
    cancelEdit (node, data) {
      if (data.showState === 'edit') {
        data.editName = data.ORG_NAME // 编辑状态下的菜单名称恢复
        data.showState = 'show'
      } else if (data.showState === 'add') {
        this.$confirm(this.$t('你确定要放弃本次新增吗？'), this.$t('提示'), {
          type: 'warning'
        }).then(() => {
          this.remove(node, data)
          this.currentNodeData = {}
          this.formShow = false
          this.$nextTick(() => {
            this.formShow = true
          })
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    // 确定修改名称
    doEdit (node, data) {
      if (data.showState === 'add') { // 新增
        this.$refs.addEditForm.validate((result) => {
          if (result) {
            this.$refs.addEditForm.submit()
          } else {
            this.$message.error(this.$t('请先完善组织机构信息'))
          }
        })
      } else {
        this.$ajaxRequest([{
          ...data,
          service: 'P0401302',
          ORG_NAME: data.editName
        }]).then((reult) => {
          if (reult.code === '0') {
            data.showState = 'show'
            data.ORG_NAME = data.editName
            // let addNodeData = search(this.data[0], this.currentNodeData.ORG_ID)
            // this.currentNodeData = { ...this.currentNodeData, ...this.formData }
            // for (let attr in this.currentNodeData) {
            //   this.$set(addNodeData, attr, this.currentNodeData[attr])
            // }
            this.$message({
              type: 'success',
              message: this.$t('修改组织机构名称成功')
            })
          }
        })
      }
    },
    // 表单提交之前事件
    handleSubmitHandle (req, back) {
      if (this.currentNodeData.showState === 'add') { // 新增
        this.$refs[`form${this.currentNodeData.ORG_ID}`].validate((result) => {
          if (result) {
            this.formData.ORG_NAME = this.currentNodeData.editName
            req[0].ORG_NAME = this.currentNodeData.editName
            back(req)
          } else {
            if (this.currentNodeData.editName) {
              this.$message.error(this.$t('组织机构名称长度不能超过 64！'))
            } else {
              this.$message.error(this.$t('请输入组织机构名称！'))
            }
            back(false)
          }
        })
      } else { // 修改
        this.formData.ORG_NAME = this.currentNodeData.ORG_NAME
        req[0].ORG_NAME = this.currentNodeData.ORG_NAME
        req[0].ORG_ID = this.currentNodeData.ORG_ID
        back(req)
        // this.$refs[`form${this.currentNodeData.MENU_ID}`].validate((result) => {
        //   if (result) {
        //     req[0].MENU_NAME = this.currentNodeData.editName
        //     req[0].MENU_ID = this.currentNodeData.MENU_ID
        //     callback(req)
        //   } else {
        //     if (this.currentNodeData.editName) {
        //       this.$message.error('菜单名称长度不能超过 64！')
        //     } else {
        //       this.$message.error('请输入菜单名称！')
        //     }
        //     callback(false)
        //   }
        // })
      }
    },
    // 表单提交成功
    handleSuccessHandle (result) {
      let message
      if (this.currentNodeData.showState === 'add') {
        message = this.$t('新增组织机构成功')
        this.currentNodeData.showState = 'show'
        let addNodeData = search(this.data[0], this.currentNodeData.ORG_ID)
        this.currentNodeData.ORG_ID = result.data[0].ORG_ID // 新增得到的节点 ID
        this.currentNodeData = { ...this.currentNodeData, ...this.formData }
        for (let attr in this.currentNodeData) {
          this.$set(addNodeData, attr, this.currentNodeData[attr])
        }
      } else {
        message = this.$t('修改组织机构内容成功')
        let addNodeData = search(this.data[0], this.currentNodeData.ORG_ID)
        this.currentNodeData = { ...this.currentNodeData, ...this.formData }
        for (let attr in this.currentNodeData) {
          this.$set(addNodeData, attr, this.currentNodeData[attr])
        }
      }
      this.handleCurrentChange(this.currentNodeData, true)
      this.$message({
        type: 'success',
        message
      })
    },
    // 当前选中节点发生变化时
    handleCurrentChange (data, isEdit) {
      if (data.ORG_ID === this.currentNodeData.ORG_ID && isEdit !== true) {
        return
      }
      this.currentNodeData = data
      this.formData = {
        ORG_CODE: data.ORG_CODE,
        ORG_TYPE: data.ORG_TYPE,
        ORG_NAME: data.ORG_NAME,
        ORG_STAT: data.ORG_STAT,
        ORG_ADDR: data.ORG_ADDR,
        ORG_CON: data.ORG_CON,
        ORG_TEL: data.ORG_TEL,
        ORG_FAX: data.ORG_FAX,
        ZIP_CODE: data.ZIP_CODE,
        EMAIL: data.EMAIL,
        ORG_CITY_ZIP: data.ORG_CITY_ZIP,
        REMARK: data.REMARK,
        PAR_ORG: data.PAR_ORG
      }
      this.formShow = false
      this.$nextTick(() => {
        this.formShow = true
      })
    },
    // 删除节点
    delNode (node, data) {
      this.$confirm(this.$t('你确定要删除') + data.ORG_NAME + this.$t('机构及其所有子机构吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          ORG_ID: data.ORG_ID,
          service: 'P0401203'
        }]).then((result) => {
          if (result.code === '0') {
            this.remove(node, data)
            this.currentNodeData = {}
            this.formShow = false
            this.$nextTick(() => {
              this.formShow = true
            })
            this.$message({
              type: 'success',
              message: this.$t('删除') + data.ORG_NAME + this.$t('机构及其所有子机构成功')
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消删除')
        })
      })
    }
  },
  created () {
    this.$ajaxRequest([{
      service: 'P0401404'
    }]).then((result) => {
      if (result.code === '0') {
        result.data.forEach((item) => {
          item.showState = 'show' // 规定该节点的展示状态。 show：展示， add：新增，edit：修改
          item.editName = item.ORG_NAME // 编辑状态下的机构名称
        })
        this.$set(this.data[0], 'children', listTransTree(result.data, 'ORG_ID', 'PAR_ORG'))
      }
    })
  },
  computed: {
    formTitle () {
      if (this.currentNodeData.ORG_ID) {
        if (this.currentNodeData.ORG_ID === '0') {
          return "<span style='color: #ff4949'>" + this.$t('根机构不可编辑') + '</span>'
        }
        return this.currentNodeData.editName || ("<span style='color: #ff4949'>" + this.$t('未输入机构名称') + '</span>')
      } else {
        return "<span style='color: #ff4949'>" + this.$t('未选中机构') + '</span>'
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
