<template>
  <el-tree
    v-loading="loading"
    ref="tree"
    node-key="_id"
    :data="categoriesNodeDate"
    show-search
    default-expand-all
    :expand-on-click-node="false"
    check-on-click-node
    highlight-current
    search-field="name"
    @current-change="handleCurrentChange"
  >
    <template v-slot="{ node, data }">
      <div v-if="data.state === 'normal'" @mouseenter="hoverNodeId = data._id" @mouseleave="hoverNodeId = ''" class="tree-node">
        <span class="node-name">{{ data.name }}</span>
        <div v-show="hoverNodeId === data._id" class="button-wrap">
          <el-tooltip content="新增子分类" placement="top">
            <el-link type="primary" :underline="false" icon="el-icon-plus" @click.stop="appendNode(data)"></el-link>
          </el-tooltip>
          <el-tooltip v-if="data._id !== '0'" content="修改该分类名称" placement="top">
            <el-link type="primary" :underline="false" icon="el-icon-edit" @click.stop="data.state = 'edit'"></el-link>
          </el-tooltip>
          <el-tooltip v-if="data._id !== '0'" content="删除该分类及其所有素材" placement="top">
            <el-link type="danger" :underline="false" icon="el-icon-delete" @click.stop="deleteNode(node, data)"></el-link>
          </el-tooltip>
        </div>
      </div>
      <div v-else class="tree-node">
        <el-input v-model="data.editName" size="mini" placeholder="请输入分类名称" @click.native.stop></el-input>
        <div class="button-wrap">
          <el-tooltip content="提交" placement="top">
            <el-link type="primary" :underline="false" icon="el-icon-check" @click.stop="submitNode(data)"></el-link>
          </el-tooltip>
          <el-tooltip content="取消" placement="top">
            <el-link type="primary" :underline="false" icon="el-icon-close" @click.stop="cancelEdit(node, data)"></el-link>
          </el-tooltip>
        </div>
      </div>
    </template>
  </el-tree>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { Tree } from 'element-ui'
import { listTransTree } from '@/utils/utils'

export type CategoriesNodeDate = {
  _id: string,
  name: string,
  editName: string, // 编辑时v-model绑定的值
  parentId: string,
  parent_ids: string[],
  state: 'normal' | 'edit' | 'new', // 标识当前节点处于正常展示状态、编辑状态或刚创建的状态
  children?: CategoriesNodeDate[]
}

@Component({
  name: 'source-categories'
})
export default class SourceCategories extends Vue {
  @Ref('tree')
  protected tree: Tree

  protected categoriesNodeDate: CategoriesNodeDate[] = [{
    _id: '0',
    parentId: '',
    parent_ids: [],
    name: '全部素材',
    editName: '全部素材',
    state: 'normal',
    children: []
  }]

  protected hoverNodeId = ''

  protected loading = false

  protected created () {
    this.querySourceCategories()
  }

  protected async querySourceCategories () {
    this.loading = true
    const sourceCategoriesResult = await this.$jql.system.source.querySourceCategories().finally(() => {
      this.loading = false
    })
    if (sourceCategoriesResult.code) {
      return
    }
    const categoriesNodes = sourceCategoriesResult.data.map(node => ({
      _id: node._id,
      name: node.name,
      editName: node.name,
      parent_ids: node.parent_ids,
      parentId: node.parent_ids[0] || '',
      state: 'normal',
      children: []
    }))
    this.categoriesNodeDate[0].children = listTransTree(categoriesNodes)
    this.tree.setCurrentKey('0')
    this.$emit('current-change', this.categoriesNodeDate[0])
  }

  protected appendNode (data: CategoriesNodeDate) {
    data.children.push({
      _id: new Date().getTime().toString(),
      name: '',
      editName: '',
      parentId: data._id,
      parent_ids: [data._id].concat(data.parent_ids),
      children: [],
      state: 'new'
    })
  }

  protected async submitNode (data: CategoriesNodeDate) {
    if (!data.editName) {
      this.$message.error('请输入分类名称')
      return
    }
    if (data.state === 'new') {
      this.loading = true
      const result = await this.$jql.system.source.createSourceCategories({
        name: data.editName,
        parent_ids: data.parent_ids
      }).finally(() => {
        this.loading = false
      })

      if (!result.code) {
        this.$message.success('创建素材分类成功')
        data._id = result.id
        data.name = data.editName
        data.state = 'normal'
      }
    } else if (data.state === 'edit') {
      this.loading = true
      const result = await this.$jql.system.source.editSourceCategories({
        _id: data._id,
        name: data.editName
      }).finally(() => {
        this.loading = false
      })
      console.log(result)
      if (!result.code) {
        this.$message.success('修改素材分类成功')
        data._id = result.id
        data.name = data.editName
        data.state = 'normal'
      }
    }
  }

  protected cancelEdit (node, data: CategoriesNodeDate) {
    if (data.state === 'new') {
      const brothers = node.parent.data.children
      const index = brothers.findIndex(brother => brother._id === data._id)
      brothers.splice(index, 1)
    } else {
      data.editName = data.name
      data.state = 'normal'
    }
  }

  protected deleteNode (node, data: CategoriesNodeDate) {
    this.$confirm('你确定要删除该分类及其所有子分类和相关素材吗？', '提示').then(async () => {
      this.$emit('delete-before')
      const res = await this.$jql.system.source.deleteSourceCategories(data._id)
      if (res.code) {
        this.$emit('delete-after', false)
      } else {
        this.$emit('delete-after', true)
        this.querySourceCategories()
      }
    }).catch(e => {
      if (e === 'cancel') {
        this.$message.info('取消删除')
      } else {
        throw e
      }
    })
  }

  protected handleCurrentChange (data) {
    this.$emit('current-change', data)
  }
}
</script>

<style lang="scss" scoped>
  ::v-deep .el-tree-node__content {
    height: 30px;
  }

  .tree-node {
    flex: 1;
    display: flex;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    overflow: hidden;
    .node-name {
      width: calc(100% - 90px);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .button-wrap {
      width: 90px;
      padding: 0 0px;
      display: flex;
      justify-content: space-around;
    }
  }
</style>
