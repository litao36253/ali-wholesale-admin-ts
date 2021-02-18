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
      <njs-datagrid-column label="操作" min-width="160" fixed="right">
        <template v-slot="{ row }">
          <el-button type="text" @click.stop="handlerShowDetails(row)">管理字典项</el-button>
          <el-button type="text" :disabled="row.edit_enable === '3'" @click.stop="handleEdit(row)">修改</el-button>
          <el-button type="text" :disabled="row.edit_enable === '2' || row.edit_enable === '3'" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </njs-datagrid-column>

      <template>

      </template>
    </njs-datagrid>

    <el-dialog :visible.sync="editDialogVisible" @close="handleDialogClose">
      <el-form ref="editForm" :model="editFormModel">
        <el-form-item label="字典编号" prop="code">
          <el-input v-model="editFormModel.code" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="name">
          <el-input v-model="editFormModel.name" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="字典分类" prop="type">
          <el-input v-model="editFormModel.type" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="维护标识" prop="edit_enable">
          <el-input v-model="editFormModel.edit_enable" placeholder=""></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input v-model="editFormModel.comment" placeholder=""></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitDict">确定</el-button>
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
        handler: () => {
          this.editDialogVisible = true
        }
      }
    ]
  }

  protected mounted () {
    // this.$jql.system.dict.queryDict()
    // this.datagrid.doLayout()
  }

  protected handleSubmitDict () {
    this.$jql.system.dict.addDict(this.editFormModel).then(res => {
      console.log('res', res)
    })
  }

  protected handlerShowDetails (row) {
    console.log(row)
  }

  protected handleEdit (row) {
    console.log(row)
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
