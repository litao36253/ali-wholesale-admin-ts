<template lang="pug">
  njs-datagrid(
    datagrid-id="system_trigger_P0109401"
    ref="datagrid"
    :title="$t('触发器管理')"
    :subheading="$t('开发人员及运营管理员可在此界面维护触发器。')"
    service="P0109401"
    :rules="rules"
    :auto-loading="true"
    :button-list="btnList"
  )
    <!-----------     列配置  start ---------------------------------------------------------- -->
    njs-column(prop="TRIGGER_NAME" :label="$t('触发器名称')" show-overflow-tooltip sortable min-width="120")
    njs-column(prop="TRIGGER_TYPE" :label="$t('触发器类型')" show-overflow-tooltip sortable min-width="120" dict="TRIGGER_TYPE")
    njs-column(prop="TRIGGER_INTERVAL" :label="$t('执行间隔')" min-width="80")
    njs-column(prop="TRIGGER_INTERVAL_UNIT" :label="$t('间隔单位')" min-width="120" dict="TIME_UNIT")
    njs-column(prop="TRIGGER_REPEAT_COUNT" :label="$t('重复执行次数')" show-overflow-tooltip min-width="120" :formatter="(row, column, cellValue) => cellValue ? cellValue : $t('无限制')")
    njs-column(prop="TRIGGER_START_TIME" :label="$t('每日开始时间')" show-overflow-tooltip min-width="120")
    njs-column(prop="TRIGGER_END_TIME" :label="$t('每日结束时间')" show-overflow-tooltip min-width="120")
    njs-column(prop="TRIGGER_WEEK_DAY" :label="$t('星期执行日')" show-overflow-tooltip min-width="140" dict="WEEK_DAY")
    njs-column(prop="TRIGGER_EXPRESSION" :label="$t('表达式')" show-overflow-tooltip min-width="140")
    njs-column(prop="LAST_UPDATE_USER" show-overflow-tooltip :label="$t('最后更新人')" min-width="120" sortable)
    njs-column(prop="LAST_UPDATE_TIME"  show-overflow-tooltip sortable :label="$t('最后更新时间')" min-width="160")
    njs-column(:label="$t('操作')" min-width="150" fixed="right")
      template(slot-scope="{row, column}")
        njs-button(type="text" @click.stop="handlerEditItem(row)") {{ $t('修改')}}
        njs-button(type="text" @click.stop="handlerDelItem(row)") {{ $t('删除') }}
    <!-----------     列配置  end ---------------------------------------------------------- -->

    <!-----------     常用查询条件  start ---------------------------------------------------------- -->
    template(slot="more-used-query" slot-scope="{ formData }")
      njs-form-item(prop="TRIGGER_TYPE")
        njs-combobox(v-model="formData.TRIGGER_TYPE" dict="TRIGGER_TYPE" :placeholder="$t('请选择触发器类型')" clearable @change="$refs.datagrid.refresh()")
      njs-datagrid-search(v-model="formData" query-text="TRIGGER_NAME" hide-select :placeholder="$t('请输入触发器名称')")
    <!-----------     常用查询条件  end ---------------------------------------------------------- -->

    <!-- 右侧卡片的插槽 ------------------- start ---- litao -------------------------------------------- -->
    template(slot="fixed-card" slot-scope="{ formData }")
      njs-datagrid-card(:width="580" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
        .form-wrap
          njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules")
            njs-form-item(prop="TRIGGER_TYPE" :label="$t('触发器类型')")
              njs-radio-group(v-model="addEdit[addEditType].formData.TRIGGER_TYPE" auto-create-button dict="TRIGGER_TYPE" @change="handleTypeChange" :disabled="addEditType === 'edit'")

            template(v-if="addEdit[addEditType].formData.TRIGGER_TYPE === '1'")
              njs-form-item(prop="TRIGGER_NAME" :label="$t('触发器名称')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_NAME")
              njs-form-item(prop="TRIGGER_INTERVAL" :label="$t('执行间隔')")
                  njs-input(v-model="addEdit[addEditType].formData.TRIGGER_INTERVAL")
                    njs-combobox(v-model="addEdit[addEditType].formData.TRIGGER_INTERVAL_UNIT" dict="TIME_UNIT" :clearable="false" slot='append' :style="{width: '80px'}")
              njs-form-item(prop="TRIGGER_REPEAT_COUNT" :label="$t('重复执行次数')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_REPEAT_COUNT")

            template(v-if="addEdit[addEditType].formData.TRIGGER_TYPE === '2'")
              njs-form-item(prop="TRIGGER_NAME" :label="$t('触发器名称')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_NAME")
              njs-form-item(prop="TRIGGER_INTERVAL" :label="$t('执行间隔')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_INTERVAL")
                  njs-combobox(v-model="addEdit[addEditType].formData.TRIGGER_INTERVAL_UNIT" dict="TIME_UNIT" :clearable="false" slot='append' :style="{width: '80px'}")

            template(v-if="addEdit[addEditType].formData.TRIGGER_TYPE === '3'")
              njs-form-item(prop="TRIGGER_NAME" :label="$t('触发器名称')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_NAME")
              njs-form-item(prop="TRIGGER_INTERVAL" :label="$t('执行间隔')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_INTERVAL")
                  njs-combobox(v-model="addEdit[addEditType].formData.TRIGGER_INTERVAL_UNIT" dict="TIME_UNIT" :clearable="false" slot='append' :style="{width: '80px'}")
              njs-form-item(prop="TRIGGER_REPEAT_COUNT" :label="$t('重复执行次数')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_REPEAT_COUNT")
              njs-form-item(prop="TRIGGER_START_TIME" :label="$t('执行时间')")
                njs-time-picker(is-range v-model="TRIGGER_TIME" :range-separator="$t('至')" :start-placeholder="$t('开始时间')" :end-placeholder="$t('结束时间')" :placeholder="$t('选择时间范围')" :style="{width: '100%'}" value-format="HH:mm:ss" :clearable="false" picker-options="'00:00:00 - 23:59:59'")
              njs-form-item(prop="TRIGGER_WEEK_DAY" :label="$t('星期执行日')")
                njs-checkbox-group(v-model="addEdit[addEditType].formData.TRIGGER_WEEK_DAY" dict="WEEK_DAY")

            template(v-if="addEdit[addEditType].formData.TRIGGER_TYPE === '4'")
              njs-form-item(prop="TRIGGER_NAME" :label="$t('触发器名称')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_NAME")
              njs-form-item(prop="TRIGGER_EXPRESSION" :label="$t('表达式')")
                njs-input(v-model="addEdit[addEditType].formData.TRIGGER_EXPRESSION")
        njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{ $t('确定') }}
</template>

<script>
import { validateNumber } from '@/validator/common'
export default {
  name: 'system.trigger', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      rules: {
        TRIGGER_NAME: [
          { max: 20, message: this.$t('输入长度不可超过 20'), trigger: 'change' }
        ]
      },
      addEditRules: { // 新增/修改的校验规则
        TRIGGER_NAME: [
          { required: true, message: this.$t('请输入触发器名称'), trigger: ['blur', 'change'] },
          { max: 20, message: this.$t('输入长度不可超过 20'), trigger: 'change' }
        ],
        TRIGGER_INTERVAL: [
          { required: true, message: this.$t('请输入执行间隔'), trigger: ['blur', 'change'] },
          { validator: validateNumber, min: 0, message: this.$t('请输入大于等于 0 的数字'), trigger: ['blur', 'change'] }
        ],
        TRIGGER_REPEAT_COUNT: [
          { validator: validateNumber, min: 1, max: 99999, int: true, message: this.$t('请输入 1 - 99999 的整数，不填则不限制执行次数'), trigger: ['blur', 'change'] }
        ],
        TRIGGER_START_TIME: { required: true, message: this.$t('请选择时间范围'), trigger: ['blur', 'change'] },
        TRIGGER_WEEK_DAY: { required: true, message: this.$t('请选择星期执行日'), trigger: ['blur', 'change'] },
        TRIGGER_EXPRESSION: { required: true, message: this.$t('请输入表达式'), trigger: ['blur', 'change'] }
      },
      btnList: [
        {
          text: this.$t('新增触发器'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              TRIGGER_NAME: '', // 触发器名称
              TRIGGER_TYPE: '1', // 触发器类型
              TRIGGER_INTERVAL: '', // 执行间隔
              TRIGGER_INTERVAL_UNIT: '2', // 执行间隔单位
              TRIGGER_REPEAT_COUNT: '', // 重复执行总次数
              TRIGGER_START_TIME: '', // 当天开始时间
              TRIGGER_END_TIME: '', // 当天结束时间
              TRIGGER_WEEK_DAY: '', // 每星期执行的天数
              TRIGGER_EXPRESSION: '' // 触发器corn表达式
            }
            this.$nextTick(() => {
              this.$refs.addEditForm.clearValidate()
            })
          }
        }
      ],
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEdit: {
        add: {
          formData: {
            TRIGGER_NAME: '', // 触发器名称
            TRIGGER_TYPE: '1', // 触发器类型
            TRIGGER_INTERVAL: '', // 执行间隔
            TRIGGER_INTERVAL_UNIT: '2', // 执行间隔单位
            TRIGGER_REPEAT_COUNT: '', // 重复执行总次数
            TRIGGER_START_TIME: '', // 当天开始时间
            TRIGGER_END_TIME: '', // 当天结束时间
            TRIGGER_WEEK_DAY: '', // 每星期执行的天数
            TRIGGER_EXPRESSION: '' // 触发器corn表达式
          },
          title: this.$t('新增触发器'),
          service: 'P0109102' // 接口号
        },
        edit: {
          formData: {
            TRIGGER_NAME: '', // 触发器名称
            TRIGGER_TYPE: '1', // 触发器类型
            TRIGGER_INTERVAL: '', // 执行间隔
            TRIGGER_INTERVAL_UNIT: '1', // 执行间隔单位
            TRIGGER_REPEAT_COUNT: '', // 重复执行总次数
            TRIGGER_START_TIME: '', // 当天开始时间
            TRIGGER_END_TIME: '', // 当天结束时间
            TRIGGER_WEEK_DAY: '', // 每星期执行的天数
            TRIGGER_EXPRESSION: '' // 触发器corn表达式
          },
          title: this.$t('修改触发器'),
          service: 'P0109303' // 接口号
        }
      }
    }
  },
  methods: {
    // 修改
    handlerEditItem (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.addEdit.edit.formData = {
        TRIGGER_NAME: row.TRIGGER_NAME, // 租户名称
        TRIGGER_TYPE: row.TRIGGER_TYPE, // 租户类型
        TRIGGER_INTERVAL: row.TRIGGER_INTERVAL, // 租户状态
        TRIGGER_INTERVAL_UNIT: row.TRIGGER_INTERVAL_UNIT, // 开户日期
        TRIGGER_REPEAT_COUNT: row.TRIGGER_REPEAT_COUNT, // 有效期
        TRIGGER_START_TIME: row.TRIGGER_START_TIME, // 销户日期
        TRIGGER_END_TIME: row.TRIGGER_END_TIME, // 联系人
        TRIGGER_WEEK_DAY: row.TRIGGER_WEEK_DAY, // ATTN_TEL
        TRIGGER_EXPRESSION: row.TRIGGER_EXPRESSION // 联系邮箱
      }
      this.$nextTick(() => {
        this.$refs.addEditForm.clearValidate()
      })
    },
    // 删除租户
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要触发器') + row.TRIGGER_NAME + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0109204',
          TRIGGER_NAME: row.TRIGGER_NAME
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除触发器') + row.TRIGGER_NAME + this.$t('成功')
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
              message: this.$t('新增触发器') + this.addEdit.add.formData.TRIGGER_NAME + this.$t('成功')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改触发器') + this.addEdit.edit.formData.TRIGGER_NAME + this.$t('成功')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    },
    // 新增时触发器类型发生变化
    handleTypeChange (val) {
      this.addEdit.add.formData.TRIGGER_NAME = '' // 触发器名称
      this.addEdit.add.formData.TRIGGER_INTERVAL = '' // 执行间隔
      this.addEdit.add.formData.TRIGGER_INTERVAL_UNIT = '2' // 执行间隔单位
      this.addEdit.add.formData.TRIGGER_REPEAT_COUNT = '' // 重复执行总次数
      this.addEdit.add.formData.TRIGGER_START_TIME = '' // 当天开始时间
      this.addEdit.add.formData.TRIGGER_END_TIME = '' // 当天结束时间
      this.addEdit.add.formData.TRIGGER_WEEK_DAY = '' // 每星期执行的天数
      this.addEdit.add.formData.TRIGGER_EXPRESSION = '' // 触发器corn表达式
      if (val === '4') {
        this.addEdit.add.formData.TRIGGER_INTERVAL_UNIT = ''
      }
      this.$nextTick(() => {
        this.$refs.addEditForm.clearValidate()
      })
    }
  },
  computed: {
    TRIGGER_TIME: {
      get () {
        if (this.addEdit[this.addEditType].formData.TRIGGER_START_TIME && this.addEdit[this.addEditType].formData.TRIGGER_END_TIME) {
          return [this.addEdit[this.addEditType].formData.TRIGGER_START_TIME, this.addEdit[this.addEditType].formData.TRIGGER_END_TIME]
        } else {
          return ['', '']
        }
      },
      set (val) {
        this.addEdit[this.addEditType].formData.TRIGGER_START_TIME = val[0]
        this.addEdit[this.addEditType].formData.TRIGGER_END_TIME = val[1]
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "./index.styl"
</style>
