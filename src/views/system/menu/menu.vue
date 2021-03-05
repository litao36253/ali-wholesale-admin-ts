<template>
  <TreeManage side-title="系统菜单" body-title="编辑选中菜单">
    <template v-slot:side-content>
      <div>side-content</div>
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
export default class Menu extends Vue {}
</script>
