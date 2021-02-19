<template lang="pug">
  njs-datagrid(
    datagrid-id="system_service_P0105404"
    ref="datagrid"
    :title="$t('系统服务管理')"
    :subheading="$t('用来配置系统服务')"
    service="P0105404"
    :rules="rules"
    :auto-loading="true"
    :button-list="btnList"
  )
    <!-----------     列配置  start ---------------------------------------------------------- -->
    njs-column(prop="SERVICE_CODE" :label="$t('服务代码')" sortable min-width="100")
    njs-column(prop="SERVICE_NAME" :label="$t('服务名称')" show-overflow-tooltip sortable min-width="100")
    njs-column(prop="SERVICE_TYPE" :label="$t('服务类型')" min-width="100" dict="SYS_SERVICE_TYPE")
    njs-column(prop="ENABLE_SOAP" :label="$t('接口支持')" min-width="100" dict="ENABLE_SOAP" )
    njs-column(prop="REC_FLAG" :label="$t('记录日志')" min-width="100" dict="REC_FLAG")
    njs-column(prop="ACCESS_CONTROL" :label="$t('权限控制')" min-width="100" dict="ACCESS_CONTROL")
    njs-column(prop="LAST_UPDATE_USER" :label="$t('最后更新人')" min-width="120")
    njs-column(prop="LAST_UPDATE_TIME" :label="$t('最后更新时间')" min-width="120")
    njs-column(:label="$t('操作')" min-width="150" fixed="right")
      template(slot-scope="{row}")
        njs-button(type="text" @click.stop="handlerEditItem(row)") {{ $t('修改') }}
        njs-button(type="text" @click.stop="handlerDelItem(row)") {{ $t('删除') }}
    <!-----------     列配置  end ---------------------------------------------------------- -->

    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
    template(slot="more-used-query" slot-scope="{ formData }")
      njs-form-item(prop="SERVICE_CODE")
        njs-input(v-model="formData.SERVICE_CODE" :placeholder="$t('请输入服务代码')" clearable @keydown.13.native="$refs.datagrid.refresh()" @clear="$refs.datagrid.refresh()")
      njs-form-item(prop="SERVICE_NAME")
        njs-input(v-model="formData.SERVICE_NAME" :placeholder="$t('请输入服务名称')" clearable @keydown.native.13="$refs.datagrid.refresh()" @clear="$refs.datagrid.refresh()")
      njs-form-item
        njs-button(@click="$refs.datagrid.refresh()" type="primary") {{ $t('查询') }}
    <!-----------     常用查询条件  start ---------------------------------------------------------- -->

    <!-- 右侧卡片的插槽 ------------------- start ---- lengxuejian -------------------------------------------- -->
    template(slot="fixed-card" slot-scope="{ formData }")
      njs-datagrid-card(:width="500" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
        .form-wrap
          njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules" )
            njs-form-item(prop="SERVICE_CODE" :label="$t('服务代码')")
              nbs-select-interface(v-model="addEdit[addEditType].formData.SERVICE_CODE" ref="serviceCombogrid" :disabled="addEditType === 'edit'")
            njs-form-item(prop="SERVICE_NAME" :label="$t('服务名称')" :placeholder="$t('请输入服务名称')")
              njs-input(v-model="addEdit[addEditType].formData.SERVICE_NAME")
            njs-form-item(prop="SERVICE_TYPE" :label="$t('服务类型')")
              njs-radio-group(v-model="addEdit[addEditType].formData.SERVICE_TYPE" dict="SYS_SERVICE_TYPE")
            njs-form-item(prop="ENABLE_SOAP" :label="$t('接口支持')")
              njs-switch(v-model="addEdit[addEditType].formData.ENABLE_SOAP" active-color="#13ce66" active-value="2" inactive-value="1" inactive-color="#ff4949" :active-text="$t('支持')" :inactive-text="$t('不支持')")
            njs-form-item(prop="REC_FLAG" :label="$t('记录日志')")
              njs-switch(v-model="addEdit[addEditType].formData.REC_FLAG" active-color="#13ce66" active-value="1" inactive-value="2" inactive-color="#ff4949" :active-text="$t('是')" :inactive-text="$t('否')")
            njs-form-item(prop="ACCESS_CONTROL" :label="$t('权限控制')")
              njs-switch(v-model="addEdit[addEditType].formData.ACCESS_CONTROL" active-color="#13ce66" active-value="1" inactive-value="2" inactive-color="#ff4949" :active-text="$t('是')" :inactive-text="$t('否')")
        njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{ $t('确定') }}

    <!-- 右侧卡片的插槽 ------------------- end ---- litao -------------------------------------------- -->

</template>

<script>
import { validateEnNumUdl } from '@/validator/common'
import NbsSelectInterface from '../../../plugins/nbs/components/select-interface'
const SERVICE_CODE_RULE = [
  { validator: validateEnNumUdl, trigger: 'change' },
  { max: 32, message: window.app.$t('长度不能超过 32'), trigger: 'change' }
]
const SERVICE_NAME_RULE = [
  { max: 64, message: window.app.$t('长度不能超过 64'), trigger: 'change' }
]
export default {
  name: 'system.service', // 页面级别组件一定要用路由名称命名！！！
  components: { NbsSelectInterface },
  data () {
    return {
      rules: {
        SERVICE_CODE: SERVICE_CODE_RULE,
        SERVICE_NAME: SERVICE_NAME_RULE
      },
      addEditRules: { // 新增/修改的校验规则
        SERVICE_CODE: { required: true, message: this.$t('请选择一个系统接口'), trigger: ['blur', 'change'] },
        SERVICE_NAME: { required: true, message: this.$t('请输入服务名称'), trigger: ['blur', 'change'] }
      },
      btnList: [
        {
          text: this.$t('新增系统服务'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              SERVICE_CODE: '', // 服务代码
              SERVICE_NAME: '', // 服务名称
              SERVICE_TYPE: '1', // 服务类型
              ENABLE_SOAP: '1', // 接口支持
              REC_FLAG: '2', // 记录日志
              ACCESS_CONTROL: '2' // 权限控制
            }
            this.$refs.serviceCombogrid.loadText()
            this.$nextTick(() => {
              this.$refs.addEditForm.clearValidate()
              this.addEdit[this.addEditType].formData.SERVICE_CODE = ''
            })
          }
        }
      ],
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEdit: {
        add: {
          formData: {
            SERVICE_CODE: '', // 服务代码
            SERVICE_NAME: '', // 服务名称
            SERVICE_TYPE: '', // 服务类型
            ENABLE_SOAP: '', // 接口支持
            REC_FLAG: '', // 记录日志
            ACCESS_CONTROL: '' // 权限控制
          },
          title: this.$t('新增系统服务'),
          service: 'P0105101' // 接口号
        },
        edit: {
          formData: {
            SERVICE_CODE: '', // 服务代码
            SERVICE_NAME: '', // 服务名称
            SERVICE_TYPE: '', // 服务类型
            ENABLE_SOAP: '', // 接口支持
            REC_FLAG: '', // 记录日志
            ACCESS_CONTROL: '' // 权限控制
          },
          title: this.$t('修改系统服务'),
          service: 'P0105302' // 接口号
        }
      }
    }
  },
  methods: {
    // 提交新增或修改
    submitAddEdit () {
      this.$refs.addEditForm.submit().then((result) => {
        if (result.code === '0') {
          if (this.addEditType === 'add') {
            this.$message({
              type: 'success',
              message: this.$t('新增系统服务') + this.addEdit.add.formData.SERVICE_CODE + this.$t('成功')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改系统服务') + this.addEdit.edit.formData.SERVICE_CODE + this.$t('成功')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 修改系统服务
    handlerEditItem (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.addEdit.edit.formData = {
        SERVICE_CODE: row.SERVICE_CODE,
        SERVICE_NAME: row.SERVICE_NAME, // 服务名称
        SERVICE_TYPE: row.SERVICE_TYPE, // 服务类型
        ENABLE_SOAP: row.ENABLE_SOAP, // 接口支持
        REC_FLAG: row.REC_FLAG, // 记录日志
        ACCESS_CONTROL: row.ACCESS_CONTROL // 权限控制
      }
      this.$nextTick(() => {
        this.$refs.serviceCombogrid.loadText()
        this.$refs.addEditForm.clearValidate()
      })
    },
    // 删除系统服务
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要删除系统服务') + row.SERVICE_CODE + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0105203',
          SERVICE_CODE: row.SERVICE_CODE
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除系统服务') + row.SERVICE_CODE + this.$t('成功')
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
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
