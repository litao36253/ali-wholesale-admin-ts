<template>
  <el-container class="container">
    <el-aside width="auto" class="aside">
      <SideBar></SideBar>
    </el-aside>
    <el-container>
      <el-header>Header<el-button type="danger" @click="logout">退出登录</el-button></el-header>
      <el-main>
        <keep-alive :include="$store.state.common.keepAliveRoutes">
          <router-view></router-view>
        </keep-alive>
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
