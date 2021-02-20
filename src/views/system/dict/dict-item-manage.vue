<template>
  <div v-loading="loading" class="wrap">
    <njs-datagrid
      ref="datagrid"
      datagridId="system.dict.itme"
      :service="$jql.system.dict.queryDictItem"
      rowKey="_id"
      title="字典项管理"
      subheading="开发人员维护数据字典项"
      :button-list="btnList"
      autoLoading
    >
      <njs-datagrid-column prop="code" label="字典编号" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="name" label="字典名称" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="edit_enable" label="维护标识" show-overflow-tooltip sortable min-width="100" type="state" :state-map="{'1': 'success', '2': 'warning', '3': 'danger'}"></njs-datagrid-column>
      <njs-datagrid-column prop="comment" label="备注" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="creator_username" label="最后修改人" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="create_time" label="最后修改时间" type="time" show-overflow-tooltip sortable min-width="160"></njs-datagrid-column>
      <njs-datagrid-column label="操作" min-width="120">
        <template v-slot="{ row }">
          <el-button type="text" :disabled="row.edit_enable === '3'" @click.stop="handleUpdate(row)">修改</el-button>
          <el-button type="text" :disabled="row.edit_enable === '2' || row.edit_enable === '3'" @click.stop="handleDelete(row)">删除</el-button>
        </template>
      </njs-datagrid-column>
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
              <el-radio-group v-model="editFormModel.edit_enable" dict="test">
                <el-radio label="1">可维护</el-radio>
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
import { Component, Ref, Prop, Vue } from 'vue-property-decorator'
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
    console.log(row)
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
    setTimeout(() => {
      console.log('this.editFormModel', this.editFormModel)
    }, 100)
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
