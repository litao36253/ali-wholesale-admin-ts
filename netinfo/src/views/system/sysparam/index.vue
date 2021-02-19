<template lang="pug">
  .wrap
      njs-datagrid(
        datagrid-id="system_param_P0103401"
        ref="datagrid"
        :title="$t('系统参数管理')"
        :subheading="$t('用于开发人员及运维人员维护系统参数。')"
        service="P0103401"
        :default-query="{QUERY_TYPE:'1'}"
        :rules="rules"
        :auto-loading="true"
        :button-list="btnList"
      )
        <!-----------     常用查询条件  start ---------------------------------------------------------- -->
        template(slot="more-used-query" slot-scope="{ formData }")
          njs-form-item(prop="PARAM_TYPE")
            njs-combobox(v-model="formData.PARAM_TYPE" dict="PARAM_TYPE" :placeholder="$t('请选择参数类型')" clearable @change="$refs.datagrid.refresh()")
          njs-form-item(prop="IS_OPEN_USER")
            njs-combobox(v-model="formData.IS_OPEN_USER" dict="WHETHER" :placeholder="$t('请选择是否开放用户' )" clearable @change="$refs.datagrid.refresh()")
          njs-form-item(prop="LSE_ID")
            nbs-select-lessee(v-model="formData.LSE_ID" :placeholder="$t('请选择用户' )" clearable @change="$refs.datagrid.refresh()")
          njs-datagrid-search(v-model="formData" :selectItems="selectItems" @select-change="queryTypeChange")
        <!-----------     常用查询条件  end ---------------------------------------------------------- -->

        <!-----------     列配置  start ---------------------------------------------------------- -->
        njs-column(prop="PARAM_CODE" :label="$t('参数代码')" show-overflow-tooltip sortable min-width="250")
        njs-column(prop="PARAM_NAME" :label="$t('参数名称')" show-overflow-tooltip sortable min-width="150")
        njs-column(prop="PARAM_TYPE" :label="$t('参数类型')" sortable dict="PARAM_TYPE" min-width="80")
        njs-column(prop="PARAM_VAL" :label="$t('参数值')" min-width="70")
        njs-column(prop="MAINTAIN_FLAG" :label="$t('维护标识')" sortable min-width="100" dict="MAINTAIN_FLAG" type="state" :state-map="{'0': 'success', '1': 'danger', '2': 'warning', '3': 'info'}")
        njs-column(prop="IS_OPEN_USER" :label="$t('是否开放用户')" sortable min-width="120" dict="WHETHER")
        njs-column(prop="LSE_ID" :label="$t('租户编号')" sortable min-width="100")
        njs-column(prop="DICT_CODE" :label="$t('字典代码')" min-width="100" show-overflow-tooltip)
        njs-column(prop="ASS_TYPE" :label="$t('组件类型')" sortable min-width="100" dict="ASS_TYPE" show-overflow-tooltip)
        njs-column(prop="PARAM_DESC" :label="$t('参数说明')" min-width="200" show-overflow-tooltip)
        njs-column(prop="LAST_UPDATE_USER" sortable :label="$t('最后更新人')" min-width="100" show-overflow-tooltip)
        njs-column(prop="LAST_UPDATE_TIME" sortable :label="$t('最后更新时间')" min-width="160" show-overflow-tooltip)
        njs-column(:label="$t('操作')" min-width="100" fixed="right")
          template(slot-scope="{ row, column, $index }")
            njs-button(type="text" :disabled="row.MAINTAIN_FLAG==='2' || row.MAINTAIN_FLAG==='3'" @click.stop="handlerEdit(row)") {{ $t('修改') }}
            njs-button(type="text" :disabled="row.MAINTAIN_FLAG==='1' || row.MAINTAIN_FLAG==='3'" @click.stop="handlerDel(row)") {{ $t('删除') }}
        <!-----------     列配置  end ---------------------------------------------------------- -->

        <!-- 右侧卡片的插槽 ------------------- start ---- litao -------------------------------------------- -->
        template(slot="fixed-card" slot-scope="{ formData }")
          njs-datagrid-card(:width="580" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
            .form-wrap
              njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules" )
                njs-form-item(prop="LSE_ID" :label="$t('参数可用租户')")
                  nbs-select-lessee(v-model="addEdit[addEditType].formData.LSE_ID" :disabled="addEditType === 'edit'" @clear="addEdit[addEditType].formData.IS_OPEN_USER = '0'")
                njs-form-item(prop="PARAM_CODE" :label="$t('参数代码')")
                  njs-input(v-model="addEdit[addEditType].formData.PARAM_CODE" :disabled="addEditType === 'edit'")
                njs-form-item(prop="PARAM_NAME" :label="$t('参数名称')")
                  njs-input(v-model="addEdit[addEditType].formData.PARAM_NAME")
                njs-form-item(prop="PARAM_TYPE" :label="$t('参数类型')")
                  njs-combobox(v-model="addEdit[addEditType].formData.PARAM_TYPE" dict="PARAM_TYPE" :clearable="false")
                njs-form-item(prop="MAINTAIN_FLAG" :label="$t('维护标识')")
                  njs-radio-group(v-model="addEdit[addEditType].formData.MAINTAIN_FLAG" dict="MAINTAIN_FLAG")
                njs-form-item(prop="IS_OPEN_USER" :label="$t('是否开放用户')")
                  njs-switch(v-model="addEdit[addEditType].formData.IS_OPEN_USER" active-color="#13ce66" active-value="1" inactive-value="0" inactive-color="#ff4949" :active-text="$t('是')" :inactive-text="$t('否')" :disabled="!addEdit[addEditType].formData.LSE_ID || addEdit[addEditType].formData.LSE_ID === '0'")
                njs-form-item(prop="DICT_CODE" :label="$t('字典代码')")
                  nbs-select-dict(v-model="addEdit[addEditType].formData.DICT_CODE" ref="slectDict" @change="handleDictChange")
                njs-form-item(prop="ASS_TYPE" :label="$t('组件类型')")
                  njs-combobox(v-model="addEdit[addEditType].formData.ASS_TYPE" dict="ASS_TYPE" :clearable="false" @change="$refs.addEditForm.validateField('DICT_CODE')")
                njs-form-item(prop="PARAM_VAL" :label="$t('参数值')")
                  njs-input(v-model="addEdit[addEditType].formData.PARAM_VAL" v-if="addEdit[addEditType].formData.ASS_TYPE === '1'")
                  template(v-else-if="addEdit[addEditType].formData.ASS_TYPE === '2'")
                    njs-radio-group(v-model="addEdit[addEditType].formData.PARAM_VAL" :dict="addEdit[addEditType].formData.DICT_CODE" v-if="addEdit[addEditType].formData.DICT_CODE")
                    njs-input(v-model="addEdit[addEditType].formData.PARAM_VAL" disabled v-else)
                  template(v-else-if="addEdit[addEditType].formData.ASS_TYPE === '3'")
                    njs-combobox(v-model="addEdit[addEditType].formData.PARAM_VAL" :dict="addEdit[addEditType].formData.DICT_CODE" v-if="addEdit[addEditType].formData.DICT_CODE")
                    njs-input(v-model="addEdit[addEditType].formData.PARAM_VAL" disabled v-else)
                njs-form-item(prop="PARAM_DESC" :label="$t('参数说明')")
                  njs-input(v-model="addEdit[addEditType].formData.PARAM_DESC" type="textarea" :rows="3")
            njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{ $t('确定') }}

        <!-- 右侧卡片的插槽 ------------------- end ---- litao -------------------------------------------- -->
</template>

<script>
import { validateEnNumUdl } from '@/validator/common'
const PARAM_NAME_RULE = [
  { max: 40, message: window.app.$t('长度不能超过 40'), trigger: 'change' }
]
const PARAM_CODE_RULE = [
  { validator: validateEnNumUdl, trigger: 'change' },
  { max: 32, message: window.app.$t('长度不能超过 32'), trigger: 'change' }
]
export default {
  name: 'system.sysparam', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      rules: {
        QUERY_TEXT: PARAM_NAME_RULE
      },
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      selectItems: [
        { label: this.$t('全部'), value: '1', placeholder: this.$t('请输入参数代码或参数名称') },
        { label: this.$t('参数代码'), value: '2', placeholder: this.$t('请输入参数代码') },
        { label: this.$t('参数名称'), value: '3', placeholder: this.$t('请输入参数名称') }
      ],
      addEdit: {
        add: {
          formData: {
            LSE_ID: '', // 租户
            PARAM_CODE: '', // 参数代码
            PARAM_NAME: '', // 参数名称
            PARAM_TYPE: '', // 参数分类
            PARAM_VAL: '', // 参数值
            MAINTAIN_FLAG: '0', // 维护标识
            IS_OPEN_USER: '', // 是否开放用户
            DICT_CODE: '', // 字典代码
            ASS_TYPE: '1', // 组件类型
            PARAM_DESC: '' // 参数说明
          },
          title: this.$t('新增系统参数'),
          service: 'P0103102' // 接口号
        },
        edit: {
          formData: {
            LSE_ID: '', // 租户
            PARAM_CODE: '', // 参数代码
            PARAM_NAME: '', // 参数名称
            PARAM_TYPE: '', // 参数分类
            PARAM_VAL: '', // 参数值
            MAINTAIN_FLAG: '', // 维护标识
            IS_OPEN_USER: '', // 是否开放用户
            DICT_CODE: '', // 字典代码
            ASS_TYPE: '', // 组件类型
            PARAM_DESC: '' // 参数说明
          },
          title: this.$t('修改系统参数'),
          service: 'P0103303' // 接口号
        }
      },
      addEditRules: { // 新增/修改的校验规则
        PARAM_NAME: [
          { required: true, message: this.$t('请输入参数名称'), trigger: ['blur', 'change'] },
          ...PARAM_NAME_RULE
        ],
        MAINTAIN_FLAG: { required: true, message: this.$t('请选择维护标识'), trigger: 'change' },
        PARAM_CODE: [
          { required: true, message: this.$t('请输入参数代码'), trigger: ['blur', 'change'] },
          ...PARAM_CODE_RULE
        ],
        PARAM_TYPE: { required: true, message: this.$t('请选择参数类型'), trigger: 'change' },
        PARAM_VAL: [
          { required: true, message: this.$t('请录入参数值'), trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (this.addEdit[this.addEditType].formData.DICT_CODE) { // 如果组件类型不是单选框则需要配数据字典
                if (value) {
                  let dict = this.$store.getters.getDict(this.addEdit[this.addEditType].formData.DICT_CODE)
                  if (dict.some((item) => {
                    return item.DICT_ITEM === value
                  })) {
                    callback()
                  } else {
                    let dictItems = ''
                    dict.forEach((item, index) => {
                      if (index === 0) {
                        dictItems += item.DICT_ITEM
                      } else {
                        dictItems += `,${item.DICT_ITEM}`
                      }
                    })
                    callback(new Error(this.$t('字典代码为') + this.addEdit[this.addEditType].formData.DICT_CODE + this.$t('只能输入') + ':' + dictItems))
                  }
                } else {
                  callback()
                }
              } else {
                callback()
              }
            },
            trigger: 'change' }
        ],
        ASS_TYPE: { required: true, message: this.$t('请选择组件类型'), trigger: 'change' },
        DICT_CODE: {
          validator: (rule, value, callback) => {
            if (this.addEdit[this.addEditType].formData.ASS_TYPE === '1') { // 如果组件类型不是单选框则需要配数据字典
              callback()
            } else {
              if (value) {
                callback()
              } else {
                callback(new Error(this.$t('组件类型为') + this.$store.getters.getDict('ASS_TYPE', this.addEdit[this.addEditType].formData.ASS_TYPE) + this.$t('必须选择数据字典')))
              }
            }
          },
          trigger: 'change' }
      },
      btnList: [
        {
          text: this.$t('新增系统参数'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              LSE_ID: '', // 租户
              PARAM_CODE: '', // 参数代码
              PARAM_NAME: '', // 参数名称
              PARAM_TYPE: '', // 参数分类
              PARAM_VAL: '', // 参数值
              MAINTAIN_FLAG: '0', // 维护标识
              IS_OPEN_USER: '0', // 是否开放用户
              DICT_CODE: '', // 字典代码
              ASS_TYPE: '1', // 组件类型
              PARAM_DESC: '' // 参数说明
            }
            this.$nextTick(() => {
              this.$refs.addEditForm.clearValidate()
            })
          }
        }
      ]
    }
  },
  methods: {
    // 修改
    handlerEdit (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.addEdit.edit.formData = {
        LSE_ID: row.LSE_ID, // 租户
        PARAM_CODE: row.PARAM_CODE, // 参数代码
        PARAM_NAME: row.PARAM_NAME, // 参数名称
        PARAM_TYPE: row.PARAM_TYPE, // 参数分类
        PARAM_VAL: row.PARAM_VAL, // 参数值
        MAINTAIN_FLAG: row.MAINTAIN_FLAG, // 维护标识
        IS_OPEN_USER: row.IS_OPEN_USER, // 是否开放用户
        DICT_CODE: row.DICT_CODE, // 字典代码
        ASS_TYPE: row.ASS_TYPE, // 组件类型
        PARAM_DESC: row.PARAM_DESC // 参数说明
      }
      this.$nextTick(() => {
        // this.$refs.slectDict.loadText()
        this.$refs.addEditForm.clearValidate()
      })
    },
    // 删除
    handlerDel (row) {
      this.$confirm(this.$t('你确定要系统参数') + row.PARAM_CODE + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0103204',
          PARAM_CODE: row.PARAM_CODE
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除系统参数') + row.PARAM_CODE + this.$t('成功')
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
    // 提交新增或修改
    submitAddEdit () {
      this.$refs.addEditForm.submit().then((result) => {
        if (result.code === '0') {
          if (this.addEditType === 'add') {
            this.$message({
              type: 'success',
              message: this.$t('新增系统参数') + this.addEdit.add.formData.PARAM_CODE + this.$t('成功')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改系统参数') + this.addEdit.edit.formData.PARAM_CODE + this.$t('成功')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 查询类型发生变化时
    queryTypeChange (val) {
      if (val === '1') { // 全部
        this.rules = { QUERY_TEXT: PARAM_NAME_RULE }
      } else if (val === '2') { // 参数代码
        this.rules = { QUERY_TEXT: PARAM_CODE_RULE }
      } else if (val === '3') { // 参数名称
        this.rules = { QUERY_TEXT: PARAM_NAME_RULE }
      }
    },
    // 新增或修改时选中的字典代码发生变化时
    handleDictChange () {
      this.addEdit[this.addEditType].formData.PARAM_VAL = ''
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
