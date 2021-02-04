<template>
  <div class="dict-wrap">
    <njs-datagrid
      datagridId="system.dict"
      rowKey="_id"
      title="数据字典管理"
      subheading="开发人员维护数据字典"
      :data="data"
      :button-list="btnList"
      single-select
    >
      <njs-datagrid-column prop="code" label="字典编号" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="name" label="字典名称" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="type" label="字典分类" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
      <njs-datagrid-column prop="edit_enable" label="维护标识" show-overflow-tooltip sortable min-width="120" type="state" :state-map="{'1': 'success', '2': 'warning', '3': 'danger'}"></njs-datagrid-column>
      <njs-datagrid-column prop="comment" label="备注" show-overflow-tooltip sortable min-width="120"></njs-datagrid-column>
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
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitDict">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { Datagrid, DatagridColumn } from '@/components/datagrid/datagrid'
import jql from '@/server/jql/jql.ts'


export default {
  name: 'system.dict',
  // components: { Datagrid, DatagridColumn },
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
  async created () {
    const a = await jql.system.dict.queryDict({
      // code: '2323'
    })
    console.log(a)
  },
  methods: {
    handleSubmitDict () {
      const database = uniCloud.database()
      database.collection('uni-dict').add({
        ...this.editFormModel
      }).then(res => {
        console.log(res)
      })
    },
    handlerShowDetails (row) {

    },
    handleEdit (row) {

    },
    handleDelete (row) {

    }
  }
}
</script>

<style lang="scss" scoped>
  .dict-wrap {
    background-color: #fff;
    height: 100%;
  }
</style>
