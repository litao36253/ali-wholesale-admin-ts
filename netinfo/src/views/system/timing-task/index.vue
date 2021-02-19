<template lang="pug">
  .container-wrap
    .box-body
      njs-datagrid(
        datagrid-id="system_timing_task_P0108401"
        ref="datagrid"
        :title="$t('定时任务管理')"
        :subheading="$t('管理系统中的定时任务，开发人员及运维人员都可以在此界面维护定时任务。')"
        service="P0108401"
        :rules="rules"
        :auto-loading="true"
        :button-list="btnList"
      )
        <!-----------     列配置  start ---------------------------------------------------------- -->
        njs-column(prop="TASK_NAME" :label="$t('任务名称')" show-overflow-tooltip sortable min-width="100")
        njs-column(prop="TRIGGER_NAME" :label="$t('触发器名称')" show-overflow-tooltip sortable min-width="120")
        njs-column(prop="TASK_SERVICE" :label="$t('服务代码')" min-width="100")
        njs-column(prop="TASK_STATUS" :label="$t('任务状态')" show-overflow-tooltip min-width="100" dict="TASK_STATUS" type="state" :state-map="{ '1':'warning','2':'success','3':'danger' }")
        njs-column(prop="TASK_START_TIME" :label="$t('任务开始时间')" show-overflow-tooltip min-width="150")
        njs-column(prop="TASK_REQUEST_PARAMETER" :label="$t('请求参数')" min-width="100")
        njs-column(prop="TASK_COMMON_PARAMETER" :label="$t('公共参数')" show-overflow-tooltip min-width="100")
        njs-column(prop="TASK_DESCRIPTION" :label="$t('任务描述')" show-overflow-tooltip min-width="100")
        njs-column(prop="LAST_UPDATE_USER" :label="$t('最后更新人')" show-overflow-tooltip min-width="100")
        njs-column(prop="LAST_UPDATE_TIME" :label="$t('最后更新时间')" show-overflow-tooltip min-width="150")
        njs-column(:label="$t('操作')" min-width="180" fixed="right")
          template(slot-scope="{row, column}")
            njs-button(type="text" @click.stop="handlerEditItem(row)" :disabled="row.TASK_STATUS === '2'") {{ $t('修改') }}
            njs-button(type="text" @click.stop="handlerDelItem(row)" :disabled="row.TASK_STATUS === '2'") {{ $t('删除') }}
            njs-button(type="text" @click.stop="handlerOpenItem(row)" :disabled="row.TASK_STATUS === '2'") {{ $t('开启') }}
            njs-button(type="text" @click.stop="handlerSuspendItem(row)" :disabled="row.TASK_STATUS !== '2'") {{ $t('暂停') }}
        <!-----------     列配置  end ---------------------------------------------------------- -->

        <!-----------     常用查询条件  start ---------------------------------------------------------- -->
        template(slot="more-used-query" slot-scope="{ formData }")
          njs-form-item(prop="TASK_STATUS")
            njs-combobox(v-model="formData.TASK_STATUS" dict="TASK_STATUS" :placeholder="$t('请选择任务状态')" clearable @change="$refs.datagrid.refresh()")
          njs-form-item(prop="TASK_SERVICE")
            nbs-select-interface(v-model="formData.TASK_SERVICE" @change="$refs.datagrid.refresh()")
          njs-datagrid-search(v-model="formData" query-text="TASK_NAME" hide-select :placeholder="$t('请输入任务名称')")
        <!-----------     常用查询条件  end ---------------------------------------------------------- -->

        <!-- 右侧卡片的插槽 ------------------- start ---- litao -------------------------------------------- -->
        template(slot="fixed-card" slot-scope="{ formData }")
          njs-datagrid-card(:width="580" :title="addEdit[addEditType].title" :visible.sync="addEditVisible" :close-text="$t('取消')")
            .form-wrap
              njs-form(:model="addEdit[addEditType].formData" size="small" ref="addEditForm" :show-submit="false" :show-reset="false" :service="addEdit[addEditType].service" :rules="addEditRules")
                njs-form-item(prop="TASK_NAME" :label="$t('任务名称')")
                  njs-input(v-model="addEdit[addEditType].formData.TASK_NAME")
                njs-form-item(prop="TRIGGER_NAME" :label="$t('触发器名称')")
                  nbs-select-trigger(v-model="addEdit[addEditType].formData.TRIGGER_NAME" :clearable="false" ref="selectTrigger")
                njs-form-item(prop="TASK_SERVICE" :label="$t('服务代码')")
                  nbs-select-interface(v-model="addEdit[addEditType].formData.TASK_SERVICE" :clearable="false" ref="selectInterface")
                njs-form-item(prop="TASK_START_TIME" :label="$t('任务开始时间')")
                  njs-date-picker(v-model="addEdit[addEditType].formData.TASK_START_TIME" type="datetime" :placeholder="$t('选择日期时间')" value-format="yyyy-MM-dd HH:mm:ss" :style="{width: '100%'}" :clearable="false")
                njs-form-item(prop="TASK_REQUEST_PARAMETER" :label="$t('请求参数')")
                  njs-input(v-model="addEdit[addEditType].formData.TASK_REQUEST_PARAMETER" type="textarea" :rows="3")
                njs-form-item(prop="TASK_COMMON_PARAMETER" :label="$t('公共参数')")
                  njs-input(v-model="addEdit[addEditType].formData.TASK_COMMON_PARAMETER" type="textarea" :rows="3")
                njs-form-item(prop="TASK_DESCRIPTION" :label="$t('任务描述')")
                  njs-input(v-model="addEdit[addEditType].formData.TASK_DESCRIPTION" type="textarea" :rows="3")
            njs-button(type="primary" slot="footer" size="medium" @click="submitAddEdit") {{ $t('确定') }}

        <!-- 右侧卡片的插槽 ------------------- end ---- litao -------------------------------------------- -->
</template>

<script>
export default {
  name: 'system.timing-task', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      rules: {
        TASK_NAME: [
          { max: 20, message: this.$t('任务名称最长为 20'), trigger: ['change', 'blur'] }
        ]
      },
      addEditRules: { // 新增/修改的校验规则
        TASK_NAME: [
          { required: true, message: this.$t('请输入任务名称'), trigger: ['blur', 'change'] },
          { max: 20, message: this.$t('任务名称长度不能超过 20'), trigger: ['change', 'blur'] }
        ],
        TRIGGER_NAME: { required: true, message: this.$t('请选择触发器'), trigger: 'change' },
        TASK_SERVICE: { required: true, message: this.$t('请选择系统服务'), trigger: 'change' },
        TASK_START_TIME: { required: true, message: this.$t('请选择任务开始时间'), trigger: ['change', 'blur'] },
        TASK_REQUEST_PARAMETER: { max: 200, message: this.$t('请求参数长度不能超过 200'), trigger: ['change', 'blur'] },
        TASK_COMMON_PARAMETER: { max: 200, message: this.$t('公共参数长度不能超过 200'), trigger: ['change', 'blur'] },
        TASK_DESCRIPTION: { max: 200, message: this.$t('任务描述长度不能超过 200'), trigger: ['change', 'blur'] }
      },
      btnList: [
        {
          text: this.$t('新增任务'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              TASK_NAME: '', // 任务名称
              TRIGGER_NAME: '', // 触发器名称
              TASK_SERVICE: '', // 服务代码
              TASK_START_TIME: '', // 任务开始时间
              TASK_REQUEST_PARAMETER: '', // 请求参数
              TASK_COMMON_PARAMETER: '', // 公共参数
              TASK_DESCRIPTION: '' // 任务描述
            }
            this.$nextTick(() => {
              this.$refs.selectTrigger.loadText()
              this.$refs.selectInterface.loadText()
              this.$nextTick(() => {
                this.$refs.addEditForm.clearValidate()
              })
            })
          }
        }
      ],
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEdit: {
        add: {
          formData: {
            TASK_NAME: '', // 任务名称
            TRIGGER_NAME: '', // 触发器名称
            TASK_SERVICE: '', // 服务代码
            TASK_START_TIME: '', // 任务开始时间
            TASK_REQUEST_PARAMETER: '', // 请求参数
            TASK_COMMON_PARAMETER: '', // 公共参数
            TASK_DESCRIPTION: '' // 任务描述
          },
          title: this.$t('新增任务'),
          service: 'P0108102' // 接口号
        },
        edit: {
          formData: {
            TASK_NAME: '', // 任务名称
            TRIGGER_NAME: '', // 触发器名称
            TASK_SERVICE: '', // 服务代码
            TASK_START_TIME: '', // 任务开始时间
            TASK_REQUEST_PARAMETER: '', // 请求参数
            TASK_COMMON_PARAMETER: '', // 公共参数
            TASK_DESCRIPTION: '' // 任务描述
          },
          title: this.$t('修改任务'),
          service: 'P0108203' // 接口号
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
        TASK_NAME: row.TASK_NAME, // 任务名称
        TRIGGER_NAME: row.TRIGGER_NAME, // 触发器名称
        TASK_SERVICE: row.TASK_SERVICE, // 服务代码
        TASK_START_TIME: row.TASK_START_TIME, // 任务开始时间
        TASK_REQUEST_PARAMETER: row.TASK_REQUEST_PARAMETER, // 请求参数
        TASK_COMMON_PARAMETER: row.TASK_COMMON_PARAMETER, // 公共参数
        TASK_DESCRIPTION: row.TASK_DESCRIPTION // 任务描述
      }
      this.$nextTick(() => {
        this.$refs.selectTrigger.loadText()
        this.$refs.selectInterface.loadText()
        this.$nextTick(() => {
          this.$refs.addEditForm.clearValidate()
        })
      })
    },
    // 删除任务
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要删除任务') + row.TASK_NAME + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0108304',
          TASK_NAME: row.TASK_NAME,
          TASK_STATUS: row.TASK_STATUS
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除任务') + row.TASK_NAME + this.$t('成功')
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
    // 启动任务
    handlerOpenItem (row) {
      this.$confirm(this.$t('你确定要启动任务') + row.TASK_NAME + this.$t(' 吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0108007',
          TASK_NAME: row.TASK_NAME
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('启动任务') + row.TASK_NAME + this.$t('成功')
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
    }, // 暂停任务
    handlerSuspendItem (row) {
      this.$confirm(this.$t('你确定要暂停任务') + row.TASK_NAME + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0108008',
          TASK_NAME: row.TASK_NAME
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('暂停任务') + row.TASK_NAME + this.$t('成功')
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
              message: this.$t('新增任务') + this.addEdit.add.formData.TASK_NAME + this.$t('成功')
            })
          } else if (this.addEditType === 'edit') {
            this.$message({
              type: 'success',
              message: this.$t('修改任务') + this.addEdit.edit.formData.TASK_NAME + this.$t('成功')
            })
          }
          this.addEditVisible = false
          this.$refs.datagrid.refresh()
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
  @import "index.styl"
</style>
