<template lang="pug">
  .wrap(style="height: 100%;")
    njs-datagrid(
      datagrid-id="system_i18n_P0111404"
      ref="datagrid"
      :title="$t('国际化管理')"
      :subheading="$t('开发人员及运维人员可以在这个界面维护国际化数据。')"
      service="P0111404"
      :default-query="{QUERY_TYPE:'1'}"
      :rules="rules"
      :auto-loading="true"
      :button-list="btnList"
      :multiple="true"
    )
      <!-----------     列配置  start ---------------------------------------------------------- -->
      njs-column(prop="I18N_ID" :label="$t('编号')"  show-overflow-tooltip sortable min-width="100" :hide="true")
      njs-column(prop="I18N_KEY" label="Key" show-overflow-tooltip sortable min-width="100")
      njs-column(prop="I18N_VALUE" label="Value" show-overflow-tooltip sortable min-width="100")
      njs-column(prop="I18N_LANGUAGE" :label="$t('语言')" min-width="100" dict="LANGUAGE" )
      njs-column(prop="I18N_TYPE" :label="$t('国际化类型')" min-width="100" dict="I18N_TYPE")

      njs-column(:label="$t('操作')" min-width="150" fixed="right")
        template(slot-scope="{row, column}")
          njs-button(type="text" @click.stop="handlerEditItem(row)") {{ $t('修改') }}
          njs-button(type="text" @click.stop="handlerDelItem(row)") {{ $t('删除') }}
      <!-----------     列配置  end ---------------------------------------------------------- -->

      <!-----------     常用查询条件  start ---------------------------------------------------------- -->
      template(slot="more-used-query" slot-scope="{ formData }")
        njs-form-item(prop="I18N_TYPE")
          njs-combobox(v-model="formData.I18N_TYPE" dict="I18N_TYPE" :placeholder="$t('请选择国际化类型')" clearable @change="$refs.datagrid.refresh()")
        njs-form-item(prop="LANGUAGE")
          njs-combobox(v-model="formData.I18N_LANGUAGE" dict="LANGUAGE" :placeholder="$t('请选择语言')" clearable @change="$refs.datagrid.refresh()")
        njs-datagrid-search(v-model="formData" :selectItems="selectItems")
      <!-----------     常用查询条件  end ---------------------------------------------------------- -->

      <!-- 右侧卡片的插槽 ------------------- start ------------------------------------------------ -->
      template(slot="fixed-card" slot-scope="{ formData }")
        njs-datagrid-card(:width="580" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
          .form-wrap
            njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules" @before-submit="handleSubmitHandle" )
              njs-form-item(prop="I18N_KEY" :label="$t('Key值')")
                njs-input(v-model="addEdit[addEditType].formData.I18N_KEY")
              njs-form-item(prop="I18N_VALUE" :label="$t('Value值')")
                njs-input(v-model="addEdit[addEditType].formData.I18N_VALUE" )
              njs-form-item(prop="I18N_TYPE" :label="$t('国际化类型')")
                njs-combobox(v-model="addEdit[addEditType].formData.I18N_TYPE" dict="I18N_TYPE")
              njs-form-item(prop="I18N_LANGUAGE" :label="$t('语言')")
                njs-combobox(v-model="addEdit[addEditType].formData.I18N_LANGUAGE" dict="LANGUAGE")
          njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{ $t('确定') }}
      <!-- 右侧卡片的插槽 ------------------- end ------------------------------------------------ -->

    <!---------------    导出翻译文件 弹出框    start  --------------------------------------------------------->
    njs-dialog(:title="exportExcel.title" :visible.sync="erportExcelVisible")
      njs-form(:model="exportExcel.formData" ref="exportExcelForm" size="middle" :show-submit="false" :show-reset="false" v-if="erportExcelVisible")
        njs-form-item(prop="LANGUAGE")
          njs-checkbox-group(v-model='exportExcel.formData.LANGUAGE' dict="LANGUAGE" :auto-create-border="true")
      template(slot="footer")
        njs-button(type="primary" @click="exportExcelFunc()") {{ $t('导 出') }}
        njs-button(@click="erportExcelVisible = false") {{ $t('取 消') }}
    <!---------------    导出翻译文件 弹出框    end  --------------------------------------------------------->

    <!---------------    导出开发语言包 弹出框    start  --------------------------------------------------------->
    njs-dialog(:title="exportI18N.title" :visible.sync="exportI18NVisible")
      njs-form(:model="exportI18N.formData" ref="exportI18NForm" size="middle" :show-submit="false" :show-reset="false" )
        njs-form-item(:label="$t('语言')")
            njs-checkbox-group(v-model='exportI18N.formData.LANGUAGE' dict="LANGUAGE" :auto-create-border="true")
        njs-form-item(:label="$t('国际化类型')")
            njs-checkbox-group(v-model='exportI18N.formData.I18N_TYPE' dict="I18N_TYPE" :auto-create-border="true")
      template(slot="footer")
        njs-button(type="primary" @click="exportI18NFunc()") {{ $t('导 出') }}
        njs-button(@click="exportI18NVisible = false") {{ $t('取 消') }}
    <!---------------    导出开发语言包 弹出框    end  --------------------------------------------------------->
    <!---------------    导入国际化数据 弹出框    start  --------------------------------------------------------->
    ImportI18n(:visible.sync="importVisible" v-if="importVisible" @import="$refs.datagrid.refresh()")
    <!---------------    导入国际化数据 弹出框    end  --------------------------------------------------------->
</template>

<script>
import ImportI18n from './components/c-import-i18n'
import { API as configApi } from '@/conf/'
// 获取接口根路径
const isProd = process.env.NODE_ENV === 'production'
const BASE_PATH = isProd ? configApi.production : configApi.development
export default {
  name: 'system.i18n', // 页面级别组件一定要用路由名称命名！！！
  components: {
    ImportI18n
  },
  data () {
    const LENTH_RULE = [
      { max: 100, message: this.$t('长度不能超过 100'), trigger: 'change' }
    ]
    return {
      rules: {
        QUERY_TEXT: LENTH_RULE
      },
      addEditRules: { // 新增/修改的校验规则
        I18N_KEY: [ ...LENTH_RULE, { required: true, message: this.$t('词条 Key 不能为空'), trigger: ['blur', 'change'] } ],
        I18N_VALUE: [ ...LENTH_RULE, { required: true, message: this.$t('词条 Value 不能为空'), trigger: ['blur', 'change'] } ],
        I18N_LANGUAGE: [
          { required: true, message: this.$t('请选择语言'), trigger: ['blur', 'change'] }
        ],
        I18N_TYPE: [
          { required: true, message: this.$t('请选择国际化类型'), trigger: ['blur', 'change'] }
        ]
      },
      fileList: [],
      fileName: '', // 文件名
      errorInfo: false, // 错误显示
      checkInAll: '', // 总校验条数
      checkInData: [], // 校验返回值
      successUp: false, // 成功上传显示
      successUpData: [], // 成功返回值
      failRedisKey: '', // 失败redis key
      successRedisKey: '', // 成功redis key
      errorRedisKey: '', // 错误的redis key
      editI18nId: '', // 记录当前正在修改的国际化id
      btnList: [
        {
          text: this.$t('新增词条'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              I18N_KEY: '', // Key值
              I18N_VALUE: '', // Value值
              I18N_LANGUAGE: '', // 语言
              I18N_TYPE: '' // 国际化类型
            }
            this.$nextTick(() => {
              this.$refs.addEditForm.clearValidate()
            })
          }
        },
        {
          type: 'delete',
          text: this.$t('批量删除'),
          service: 'P0111203',
          key: 'I18N_ID'
        },
        {
          text: this.$t('导入词条'),
          handler: () => {
            this.successUp = false
            this.checkInData.SUCCESS_COUNT = 0
            this.importVisible = true
          }
        },
        {
          text: this.$t('导出翻译文件'),
          handler: () => {
            this.erportExcelVisible = true
            this.exportExcel.formData = {
              LANGUAGE: ''
            }
          }
        },
        {
          text: this.$t('导出开发语言包'),
          handler: () => {
            this.exportI18NVisible = true
            this.exportI18N.formData = {
              LANGUAGE: '',
              I18N_TYPE: ''
            }
          }
        }
      ],
      erportExcelVisible: false, // 导处翻译文件弹框的可见状态
      exportI18NVisible: false, // 导出开发语言包弹框的可见状态
      addEditVisible: false, // 新增/修改弹框的可见状态
      importVisible: false, // 导入弹窗的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      placeholder: {
        '1': this.$t('请输入Key值或Value值'),
        '2': this.$t('请输入Key值'),
        '3': this.$t('请输入Value值')
      },
      addEdit: {
        add: {
          formData: {
            I18N_KEY: '', // Key值
            I18N_VALUE: '', // Value值
            I18N_LANGUAGE: '', // 语言
            I18N_TYPE: '' // 国际化类型
          },
          title: this.$t('新增词条'),
          service: 'P0111101' // 接口号
        },
        edit: {
          formData: {
            I18N_KEY: '', // Key值
            I18N_VALUE: '', // Value值
            I18N_LANGUAGE: '', // 语言
            I18N_TYPE: '' // 国际化类型
          },
          title: this.$t('修改词条'),
          service: 'P0111302' // 接口号
        }
      },
      selectItems: [
        { label: this.$t('全部'), value: '1', placeholder: this.$t('请输入Key值或Value值') },
        { label: this.$t('Key值'), value: '2', placeholder: this.$t('请输入Key值') },
        { label: this.$t('Value值'), value: '3', placeholder: this.$t('请输入Value值') }
      ],
      exportExcel: {
        formData: {
          LANGUAGE: ''
        },
        title: this.$t('请选择要导出的语言')
      },
      exportI18N: {
        formData: {
          LANGUAGE: '',
          I18N_TYPE: ''
        },
        title: this.$t('导出开发语言包')
      },
      importI18N: {
        formData: {
          LANGUAGE: '',
          I18N_TYPE: ''
        },
        title: this.$t('导入国际化词条')
      }
    }
  },
  methods: {
    // 修改国际化
    handlerEditItem (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.editI18nId = row.I18N_ID
      this.addEdit.edit.formData = {
        I18N_KEY: row.I18N_KEY, // Key值
        I18N_VALUE: row.I18N_VALUE, // Value值
        I18N_LANGUAGE: row.I18N_LANGUAGE, // 语言
        I18N_TYPE: row.I18N_TYPE // 国际化类型
      }
      this.$nextTick(() => {
        this.$refs.addEditForm.clearValidate()
      })
    },
    handleSubmitHandle (req, callback) {
      req[0].I18N_ID = this.editI18nId
      callback(req)
    },
    // 删除国际化
    handlerDelItem (row) {
      let key = row.I18N_KEY
      this.$confirm(this.$t('你确定要删除Key') + key + this.$t('吗？'), this.$t('提示'),
        {
          type: 'warning'
        }).then(() => {
        this.$ajaxRequest([{
          service: 'P0111203',
          I18N_ID: row.I18N_ID
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除KEY') + key + this.$t('成功')
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
              message: this.$t('新增国际化数据') + this.addEdit.add.formData.I18N_KEY + this.$t('成功。')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改国际化数据') + this.addEdit.add.formData.I18N_KEY + this.$t('成功。')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 导出翻译文件方法
    exportExcelFunc () {
      if (this.exportExcel.formData.LANGUAGE) {
        let url = BASE_PATH.UCC + '/I18NExportExcel?LANGUAGE=' + this.exportExcel.formData.LANGUAGE
        window.open(url, '_blank')
        this.erportExcelVisible = false
      } else {

      }
    },
    // 导出开发语言包方法
    exportI18NFunc () {
      if (!this.exportI18N.formData.LANGUAGE) {
        this.$message.warning(this.$t('请勾选开发语言包的语言！'))
      } else if (!this.exportI18N.formData.I18N_TYPE) {
        this.$message.warning(this.$t('请勾选开发语言包的国际化类型！'))
      } else {
        let url = BASE_PATH.UCC + '/I18NExport?LANGUAGE=' + this.exportI18N.formData.LANGUAGE + '&I18N_TYPE=' + this.exportI18N.formData.I18N_TYPE
        window.open(url, '_blank')
        this.exportI18NVisible = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
