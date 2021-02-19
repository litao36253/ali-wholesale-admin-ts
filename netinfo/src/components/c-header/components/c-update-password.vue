<template lang="pug">
  njs-dialog(:title="$t('修改用户密码')" :visible.sync="editItemVisible" width="600px" @close="editPaw.formData = {USER_NEW_PASS: '', USER_PASS: ''}")
    njs-form(:model="editPaw.formData" ref="updatePass" service="P0405305" size="middle" :rules="perfile" :show-submit="false" :show-reset="false" @before-submit="passFrom" v-if="editItemVisible")
      njs-form-item(:label="$t('新密码:')" prop="USER_NEW_PASS")
        njs-input(v-model="editPaw.formData.USER_NEW_PASS" type="password" autocomplete="off" clearable)
      njs-form-item(:label="$t('确认密码:')" prop="USER_PASS")
        njs-input(v-model="editPaw.formData.USER_PASS" type="password" autocomplete="off" clearable)
    template(slot="footer")
      njs-button(type="primary" @click="savePassword") {{ $t('保 存') }}
      njs-button(@click="editItemVisible = false") {{ $t('关 闭') }}
</template>

<script>
import encrypt from '@/utils/encrypt'
export default {
  name: 'c-update-password',
  props: {
    visible: Boolean
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请输入密码')))
      } else {
        let reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&_])[A-Za-z\d@$!%*#?&]{8,32}$/
        if (this.editPaw.formData.USER_PASS !== '') {
          this.$refs.updatePass.validateField('USER_PASS')
        }
        if (!reg.test(value)) {
          callback(new Error(this.$t('必须包含大小写，数字，特殊字符，长度至少8位,最多32位!')))
        } else {
          callback()
        }
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('请再次输入密码')))
      } else if (value !== this.editPaw.formData.USER_NEW_PASS) {
        callback(new Error(this.$t('两次输入密码不一致!')))
      } else {
        callback()
      }
    }
    return {
      editPaw: {
        formData: {
          USER_NEW_PASS: '', // 新的用户密码
          USER_PASS: '' // 确认用户密码
        }
      },
      perfile: {// 修改用户密码的验证
        USER_NEW_PASS: [
          { required: true, validator: validatePass, trigger: ['blur', 'change'] }
        ],
        USER_PASS: [
          { required: true, validator: validatePass2, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    passFrom (req, callback) {
      let pass = this.editPaw.formData.USER_PASS + ''
      let code = this.$store.getters.g_user.USER_CODE + ''
      let encryptPass = encrypt(pass, code)
      req[0].USER_CODE = code
      req[0].USER_PASS = encryptPass
      callback(req)
    },
    savePassword () {
      this.$refs.updatePass.submit().then((result) => {
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('用户 ') + this.$store.getters.g_user.USER_NAME + this.$t(' 密码修改成功,请重新登录！')
          })
          this.editItemVisible = false
          this.$nextTick(() => {
            this.exit()
          })
        }
      })
    },
    exit () {
      this.$request({
        apiType: 'UCC',
        url: '/njdf_logout'
      }).then((result) => {
        if (result.code === '0') {
          this.$router.replace({
            name: 'login',
            query: {
              redirect: window.app.$route.fullPath
            }
          })
        }
      })
    }
  },
  computed: {
    editItemVisible: {
      get () {
        return this.visible
      },
      set (val) {
        this.$emit('update:visible', val)
      }
    }
  }
}
</script>

<style scoped>

</style>
