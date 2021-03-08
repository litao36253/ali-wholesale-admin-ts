<template>
  <TreeManage side-title="素材分类" body-title="素材管理">
    <template v-slot:side-content>
      <el-tree node-key="_id"></el-tree>
    </template>
  </TreeManage>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TreeManage from '@/layout/tree-manage/tree-manage.vue'

@Component({
  name: 'system.source',
  components: { TreeManage }
})
export default class Source extends Vue {

}
</script>
