<template>
  <TreeManage side-title="素材分类" body-title="素材内容">
    <template v-slot:side-content>
      <SourceCategories/>
    </template>

    <template v-slot:body-content>
      <div>

      </div>
    </template>
  </TreeManage>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TreeManage from '@/layout/tree-manage/tree-manage.vue'
import SourceCategories from './source-categories.vue'

@Component({
  name: 'system.source',
  components: { TreeManage, SourceCategories }
})
export default class Source extends Vue {

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
    font-size: 16px;
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
