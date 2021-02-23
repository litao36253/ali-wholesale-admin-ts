<template>
  <div v-loading="loading" class="dict-wrap">
    <njs-datagrid
      ref="datagrid"
      datagridId="system.dict"
      :service="$jql.system.dict.queryDict"
      rowKey="_id"
      title="数据字典管理"
      subheading="开发人员维护数据字典"
      :button-list="btnList"
      single-select
      autoLoading
      @row-click="handlerShowDetails"
    >
      <njs-datagrid-column prop="code" label="字典编号" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="name" label="字典名称" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="type" label="字典类型" dict="dict_type" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="edit_enable" label="维护标识" dict="edit_enable" sortable min-width="120" type="state" :state-map="{'maintainable': 'success', 'editable': 'warning', 'notMaintainable': 'danger'}"></njs-datagrid-column>
      <njs-datagrid-column prop="comment" label="备注" show-overflow-tooltip sortable min-width="160"></njs-datagrid-column>
      <njs-datagrid-column prop="last_reviser_username" label="最后修改人" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="update_time" label="最后修改时间" type="time" show-overflow-tooltip sortable min-width="160"></njs-datagrid-column>
      <njs-datagrid-column label="操作" min-width="180" fixed="right">
        <template v-slot="{ row }">
          <el-button type="text" @click.stop="handlerShowDetails(row)">管理字典项</el-button>
          <el-button type="text" :disabled="row.edit_enable === 'notMaintainable'" @click.stop="handleUpdate(row)">修改</el-button>
          <el-button type="text" :disabled="row.edit_enable === 'editable' || row.edit_enable === 'notMaintainable'" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </njs-datagrid-column>

      <template v-slot:query="{ formData }">
        <el-form-item prop="type" label="字典类型">
          <el-select v-model="formData.type" dict="dict_type" placeholder="请选择字典类型" @change="datagrid.refresh"></el-select>
        </el-form-item>
        <njs-datagrid-search :value="formData" :fields="[
          {value: 'code', label: '字典编号', placeholder: '请输入字典编号'},
          {value: 'name', label: '字典名称', placeholder: '请输入字典名称'}
        ]" defaultFieldName="code"></njs-datagrid-search>
      </template>

      <template v-slot:drawer>
        <njs-datagrid-drawer :visible.sync="drawerVisible" width="70%" hideTitle>
          <DictItemManage :dictCode="currentRow.code || ''" :dictName="currentRow.name || ''"/>
        </njs-datagrid-drawer>
      </template>
    </njs-datagrid>

    <el-dialog :visible.sync="editDialogVisible" width="800px" :close-on-click-modal="false" :title="editDialogType === 'create' ? '新增数据字典' : '修改数据字典'" @close="handleDialogClose">
      <el-form ref="editForm" :model="editFormModel" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典编号" prop="code" :rules="[{ required: true, message: '请输入字典编号' }]">
              <el-input v-model="editFormModel.code" placeholder="请输入字典编号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字典名称" prop="name" :rules="[{ required: true, message: '请输入字典名称' }]">
              <el-input v-model="editFormModel.name" placeholder="请输入字典名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="字典分类" prop="type" :rules="[{ required: true, message: '请选择字典分类' }]">
              <el-select v-model="editFormModel.type" dict="dict_type" placeholder="请选择字典类型"></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维护标识" prop="edit_enable" :rules="[{ required: true, message: '请选择维护标识' }]">
              <el-radio-group v-model="editFormModel.edit_enable" dict="edit_enable"></el-radio-group>
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
import { Component, Ref, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import Datagrid from '@/components/global/njs-datagrid.vue'
import DictItemManage from './dict-item-manage.vue'
import NjsDatagridSearch from '@/components/global/njs-datagrid-search.vue'

@Component({
  name: 'system.dict',
  components: { DictItemManage, NjsDatagridSearch }
})
export default class Dict extends Vue {
  @Ref('editForm')
  protected editForm: Form

  @Ref('datagrid')
  protected datagrid: Datagrid

  protected loading = false

  protected editDialogVisible = false

  protected editDialogLoading = false

  protected editDialogType = 'create' // 编辑弹框的类型，取值：create、update

  protected currentRow = {} // 当前选中的行

  protected drawerVisible = false

  protected editFormModel = {
    _id: undefined,
    code: '',
    name: '',
    type: '',
    edit_enable: 'maintainable',
    comment: ''
  }

  protected get btnList () {
    return [
      {
        text: '新增字典',
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
        const serve = this.editDialogType === 'create' ? this.$jql.system.dict.createDict : this.$jql.system.dict.updateDict
        const res = await serve(this.editFormModel)
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
    this.currentRow = row
    this.drawerVisible = true
  }

  protected handleUpdate (row) {
    this.editDialogVisible = true
    this.editDialogType = 'update'
    this.$nextTick(() => {
      this.editFormModel._id = row._id
      this.editFormModel.code = row.code
      this.editFormModel.name = row.name
      this.editFormModel.type = row.type
      this.editFormModel.edit_enable = row.edit_enable
      this.editFormModel.comment = row.comment
    })
  }

  protected handleDelete (row) {
    this.$confirm('您确定要删除该数据字典吗？', '提示', { type: 'warning' }).then(async () => {
      this.loading = true
      const res = await this.$jql.system.dict.deleteDict(row._id)
      this.loading = false
      if (!res.code) {
        this.$message.success('删除数据字典成功')
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
  }
}
</script>

<style lang="scss" scoped>
  .dict-wrap {
    background-color: #fff;
    height: 100%;
  }
</style>
