<template>
  <div class="dict-wrap">
    <a-table :dataSource="data" rowKey="_id" loading>
      <a-table-column key="code" title="字典编号"></a-table-column>
      <a-table-column key="name" title="字典名称"></a-table-column>
      <a-table-column key="type" title="字典分类"></a-table-column>
      <a-table-column key="edit_enable" title="维护标识"></a-table-column>
      <a-table-column key="comment" title="备注"></a-table-column>
    </a-table>
  </div>
</template>

<script>

export default {
  name: 'system.dict',
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
      }
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

<style lang="scss" scoped>
  .dict-wrap {
    position: relative;
    height: 100%;
    background: #fff;
  }
</style>
