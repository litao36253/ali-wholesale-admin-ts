<template>
  <TreeManage side-title="系统菜单" body-title="编辑选中菜单">
    <template v-slot:side-content>
      <el-tree ref="tree"
        :data="data"
        node-key="path"
        show-search
      >

      </el-tree>
    </template>

    <template v-slot:body-content>
      <div>body-content</div>
    </template>
  </TreeManage>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TreeManage from '@/layout/tree-manage/tree-manage.vue'

@Component({
  name: 'system.menu',
  components: { TreeManage }
})
export default class Menu extends Vue {
  protected data = []
}
</script>
