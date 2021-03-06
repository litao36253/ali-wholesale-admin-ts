<template>
  <div class="dict-wrap">
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
      multiple
    >
      <njs-datagrid-column prop="code" label="字典编号" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="name" label="字典名称" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="type" label="字典分类" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="edit_enable" label="维护标识" show-overflow-tooltip sortable min-width="120" type="state" :state-map="{'1': 'success', '2': 'warning', '3': 'danger'}"></njs-datagrid-column>
      <njs-datagrid-column prop="comment" label="备注" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="creator_username" label="创建人" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="create_time" label="创建时间" type="time" show-overflow-tooltip sortable min-width="160"></njs-datagrid-column>
      <njs-datagrid-column label="操作" min-width="180" fixed="right">
        <template v-slot="{ row }">
          <el-button type="text" @click.stop="handlerShowDetails(row)">管理字典项</el-button>
          <el-button type="text" :disabled="row.edit_enable === '3'" @click.stop="handleUpdate(row)">修改</el-button>
          <el-button type="text" :disabled="row.edit_enable === '2' || row.edit_enable === '3'" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </njs-datagrid-column>

      <template>

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
              <el-input v-model="editFormModel.type" placeholder="请选择字典分类"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维护标识" prop="edit_enable" :rules="[{ required: true, message: '请选择维护标识' }]">
              <el-input v-model="editFormModel.edit_enable" placeholder="请选择维护标识"></el-input>
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

@Component({
  name: 'system.dict'
})
export default class Dict extends Vue {
  @Ref('editForm')
  protected editForm: Form

  @Ref('datagrid')
  protected datagrid: Datagrid

  protected editDialogVisible = false

  protected editDialogLoading = false

  protected editDialogType = 'create' // 编辑弹框的类型，取值：create、update

  protected editFormModel = {
    code: '',
    name: '',
    type: '',
    edit_enable: '',
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
        const res = await this.$jql.system.dict.addDict(this.editFormModel)
        this.editDialogLoading = false
        if (!res.code) {
          this.$message.success('创建数据字典成功')
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
  }

  protected handleDelete (row) {
    console.log(row)
  }

  protected handleDialogClose () {
    this.editForm.resetFields()
  }
}
</script>

<style lang="scss" scoped>
  .dict-wrap {
    background-color: #fff;
    height: 100%;
  }
</style>
