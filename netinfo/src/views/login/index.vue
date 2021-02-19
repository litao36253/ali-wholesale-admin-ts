<template lang="pug">
.page-login(v-loading="loading" :element-loading-text="$t('正在登录，请稍候。。。')" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.6)")
  .header
    .logo-img
      img(:src="`${publicPath}res/logo.png`")
    .soft-name {{ $t('UCC客服系统') }}
    //- 切换语言
    .system-language
      njs-dropdown(@command="changeLanguage")
        .el-dropdown-link.popover-parent
          i.iconfont.icon-language
        njs-dropdown-menu(slot="dropdown")
          template(languageConfig.package && v-for="item in languageConfig.package")
            njs-dropdown-item(:command="item", :disabled="language === item") {{languageConfig.alias[item]}}
  .main
    .container
      .banner
        img(:src="`${publicPath}res/login.png`")
      .form-login
        h2 {{ $t('系统登录') }}
        njs-form(:model="user", status-icon, :rules="rules", ref="loginForm")
          njs-form-item(prop="username")
            njs-input(class="login", v-model="user.username", :placeholder="$t('账号')", autocomeplete="off" @keydown.native.13="login")
          njs-form-item(prop="password")
            njs-input(class="login", type="password", v-model="user.password", :placeholder="$t('密码')", autocomeplete="off" @keydown.native.13="login")
          njs-form-item
            njs-button(class="login-submit", type="primary", @click="login") {{ $t('登录') }}
  .footer
    | &copy; {{ $t('深圳星网信通科技有限公司') }}
  UpdatePassword(:visible.sync="editPawVisible")
  njs-dialog(:title="tipsTitle" :visible.sync="tipsVisible")
    p {{tips()}}
    template(slot="footer")
      njs-button(type="primary" @click="toEditPwd") {{ $t('去修改密码') }}
      njs-button(@click="continueLogin") {{ $t('继续登陆') }}
</template>

<script>
import MxLanguage from '@/mixins/language'
import { mapState } from 'vuex'
import rules from './formRules'
import storage from '@/commons/storage'
import { language } from '@/conf/'
import http from '@/commons/http'
import Cookies from 'js-cookie'
import encrypt from '@/utils/encrypt'
import makeXmlRequestStr from './makeXmlRequestStr'
import ajaxLogin from './ajaxLogin'
import UpdatePassword from '@/components/c-header/components/c-update-password'
// import { A_COMMON_LOGIN } from '@/stores/common/types'

export default {
  name: 'login',
  mixins: [MxLanguage],
  components: {
    UpdatePassword
  },
  computed: mapState({
    userBaseInfo: state => state.common.userBaseInfo
  }),
  data () {
    return {
      publicPath: process.env.BASE_URL,
      documentTitle: this.$t('登陆'),
      user: {
        username: '',
        password: ''
      },
      rules,
      kencKey: '', // 动态密钥
      kencPassword: '', // 加密后的密码
      loading: false,
      editPawVisible: false, // 强制修改密码弹窗是否可见
      tipsVisible: false,
      updateTime: '', // 距强制修改密码时间
      tipsTitle: '提示'

    }
  },
  created () {
    setTimeout(() => {
      this.logo = 'login.png'
    }, 1000)
  },
  methods: {
    // 登陆
    async login () {
      this.$refs['loginForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          Cookies.set('account', this.user.username, { expires: 720 })
          storage.xAuthToken = false
          // 查询当前用户的角色信息和身份信息
          this.$request({
            apiType: 'UCC',
            method: 'get',
            url: `/njdf_http?returnType=url&service=U0201401&encoderType=none&loginType=local&IDF_CODE=${this.user.username}`
          })
            .then(async response => {
              if (response.code === '0') {
                // 获取帐号信息成功
                let userList = response.data
                let isMulti = this.$store.getters.getSysParam('IS_MULTI_ACCOUNT_ROLE') // 是否支持外部系统帐号或分机号登录 1：支持  其它：不支持
                if (isMulti === '1') {
                  if (userList.length === 1) {
                    this.loginRequest(userList[0])
                  } else if (userList.length === 0) {
                    this.$message.error(this.$t('你输入的帐号或密码不正确'))
                    this.loading = false
                  } else {
                    this.loading = false
                  }
                } else {
                  let user = userList.filter(item => {
                    return item['USER_IDF_TYPE'] === '14' // 用员工编号登录
                  })
                  if (user.length) {
                    this.loginRequest(user[0])
                  } else {
                    this.loading = false
                    this.$message.error(this.$t('你输入的帐号或密码不正确'))
                  }
                }
              } else {
                this.loading = false
              }
            })
            .catch(error => {
              this.loading = false
              console.error(error)
            })
        }
      })

      /* this.$store.dispatch(A_COMMON_LOGIN, {
        data: {},
        cbSuccess: function () {},
        cbFail: function () {}
      }) */
    },
    redirect () {
      let redirect = this.$route.query.redirect
      if (redirect) {
        this.$router.push(redirect)
      } else {
        this.$router.push('/dashboard')
      }
    },
    async loginRequest (user) {
      let isMulti = this.$store.getters.getSysParam('IS_MULTI_ACCOUNT_ROLE') // 是否支持外部系统帐号或分机号登录 1：支持  其它：不支持
      // 支持是否支持外部系统帐号或分机号登录、员工账号登录时,获取到员工编号加密
      if (isMulti === '1') {
        this.user.username = user.USER_CODE
      }
      this.$store.commit('M_USER_INFO', 'clear')
      this.kencKey = await http({
        apiType: 'UCC',
        method: 'get',
        url: `/njdf_encrypkey`
      })['data']
      this.kencPassword = encrypt(this.user.password, this.user.username)
      let params = {
        USER_CODE: this.user.username,
        TRD_PWD: this.kencPassword,
        VALIDATECODE: '', // 验证码！！！！！！！！！！！！！！！
        OP_LANGUAGE: storage.lang || language.default
      }
      let requestXmlStr = encrypt(makeXmlRequestStr([params]), this.kencKey)
      let loginResult
      try {
        loginResult = await ajaxLogin({
          method: 'post',
          url: '/njdf_login?encoderType=des',
          data: requestXmlStr
        })
      } catch (e) {
        console.error(e)
        this.loading = false
        return
      }
      // 判断是否登录成功
      if (loginResult['IRETCODE'] === '0') {
        for (let lkey in loginResult) {
          this.$store.commit('M_USER_INFO', { key: lkey, val: loginResult[lkey] })
        }
        this.$store.commit('M_BOM_HISTORY_CLEAR')
        storage.xAuthToken = true
        this.$store.dispatch('A_COMMON_MENU', { // 获取系统菜单
          successCb: () => {
            if (this.$store.getters.getSysParam('IS_UPDATE_PSW') === '1' || this.$store.getters.getSysParam('UPDATE_PSW_TIME') !== '0') {
              this.$ajaxRequest([{
                service: 'U0201403',
                USER_CODE: this.user.username
              }]).then((result) => {
                if (result.data[0].OPEN_DIALOG_FLAG === '4') {
                  this.loading = false
                  this.editPawVisible = true
                  this.$message.error(this.$t('你的密码为初始密码请修改密码后重新登录！'))
                } else if (result.data[0].OPEN_DIALOG_FLAG === '1') {
                  this.loading = false
                  this.editPawVisible = true
                  this.$message.error(this.$t('密码使用时间过长,请修改密码！'))
                } else if (result.data[0].OPEN_DIALOG_FLAG === '2') {
                  this.loading = false
                  this.updateTime = this.$store.getters.getSysParams('UPDATE_PSW_TIME') - result.data[0].UPDATE_PSW_DAY_NUM
                  this.tipsVisible = true
                } else if (result.data[0].OPEN_DIALOG_FLAG === '3') {
                  this.redirect()
                }
              }).catch((err) => {
                console.log(err)
              })
            } else {
              this.redirect()
            }
          }
        })
      } else if (loginResult['FAILCODE'] === '-99') {
        this.$message.error(loginResult['IRETINFO'])
        this.loading = false
      } else {
        this.$message.error(this.$t('你输入的帐号或密码错误！'))
        this.loading = false
      }
    },
    tips () {
      return this.$t('距离下次强制修改密码还有') + this.updateTime + this.$t('天')
    },
    toEditPwd () {
      this.tipsVisible = false
      this.editPawVisible = true
    },
    continueLogin () {
      this.tipsVisible = false
      this.redirect()
    }
  }
}
</script>

<style lang="stylus">
@import './index.styl'
</style>
