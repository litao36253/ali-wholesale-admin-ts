<template>
  <TreeManage v-loading="loading" side-title="素材分类" body-title="素材内容">
    <template v-slot:side-content>
      <SourceCategories
        @delete-before="loading = true"
        @delete-after="loading = false"
        @current-change="handleCurrentChange"
      />
    </template>

    <template v-slot:body-content>
      <SourceContent/>
    </template>
  </TreeManage>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TreeManage from '@/layout/tree-manage/tree-manage.vue'
import SourceCategories from './source-categories.vue'
import SourceContent from './source-content.vue'

@Component({
  name: 'system.source',
  components: { TreeManage, SourceCategories, SourceContent }
})
export default class Source extends Vue {
  protected loading = false

  protected handleCurrentChange (data) {
    console.log(data)
  }
}
</script>
