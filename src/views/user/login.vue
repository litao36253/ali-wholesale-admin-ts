<template>
  <div v-loading.fullscreen.lock="loading" element-loading-text="正在登录..." class="wrap">
    <el-form ref="form" :model="formModel" :rules="rules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formModel.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="formModel.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import baseServer, { baseApi } from '@/server/base/base.js'

export default {
  name: 'user.login',
  data () {
    return {
      loading: false,
      formModel: {
        username: 'litao01',
        password: 'litao01'
      },
      rules: {
        username: {
          required: true,
          type: 'string',
          max: 20
        },
        password: {
          required: true,
          type: 'string',
          min: 6,
          max: 99
        }
      }
    }
  },
  methods: {
    handleLogin () {
      this.$refs.form.validate(async validateResult => {
        if (validateResult) {
          this.loading = true
          const res = await baseServer(baseApi.apiLogin, this.formModel)
          this.loading = false

          if (res.code) { // 登录失败
            return
          }

          this.$store.commit('common/changeUserInfo', res.userInfo)

          const redirectPath = this.$route.query.redirect || '/'

          this.$router.replace(redirectPath)
        }
      })
    }
  }
}
</script>

<style>
</style>
