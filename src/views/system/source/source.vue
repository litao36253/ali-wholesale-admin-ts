<template>
  <TreeManage v-loading="loading" side-title="素材分类" :body-title="categories.name">
    <template v-slot:side-content>
      <SourceCategories
        @delete-before="loading = true"
        @delete-after="loading = false"
        @current-change="handleCurrentChange"
      />
    </template>

    <template v-slot:body-content>
      <SourceContent :categories="categories"/>
    </template>
  </TreeManage>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TreeManage from '@/layout/tree-manage/tree-manage.vue'
import SourceCategories from './source-categories-tree.vue'
import SourceContent from './source-content.vue'

@Component({
  name: 'system.source',
  components: { TreeManage, SourceCategories, SourceContent }
})
export default class Source extends Vue {
  protected loading = false

  protected categories = { _id: '0', parent_ids: [], name: '全部素材' }

  protected handleCurrentChange (data) {
    this.categories = data
  }
}
</script>
