<template>
  <div>
    主页内容
    <el-button>按钮</el-button>
    <el-table :data="data">
      <el-table-column label="字段1" prop="colum1"></el-table-column>
      <el-table-column label="字段2" prop="colum2"></el-table-column>
      <el-table-column label="字段3" prop="colum3"></el-table-column>
      <el-table-column label="字段4" prop="colum4"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'system.menu'
})
export default class Menu extends Vue {
  protected data = [
    {
      colum1: 'colum1',
      colum2: 'colum2',
      colum3: 'colum3',
      colum4: 'colum4'
    },
    {
      colum1: 'colum1',
      colum2: 'colum2',
      colum3: 'colum3',
      colum4: 'colum4'
    },
    {
      colum1: 'colum1',
      colum2: 'colum2',
      colum3: 'colum3',
      colum4: 'colum4'
    },
    {
      colum1: 'colum1',
      colum2: 'colum2',
      colum3: 'colum3',
      colum4: 'colum4'
    }
  ]
}
</script>

<style>
</style>
