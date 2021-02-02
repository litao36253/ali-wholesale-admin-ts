<template>
  <el-form :model="formModel">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="formModel.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="formModel.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="handleLogin">注册</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import baseServer, { baseApi } from '@/server/base/base'

export default {
  name: 'user.register',
  data () {
    return {
      formModel: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    handleLogin () {
      baseServer(baseApi.apiRegister, this.formModel).then(res => {
        console.log(res)
      })
    }
  }
}
</script>

<style>
</style>
