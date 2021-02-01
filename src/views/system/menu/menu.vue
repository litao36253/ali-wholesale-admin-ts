<template>
  <div>
    主页内容
    <el-button>按钮</el-button>
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[100, 200, 300, 400]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400">
    </el-pagination>
  </div>
</template>

<script>
</script>

<style>
</style>
