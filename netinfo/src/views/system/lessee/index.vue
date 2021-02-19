<template lang="pug">
  njs-datagrid(
    datagrid-id="system_lessee_P0112404"
    ref="datagrid"
    :title="$t('租户管理')"
    :subheading="$t('运营管理员可在此界面维护租户信息。')"
    service="P0112404"
    :default-query="{QUERY_TYPE:'1'}"
    :rules="rules"
    :auto-loading="true"
    :button-list="btnList"
  )
    <!-----------     列配置  start ---------------------------------------------------------- -->
    njs-column(prop="LSE_ID" :label="$t('租户编号')" show-overflow-tooltip sortable min-width="100")
    njs-column(prop="LSE_NAME" :label="$t('租户名称')" show-overflow-tooltip sortable min-width="100")
    njs-column(prop="LSE_TYPE" :label="$t('租户类型')" min-width="100" dict="LSE_TYPE")
    njs-column(prop="LSE_STAT" :label="$t('租户状态')" min-width="100" dict="LSE_STAT" type="state" :state-map="{'0': 'success', '1': 'danger'}")
    njs-column(prop="OPEN_DATE" :label="$t('开户日期')" show-overflow-tooltip min-width="100")
    njs-column(prop="CANCEL_DATE" :label="$t('销户日期')" show-overflow-tooltip min-width="100")
    njs-column(prop="EXP_DATE" :label="$t('有效期')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_NAME" :label="$t('联系人')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_TEL" :label="$t('联系电话')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_EMAIL" :label="$t('联系邮箱')" show-overflow-tooltip min-width="100")
    njs-column(prop="ATTN_ADD" :label="$t('联系地址')" show-overflow-tooltip min-width="140")
    njs-column(prop="LAST_UPDATE_USER" show-overflow-tooltip :label="$t('最后更新人')" min-width="120" sortable)
    njs-column(prop="LAST_UPDATE_TIME"  show-overflow-tooltip sortable :label="$t('最后更新时间')" min-width="160")
    njs-column(:label="$t('操作')" min-width="150" fixed="right")
      template(slot-scope="{row, column}")
        njs-button(type="text" @click.stop="handlercfgItem(row)") {{ $t('配置') }}
        njs-button(type="text" @click.stop="handlerEditItem(row)") {{ $t('修改') }}
        njs-button(type="text" @click.stop="handlerDelItem(row)") {{ $t('删除') }}
    <!-----------     列配置  end ---------------------------------------------------------- -->

    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
    template(slot="more-used-query" slot-scope="{ formData }")
      njs-form-item(prop="LSE_TYPE")
        njs-combobox(v-model="formData.LSE_TYPE" dict="LSE_TYPE" :placeholder="$t('请选择租户类型')" clearable @change="$refs.datagrid.refresh()")
      njs-form-item(prop="LSE_STAT")
        njs-combobox(v-model="formData.LSE_STAT" dict="LSE_STAT" :placeholder="$t('请选择租户状态')" clearable @change="$refs.datagrid.refresh()")
      njs-datagrid-search(v-model="formData" :selectItems="selectItems")
    <!-----------     常用查询条件  end ---------------------------------------------------------- -->

    <!-----------     更多查询条件  start ---------------------------------------------------------- -->
    template(slot="more-query" slot-scope="{ formData }")
      njs-form-item(:label="$t('有效期')" prop="EXP_DATE")
        njs-date-picker(v-model="formData.EXP_DATE" value-format="yyyy-MM-dd" style='width: 100%;')
      njs-row(:gutter="20")
        njs-col(:span='12')
          njs-form-item(:label="$t('开户日期')" prop="OPEN_DATE")
            njs-date-picker(v-model="formData.OPEN_DATE" value-format="yyyy-MM-dd" style='width: 100%;')
        njs-col(:span='12')
          njs-form-item(:label="$t('销户日期')" prop="CANCEL_DATE")
            njs-date-picker(v-model="formData.CANCEL_DATE" value-format="yyyy-MM-dd" style='width: 100%;')
      div(style="border-bottom: 1px dashed rgba(232,232,232,1); margin-bottom:20px;")
      njs-row(:gutter="20")
        njs-col(:span='12')
          njs-form-item(:label="$t('联系电话')" prop="ATTN_TEL")
            njs-input(v-model="formData.ATTN_TEL")
        njs-col(:span='12')
          njs-form-item(:label="$t('联系邮箱')" prop="ATTN_EMAIL")
            njs-input(v-model="formData.ATTN_EMAIL")
      njs-form-item(:label="$t('联系地址')" prop="ATTN_ADD")
        njs-input(v-model="formData.ATTN_ADD")
    <!-----------     更多查询条件  end ---------------------------------------------------------- -->

    <!-- 右侧卡片的插槽 ------------------- start ---- litao -------------------------------------------- -->
    template(slot="fixed-card" slot-scope="{ formData }")
      njs-datagrid-card(:title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
        .form-wrap
          njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules" @before-submit="handleSubmitHandle" v-if="addEditVisible")
            njs-form-item(prop="LSE_NAME" :label="$t('租户名称')")
              njs-input(v-model="addEdit[addEditType].formData.LSE_NAME")
            njs-form-item(prop="LSE_TYPE" :label="$t('租户类型')")
              njs-radio-group(v-model="addEdit[addEditType].formData.LSE_TYPE" dict="LSE_TYPE")
            njs-form-item(prop="LSE_STAT" :label="$t('租户状态')")
              njs-switch(v-model="addEdit[addEditType].formData.LSE_STAT" active-color="#13ce66" active-value="0" inactive-value="1" inactive-color="#ff4949" :active-text="$t('正常')" :inactive-text="$t('停用')")
            njs-form-item(prop="OPEN_DATE" :label="$t('开户日期')")
              njs-date-picker(v-model="addEdit[addEditType].formData.OPEN_DATE" value-format="yyyy-MM-dd" style='width: 100%;' @change="$refs.addEditForm.validateField('EXP_DATE')")
            njs-form-item(prop="EXP_DATE" :label="$t('有效期')")
              njs-date-picker(v-model="addEdit[addEditType].formData.EXP_DATE" value-format="yyyy-MM-dd" style='width: 100%;' @change="$refs.addEditForm.validateField('CANCEL_DATE')")
            njs-form-item(prop="CANCEL_DATE" :label="$t('销户日期')")
              njs-date-picker(v-model="addEdit[addEditType].formData.CANCEL_DATE" value-format="yyyy-MM-dd" style='width: 100%;')
            njs-form-item(prop="ATTN_NAME" :label="$t('联系人')")
              njs-input(v-model="addEdit[addEditType].formData.ATTN_NAME" :clearable="false")
            njs-form-item(prop="ATTN_TEL" :label="$t('联系电话')")
              njs-input(v-model="addEdit[addEditType].formData.ATTN_TEL")
            njs-form-item(prop="ATTN_EMAIL" :label="$t('联系邮箱')")
              njs-input(v-model="addEdit[addEditType].formData.ATTN_EMAIL")
            njs-form-item(prop="ATTN_ADD" :label="$t('联系地址')")
              njs-input(v-model="addEdit[addEditType].formData.ATTN_ADD")
        njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{ $t('确定') }}

    <!-- 右侧卡片的插槽 ------------------- end ---- litao -------------------------------------------- -->
</template>

<script>
import { validateTelephone, validateEmail } from '@/validator/common'
// const LSE_ID_RULE = [
//   { validator: validateEnNumUdl, trigger: 'change' },
//   { max: 32, message: '长度不能超过 32', trigger: 'change' }
// ]
export default {
  name: 'system.lessee', // 页面级别组件一定要用路由名称命名！！！
  data () {
    const LSE_NAME_RULE = [
      { max: 40, message: this.$t('长度不能超过 40'), trigger: 'change' }
    ]
    return {
      rules: {
        QUERY_TEXT: LSE_NAME_RULE
      },
      addEditRules: { // 新增/修改的校验规则
        LSE_NAME: [
          { required: true, message: this.$t('请输入租户名称'), trigger: ['blur', 'change'] },
          ...LSE_NAME_RULE
        ],
        LSE_TYPE: { required: true, message: this.$t('请选择租户类型'), trigger: 'change' },
        OPEN_DATE: [
          { required: true, message: this.$t('请选择开户日期'), trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value) {
                this.addEdit[this.addEditType].formData.EXP_DATE && this.$refs.addEditForm.validateField('EXP_DATE')
                this.addEdit[this.addEditType].formData.CANCEL_DATE && this.$refs.addEditForm.validateField('CANCEL_DATE')
              }
              callback()
            },
            trigger: 'change'
          }
        ],
        EXP_DATE: [
          { required: true, message: this.$t('请选择开户日期'), trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value && this.addEdit[this.addEditType].formData.OPEN_DATE) {
                this.addEdit[this.addEditType].formData.CANCEL_DATE && this.$refs.addEditForm.validateField('CANCEL_DATE')
                if (parseInt(value.split('-').join('')) >= parseInt(this.addEdit[this.addEditType].formData.OPEN_DATE.split('-').join(''))) {
                  callback()
                } else {
                  callback(new Error(this.$t('有效期必须在开户日期之后')))
                }
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        CANCEL_DATE: [
          { required: true, message: this.$t('请选择开户日期'), trigger: ['blur', 'change'] },
          {
            validator: (rule, value, callback) => {
              if (value && this.addEdit[this.addEditType].formData.EXP_DATE) {
                if (parseInt(value.split('-').join('')) >= parseInt(this.addEdit[this.addEditType].formData.EXP_DATE.split('-').join(''))) {
                  callback()
                } else {
                  callback(new Error(this.$t('销户日期必须在有效期之后')))
                }
              } else {
                callback()
              }
            },
            trigger: 'change'
          }
        ],
        ATTN_NAME: { required: true, message: this.$t('请输入联系人'), trigger: ['blur', 'change'] },
        ATTN_TEL: [
          { required: true, message: this.$t('请录入联系电话'), trigger: ['blur', 'change'] },
          { validator: validateTelephone, trigger: 'change' }
        ],
        ATTN_EMAIL: [
          { validator: validateEmail, trigger: 'change' }
        ],
        ATTN_ADD: { max: 200, message: this.$t('地址长度不能超过 200'), trigger: ['blur', 'change'] }
      },
      btnList: [
        {
          text: this.$t('新增租户'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              LSE_NAME: '', // 租户名称
              LSE_TYPE: '', // 租户类型
              LSE_STAT: '1', // 租户状态
              OPEN_DATE: '', // 开户日期
              EXP_DATE: '', // 有效期
              CANCEL_DATE: '', // 销户日期
              ATTN_NAME: '', // 联系人
              ATTN_TEL: '', // ATTN_TEL
              ATTN_EMAIL: '', // 联系邮箱
              ATTN_ADD: '' // 联系地址
            }
          }
        }
      ],
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEdit: {
        add: {
          formData: {
            LSE_NAME: '', // 租户名称
            LSE_TYPE: '', // 租户类型
            LSE_STAT: '', // 租户状态
            OPEN_DATE: '', // 开户日期
            EXP_DATE: '', // 有效期
            CANCEL_DATE: '', // 销户日期
            ATTN_NAME: '', // 联系人
            ATTN_TEL: '', // ATTN_TEL
            ATTN_EMAIL: '', // 联系邮箱
            ATTN_ADD: '' // 联系地址
          },
          title: this.$t('新增租户'),
          service: 'P0112101' // 接口号
        },
        edit: {
          formData: {
            LSE_NAME: '', // 租户名称
            LSE_TYPE: '', // 租户类型
            LSE_STAT: '', // 租户状态
            OPEN_DATE: '', // 开户日期
            EXP_DATE: '0', // 有效期
            CANCEL_DATE: '', // 销户日期
            ATTN_NAME: '', // 联系人
            ATTN_TEL: '1', // 联系电话
            ATTN_EMAIL: '', // 联系邮箱
            ATTN_ADD: '' // 联系地址
          },
          title: this.$t('修改租户'),
          service: 'P0112302' // 接口号
        }
      },
      editLseId: '', // 记录当前正在修改的租户id
      selectItems: [
        { label: this.$t('全部'), value: '1', placeholder: this.$t('请输入租户名称或租户联系人') },
        { label: this.$t('租户名称'), value: '3', placeholder: this.$t('请输入租户名称') },
        { label: this.$t('租户联系人'), value: '2', placeholder: this.$t('请输入租户联系人') }
      ]
    }
  },
  methods: {
    // 修改租户
    handlerEditItem (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.editLseId = row.LSE_ID
      this.addEdit.edit.formData = {
        LSE_NAME: row.LSE_NAME, // 租户名称
        LSE_TYPE: row.LSE_TYPE, // 租户类型
        LSE_STAT: row.LSE_STAT, // 租户状态
        OPEN_DATE: row.OPEN_DATE, // 开户日期
        EXP_DATE: row.EXP_DATE, // 有效期
        CANCEL_DATE: row.CANCEL_DATE, // 销户日期
        ATTN_NAME: row.ATTN_NAME, // 联系人
        ATTN_TEL: row.ATTN_TEL, // ATTN_TEL
        ATTN_EMAIL: row.ATTN_EMAIL, // 联系邮箱
        ATTN_ADD: row.ATTN_ADD // 联系地址
      }
    },
    // 删除租户
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要租户') + row.LSE_NAME + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0112203',
          DEL_LSE_ID: row.LSE_ID
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除租户') + row.LSE_NAME + this.$t('成功。')
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
    // 配置租户
    handlercfgItem (row) {
      this.$alert(window.app.$t('待开发'))
    },
    // 提交新增或修改
    submitAddEdit () {
      this.$refs.addEditForm.submit().then((result) => {
        if (result.code === '0') {
          if (this.addEditType === 'add') {
            this.$message({
              type: 'success',
              message: this.$t('新增租户') + this.addEdit.add.formData.LSE_NAME + this.$t('成功。')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改租户') + this.addEdit.edit.formData.LSE_NAME + this.$t('成功。')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    handleSubmitHandle (req, callback) {
      req[0].UP_LSE_ID = this.editLseId
      callback(req)
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
