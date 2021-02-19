<template lang="pug">
  .wrap(style="height: 100%;")
    njs-datagrid(
      datagrid-id="system_dict_P0102401"
      ref="datagrid"
      :title="$t('数据字典管理')"
      :subheading="$t('管理系统中的数据字典，开发人员及运维人员都可以在此界面维护数据字典。')"
      service="P0102401"
      :rules="rules"
      :default-query="{QUERY_TYPE:'1'}"
      :auto-loading="true"
      :button-list="btnList"
      @row-click="rowClick"
      single-select
    )
      <!-----------     列配置  start ---------------------------------------------------------- -->
      njs-column(prop="DICT_CODE" :label="$t('字典代码')" show-overflow-tooltip sortable min-width="120")
      njs-column(prop="DICT_NAME" :label="$t('字典名称')" show-overflow-tooltip sortable min-width="120")
      njs-column(prop="DICT_TYPE" :label="$t('字典分类')" min-width="120" dict="DICT_TYPE")
      njs-column(prop="MAINTAIN_FLAG" :label="$t('维护标识')" min-width="120" dict="MAINTAIN_FLAG" type="state" :state-map="{'0': 'success', '1': 'danger', '2': 'warning', '3': 'info'}")
      njs-column(prop="LAST_UPDATE_USER" :label="$t('最后更新人')" sortable min-width="100")
      njs-column(prop="LAST_UPDATE_TIME" :label="$t('最后更新时间')" min-width="180" sortable)
      njs-column(:label="$t('操作')" min-width="160" fixed="right")
        template(slot-scope="{ row, column, $index }")
          njs-button(type="text" @click.stop="handlerShowDetails(row)") {{ $t('管理字典项') }}
          njs-button(type="text" :disabled="row.MAINTAIN_FLAG==='2' || row.MAINTAIN_FLAG==='3'" @click.stop="handlerEdit(row)") {{ $t('修改') }}
          njs-button(type="text" :disabled="row.MAINTAIN_FLAG==='1' || row.MAINTAIN_FLAG==='3'" @click.stop="handlerDel(row)") {{$t('删除')}}
      <!-----------     列配置  end ---------------------------------------------------------- -->

      <!-----------     常用查询条件  start ---------------------------------------------------------- -->
      template(slot="more-used-query" slot-scope="{ formData }")
        njs-form-item(prop="DICT_TYPE")
          njs-combobox(v-model="formData.DICT_TYPE" dict="DICT_TYPE" :placeholder="$t('请选择字典类型')" clearable @change="$refs.datagrid.refresh()")
        njs-form-item(prop="MAINTAIN_FLAG")
          njs-combobox(v-model="formData.MAINTAIN_FLAG" dict="MAINTAIN_FLAG" :placeholder="$t('请选择维护标识')" clearable @change="$refs.datagrid.refresh()")
        njs-datagrid-search(v-model="formData" :selectItems="selectItems" @select-change="queryTypeChange")
      <!-----------     常用查询条件  end ---------------------------------------------------------- -->

      <!-- 右侧卡片的插槽 ------------------- start ---- litao -------------------------------------------- -->
      template(slot="fixed-card" slot-scope="{ formData }")
        njs-datagrid-card(:visible.sync="showCard" width="45%" hide-title)
          njs-datagrid(
            datagrid-id="system_dict_item_P0102405"
            service="P0102405"
            ref="dictItemDatagrid"
            :title="$t('字典项管理')"
            :subheading="$t('管理') + oldRow.DICT_CODE + $t('的字典项。')"
            @before-load="handleDictItemBeforeLoad"
            :auto-loading="true"
            :button-list="itemBtnList"
          )
            njs-column(prop="DICT_ORD" :label="$t('取值顺序')" sortable show-overflow-tooltip)
            njs-column(prop="DICT_ITEM" :label="$t('字典项代码')" sortable show-overflow-tooltip)
            njs-column(prop="DICT_ITEM_NAME" :label="$t('字典项名称')" sortable show-overflow-tooltip)
            njs-column(prop="MAINTAIN_FLAG" :label="$t('维护标识')" sortable show-overflow-tooltip dict="MAINTAIN_FLAG" type="state" :state-map="{'0': 'success', '1': 'danger', '2': 'warning', '3': 'info'}")
            njs-column(:label="$t('操作')" min-width="80")
              template(slot-scope="{row, column}" fixed="right")
                njs-button(type="text" :disabled="row.MAINTAIN_FLAG==='2' || row.MAINTAIN_FLAG==='3'" @click.stop="handlerEditItem(row)") {{ $t('修改') }}
                njs-button(type="text" :disabled="row.MAINTAIN_FLAG==='1' || row.MAINTAIN_FLAG==='3'" @click.stop="handlerDelItem(row)") {{ $t('删除') }}
        <!-- 右侧卡片的插槽 ------------------------------------------ end ------------------------------>

    <!---------------    新增/修改 弹出框    start  --------------------------------------------------------->
    njs-dialog(:title="addEdit[addEditType].title" :visible.sync="addEditVisible")
      njs-form(:model="addEdit[addEditType].formData" ref="addEditForm" :rules="addEditRules" size="middle" :service="addEdit[addEditType].service" :show-submit="false" :show-reset="false" v-if="addEditVisible")
        njs-row(:gutter="20")
          njs-col(:span="12")
            njs-form-item(prop="DICT_TYPE" :label="$t('字典类型')")
              njs-combobox(v-model="addEdit[addEditType].formData.DICT_TYPE" dict="DICT_TYPE" :clearable="false")
          njs-col(:span="12")
            njs-form-item(prop="MAINTAIN_FLAG" :label="$t('维护标识')")
              njs-combobox(v-model="addEdit[addEditType].formData.MAINTAIN_FLAG" :disabled="addEditType === 'edit'" dict="MAINTAIN_FLAG" :clearable="false")
        njs-row(:gutter="20")
          njs-col(:span="12")
            njs-form-item(prop="DICT_CODE" :label="$t('字典代码')")
              njs-input(v-model="addEdit[addEditType].formData.DICT_CODE" clearable :disabled="addEditType === 'edit'")
          njs-col(:span="12")
            njs-form-item(prop="DICT_NAME" :label="$t('字典名称')")
              njs-input(v-model="addEdit[addEditType].formData.DICT_NAME" clearable)
      template(slot="footer")
        njs-button(type="primary" @click="saveAddEdit") {{ $t('保 存') }}
        njs-button(@click="addEditVisible = false") {{ $t('关 闭') }}
    <!---------------    新增/修改 弹出框    end  --------------------------------------------------------->

    <!---------------    新增/修改字典项 弹出框    start  --------------------------------------------------------->
    njs-dialog(:title="addEditItem[addEditItemType].title" :visible.sync="addEditItemVisible")
      njs-form(:model="addEditItem[addEditItemType].formData" ref="addEditItemForm" :rules="addEditItemRules" size="middle" :service="addEditItem[addEditItemType].service" :show-submit="false" :show-reset="false" @before-submit="hadleItemBeforeSubmit")
        njs-row(:gutter="20")
          njs-col(:span="12")
            njs-form-item(prop="DICT_ITEM" :label="$t('字典项代码')")
              njs-input(v-model="addEditItem[addEditItemType].formData.DICT_ITEM" :disabled="addEditItemType === 'edit'")
          njs-col(:span="12")
            njs-form-item(prop="DICT_ITEM_NAME" :label="$t('字典项名称')")
              njs-input(v-model="addEditItem[addEditItemType].formData.DICT_ITEM_NAME")
        njs-row(:gutter="20")
          njs-col(:span="12")
            njs-form-item(prop="DICT_ORD" :label="$t('取值顺序')")
              njs-input-number(v-model="addEditItem[addEditItemType].formData.DICT_ORD" :min="1" :max="999" :style="{width: '100%', display: 'block'}")
          njs-col(:span="12")
            njs-form-item(prop="MAINTAIN_FLAG" :label="$t('维护标识')")
              njs-combobox(v-model="addEditItem[addEditItemType].formData.MAINTAIN_FLAG" dict="MAINTAIN_FLAG" :clearable="false" disabled)
      template(slot="footer")
        njs-button(type="primary" @click="saveAddEditItem") {{ $t('保 存') }}
        njs-button(@click="addEditItemVisible = false") {{ $t('关 闭') }}
    <!---------------    新增/修改字典项 弹出框    end  --------------------------------------------------------->

</template>

<script>
import { validateEnNumUdl } from '@/validator/common'
const DICT_NAME_RULE = [
  { max: 40, message: window.app.$t('字典名称长度不能超过 40'), trigger: 'change' }
]
const DICT_CODE_RULE = [
  { validator: validateEnNumUdl, trigger: 'change' },
  { max: 32, message: window.app.$t('字典代码长度不能超过 32'), trigger: 'change' }
]
const DICT_ITEM_NAME_RULE = [
  { max: 40, message: window.app.$t('字典项名称长度不能超过 40'), trigger: 'change' }
]
const DICT_ITEM_RULE = [
  { validator: validateEnNumUdl, trigger: 'change' },
  { max: 32, message: window.app.$t('字典项代码长度不能超过 32'), trigger: 'change' }
]
export default {
  name: 'system.dict', // 页面级别组件一定要用路由名称命名！！！
  data () {
    return {
      showCard: false, // 是否显示右侧卡片
      oldRow: {}, // 老的选中行
      rules: { QUERY_TEXT: DICT_NAME_RULE },
      btnList: [
        {
          text: this.$t('新增字典'),
          handler: () => {
            this.addEditType = 'add'
            this.addEditVisible = true
            this.addEdit.add.formData = {
              DICT_NAME: '', // 字典名称
              MAINTAIN_FLAG: '', // 维护标识
              DICT_CODE: '', // 字典代码
              DICT_TYPE: '' // 字典类型
            }
            this.$nextTick(() => {
              this.$refs.addEditForm.clearValidate()
            })
          }
        }
      ],
      itemBtnList: [
        {
          text: this.$t('新增字典项'),
          handler: () => {
            this.addEditItemType = 'add'
            this.addEditItemVisible = true
            this.addEditItem.add.formData = {
              DICT_ITEM: '', // 字典项代码
              DICT_ITEM_NAME: '', // 字典项名称
              DICT_ORD: '1', // 取值顺序
              MAINTAIN_FLAG: this.oldRow.MAINTAIN_FLAG // 维护标识
            }
            this.$nextTick(() => {
              this.$refs.addEditItemForm.clearValidate()
            })
          }
        }
      ],
      selectItems: [
        { label: this.$t('全部'), value: '1', placeholder: this.$t('请输入字典代码或字典名称') },
        { label: this.$t('字典代码'), value: '2', placeholder: this.$t('请输入字典代码') },
        { label: this.$t('字典名称'), value: '3', placeholder: this.$t('请输入字典名称') }
      ],
      addEditVisible: false, // 新增/修改弹框的可见状态
      addEditItemVisible: false, // 新增/修改字典项弹框的可见状态
      addEditType: 'add', // 标识当前dialog是新增还是修改
      addEditItemType: 'add', // 标识当前字典项dialog是新增还是修改
      addEditRules: { // 新增/修改的校验规则
        DICT_NAME: [
          { required: true, message: this.$t('请输入字典名称'), trigger: ['blur', 'change'] },
          ...DICT_NAME_RULE
        ], // 字典名称
        MAINTAIN_FLAG: { required: true, message: this.$t('请选择维护标识'), trigger: 'change' }, // 维护标识
        DICT_CODE: [
          { required: true, message: this.$t('请输入字典代码'), trigger: ['blur', 'change'] },
          ...DICT_CODE_RULE
        ], // 字典代码
        DICT_TYPE: { required: true, message: this.$t('请选择字典类型'), trigger: 'change' } // 字典类型
      },
      addEditItemRules: {
        DICT_ITEM: [
          { required: true, message: this.$t('请输入字典项代码'), trigger: ['blur', 'change'] },
          ...DICT_ITEM_RULE
        ],
        DICT_ITEM_NAME: [
          { required: true, message: this.$t('请输入字典项名称'), trigger: ['blur', 'change'] },
          ...DICT_ITEM_NAME_RULE
        ],
        DICT_ORD: [
          { required: true, message: this.$t('请输入字典项取值顺序'), trigger: ['blur', 'change'] }
        ],
        MAINTAIN_FLAG: { required: true, message: this.$t('请选择字典项维护标识'), trigger: ['blur', 'change'] }
      },
      addEdit: {
        add: {
          formData: {
            DICT_NAME: '', // 字典名称
            MAINTAIN_FLAG: '', // 维护标识
            DICT_CODE: '', // 字典代码
            DICT_TYPE: '' // 字典类型
          },
          title: this.$t('新增数据字典'),
          service: 'P0102102' // 接口号
        },
        edit: {
          formData: {
            DICT_NAME: '', // 字典名称
            MAINTAIN_FLAG: '', // 维护标识
            DICT_CODE: '', // 字典代码
            DICT_TYPE: '' // 字典类型
          },
          title: this.$t('修改数据字典'),
          service: 'P0102303' // 接口号
        }
      },
      addEditItem: {
        add: {
          formData: {
            DICT_ITEM: '', // 字典项代码
            DICT_ITEM_NAME: '', // 字典项名称
            DICT_ORD: '1', // 取值顺序
            MAINTAIN_FLAG: '' // 维护标识
          },
          title: this.$t('新增字典项'),
          service: 'P0102106' // 接口号
        },
        edit: {
          formData: {
            DICT_ITEM: '', // 字典项代码
            DICT_ITEM_NAME: '', // 字典项名称
            DICT_ORD: '', // 取值顺序
            MAINTAIN_FLAG: '' // 维护标识
          },
          title: this.$t('修改字典项'),
          service: 'P0102307' // 接口号
        }
      }
    }
  },
  methods: {
    // 保存新增或修改
    saveAddEdit () {
      if (this.addEditType === 'add') { // 保存新增数据字典
        this.$refs.addEditForm.submit().then((result) => {
          if (result.code === '0') { // 提交成功
            this.$message({
              type: 'success',
              message: this.$t('新增数据字典成功。')
            })
            this.$refs.datagrid.refresh()
            this.addEditVisible = false
          }
        })
      } else if (this.addEditType === 'edit') { // 保存修改数据字典
        this.$refs.addEditForm.submit().then((result) => {
          if (result.code === '0') { // 提交成功
            this.$refs.datagrid.refresh()
            this.addEditVisible = false
          }
        })
      }
    },
    // 保存新增/修改字典项
    saveAddEditItem () {
      if (this.addEditItemType === 'add') { // 保存新增数据字典
        this.$refs.addEditItemForm.submit().then((result) => {
          if (result.code === '0') { // 提交成功
            this.$message({
              type: 'success',
              message: this.$t('新增数据字典项成功。')
            })
            this.$refs.dictItemDatagrid.refresh()
            this.addEditItemVisible = false
          }
        })
      } else if (this.addEditItemType === 'edit') { // 保存修改数据字典
        this.$refs.addEditItemForm.submit().then((result) => {
          if (result.code === '0') { // 提交成功
            this.$refs.dictItemDatagrid.refresh()
            this.addEditItemVisible = false
          }
        })
      }
    },
    // 查询类型发生变化时
    queryTypeChange (val) {
      if (val === '1') { // 全部
        this.rules = { QUERY_TEXT: DICT_NAME_RULE }
      } else if (val === '2') { // 字典代码
        this.rules = { QUERY_TEXT: DICT_CODE_RULE }
      } else if (val === '3') { // 字典名称
        this.rules = { QUERY_TEXT: DICT_NAME_RULE }
      }
    },
    // 点击某行
    rowClick (row, column, event) {
      if (this.oldRow.DICT_CODE === row.DICT_CODE) {
        this.showCard = !this.showCard
      } else {
        this.showCard = true
      }
      this.oldRow = row || {}
      if (this.showCard) {
        this.$refs.dictItemDatagrid.refresh()
      }
    },
    // 点击管理字典项
    handlerShowDetails (row) {
      this.showCard = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$refs.dictItemDatagrid.refresh()
    },
    // 点击修改字典
    handlerEdit (row) {
      this.addEditType = 'edit'
      this.addEditVisible = true
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.addEdit.edit.formData = {
        DICT_NAME: row.DICT_NAME, // 字典名称
        MAINTAIN_FLAG: row.MAINTAIN_FLAG, // 维护标识
        DICT_CODE: row.DICT_CODE, // 字典代码
        DICT_TYPE: row.DICT_TYPE // 字典类型
      }
      this.$nextTick(() => {
        this.$refs.addEditForm.clearValidate()
      })
    },
    // 点击删除字典
    handlerDel (row) {
      this.oldRow = row || {}
      this.$refs.datagrid.setCurrentRow(row)
      this.$confirm(this.$t('你确定要删除字典') + row.DICT_CODE + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0102204',
          DICT_CODE: row.DICT_CODE
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除字典') + row.DICT_CODE + this.$t('成功。')
            })
            this.$refs.datagrid.refresh()
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: this.$t('已取消删除')
        })
      })
    },
    // 字典项刷新之前
    handleDictItemBeforeLoad (req, callback) {
      req[0].DICT_CODE = this.oldRow.DICT_CODE
      callback(req)
    },
    // 提交新增/修改字典项之前
    hadleItemBeforeSubmit (req, callback) {
      req[0].DICT_CODE = this.oldRow.DICT_CODE
      callback(req)
    },
    // 修改字典项
    handlerEditItem (row) {
      this.addEditItemType = 'edit'
      this.addEditItemVisible = true
      this.addEditItem.edit.formData = {
        DICT_ITEM: row.DICT_ITEM,
        MAINTAIN_FLAG: row.MAINTAIN_FLAG, // 维护标识
        DICT_ITEM_NAME: row.DICT_ITEM_NAME,
        DICT_ORD: row.DICT_ORD
      }
      this.$nextTick(() => {
        this.$refs.addEditItemForm.clearValidate()
      })
    },
    // 删除字典项
    handlerDelItem (row) {
      this.$confirm(this.$t('你确定要删除字典项') + row.DICT_ITEM + this.$t('吗？'), this.$t('提示'), {
        type: 'warning'
      }).then(() => {
        this.$ajaxRequest([{
          service: 'P0102208',
          DICT_CODE: row.DICT_CODE,
          DICT_ITEM: row.DICT_ITEM
        }]).then((result) => {
          if (result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('删除字典项') + row.DICT_ITEM + this.$t('成功。')
            })
            this.$refs.dictItemDatagrid.refresh()
          }
        }).catch((err) => {
          console.log(err)
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

<style lang="stylus">
  @import './index.styl'
</style>
