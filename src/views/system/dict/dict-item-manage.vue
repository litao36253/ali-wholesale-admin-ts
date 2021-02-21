<template>
  <div v-loading="loading" class="wrap">
    <njs-datagrid
      ref="datagrid"
      datagridId="system.dict.itme"
      :service="$jql.system.dict.queryDictItem"
      rowKey="_id"
      :title="dictName + '字典项管理'"
      subheading="开发人员维护数据字典项"
      :button-list="btnList"
      :defaultQuery="{ dict_code: dictCode }"
      autoLoading
    >
      <njs-datagrid-column prop="number" label="No." show-overflow-tooltip sortable min-width="70"></njs-datagrid-column>
      <njs-datagrid-column prop="dict_item_code" label="字典项编号" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="dict_item_name" label="字典项名称" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="edit_enable" label="维护标识" show-overflow-tooltip sortable min-width="100" type="state" :state-map="{'maintainable': 'success', 'editable': 'warning', 'notMaintainable': 'danger'}"></njs-datagrid-column>
      <njs-datagrid-column prop="comment" label="备注" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="last_reviser_username" label="最后修改人" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="update_time" label="最后修改时间" type="time" show-overflow-tooltip sortable min-width="160"></njs-datagrid-column>
      <njs-datagrid-column label="操作" min-width="120" fixed="right">
        <template v-slot="{ row }">
          <el-button type="text" :disabled="row.edit_enable === 'notMaintainable'" @click.stop="handleUpdate(row)">修改</el-button>
          <el-button type="text" :disabled="row.edit_enable === 'editable' || row.edit_enable === 'notMaintainable'" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </njs-datagrid-column>
    </njs-datagrid>

    <el-dialog :visible.sync="editDialogVisible" width="800px" :close-on-click-modal="false" :title="editDialogType === 'create' ? '新增数据字典项' : '修改数据字典项'" @close="handleDialogClose">
      <el-form ref="editForm" :model="editFormModel" label-width="96px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典项编号" prop="dict_item_code" :rules="[{ required: true, message: '请输入字典项编号' }]">
              <el-input v-model="editFormModel.dict_item_code" placeholder="请输入字典项编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典项名称" prop="dict_item_name" :rules="[{ required: true, message: '请输入字典项名称' }]">
              <el-input v-model="editFormModel.dict_item_name" placeholder="请输入字典项名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="排序编号" prop="number" :rules="[{ required: true, message: '请输入字典项排序编号' }]">
              <el-input-number v-model="editFormModel.number" :min="1" placeholder="请输入字典项排序编号"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维护标识" prop="edit_enable" :rules="[{ required: true, message: '请选择维护标识' }]">
              <el-radio-group v-model="editFormModel.edit_enable" dict="edit_enable">
                <el-radio label="maintainable">可维护</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注" prop="comment">
              <el-input v-model="editFormModel.comment" type="textarea" :rows="5" :maxlength="180" resize="none" show-word-limit placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-radio-group></el-radio-group>
        <el-button :disabled="editDialogLoading" @click="editDialogVisible = false">取消</el-button>
        <el-button :loading="editDialogLoading" type="primary" @click="handleSubmitDict">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Ref, Prop, Watch, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import Datagrid from '@/components/global/njs-datagrid.vue'

@Component({
  name: 'system.dict.item'
})
export default class Dict extends Vue {
  @Prop({
    type: String,
    required: true
  })
  protected dictCode

  @Prop(String)
  protected dictName

  @Ref('editForm')
  protected editForm: Form

  @Ref('datagrid')
  protected datagrid: Datagrid

  protected loading = false

  protected editDialogVisible = false

  protected editDialogLoading = false

  protected editDialogType = 'create' // 编辑弹框的类型，取值：create、update

  protected editFormModel = {
    _id: undefined,
    dict_item_code: '',
    dict_item_name: '',
    number: 1,
    edit_enable: 'maintainable',
    comment: ''
  }

  protected get btnList () {
    return [
      {
        text: '新增字典项',
        icon: 'el-icon-plus',
        handler: () => {
          this.editDialogVisible = true
          this.editDialogType = 'create'
        }
      }
    ]
  }

  protected mounted () {
  }

  protected async handleSubmitDict () {
    this.editForm.validate(async (valid) => {
      if (valid) {
        this.editDialogLoading = true
        const serve = this.editDialogType === 'create' ? this.$jql.system.dict.createDictItem : this.$jql.system.dict.updateDictItem
        const res = await serve({ ...this.editFormModel, dict_code: this.dictCode })
        this.editDialogLoading = false
        if (!res.code) {
          this.$message.success(this.editDialogType === 'create' ? '创建数据字典成功' : '修改数据字典成功')
          this.editDialogVisible = false
          this.datagrid.refresh()
        }
      }
    })
  }

  protected handlerShowDetails (row) {
    console.log(row)
  }

  protected handleUpdate (row) {
    this.editDialogVisible = true
    this.editDialogType = 'update'
    this.$nextTick(() => {
      this.editFormModel._id = row._id
      this.editFormModel.dict_item_code = row.dict_item_code
      this.editFormModel.dict_item_name = row.dict_item_name
      this.editFormModel.number = row.number
      this.editFormModel.edit_enable = row.edit_enable
      this.editFormModel.comment = row.comment
    })
  }

  protected handleDelete (row) {
    this.$confirm('您确定要删除该数据字典项吗？', '提示', { type: 'warning' }).then(async () => {
      this.loading = true
      const res = await this.$jql.system.dict.deleteDictItem(row._id)
      this.loading = false
      if (!res.code) {
        this.$message.success('删除数据字典项成功')
        this.editDialogVisible = false
        this.datagrid.refresh()
      }
    }).catch(e => {
      if (e === 'cancel') {
        this.$message.info('取消删除')
      } else {
        throw e
      }
    })
  }

  protected handleDialogClose () {
    this.editForm.resetFields()
    this.editFormModel._id = undefined
    setTimeout(() => {
      console.log('this.editFormModel', this.editFormModel)
    }, 100)
  }

  @Watch('dictCode')
  protected handleDictCodeChange () {
    this.datagrid.refresh()
  }
}
</script>

<style lang="scss" scoped>
  .wrap {
    box-sizing: border-box;
    height: 100%;
    // padding: 20px;
  }
</style>
