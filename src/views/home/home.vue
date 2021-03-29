<template>
  <div>
    主页内容
    <el-button @click="test">测试</el-button>
  </div>
</template>

<script lang="ts">
import baseServer, { baseApi } from '@/server/base/base'

export default {
  methods: {
    async test () {
      const res = await baseServer(baseApi.getUserInfo)
      console.log(res)
    }
  }
}
</script>

<style>
</style>
