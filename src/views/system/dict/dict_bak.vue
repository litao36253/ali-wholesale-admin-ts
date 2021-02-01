<template>
  <div class="dict-wrap">
    <Datagrid
      datagridId="system.dict"
      title="数据字典管理"
      subheading="开发人员维护数据字典"
      :data="data"
      :button-list="btnList"
      single-select
    >
      <DatagridColumn prop="code" label="字典编号" show-overflow-tooltip sortable min-width="120"></DatagridColumn>
      <DatagridColumn prop="name" label="字典名称" show-overflow-tooltip sortable min-width="120"></DatagridColumn>
      <DatagridColumn prop="type" label="字典分类" show-overflow-tooltip sortable min-width="120"></DatagridColumn>
      <DatagridColumn prop="edit_enable" label="维护标识" show-overflow-tooltip sortable min-width="120" type="state" :state-map="{'1': 'success', '2': 'warning', '3': 'danger'}"></DatagridColumn>
      <DatagridColumn prop="comment" label="备注" show-overflow-tooltip sortable min-width="120"></DatagridColumn>
    </Datagrid>

    <el-dialog :visible.sync="editDialogVisible">
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
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitDict">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Datagrid, DatagridColumn } from '@/components/datagrid/datagrid'

export default {
  name: 'system.dict',
  components: { Datagrid, DatagridColumn },
  data () {
    return {
      data: [],
      editDialogVisible: false,
      editFormModel: {
        code: '',
        name: '',
        type: '',
        edit_enable: '',
        comment: ''
      },
      btnList: [
        {
          text: '新增字典',
          handler: () => {
            this.editDialogVisible = true
            this.$nextTick(() => {
              this.$refs.editForm.resetFields()
            })
          }
        }
      ]
    }
  },
  created () {
    const database = uniCloud.database()
    database.collection('uni-dict').get().then(res => {
      if (!res.code) {
        this.data = res.data
      }
    })
  },
  methods: {
    handleSubmitDict () {
      const database = uniCloud.database()
      database.collection('uni-dict').add({
        ...this.editFormModel
      }).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style>
</style>
