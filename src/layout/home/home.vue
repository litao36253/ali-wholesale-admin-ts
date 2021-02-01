<template>
  <el-container class="container">
    <el-aside width="auto" class="aside">
      <SideBar></SideBar>
    </el-aside>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import baseServer, { baseApi } from '@/server/base/base'
import SideBar from './side-bar/side-bar.vue'
export default {
  name: 'home-layout',
  components: {
    SideBar
  },
  methods: {
    logout () {
      baseServer(baseApi.apiLogout)
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    height: 100%;
    .aside {
      height: 100%;
      overflow: hidden;
    }
  }
</style>
